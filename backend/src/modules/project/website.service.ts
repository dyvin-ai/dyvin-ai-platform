import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import {
  extractDomain,
  extractSubdomain,
  normalizeUrl,
} from '../../common/utils/domain.util';
import { PrismaService } from '../../database/prisma.service';
import { AuditService } from '../audit/audit.service';
import { CreateWebsiteDto } from './dto/create-website.dto';
import { UpdateWebsiteDto } from './dto/update-website.dto';

@Injectable()
export class WebsiteService {
  private readonly logger = new Logger(WebsiteService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  async addWebsite(
    projectId: string,
    dto: CreateWebsiteDto,
    userId: string,
    organizationId: string,
    ipAddress?: string,
    userAgent?: string,
  ) {
    const normalizedUrl = normalizeUrl(dto.url);
    const domain = extractDomain(normalizedUrl);
    const subdomain = extractSubdomain(normalizedUrl);

    // Check duplicate in same project
    const existing = await this.prisma.website.findFirst({
      where: {
        projectId,
        url: normalizedUrl,
        deletedAt: null,
      },
    });

    if (existing) {
      throw new ConflictException(
        `Website URL '${normalizedUrl}' already exists in this project.`,
      );
    }

    if (dto.isPrimary) {
      // Reset existing primary websites in this project
      await this.prisma.website.updateMany({
        where: { projectId, isPrimary: true },
        data: { isPrimary: false },
      });
    }

    const website = await this.prisma.website.create({
      data: {
        projectId,
        url: normalizedUrl,
        domain,
        subdomain,
        isPrimary: dto.isPrimary || false,
      },
    });

    await this.auditService.logAction({
      userId,
      organizationId,
      action: 'WEBSITE_ADD',
      ipAddress,
      userAgent,
      metadata: { projectId, websiteId: website.id, url: website.url },
    });

    return website;
  }

  async getProjectWebsites(projectId: string) {
    return this.prisma.website.findMany({
      where: { projectId, deletedAt: null },
      orderBy: { isPrimary: 'desc' },
    });
  }

  async updateWebsite(
    websiteId: string,
    dto: UpdateWebsiteDto,
    userId: string,
    organizationId: string,
    ipAddress?: string,
    userAgent?: string,
  ) {
    const website = await this.prisma.website.findFirst({
      where: { id: websiteId, deletedAt: null },
      include: { project: true },
    });

    if (!website) {
      throw new NotFoundException('Website not found.');
    }

    let normalizedUrl = website.url;
    let domain = website.domain;
    let subdomain = website.subdomain;

    if (dto.url) {
      normalizedUrl = normalizeUrl(dto.url);
      domain = extractDomain(normalizedUrl);
      subdomain = extractSubdomain(normalizedUrl);
    }

    if (dto.isPrimary) {
      await this.prisma.website.updateMany({
        where: { projectId: website.projectId, isPrimary: true },
        data: { isPrimary: false },
      });
    }

    const updated = await this.prisma.website.update({
      where: { id: websiteId },
      data: {
        ...(dto.url !== undefined && { url: normalizedUrl, domain, subdomain }),
        ...(dto.isPrimary !== undefined && { isPrimary: dto.isPrimary }),
      },
    });

    await this.auditService.logAction({
      userId,
      organizationId,
      action: 'WEBSITE_UPDATE',
      ipAddress,
      userAgent,
      metadata: { websiteId, projectId: website.projectId, changes: dto },
    });

    return updated;
  }

  async deleteWebsite(
    websiteId: string,
    userId: string,
    organizationId: string,
    ipAddress?: string,
    userAgent?: string,
  ) {
    const website = await this.prisma.website.findFirst({
      where: { id: websiteId, deletedAt: null },
    });

    if (!website) {
      throw new NotFoundException('Website not found.');
    }

    await this.prisma.website.update({
      where: { id: websiteId },
      data: { deletedAt: new Date() },
    });

    await this.auditService.logAction({
      userId,
      organizationId,
      action: 'WEBSITE_REMOVE',
      ipAddress,
      userAgent,
      metadata: { websiteId, projectId: website.projectId, url: website.url },
    });

    return { message: 'Website soft-deleted successfully.' };
  }
}
