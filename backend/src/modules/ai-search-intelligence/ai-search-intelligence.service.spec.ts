import { Test, TestingModule } from '@nestjs/testing';
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
import { PrismaService } from '../../database/prisma.service';

describe('Phase W: Enterprise AI Search Intelligence & GEO Spec', () => {
  let dashboardService: AiSearchDashboardService;
  let visibilityService: AiVisibilityService;
  let promptService: PromptIntelligenceService;
  let citationService: CitationIntelligenceService;
  let retrievalService: RetrievalIntelligenceService;
  let modelService: ModelComparisonService;
  let competitorService: CompetitorVisibilityService;
  let domainService: DomainIntelligenceService;
  let urlService: UrlIntelligenceService;
  let keywordService: KeywordGeoService;
  let schedulerService: SearchSchedulerService;
  let sourceService: SourceIntelligenceService;
  let recommendationService: GeoRecommendationService;
  let actionService: GeoActionService;

  const mockPrismaService = {
    geoVisibilitySnapshot: {
      create: jest.fn().mockImplementation(({ data }) => Promise.resolve({ id: 'vis-1', ...data })),
    },
    geoPromptExecution: {
      create: jest.fn().mockImplementation(({ data }) => Promise.resolve({ id: 'prompt-1', ...data })),
      findMany: jest.fn().mockResolvedValue([{ id: 'prompt-1', promptText: 'Best GEO Platform' }]),
    },
    citationRecord: {
      create: jest.fn().mockImplementation(({ data }) => Promise.resolve({ id: 'cite-1', ...data })),
    },
    retrievalRecord: {
      create: jest.fn().mockImplementation(({ data }) => Promise.resolve({ id: 'ret-1', ...data })),
    },
    keywordUpload: {
      create: jest.fn().mockImplementation(({ data }) => Promise.resolve({ id: 'kw-1', ...data })),
    },
    geoAction: {
      create: jest.fn().mockImplementation(({ data }) => Promise.resolve({ id: 'act-1', ...data })),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    dashboardService = module.get<AiSearchDashboardService>(AiSearchDashboardService);
    visibilityService = module.get<AiVisibilityService>(AiVisibilityService);
    promptService = module.get<PromptIntelligenceService>(PromptIntelligenceService);
    citationService = module.get<CitationIntelligenceService>(CitationIntelligenceService);
    retrievalService = module.get<RetrievalIntelligenceService>(RetrievalIntelligenceService);
    modelService = module.get<ModelComparisonService>(ModelComparisonService);
    competitorService = module.get<CompetitorVisibilityService>(CompetitorVisibilityService);
    domainService = module.get<DomainIntelligenceService>(DomainIntelligenceService);
    urlService = module.get<UrlIntelligenceService>(UrlIntelligenceService);
    keywordService = module.get<KeywordGeoService>(KeywordGeoService);
    schedulerService = module.get<SearchSchedulerService>(SearchSchedulerService);
    sourceService = module.get<SourceIntelligenceService>(SourceIntelligenceService);
    recommendationService = module.get<GeoRecommendationService>(GeoRecommendationService);
    actionService = module.get<GeoActionService>(GeoActionService);
  });

  it('should calculate AI visibility scores and track prompt execution', async () => {
    const vis = await visibilityService.calculateVisibility('org-1');
    expect(vis.overallScore).toBe(84.5);

    const prompt = await promptService.trackPromptExecution('org-1', 'Best GEO Platform 2026', 'gpt-4o');
    expect(prompt.promptText).toBe('Best GEO Platform 2026');
  });

  it('should track citations, retrieval ranks, and model comparisons', async () => {
    const citation = await citationService.trackCitation('https://dyvin.ai/features', 'dyvin.ai', 'ChatGPT');
    expect(citation.authorityScore).toBe(85.0);

    const models = await modelService.compareModels();
    expect(models.length).toBeGreaterThan(0);
  });

  it('should benchmark competitor visibility and domain/URL intelligence', async () => {
    const comp = await competitorService.getCompetitorBenchmarks();
    expect(comp.find(c => c.competitorName.includes('Dyvin AI'))?.visibilityScore).toBe(84.5);

    const domains = await domainService.getDomainAnalytics();
    expect(domains[0].domainName).toBe('dyvin.ai');
  });

  it('should process keyword CSV uploads and generate GEO recommendations', async () => {
    const upload = await keywordService.uploadKeywords('keywords_q3.csv', 1500);
    expect(upload.keywordsCount).toBe(1500);

    const recs = await recommendationService.getGeoRecommendations();
    expect(recs[0].expectedGain).toBe('+18.4% Visibility Gain');
  });

  it('should execute one-click GEO actions and provide executive dashboard metrics', async () => {
    const action = await actionService.executeGeoAction('GENERATE_FAQ_SCHEMA');
    expect(action.status).toBe('COMPLETED');

    const overview = await dashboardService.getAiSearchOverview();
    expect(overview.overallAiVisibilityScore).toBe(84.5);
  });
});
