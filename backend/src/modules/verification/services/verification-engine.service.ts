import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { RecommendationStatus, VerificationStatus } from '@prisma/client';
import { Queue } from 'bullmq';
import { PrismaService } from '../../../database/prisma.service';
import { AuditService } from '../../audit/audit.service';

import { VERIFICATION_QUEUES } from '../verification.constants';
import { VerificationDiffEngineService } from './verification-diff-engine.service';
import { VerificationMetricsService } from './verification-metrics.service';

export interface VerifyJobData {
  verificationId: string;
  recommendationId: string;
}

@Injectable()
export class VerificationEngineService {
  private readonly logger = new Logger(VerificationEngineService.name);

  constructor(
    @InjectQueue(VERIFICATION_QUEUES.ENGINE)
    private readonly verificationQueue: Queue<VerifyJobData>,
    private readonly prisma: PrismaService,
    private readonly diffEngine: VerificationDiffEngineService,
    private readonly metricsService: VerificationMetricsService,
    private readonly auditService: AuditService,
  ) {}

  async initiateRecommendationVerification(recommendationId: string, userId?: string) {
    const rec = await this.prisma.recommendation.findUnique({
      where: { id: recommendationId },
      include: { analysis: true },
    });

    if (!rec) {
      throw new NotFoundException('Recommendation not found.');
    }

    const verification = await this.prisma.verification.create({
      data: {
        projectId: rec.analysis.projectId,
        recommendationId,
        status: VerificationStatus.PENDING,
      },
    });

    await this.verificationQueue.add(
      'run-verification',
      { verificationId: verification.id, recommendationId },
      { attempts: 2, backoff: { type: 'exponential', delay: 1000 } },
    );

    await this.auditService.logAction({
      userId,
      action: 'VERIFICATION_STARTED',
      metadata: { verificationId: verification.id, recommendationId },
    });

    return verification;
  }

