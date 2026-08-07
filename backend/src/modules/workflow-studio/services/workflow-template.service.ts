import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class WorkflowTemplateService {
  private readonly logger = new Logger(WorkflowTemplateService.name);

  constructor(private readonly prisma: PrismaService) {}

  async getTemplates() {
    const templates = await this.prisma.workflowTemplate.findMany({ take: 50 });

    if (templates.length === 0) {
      return [
        {
          name: 'Recover Visibility Template',
          category: 'RECOVER_VISIBILITY',
          description: 'Automated 4-step workflow to detect citation drop and execute recovery plan.',
          nodes: ['Trigger: Visibility Changed', 'Condition: Drop > 10%', 'Action: Run Strategy Engine', 'Action: Publish FAQ to WordPress'],
        },
        {
          name: 'Competitor Watch Template',
          category: 'COMPETITOR_WATCH',
          description: 'Track competitor movements weekly and generate executive competitor digest.',
          nodes: ['Schedule: Weekly', 'Action: Run Competitor Intelligence', 'Action: Post Slack Digest'],
        },
        {
          name: 'Weekly AI Search Report Template',
          category: 'REPORTS',
          description: 'Generate weekly executive report and email organization owners.',
          nodes: ['Schedule: Monday 9AM', 'Action: Generate Report', 'Action: Send Email Notification'],
        },
      ];
    }

    return templates;
  }
}
