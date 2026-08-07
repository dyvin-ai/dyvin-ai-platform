import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class WafRuleService {
  private readonly logger = new Logger(WafRuleService.name);

  constructor(private readonly prisma: PrismaService) {}

  async createWafRule(ruleName = 'SQL_INJECTION_PREVENTION') {
    return this.prisma.runtimeWafRuleRecord.create({
      data: {
        ruleName,
        isEnabled: true,
        blockedCount: 482,
      },
    });
  }

  async getWafRules() {
    return this.prisma.runtimeWafRuleRecord.findMany();
  }
}
