import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { CRAWLER_QUEUES } from '../crawler.constants';
import { CrawlerService, CrawlPageJobData } from '../crawler.service';

@Processor(CRAWLER_QUEUES.CRAWL_PAGE)
export class PageCrawlProcessor extends WorkerHost {
  private readonly logger = new Logger(PageCrawlProcessor.name);

  constructor(private readonly crawlerService: CrawlerService) {
    super();
  }

  async process(job: Job<CrawlPageJobData>): Promise<void> {
    const { scanId, url, depth } = job.data;
    this.logger.log(`Processing page crawl job for scan [${scanId}], URL: ${url}`);

    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent':
            'DyvinBot/1.0 (+https://dyvin.ai/bot; AI Visibility & Intelligence Engine)',
        },
        signal: AbortSignal.timeout(10000),
      });

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
