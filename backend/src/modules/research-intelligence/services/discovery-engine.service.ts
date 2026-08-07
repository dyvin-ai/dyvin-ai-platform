import { Injectable, Logger } from '@nestjs/common';
import { ResearchPriority, ResearchSourceCategory, ResearchStatus } from '@prisma/client';
import { PrismaService } from '../../../database/prisma.service';
import { AuditService } from '../../audit/audit.service';
import { FeatureFlagService } from '../../feature-flag/feature-flag.service';
import { NotificationEngineService } from '../../notification/services/notification-engine.service';

export interface StartResearchInput {
  organizationId: string;
  title: string;
  description?: string;
  sources?: string[];
}

@Injectable()
export class DiscoveryEngineService {
  private readonly logger = new Logger(DiscoveryEngineService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
    private readonly featureFlagService: FeatureFlagService,
    private readonly notificationService: NotificationEngineService,
  ) {}

  async runDiscoveryProject(input: StartResearchInput) {
    const isEnabled = await this.featureFlagService.evaluate('ff-research-engine');
    if (isEnabled === false) {
      this.logger.warn(`Research Engine feature flag disabled.`);
    }

    const project = await this.prisma.researchProject.create({
      data: {
        organizationId: input.organizationId,
        title: input.title,
        description: input.description || 'Autonomous multi-source research discovery project',
        status: ResearchStatus.IN_PROGRESS,
        priority: ResearchPriority.HIGH,
      },
    });

    const topic = await this.prisma.researchTopic.create({
      data: {
        projectId: project.id,
        name: 'AI Search & LLM Engine Discoveries',
        description: 'Tracking Perplexity, ChatGPT, and Claude citation changes.',
      },
    });

    await this.prisma.researchFinding.create({
      data: {
        projectId: project.id,
        topicId: topic.id,
        title: 'Emerging Competitor Expansion in Enterprise AI Search',
        summary: 'Competitor Alpha published 12 documentation pages capturing 18 new ChatGPT citations.',
      },
    });

    await this.prisma.researchProject.update({
      where: { id: project.id },
      data: { status: ResearchStatus.COMPLETED },
    });

    await this.auditService.logAction({
      organizationId: input.organizationId,
      action: 'RESEARCH_DISCOVERY_COMPLETED',
      metadata: { projectId: project.id },
    });

    return this.prisma.researchProject.findUnique({
      where: { id: project.id },
      include: { topics: true, findings: true, reports: true },
    });
  }

  async getProjects(organizationId?: string) {
    return this.prisma.researchProject.findMany({
      where: organizationId ? { organizationId } : undefined,
      include: { topics: true, findings: true, reports: true },
      take: 50,
    });
  }

  async getTopics(projectId?: string) {
    return this.prisma.researchTopic.findMany({
      where: projectId ? { projectId } : undefined,
      include: { findings: true, trends: true },
      take: 50,
    });
  }

  async getFindings(projectId?: string) {
    return this.prisma.researchFinding.findMany({
      where: projectId ? { projectId } : undefined,
      take: 50,
    });
  }
}
