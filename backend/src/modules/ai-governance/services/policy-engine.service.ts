import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class PolicyEngineService {
  private readonly logger = new Logger(PolicyEngineService.name);

  constructor(private readonly prisma: PrismaService) {}

  async createPolicy(organizationId: string, policyName: string, policyType = 'SECURITY_AND_COMPLIANCE') {
    return this.prisma.governancePolicy.create({
      data: {
        organizationId,
        policyName,
        policyType,
        isEnforced: true,
      },
    });
  }

  async getPolicies(organizationId: string) {
    return this.prisma.governancePolicy.findMany({
      where: { organizationId },
    });
  }
}
