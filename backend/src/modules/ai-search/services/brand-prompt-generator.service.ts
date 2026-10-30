import { Injectable, Logger } from '@nestjs/common';
import { PromptType } from '@prisma/client';
import { PrismaService } from '../../../database/prisma.service';
import { WebsiteAnalysisResult } from '../../crawler/services/website-analyzer.service';

export interface GeneratedBrandPrompt {
  promptText: string;
  category: 'COMMERCIAL' | 'INFORMATIONAL' | 'COMPARISON' | 'BRAND';
  intent: string;
  priority: number;
  reason: string;
}

@Injectable()
export class BrandPromptGeneratorService {
  private readonly logger = new Logger(BrandPromptGeneratorService.name);

  constructor(private readonly prisma: PrismaService) {}

  generatePromptsForBrand(
    brandName: string,
    domain: string,
    industry?: string,
    websiteData?: WebsiteAnalysisResult,
  ): GeneratedBrandPrompt[] {
    const cleanBrand = brandName.trim();
    const cleanDomain = domain.replace(/^https?:\/\//i, '').replace(/\/.*$/, '').trim();
    const cleanIndustry = industry?.trim() || websiteData?.keywords?.[0] || 'Technology';

    const prompts: GeneratedBrandPrompt[] = [
      // 1. COMMERCIAL INTENT (3 Prompts)
      {
        promptText: `What are the top enterprise ${cleanIndustry} platforms for businesses in 2026?`,
        category: 'COMMERCIAL',
        intent: 'High commercial purchase intent category search',
        priority: 1,
        reason: 'Evaluates if brand is cited in top-of-funnel commercial vendor searches.',
      },
      {
        promptText: `Best ${cleanIndustry} solutions for scalability and market leadership`,
        category: 'COMMERCIAL',
        intent: 'Commercial product comparison query',
        priority: 2,
        reason: 'Tests unprompted recommendation for industry solutions.',
      },
      {
        promptText: `Which providers offer the most comprehensive ${cleanIndustry} tools on ${cleanDomain}?`,
        category: 'COMMERCIAL',
        intent: 'Domain-specific commercial solution search',
        priority: 3,
        reason: 'Verifies domain-linked commercial intent visibility.',
      },

      // 2. INFORMATIONAL INTENT (3 Prompts)
      {
        promptText: `How does ${cleanBrand} work and what are its core capabilities in ${cleanIndustry}?`,
        category: 'INFORMATIONAL',
        intent: 'Product architecture and capability inquiry',
        priority: 1,
        reason: 'Measures AI comprehension of the brand feature architecture.',
      },
      {
        promptText: `Key features and technical advantages of ${cleanBrand} (${cleanDomain})`,
        category: 'INFORMATIONAL',
        intent: 'Technical features and capabilities lookup',
        priority: 2,
        reason: 'Checks technical trust, schema extraction, and knowledge accuracy.',
      },
      {
        promptText: `How to choose between modern ${cleanIndustry} platforms in the enterprise`,
        category: 'INFORMATIONAL',
        intent: 'General educational selection framework',
        priority: 3,
        reason: 'Tests whether AI includes the brand as an illustrative industry example.',
      },

      // 3. COMPARISON INTENT (3 Prompts)
      {
        promptText: `What are the best alternatives to ${cleanBrand} for ${cleanIndustry}?`,
        category: 'COMPARISON',
        intent: 'Competitor and replacement exploration',
        priority: 1,
        reason: 'Identifies which competitors are cited against the brand.',
      },
      {
        promptText: `Top competitors to ${cleanBrand} (${cleanDomain}) in the ${cleanIndustry} market`,
        category: 'COMPARISON',
        intent: 'Market share and competitive peer mapping',
        priority: 2,
        reason: 'Directly maps the AI model competitive landscape for the brand.',
      },
      {
        promptText: `How does ${cleanBrand}'s capabilities and pricing compare to rivals in ${cleanIndustry}?`,
        category: 'COMPARISON',
        intent: 'Head-to-head pricing and capability analysis',
        priority: 3,
        reason: 'Checks sentiment, win-rate positioning, and price-to-value perception.',
      },

      // 4. BRAND INTENT (3 Prompts)
      {
        promptText: `Is ${cleanBrand} (${cleanDomain}) recommended for ${cleanIndustry} use cases?`,
        category: 'BRAND',
        intent: 'Direct brand endorsement and recommendation check',
        priority: 1,
        reason: 'Tests direct recommendation stance and sentiment.',
      },
      {
        promptText: `What are the main strengths and customer reputation of ${cleanBrand}?`,
        category: 'BRAND',
        intent: 'Brand sentiment and reputation inquiry',
        priority: 2,
        reason: 'Extracts sentiment rating and credibility citations.',
      },
      {
        promptText: `Official products, services, and integrations available from ${cleanBrand} at ${cleanDomain}`,
        category: 'BRAND',
        intent: 'Official offerings and domain authority index',
        priority: 3,
        reason: 'Measures owned domain citation frequency and direct linking.',
      },
    ];

    return prompts;
  }

  async persistPromptsForProject(
    aiSearchProjectId: string,
    prompts: GeneratedBrandPrompt[],
  ) {
    const created = [];
    for (const p of prompts) {
      // Check if prompt text already exists in project
      const existing = await this.prisma.aISearchPrompt.findFirst({
        where: {
          aiSearchProjectId,
          promptText: p.promptText,
        },
      });

      if (!existing) {
        const item = await this.prisma.aISearchPrompt.create({
          data: {
            aiSearchProjectId,
            promptText: p.promptText,
            type: PromptType.GENERATED,
            tags: {
              category: p.category,
              intent: p.intent,
              priority: p.priority,
              list: [p.category.toLowerCase(), 'initial-baseline'],
            },
            status: 'ACTIVE',
          },
        });
        created.push(item);
      } else {
        created.push(existing);
      }
    }
    this.logger.log(`Persisted ${created.length} initial baseline prompts for AI Search Project [${aiSearchProjectId}]`);
    return created;
  }
}
