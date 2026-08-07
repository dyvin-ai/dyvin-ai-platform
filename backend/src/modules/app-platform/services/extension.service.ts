import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class ExtensionService {
  private readonly logger = new Logger(ExtensionService.name);

  constructor(private readonly prisma: PrismaService) {}

  async installExtension(extensionName: string, extensionType = 'SIDEBAR_WIDGET') {
    return this.prisma.platformExtension.create({
      data: {
        extensionName,
        extensionType,
        isEnabled: true,
      },
    });
  }

  async getExtensions() {
    return this.prisma.platformExtension.findMany();
  }
}
