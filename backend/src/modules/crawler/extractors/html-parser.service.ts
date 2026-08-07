import { Injectable, Logger } from '@nestjs/common';
import * as cheerio from 'cheerio';
import { createHash } from 'crypto';
import { extractDomain } from '../../../common/utils/domain.util';

export interface ParsedHtmlResult {
  title: string | null;
  metaDescription: string | null;
  keywords: string | null;
  author: string | null;
  canonicalUrl: string | null;
  favicon: string | null;
  manifest: string | null;
  themeColor: string | null;
  viewport: string | null;
  openGraph: Record<string, string>;
  twitterCard: Record<string, string>;
  headings: {
    h1: string[];
    h2: string[];
    h3: string[];
    h4: string[];
    h5: string[];
    h6: string[];
  };
  wordCount: number;
  readingTimeMinutes: number;
  paragraphCount: number;
  internalLinks: Array<{ url: string; anchorText: string }>;
  externalLinks: Array<{ url: string; anchorText: string }>;
  images: Array<{ url: string; altText: string }>;
  contentHash: string;
  language: string | null;
}

@Injectable()
export class HtmlParserService {
  private readonly logger = new Logger(HtmlParserService.name);

  parseHtml(html: string, baseUrl: string): ParsedHtmlResult {
    const $ = cheerio.load(html);
    const baseDomain = extractDomain(baseUrl);

    // Title
    const title =
      $('title').text().trim() ||
      $('meta[property="og:title"]').attr('content')?.trim() ||
      null;

    // Meta Description
    const metaDescription =
      $('meta[name="description"]').attr('content')?.trim() ||
      $('meta[property="og:description"]').attr('content')?.trim() ||
      null;

    // Keywords & Author
    const keywords = $('meta[name="keywords"]').attr('content')?.trim() || null;
    const author = $('meta[name="author"]').attr('content')?.trim() || null;

    // Canonical URL
    const canonicalUrl = $('link[rel="canonical"]').attr('href')?.trim() || null;

    // Favicon & Manifest
    const favicon =
      $('link[rel="icon"]').attr('href')?.trim() ||
      $('link[rel="shortcut icon"]').attr('href')?.trim() ||
      null;
    const manifest = $('link[rel="manifest"]').attr('href')?.trim() || null;

    // Theme Color & Viewport
    const themeColor = $('meta[name="theme-color"]').attr('content')?.trim() || null;
    const viewport = $('meta[name="viewport"]').attr('content')?.trim() || null;

    // Language
    const language = $('html').attr('lang')?.trim() || null;

    // OpenGraph
    const openGraph: Record<string, string> = {};
    $('meta[property^="og:"]').each((_, el) => {
      const prop = $(el).attr('property')?.replace('og:', '');
      const content = $(el).attr('content');
      if (prop && content) {
        openGraph[prop] = content.trim();
      }
    });

    // Twitter Card
    const twitterCard: Record<string, string> = {};
    $('meta[name^="twitter:"]').each((_, el) => {
      const name = $(el).attr('name')?.replace('twitter:', '');
      const content = $(el).attr('content');
      if (name && content) {
        twitterCard[name] = content.trim();
      }
    });

    // Headings
    const headings = {
      h1: $('h1').map((_, el) => $(el).text().trim()).get(),
      h2: $('h2').map((_, el) => $(el).text().trim()).get(),
      h3: $('h3').map((_, el) => $(el).text().trim()).get(),
      h4: $('h4').map((_, el) => $(el).text().trim()).get(),
      h5: $('h5').map((_, el) => $(el).text().trim()).get(),
      h6: $('h6').map((_, el) => $(el).text().trim()).get(),
    };

    // Paragraph Count & Text Content
    const paragraphs = $('p').map((_, el) => $(el).text().trim()).get();
    const paragraphCount = paragraphs.length;
    const bodyText = $('body').text().replace(/\s+/g, ' ').trim();
    const words = bodyText.split(/\s+/).filter(Boolean);
    const wordCount = words.length;
    const readingTimeMinutes = Math.max(1, Math.ceil(wordCount / 200));

    // Content Hash
    const contentHash = createHash('sha256').update(bodyText).digest('hex');

    // Internal vs External Links
    const internalLinks: Array<{ url: string; anchorText: string }> = [];
    const externalLinks: Array<{ url: string; anchorText: string }> = [];

    $('a[href]').each((_, el) => {
      const href = $(el).attr('href')?.trim();
      const anchorText = $(el).text().trim();
      if (!href || href.startsWith('#') || href.startsWith('javascript:')) return;

      try {
        const resolved = new URL(href, baseUrl).href;
        const linkDomain = extractDomain(resolved);

        if (linkDomain === baseDomain) {
          internalLinks.push({ url: resolved, anchorText });
        } else {
          externalLinks.push({ url: resolved, anchorText });
        }
      } catch {
        // Invalid link format
      }
    });

    // Images
    const images: Array<{ url: string; altText: string }> = [];
    $('img[src]').each((_, el) => {
      const src = $(el).attr('src')?.trim();
      const altText = $(el).attr('alt')?.trim() || '';
      if (!src) return;

      try {
        const resolved = new URL(src, baseUrl).href;
        images.push({ url: resolved, altText });
      } catch {
        // Ignore invalid image src
      }
    });

    return {
      title,
      metaDescription,
      keywords,
      author,
      canonicalUrl,
      favicon,
      manifest,
      themeColor,
      viewport,
      openGraph,
      twitterCard,
      headings,
      wordCount,
      readingTimeMinutes,
      paragraphCount,
      internalLinks,
      externalLinks,
      images,
      contentHash,
      language,
    };
  }
}
