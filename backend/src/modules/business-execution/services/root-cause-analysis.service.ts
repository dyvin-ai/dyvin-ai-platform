import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class RootCauseAnalysisService {
  private readonly logger = new Logger(RootCauseAnalysisService.name);

  constructor(private readonly prisma: PrismaService) {}

  async analyzeRootCause(opportunityId: string) {
    return this.prisma.autoRootCauseAnalysis.create({
      data: {
        opportunityId,
        primaryCause: 'Missing Structured FAQ Schema & Outdated Technical Docs',
        confidencePct: 96.5,
      },
    });
  }

  async getRootCauses() {
    return this.prisma.autoRootCauseAnalysis.findMany();
  }
}
