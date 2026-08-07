import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class ReflectionService {
  private readonly logger = new Logger(ReflectionService.name);

  constructor(private readonly prisma: PrismaService) {}

  async reflectOnExecution(executionId: string, learnings: string) {
    return this.prisma.reflection.create({
      data: {
        executionId,
        success: true,
        learnings,
      },
    });
  }

  async getReflections() {
    return this.prisma.reflection.findMany();
  }
}
