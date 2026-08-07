import { Injectable, Logger } from '@nestjs/common';
import { ExecutionComplexity } from '@prisma/client';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class ExecutionPlannerService {
  private readonly logger = new Logger(ExecutionPlannerService.name);

  constructor(private readonly prisma: PrismaService) {}

  async generateExecutionPlan(strategyId: string) {
    const plan = await this.prisma.strategyExecutionPlan.create({
      data: {
        strategyId,
        title: '3-Week Strategy Execution Roadmap',
        durationDays: 21,
      },
    });

    await this.prisma.strategyStep.createMany({
      data: [
        {
          planId: plan.id,
          stepOrder: 1,
          title: 'Implement JSON-LD Organization Schema',
          action: 'Add structured markup to root template files.',
          complexity: ExecutionComplexity.LOW,
        },
        {
          planId: plan.id,
          stepOrder: 2,
          title: 'Publish High-Authority Knowledge Center FAQs',
          action: 'Create 15 structured FAQ markdown documents answering top buyer questions.',
          complexity: ExecutionComplexity.MEDIUM,
        },
      ],
    });

    await this.prisma.strategyMilestone.createMany({
      data: [
        { planId: plan.id, dayOffset: 7, title: 'Schema Verification Passed' },
        { planId: plan.id, dayOffset: 21, title: '+30% AI Citation Frequency Reached' },
      ],
    });

    return this.prisma.strategyExecutionPlan.findUnique({
      where: { id: plan.id },
      include: { steps: true, milestones: true },
    });
  }

  async getExecutionPlan(strategyId: string) {
    return this.prisma.strategyExecutionPlan.findFirst({
      where: { strategyId },
      include: { steps: true, milestones: true },
    });
  }

  async getScenarios(strategyId?: string) {
    return [
      { name: 'DO_NOTHING', forecastScore: 62.0, roiPct: 0.0, risk: 'HIGH' },
      { name: 'RECOMMENDED', forecastScore: 88.0, roiPct: 380.0, risk: 'LOW' },
      { name: 'AGGRESSIVE', forecastScore: 95.0, roiPct: 520.0, risk: 'MEDIUM' },
      { name: 'CONSERVATIVE', forecastScore: 78.0, roiPct: 210.0, risk: 'LOW' },
    ];
  }

  async getForecast(strategyId?: string) {
    return [
      { horizonDays: 7, projectedScore: 72.0, confidencePct: 94.0 },
      { horizonDays: 30, projectedScore: 85.0, confidencePct: 88.0 },
      { horizonDays: 90, projectedScore: 92.5, confidencePct: 81.0 },
    ];
  }

  async getInsights(strategyId?: string) {
    return [
      {
        title: 'High-ROI Fast Track: Schema Optimization',
        description: 'Implementing organization schema delivers 45% of expected gains in 3 days.',
        roiGainPct: 45.0,
      },
      {
        title: 'Emerging Opportunity: Perplexity Citation Capture',
        description: 'Publishing technical documentation will capture 8 missing citations.',
        roiGainPct: 30.0,
      },
    ];
  }
}
