import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { CRAWLER_QUEUES } from '../crawler.constants';
import { CrawlerService, CrawlPageJobData } from '../crawler.service';
import { CrawlerSafetyService } from '../services/crawler-safety.service';

@Processor(CRAWLER_QUEUES.CRAWL_PAGE)
export class PageCrawlProcessor extends WorkerHost {
  private readonly logger = new Logger(PageCrawlProcessor.name);
  private readonly crawlerSafety = new CrawlerSafetyService();

  constructor(private readonly crawlerService: CrawlerService) {
    super();
  }

  async process(job: Job<CrawlPageJobData>): Promise<void> {
    const { scanId, url, depth } = job.data;
    this.logger.log(`Processing page crawl job for scan [${scanId}], URL: ${url}`);

    try {
      let currentUrl = url;
      let redirectsCount = 0;
      const maxRedirects = 3;
      let response: Response | null = null;

      while (redirectsCount <= maxRedirects) {
        const safety = this.crawlerSafety.validateUrlSafety(currentUrl, depth);
        if (!safety.isAllowed) {
          throw new Error(`SSRF or limit blocked on target [${currentUrl}]: ${safety.reason}`);
        }

        const res = await fetch(currentUrl, {
          headers: {
            'User-Agent':
              'DyvinBot/1.0 (+https://dyvin.ai/bot; AI Visibility & Intelligence Engine)',
          },
          redirect: 'manual',
          signal: AbortSignal.timeout(10000),
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

      const statusCode = response.status;
      const html = await response.text();
      const headers: Record<string, any> = {};
      response.headers.forEach((v, k) => {
        headers[k] = v;
      });

      await this.crawlerService.processPageCrawled(
        scanId,
        url,
        html,
        statusCode,
        headers,
        depth,
      );
    } catch (error) {
      this.logger.error(`Page crawl failed for URL [${url}]:`, error);
      throw error;
    }
  }
}

