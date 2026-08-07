import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class CustomerKnowledgeGraphService {
  private readonly logger = new Logger(CustomerKnowledgeGraphService.name);

  constructor(private readonly prisma: PrismaService) {}

  async addKnowledgeNode(organizationId: string, nodeLabel: string, nodeType: string) {
    return this.prisma.customerKnowledgeNode.create({
      data: {
        organizationId,
        nodeLabel,
        nodeType,
      },
    });
  }

  async getKnowledgeGraph(organizationId: string) {
    const nodes = await this.prisma.customerKnowledgeNode.findMany({
      where: { organizationId },
    });
    return {
      organizationId,
      nodes,
      relationshipsCount: nodes.length > 0 ? nodes.length - 1 : 0,
    };
  }
}
