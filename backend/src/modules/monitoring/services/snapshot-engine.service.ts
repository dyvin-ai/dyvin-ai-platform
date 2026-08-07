import { Injectable, Logger } from '@nestjs/common';
import * as crypto from 'crypto';
import { PrismaService } from '../../../database/prisma.service';

export interface SnapshotDiffResult {
  contentHash: string;
  version: number;
  changedUrls: string[];
  changedEntities: string[];
  diffSummary: Record<string, unknown>;
}

@Injectable()
export class SnapshotEngineService {
  private readonly logger = new Logger(SnapshotEngineService.name);

  constructor(private readonly prisma: PrismaService) {}

  async createSnapshot(projectId: string, scanId: string): Promise<SnapshotDiffResult> {
    const pages = await this.prisma.scanPage.findMany({
      where: { scanId },
      select: { url: true, title: true, contentHash: true },
    });

    const concatenatedHashes = pages
      .map((p) => p.contentHash || p.url)
      .sort()
      .join('|');

    const contentHash = crypto.createHash('sha256').update(concatenatedHashes).digest('hex');

    const previousSnapshot = await this.prisma.websiteSnapshot.findFirst({
      where: { projectId },
      orderBy: { version: 'desc' },
    });

    const version = (previousSnapshot?.version || 0) + 1;
    const changedUrls: string[] = [];
    const changedEntities: string[] = [];

    if (previousSnapshot && previousSnapshot.changedUrls) {
      // Simplified diff comparison logic
      pages.forEach((p) => changedUrls.push(p.url));
    }

    const diffSummary = {
      totalPages: pages.length,
      previousHash: previousSnapshot?.contentHash || null,
      currentHash: contentHash,
      isChanged: previousSnapshot?.contentHash !== contentHash,
    };

    await this.prisma.websiteSnapshot.create({
      data: {
        projectId,
        scanId,
        version,
        contentHash,
        diffSummary,
        changedUrls,
        changedEntities,
      },
    });

    return {
      contentHash,
      version,
      changedUrls,
      changedEntities,
      diffSummary,
    };
  }
}
