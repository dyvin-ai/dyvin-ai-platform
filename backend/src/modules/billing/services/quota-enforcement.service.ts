import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { UsageMetricType } from '@prisma/client';
import { PrismaService } from '../../../database/prisma.service';

export interface QuotaCheckResult {
  allowed: boolean;
  metricType: UsageMetricType;
  currentUsage: number;
  monthlyLimit: number;
}

@Injectable()
export class QuotaEnforcementService {
  private readonly logger = new Logger(QuotaEnforcementService.name);

  constructor(private readonly prisma: PrismaService) {}

  async checkQuota(organizationId: string, metricType: UsageMetricType, amount: number = 1): Promise<QuotaCheckResult> {
    let quota = await this.prisma.usageQuota.findUnique({
      where: {
        organizationId_metricType: {
          organizationId,
          metricType,
        },
      },
    });

    if (!quota) {
      const resetAt = new Date();
      resetAt.setMonth(resetAt.getMonth() + 1);

      quota = await this.prisma.usageQuota.create({
        data: {
          organizationId,
          metricType,
          monthlyLimit: 100,
          currentUsage: 0,
          resetAt,
        },
      });
    }

    // Check if reset period has passed
    if (new Date() >= quota.resetAt) {
      const nextReset = new Date();
      nextReset.setMonth(nextReset.getMonth() + 1);

      quota = await this.prisma.usageQuota.update({
        where: { id: quota.id },
        data: {
          currentUsage: 0,
          resetAt: nextReset,
        },
      });
    }

    const allowed = quota.monthlyLimit === -1 || quota.currentUsage + amount <= quota.monthlyLimit;

    return {
      allowed,
      metricType,
      currentUsage: quota.currentUsage,
      monthlyLimit: quota.monthlyLimit,
    };
  }

  async recordUsage(organizationId: string, metricType: UsageMetricType, quantity: number = 1) {
    const quotaResult = await this.checkQuota(organizationId, metricType, quantity);

    if (!quotaResult.allowed) {
      throw new BadRequestException(`Monthly limit exceeded for metric [${metricType}]. Current usage: ${quotaResult.currentUsage}/${quotaResult.monthlyLimit}`);
    }

    await this.prisma.usageRecord.create({
      data: {
        organizationId,
        metricType,
        quantity,
      },
    });

    await this.prisma.usageQuota.update({
      where: {
        organizationId_metricType: {
          organizationId,
          metricType,
        },
      },
      data: {
        currentUsage: { increment: quantity },
      },
    });

    return { success: true, metricType, quantity, currentUsage: quotaResult.currentUsage + quantity };
  }

  async getOrganizationUsage(organizationId: string) {
    return this.prisma.usageQuota.findMany({
      where: { organizationId },
    });
  }
}
