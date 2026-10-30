import { ForbiddenException, Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CompetitorStatus, CompetitorType } from '@prisma/client';
import { PrismaService } from '../../../database/prisma.service';
import { AuditService } from '../../audit/audit.service';
import { FeatureFlagService } from '../../feature-flag/feature-flag.service';

export interface CreateCompetitorInput {
  organizationId: string;
  name: string;
  domain: string;
  groupId?: string;
  type?: CompetitorType;
  industry?: string;
  region?: string;
}

export interface UpdateCompetitorInput {
  name?: string;
  domain?: string;
  groupId?: string;
  type?: CompetitorType;
  status?: CompetitorStatus;
  industry?: string;
  region?: string;
}

@Injectable()
export class CompetitorManagementService {
  private readonly logger = new Logger(CompetitorManagementService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
    private readonly featureFlagService: FeatureFlagService,
  ) {}

  private async verifyOrganizationMember(userId: string, organizationId: string) {
    if (!userId) {
      throw new UnauthorizedException('Authentication required.');
    }
    const membership = await this.prisma.organizationMember.findUnique({
      where: {
        organizationId_userId: {
          organizationId,
          userId,
        },
      },
    });
    if (!membership) {
      throw new ForbiddenException('Access denied: You are not a member of this organization.');
    }
  }

  async createCompetitor(userId: string, input: CreateCompetitorInput) {
    await this.verifyOrganizationMember(userId, input.organizationId);

    const isEnabled = await this.featureFlagService.evaluate('competitor-intelligence');
    if (isEnabled === false) {
      this.logger.warn(`Competitor Intelligence Engine disabled by Feature Flag.`);
    }

    const competitor = await this.prisma.competitor.create({
      data: {
        organizationId: input.organizationId,
        name: input.name,
        domain: input.domain.toLowerCase().replace(/^www\./, ''),
        groupId: input.groupId,
        type: input.type || CompetitorType.PRIMARY,
        status: CompetitorStatus.ACTIVE,
        industry: input.industry || 'Technology',
        region: input.region || 'Global',
      },
      include: { group: true, organization: true },
    });

    await this.auditService.logAction({
      action: 'COMPETITOR_CREATED',
      metadata: { competitorId: competitor.id, domain: competitor.domain },
    });

    return competitor;
  }

  async getCompetitors(userId: string, organizationId?: string) {
    if (organizationId && organizationId !== 'org-default') {
      await this.verifyOrganizationMember(userId, organizationId);
      return this.prisma.competitor.findMany({
        where: { organizationId, status: CompetitorStatus.ACTIVE },
        include: { group: true, visibilities: { take: 1, orderBy: { recordedAt: 'desc' } } },
        orderBy: { createdAt: 'desc' },
      });
    }

    // Find all organizations user is member of
    const memberships = await this.prisma.organizationMember.findMany({
      where: { userId },
      select: { organizationId: true },
    });
    const userOrgIds = memberships.map((m) => m.organizationId);

    return this.prisma.competitor.findMany({
      where: { organizationId: { in: userOrgIds }, status: CompetitorStatus.ACTIVE },
      include: { group: true, visibilities: { take: 1, orderBy: { recordedAt: 'desc' } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getCompetitorById(id: string, userId: string) {
    const competitor = await this.prisma.competitor.findUnique({
      where: { id },
      include: { group: true, visibilities: true, citations: true, insights: true, trends: true },
    });

    if (!competitor) {
      throw new NotFoundException(`Competitor [${id}] not found.`);
    }

    await this.verifyOrganizationMember(userId, competitor.organizationId);
    return competitor;
  }

  async updateCompetitor(id: string, userId: string, input: UpdateCompetitorInput) {
    const competitor = await this.getCompetitorById(id, userId);

    const updated = await this.prisma.competitor.update({
      where: { id: competitor.id },
      data: {
        name: input.name,
        domain: input.domain ? input.domain.toLowerCase().replace(/^www\./, '') : undefined,
        groupId: input.groupId,
        type: input.type,
        status: input.status,
        industry: input.industry,
        region: input.region,
      },
    });

    await this.auditService.logAction({
      action: 'COMPETITOR_UPDATED',
      metadata: { competitorId: id },
    });

    return updated;
  }

  async deleteCompetitor(id: string, userId: string) {
    const competitor = await this.getCompetitorById(id, userId);

    await this.prisma.competitor.delete({
      where: { id: competitor.id },
    });

    await this.auditService.logAction({
      action: 'COMPETITOR_DELETED',
      metadata: { competitorId: id },
    });

    return { success: true, id };
  }
}
