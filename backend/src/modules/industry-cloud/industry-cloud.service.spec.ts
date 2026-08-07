import { Test, TestingModule } from '@nestjs/testing';
import { IndustryIntelligenceService } from './services/industry-intelligence.service';
import { IndustryBenchmarkService } from './services/industry-benchmark.service';
import { GlobalLeaderboardService } from './services/global-leaderboard.service';
import { ResearchPublicationService } from './services/research-publication.service';
import { GlobalAuthorityService } from './services/global-authority.service';
import { PrismaService } from '../../database/prisma.service';

describe('Phase P: Enterprise AI Industry Cloud Spec', () => {
  let intelligenceService: IndustryIntelligenceService;
  let benchmarkService: IndustryBenchmarkService;
  let leaderboardService: GlobalLeaderboardService;
  let publicationService: ResearchPublicationService;
  let authorityService: GlobalAuthorityService;

  const mockPrismaService = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IndustryIntelligenceService,
        IndustryBenchmarkService,
        GlobalLeaderboardService,
        ResearchPublicationService,
        GlobalAuthorityService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    intelligenceService = module.get<IndustryIntelligenceService>(IndustryIntelligenceService);
    benchmarkService = module.get<IndustryBenchmarkService>(IndustryBenchmarkService);
    leaderboardService = module.get<GlobalLeaderboardService>(GlobalLeaderboardService);
    publicationService = module.get<ResearchPublicationService>(ResearchPublicationService);
    authorityService = module.get<GlobalAuthorityService>(GlobalAuthorityService);
  });

  it('should return industry intelligence overview and aggregate stats', async () => {
    const overview = await intelligenceService.getIndustryOverview('SAAS');
    expect(overview.industryKey).toBe('SAAS');
    expect(overview.totalTrackedCompanies).toBeGreaterThan(1000);
  });

  it('should calculate anonymous industry benchmark metrics', async () => {
    const bench = await benchmarkService.getIndustryBenchmarks('SAAS');
    expect(bench.avgVisibilityPercent).toBeGreaterThan(50);
    expect(bench.top10PercentileThreshold).toBeGreaterThan(90);
  });

  it('should return global opt-in industry leaderboards', async () => {
    const board = await leaderboardService.getLeaderboard('SAAS');
    expect(board.rankings.length).toBeGreaterThan(0);
    expect(board.rankings[0].rank).toBe(1);
  });

  it('should return research publications and detected AI trends', async () => {
    const pubs = await publicationService.getPublications();
    expect(pubs.length).toBeGreaterThan(0);

    const trends = await publicationService.getTrends();
    expect(trends.emergingTopics.length).toBeGreaterThan(0);
  });

  it('should calculate domain authority scores and momentum', async () => {
    const auth = await authorityService.getAuthorityScores('github.com');
    expect(auth.authorityScore).toBeGreaterThan(90);
    expect(auth.visibilityMomentum).toBe('ACCELERATING');
  });
});
