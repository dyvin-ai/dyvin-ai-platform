import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class LearningOptimizerService {
  private readonly logger = new Logger(LearningOptimizerService.name);

  constructor(private readonly prisma: PrismaService) {}

  async applyLearningOptimization(engineSource: string, payload: string) {
    return this.prisma.learningOptimization.create({
      data: {
        engineSource,
        optimizationPayload: payload,
      },
    });
  }
}
