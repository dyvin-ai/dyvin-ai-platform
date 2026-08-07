import { Module } from '@nestjs/common';
import { PrismaModule } from '../../database/prisma.module';
import { InnovationLabController } from './innovation-lab.controller';
import { InnovationDashboardService } from './services/innovation-dashboard.service';
import { ExperimentRegistryService } from './services/experiment-registry.service';
import { ExperimentalModelService } from './services/experimental-model.service';
import { PromptLabService } from './services/prompt-lab.service';
import { MultimodalService } from './services/multimodal.service';
import { BrowserAgentService } from './services/browser-agent.service';
import { VoiceAgentService } from './services/voice-agent.service';
import { RoboticsService } from './services/robotics.service';
import { ExperimentEvaluationService } from './services/experiment-evaluation.service';
import { PromotionService } from './services/promotion.service';

@Module({
  imports: [PrismaModule],
  controllers: [InnovationLabController],
  providers: [
    InnovationDashboardService,
    ExperimentRegistryService,
    ExperimentalModelService,
    PromptLabService,
    MultimodalService,
    BrowserAgentService,
    VoiceAgentService,
    RoboticsService,
    ExperimentEvaluationService,
    PromotionService,
  ],
  exports: [
    InnovationDashboardService,
    ExperimentRegistryService,
    ExperimentalModelService,
    PromptLabService,
    MultimodalService,
    BrowserAgentService,
    VoiceAgentService,
    RoboticsService,
    ExperimentEvaluationService,
    PromotionService,
  ],
})
export class InnovationLabModule {}
