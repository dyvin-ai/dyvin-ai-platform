import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';

export interface CreatePlaybookInput {
  name: string;
  category?: string;
  description: string;
  stepsJson: Record<string, any>;
}

@Injectable()
export class PlaybookService {
  private readonly logger = new Logger(PlaybookService.name);

  constructor(private readonly prisma: PrismaService) {}

  async createPlaybook(input: CreatePlaybookInput) {
    this.logger.log(`Creating playbook ${input.name}`);

    return this.prisma.actionPlaybook.create({
      data: {
        name: input.name,
        category: input.category || 'RECOVER_VISIBILITY',
        description: input.description,
        stepsJson: input.stepsJson,
      },
    });
  }

  async getPlaybooks() {
    const playbooks = await this.prisma.actionPlaybook.findMany({ take: 50 });

    if (playbooks.length === 0) {
      return [
        {
          name: 'Recover Visibility Playbook',
          category: 'RECOVER_VISIBILITY',
          description: '3-step automated strategy to recover lost citations and visibility.',
          steps: ['Audit lost citations', 'Generate JSON-LD Organization Schema', 'Deploy FAQ Knowledge Expansion'],
        },
        {
          name: 'Beat Competitor Playbook',
          category: 'BEAT_COMPETITOR',
          description: 'Targeted actions to counter competitor brand expansion in AI Search engines.',
          steps: ['Generate Comparison Landing Page', 'Generate Product Page Schema', 'Run Authority Outreach Campaign'],
        },
        {
          name: 'Improve AI Search Playbook',
          category: 'IMPROVE_AI_SEARCH',
          description: 'Improve prompt coverage and citation probability.',
          steps: ['Fill Knowledge Gaps', 'Expand Entity Graph References', 'Generate Technical Documentation'],
        },
      ];
    }

    return playbooks;
  }
}
