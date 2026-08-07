import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../../database/prisma.service';
import { SnapshotEngineService } from './snapshot-engine.service';

describe('SnapshotEngineService', () => {
  let service: SnapshotEngineService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SnapshotEngineService,
        {
          provide: PrismaService,
          useValue: {
            scanPage: { findMany: jest.fn().mockResolvedValue([{ url: 'https://example.com', title: 'Home', contentHash: 'abc' }]) },
            websiteSnapshot: { findFirst: jest.fn().mockResolvedValue(null), create: jest.fn().mockResolvedValue({ version: 1 }) },
          },
        },
      ],
    }).compile();

    service = module.get<SnapshotEngineService>(SnapshotEngineService);
  });

  it('should generate content hash and snapshot diff summary', async () => {
    const res = await service.createSnapshot('proj-1', 'scan-1');
    expect(res.contentHash).toBeDefined();
    expect(res.version).toBe(1);
  });
});
