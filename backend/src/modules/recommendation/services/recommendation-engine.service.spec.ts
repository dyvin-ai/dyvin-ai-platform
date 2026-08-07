import { Test, TestingModule } from '@nestjs/testing';
import { getQueueToken } from '@nestjs/bullmq';
import { PrismaService } from '../../../database/prisma.service';
import { AuditService } from '../../audit/audit.service';
import { DependencyEngineService } from './dependency-engine.service';
import { DuplicateEngineService } from './duplicate-engine.service';
import { ImpactEngineService } from './impact-engine.service';
import { PriorityEngineService } from './priority-engine.service';
import { RecommendationEngineService } from './recommendation-engine.service';
import { RECOMMENDATION_QUEUES } from '../recommendation.constants';

describe('RecommendationEngineService', () => {
  let service: RecommendationEngineService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RecommendationEngineService,
        PriorityEngineService,
        ImpactEngineService,
        DependencyEngineService,
        DuplicateEngineService,
        {
          provide: PrismaService,
          useValue: {
            visibilityAnalysis: { findUnique: jest.fn() },
            recommendation: { create: jest.fn(), findMany: jest.fn(), findUnique: jest.fn() },
            recommendationEvidence: { create: jest.fn(), findMany: jest.fn() },
            recommendationImpact: { create: jest.fn() },
            recommendationDependency: { createMany: jest.fn(), findMany: jest.fn() },
          },
        },
        {
          provide: AuditService,
          useValue: { logAction: jest.fn().mockResolvedValue(undefined) },
        },
        {
          provide: getQueueToken(RECOMMENDATION_QUEUES.ENGINE),
          useValue: { add: jest.fn().mockResolvedValue(undefined) },
        },
      ],
    }).compile();

    service = module.get<RecommendationEngineService>(RecommendationEngineService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