  async processVerificationRun(verificationId: string, recommendationId: string): Promise<void> {
    this.logger.log(`Processing verification run [${verificationId}] for recommendation [${recommendationId}]`);

    await this.prisma.verification.update({
      where: { id: verificationId },
      data: { status: VerificationStatus.PENDING, startedAt: new Date() },
    });

    const rec = await this.prisma.recommendation.findUnique({
      where: { id: recommendationId },
      include: { analysis: true },
    });

    if (!rec) return;

    const projectId = rec.analysis.projectId;
    const analyses = await this.prisma.visibilityAnalysis.findMany({
      where: { projectId, status: 'COMPLETED' },
      include: { scores: true },
      orderBy: { createdAt: 'desc' },
      take: 2,
    });

    if (analyses.length < 1) {
      await this.prisma.verification.update({
        where: { id: verificationId },
        data: { status: VerificationStatus.FAILED, completedAt: new Date() },
      });
      return;
    }

    const currentAnalysis = analyses[0];
    const previousAnalysis = analyses[1] || currentAnalysis;

    // Run Diff Engine
    const diffs = this.diffEngine.compareScores(previousAnalysis.scores, currentAnalysis.scores);
    const overallDiff = diffs.find((d) => d.category === 'OVERALL')?.delta || 0;

    let finalStatus: VerificationStatus = VerificationStatus.VERIFIED;
    let recStatus: RecommendationStatus = RecommendationStatus.COMPLETED;

    if (overallDiff > 0) {
      finalStatus = VerificationStatus.VERIFIED;
      recStatus = RecommendationStatus.COMPLETED;
    } else if (overallDiff < 0) {
      finalStatus = VerificationStatus.REGRESSED;
      recStatus = RecommendationStatus.ACCEPTED;
    } else {
      finalStatus = VerificationStatus.FAILED;
      recStatus = RecommendationStatus.ACCEPTED;
    }

    // Save Verification Run
    const run = await this.prisma.verificationRun.create({
      data: {
        verificationId,
        previousScanId: previousAnalysis.scanId,
        currentScanId: currentAnalysis.scanId,
        previousAnalysisId: previousAnalysis.id,
        currentAnalysisId: currentAnalysis.id,
      },
    });

    // Save Results & Metrics
    for (const diff of diffs) {
      const result = await this.prisma.verificationResult.create({
        data: {
          runId: run.id,
          category: diff.category,
          outcome: diff.outcome,
          previousScore: diff.previousScore,
          currentScore: diff.currentScore,
          delta: diff.delta,
          percentageChange: diff.percentageChange,
        },
      });

      const metric = this.metricsService.evaluateMetric(
        `${diff.category}_SCORE`,
        String(diff.previousScore),
        String(diff.currentScore),
      );

      await this.prisma.verificationMetric.create({
        data: {
          resultId: result.id,
          metricName: metric.metricName,
          previousValue: metric.previousValue,
          currentValue: metric.currentValue,
          delta: metric.delta,
          confidence: metric.confidence,
        },
      });

      await this.prisma.verificationEvidence.create({
        data: {
          resultId: result.id,
          evidenceText: `Category [${diff.category}] score moved from ${diff.previousScore} to ${diff.currentScore} (Delta: ${diff.delta > 0 ? '+' : ''}${diff.delta}).`,
          previousValue: String(diff.previousScore),
          currentValue: String(diff.currentScore),
          reason: `Measured via Verification Run [${run.id}]`,
        },
      });

      // Save Improvement History
      if (diff.delta !== 0) {
        await this.prisma.improvementHistory.create({
          data: {
            projectId,
            analysisId: currentAnalysis.id,
            category: diff.category,
            scoreDelta: diff.delta,
          },
        });
      }
    }

    // Link Recommendation Verification
    await this.prisma.recommendationVerification.create({
      data: {
        recommendationId,
        verificationId,
        isVerified: finalStatus === VerificationStatus.VERIFIED,
        verifiedAt: new Date(),
      },
    });

    // Update Recommendation & Verification Status
    await this.prisma.recommendation.update({
      where: { id: recommendationId },
      data: { status: recStatus },
    });

    await this.prisma.verification.update({
      where: { id: verificationId },
      data: {
        status: finalStatus,
        scoreDelta: overallDiff,
        completedAt: new Date(),
      },
    });

    await this.auditService.logAction({
      action: 'VERIFICATION_COMPLETED',
      metadata: { verificationId, recommendationId, overallDiff, finalStatus },
    });

    if (finalStatus === VerificationStatus.VERIFIED) {
      await this.auditService.logAction({
        action: 'RECOMMENDATION_VERIFIED',
        metadata: { recommendationId, scoreDelta: overallDiff },
      });
    }

    this.logger.log(`Verification run completed for [${verificationId}] with status [${finalStatus}] and delta [${overallDiff}]`);
  }

  async getVerifications(projectId?: string) {
    return this.prisma.verification.findMany({
      where: projectId ? { projectId } : {},
      include: {
        recommendation: { select: { id: true, title: true, category: true } },
        runs: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getVerificationDetails(verificationId: string) {
    const v = await this.prisma.verification.findUnique({
      where: { id: verificationId },
      include: {
        project: { select: { id: true, name: true } },
        recommendation: { select: { id: true, title: true, priority: true } },
        runs: {
          include: {
            results: true,
          },
        },
      },
    });

    if (!v) {
      throw new NotFoundException('Verification record not found.');
    }

    return v;
  }

  async getVerificationMetrics(verificationId: string) {
    await this.getVerificationDetails(verificationId);
    return this.prisma.verificationMetric.findMany({
      where: { result: { run: { verificationId } } },
    });
  }

  async getVerificationEvidence(verificationId: string) {
    await this.getVerificationDetails(verificationId);
    return this.prisma.verificationEvidence.findMany({
      where: { result: { run: { verificationId } } },
    });
  }
}
