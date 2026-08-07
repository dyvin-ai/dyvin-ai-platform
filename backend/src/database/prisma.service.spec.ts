import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from './prisma.service';

describe('PrismaService', () => {
  let service: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaService],
    }).compile();

    service = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should report healthy when queryRaw succeeds', async () => {
    jest.spyOn(service, '$queryRaw').mockResolvedValueOnce([1]);
    const isHealthy = await service.isHealthy();
    expect(isHealthy).toBe(true);
  });

  it('should report unhealthy when queryRaw fails', async () => {
    jest
      .spyOn(service, '$queryRaw')
      .mockRejectedValueOnce(new Error('DB Connection Failed'));
    const isHealthy = await service.isHealthy();
    expect(isHealthy).toBe(false);
  });
});
