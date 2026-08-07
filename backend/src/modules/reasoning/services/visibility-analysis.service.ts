import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ScoreCategory } from '@prisma/client';
import { Queue } from 'bullmq';
import { PrismaService } from '../../../database/prisma.service';
import { AuditService } from '../../audit/audit.service';

import { REASONING_QUEUES } from '../reasoning.constants';
import { AuthorityEngineService } from './authority-engine.service';
import { BrandConsistencyService } from './brand-consistency.service';
import { EntityCoverageService } from './entity-coverage.service';
import { KnowledgeGapEngineService } from './knowledge-gap-engine.service';
import { ReasoningEngineService } from './reasoning-engine.service';
import { ScoringEngineService } from './scoring-engine.service';

export interface AnalyzeJobData {
  analysisId: string;
  projectId: string;
  scanId: string;
}

@Injectable()
export class VisibilityAnalysisService {
  private readonly logger = new Logger(VisibilityAnalysisService.name);

  constructor(
    @InjectQueue(REASONING_QUEUES.VISIBILITY_ANALYSIS)
    private readonly analysisQueue: Queue<AnalyzeJobData>,
    private readonly prisma: PrismaService,
    private readonly scoringEngine: ScoringEngineService,
    private readonly knowledgeGapEngine: KnowledgeGapEngineService,
    private readonly entityCoverageService: EntityCoverageService,
    private readonly brandConsistencyService: BrandConsistencyService,
    private readonly authorityEngine: AuthorityEngineService,
    private readonly reasoningEngine: ReasoningEngineService,
    private readonly auditService: AuditService,
  ) {}

  async initiateProjectAnalysis(projectId: string, userId?: string) {
    const latestScan = await this.prisma.scan.findFirst({
      where: { projectId, status: 'COMPLETED', deletedAt: null },
      orderBy: { createdAt: 'desc' },
    });

    if (!latestScan) {
      throw new NotFoundException('No completed website scan found for this project. Initiate a scan first.');
    }

    const analysis = await this.prisma.visibilityAnalysis.create({
      data: {
        projectId,
        scanId: latestScan.id,
        status: 'QUEUED',
      },
    });

    await this.analysisQueue.add(
      'run-visibility-analysis',
      { analysisId: analysis.id, projectId, scanId: latestScan.id },
      { attempts: 2, backoff: { type: 'exponential', delay: 1000 } },
    );

    await this.auditService.logAction({
      userId,
      action: 'ANALYSIS_STARTED',
      metadata: { analysisId: analysis.id, projectId, scanId: latestScan.id },
    });

    return analysis;
  }

