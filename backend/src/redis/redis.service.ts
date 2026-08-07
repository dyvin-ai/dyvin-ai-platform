import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private client!: Redis;

  constructor(private readonly configService: ConfigService) {}

  onModuleInit(): void {
    const redisUrl =
      this.configService.get<string>('app.redisUrl') ||
      process.env.REDIS_URL ||
      'redis://localhost:6379';

    const isTest = process.env.NODE_ENV === 'test';
    this.client = new Redis(redisUrl, {
      maxRetriesPerRequest: null,
      enableReadyCheck: !isTest,
      lazyConnect: true,
      retryStrategy: isTest ? () => null : (times) => Math.min(times * 100, 3000),
    });

    this.client.on('connect', () => {
      this.logger.log('Redis client connecting...');
    });

    this.client.on('ready', () => {
      this.logger.log('Redis client ready');
    });

    this.client.on('error', (err) => {
      this.logger.error('Redis client error:', err);
    });
  }

  async onModuleDestroy(): Promise<void> {
    if (this.client) {
      try {
        if (this.client.status !== 'end') {
          await this.client.quit();
        }
        this.logger.log('Redis client disconnected gracefully');
      } catch (error) {
        // Silently catch disconnection errors during teardown
      }
    }
  }

  getClient(): Redis {
    return this.client;
  }

  async isHealthy(): Promise<boolean> {
    try {
      if (!this.client) return false;
      const pingResult = await this.client.ping();
      return pingResult === 'PONG';
    } catch (error) {
      this.logger.error('Redis healthcheck ping failed:', error);
      return false;
    }
  }

  async get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  async set(key: string, value: string, ttlSeconds?: number): Promise<'OK'> {
    if (ttlSeconds) {
      return this.client.set(key, value, 'EX', ttlSeconds);
    }
    return this.client.set(key, value);
  }

  async del(key: string): Promise<number> {
    return this.client.del(key);
  }
}
