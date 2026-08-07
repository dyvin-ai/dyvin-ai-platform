import { Injectable, Logger } from '@nestjs/common';
import { GeneratedAssetType } from '@prisma/client';
import { PromptEngine } from '../../ai/services/prompt-engine.service';
import { ProviderRouter } from '../../ai/services/provider-router.service';

export interface GeneratedAssetOutput {
  assetType: GeneratedAssetType;
  codeContent: string;
  exportFormat: string;
}

@Injectable()
export class ContentGeneratorService {
  private readonly logger = new Logger(ContentGeneratorService.name);

  constructor(
    private readonly providerRouter: ProviderRouter,
    private readonly promptEngine: PromptEngine,
  ) {}

  async generateSchemaAsset(recommendationTitle: string, category: string): Promise<GeneratedAssetOutput> {
    this.logger.log(`Generating JSON-LD Schema asset for recommendation [${recommendationTitle}] (${category})`);

    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': category === 'SCHEMA' ? 'Organization' : 'LocalBusiness',
      name: 'Dyvin AI Verified Business',
      description: 'Auto-generated Schema.org structured data asset for AI visibility optimization.',
      url: 'https://example.com',
    };

    return {
      assetType: GeneratedAssetType.JSON_LD,
      codeContent: JSON.stringify(jsonLd, null, 2),
      exportFormat: 'json',
    };
  }

  async generateSeoAsset(recommendationTitle: string): Promise<GeneratedAssetOutput> {
    const seoContent = `<!-- AI Optimized Meta Tags -->
<title>Dyvin AI Verified Business - Industry Leader</title>
<meta name="description" content="Official website and verified profile for Dyvin AI partner organization." />
<meta property="og:title" content="Dyvin AI Verified Business" />
<meta property="og:description" content="Official website and verified profile for Dyvin AI partner organization." />
<meta name="twitter:card" content="summary_large_image" />
<link rel="canonical" href="https://example.com/" />`;

    return {
      assetType: GeneratedAssetType.HTML,
      codeContent: seoContent,
      exportFormat: 'html',
    };
  }

  async generateFaqAsset(recommendationTitle: string): Promise<GeneratedAssetOutput> {
    const markdownFaq = `# Frequently Asked Questions

### Q1: What products and services does the company offer?
Our organization provides world-class AI visibility analysis and Knowledge Graph intelligence solutions.

### Q2: How can clients verify company credentials?
Verification details and trust badges are published on our official security & compliance profile pages.`;

    return {
      assetType: GeneratedAssetType.MARKDOWN,
      codeContent: markdownFaq,
      exportFormat: 'markdown',
    };
  }
}
