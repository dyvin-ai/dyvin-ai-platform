import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class IntelligenceWarehouseService {
  private readonly logger = new Logger(IntelligenceWarehouseService.name);

  constructor(private readonly prisma: PrismaService) {}

  async storeResponse(data: {
    organizationId: string;
    provider: string;
    model: string;
    prompt: string;
    rawResponse: string;
    confidence?: number;
    costUsd?: number;
  }) {
    return this.prisma.historicalResponse.create({
      data: {
        organizationId: data.organizationId,
        provider: data.provider,
        model: data.model,
        prompt: data.prompt,
        rawResponse: data.rawResponse,
        confidence: data.confidence ?? 1.0,
        costUsd: data.costUsd ?? 0.0,
      },
    });
  }

  async storeCitation(data: {
    organizationId: string;
    url: string;
    domain: string;
    authority?: number;
    category?: string;
  }) {
    return this.prisma.historicalCitation.create({
      data: {
        organizationId: data.organizationId,
        url: data.url,
        domain: data.domain,
        authority: data.authority ?? 0.5,
        category: data.category || 'DOCUMENTATION',
      },
    });
  }

  async getHistoricalResponses(organizationId?: string, take = 50) {
    return this.prisma.historicalResponse.findMany({
      where: organizationId ? { organizationId } : undefined,
      take,
      orderBy: { createdAt: 'desc' },
    });
  }

  async getHistoricalCitations(organizationId?: string, take = 50) {
    return this.prisma.historicalCitation.findMany({
      where: organizationId ? { organizationId } : undefined,
      take,
      orderBy: { createdAt: 'desc' },
    });
  }

  async replayResponse(responseId: string) {
    const historical = await this.prisma.historicalResponse.findUnique({
      where: { id: responseId },
    });

    if (!historical) {
      throw new Error(`Historical response ID ${responseId} not found`);
    }

    return {
      replayedAt: new Date(),
      originalResponse: historical,
      replayStatus: 'SUCCESS',
    };
  }
}
