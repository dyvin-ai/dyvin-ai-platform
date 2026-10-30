import { Controller, Get, Post, Body } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { InnovationDashboardService } from './services/innovation-dashboard.service';
import { ExperimentRegistryService } from './services/experiment-registry.service';
import { ExperimentalModelService } from './services/experimental-model.service';
import { ExperimentEvaluationService } from './services/experiment-evaluation.service';
import { PromotionService } from './services/promotion.service';
import { MultimodalService } from './services/multimodal.service';
import { BrowserAgentService } from './services/browser-agent.service';
import { VoiceAgentService } from './services/voice-agent.service';

@ApiTags('Enterprise AI Innovation Lab & Experimental Platform')
@Controller('innovation')
export class InnovationLabController {
  constructor(
    private readonly dashboardService: InnovationDashboardService,
    private readonly registryService: ExperimentRegistryService,
    private readonly modelService: ExperimentalModelService,
    private readonly evaluationService: ExperimentEvaluationService,
    private readonly promotionService: PromotionService,
    private readonly multimodalService: MultimodalService,
    private readonly browserService: BrowserAgentService,
    private readonly voiceService: VoiceAgentService,
  ) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Get Innovation Lab dashboard telemetry' })
  async getDashboard() {
    return this.dashboardService.getDashboardOverview();
  }

  @Get('experiments')
  @ApiOperation({ summary: 'List sandboxed AI experiments' })
  async getExperiments() {
    return this.registryService.getExperiments();
  }

  @Post('experiments')
  @ApiOperation({ summary: 'Create new sandboxed AI experiment' })
  async createExperiment(@Body() body: { title: string; owner: string; riskLevel?: string }) {
    return this.registryService.createExperiment(body.title, body.owner, body.riskLevel);
  }

  @Get('models')
  @ApiOperation({ summary: 'List preview & experimental foundation models' })
  async getModels() {
    return this.modelService.getExperimentalModels();
  }

  @Get('evaluations')
  @ApiOperation({ summary: 'Get experiment evaluation gate results' })
  async getEvaluations() {
    return this.evaluationService.getEvaluations();
  }

  @Get('promotions')
  @ApiOperation({ summary: 'Get promotion history (Sandbox -> Staging -> Production)' })
  async getPromotions() {
    return this.promotionService.getPromotions();
  }

  @Get('multimodal')
  @ApiOperation({ summary: 'Get multimodal vision/audio/video intelligence telemetry' })
  async getMultimodal() {
    return this.multimodalService.getMultimodalCapabilities();
  }

  @Get('browser')
  @ApiOperation({ summary: 'Get browser automation agent status' })
  async getBrowser() {
    return this.browserService.getBrowserAutomationStatus();
  }

  @Get('voice')
  @ApiOperation({ summary: 'Get voice intelligence engine capabilities' })
  async getVoice() {
    return this.voiceService.getVoiceStatus();
  }

  @Get('statistics')
  @ApiOperation({ summary: 'Get Innovation Lab statistics' })
  async getStatistics() {
    return {
      activeSandboxExperiments: 18,
      totalPromotionsToStaging: 24,
      sandboxIsolation: 'STRICT_SANDBOX_ISOLATED',
    };
  }
}
