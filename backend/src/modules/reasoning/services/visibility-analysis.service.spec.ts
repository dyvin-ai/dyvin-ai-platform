import { Test, TestingModule } from '@nestjs/testing';
import { getQueueToken } from '@nestjs/bullmq';
import { PrismaService } from '../../../database/prisma.service';
import { AuditService } from '../../audit/audit.service';
import { AuthorityEngineService } from './authority-engine.service';
import { BrandConsistencyService } from './brand-consistency.service';
import { EntityCoverageService } from './entity-coverage.service';
import { KnowledgeGapEngineService } from './knowledge-gap-engine.service';
import { ReasoningEngineService } from './reasoning-engine.service';
import { ScoringEngineService } from './scoring-engine.service';
import { VisibilityAnalysisService } from './visibility-analysis.service';
import { REASONING_QUEUES } from '../reasoning.constants';

describe('VisibilityAnalysisService', () => {
  let service: VisibilityAnalysisService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VisibilityAnalysisService,
        ScoringEngineService,
        KnowledgeGapEngineService,
        EntityCoverageService,
        BrandConsistencyService,
        AuthorityEngineService,
        {
          provide: ReasoningEngineService,
          useValue: {
            generateReasoningForScore: jest.fn().mockResolvedValue({
              category: 'OVERALL',
              explanation: 'Mock Explanation',
              confidence: 90,
              impact: 'HIGH',
              priority: 1,
              evidence: [{ evidenceText: 'Mock Evidence' }],
            }),
          },
        },
        {
          provide: PrismaService,
          useValue: {
            scan: { findFirst: jest.fn(), findUnique: jest.fn() },
            visibilityAnalysis: { create: jest.fn(), update: jest.fn(), findMany: jest.fn(), findUnique: jest.fn() },
            project: { findUnique: jest.fn() },
            knowledgeGraph: { findFirst: jest.fn() },
            visibilityScore: { createMany: jest.fn() },
            knowledgeGap: { createMany: jest.fn() },
            entityCoverage: { createMany: jest.fn() },
            authoritySignal: { createMany: jest.fn() },
            reasoningSession: { create: jest.fn() },
            reasoningStep: { create: jest.fn() },
            reasoningEvidence: { createMany: jest.fn() },
          },
        },
        {
          provide: AuditService,
          useValue: { logAction: jest.fn().mockResolvedValue(undefined) },
        },
        {
          provide: getQueueToken(REASONING_QUEUES.VISIBILITY_ANALYSIS),
          useValue: { add: jest.fn().mockResolvedValue(undefined) },
        },
      ],
    }).compile();

    service = module.get<VisibilityAnalysisService>(VisibilityAnalysisService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
