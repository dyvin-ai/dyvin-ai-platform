import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class AppBuilderService {
  private readonly logger = new Logger(AppBuilderService.name);

  constructor(private readonly prisma: PrismaService) {}

  async createApp(organizationId: string, appName: string, appType = 'LOW_CODE_AI_APP') {
    return this.prisma.platformAppDefinition.create({
      data: {
        organizationId,
        appName,
        appType,
        isPublished: true,
      },
    });
  }

  async getApps(organizationId: string) {
    return this.prisma.platformAppDefinition.findMany({
      where: { organizationId },
    });
  }
}
