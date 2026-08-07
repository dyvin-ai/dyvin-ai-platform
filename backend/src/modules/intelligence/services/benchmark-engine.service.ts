import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class BenchmarkEngineService {
  private readonly logger = new Logger(BenchmarkEngineService.name);

  constructor(private readonly prisma: PrismaService) {}

  async upsertBenchmark(industry: string, metricName: string, averageValue: number, top10Percent: number, top1Percent: number) {
    return this.prisma.historicalBenchmark.create({
      data: {
        industry,
        metricName,
        averageValue,
        top10Percent,
        top1Percent,
      },
    });
  }

  async getBenchmarks(industry?: string) {
    return this.prisma.historicalBenchmark.findMany({
      where: industry ? { industry } : undefined,
      orderBy: { updatedAt: 'desc' },
    });
  }
}
