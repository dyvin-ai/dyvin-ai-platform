import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class RuntimeSecurityService {
  private readonly logger = new Logger(RuntimeSecurityService.name);

  constructor(private readonly prisma: PrismaService) {}

  async detectThreat(threatType = 'CREDENTIAL_STUFFING', sourceIp = '192.168.1.100') {
    return this.prisma.runtimeSecurityThreatRecord.create({
      data: {
        threatType,
        sourceIp,
        threatScore: 85.0,
        mitigated: true,
      },
    });
  }

  async getThreats() {
    return this.prisma.runtimeSecurityThreatRecord.findMany();
  }
}
