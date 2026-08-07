import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class KnowledgeService {
  constructor(private readonly prisma: PrismaService) {}

  async getProjectKnowledgeGraph(projectId: string) {
    const graph = await this.prisma.knowledgeGraph.findFirst({
      where: { projectId },
      include: {
        brandProfiles: true,
        locations: true,
        contacts: true,
        _count: {
          select: {
            entities: true,
            relationships: true,
            facts: true,
            products: true,
            services: true,
            faqs: true,
          },
        },
      },
    });

    if (!graph) {
      throw new NotFoundException(
        'Knowledge graph not found for this project. Run a website scan first.',
      );
    }

    return graph;
  }

  async getProjectEntities(projectId: string) {
    const graph = await this.getProjectKnowledgeGraph(projectId);
    return this.prisma.entity.findMany({
      where: { graphId: graph.id },
      include: {
        aliases: true,
      },
      orderBy: { confidenceScore: 'desc' },
    });
  }

  async getProjectRelationships(projectId: string) {
    const graph = await this.getProjectKnowledgeGraph(projectId);
    return this.prisma.relationship.findMany({
      where: { graphId: graph.id },
      include: {
        sourceEntity: { select: { id: true, name: true, type: true } },
        targetEntity: { select: { id: true, name: true, type: true } },
      },
    });
  }

  async getProjectFacts(projectId: string) {
    const graph = await this.getProjectKnowledgeGraph(projectId);
    return this.prisma.fact.findMany({
      where: { graphId: graph.id },
      include: {
        entity: { select: { name: true, type: true } },
        sources: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getProjectProducts(projectId: string) {
    const graph = await this.getProjectKnowledgeGraph(projectId);
    return this.prisma.product.findMany({
      where: { graphId: graph.id },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getProjectServices(projectId: string) {
    const graph = await this.getProjectKnowledgeGraph(projectId);
    return this.prisma.service.findMany({
      where: { graphId: graph.id },
      orderBy: { createdAt: 'desc' },
    });
  }
}
