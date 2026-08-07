import { Injectable, Logger } from '@nestjs/common';
import { CampaignFrequency, CampaignStatus } from '@prisma/client';
import { PrismaService } from '../../../database/prisma.service';
import { AuditService } from '../../audit/audit.service';
import { FeatureFlagService } from '../../feature-flag/feature-flag.service';

export interface CreateCampaignInput {
  organizationId: string;
  name: string;
  frequency?: CampaignFrequency;
  keywords?: string[];
}

@Injectable()
export class KeywordCampaignService {
  private readonly logger = new Logger(KeywordCampaignService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
    private readonly featureFlagService: FeatureFlagService,
  ) {}

  async createCampaign(input: CreateCampaignInput) {
    const isEnabled = await this.featureFlagService.evaluate('ff-ai-campaigns');
    if (isEnabled === false) {
      this.logger.warn(`AI Campaigns feature flag disabled.`);
    }

    const campaign = await this.prisma.keywordCampaign.create({
      data: {
        organizationId: input.organizationId,
        name: input.name,
        frequency: input.frequency || CampaignFrequency.DAILY,
        status: CampaignStatus.SCHEDULED,
        keywordCount: input.keywords ? input.keywords.length : 5,
      },
    });

    await this.auditService.logAction({
      organizationId: input.organizationId,
      action: 'KEYWORD_CAMPAIGN_CREATED',
      metadata: { campaignId: campaign.id, name: campaign.name },
    });

    return campaign;
  }

  async getCampaigns(organizationId?: string) {
    return this.prisma.keywordCampaign.findMany({
      where: organizationId ? { organizationId } : undefined,
      include: { runs: true },
      take: 50,
    });
  }

  async getCampaignById(id: string) {
    return this.prisma.keywordCampaign.findUnique({
      where: { id },
      include: { runs: true, results: true },
    });
  }

  async runCampaign(id: string) {
    const campaign = await this.prisma.keywordCampaign.findUnique({
      where: { id },
    });

    if (!campaign) return null;

    const run = await this.prisma.keywordCampaignRun.create({
      data: {
        campaignId: id,
        status: CampaignStatus.COMPLETED,
      },
    });

    // Record mock results
    await this.prisma.keywordCampaignResult.create({
      data: {
        campaignId: id,
        keywordText: 'best ai search platform',
        visibilityScore: 92.5,
        citationsCount: 4,
      },
    });

    await this.prisma.keywordCampaign.update({
      where: { id },
      data: { status: CampaignStatus.COMPLETED },
    });

    return { run, status: 'COMPLETED' };
  }

  async getCampaignResults(id: string) {
    return this.prisma.keywordCampaignResult.findMany({
      where: { campaignId: id },
    });
  }
}
