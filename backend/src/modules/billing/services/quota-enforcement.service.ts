import { BadRequestException, Injectable, Logger } from '@nestjs/common';
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

  /**
   * Reads the current quota state for an organization and metric.
   * Does NOT increment usage — use recordUsage() for that.
   * Handles auto-creation of a quota record if none exists, and lazy monthly resets.
   */
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

    // Lazy monthly reset — resets the counter when the reset period has passed
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

  /**
   * Atomically reserves and records usage for an organization and metric.
   *
   * Race-condition protection: the entire check-and-increment is performed inside a
   * serializable Prisma transaction. The conditional updateMany call only increments
   * if the current usage (after any reset) still has room for the requested quantity.
   * If 0 rows are matched (concurrent request already consumed the last slot), the
   * transaction is rolled back and a quota-exceeded error is thrown.
   *
   * This prevents concurrent requests from both passing a non-atomic check and then
   * both incrementing, which would allow overspending.
   */
  async recordUsage(organizationId: string, metricType: UsageMetricType, quantity: number = 1) {
    return this.prisma.$transaction(async (tx) => {
      // Step 1: Ensure the quota record exists and apply any pending monthly reset,
      // all within the transaction so no other concurrent writer can interleave.
      let quota = await tx.usageQuota.findUnique({
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
        quota = await tx.usageQuota.create({
          data: {
            organizationId,
            metricType,
            monthlyLimit: 100,
            currentUsage: 0,
            resetAt,
          },
        });
      }

      // Lazy monthly reset inside the transaction
      const now = new Date();
      if (now >= quota.resetAt) {
        const nextReset = new Date();
        nextReset.setMonth(nextReset.getMonth() + 1);
        quota = await tx.usageQuota.update({
          where: { id: quota.id },
          data: { currentUsage: 0, resetAt: nextReset },
        });
      }

      // Step 2: Reject immediately if the limit is already reached (fast path)
      const isUnlimited = quota.monthlyLimit === -1;
      if (!isUnlimited && quota.currentUsage + quantity > quota.monthlyLimit) {
        throw new BadRequestException(
          `Monthly limit exceeded for metric [${metricType}]. Current usage: ${quota.currentUsage}/${quota.monthlyLimit}`,
        );
      }

      // Step 3: Atomic conditional increment — only succeeds if the row still has capacity.
      // The WHERE clause includes the exact currentUsage we read, so if a concurrent
      // transaction already incremented it past the limit, this update matches 0 rows
      // and the transaction rolls back with a quota-exceeded error.
      const updateResult = isUnlimited
        ? await tx.usageQuota.updateMany({
            where: { id: quota.id },
            data: { currentUsage: { increment: quantity } },
          })
        : await tx.usageQuota.updateMany({
            where: {
              id: quota.id,
              currentUsage: {
                lte: quota.monthlyLimit - quantity, // only if there's still room
              },
            },
            data: { currentUsage: { increment: quantity } },
          });

      if (!isUnlimited && updateResult.count === 0) {
        // A concurrent request consumed the remaining quota between our read and this update
        throw new BadRequestException(
          `Monthly limit exceeded for metric [${metricType}] due to concurrent usage. Please try again later.`,
        );
      }

      // Step 4: Record the usage event for auditing
      await tx.usageRecord.create({
        data: {
          organizationId,
          metricType,
          quantity,
        },
      });

      return {
        success: true,
        metricType,
        quantity,
        currentUsage: quota.currentUsage + quantity,
      };
    });
  }

  async getOrganizationUsage(organizationId: string) {
    return this.prisma.usageQuota.findMany({
      where: { organizationId },
    });
  }

  /**
   * Executes an action inside a transactional quota reservation.
   *
   * 1. Atomically reserves capacity by incrementing currentUsage inside a transaction.
   *    If capacity is exceeded (including due to concurrent requests), throws BadRequestException immediately.
   * 2. Executes the provided action function.
   * 3. If the action succeeds, records the UsageRecord audit log and returns the action result.
   * 4. If the action fails or throws an exception, atomically rolls back (decrements) currentUsage
   *    so that no quota is lost due to transient downstream failures (e.g. database error, queue failure).
   */
  async executeWithQuotaReservation<T>(
    organizationId: string,
    metricType: UsageMetricType,
    quantity: number = 1,
    action: () => Promise<T>,
  ): Promise<T> {
    await this.reserveQuota(organizationId, metricType, quantity);

    try {
      const result = await action();
      await this.commitQuotaUsage(organizationId, metricType, quantity);
      return result;
    } catch (err) {
      this.logger.warn(
        `[QuotaEnforcement] Action failed for org [${organizationId}] metric [${metricType}]. Releasing reserved quota...`,
      );
      await this.releaseQuota(organizationId, metricType, quantity);
      throw err;
    }
  }

  async reserveQuota(organizationId: string, metricType: UsageMetricType, quantity: number = 1) {
    return this.prisma.$transaction(async (tx) => {
      let quota = await tx.usageQuota.findUnique({
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
        quota = await tx.usageQuota.create({
          data: {
            organizationId,
            metricType,
            monthlyLimit: 100,
            currentUsage: 0,
            resetAt,
          },
        });
      }

      const now = new Date();
      if (now >= quota.resetAt) {
        const nextReset = new Date();
        nextReset.setMonth(nextReset.getMonth() + 1);
        quota = await tx.usageQuota.update({
          where: { id: quota.id },
          data: { currentUsage: 0, resetAt: nextReset },
        });
      }

      const isUnlimited = quota.monthlyLimit === -1;
      if (!isUnlimited && quota.currentUsage + quantity > quota.monthlyLimit) {
        throw new BadRequestException(
          `Monthly limit exceeded for metric [${metricType}]. Current usage: ${quota.currentUsage}/${quota.monthlyLimit}`,
        );
      }

      const updateResult = isUnlimited
        ? await tx.usageQuota.updateMany({
            where: { id: quota.id },
            data: { currentUsage: { increment: quantity } },
          })
        : await tx.usageQuota.updateMany({
            where: {
              id: quota.id,
              currentUsage: { lte: quota.monthlyLimit - quantity },
            },
            data: { currentUsage: { increment: quantity } },
          });

      if (!isUnlimited && updateResult.count === 0) {
        throw new BadRequestException(
          `Monthly limit exceeded for metric [${metricType}] due to concurrent usage. Please try again later.`,
        );
      }

      return {
        organizationId,
        metricType,
        quantity,
        currentUsage: quota.currentUsage + quantity,
      };
    });
  }

  async releaseQuota(organizationId: string, metricType: UsageMetricType, quantity: number = 1) {
    try {
      await this.prisma.usageQuota.updateMany({
        where: {
          organizationId,
          metricType,
        },
        data: {
          currentUsage: { decrement: quantity },
        },
      });
      this.logger.log(
        `[QuotaEnforcement] Released [${quantity}] units for org [${organizationId}] on metric [${metricType}]`,
      );
    } catch (releaseErr: any) {
      this.logger.error(`[QuotaEnforcement] Failed to release quota: ${releaseErr.message}`, releaseErr.stack);
    }
  }

  async commitQuotaUsage(organizationId: string, metricType: UsageMetricType, quantity: number = 1) {
    await this.prisma.usageRecord.create({
      data: {
        organizationId,
        metricType,
        quantity,
      },
    });
  }

  /**
   * Adds purchased top-up credits to an organization's CreditBalance and records
   * an idempotent CreditTransaction by provider transaction / event ID.
   * Also synchronizes usage quotas (SCANS and AI_REQUESTS) so that available
   * capacity reflects the newly credited allowance.
   */
  async grantCredits(params: {
    organizationId: string;
    credits: number;
    providerTxId: string;
    description?: string;
  }) {
    const { organizationId, credits, providerTxId, description } = params;
    if (credits <= 0) return null;

    return this.prisma.$transaction(async (tx) => {
      // Step 1: Find or create CreditBalance for the organization
      let creditBalance = await tx.creditBalance.findFirst({
        where: { organizationId },
        orderBy: { createdAt: 'desc' },
      });

      if (!creditBalance) {
        creditBalance = await tx.creditBalance.create({
          data: {
            organizationId,
            balance: 0,
            currency: 'USD',
          },
        });
      }

      // Step 2: Idempotency check on providerTxId to prevent double-crediting
      const existingTx = await tx.creditTransaction.findFirst({
        where: {
          creditId: creditBalance.id,
          description: { contains: providerTxId },
        },
      });

      if (existingTx) {
        this.logger.warn(
          `[QuotaEnforcement] Credits already granted for provider transaction [${providerTxId}] — skipping duplicate.`,
        );
        return { alreadyGranted: true, creditBalance };
      }

      // Step 3: Increment CreditBalance
      const updatedBalance = await tx.creditBalance.update({
        where: { id: creditBalance.id },
        data: {
          balance: { increment: credits },
        },
      });

      // Step 4: Record CreditTransaction linked to CreditBalance
      await tx.creditTransaction.create({
        data: {
          creditId: creditBalance.id,
          amount: credits,
          type: 'TOP_UP',
          description: description || `Top-up: ${providerTxId}`,
        },
      });

      // Step 5: Keep UsageQuota consistent with the new credit balance
      for (const metricType of [UsageMetricType.SCANS, UsageMetricType.AI_REQUESTS]) {
        let quota = await tx.usageQuota.findUnique({
          where: { organizationId_metricType: { organizationId, metricType } },
        });

        if (!quota) {
          const resetAt = new Date();
          resetAt.setMonth(resetAt.getMonth() + 1);
          await tx.usageQuota.create({
            data: {
              organizationId,
              metricType,
              monthlyLimit: 100 + credits,
              currentUsage: 0,
              resetAt,
            },
          });
        } else if (quota.monthlyLimit !== -1) {
          await tx.usageQuota.update({
            where: { id: quota.id },
            data: {
              monthlyLimit: { increment: credits },
            },
          });
        }
      }

      this.logger.log(
        `[QuotaEnforcement] Idempotently granted [${credits}] credits to org [${organizationId}] (Tx: ${providerTxId}). New balance: ${updatedBalance.balance}`,
      );
      return { alreadyGranted: false, creditBalance: updatedBalance };
    });
  }

  /**
   * Backward-compatible alias for grantCredits
   */
  async addCredits(organizationId: string, metricType: UsageMetricType, credits: number) {
    return this.grantCredits({
      organizationId,
      credits,
      providerTxId: `internal_${Date.now()}`,
      description: `Manual credit adjustment: ${metricType}`,
    });
  }
}
