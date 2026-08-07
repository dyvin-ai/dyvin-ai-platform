import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class CustomerMemoryService {
  private readonly logger = new Logger(CustomerMemoryService.name);

  constructor(private readonly prisma: PrismaService) {}

  async storeMemory(organizationId: string, memoryType: string, memoryPayload: string) {
    return this.prisma.customerMemory.create({
      data: {
        organizationId,
        memoryType,
        memoryPayload,
      },
    });
  }

  async getMemories(organizationId: string) {
    return this.prisma.customerMemory.findMany({
      where: { organizationId },
    });
  }
}
