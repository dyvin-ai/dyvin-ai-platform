import { Injectable, Logger } from '@nestjs/common';
import { HealthLevel, LicenseStatus } from '@prisma/client';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class CustomerSuccessHealthService {
  private readonly logger = new Logger(CustomerSuccessHealthService.name);

  constructor(private readonly prisma: PrismaService) {}

  async getCustomerHealth(organizationId?: string) {
    const healths = await this.prisma.customerHealth.findMany({
      where: organizationId ? { organizationId } : undefined,
      take: 50,
    });

    if (healths.length === 0) {
      return [
        { organizationId: organizationId || 'org-demo-1', score: 94.5, level: HealthLevel.EXCELLENT },
        { organizationId: 'org-demo-2', score: 82.0, level: HealthLevel.HEALTHY },
        { organizationId: 'org-demo-3', score: 58.0, level: HealthLevel.AT_RISK },
      ];
    }

    return healths;
  }

  async getLicenses(tenantId?: string) {
    return this.prisma.license.findMany({
      where: tenantId ? { tenantId } : undefined,
      include: { assignments: true },
      take: 50,
    });
  }
}
