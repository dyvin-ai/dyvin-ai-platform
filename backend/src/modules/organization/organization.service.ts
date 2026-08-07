import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InvitationStatus, Role } from '@prisma/client';
import {
  generateRandomToken,
  hashToken,
} from '../../common/utils/password.util';
import { generateSlug } from '../../common/utils/slug.util';
import { PrismaService } from '../../database/prisma.service';
import { AuditService } from '../audit/audit.service';
import { AcceptInvitationDto } from './dto/accept-invitation.dto';
import { CreateInvitationDto } from './dto/create-invitation.dto';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';

@Injectable()
export class OrganizationService {
  private readonly logger = new Logger(OrganizationService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  async createOrganization(
    userId: string,
    dto: CreateOrganizationDto,
    ipAddress?: string,
    userAgent?: string,
  ) {
    let slug = generateSlug(dto.name);
    const existingSlug = await this.prisma.organization.findUnique({
      where: { slug },
    });

    if (existingSlug) {
      slug = `${slug}-${generateRandomToken(3)}`;
    }

    const organization = await this.prisma.$transaction(async (tx) => {
      const newOrg = await tx.organization.create({
        data: {
          name: dto.name,
          slug,
          logoUrl: dto.logoUrl || null,
        },
      });

      await tx.organizationMember.create({
        data: {
          organizationId: newOrg.id,
          userId,
          role: Role.OWNER,
        },
      });

      return newOrg;
    });

    await this.auditService.logAction({
      userId,
      organizationId: organization.id,
      action: 'ORGANIZATION_CREATE',
      ipAddress,
      userAgent,
      metadata: { name: organization.name, slug: organization.slug },
    });

    return organization;
  }

  async getUserOrganizations(userId: string) {
    const memberships = await this.prisma.organizationMember.findMany({
      where: {
        userId,
        organization: {
          deletedAt: null,
        },
      },
      select: {
        role: true,
        createdAt: true,
        organization: {
          select: {
            id: true,
            name: true,
            slug: true,
            logoUrl: true,
            createdAt: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return memberships.map((m) => ({
      ...m.organization,
      role: m.role,
      joinedAt: m.createdAt,
    }));
  }

  async getOrganizationDetails(orgId: string, userId: string) {
    const membership = await this.prisma.organizationMember.findUnique({
      where: {
        organizationId_userId: {
          organizationId: orgId,
          userId,
        },
      },
    });

    if (!membership) {
      throw new ForbiddenException(
        'Access denied: You are not a member of this organization.',
      );
    }

    const org = await this.prisma.organization.findUnique({
      where: { id: orgId },
      include: {
        members: {
          select: {
            id: true,
            role: true,
            createdAt: true,
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
      },
    });

    if (!org || org.deletedAt) {
      throw new NotFoundException('Organization not found.');
    }

    return org;
  }

  async updateOrganization(orgId: string, dto: UpdateOrganizationDto) {
    const org = await this.prisma.organization.findUnique({
      where: { id: orgId },
    });

    if (!org || org.deletedAt) {
      throw new NotFoundException('Organization not found.');
    }

    return this.prisma.organization.update({
      where: { id: orgId },
      data: {
        ...(dto.name !== undefined && { name: dto.name }),
        ...(dto.logoUrl !== undefined && { logoUrl: dto.logoUrl }),
      },
    });
  }

  async createInvitation(
    orgId: string,
    invitedById: string,
    dto: CreateInvitationDto,
  ) {
    const normalizedEmail = dto.email.toLowerCase().trim();

    // Check if user is already a member
    const existingMember = await this.prisma.organizationMember.findFirst({
      where: {
        organizationId: orgId,
        user: { email: normalizedEmail },
      },
    });

    if (existingMember) {
      throw new ConflictException(
        'User is already a member of this organization.',
      );
    }

    const rawToken = generateRandomToken();
    const tokenHash = hashToken(rawToken);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    const invitation = await this.prisma.invitation.create({
      data: {
        organizationId: orgId,
        email: normalizedEmail,
        role: dto.role,
        tokenHash,
        expiresAt,
        invitedById,
      },
      select: {
        id: true,
        email: true,
        role: true,
        expiresAt: true,
        createdAt: true,
      },
    });

    return {
      invitation,
      invitationToken: rawToken,
    };
  }

  async acceptInvitation(
    userId: string,
    dto: AcceptInvitationDto,
    ipAddress?: string,
    userAgent?: string,
  ) {
    const tokenHash = hashToken(dto.token);

    const invitation = await this.prisma.invitation.findUnique({
      where: { tokenHash },
      include: { organization: true },
    });

    if (
      !invitation ||
      invitation.status !== InvitationStatus.PENDING ||
      new Date() > invitation.expiresAt
    ) {
      throw new BadRequestException('Invalid or expired invitation token.');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || user.deletedAt) {
      throw new NotFoundException('User not found.');
    }

    // Verify invitation email matches accepting user's email
    if (invitation.email.toLowerCase() !== user.email.toLowerCase()) {
      throw new ForbiddenException(
        'This invitation was sent to a different email address.',
      );
    }

    await this.prisma.$transaction([
      this.prisma.organizationMember.create({
        data: {
          organizationId: invitation.organizationId,
          userId,
          role: invitation.role,
        },
      }),
      this.prisma.invitation.update({
        where: { id: invitation.id },
        data: { status: InvitationStatus.ACCEPTED },
      }),
    ]);

    await this.auditService.logAction({
      userId,
      organizationId: invitation.organizationId,
      action: 'INVITATION_ACCEPT',
      ipAddress,
      userAgent,
      metadata: { role: invitation.role, email: invitation.email },
    });

    return {
      message: 'Invitation accepted successfully.',
      organization: invitation.organization,
    };
  }
}
