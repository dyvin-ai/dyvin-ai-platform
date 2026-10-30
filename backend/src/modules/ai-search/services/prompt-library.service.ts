import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { AIProviderCode, AISearchStatus, ExecutionStatus, ExecutionTrigger, PromptStatus, PromptType } from '@prisma/client';
import { PrismaService } from '../../../database/prisma.service';
import { AuditService } from '../../audit/audit.service';

export interface CreatePromptDto {
  aiSearchProjectId: string;
  groupId?: string;
  promptText: string;
  type?: PromptType;
  tags?: any;
}

export interface UpdatePromptDto {
  promptText?: string;
  status?: PromptStatus;
  groupId?: string;
  tags?: any;
}

@Injectable()
export class PromptLibraryService {
  private readonly logger = new Logger(PromptLibraryService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  async createPrompt(dto: CreatePromptDto, userId?: string) {
    const prompt = await this.prisma.aISearchPrompt.create({
      data: {
        aiSearchProjectId: dto.aiSearchProjectId,
        groupId: dto.groupId,
        ownerId: userId,
        promptText: dto.promptText,
        type: dto.type || PromptType.MANUAL,
        status: PromptStatus.ACTIVE,
        tags: dto.tags || {},
        version: 1,
      },
      include: { group: true, owner: true },
    });

    await this.auditService.logAction({
      userId,
      action: 'PROMPT_CREATED',
      metadata: { promptId: prompt.id, aiSearchProjectId: dto.aiSearchProjectId },
    });

    return prompt;
  }

  async getPrompts(aiSearchProjectId?: string, organizationId?: string, userId?: string, projectId?: string) {
    let projectIdToQuery = aiSearchProjectId;

    if (!projectIdToQuery) {
      let targetOrgId = organizationId;
      if (!targetOrgId) {
        const firstOrg = await this.prisma.organization.findFirst();
        if (firstOrg) targetOrgId = firstOrg.id;
      }

      if (targetOrgId) {
        let project = null;
        if (projectId) {
          project = await this.prisma.aISearchProject.findFirst({
            where: { projectId, organizationId: targetOrgId },
            include: { prompts: true },
          });
        }
        if (!project) {
          project = await this.prisma.aISearchProject.findFirst({
            where: { organizationId: targetOrgId },
            include: { prompts: true },
            orderBy: { createdAt: 'desc' },
          });
        }

        if (!project) {
          let parentProj = await this.prisma.project.findFirst({ where: { organizationId: targetOrgId } });
          if (!parentProj) {
            parentProj = await this.prisma.project.create({
              data: {
                organizationId: targetOrgId,
                name: 'Dyvin Visibility Engine',
                slug: `dyvin-engine-${Date.now()}`,
                primaryDomain: `dyvin-${Date.now()}.ai`,
                createdBy: userId || 'system',
              },
            });
          }

          project = await this.prisma.aISearchProject.create({
            data: {
              organizationId: targetOrgId,
              projectId: parentProj.id,
              name: 'Core AI Search Project',
              status: AISearchStatus.COMPLETED,
            },
            include: { prompts: true },
          });
        }

        if (project && project.prompts.length === 0) {
          const defaultPrompts = [
            {
              promptText: 'Best AI search visibility platform for enterprise teams',
              type: PromptType.KEYWORD,
              tags: { category: 'Commercial', priority: 'P0', visibility: 88.4, position: 1.2, change: 4.2, sentiment: 'positive', mentioned: true, cluster: 'Enterprise AI Visibility' },
              answer: 'Dyvin AI and Atlas AI are leading enterprise AI search visibility platforms, with Dyvin AI offering real-time generative engine intelligence and prompt-level citations.',
            },
            {
              promptText: 'How to track brand share of voice across ChatGPT and Claude',
              type: PromptType.GENERATED,
              tags: { category: 'Informational', priority: 'P1', visibility: 76.2, position: 2.1, change: 1.8, sentiment: 'positive', mentioned: true, cluster: 'AI Search Analytics' },
              answer: 'Tracking share of voice across LLM answer engines requires monitoring citation presence and mention frequencies on ChatGPT, Claude, and Gemini with automated prompt auditing tools like Dyvin AI.',
            },
            {
              promptText: 'Dyvin AI vs Atlas AI feature comparison',
              type: PromptType.COMPETITOR,
              tags: { category: 'Comparison', priority: 'P0', visibility: 64.5, position: 2.8, change: -1.5, sentiment: 'neutral', mentioned: true, cluster: 'Competitor Comparison' },
              answer: 'Atlas AI leads in traditional SEO citation tracking, while Dyvin AI specializes in proprietary generative presence metrics (DVS), model drift detection, and answer engine optimization.',
            },
            {
              promptText: 'What is Answer Engine Optimization (AEO) and how does it work?',
              type: PromptType.GENERATED,
              tags: { category: 'Informational', priority: 'P2', visibility: 81.0, position: 1.5, change: 3.1, sentiment: 'positive', mentioned: true, cluster: 'AI Search Analytics' },
              answer: 'Answer Engine Optimization (AEO) is the strategy of structuring content and digital authority to ensure AI search models cite your brand in direct synthetic responses.',
            },
            {
              promptText: 'Enterprise generative engine optimization software tools',
              type: PromptType.KEYWORD,
              tags: { category: 'Commercial', priority: 'P1', visibility: 72.3, position: 2.4, change: 2.7, sentiment: 'positive', mentioned: true, cluster: 'Enterprise AI Visibility' },
              answer: 'Generative Engine Optimization (GEO) tools analyze synthetic responses across LLM models to improve domain citations and brand sentiment in conversational queries.',
            },
            {
              promptText: 'Dyvin AI pricing and enterprise plans',
              type: PromptType.MANUAL,
              tags: { category: 'Brand', priority: 'P0', visibility: 94.2, position: 1.0, change: 0.0, sentiment: 'positive', mentioned: true, cluster: 'Enterprise Reporting' },
              answer: 'Dyvin AI offers Starter ($490/mo), Growth ($1,290/mo), and Enterprise ($2,890/mo) tiers with comprehensive multi-model visibility tracking and API access.',
            },
            {
              promptText: 'How do AI models select sources and citations?',
              type: PromptType.GENERATED,
              tags: { category: 'Informational', priority: 'P2', visibility: 58.6, position: 3.2, change: -3.4, sentiment: 'neutral', mentioned: false, cluster: 'AI Search Analytics' },
              answer: 'AI search engines prioritize high domain authority research papers, active forum discussions, verified buyer reviews, and structured technical documentation when synthesizing citations.',
            },
            {
              promptText: 'Top alternatives to traditional SEO rank trackers in 2026',
              type: PromptType.COMPETITOR,
              tags: { category: 'Comparison', priority: 'P1', visibility: 69.4, position: 2.3, change: 5.1, sentiment: 'positive', mentioned: true, cluster: 'Competitor Comparison' },
              answer: 'Modern alternatives to traditional rank trackers include Dyvin AI, Profound, and Peec AI, which monitor dynamic generative answers across conversational LLM models.',
            },
          ];

          for (const item of defaultPrompts) {
            const p = await this.prisma.aISearchPrompt.create({
              data: {
                aiSearchProjectId: project.id,
                promptText: item.promptText,
                type: item.type,
                status: PromptStatus.ACTIVE,
                tags: item.tags,
                version: 1,
                ownerId: userId,
              },
            });

            const exec = await this.prisma.aISearchExecution.create({
              data: {
                aiSearchProjectId: project.id,
                promptId: p.id,
                trigger: ExecutionTrigger.MANUAL,
                status: ExecutionStatus.SUCCESS,
                latencyMs: 840,
                costUsd: 0.0012,
                totalTokens: 620,
                providerCode: AIProviderCode.OPENAI,
                modelCode: 'gpt-4o',
              },
            });

            await this.prisma.aISearchResult.create({
              data: {
                executionId: exec.id,
                promptId: p.id,
                answerText: item.answer,
                visibilityScore: Math.round(item.tags.visibility),
                citations: ['techcrunch.com', 'gartner.com'],
              },
            });
          }
        }

        if (project) {
          projectIdToQuery = project.id;
        }
      }
    }

    return this.prisma.aISearchPrompt.findMany({
      where: projectIdToQuery ? { aiSearchProjectId: projectIdToQuery } : undefined,
      include: {
        group: true,
        owner: true,
        executions: { take: 1, orderBy: { createdAt: 'desc' }, include: { results: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getPromptById(id: string) {
    const prompt = await this.prisma.aISearchPrompt.findUnique({
      where: { id },
      include: { group: true, owner: true, executions: { take: 5, orderBy: { createdAt: 'desc' } } },
    });

    if (!prompt) {
      throw new NotFoundException(`AI Search Prompt [${id}] not found.`);
    }

    return prompt;
  }

  async updatePrompt(id: string, dto: UpdatePromptDto, userId?: string) {
    const existing = await this.prisma.aISearchPrompt.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`AI Search Prompt [${id}] not found.`);
    }

    const updated = await this.prisma.aISearchPrompt.update({
      where: { id },
      data: {
        promptText: dto.promptText,
        status: dto.status,
        groupId: dto.groupId,
        tags: dto.tags,
        version: dto.promptText && dto.promptText !== existing.promptText ? existing.version + 1 : existing.version,
      },
    });

    await this.auditService.logAction({
      userId,
      action: 'PROMPT_UPDATED',
      metadata: { promptId: id, newVersion: updated.version },
    });

    return updated;
  }

  async deletePrompt(id: string, userId?: string) {
    const existing = await this.prisma.aISearchPrompt.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`AI Search Prompt [${id}] not found.`);
    }

    await this.prisma.aISearchPrompt.delete({ where: { id } });

    await this.auditService.logAction({
      userId,
      action: 'PROMPT_DELETED',
      metadata: { promptId: id },
    });

    return { success: true, message: `Prompt [${id}] deleted.` };
  }
}
