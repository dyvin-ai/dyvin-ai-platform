import { Injectable, Logger } from '@nestjs/common';
import { ExecutionTrigger, SearchFrequency } from '@prisma/client';
import { PrismaService } from '../../../database/prisma.service';
import { NotificationDispatcherService } from '../../notification/services/notification-dispatcher.service';
import { PromptExecutionService } from './prompt-execution.service';

@Injectable()
export class AISearchMonitorService {
  private readonly logger = new Logger(AISearchMonitorService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly executionService: PromptExecutionService,
    private readonly notificationDispatcher: NotificationDispatcherService,
  ) {}

  async runScheduledMonitoring(frequency: SearchFrequency = SearchFrequency.DAILY) {
    this.logger.log(`Starting AI Search scheduled monitoring [Frequency: ${frequency}]...`);

    const schedules = await this.prisma.aISearchSchedule.findMany({
      where: { frequency, isEnabled: true },
      include: { prompt: { include: { aiSearchProject: true } } },
    });

    let completed = 0;
    let failed = 0;

    for (const schedule of schedules) {
      try {
        await this.executionService.executePrompt({
          promptId: schedule.promptId,
          trigger: ExecutionTrigger.SCHEDULED,
          organizationId: schedule.prompt.aiSearchProject.organizationId,
        });

        await this.prisma.aISearchSchedule.update({
          where: { id: schedule.id },
          data: { nextRunAt: new Date(Date.now() + 86400000) },
        });

        completed++;
      } catch (err: any) {
        this.logger.error(`Scheduled prompt execution failed for [${schedule.promptId}]: ${err.message}`);
        failed++;
      }
    }

    this.logger.log(`Completed scheduled monitoring for ${completed} prompts. (${failed} failed)`);
    return { completed, failed };
  }
}
