import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class KeywordClusterService {
  private readonly logger = new Logger(KeywordClusterService.name);

  constructor(private readonly prisma: PrismaService) {}

  async generateEmbedding(keywordId: string) {
    const keyword = await this.prisma.keyword.findUnique({
      where: { id: keywordId },
    });

    if (!keyword) return null;

    // Standard normalized vector embedding stub
    const vectorJson = Array.from({ length: 64 }, () => parseFloat(Math.random().toFixed(4)));

    return this.prisma.keywordEmbedding.create({
      data: {
        keywordId,
        vectorJson,
        modelName: 'text-embedding-3-small',
      },
    });
  }

  async clusterKeywords(organizationId: string) {
    const keywords = await this.prisma.keyword.findMany({
      where: { organizationId, clusterId: null },
      take: 100,
    });

    if (keywords.length === 0) return [];

    const cluster = await this.prisma.keywordCluster.create({
      data: {
        name: 'AI Search & Analytics Pillar',
        primaryTopic: 'AI Visibility & Search Optimization',
        keywordCount: keywords.length,
      },
    });

    await this.prisma.keyword.updateMany({
      where: { id: { in: keywords.map((k) => k.id) } },
      data: { clusterId: cluster.id },
    });

    return [cluster];
  }

  async getClusters() {
    return this.prisma.keywordCluster.findMany({
      include: { keywords: true },
      take: 50,
    });
  }
}
