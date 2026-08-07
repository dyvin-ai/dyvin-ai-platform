import { Controller, Get, HttpStatus, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { PrismaService } from '../database/prisma.service';
import { RedisService } from '../redis/redis.service';

export interface HealthCheckResponse {
  status: 'ok' | 'error';
  database: 'up' | 'down';
  redis: 'up' | 'down';
  uptime: number;
  version: string;
  environment: string;
  timestamp: string;
}

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly redisService: RedisService,
    private readonly configService: ConfigService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'System Health Check',
    description:
      'Performs live diagnostics on Database (PostgreSQL) and Cache/Queue (Redis) connections.',
  })
  @ApiResponse({
    status: 200,
    description: 'System is fully healthy and operational.',
  })
  @ApiResponse({
    status: 503,
    description: 'One or more system services are degraded or offline.',
  })
  async checkHealth(@Res() res: Response): Promise<void> {
    const [dbHealthy, redisHealthy] = await Promise.all([
      this.prismaService.isHealthy(),
      this.redisService.isHealthy(),
    ]);

    const isHealthy = dbHealthy && redisHealthy;
    const environment =
      this.configService.get<string>('app.nodeEnv') || process.env.NODE_ENV || 'development';

    const healthStatus: HealthCheckResponse = {
      status: isHealthy ? 'ok' : 'error',
      database: dbHealthy ? 'up' : 'down',
      redis: redisHealthy ? 'up' : 'down',
      uptime: process.uptime(),
      version: process.env.npm_package_version || '1.0.0',
      environment,
      timestamp: new Date().toISOString(),
    };

    const httpStatus = isHealthy
      ? HttpStatus.OK
      : HttpStatus.SERVICE_UNAVAILABLE;

    res.status(httpStatus).json(healthStatus);
  }
}
