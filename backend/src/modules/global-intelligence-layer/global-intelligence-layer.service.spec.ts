import { Test, TestingModule } from '@nestjs/testing';
import { GlobalKnowledgeGraphService } from './services/global-knowledge-graph.service';
import { ResponseArchiveService } from './services/response-archive.service';
import { CitationEvolutionService } from './services/citation-evolution.service';
import { ModelIntelligenceService } from './services/model-intelligence.service';
import { TopicEvolutionService } from './services/topic-evolution.service';
import { SourceIntelligenceService } from './services/source-intelligence.service';
import { GlobalTrendService } from './services/global-trend.service';
import { PrismaService } from '../../database/prisma.service';

describe('Phase S: Enterprise Global Intelligence Layer Spec', () => {
  let knowledgeGraphService: GlobalKnowledgeGraphService;
  let archiveService: ResponseArchiveService;
  let citationService: CitationEvolutionService;
  let modelService: ModelIntelligenceService;
  let topicService: TopicEvolutionService;
  let sourceService: SourceIntelligenceService;
  let trendService: GlobalTrendService;

  const mockPrismaService = {
    globalKnowledgeGraphNode: {
      create: jest.fn().mockImplementation(({ data }) => Promise.resolve({ id: 'node-1', ...data })),
      findMany: jest.fn().mockResolvedValue([{ id: 'node-1', label: 'GPT-4o' }]),
    },
    globalArchiveRecord: {
      create: jest.fn().mockImplementation(({ data }) => Promise.resolve({ id: 'arc-1', ...data })),
    },
    globalCitationHistoryRecord: {
      create: jest.fn().mockImplementation(({ data }) => Promise.resolve({ id: 'cit-1', ...data })),
    },
    globalModelProfileRecord: {
      create: jest.fn().mockImplementation(({ data }) => Promise.resolve({ id: 'mod-1', ...data })),
    },
    globalTopicRecord: {
      create: jest.fn().mockImplementation(({ data }) => Promise.resolve({ id: 'top-1', ...data })),
    },
    globalSourceProfileRecord: {
      create: jest.fn().mockImplementation(({ data }) => Promise.resolve({ id: 'src-1', ...data })),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GlobalKnowledgeGraphService,
        ResponseArchiveService,
        CitationEvolutionService,
        ModelIntelligenceService,
        TopicEvolutionService,
        SourceIntelligenceService,
        GlobalTrendService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    knowledgeGraphService = module.get<GlobalKnowledgeGraphService>(GlobalKnowledgeGraphService);
    archiveService = module.get<ResponseArchiveService>(ResponseArchiveService);
    citationService = module.get<CitationEvolutionService>(CitationEvolutionService);
    modelService = module.get<ModelIntelligenceService>(ModelIntelligenceService);
    topicService = module.get<TopicEvolutionService>(TopicEvolutionService);
    sourceService = module.get<SourceIntelligenceService>(SourceIntelligenceService);
    trendService = module.get<GlobalTrendService>(GlobalTrendService);
  });

  it('should traverse global AI knowledge graph nodes', async () => {
    const node = await knowledgeGraphService.addNode('node-gpt4o', 'AI_MODEL', 'GPT-4o');
    expect(node.nodeKey).toBe('node-gpt4o');

    const overview = await knowledgeGraphService.getGraphOverview();
    expect(overview.totalNodes).toBeGreaterThan(0);
  });

  it('should store append-only public AI responses in archive', async () => {
    const arc = await archiveService.archiveResponse('What is GEO?', 'Generative Engine Optimization...', 'OPENAI', 'gpt-4o', 410.0);
    expect(arc.provider).toBe('OPENAI');
  });

  it('should track citation evolution and model intelligence profiles', async () => {
    const topCitations = await citationService.getTopCitationDomains();
    expect(topCitations.length).toBeGreaterThan(0);

    const models = await modelService.getModelProfiles();
    expect(models.length).toBeGreaterThan(0);
  });

  it('should detect emerging topics and update source authority', async () => {
    const topics = await topicService.getEmergingTopics();
    expect(topics.length).toBeGreaterThan(0);

    const sources = await sourceService.getTopSources();
    expect(sources[0].authorityScore).toBeGreaterThan(90.0);
  });

  it('should calculate global trends', async () => {
    const trends = await trendService.getTrends();
    expect(trends.dailyTrend).toBeDefined();
  });
});
