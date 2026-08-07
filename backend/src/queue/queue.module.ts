import { BullModule } from '@nestjs/bullmq';
import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { QUEUE_NAMES } from './queue.constants';

@Global()
@Module({
  imports: [
    BullModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        const redisUrl =
          configService.get<string>('app.redisUrl') ||
          process.env.REDIS_URL ||
          'redis://localhost:6379';

        const url = new URL(redisUrl);

        return {
          connection: {
            host: url.hostname || 'localhost',
            port: url.port ? parseInt(url.port, 10) : 6379,
            username: url.username || undefined,
            password: url.password || undefined,
          },
        };
      },
      inject: [ConfigService],
    }),
    BullModule.registerQueue(
      { name: QUEUE_NAMES.AI_ANALYSIS },
      { name: QUEUE_NAMES.RECOMMENDATIONS },
      { name: QUEUE_NAMES.VISIBILITY_MONITOR },
    ),
  ],
  exports: [BullModule],
})
export class QueueModule {}
