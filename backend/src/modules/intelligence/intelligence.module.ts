import { Module } from '@nestjs/common';
import { PrismaModule } from '../../database/prisma.module';
import { IntelligenceController } from './intelligence.controller';
import { IntelligenceWarehouseService } from './services/intelligence-warehouse.service';
import { LearningEngineService } from './services/learning-engine.service';
import { PredictionEngineService } from './services/prediction-engine.service';
import { OptimizationMemoryService } from './services/optimization-memory.service';
import { BenchmarkEngineService } from './services/benchmark-engine.service';

@Module({
  imports: [PrismaModule],
  controllers: [IntelligenceController],
  providers: [
    IntelligenceWarehouseService,
    LearningEngineService,
    PredictionEngineService,
    OptimizationMemoryService,
    BenchmarkEngineService,
  ],
  exports: [
    IntelligenceWarehouseService,
    LearningEngineService,
    PredictionEngineService,
    OptimizationMemoryService,
    BenchmarkEngineService,
  ],
})
export class IntelligenceModule {}
