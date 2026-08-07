import { Module } from '@nestjs/common';
import { MetricsController } from './metrics.controller';
import { MetricsService } from './services/metrics.service';
import { SREOperationsController } from './sre-operations.controller';
import { SREOperationsService } from './sre-operations.service';

@Module({
  controllers: [MetricsController, SREOperationsController],
  providers: [MetricsService, SREOperationsService],
  exports: [MetricsService, SREOperationsService],
})
export class ObservabilityModule {}
