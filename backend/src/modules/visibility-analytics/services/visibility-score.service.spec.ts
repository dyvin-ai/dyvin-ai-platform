import { Test, TestingModule } from '@nestjs/testing';
import { VisibilityCategory, VisibilityStatus } from '@prisma/client';
import { PrismaService } from '../../../database/prisma.service';
import { AuditService } from '../../audit/audit.service';
import { FeatureFlagService } from '../../feature-flag/feature-flag.service';
import { VisibilityScoreService } from './visibility-score.service';

describe('VisibilityScoreService', () => {
  let service: VisibilityScoreService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VisibilityScoreService,
        {
          provide: PrismaService,
          useValue: {
            organization: {
              findUnique: jest.fn().mockResolvedValue({ id: 'org-101' }),
            },
            aIVisibilityProfile: {
              findFirst: jest.fn().mockResolvedValue(null),
              create: jest.fn().mockResolvedValue({
                id: 'org-101',
                organizationId: 'org-101',
                overallScore: 82.5,
                status: VisibilityStatus.HEALTHY,
              }),
              update: jest.fn().mockResolvedValue({
                id: 'org-101',
                organizationId: 'org-101',
                overallScore: 82.5,
                status: VisibilityStatus.HEALTHY,
              }),
              upsert: jest.fn().mockResolvedValue({
                id: 'org-101',
                organizationId: 'org-101',
                overallScore: 82.5,
                status: VisibilityStatus.HEALTHY,
              }),
            },
            aIVisibilitySnapshot: {
              create: jest.fn().mockResolvedValue({ id: 'snap-101' }),
            },
          },
        },
        {
          provide: AuditService,
          useValue: { logAction: jest.fn().mockResolvedValue(undefined) },
        },
        {
          provide: FeatureFlagService,
          useValue: { evaluate: jest.fn().mockResolvedValue(true) },
        },
      ],
    }).compile();

    service = module.get<VisibilityScoreService>(VisibilityScoreService);
  });

  it('should calculate weighted AI visibility score and save snapshot', async () => {
    const result = await service.calculateScore('org-101');

    expect(result).toBeDefined();
    expect(result.overallScore).toBeGreaterThan(0);
    expect(result.status).toBe(VisibilityStatus.HEALTHY);
    expect(result.categoryScores[VisibilityCategory.CITATION]).toBeDefined();
  });
});
