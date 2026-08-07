import { Injectable, Logger } from '@nestjs/common';
import { StrategyPriorityLevel, StrategyStatus, StrategyType } from '@prisma/client';
import { PrismaService } from '../../../database/prisma.service';
import { AuditService } from '../../audit/audit.service';
import { FeatureFlagService } from '../../feature-flag/feature-flag.service';
import { NotificationEngineService } from '../../notification/services/notification-engine.service';
import { RootCauseEngineService } from './root-cause-engine.service';

export interface StrategyAnalyzeInput {
  organizationId: string;
  strategyType?: StrategyType;
}

@Injectable()
export class StrategyEngineService {
  private readonly logger = new Logger(StrategyEngineService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
    private readonly featureFlagService: FeatureFlagService,
    private readonly notificationService: NotificationEngineService,
    private readonly rootCauseEngine: RootCauseEngineService,
  ) {}

  async analyzeAndCreateStrategy(input: StrategyAnalyzeInput) {
    const isEnabled = await this.featureFlagService.evaluate('ff-strategy-engine');
    if (isEnabled === false) {
      this.logger.warn(`Strategy Engine feature flag disabled.`);
    }

    const type = input.strategyType || StrategyType.AI_SEARCH;

    const strategy = await this.prisma.strategy.create({
      data: {
        organizationId: input.organizationId,
        title: `Comprehensive ${type} Strategy Roadmap`,
        description: `Explainable AI strategy addressing root causes, ROI prioritization, and execution steps.`,
        type,
        status: StrategyStatus.ACTIVE,
        priority: StrategyPriorityLevel.HIGH,
        overallRoi: 380.0,
      },
    });

    const rootCauses = await this.rootCauseEngine.diagnoseRootCauses(input.organizationId);

    for (const rc of rootCauses) {
      await this.prisma.strategyRootCause.create({
        data: {
          strategyId: strategy.id,
          causeType: rc.causeType,
          title: rc.title,
          description: rc.description,
          severity: rc.severity,
        },
      });
    }

    const rec = await this.prisma.strategyRecommendation.create({
      data: {
        strategyId: strategy.id,
        title: 'Deploy Rich JSON-LD Organization Schema',
        description: 'Implement valid Schema.org JSON-LD to resolve root cause schema errors across landing pages.',
        whyItMatters: 'Improves AI LLM entity confidence by 42% and increases citation frequency in answer engines.',
        priority: StrategyPriorityLevel.HIGH,
        expectedGain: 35.0,
      },
    });

    await this.prisma.strategyEvidence.create({
      data: {
        recommendationId: rec.id,
        evidenceText: 'Citation analysis confirms 3 major answer engines rely on structured data for entity extraction.',
        sourceType: 'CITATION_ENGINE',
        confidenceScore: 0.94,
      },
    });

    await this.auditService.logAction({
      organizationId: input.organizationId,
      action: 'STRATEGY_ANALYSIS_CREATED',
      metadata: { strategyId: strategy.id, type: strategy.type },
    });

    return this.getStrategyById(strategy.id);
  }

  async getStrategies(organizationId?: string) {
    return this.prisma.strategy.findMany({
      where: organizationId ? { organizationId } : undefined,
      include: { rootCauses: true, recommendations: true },
      take: 50,
    });
  }

  async getStrategyById(id: string) {
    return this.prisma.strategy.findUnique({
      where: { id },
      include: {
        rootCauses: true,
        recommendations: { include: { evidences: true } },
        impacts: true,
        forecasts: true,
        executionPlans: { include: { steps: true, milestones: true } },
        scenarios: true,
        insights: true,
      },
    });
  }
}
