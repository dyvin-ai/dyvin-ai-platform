import { Injectable, Logger } from '@nestjs/common';
import * as cheerio from 'cheerio';

export interface ExtractedStructuredData {
  type: string;
  rawJson: Record<string, any>;
}

@Injectable()
export class StructuredDataService {
  private readonly logger = new Logger(StructuredDataService.name);

  extractStructuredData(html: string): ExtractedStructuredData[] {
    const $ = cheerio.load(html);
    const results: ExtractedStructuredData[] = [];

    // Extract JSON-LD scripts
    $('script[type="application/ld+json"]').each((_, el) => {
      const rawText = $(el).html();
      if (!rawText) return;

      try {
        const parsed = JSON.parse(rawText.trim());

        if (Array.isArray(parsed)) {
          parsed.forEach((item) => {
            if (item && typeof item === 'object') {
              const type = this.resolveType(item['@type']);
              results.push({ type, rawJson: item });
            }
          });
        } else if (parsed && typeof parsed === 'object') {
          // Handle @graph objects
          if (Array.isArray(parsed['@graph'])) {
            parsed['@graph'].forEach((graphItem: any) => {
              if (graphItem && typeof graphItem === 'object') {
                const type = this.resolveType(graphItem['@type']);
                results.push({ type, rawJson: graphItem });
              }
            });
          } else {
            const type = this.resolveType(parsed['@type']);
            results.push({ type, rawJson: parsed });
          }
        }
      } catch (err) {
        this.logger.debug('Failed to parse JSON-LD block:', err);
      }
    });

    return results;
  }

  private resolveType(rawType: any): string {
    if (!rawType) return 'Unknown';
    if (Array.isArray(rawType)) {
      return rawType[0] || 'Unknown';
    }
    return String(rawType);
  }
}
