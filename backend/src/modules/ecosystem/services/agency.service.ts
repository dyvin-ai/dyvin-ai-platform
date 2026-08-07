import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class AgencyService {
  private readonly logger = new Logger(AgencyService.name);

  constructor(private readonly prisma: PrismaService) {}

  async registerAgency(agencyName: string, tier = 'SILVER') {
    return this.prisma.agencyProfile.create({
      data: {
        agencyName,
        tier,
        isVerified: true,
        clientCount: 1,
      },
    });
  }

  async getAgencies() {
    return this.prisma.agencyProfile.findMany();
  }
}
