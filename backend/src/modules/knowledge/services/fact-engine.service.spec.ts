import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../../database/prisma.service';
import { FactEngineService } from './fact-engine.service';

describe('FactEngineService', () => {
  let service: FactEngineService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FactEngineService,
        {
          provide: PrismaService,
          useValue: {
            fact: {
              create: jest.fn(),
            },
            knowledgeGraph: {
              update: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<FactEngineService>(FactEngineService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should record fact with source provenance and update graph fact count', async () => {
    jest.spyOn(prisma.fact, 'create').mockResolvedValue({
      id: 'fact-1',
      graphId: 'graph-1',
      entityId: 'ent-1',
      predicate: 'hasTitle',
      value: 'Dyvin AI',
      confidenceScore: 100,
    } as any);

    const fact = await service.recordFact({
      graphId: 'graph-1',
      entityId: 'ent-1',
      predicate: 'hasTitle',
      value: 'Dyvin AI',
      sourceUrl: 'https://dyvin.ai',
    });

    expect(fact.id).toBe('fact-1');
    expect(prisma.knowledgeGraph.update).toHaveBeenCalled();
  });
});
