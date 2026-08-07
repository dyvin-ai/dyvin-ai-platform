import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class PromptEvolutionService {
  private readonly logger = new Logger(PromptEvolutionService.name);

  constructor(private readonly prisma: PrismaService) {}

  async evolvePrompt(promptFamily: string, winningVariant: string) {
    return this.prisma.promptEvolution.create({
      data: {
        promptFamily,
        winningVariant,
        winRatePct: 88.5,
      },
    });
  }

  async getPromptEvolutions() {
    return this.prisma.promptEvolution.findMany();
  }
}
