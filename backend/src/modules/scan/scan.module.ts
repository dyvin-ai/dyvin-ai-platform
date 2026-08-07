import { Module } from '@nestjs/common';
import { CrawlerModule } from '../crawler/crawler.module';
import { ScanController } from './scan.controller';
import { ScanService } from './scan.service';

@Module({
  imports: [CrawlerModule],
  controllers: [ScanController],
  providers: [ScanService],
  exports: [ScanService],
})
export class ScanModule {}
