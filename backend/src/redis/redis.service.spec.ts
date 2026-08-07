import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { RedisService } from './redis.service';

describe('RedisService', () => {
  let service: RedisService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RedisService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('redis://localhost:6379'),
          },
        },
      ],
    }).compile();

    service = module.get<RedisService>(RedisService);
    service.onModuleInit();
  });

  afterEach(async () => {
    await service.onModuleDestroy();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should report healthy when ping succeeds', async () => {
    const mockClient = {
      ping: jest.fn().mockResolvedValue('PONG'),
      status: 'ready',
      quit: jest.fn().mockResolvedValue('OK'),
    };
    (service as any).client = mockClient;

    const isHealthy = await service.isHealthy();
    expect(isHealthy).toBe(true);
  });

  it('should report unhealthy when ping fails', async () => {
    const mockClient = {
      ping: jest.fn().mockRejectedValue(new Error('Redis Down')),
      status: 'end',
      quit: jest.fn().mockResolvedValue('OK'),
    };
    (service as any).client = mockClient;

    const isHealthy = await service.isHealthy();
    expect(isHealthy).toBe(false);
  });
});
