import { Module } from '@nestjs/common';
import { BillingModule } from '../billing/billing.module';
import { CrawlerModule } from '../crawler/crawler.module';
import { ScanController } from './scan.controller';
import { ScanService } from './scan.service';

@Module({
  imports: [CrawlerModule, BillingModule],
  controllers: [ScanController],
  providers: [ScanService],
  exports: [ScanService],
})
export class ScanModule {}
