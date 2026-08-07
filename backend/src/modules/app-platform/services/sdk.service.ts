import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class SDKService {
  private readonly logger = new Logger(SDKService.name);

  constructor(private readonly prisma: PrismaService) {}

  async generateSDK(language = 'TYPESCRIPT') {
    return this.prisma.platformSDKArtifact.create({
      data: {
        language,
        version: 'v2.4.0',
        downloadUrl: `https://sdk.dyvin.ai/packages/${language.toLowerCase()}/v2.4.0.zip`,
      },
    });
  }

  async getSDKArtifacts() {
    return this.prisma.platformSDKArtifact.findMany();
  }
}
