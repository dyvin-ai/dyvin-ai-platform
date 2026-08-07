import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { RecommendationType } from '@prisma/client';
import { Queue } from 'bullmq';
import { PrismaService } from '../../../database/prisma.service';
import { AuditService } from '../../audit/audit.service';

import { RECOMMENDATION_QUEUES } from '../recommendation.constants';
import { DependencyEngineService } from './dependency-engine.service';
import { DraftRecommendation, DuplicateEngineService } from './duplicate-engine.service';
import { ImpactEngineService } from './impact-engine.service';
import { PriorityEngineService } from './priority-engine.service';

export interface GenerateRecommendationsJobData {
  analysisId: string;
}

@Injectable()
export class RecommendationEngineService {
  private readonly logger = new Logger(RecommendationEngineService.name);

  constructor(
    @InjectQueue(RECOMMENDATION_QUEUES.ENGINE)
    private readonly recommendationQueue: Queue<GenerateRecommendationsJobData>,
    private readonly prisma: PrismaService,
    private readonly priorityEngine: PriorityEngineService,
    private readonly impactEngine: ImpactEngineService,
    private readonly dependencyEngine: DependencyEngineService,
    private readonly duplicateEngine: DuplicateEngineService,
    private readonly auditService: AuditService,
  ) {}

  async initiateRecommendationGeneration(analysisId: string, userId?: string) {
    const analysis = await this.prisma.visibilityAnalysis.findUnique({
      where: { id: analysisId },
    });

    if (!analysis) {
      throw new NotFoundException('Visibility analysis run not found.');
    }

    await this.recommendationQueue.add(
      'generate-recommendations',
      { analysisId },
      { attempts: 2, backoff: { type: 'exponential', delay: 1000 } },
    );

    return { message: 'Recommendation generation enqueued successfully.', analysisId };
  }

  async processGenerateRecommendations(analysisId: string): Promise<void> {
    this.logger.log(`Generating recommendations for analysis [${analysisId}]`);

    const analysis = await this.prisma.visibilityAnalysis.findUnique({
      where: { id: analysisId },
      include: {
        gaps: true,
        scores: true,
        sessions: {
          include: {
            steps: {
              include: { evidences: true },
            },
          },
        },
      },
    });

    if (!analysis) return;

    const drafts: DraftRecommendation[] = [];

    // Map Knowledge Gaps to Draft Recommendations
    analysis.gaps.forEach((gap) => {
      let category: RecommendationType = RecommendationType.TECHNICAL;
      if (gap.gapType === 'MISSING_SCHEMA') category = RecommendationType.SCHEMA;
      if (gap.gapType === 'MISSING_PRODUCTS') category = RecommendationType.PRODUCT;
      if (gap.gapType === 'MISSING_SERVICES') category = RecommendationType.SERVICE;
      if (gap.gapType === 'MISSING_FAQS') category = RecommendationType.DOCUMENTATION;
      if (gap.gapType === 'MISSING_TRUST_SIGNALS') category = RecommendationType.TRUST;

      drafts.push({
        category,
        title: `Fix: ${gap.title}`,
        summary: gap.description,
        problem: `Detected gap in AI visibility: ${gap.title}`,
        whyItMatters: 'AI answer engines rely on complete entity and schema coverage to cite businesses accurately.',
        impactScore: gap.severity === 'CRITICAL' ? 90 : gap.severity === 'HIGH' ? 75 : 50,
      });
    });

    // Deduplicate
    const uniqueDrafts = this.duplicateEngine.deduplicate(drafts);

    // Save Recommendations to DB
    const createdRecs = [];
    for (const draft of uniqueDrafts) {
      const priority = this.priorityEngine.calculatePriority('HIGH', draft.impactScore);
      const impactCalc = this.impactEngine.calculateImpact(draft.category, draft.impactScore);

      const rec = await this.prisma.recommendation.create({
        data: {
          analysisId,
          category: draft.category,
          title: draft.title,
          summary: draft.summary,
          problem: draft.problem,
          whyItMatters: draft.whyItMatters,
          priority,
          impactScore: draft.impactScore,
          difficulty: 'MEDIUM',
          estimatedTimeMinutes: 30,
          confidence: 95,
          businessImpact: 'Improves AI engine citation probability and brand trust.',
          technicalImpact: 'Fulfills machine-readable structured data standards.',
          visibilityImpact: `Estimated visibility score gain +${impactCalc.expectedScoreGain} points.`,
        },
      });

      // Save Evidence
      await this.prisma.recommendationEvidence.create({
        data: {
          recommendationId: rec.id,
          evidenceText: `Derived from Visibility Analysis [${analysisId}] gap findings.`,
        },
      });

      // Save Impact Metrics
      await this.prisma.recommendationImpact.create({
        data: {
          recommendationId: rec.id,
          visibilityIncrease: impactCalc.visibilityIncrease,
          knowledgeIncrease: impactCalc.knowledgeIncrease,
          trustIncrease: impactCalc.trustIncrease,
          authorityIncrease: impactCalc.authorityIncrease,
          expectedScoreGain: impactCalc.expectedScoreGain,
        },
      });

      createdRecs.push(rec);
    }

    // Build Dependencies
    const depNodes = createdRecs.map((r) => ({ id: r.id, category: r.category, title: r.title }));
    const dependencies = this.dependencyEngine.buildDependencies(depNodes);

    if (dependencies.length > 0) {
      await this.prisma.recommendationDependency.createMany({
        data: dependencies.map((d) => ({
          recommendationId: d.recommendationId,
          dependsOnRecommendationId: d.dependsOnId,
        })),
      });
    }

    await this.auditService.logAction({
      action: 'RECOMMENDATIONS_GENERATED',
      metadata: { analysisId, count: createdRecs.length },
    });

    this.logger.log(`Successfully generated ${createdRecs.length} recommendations for analysis [${analysisId}]`);
  }

  async getRecommendations(analysisId?: string) {
    return this.prisma.recommendation.findMany({
      where: analysisId ? { analysisId } : {},
      include: {
        evidences: true,
        impacts: true,
        dependencies: true,
      },
      orderBy: { impactScore: 'desc' },
    });
  }

  async getRecommendationDetails(recommendationId: string) {
    const rec = await this.prisma.recommendation.findUnique({
      where: { id: recommendationId },
      include: {
        evidences: true,
        impacts: true,
        dependencies: {
          include: {
            dependsOn: { select: { id: true, title: true, priority: true } },
          },
        },
        dependents: {
          include: {
            recommendation: { select: { id: true, title: true, priority: true } },
          },
        },
      },
    });

    if (!rec) {
      throw new NotFoundException('Recommendation not found.');
    }

    return rec;
  }

  async getRecommendationEvidence(recommendationId: string) {
    await this.getRecommendationDetails(recommendationId);
    return this.prisma.recommendationEvidence.findMany({
      where: { recommendationId },
    });
  }

  async getRecommendationDependencies(recommendationId: string) {
    await this.getRecommendationDetails(recommendationId);
    return this.prisma.recommendationDependency.findMany({
      where: { recommendationId },
      include: {
        dependsOn: { select: { id: true, title: true, priority: true, category: true } },
      },
    });
  }
}
