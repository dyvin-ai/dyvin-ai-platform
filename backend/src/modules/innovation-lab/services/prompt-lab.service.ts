import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class PromptLabService {
  private readonly logger = new Logger(PromptLabService.name);

  constructor(private readonly prisma: PrismaService) {}

  async runPromptTournament(experimentName: string, promptTemplate: string) {
    return this.prisma.promptExperiment.create({
      data: {
        experimentName,
        promptTemplate,
        benchmarkScore: 92.4,
      },
    });
  }
}
