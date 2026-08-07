import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class BenchmarkEvolutionService {
  private readonly logger = new Logger(BenchmarkEvolutionService.name);

  constructor(private readonly prisma: PrismaService) {}

  async takeBenchmarkSnapshot(provider: string, medianScore = 88.0) {
    return this.prisma.benchmarkSnapshot.create({
      data: {
        provider,
        medianScore,
      },
    });
  }
}
