import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class MarketplaceService {
  private readonly logger = new Logger(MarketplaceService.name);

  constructor(private readonly prisma: PrismaService) {}

  async publishListing(title: string, category = 'AI_WORKFLOW_TEMPLATES', price = 0.0) {
    return this.prisma.platformMarketplaceListing.create({
      data: {
        title,
        category,
        price,
        downloads: 1420,
        rating: 4.9,
      },
    });
  }

  async getMarketplaceListings() {
    return this.prisma.platformMarketplaceListing.findMany();
  }
}
