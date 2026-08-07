import {
  ConflictException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ProjectRole } from '@prisma/client';
import {
  extractDomain,
  extractSubdomain,
  normalizeUrl,
} from '../../common/utils/domain.util';
import { generateSlug } from '../../common/utils/slug.util';
import { PrismaService } from '../../database/prisma.service';
import { AuditService } from '../audit/audit.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectService {
  private readonly logger = new Logger(ProjectService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  async createProject(
    organizationId: string,
    userId: string,
    dto: CreateProjectDto,
    ipAddress?: string,
    userAgent?: string,
  ) {
    const normalizedUrl = normalizeUrl(dto.primaryUrl);
    const domain = extractDomain(normalizedUrl);
    const subdomain = extractSubdomain(normalizedUrl);

    // Check if domain is already registered as a primary domain
    const existingDomain = await this.prisma.project.findUnique({
      where: { primaryDomain: domain },
    });

    if (existingDomain) {
      throw new ConflictException(
        `Primary domain '${domain}' is already registered to another project.`,
      );
    }

    let slug = generateSlug(dto.name);
    const existingSlug = await this.prisma.project.findUnique({
      where: { slug },
    });

    if (existingSlug) {
      slug = `${slug}-${Date.now().toString(36)}`;
    }

    const project = await this.prisma.$transaction(async (tx) => {
      // 1. Create Project
      const newProject = await tx.project.create({
        data: {
          organizationId,
          name: dto.name,
          slug,
          description: dto.description || null,
          industry: dto.industry || null,
          businessSize: dto.businessSize || null,
          country: dto.country || null,
          timezone: dto.timezone || 'UTC',
          logo: dto.logo || null,
          favicon: dto.favicon || null,
          primaryDomain: domain,
          visibility: dto.visibility || 'TEAM',
          createdBy: userId,
        },
      });

      // 2. Create Primary Website
      await tx.website.create({
        data: {
          projectId: newProject.id,
          url: normalizedUrl,
          domain,
          subdomain,
          isPrimary: true,
        },
      });

      // 3. Create Default Project Settings
      await tx.projectSettings.create({
        data: {
          projectId: newProject.id,
          language: 'en',
          scanFrequency: 'WEEKLY',
          notificationPreferences: { email: true, inApp: true },
          aiProvidersEnabled: {
            openai: true,
            anthropic: true,
            google: true,
            perplexity: true,
          },
          defaultReportSettings: { format: 'pdf', includeGraphs: true },
        },
      });

      // 4. Assign creator as OWNER
      await tx.projectMember.create({
        data: {
          projectId: newProject.id,
          userId,
          role: ProjectRole.OWNER,
        },
      });

      return newProject;
    });

    await this.auditService.logAction({
      userId,
      organizationId,
      action: 'PROJECT_CREATE',
      ipAddress,
      userAgent,
      metadata: { projectId: project.id, name: project.name, domain },
    });

    return this.getProjectById(project.id, organizationId);
  }

  async getOrganizationProjects(organizationId: string) {
    return this.prisma.project.findMany({
      where: {
        organizationId,
        deletedAt: null,
      },
      include: {
        websites: {
          where: { deletedAt: null },
          select: {
            id: true,
            url: true,
            domain: true,
            subdomain: true,
            isPrimary: true,
            verificationStatus: true,
          },
        },
        _count: {
          select: { members: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getProjectById(projectId: string, organizationId: string) {
    const project = await this.prisma.project.findFirst({
      where: {
        id: projectId,
        organizationId,
        deletedAt: null,
      },
      include: {
        websites: {
          where: { deletedAt: null },
          orderBy: { isPrimary: 'desc' },
        },
        settings: true,
        members: {
          select: {
            id: true,
            role: true,
            user: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                avatarUrl: true,
              },
            },
          },
        },
        tags: true,
      },
    });

    if (!project) {
      throw new NotFoundException('Project not found or accessible.');
    }

    return project;
  }

  async updateProject(
    projectId: string,
    organizationId: string,
    userId: string,
    dto: UpdateProjectDto,
    ipAddress?: string,
    userAgent?: string,
  ) {
    const project = await this.getProjectById(projectId, organizationId);

    const updated = await this.prisma.project.update({
      where: { id: project.id },
      data: {
        ...(dto.name !== undefined && { name: dto.name }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.industry !== undefined && { industry: dto.industry }),
        ...(dto.businessSize !== undefined && { businessSize: dto.businessSize }),
        ...(dto.country !== undefined && { country: dto.country }),
        ...(dto.timezone !== undefined && { timezone: dto.timezone }),
        ...(dto.logo !== undefined && { logo: dto.logo }),
        ...(dto.favicon !== undefined && { favicon: dto.favicon }),
        ...(dto.status !== undefined && { status: dto.status }),
        ...(dto.visibility !== undefined && { visibility: dto.visibility }),
        updatedBy: userId,
      },
    });

    await this.auditService.logAction({
      userId,
      organizationId,
      action: 'PROJECT_UPDATE',
      ipAddress,
      userAgent,
      metadata: { projectId, changes: dto },
    });

    return updated;
  }

  async deleteProject(
    projectId: string,
    organizationId: string,
    userId: string,
    ipAddress?: string,
    userAgent?: string,
  ) {
    const project = await this.getProjectById(projectId, organizationId);

    await this.prisma.project.update({
      where: { id: project.id },
      data: { deletedAt: new Date(), updatedBy: userId },
    });

    await this.auditService.logAction({
      userId,
      organizationId,
      action: 'PROJECT_DELETE',
      ipAddress,
      userAgent,
      metadata: { projectId, name: project.name },
    });

    return { message: 'Project soft-deleted successfully.' };
  }
}
