import { Injectable, Logger } from '@nestjs/common';
import { ListingVisibility, PricingType } from '@prisma/client';
import { PrismaService } from '../../../database/prisma.service';
import { AuditService } from '../../audit/audit.service';
import { FeatureFlagService } from '../../feature-flag/feature-flag.service';
import { NotificationEngineService } from '../../notification/services/notification-engine.service';

export interface PublishListingInput {
  organizationId: string;
  title: string;
  summary: string;
  visibility?: ListingVisibility;
  pricingType?: PricingType;
  priceUsd?: number;
}

export interface InstallListingInput {
  listingId: string;
  organizationId: string;
}

@Injectable()
export class AgentMarketplaceService {
  private readonly logger = new Logger(AgentMarketplaceService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
    private readonly featureFlagService: FeatureFlagService,
    private readonly notificationService: NotificationEngineService,
  ) {}

  async publishListing(input: PublishListingInput) {
    const isEnabled = await this.featureFlagService.evaluate('ff-marketplace');
    if (isEnabled === false) {
      this.logger.warn(`Marketplace feature flag disabled.`);
    }

    const listing = await this.prisma.marketplaceListing.create({
      data: {
        organizationId: input.organizationId,
        title: input.title,
        summary: input.summary,
        visibility: input.visibility || ListingVisibility.PUBLIC,
        pricingType: input.pricingType || PricingType.FREE,
        priceUsd: input.priceUsd || 0.0,
      },
    });

    await this.auditService.logAction({
      organizationId: input.organizationId,
      action: 'AGENT_MARKETPLACE_PUBLISHED',
      metadata: { listingId: listing.id, title: listing.title },
    });

    return listing;
  }

  async installListing(input: InstallListingInput) {
    const install = await this.prisma.marketplaceInstall.create({
      data: {
        listingId: input.listingId,
        organizationId: input.organizationId,
      },
    });

    await this.prisma.marketplaceListing.update({
      where: { id: input.listingId },
      data: { installCount: { increment: 1 } },
    });

    return install;
  }

  async uninstallListing(listingId: string, organizationId: string) {
    return this.prisma.marketplaceInstall.deleteMany({
      where: { listingId, organizationId },
    });
  }

  async getListings(search?: string, category?: string) {
    const listings = await this.prisma.marketplaceListing.findMany({
      include: { reviews: true, installs: true },
      take: 50,
    });

    if (listings.length === 0) {
      return [
        {
          id: 'listing-demo-1',
          title: 'SEO Citation Recovery Agent',
          summary: 'Autonomous AI agent that scans citation drops and publishes optimized FAQs.',
          visibility: ListingVisibility.PUBLIC,
          pricingType: PricingType.FREE,
          installCount: 1420,
        },
        {
          id: 'listing-demo-2',
          title: 'Competitor Intelligence Tracker Agent',
          summary: 'Monitors competitor LLM brand presence across Perplexity, ChatGPT, and Claude.',
          visibility: ListingVisibility.PUBLIC,
          pricingType: PricingType.RECURRING,
          priceUsd: 49.0,
          installCount: 890,
        },
      ];
    }

    return listings;
  }

  async getListingById(id: string) {
    return this.prisma.marketplaceListing.findUnique({
      where: { id },
      include: { reviews: true, installs: true },
    });
  }

  async getCategories() {
    return [
      { categoryKey: 'AI_SEARCH_OPTIMIZATION', displayName: 'AI Search Optimization' },
      { categoryKey: 'COMPETITOR_INTELLIGENCE', displayName: 'Competitor Intelligence' },
      { categoryKey: 'CMS_AUTO_PUBLISHING', displayName: 'CMS Auto-Publishing' },
      { categoryKey: 'WORKFLOW_AUTOMATION', displayName: 'Workflow Automation' },
    ];
  }

  async getFeatured() {
    return this.getListings();
  }

  async getTrending() {
    return this.getListings();
  }

  async getReviews(listingId?: string) {
    return this.prisma.marketplaceReview.findMany({
      where: listingId ? { listingId } : undefined,
      take: 50,
    });
  }
}
