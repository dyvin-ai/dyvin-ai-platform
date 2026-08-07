import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class ApiAbuseProtectionService {
  private readonly logger = new Logger(ApiAbuseProtectionService.name);

  constructor(private readonly prisma: PrismaService) {}

  async logApiAbuse(apiKeyId: string, abuseType = 'MASS_DATA_SCRAPING') {
    return this.prisma.runtimeApiAbuseLog.create({
      data: {
        apiKeyId,
        abuseType,
        isBlocked: true,
      },
    });
  }
}
