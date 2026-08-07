import { Test, TestingModule } from '@nestjs/testing';
import { getQueueToken } from '@nestjs/bullmq';
import { PrismaService } from '../../../database/prisma.service';
import { AuditService } from '../../audit/audit.service';
import { VerificationDiffEngineService } from './verification-diff-engine.service';
import { VerificationEngineService } from './verification-engine.service';
import { VerificationMetricsService } from './verification-metrics.service';
import { VERIFICATION_QUEUES } from '../verification.constants';

describe('VerificationEngineService', () => {
  let service: VerificationEngineService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VerificationEngineService,
        VerificationDiffEngineService,
        VerificationMetricsService,
        {
          provide: PrismaService,
          useValue: {
            recommendation: { findUnique: jest.fn(), update: jest.fn() },
            verification: { create: jest.fn(), update: jest.fn(), findMany: jest.fn(), findUnique: jest.fn() },
            visibilityAnalysis: { findMany: jest.fn() },
            verificationRun: { create: jest.fn() },
            verificationResult: { create: jest.fn() },
            verificationMetric: { create: jest.fn(), findMany: jest.fn() },
            verificationEvidence: { create: jest.fn(), findMany: jest.fn() },
            improvementHistory: { create: jest.fn() },
            recommendationVerification: { create: jest.fn() },
          },
        },
        {
          provide: AuditService,
          useValue: { logAction: jest.fn().mockResolvedValue(undefined) },
        },
        {
          provide: getQueueToken(VERIFICATION_QUEUES.ENGINE),
          useValue: { add: jest.fn().mockResolvedValue(undefined) },
        },
      ],
    }).compile();

    service = module.get<VerificationEngineService>(VerificationEngineService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
