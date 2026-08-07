import { Module } from '@nestjs/common';
import { PrismaModule } from '../../database/prisma.module';
import { AiSearchIntelligenceController } from './ai-search-intelligence.controller';
import { AiSearchDashboardService } from './services/ai-search-dashboard.service';
import { AiVisibilityService } from './services/ai-visibility.service';
import { PromptIntelligenceService } from './services/prompt-intelligence.service';
import { CitationIntelligenceService } from './services/citation-intelligence.service';
import { RetrievalIntelligenceService } from './services/retrieval-intelligence.service';
import { ModelComparisonService } from './services/model-comparison.service';
import { CompetitorVisibilityService } from './services/competitor-visibility.service';
import { DomainIntelligenceService } from './services/domain-intelligence.service';
import { UrlIntelligenceService } from './services/url-intelligence.service';
import { KeywordGeoService } from './services/keyword-geo.service';
import { SearchSchedulerService } from './services/search-scheduler.service';
import { SourceIntelligenceService } from './services/source-intelligence.service';
import { GeoRecommendationService } from './services/geo-recommendation.service';
import { GeoActionService } from './services/geo-action.service';

@Module({
  imports: [PrismaModule],
  controllers: [AiSearchIntelligenceController],
  providers: [
    AiSearchDashboardService,
    AiVisibilityService,
    PromptIntelligenceService,
    CitationIntelligenceService,
    RetrievalIntelligenceService,
    ModelComparisonService,
    CompetitorVisibilityService,
    DomainIntelligenceService,
    UrlIntelligenceService,
    KeywordGeoService,
    SearchSchedulerService,
    SourceIntelligenceService,
    GeoRecommendationService,
    GeoActionService,
  ],
  exports: [
    AiSearchDashboardService,
    AiVisibilityService,
    PromptIntelligenceService,
    CitationIntelligenceService,
    RetrievalIntelligenceService,
    ModelComparisonService,
    CompetitorVisibilityService,
    DomainIntelligenceService,
    UrlIntelligenceService,
    KeywordGeoService,
    SearchSchedulerService,
    SourceIntelligenceService,
    GeoRecommendationService,
    GeoActionService,
  ],
})
export class AiSearchIntelligenceModule {}
