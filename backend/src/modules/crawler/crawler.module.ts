import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { CRAWLER_QUEUES } from './crawler.constants';
import { CrawlerService } from './crawler.service';
import { HtmlParserService } from './extractors/html-parser.service';
import { SecurityDetectorService } from './extractors/security-detector.service';
import { StructuredDataService } from './extractors/structured-data.service';
import { TechnologyDetectorService } from './extractors/technology-detector.service';
import { PageCrawlProcessor } from './processors/page-crawl.processor';
import { WebsiteCrawlProcessor } from './processors/website-crawl.processor';

@Module({
  imports: [
    BullModule.registerQueue(
      { name: CRAWLER_QUEUES.CRAWL_WEBSITE },
      { name: CRAWLER_QUEUES.CRAWL_PAGE },
      { name: CRAWLER_QUEUES.EXTRACT_ASSET },
      { name: CRAWLER_QUEUES.PARSE_STRUCTURED_DATA },
    ),
  ],
  providers: [
    CrawlerService,
    HtmlParserService,
    StructuredDataService,
    TechnologyDetectorService,
    SecurityDetectorService,
    WebsiteCrawlProcessor,
    PageCrawlProcessor,
  ],
  exports: [
    CrawlerService,
    HtmlParserService,
    StructuredDataService,
    TechnologyDetectorService,
    SecurityDetectorService,
  ],
})
export class CrawlerModule {}
