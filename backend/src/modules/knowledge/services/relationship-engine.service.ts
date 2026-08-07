import { Injectable } from '@nestjs/common';
import { RelationType } from '@prisma/client';
import { PrismaService } from '../../../database/prisma.service';

export interface CreateRelationshipParams {
  graphId: string;
  sourceEntityId: string;
  targetEntityId: string;
  relationType: RelationType;
  confidenceScore?: number;
}

@Injectable()
export class RelationshipEngineService {
  constructor(private readonly prisma: PrismaService) {}

  async buildRelationship(params: CreateRelationshipParams) {
    return this.prisma.relationship.create({
      data: {
        graphId: params.graphId,
        sourceEntityId: params.sourceEntityId,
        targetEntityId: params.targetEntityId,
        relationType: params.relationType,
        confidenceScore: params.confidenceScore ?? 100,
      },
    });
  }
}
