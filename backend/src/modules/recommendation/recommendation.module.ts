import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { RecommendationProcessor } from './processors/recommendation.processor';
import { RECOMMENDATION_QUEUES } from './recommendation.constants';
import { RecommendationController } from './recommendation.controller';
import { DependencyEngineService } from './services/dependency-engine.service';
import { DuplicateEngineService } from './services/duplicate-engine.service';
import { ImpactEngineService } from './services/impact-engine.service';
import { PriorityEngineService } from './services/priority-engine.service';
import { RecommendationEngineService } from './services/recommendation-engine.service';

@Module({
  imports: [
    BullModule.registerQueue(
      { name: RECOMMENDATION_QUEUES.ENGINE },
      { name: RECOMMENDATION_QUEUES.IMPACT_CALCULATOR },
      { name: RECOMMENDATION_QUEUES.DEPENDENCY_BUILDER },
    ),
  ],
  controllers: [RecommendationController],
  providers: [
    RecommendationEngineService,
    PriorityEngineService,
    ImpactEngineService,
    DependencyEngineService,
    DuplicateEngineService,
    RecommendationProcessor,
  ],
  exports: [
    RecommendationEngineService,
    PriorityEngineService,
    ImpactEngineService,
    DependencyEngineService,
    DuplicateEngineService,
  ],
})
export class RecommendationModule {}
