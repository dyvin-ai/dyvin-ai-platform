import { Injectable, Logger } from '@nestjs/common';
import { AutomationStatus } from '@prisma/client';
import { PrismaService } from '../../../database/prisma.service';
import { AuditService } from '../../audit/audit.service';

export interface TriggerPipelineResult {
  ruleId?: string;
  status: AutomationStatus;
  pipelineTriggers: string[];
}

@Injectable()
export class AutomationEngineService {
  private readonly logger = new Logger(AutomationEngineService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  async triggerAutomatedPipeline(projectId: string, changeType: string): Promise<TriggerPipelineResult> {
    this.logger.log(`Evaluating automation pipeline for project [${projectId}] on event [${changeType}]`);

    const rules = await this.prisma.automationRule.findMany({
      where: { projectId, isEnabled: true },
    });

    const pipelineTriggers = [
      'WEBSITE_RESCAN',
      'KNOWLEDGE_GRAPH_UPDATE',
      'VISIBILITY_ANALYSIS',
      'RECOMMENDATION_REFRESH',
    ];

    await this.prisma.automationHistory.create({
      data: {
        projectId,
        actionTaken: 'PIPELINE_TRIGGERED',
        metadata: { changeType, pipelineTriggers },
      },
    });

    await this.auditService.logAction({
      action: 'AUTOMATION_TRIGGERED',
      metadata: { projectId, changeType, pipelineTriggers },
    });

    return {
      status: AutomationStatus.SUCCESS,
      pipelineTriggers,
    };
  }
}
