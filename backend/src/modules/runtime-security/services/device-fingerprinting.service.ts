import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class DeviceFingerprintingService {
  private readonly logger = new Logger(DeviceFingerprintingService.name);

  constructor(private readonly prisma: PrismaService) {}

  async registerDevice(userId: string, deviceHash: string, browserName = 'Chrome 125') {
    return this.prisma.runtimeDeviceFingerprintRecord.create({
      data: {
        userId,
        deviceHash,
        browserName,
        isTrusted: true,
      },
    });
  }

  async getDevices(userId: string) {
    return this.prisma.runtimeDeviceFingerprintRecord.findMany({
      where: { userId },
    });
  }
}
