import { Injectable, Logger, NotFoundException } from '@nestjs/common';
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

  async createCompetitor(input: CreateCompetitorInput) {
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

  async getCompetitors(organizationId?: string) {
    return this.prisma.competitor.findMany({
      where: organizationId ? { organizationId, status: CompetitorStatus.ACTIVE } : { status: CompetitorStatus.ACTIVE },
      include: { group: true, visibilities: { take: 1, orderBy: { recordedAt: 'desc' } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getCompetitorById(id: string) {
    const competitor = await this.prisma.competitor.findUnique({
      where: { id },
      include: { group: true, visibilities: true, citations: true, insights: true, trends: true },
    });

    if (!competitor) {
      throw new NotFoundException(`Competitor [${id}] not found.`);
    }

    return competitor;
  }

  async updateCompetitor(id: string, input: UpdateCompetitorInput) {
    await this.getCompetitorById(id);

    const updated = await this.prisma.competitor.update({
      where: { id },
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

  async deleteCompetitor(id: string) {
    await this.getCompetitorById(id);

    await this.prisma.competitor.delete({
      where: { id },
    });

    await this.auditService.logAction({
      action: 'COMPETITOR_DELETED',
      metadata: { competitorId: id },
    });

    return { success: true, id };
  }
}
