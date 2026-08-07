import { Test, TestingModule } from '@nestjs/testing';
import { UnifiedWarehouseService } from './services/unified-warehouse.service';
import { GlobalCitationService } from './services/global-citation.service';
import { GlobalDomainService } from './services/global-domain.service';
import { CrossModelService } from './services/cross-model.service';
import { PrismaService } from '../../database/prisma.service';

describe('Phase O: Enterprise Global Intelligence Network Spec', () => {
  let warehouseService: UnifiedWarehouseService;
  let citationService: GlobalCitationService;
  let domainService: GlobalDomainService;
  let crossModelService: CrossModelService;

  const mockPrismaService = {
    globalFact: {
      create: jest.fn().mockImplementation(({ data }) => Promise.resolve({ id: 'fact-1', ...data })),
    },
    globalCitationRecord: {
      create: jest.fn().mockImplementation(({ data }) => Promise.resolve({ id: 'cit-1', ...data })),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UnifiedWarehouseService,
        GlobalCitationService,
        GlobalDomainService,
        CrossModelService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    warehouseService = module.get<UnifiedWarehouseService>(UnifiedWarehouseService);
    citationService = module.get<GlobalCitationService>(GlobalCitationService);
    domainService = module.get<GlobalDomainService>(GlobalDomainService);
    crossModelService = module.get<CrossModelService>(CrossModelService);
  });

  it('should append facts to the unified append-only intelligence warehouse', async () => {
    const fact = await warehouseService.appendFact('exec-100', 'What is GEO?', 'OPENAI', 'gpt-4o', 95.0);
    expect(fact).toBeDefined();
    expect(fact.id).toBe('fact-1');
  });

  it('should track global public citations with authority scores', async () => {
    const citation = await citationService.trackCitation('https://wikipedia.org/wiki/AI', 'wikipedia.org', 98.0);
    expect(citation.authorityScore).toBe(98.0);
    expect(citation.domain).toBe('wikipedia.org');
  });

  it('should return domain and URL intelligence profiles', async () => {
    const profile = await domainService.getDomainProfile('github.com');
    expect(profile.domain).toBe('github.com');
    expect(profile.trustScore).toBeGreaterThan(90.0);
  });

  it('should compare model citation preferences and behaviors', async () => {
    const models = await crossModelService.compareModels();
    expect(models.length).toBeGreaterThanOrEqual(4);
    expect(models[0].provider).toBe('OPENAI');
  });
});
