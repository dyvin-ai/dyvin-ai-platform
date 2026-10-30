import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { FeatureEnvironmentName, FeatureFlagType, RolloutStrategy } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';
import { RedisService } from '../../redis/redis.service';
import { AuditService } from '../audit/audit.service';

export interface EvaluateFlagContext {
  userId?: string;
  organizationId?: string;
  country?: string;
  plan?: string;
}

export interface CreateFeatureFlagInput {
  key: string;
  name: string;
  description?: string;
  type?: FeatureFlagType;
  isEnabled?: boolean;
  defaultValue?: boolean;
  strategy?: RolloutStrategy;
  percentage?: number;
  startDate?: Date;
  endDate?: Date;
  audiences?: Array<{ targetType: string; targetValue: string }>;
}

export interface UpdateFeatureFlagInput {
  name?: string;
  description?: string;
  isEnabled?: boolean;
  isKillSwitched?: boolean;
  defaultValue?: boolean;
  strategy?: RolloutStrategy;
  percentage?: number;
  startDate?: Date;
  endDate?: Date;
}

@Injectable()
export class FeatureFlagService {
  private readonly logger = new Logger(FeatureFlagService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
    private readonly auditService: AuditService,
  ) {}

  async evaluate(flagKey: string, context: EvaluateFlagContext = {}): Promise<boolean> {
    let flag: any = null;

    try {
      const cacheKey = `ff:${flagKey}`;
      const cachedFlag = await Promise.race([
        this.redis.get(cacheKey),
        new Promise<null>((resolve) => setTimeout(() => resolve(null), 500)),
      ]);

      if (cachedFlag) {
        flag = JSON.parse(cachedFlag);
      }
    } catch {
      // Redis unavailable or timed out, proceed to Prisma
    }

    if (!flag) {
      try {
        flag = await this.prisma.featureFlag.findUnique({
          where: { key: flagKey },
          include: { rollouts: true, audiences: true, environments: true },
        });

        if (flag) {
          try {
            await this.redis.set(`ff:${flagKey}`, JSON.stringify(flag), 60);
          } catch {}
        }
      } catch {
        // Table or query failed, return default true
        return true;
      }
    }

    if (!flag) {
      return true; // Default enabled for core modules
    }

    // 1. Check Global Kill Switch
    if (flag.isKillSwitched || !flag.isEnabled) {
      return false;
    }

    // 2. Check Audiences (User, Org, Country, Plan)
    if (flag.audiences && flag.audiences.length > 0) {
      for (const aud of flag.audiences) {
        if (aud.targetType === 'USER' && context.userId === aud.targetValue) return true;
        if (aud.targetType === 'ORGANIZATION' && context.organizationId === aud.targetValue) return true;
        if (aud.targetType === 'COUNTRY' && context.country === aud.targetValue) return true;
        if (aud.targetType === 'PLAN' && context.plan === aud.targetValue) return true;
      }
    }

    // 3. Check Rollout Strategy & Percentage
    if (flag.rollouts && flag.rollouts.length > 0) {
      const rollout = flag.rollouts[0];
      if (rollout.strategy === 'PERCENTAGE') {
        const hash = this.simpleHash(context.userId || context.organizationId || 'anonymous');
        return hash % 100 < rollout.percentage;
      }

      if (rollout.strategy === 'TIME_WINDOW') {
        const now = new Date();
        if (rollout.startDate && new Date(rollout.startDate) > now) return false;
        if (rollout.endDate && new Date(rollout.endDate) < now) return false;
        return true;
      }
    }

    return flag.defaultValue ?? flag.isEnabled;
  }

  async createFlag(input: CreateFeatureFlagInput, userId?: string) {
    const flag = await this.prisma.featureFlag.create({
      data: {
        key: input.key,
        name: input.name,
        description: input.description,
        type: input.type || FeatureFlagType.BOOLEAN,
        isEnabled: input.isEnabled ?? true,
        defaultValue: input.defaultValue ?? false,
        environments: {
          create: [
            { environment: FeatureEnvironmentName.DEVELOPMENT, isEnabled: true },
            { environment: FeatureEnvironmentName.STAGING, isEnabled: true },
            { environment: FeatureEnvironmentName.PRODUCTION, isEnabled: true },
          ],
        },
        rollouts: {
          create: [
            {
              strategy: input.strategy || RolloutStrategy.GLOBAL,
              percentage: input.percentage ?? 100,
              startDate: input.startDate,
              endDate: input.endDate,
            },
          ],
        },
        audiences: input.audiences ? { create: input.audiences } : undefined,
      },
      include: { environments: true, rollouts: true, audiences: true },
    });

    await this.prisma.featureAudit.create({
      data: {
        flagId: flag.id,
        action: 'FLAG_CREATED',
        newState: flag as any,
        changedById: userId,
      },
    });

    await this.redis.del(`ff:${input.key}`);
    return flag;
  }

  async updateFlag(id: string, input: UpdateFeatureFlagInput, userId?: string) {
    const existing = await this.prisma.featureFlag.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Feature Flag [${id}] not found.`);
    }

    const updated = await this.prisma.featureFlag.update({
      where: { id },
      data: {
        name: input.name,
        description: input.description,
        isEnabled: input.isEnabled,
        isKillSwitched: input.isKillSwitched,
        defaultValue: input.defaultValue,
      },
      include: { rollouts: true, audiences: true, environments: true },
    });

    await this.prisma.featureAudit.create({
      data: {
        flagId: id,
        action: 'FLAG_UPDATED',
        previousState: existing as any,
        newState: updated as any,
        changedById: userId,
      },
    });

    await this.redis.del(`ff:${existing.key}`);
    return updated;
  }

  async getFlags() {
    return this.prisma.featureFlag.findMany({
      include: { environments: true, rollouts: true, audiences: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async deleteFlag(id: string, userId?: string) {
    const existing = await this.prisma.featureFlag.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Feature Flag [${id}] not found.`);
    }

    await this.prisma.featureFlag.delete({ where: { id } });
    await this.redis.del(`ff:${existing.key}`);

    return { success: true, message: `Feature flag [${existing.key}] deleted.` };
  }

  private simpleHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash);
  }
}
