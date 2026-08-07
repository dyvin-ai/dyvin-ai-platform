import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class GoalService {
  private readonly logger = new Logger(GoalService.name);

  constructor(private readonly prisma: PrismaService) {}

  async createGoal(organizationId: string, title: string, description: string) {
    return this.prisma.strategicGoal.create({
      data: {
        organizationId,
        title,
        description,
        targetDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        progressPct: 0.0,
      },
    });
  }

  async getGoals() {
    return this.prisma.strategicGoal.findMany();
  }
}
