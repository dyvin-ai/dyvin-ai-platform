import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { Queue } from 'bullmq';
import { extractDomain, extractSubdomain } from '../../common/utils/domain.util';
import { PrismaService } from '../../database/prisma.service';
import { CRAWLER_QUEUES } from './crawler.constants';
import { HtmlParserService } from './extractors/html-parser.service';
import { SecurityDetectorService } from './extractors/security-detector.service';
import { StructuredDataService } from './extractors/structured-data.service';
import { TechnologyDetectorService } from './extractors/technology-detector.service';

export interface CrawlWebsiteJobData {
  scanId: string;
  projectId: string;
  websiteId: string;
  url: string;
}

export interface CrawlPageJobData {
  scanId: string;
  url: string;
  depth: number;
}

@Injectable()
export class CrawlerService {
  private readonly logger = new Logger(CrawlerService.name);

  constructor(
    @InjectQueue(CRAWLER_QUEUES.CRAWL_WEBSITE)
    private readonly websiteQueue: Queue<CrawlWebsiteJobData>,
    @InjectQueue(CRAWLER_QUEUES.CRAWL_PAGE)
    private readonly pageQueue: Queue<CrawlPageJobData>,
    private readonly prisma: PrismaService,
    private readonly htmlParser: HtmlParserService,
    private readonly structuredDataExtractor: StructuredDataService,
    private readonly technologyDetector: TechnologyDetectorService,
    private readonly securityDetector: SecurityDetectorService,
  ) {}

  async enqueueWebsiteCrawl(jobData: CrawlWebsiteJobData): Promise<void> {
    await this.websiteQueue.add('crawl-website-job', jobData, {
      attempts: 3,
      backoff: { type: 'exponential', delay: 2000 },
      removeOnComplete: 100,
    });
    this.logger.log(`Enqueued website crawl job for scan [${jobData.scanId}]`);
  }

  async processPageCrawled(
    scanId: string,
    url: string,
    html: string,
    statusCode: number,
    headers: Record<string, any> = {},
    depth: number = 0,
  ) {
    const domain = extractDomain(url);
    const subdomain = extractSubdomain(url);
    const urlObj = new URL(url);
    const path = urlObj.pathname;

    // 1. Parse HTML DOM & Extract Metadata
    const parsedHtml = this.htmlParser.parseHtml(html, url);

    // 2. Extract Structured Data (JSON-LD, Schema.org)
    const structuredDataList = this.structuredDataExtractor.extractStructuredData(html);

    // 3. Detect Technologies
    const technologies = this.technologyDetector.detectTechnologies(html, headers);

    // 4. Security Evaluation
    const security = this.securityDetector.evaluateSecurity(url, html, headers);

    // 5. Store in Database within single transaction
    const scanPage = await this.prisma.$transaction(async (tx) => {
      const page = await tx.scanPage.create({
        data: {
          scanId,
          url,
          domain,
          subdomain,
          path,
          statusCode,
          contentType: headers['content-type'] || 'text/html',
          title: parsedHtml.title,
          metaDescription: parsedHtml.metaDescription,
          wordCount: parsedHtml.wordCount,
          readingTime: parsedHtml.readingTimeMinutes,
          contentHash: parsedHtml.contentHash,
          language: parsedHtml.language || 'en',
          canonicalUrl: parsedHtml.canonicalUrl || url,
          isCanonical: parsedHtml.canonicalUrl ? parsedHtml.canonicalUrl === url : true,
          depth,
          headers: headers as any,
        },
      });

      // Save Metadata Entries
      const metadataEntries: Array<{ scanPageId: string; key: string; value: string }> = [];
      if (parsedHtml.keywords) metadataEntries.push({ scanPageId: page.id, key: 'keywords', value: parsedHtml.keywords });
      if (parsedHtml.author) metadataEntries.push({ scanPageId: page.id, key: 'author', value: parsedHtml.author });
      if (parsedHtml.favicon) metadataEntries.push({ scanPageId: page.id, key: 'favicon', value: parsedHtml.favicon });
      if (parsedHtml.viewport) metadataEntries.push({ scanPageId: page.id, key: 'viewport', value: parsedHtml.viewport });

      Object.entries(parsedHtml.openGraph).forEach(([k, v]) => {
        metadataEntries.push({ scanPageId: page.id, key: `og:${k}`, value: v });
      });

      Object.entries(parsedHtml.twitterCard).forEach(([k, v]) => {
        metadataEntries.push({ scanPageId: page.id, key: `twitter:${k}`, value: v });
      });

      if (metadataEntries.length > 0) {
        await tx.scanMetadata.createMany({ data: metadataEntries });
      }

      // Save Structured Data
      if (structuredDataList.length > 0) {
        await tx.structuredData.createMany({
          data: structuredDataList.map((sd) => ({
            scanPageId: page.id,
            type: sd.type,
            rawJson: sd.rawJson,
          })),
        });
      }

      // Save Technologies
      if (technologies.length > 0) {
        await tx.technology.createMany({
          data: technologies.map((t) => ({
            scanId,
            scanPageId: page.id,
            name: t.name,
            category: t.category,
            confidence: t.confidence,
            version: t.version || null,
          })),
        });
      }

      // Save Security Finding
      await tx.securityFinding.create({
        data: {
          scanId,
          scanPageId: page.id,
          hasHttps: security.hasHttps,
          hsts: security.hsts,
          csp: security.csp,
          xFrameOptions: security.xFrameOptions,
          robotsMeta: security.robotsMeta,
          score: security.score,
        },
      });

      // Save Assets (Images)
      if (parsedHtml.images.length > 0) {
        await tx.scanAsset.createMany({
          data: parsedHtml.images.map((img) => ({
            scanId,
            scanPageId: page.id,
            type: 'IMAGE',
            url: img.url,
            altText: img.altText || null,
          })),
        });
      }

      // Save Content Hash
      await tx.contentHash.create({
        data: {
          scanPageId: page.id,
          hash: parsedHtml.contentHash,
          algorithm: 'sha256',
        },
      });

      // Increment scan stats
      await tx.scan.update({
        where: { id: scanId },
        data: {
          pagesCrawled: { increment: 1 },
        },
      });

      return page;
    });

    this.logger.log(`Successfully processed scan page [${url}] for scan [${scanId}]`);
    return scanPage;
  }
}
