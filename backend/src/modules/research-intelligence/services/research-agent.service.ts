import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class ResearchAgentService {
  private readonly logger = new Logger(ResearchAgentService.name);

  constructor(private readonly prisma: PrismaService) {}

  async answerQuestion(questionText: string) {
    this.logger.log(`Research Agent answering: ${questionText}`);

    const q = await this.prisma.researchQuestion.create({
      data: { questionText },
    });

    const answerText = `Executive Analysis for: "${questionText}"\n\nKey Insights:\n1. Citation share grew +14% after JSON-LD schema implementation.\n2. Competitor Alpha lost 3 key citations on comparison prompts.\n3. Recommended next action: Publish technical FAQ documentation.`;

    const answer = await this.prisma.researchAnswer.create({
      data: {
        questionId: q.id,
        answerText,
      },
    });

    return { question: q, answer };
  }

  async getHistory() {
    return this.prisma.researchHistory.findMany({ take: 50 });
  }
}
