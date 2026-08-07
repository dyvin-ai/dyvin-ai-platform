import { Injectable, Logger } from '@nestjs/common';
import { MemoryScope } from '@prisma/client';
import { PrismaService } from '../../../database/prisma.service';

export interface SetMemoryInput {
  organizationId: string;
  namespace: string;
  memoryKey: string;
  memoryVal: string;
  scope?: MemoryScope;
}

@Injectable()
export class AgentMemoryService {
  private readonly logger = new Logger(AgentMemoryService.name);

  constructor(private readonly prisma: PrismaService) {}

  async setMemory(input: SetMemoryInput) {
    return this.prisma.agentMemory.create({
      data: {
        organizationId: input.organizationId,
        namespace: input.namespace,
        memoryKey: input.memoryKey,
        memoryVal: input.memoryVal,
        scope: input.scope || MemoryScope.PERSISTENT,
      },
    });
  }

  async getMemory(namespace?: string, organizationId?: string) {
    return this.prisma.agentMemory.findMany({
      where: {
        ...(namespace ? { namespace } : {}),
        ...(organizationId ? { organizationId } : {}),
      },
      take: 50,
    });
  }

  async getMemoryHistory() {
    return this.prisma.memoryHistory.findMany({ take: 50 });
  }
}
