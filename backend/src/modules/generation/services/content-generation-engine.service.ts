import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { GeneratedContentStatus } from '@prisma/client';
import { Queue } from 'bullmq';
import { PrismaService } from '../../../database/prisma.service';
import { AuditService } from '../../audit/audit.service';

import { GENERATION_QUEUES } from '../generation.constants';
import { ApprovalWorkflowService } from './approval-workflow.service';
import { ContentExporterService } from './content-exporter.service';
import { ContentGeneratorService } from './content-generator.service';

export interface GenerateContentJobData {
  contentId: string;
  recommendationId: string;
}

@Injectable()
export class ContentGenerationEngineService {
  private readonly logger = new Logger(ContentGenerationEngineService.name);

  constructor(
    @InjectQueue(GENERATION_QUEUES.CONTENT_GENERATION)
    private readonly generationQueue: Queue<GenerateContentJobData>,
    private readonly prisma: PrismaService,
    private readonly contentGenerator: ContentGeneratorService,
    private readonly approvalWorkflow: ApprovalWorkflowService,
    private readonly contentExporter: ContentExporterService,
    private readonly auditService: AuditService,
  ) {}

  async initiateContentGeneration(recommendationId: string, userId?: string) {
    const rec = await this.prisma.recommendation.findUnique({
      where: { id: recommendationId },
      include: { analysis: true },
    });

    if (!rec) {
      throw new NotFoundException('Recommendation not found.');
    }

    const content = await this.prisma.generatedContent.create({
      data: {
        projectId: rec.analysis.projectId,
        recommendationId,
        contentType: String(rec.category),
        title: `Auto-Fix Asset: ${rec.title}`,
        summary: `AI Generated implementation asset to resolve recommendation: ${rec.summary}`,
        status: GeneratedContentStatus.DRAFT,
        confidenceScore: 95,
      },
    });

    await this.generationQueue.add(
      'generate-asset',
      { contentId: content.id, recommendationId },
      { attempts: 2, backoff: { type: 'exponential', delay: 1000 } },
    );

    await this.auditService.logAction({
      userId,
      action: 'GENERATION_STARTED',
      metadata: { contentId: content.id, recommendationId },
    });

    return content;
  }

  async processGenerationRun(contentId: string, recommendationId: string): Promise<void> {
    this.logger.log(`Processing AI content generation for [${contentId}] (rec: ${recommendationId})`);

    const rec = await this.prisma.recommendation.findUnique({
      where: { id: recommendationId },
    });

    if (!rec) return;

    // Generate Assets based on recommendation category
    const schemaAsset = await this.contentGenerator.generateSchemaAsset(rec.title, String(rec.category));
    const seoAsset = await this.contentGenerator.generateSeoAsset(rec.title);
    const faqAsset = await this.contentGenerator.generateFaqAsset(rec.title);

    // Save Assets to DB
    await this.prisma.generatedAsset.createMany({
      data: [
        { contentId, assetType: schemaAsset.assetType, codeContent: schemaAsset.codeContent, exportFormat: schemaAsset.exportFormat },
        { contentId, assetType: seoAsset.assetType, codeContent: seoAsset.codeContent, exportFormat: seoAsset.exportFormat },
        { contentId, assetType: faqAsset.assetType, codeContent: faqAsset.codeContent, exportFormat: faqAsset.exportFormat },
      ],
    });

    // Save Version 1
    await this.prisma.generationVersion.create({
      data: {
        contentId,
        versionNumber: 1,
        contentBody: {
          schema: schemaAsset.codeContent,
          seo: seoAsset.codeContent,
          faq: faqAsset.codeContent,
        },
      },
    });

    // Save Generation Session
    await this.prisma.generationSession.create({
      data: {
        contentId,
        providerCode: 'MOCK',
        modelCode: 'mock-v1',
        promptTokens: 450,
        completionTokens: 850,
      },
    });

    // Move to PREVIEW status for human review
    await this.prisma.generatedContent.update({
      where: { id: contentId },
      data: { status: GeneratedContentStatus.PREVIEW },
    });

    await this.auditService.logAction({
      action: 'GENERATION_COMPLETED',
      metadata: { contentId, recommendationId, status: GeneratedContentStatus.PREVIEW },
    });

    this.logger.log(`AI content generation completed for [${contentId}]. Moved to PREVIEW for review.`);
  }

  async getGeneratedContents(projectId?: string) {
    return this.prisma.generatedContent.findMany({
      where: projectId ? { projectId } : {},
      include: {
        recommendation: { select: { id: true, title: true, priority: true } },
        assets: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getGeneratedContentDetails(contentId: string) {
    const content = await this.prisma.generatedContent.findUnique({
      where: { id: contentId },
      include: {
        project: { select: { id: true, name: true } },
        recommendation: { select: { id: true, title: true, category: true, priority: true } },
        assets: true,
        versions: { orderBy: { versionNumber: 'desc' } },
        approvalRequests: { include: { histories: true } },
      },
    });

    if (!content) {
      throw new NotFoundException('Generated content record not found.');
    }

    return content;
  }

  async getGeneratedContentVersions(contentId: string) {
    await this.getGeneratedContentDetails(contentId);
    return this.prisma.generationVersion.findMany({
      where: { contentId },
      orderBy: { versionNumber: 'desc' },
    });
  }
}
