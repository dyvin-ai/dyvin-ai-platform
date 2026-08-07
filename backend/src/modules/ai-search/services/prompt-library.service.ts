import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PromptStatus, PromptType } from '@prisma/client';
import { PrismaService } from '../../../database/prisma.service';
import { AuditService } from '../../audit/audit.service';

export interface CreatePromptDto {
  aiSearchProjectId: string;
  groupId?: string;
  promptText: string;
  type?: PromptType;
  tags?: string[];
}

export interface UpdatePromptDto {
  promptText?: string;
  status?: PromptStatus;
  groupId?: string;
  tags?: string[];
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
        tags: dto.tags || [],
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

  async getPrompts(aiSearchProjectId?: string) {
    return this.prisma.aISearchPrompt.findMany({
      where: aiSearchProjectId ? { aiSearchProjectId } : undefined,
      include: { group: true, owner: true },
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
