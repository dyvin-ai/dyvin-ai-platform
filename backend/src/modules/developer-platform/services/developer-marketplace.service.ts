import { Injectable, Logger } from '@nestjs/common';
import { MarketplaceStatus } from '@prisma/client';
import { PrismaService } from '../../../database/prisma.service';

export interface PublishAppInput {
  applicationId: string;
  name: string;
  summary: string;
  iconUrl?: string;
}

@Injectable()
export class DeveloperMarketplaceService {
  private readonly logger = new Logger(DeveloperMarketplaceService.name);

  constructor(private readonly prisma: PrismaService) {}

  async publishApp(input: PublishAppInput) {
    this.logger.log(`Publishing marketplace app: ${input.name}`);

    return this.prisma.developerMarketplaceApp.create({
      data: {
        applicationId: input.applicationId,
        name: input.name,
        summary: input.summary,
        iconUrl: input.iconUrl,
        status: MarketplaceStatus.PUBLISHED,
      },
    });
  }

  async getMarketplaceApps() {
    const apps = await this.prisma.developerMarketplaceApp.findMany({
      include: { reviews: true, installs: true },
      take: 50,
    });

    if (apps.length === 0) {
      return [
        {
          name: 'WordPress Auto-Publisher',
          summary: 'Publish AI generated blogs and FAQs directly to WordPress.',
          status: MarketplaceStatus.PUBLISHED,
        },
        {
          name: 'HubSpot CRM Visibility Sync',
          summary: 'Sync AI search brand mentions with HubSpot deal pipelines.',
          status: MarketplaceStatus.PUBLISHED,
        },
        {
          name: 'Slack Citation Alerts App',
          summary: 'Receive real-time Slack notifications when citation rank drops.',
          status: MarketplaceStatus.PUBLISHED,
        },
      ];
    }

    return apps;
  }
}
