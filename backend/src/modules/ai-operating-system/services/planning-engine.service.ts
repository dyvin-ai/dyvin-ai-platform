import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class PlanningEngineService {
  private readonly logger = new Logger(PlanningEngineService.name);

  constructor(private readonly prisma: PrismaService) {}

  async generatePlan(goalId: string, title: string) {
    return this.prisma.executionPlan.create({
      data: {
        goalId,
        title,
        riskScore: 0.12,
        estimatedCost: 120.0,
        status: 'EXECUTING',
      },
    });
  }

  async getPlans() {
    return this.prisma.executionPlan.findMany();
  }
}
