import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class GeoActionService {
  private readonly logger = new Logger(GeoActionService.name);

  constructor(private readonly prisma: PrismaService) {}

  async executeGeoAction(actionType: string) {
    return this.prisma.geoAction.create({
      data: {
        actionType,
        status: 'COMPLETED',
      },
    });
  }
}
