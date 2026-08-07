import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { PrismaService } from '../../../database/prisma.service';
import { AuditService } from '../../audit/audit.service';
import { CRAWLER_QUEUES } from '../crawler.constants';
import { CrawlerService, CrawlWebsiteJobData } from '../crawler.service';

@Processor(CRAWLER_QUEUES.CRAWL_WEBSITE)
export class WebsiteCrawlProcessor extends WorkerHost {
  private readonly logger = new Logger(WebsiteCrawlProcessor.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly crawlerService: CrawlerService,
    private readonly auditService: AuditService,
  ) {
    super();
  }

  async process(job: Job<CrawlWebsiteJobData>): Promise<void> {
    const { scanId, url, projectId } = job.data;
    this.logger.log(`Starting website crawl job for scan [${scanId}], URL: ${url}`);

    try {
      // 1. Update Scan status to RUNNING
      await this.prisma.scan.update({
        where: { id: scanId },
        data: {
          status: 'RUNNING',
          startedAt: new Date(),
        },
      });

      // 2. Fetch root website HTML
      let html = '';
      let statusCode = 200;
      let headers: Record<string, any> = {};

      try {
        const response = await fetch(url, {
          headers: {
            'User-Agent':
              'DyvinBot/1.0 (+https://dyvin.ai/bot; AI Visibility & Intelligence Engine)',
          },
          signal: AbortSignal.timeout(15000), // 15 seconds timeout
        });
        statusCode = response.status;
        html = await response.text();
        response.headers.forEach((value, key) => {
          headers[key] = value;
        });
      } catch (err) {
        this.logger.warn(`Failed to fetch root URL [${url}], creating placeholder scan page:`, err);
        html = `<html><head><title>Crawl Failed</title></head><body><h1>Unable to reach host</h1></body></html>`;
        statusCode = 504;
      }

      // 3. Process root page intelligence
      await this.crawlerService.processPageCrawled(scanId, url, html, statusCode, headers, 0);

      // 4. Update Scan status to COMPLETED
      await this.prisma.scan.update({
        where: { id: scanId },
        data: {
          status: 'COMPLETED',
          completedAt: new Date(),
          pagesDiscovered: 1,
        },
      });

      await this.auditService.logAction({
        action: 'SCAN_COMPLETED',
        metadata: { scanId, projectId, url },
      });

      this.logger.log(`Website crawl completed successfully for scan [${scanId}]`);
    } catch (error: any) {
      this.logger.error(`Website crawl job failed for scan [${scanId}]:`, error);

      await this.prisma.scan.update({
        where: { id: scanId },
        data: {
          status: 'FAILED',
          errorMessage: error?.message || 'Crawl job failed',
          completedAt: new Date(),
        },
      });

      await this.auditService.logAction({
        action: 'SCAN_FAILED',
        metadata: { scanId, projectId, error: error?.message },
      });

      throw error;
    }
  }
}
