import { ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { BudgetAction, BudgetLimitType } from '@prisma/client';
import { PrismaService } from '../../../database/prisma.service';
import { RedisService } from '../../../redis/redis.service';

export interface CheckBudgetInput {
  organizationId: string;
  estimatedTokens?: number;
}

@Injectable()
export class AIBudgetService {
  private readonly logger = new Logger(AIBudgetService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  async checkBudget(input: CheckBudgetInput): Promise<{ allowed: boolean; action?: BudgetAction }> {
    const budget = await this.prisma.organizationBudget.findFirst({
      where: { organizationId: input.organizationId, limitType: BudgetLimitType.MONTHLY },
      include: { rules: true },
    });

    if (!budget) {
      return { allowed: true };
    }

    if (budget.isKillSwitched) {
      this.logger.warn(`AI Execution BLOCKED: Emergency Kill Switch active for Organization [${input.organizationId}]`);
      throw new ForbiddenException('AI executions disabled by Emergency Kill Switch.');
    }

    const estimatedNewTokens = budget.currentTokens + (input.estimatedTokens || 1000);
    const tokenLimit = budget.tokenLimit;

    if (estimatedNewTokens > tokenLimit) {
      this.logger.warn(`AI Budget EXCEEDED for Organization [${input.organizationId}]: ${estimatedNewTokens}/${tokenLimit} tokens.`);
      return { allowed: false, action: BudgetAction.REJECT };
    }

    return { allowed: true };
  }

  async recordTokenUsage(organizationId: string, tokensUsed: number, estimatedCostUsd: number = 0.002) {
    await this.prisma.organizationBudget.updateMany({
      where: { organizationId, limitType: BudgetLimitType.MONTHLY },
      data: {
        currentTokens: { increment: tokensUsed },
        currentCostUsd: { increment: estimatedCostUsd },
      },
    });

    await this.redis.del(`ai:budget:${organizationId}`);
  }

  async triggerEmergencyKillSwitch(organizationId: string, reason: string) {
    const budget = await this.prisma.organizationBudget.findFirst({
      where: { organizationId, limitType: BudgetLimitType.MONTHLY },
    });

    if (budget) {
      await this.prisma.organizationBudget.update({
        where: { id: budget.id },
        data: { isKillSwitched: true },
      });

      await this.prisma.emergencyStop.create({
        data: {
          budgetId: budget.id,
          reason,
        },
      });
    }

    return { success: true, message: `Emergency Kill Switch activated for organization [${organizationId}].` };
  }
}
