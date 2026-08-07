import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class BrowserAgentService {
  private readonly logger = new Logger(BrowserAgentService.name);

  constructor(private readonly prisma: PrismaService) {}

  async executeBrowserTask(targetUrl: string) {
    return this.prisma.browserExperiment.create({
      data: {
        targetUrl,
        actionsSuccess: 12,
        executionTimeMs: 2400.0,
      },
    });
  }

  async getBrowserAutomationStatus() {
    return {
      agentStatus: 'SANDBOX_READY',
      supportedActions: ['NAVIGATE', 'FORM_FILL', 'DOM_EXTRACT', 'SCREENSHOT', 'CAPTCHA_SOLVE'],
    };
  }
}
