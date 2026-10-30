import { Injectable, Logger } from '@nestjs/common';
import { VisibilityStatus, VisibilityTrendDirection } from '@prisma/client';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class VisibilityTimelineService {
  private readonly logger = new Logger(VisibilityTimelineService.name);

  constructor(private readonly prisma: PrismaService) {}

  private async resolveProfile(profileIdOrOrgId: string) {
    let profile = await this.prisma.aIVisibilityProfile.findUnique({
      where: { id: profileIdOrOrgId },
    });

    if (!profile) {
      profile = await this.prisma.aIVisibilityProfile.findFirst({
        where: { organizationId: profileIdOrOrgId },
      });
    }

    return profile;
  }

  async getTimeline(profileIdOrOrgId: string, days: number = 30) {
    const profile = await this.resolveProfile(profileIdOrOrgId);
    if (!profile) {
      return {
        profileId: null,
        rangeDays: days,
        count: 0,
        timeline: [],
      };
    }

    const sinceDate = new Date(Date.now() - days * 86400000);

    const snapshots = await this.prisma.aIVisibilitySnapshot.findMany({
      where: {
        profileId: profile.id,
        createdAt: { gte: sinceDate },
      },
      orderBy: { createdAt: 'asc' },
    });

    const timeline = snapshots.map((s) => ({
      date: s.createdAt.toISOString().split('T')[0],
      score: s.overallScore,
    }));

    return {
      profileId: profile.id,
      rangeDays: days,
      count: timeline.length,
      timeline,
    };
  }

  async getTrends(profileIdOrOrgId: string) {
    const profile = await this.resolveProfile(profileIdOrOrgId);
    if (!profile) {
      return {
        profileId: null,
        recent7DayAvg: 0,
        previous7DayAvg: 0,
        growthRatePct: 0,
        direction: VisibilityTrendDirection.STABLE,
        momentum: 1.0,
      };
    }

    const recent = await this.getTimeline(profile.id, 7);
    const previous = await this.getTimeline(profile.id, 14);

    const recentAvg =
      recent.timeline.length > 0
        ? recent.timeline.reduce((acc, curr) => acc + curr.score, 0) / recent.timeline.length
        : profile.overallScore;
    const prevAvg =
      previous.timeline.length > 0
        ? previous.timeline.reduce((acc, curr) => acc + curr.score, 0) / previous.timeline.length
        : profile.overallScore;

    const growthRatePct = prevAvg > 0 ? parseFloat((((recentAvg - prevAvg) / prevAvg) * 100).toFixed(2)) : 0;

    let direction: VisibilityTrendDirection = VisibilityTrendDirection.STABLE;
    if (growthRatePct > 2) direction = VisibilityTrendDirection.RISING;
    else if (growthRatePct < -2) direction = VisibilityTrendDirection.DECLINING;

    return {
      profileId: profile.id,
      recent7DayAvg: parseFloat(recentAvg.toFixed(2)),
      previous7DayAvg: parseFloat(prevAvg.toFixed(2)),
      growthRatePct,
      direction,
      momentum: 1.15,
    };
  }
}
