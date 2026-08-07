import { Injectable, Logger } from '@nestjs/common';
import { VisibilityCategory, VisibilityStatus } from '@prisma/client';
import { PrismaService } from '../../../database/prisma.service';
import { AuditService } from '../../audit/audit.service';
import { FeatureFlagService } from '../../feature-flag/feature-flag.service';

export interface ScoreWeights {
  citation: number;
  promptCoverage: number;
  authority: number;
  sourceDiversity: number;
  freshness: number;
  frequency: number;
  competitor: number;
  knowledgeCoverage: number;
  brandConsistency: number;
  technicalTrust: number;
  schemaCoverage: number;
}

export const DEFAULT_WEIGHTS: ScoreWeights = {
  citation: 0.15,
  promptCoverage: 0.15,
  authority: 0.12,
  sourceDiversity: 0.10,
  freshness: 0.08,
  frequency: 0.08,
  competitor: 0.10,
  knowledgeCoverage: 0.08,
  brandConsistency: 0.05,
  technicalTrust: 0.05,
  schemaCoverage: 0.04,
};

@Injectable()
export class VisibilityScoreService {
  private readonly logger = new Logger(VisibilityScoreService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
    private readonly featureFlagService: FeatureFlagService,
  ) {}

  async calculateScore(organizationId: string, customWeights?: Partial<ScoreWeights>) {
    const isEnabled = await this.featureFlagService.evaluate('visibility-analytics');
    if (isEnabled === false) {
      this.logger.warn(`AI Visibility Analytics Engine disabled by Feature Flag.`);
    }

    const weights = { ...DEFAULT_WEIGHTS, ...customWeights };

    // Raw dimension scores (0-100)
    const categoryScores: Record<VisibilityCategory, number> = {
      [VisibilityCategory.OVERALL]: 0,
      [VisibilityCategory.CITATION]: 85,
      [VisibilityCategory.PROMPT_COVERAGE]: 78,
      [VisibilityCategory.AUTHORITY]: 82,
      [VisibilityCategory.SOURCE_DIVERSITY]: 75,
      [VisibilityCategory.FRESHNESS]: 90,
      [VisibilityCategory.FREQUENCY]: 88,
      [VisibilityCategory.COMPETITOR]: 70,
      [VisibilityCategory.KNOWLEDGE_COVERAGE]: 80,
      [VisibilityCategory.BRAND_CONSISTENCY]: 85,
      [VisibilityCategory.TECHNICAL_TRUST]: 92,
      [VisibilityCategory.SCHEMA_COVERAGE]: 86,
    };

    let weightedSum = 0;
    weightedSum += categoryScores[VisibilityCategory.CITATION] * weights.citation;
    weightedSum += categoryScores[VisibilityCategory.PROMPT_COVERAGE] * weights.promptCoverage;
    weightedSum += categoryScores[VisibilityCategory.AUTHORITY] * weights.authority;
    weightedSum += categoryScores[VisibilityCategory.SOURCE_DIVERSITY] * weights.sourceDiversity;
    weightedSum += categoryScores[VisibilityCategory.FRESHNESS] * weights.freshness;
    weightedSum += categoryScores[VisibilityCategory.FREQUENCY] * weights.frequency;
    weightedSum += categoryScores[VisibilityCategory.COMPETITOR] * weights.competitor;
    weightedSum += categoryScores[VisibilityCategory.KNOWLEDGE_COVERAGE] * weights.knowledgeCoverage;
    weightedSum += categoryScores[VisibilityCategory.BRAND_CONSISTENCY] * weights.brandConsistency;
    weightedSum += categoryScores[VisibilityCategory.TECHNICAL_TRUST] * weights.technicalTrust;
    weightedSum += categoryScores[VisibilityCategory.SCHEMA_COVERAGE] * weights.schemaCoverage;

    const overallScore = parseFloat(weightedSum.toFixed(2));
    categoryScores[VisibilityCategory.OVERALL] = overallScore;

    let status: VisibilityStatus = VisibilityStatus.HEALTHY;
    if (overallScore < 50) status = VisibilityStatus.CRITICAL;
    else if (overallScore < 70) status = VisibilityStatus.WARNING;

    // Upsert Profile
    const profile = await this.prisma.aIVisibilityProfile.upsert({
      where: { id: organizationId }, // reuse org ID as profile ID if needed
      update: { overallScore, status },
      create: {
        id: organizationId,
        organizationId,
        overallScore,
        status,
      },
    });

    // Create Snapshot
    const snapshot = await this.prisma.aIVisibilitySnapshot.create({
      data: {
        profileId: profile.id,
        overallScore,
        categoryScores,
      },
    });

    await this.auditService.logAction({
      organizationId,
      action: 'VISIBILITY_SCORE_CALCULATED',
      metadata: { profileId: profile.id, overallScore, status },
    });

    return {
      profileId: profile.id,
      overallScore,
      status,
      categoryScores,
      snapshotId: snapshot.id,
    };
  }
}
