import { Injectable, Logger } from '@nestjs/common';
import { SkillStatus, ToolStatus } from '@prisma/client';
import { PrismaService } from '../../../database/prisma.service';

export interface CreateSkillInput {
  organizationId: string;
  skillName: string;
  description?: string;
}

export interface CreateToolInput {
  organizationId: string;
  toolName: string;
  toolType?: string;
  configJson?: Record<string, any>;
}

@Injectable()
export class AgentSkillToolService {
  private readonly logger = new Logger(AgentSkillToolService.name);

  constructor(private readonly prisma: PrismaService) {}

  async createSkill(input: CreateSkillInput) {
    return this.prisma.agentSkill.create({
      data: {
        organizationId: input.organizationId,
        skillName: input.skillName,
        description: input.description,
        status: SkillStatus.ACTIVE,
      },
    });
  }

  async updateSkill(id: string, description: string) {
    return this.prisma.agentSkill.update({
      where: { id },
      data: { description },
    });
  }

  async deleteSkill(id: string) {
    return this.prisma.agentSkill.delete({ where: { id } });
  }

  async getSkills(organizationId?: string) {
    return this.prisma.agentSkill.findMany({
      where: organizationId ? { organizationId } : undefined,
      take: 50,
    });
  }

  async createTool(input: CreateToolInput) {
    return this.prisma.toolDefinition.create({
      data: {
        organizationId: input.organizationId,
        toolName: input.toolName,
        toolType: input.toolType || 'REST_API',
        status: ToolStatus.ACTIVE,
        configJson: input.configJson || {},
      },
    });
  }

  async getTools(organizationId?: string) {
    return this.prisma.toolDefinition.findMany({
      where: organizationId ? { organizationId } : undefined,
      take: 50,
    });
  }
}
