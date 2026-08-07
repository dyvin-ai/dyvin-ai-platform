import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../database/prisma.service';
import { RedisService } from '../../redis/redis.service';
import { AuditService } from '../audit/audit.service';
import { FeatureFlagService } from './feature-flag.service';

describe('FeatureFlagService', () => {
  let service: FeatureFlagService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FeatureFlagService,
        {
          provide: PrismaService,
          useValue: {
            featureFlag: {
              findUnique: jest.fn().mockImplementation(({ where }) => {
                if (where.key === 'disabled-feature') {
                  return Promise.resolve({
                    id: 'ff-2',
                    key: 'disabled-feature',
                    isEnabled: false,
                    isKillSwitched: true,
                    defaultValue: false,
                    rollouts: [],
                    audiences: [],
                  });
                }
                return Promise.resolve({
                  id: 'ff-1',
                  key: 'new-ai-reasoning-v2',
                  isEnabled: true,
                  isKillSwitched: false,
                  defaultValue: true,
                  rollouts: [],
                  audiences: [],
                });
              }),
              create: jest.fn().mockResolvedValue({ id: 'ff-1', key: 'new-ai-reasoning-v2' }),
              update: jest.fn().mockResolvedValue({ id: 'ff-1', isKillSwitched: true }),
              findMany: jest.fn().mockResolvedValue([]),
              delete: jest.fn().mockResolvedValue({ id: 'ff-1' }),
            },
            featureAudit: { create: jest.fn().mockResolvedValue({}) },
          },
        },
        {
          provide: RedisService,
          useValue: {
            get: jest.fn().mockResolvedValue(null),
            set: jest.fn().mockResolvedValue('OK'),
            del: jest.fn().mockResolvedValue(1),
          },
        },
        {
          provide: AuditService,
          useValue: { logAction: jest.fn().mockResolvedValue(undefined) },
        },
      ],
    }).compile();

    service = module.get<FeatureFlagService>(FeatureFlagService);
  });

  it('should evaluate feature flag as true when enabled and not kill-switched', async () => {
    const res = await service.evaluate('new-ai-reasoning-v2', { userId: 'u-1' });
    expect(res).toBe(true);
  });

  it('should evaluate feature flag as false when kill switch is triggered', async () => {
    const res = await service.evaluate('disabled-feature', { userId: 'u-1' });
    expect(res).toBe(false);
  });
});
