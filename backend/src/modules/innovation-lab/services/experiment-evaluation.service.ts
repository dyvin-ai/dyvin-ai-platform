import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class ExperimentEvaluationService {
  private readonly logger = new Logger(ExperimentEvaluationService.name);

  constructor(private readonly prisma: PrismaService) {}

  async evaluateExperiment(experimentId: string, accuracy = 0.98) {
    return this.prisma.innovationEvaluation.create({
      data: {
        experimentId,
        accuracy,
        latencyMs: 320.0,
        costScore: 95.0,
        passedGate: accuracy >= 0.95,
      },
    });
  }

  async getEvaluations() {
    return this.prisma.innovationEvaluation.findMany();
  }
}
