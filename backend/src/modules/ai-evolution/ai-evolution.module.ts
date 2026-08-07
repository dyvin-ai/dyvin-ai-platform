import { Module } from '@nestjs/common';
import { PrismaModule } from '../../database/prisma.module';
import { AIEvolutionController } from './ai-evolution.controller';
import { EvolutionDashboardService } from './services/evolution-dashboard.service';
import { ModelRegistryService } from './services/model-registry.service';
import { ModelEvaluationService } from './services/model-evaluation.service';
import { RoutingOptimizationService } from './services/routing-optimization.service';
import { PromptEvolutionService } from './services/prompt-evolution.service';
import { WorkflowEvolutionService } from './services/workflow-evolution.service';
import { StrategyEvolutionService } from './services/strategy-evolution.service';
import { LearningOptimizerService } from './services/learning-optimizer.service';
import { BenchmarkEvolutionService } from './services/benchmark-evolution.service';
import { AIQualityService } from './services/ai-quality.service';

@Module({
  imports: [PrismaModule],
  controllers: [AIEvolutionController],
  providers: [
    EvolutionDashboardService,
    ModelRegistryService,
    ModelEvaluationService,
    RoutingOptimizationService,
    PromptEvolutionService,
    WorkflowEvolutionService,
    StrategyEvolutionService,
    LearningOptimizerService,
    BenchmarkEvolutionService,
    AIQualityService,
  ],
  exports: [
    EvolutionDashboardService,
    ModelRegistryService,
    ModelEvaluationService,
    RoutingOptimizationService,
    PromptEvolutionService,
    WorkflowEvolutionService,
    StrategyEvolutionService,
    LearningOptimizerService,
    BenchmarkEvolutionService,
    AIQualityService,
  ],
})
export class AIEvolutionModule {}
