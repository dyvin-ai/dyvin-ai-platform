import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class CustomerWarehouseService {
  private readonly logger = new Logger(CustomerWarehouseService.name);

  constructor(private readonly prisma: PrismaService) {}

  async appendAsset(organizationId: string, assetType: string, assetData: string) {
    return this.prisma.customerWarehouse.create({
      data: {
        organizationId,
        assetType,
        assetData,
      },
    });
  }

  async getTenantWarehouse(organizationId: string) {
    return this.prisma.customerWarehouse.findMany({
      where: { organizationId },
    });
  }
}
