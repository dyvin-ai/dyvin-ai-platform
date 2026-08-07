import { Injectable, Logger } from '@nestjs/common';
import { OAuthGrantType } from '@prisma/client';
import * as crypto from 'crypto';
import { PrismaService } from '../../../database/prisma.service';

export interface GenerateTokenInput {
  clientId: string;
  clientSecret?: string;
  grantType?: OAuthGrantType;
}

@Injectable()
export class OAuthServerService {
  private readonly logger = new Logger(OAuthServerService.name);

  constructor(private readonly prisma: PrismaService) {}

  async generateToken(input: GenerateTokenInput) {
    this.logger.log(`Generating OAuth2 token for client ${input.clientId}`);

    const accessToken = `oauth_at_${crypto.randomBytes(32).toString('hex')}`;
    const refreshToken = `oauth_rt_${crypto.randomBytes(32).toString('hex')}`;
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);

    const token = await this.prisma.developerOAuthToken.create({
      data: {
        clientId: input.clientId,
        accessToken,
        refreshToken,
        grantType: input.grantType || OAuthGrantType.CLIENT_CREDENTIALS,
        expiresAt,
      },
    });

    return token;
  }
}
