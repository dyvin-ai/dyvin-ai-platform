import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class OptimizationMemoryService {
  private readonly logger = new Logger(OptimizationMemoryService.name);

  constructor(private readonly prisma: PrismaService) {}

  async saveMemory(organizationId: string, memoryKey: string, memoryVal: any, successRate = 0.98) {
    return this.prisma.historicalMemory.create({
      data: {
        organizationId,
        memoryKey,
        memoryVal,
        successRate,
      },
    });
  }

  async getMemories(organizationId?: string, take = 50) {
    return this.prisma.historicalMemory.findMany({
      where: organizationId ? { organizationId } : undefined,
      take,
      orderBy: { updatedAt: 'desc' },
    });
  }
}
