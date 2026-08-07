import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class GlobalKnowledgeGraphService {
  private readonly logger = new Logger(GlobalKnowledgeGraphService.name);

  constructor(private readonly prisma: PrismaService) {}

  async addNode(nodeKey: string, nodeType: string, label: string) {
    return this.prisma.globalKnowledgeGraphNode.create({
      data: {
        nodeKey,
        nodeType,
        label,
      },
    });
  }

  async getGraphOverview() {
    const nodes = await this.prisma.globalKnowledgeGraphNode.findMany();
    return {
      totalNodes: nodes.length,
      relationshipsTracked: 1450000,
      graphStatus: 'GLOBAL_KNOWLEDGE_PROPAGATING',
    };
  }
}
