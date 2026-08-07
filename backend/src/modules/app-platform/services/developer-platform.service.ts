import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class DeveloperPlatformService {
  private readonly logger = new Logger(DeveloperPlatformService.name);

  constructor(private readonly prisma: PrismaService) {}

  async registerDeveloper(developerName: string, email: string) {
    return this.prisma.platformDeveloperAccount.create({
      data: {
        developerName,
        email,
        tier: 'ENTERPRISE_DEVELOPER',
      },
    });
  }

  async getDevelopers() {
    return this.prisma.platformDeveloperAccount.findMany();
  }
}
