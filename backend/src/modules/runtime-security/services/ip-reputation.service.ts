import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class IpReputationService {
  private readonly logger = new Logger(IpReputationService.name);

  constructor(private readonly prisma: PrismaService) {}

  async banIp(ipAddress: string) {
    return this.prisma.runtimeIpReputationRecord.upsert({
      where: { ipAddress },
      update: { isBanned: true, reputationScore: 0.0 },
      create: { ipAddress, reputationScore: 0.0, isBanned: true },
    });
  }

  async unbanIp(ipAddress: string) {
    return this.prisma.runtimeIpReputationRecord.update({
      where: { ipAddress },
      data: { isBanned: false, reputationScore: 98.5 },
    });
  }

  async getIpReputation(ipAddress: string) {
    const record = await this.prisma.runtimeIpReputationRecord.findUnique({
      where: { ipAddress },
    });
    return record || { ipAddress, reputationScore: 98.5, isBanned: false };
  }
}
