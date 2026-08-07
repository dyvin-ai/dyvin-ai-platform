import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { VisibilityAnalysisService } from './services/visibility-analysis.service';

@ApiTags('Visibility Intelligence & Reasoning Engine')
@Controller()
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
@ApiHeader({
  name: 'X-Organization-Id',
  description: 'Active Organization ID',
  required: true,
})
export class ReasoningController {
  constructor(private readonly analysisService: VisibilityAnalysisService) {}

  @Post('projects/:id/analyze')
  @Roles(Role.OWNER, Role.ADMIN, Role.MANAGER)
  @ApiOperation({
    summary: 'Initiate Visibility Analysis',
    description: 'Runs AI Visibility Intelligence & Reasoning pipeline on latest scan data.',
  })
  @ApiResponse({ status: 201, description: 'Analysis queued successfully.' })
  async initiateAnalysis(
    @Param('id') projectId: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.analysisService.initiateProjectAnalysis(projectId, userId);
  }

  @Get('analysis')
  @ApiOperation({
    summary: 'List Project Analyses',
    description: 'Lists all visibility analysis runs for the active project.',
  })
  @ApiResponse({ status: 200, description: 'List of analysis runs.' })
  async getAnalyses(@Param('id') projectId: string) {
    return this.analysisService.getProjectAnalyses(projectId);
  }

  @Get('analysis/:id')
  @ApiOperation({
    summary: 'Get Analysis Summary',
    description: 'Retrieves overall AI visibility score and status for analysis run.',
  })
  @ApiResponse({ status: 200, description: 'Analysis overview.' })
  async getAnalysisDetails(@Param('id') analysisId: string) {
    return this.analysisService.getAnalysisDetails(analysisId);
  }

  @Get('analysis/:id/scores')
  @ApiOperation({
    summary: 'Get Category Scores',
    description: 'Retrieves 9 category scores (Knowledge, Authority, Trust, Schema, etc.).',
  })
  @ApiResponse({ status: 200, description: 'Category score breakdown.' })
  async getAnalysisScores(@Param('id') analysisId: string) {
    return this.analysisService.getAnalysisScores(analysisId);
  }

  @Get('analysis/:id/reasoning')
  @ApiOperation({
    summary: 'Get AI Reasoning & Evidence',
    description: 'Retrieves step-by-step reasoning explanations ("WHY"), impact, and evidence.',
  })
  @ApiResponse({ status: 200, description: 'AI reasoning steps and evidence.' })
  async getAnalysisReasoning(@Param('id') analysisId: string) {
    return this.analysisService.getAnalysisReasoning(analysisId);
  }

  @Get('analysis/:id/gaps')
  @ApiOperation({
    summary: 'Get Knowledge & Content Gaps',
    description: 'Retrieves identified knowledge, schema, product, service, and trust gaps.',
  })
  @ApiResponse({ status: 200, description: 'Identified gaps.' })
  async getAnalysisGaps(@Param('id') analysisId: string) {
    return this.analysisService.getAnalysisGaps(analysisId);
  }
}
