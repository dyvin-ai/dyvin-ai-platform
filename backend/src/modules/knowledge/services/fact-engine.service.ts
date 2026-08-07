import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';

export interface CreateFactParams {
  graphId: string;
  entityId: string;
  predicate: string;
  value: string;
  confidenceScore?: number;
  sourceUrl: string;
  htmlSelector?: string;
}

@Injectable()
export class FactEngineService {
  constructor(private readonly prisma: PrismaService) {}

  async recordFact(params: CreateFactParams) {
    const confidenceScore = params.confidenceScore ?? 100;

    const fact = await this.prisma.fact.create({
      data: {
        graphId: params.graphId,
        entityId: params.entityId,
        predicate: params.predicate,
        value: params.value,
        confidenceScore,
        sources: {
          create: {
            sourceUrl: params.sourceUrl,
            htmlSelector: params.htmlSelector || null,
          },
        },
      },
      include: {
        sources: true,
      },
    });

    // Update KnowledgeGraph fact count
    await this.prisma.knowledgeGraph.update({
      where: { id: params.graphId },
      data: {
        factCount: { increment: 1 },
      },
    });

    return fact;
  }
}
