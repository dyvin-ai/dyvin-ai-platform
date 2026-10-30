import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { PrismaService } from '../../../database/prisma.service';
import { AuditService } from '../../audit/audit.service';
import { CRAWLER_QUEUES } from '../crawler.constants';
import { CrawlerService, CrawlWebsiteJobData } from '../crawler.service';
import { CrawlerSafetyService } from '../services/crawler-safety.service';

@Processor(CRAWLER_QUEUES.CRAWL_WEBSITE)
export class WebsiteCrawlProcessor extends WorkerHost {
  private readonly logger = new Logger(WebsiteCrawlProcessor.name);
  private readonly crawlerSafety = new CrawlerSafetyService();

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

      // 2. Safely fetch root website HTML with per-hop SSRF validation
      let html = '';
      let statusCode = 200;
      let headers: Record<string, any> = {};

      try {
        let currentUrl = url;
        let redirectsCount = 0;
        const maxRedirects = 3;
        let response: Response | null = null;

        while (redirectsCount <= maxRedirects) {
          const safety = this.crawlerSafety.validateUrlSafety(currentUrl);
          if (!safety.isAllowed) {
            throw new Error(`SSRF blocked: ${safety.reason}`);
          }

          const res = await fetch(currentUrl, {
            headers: {
              'User-Agent':
                'DyvinBot/1.0 (+https://dyvin.ai/bot; AI Visibility & Intelligence Engine)',
            },
            redirect: 'manual',
            signal: AbortSignal.timeout(15000),
          });

          if ([301, 302, 303, 307, 308].includes(res.status)) {
            const loc = res.headers.get('location');
            if (loc) {
              currentUrl = new URL(loc, currentUrl).toString();
              redirectsCount++;
              continue;
            }
          }

          response = res;
          break;
        }

        if (!response) {
          throw new Error('Too many redirects or no response received');
        }

        statusCode = response.status;
        html = await response.text();
        response.headers.forEach((value, key) => {
          headers[key] = value;
        });
      } catch (err: any) {
        this.logger.warn(`Failed to fetch root URL [${url}]: ${err.message}`);
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
