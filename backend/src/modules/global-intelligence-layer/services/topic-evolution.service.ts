import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class TopicEvolutionService {
  private readonly logger = new Logger(TopicEvolutionService.name);

  constructor(private readonly prisma: PrismaService) {}

  async trackTopic(topicName: string, category: string) {
    return this.prisma.globalTopicRecord.create({
      data: {
        topicName,
        category,
        visibilityScore: 88.0,
      },
    });
  }

  async getEmergingTopics() {
    return [
      { topicName: 'Generative Engine Optimization', growthPct: 420.0, category: 'AI_SEARCH' },
      { topicName: 'Agentic Workflow Coordination', growthPct: 310.0, category: 'AI_AGENTS' },
    ];
  }
}
