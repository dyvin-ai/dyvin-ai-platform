import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class ReasoningEngineService {
  private readonly logger = new Logger(ReasoningEngineService.name);

  constructor(private readonly prisma: PrismaService) {}

  async evaluateThought(promptText: string, treeOfThoughts: string) {
    return this.prisma.reasoningTrace.create({
      data: {
        promptText,
        treeOfThoughts,
        confidence: 0.96,
      },
    });
  }
}