  async runAnalysisPipeline(analysisId: string, projectId: string, scanId: string): Promise<void> {
    this.logger.log(`Starting analysis pipeline for analysis [${analysisId}]`);

    await this.prisma.visibilityAnalysis.update({
      where: { id: analysisId },
      data: { status: 'RUNNING', startedAt: new Date() },
    });

    const project = await this.prisma.project.findUnique({ where: { id: projectId } });
    const scan = await this.prisma.scan.findUnique({
      where: { id: scanId },
      include: {
        pages: {
          include: {
            structuredData: true,
            securityFindings: true,
          },
        },
      },
    });

    const graph = await this.prisma.knowledgeGraph.findFirst({
      where: { projectId },
      include: { entities: true, facts: true, products: true, services: true, faqs: true },
    });

    const pagesCount = scan?.pages.length || 0;
    const hasSchema = (scan?.pages.some((p) => p.structuredData.length > 0) || false);
    const hasHttps = (scan?.pages.some((p) => p.securityFindings.some((s) => s.hasHttps)) || false);
    const securityScore = scan?.pages[0]?.securityFindings[0]?.score || 100;
    const entityCount = graph?.entities.length || 0;
    const factCount = graph?.facts.length || 0;
    const hasProducts = (graph?.products.length || 0) > 0;
    const hasServices = (graph?.services.length || 0) > 0;
    const hasFaqs = (graph?.faqs.length || 0) > 0;

    const dataBundle = {
      scanPagesCount: pagesCount,
      hasSchema,
      hasHttps,
      securityScore,
      entityCount,
      factCount,
      hasProducts,
      hasServices,
      hasFaqs,
    };

    // 1. Calculate Scores
    const { overallScore, categoryScores } = this.scoringEngine.calculateScores(dataBundle);

    // 2. Detect Knowledge Gaps
    const gaps = this.knowledgeGapEngine.detectGaps(dataBundle);

    // 3. Entity Coverage
    const entityCoverages = this.entityCoverageService.calculateCoverage(graph?.entities || []);

    // 4. Authority Signals
    const authorityEval = this.authorityEngine.evaluateAuthority(hasHttps, securityScore, hasSchema);

    // 5. Store Scores
    await this.prisma.visibilityScore.createMany({
      data: Object.entries(categoryScores).map(([cat, val]) => ({
        analysisId,
        category: cat as ScoreCategory,
        score: val,
      })),
    });

    // 6. Store Gaps
    if (gaps.length > 0) {
      await this.prisma.knowledgeGap.createMany({
        data: gaps.map((g) => ({
          analysisId,
          gapType: g.gapType,
          title: g.title,
          description: g.description,
          severity: g.severity,
        })),
      });
    }

    // 7. Store Entity Coverage
    await this.prisma.entityCoverage.createMany({
      data: entityCoverages.map((ec) => ({
        analysisId,
        entityType: ec.entityType,
        totalExpected: ec.totalExpected,
        totalFound: ec.totalFound,
        coveragePercentage: ec.coveragePercentage,
      })),
    });

    // 8. Store Authority Signals
    if (authorityEval.signals.length > 0) {
      await this.prisma.authoritySignal.createMany({
        data: authorityEval.signals.map((s) => ({
          analysisId,
          signalType: s.signalType,
          strength: s.strength,
          description: s.description,
        })),
      });
    }

    // 9. Generate AI Reasoning Session & Steps
    const session = await this.prisma.reasoningSession.create({
      data: {
        analysisId,
        providerCode: 'MOCK',
        modelCode: 'mock-v1',
      },
    });

    for (const [cat, val] of Object.entries(categoryScores)) {
      const category = cat as ScoreCategory;
      const reasoning = await this.reasoningEngine.generateReasoningForScore(
        category,
        val,
        { project: project?.name, overallScore, categoryScore: val },
      );

      const step = await this.prisma.reasoningStep.create({
        data: {
          sessionId: session.id,
          category,
          explanation: reasoning.explanation,
          confidence: reasoning.confidence,
          impact: reasoning.impact,
          priority: reasoning.priority,
        },
      });

      if (reasoning.evidence.length > 0) {
        await this.prisma.reasoningEvidence.createMany({
          data: reasoning.evidence.map((e) => ({
            stepId: step.id,
            evidenceText: e.evidenceText,
            sourceUrl: e.sourceUrl || null,
          })),
        });
      }
    }

    // Update Analysis Complete
    await this.prisma.visibilityAnalysis.update({
      where: { id: analysisId },
      data: {
        status: 'COMPLETED',
        overallScore,
        completedAt: new Date(),
      },
    });

    await this.auditService.logAction({
      action: 'ANALYSIS_COMPLETED',
      metadata: { analysisId, projectId, overallScore },
    });

    this.logger.log(`Analysis pipeline finished for analysis [${analysisId}] with score [${overallScore}]`);
  }

  async getProjectAnalyses(projectId: string) {
    return this.prisma.visibilityAnalysis.findMany({
      where: { projectId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getAnalysisDetails(analysisId: string) {
    const analysis = await this.prisma.visibilityAnalysis.findUnique({
      where: { id: analysisId },
      include: {
        project: { select: { id: true, name: true } },
        scan: { select: { id: true, createdAt: true } },
      },
    });

    if (!analysis) {
      throw new NotFoundException('Analysis not found.');
    }

    return analysis;
  }

  async getAnalysisScores(analysisId: string) {
    await this.getAnalysisDetails(analysisId);
    return this.prisma.visibilityScore.findMany({
      where: { analysisId },
      orderBy: { score: 'desc' },
    });
  }

  async getAnalysisReasoning(analysisId: string) {
    await this.getAnalysisDetails(analysisId);
    return this.prisma.reasoningSession.findMany({
      where: { analysisId },
      include: {
        steps: {
          include: {
            evidences: true,
          },
        },
      },
    });
  }

  async getAnalysisGaps(analysisId: string) {
    await this.getAnalysisDetails(analysisId);
    return this.prisma.knowledgeGap.findMany({
      where: { analysisId },
      orderBy: { severity: 'desc' },
    });
  }
}
