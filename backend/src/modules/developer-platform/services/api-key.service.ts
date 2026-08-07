import { Injectable, Logger } from '@nestjs/common';
import { APIKeyStatus } from '@prisma/client';
import * as crypto from 'crypto';
import { PrismaService } from '../../../database/prisma.service';

export interface CreateAPIKeyInput {
  applicationId: string;
  prefix?: string;
  expiresInDays?: number;
}

@Injectable()
export class APIKeyService {
  private readonly logger = new Logger(APIKeyService.name);

  constructor(private readonly prisma: PrismaService) {}

  async createAPIKey(input: CreateAPIKeyInput) {
    const rawKey = `dyv_${crypto.randomBytes(24).toString('hex')}`;
    const keyHash = crypto.createHash('sha256').update(rawKey).digest('hex');
    const prefix = input.prefix || 'dyv_live';

    let expiresAt: Date | undefined;
    if (input.expiresInDays) {
      expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + input.expiresInDays);
    }

    const apiKey = await this.prisma.developerAPIKey.create({
      data: {
        applicationId: input.applicationId,
        keyHash,
        prefix,
        status: APIKeyStatus.ACTIVE,
        expiresAt,
      },
    });

    return { apiKey, rawKey };
  }

  async revokeAPIKey(keyId: string) {
    return this.prisma.developerAPIKey.update({
      where: { id: keyId },
      data: { status: APIKeyStatus.REVOKED },
    });
  }

  async getAPIKeys(applicationId?: string) {
    return this.prisma.developerAPIKey.findMany({
      where: applicationId ? { applicationId } : undefined,
      take: 50,
    });
  }
}
