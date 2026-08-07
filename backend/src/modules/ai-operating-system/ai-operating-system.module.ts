import { Module } from '@nestjs/common';
import { PrismaModule } from '../../database/prisma.module';
import { AIOperatingSystemController } from './ai-operating-system.controller';
import { OperatingSystemService } from './services/operating-system.service';
import { PlanningEngineService } from './services/planning-engine.service';
import { AgentCoordinatorService } from './services/agent-coordinator.service';
import { ReasoningEngineService } from './services/reasoning-engine.service';
import { GoalService } from './services/goal.service';
import { DecisionEngineService } from './services/decision-engine.service';
import { AutonomousExecutionService } from './services/autonomous-execution.service';
import { ReflectionService } from './services/reflection.service';
import { StrategyEngineService } from './services/strategy-engine.service';
import { ExecutiveAssistantService } from './services/executive-assistant.service';

@Module({
  imports: [PrismaModule],
  controllers: [AIOperatingSystemController],
  providers: [
    OperatingSystemService,
    PlanningEngineService,
    AgentCoordinatorService,
    ReasoningEngineService,
    GoalService,
    DecisionEngineService,
    AutonomousExecutionService,
    ReflectionService,
    StrategyEngineService,
    ExecutiveAssistantService,
  ],
  exports: [
    OperatingSystemService,
    PlanningEngineService,
    AgentCoordinatorService,
    ReasoningEngineService,
    GoalService,
    DecisionEngineService,
    AutonomousExecutionService,
    ReflectionService,
    StrategyEngineService,
    ExecutiveAssistantService,
  ],
})
export class AIOperatingSystemModule {}
