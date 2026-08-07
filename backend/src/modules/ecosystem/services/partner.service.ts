import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class PartnerService {
  private readonly logger = new Logger(PartnerService.name);

  constructor(private readonly prisma: PrismaService) {}

  async registerPartner(companyName: string, partnerType = 'TECHNOLOGY') {
    return this.prisma.partnerProfile.create({
      data: {
        companyName,
        partnerType,
        status: 'ACTIVE',
      },
    });
  }

  async getPartners() {
    return this.prisma.partnerProfile.findMany();
  }
}
