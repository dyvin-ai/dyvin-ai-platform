import { Module } from '@nestjs/common';
import { AISearchModule } from '../ai-search/ai-search.module';
import { CitationModule } from '../citation/citation.module';
import { CompetitorModule } from '../competitor/competitor.module';
import { VisibilityAnalyticsModule } from '../visibility-analytics/visibility-analytics.module';
import { OverviewController } from './overview.controller';
import { OverviewService } from './overview.service';

@Module({
  imports: [
    VisibilityAnalyticsModule,
    CompetitorModule,
    CitationModule,
    AISearchModule,
  ],
  controllers: [OverviewController],
  providers: [OverviewService],
  exports: [OverviewService],
})
export class OverviewModule {}
