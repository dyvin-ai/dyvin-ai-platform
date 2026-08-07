import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class SessionSecurityService {
  private readonly logger = new Logger(SessionSecurityService.name);

  constructor(private readonly prisma: PrismaService) {}

  async rotateRefreshToken(sessionId: string, userId: string) {
    return this.prisma.runtimeSessionSecurityLog.create({
      data: {
        sessionId,
        userId,
        actionType: 'REFRESH_TOKEN_ROTATED',
      },
    });
  }

  async revokeSession(sessionId: string) {
    return {
      sessionId,
      status: 'REVOKED',
      revokedAt: new Date(),
    };
  }
}
