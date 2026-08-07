import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class ExecutiveDecisionService {
  private readonly logger = new Logger(ExecutiveDecisionService.name);

  constructor(private readonly prisma: PrismaService) {}

  async recordDecision(organizationId: string, decisionTitle: string) {
    return this.prisma.autoBusinessDecision.create({
      data: {
        organizationId,
        decisionTitle,
        riskLevel: 'LOW',
        confidenceScore: 95.0,
      },
    });
  }
}
