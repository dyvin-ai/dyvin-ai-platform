import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class AiAbuseProtectionService {
  private readonly logger = new Logger(AiAbuseProtectionService.name);

  constructor(private readonly prisma: PrismaService) {}

  async logAiAbuse(organizationId: string, abuseType = 'PROMPT_INJECTION_ATTEMPT') {
    return this.prisma.runtimeAiAbuseLog.create({
      data: {
        organizationId,
        abuseType,
        isBlocked: true,
      },
    });
  }
}
