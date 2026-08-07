import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { Response } from 'express';
import { PrismaService } from '../database/prisma.service';
import { RedisService } from '../redis/redis.service';
import { HealthController } from './health.controller';

describe('HealthController', () => {
  let controller: HealthController;
  let prismaService: PrismaService;
  let redisService: RedisService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        {
          provide: PrismaService,
          useValue: {
            isHealthy: jest.fn(),
          },
        },
        {
          provide: RedisService,
          useValue: {
            isHealthy: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('test'),
          },
        },
      ],
    }).compile();

    controller = module.get<HealthController>(HealthController);
    prismaService = module.get<PrismaService>(PrismaService);
    redisService = module.get<RedisService>(RedisService);
  });

  it('should return HTTP 200 with status ok when all services are healthy', async () => {
    jest.spyOn(prismaService, 'isHealthy').mockResolvedValue(true);
    jest.spyOn(redisService, 'isHealthy').mockResolvedValue(true);

    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    } as unknown as Response;

    await controller.checkHealth(mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 'ok',
        database: 'up',
        redis: 'up',
        environment: 'test',
      }),
    );
  });

  it('should return HTTP 503 with status error when DB is down', async () => {
    jest.spyOn(prismaService, 'isHealthy').mockResolvedValue(false);
    jest.spyOn(redisService, 'isHealthy').mockResolvedValue(true);

    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    } as unknown as Response;

    await controller.checkHealth(mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(503);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 'error',
        database: 'down',
        redis: 'up',
      }),
    );
  });
});
