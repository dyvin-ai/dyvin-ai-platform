import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { DiscoveryEngineService, StartResearchInput } from './services/discovery-engine.service';
import { TrendOpportunityService } from './services/trend-opportunity.service';
import { ResearchAgentService } from './services/research-agent.service';
import { ResearchReportService } from './services/research-report.service';
import { ResearchQueue } from './queues/research.queue';

@ApiTags('AI Research Intelligence Platform')
@Controller('api/v1/research')
export class ResearchIntelligenceController {
  constructor(
    private readonly discoveryEngine: DiscoveryEngineService,
    private readonly trendOpportunityService: TrendOpportunityService,
    private readonly researchAgent: ResearchAgentService,
    private readonly reportService: ResearchReportService,
    private readonly researchQueue: ResearchQueue,
  ) {}

  @Post('run')
  @ApiOperation({ summary: 'Trigger automated research discovery run' })
  async runResearch(@Body() body: StartResearchInput) {
    await this.researchQueue.addDiscoveryJob(body);
    return this.discoveryEngine.runDiscoveryProject(body);
  }

  @Get()
  @ApiOperation({ summary: 'List research projects' })
  async getResearch(@Query('organizationId') organizationId?: string) {
    return this.discoveryEngine.getProjects(organizationId);
  }

  @Get('topics')
  @ApiOperation({ summary: 'List research topics' })
  async getTopics(@Query('projectId') projectId?: string) {
    return this.discoveryEngine.getTopics(projectId);
  }

  @Get('trends')
  @ApiOperation({ summary: 'Get detected research trends' })
  async getTrends() {
    return this.trendOpportunityService.getTrends();
  }

  @Get('opportunities')
  @ApiOperation({ summary: 'Get research content & citation opportunities' })
  async getOpportunities() {
    return this.trendOpportunityService.getOpportunities();
  }

  @Get('threats')
  @ApiOperation({ summary: 'Get competitor threats and market disruptions' })
  async getThreats() {
    return this.trendOpportunityService.getThreats();
  }

  @Get('findings')
  @ApiOperation({ summary: 'Get research findings' })
  async getFindings(@Query('projectId') projectId?: string) {
    return this.discoveryEngine.getFindings(projectId);
  }

  @Get('reports')
  @ApiOperation({ summary: 'Get generated research reports & briefs' })
  async getReports(@Query('projectId') projectId?: string) {
    return this.reportService.getReports(projectId);
  }

  @Get('benchmarks')
  @ApiOperation({ summary: 'Get industry research benchmarks' })
  async getBenchmarks() {
    return this.trendOpportunityService.getBenchmarks();
  }

  @Get('history')
  @ApiOperation({ summary: 'Get research execution history' })
  async getHistory() {
    return this.researchAgent.getHistory();
  }
}
