import { Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiHeader, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { RecommendationEngineService } from './services/recommendation-engine.service';

@ApiTags('AI Recommendation Intelligence Engine')
@Controller()
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
@ApiHeader({
  name: 'X-Organization-Id',
  description: 'Active Organization ID',
  required: true,
})
export class RecommendationController {
  constructor(private readonly recommendationService: RecommendationEngineService) {}

  @Post('analysis/:id/recommendations')
  @Roles(Role.OWNER, Role.ADMIN, Role.MANAGER)
  @ApiOperation({
    summary: 'Generate Prioritized Recommendations',
    description: 'Transforms visibility analysis findings into prioritized business recommendations.',
  })
  @ApiResponse({ status: 201, description: 'Recommendation generation queued.' })
  async generateRecommendations(
    @Param('id') analysisId: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.recommendationService.initiateRecommendationGeneration(analysisId, userId);
  }

  @Get('recommendations')
  @ApiOperation({
    summary: 'List Recommendations',
    description: 'Lists all generated recommendations for analysis or project.',
  })
  @ApiQuery({ name: 'analysisId', required: false, description: 'Filter by Analysis ID' })
  @ApiResponse({ status: 200, description: 'List of recommendations.' })
  async getRecommendations(@Query('analysisId') analysisId?: string) {
    return this.recommendationService.getRecommendations(analysisId);
  }

  @Get('recommendations/:id')
  @ApiOperation({
    summary: 'Get Recommendation Details',
    description: 'Retrieves recommendation details, impact estimates, and evidence.',
  })
  @ApiResponse({ status: 200, description: 'Recommendation details.' })
  async getRecommendationDetails(@Param('id') id: string) {
    return this.recommendationService.getRecommendationDetails(id);
  }

  @Get('recommendations/:id/evidence')
  @ApiOperation({
    summary: 'Get Recommendation Evidence',
    description: 'Retrieves evidence provenance backing the specified recommendation.',
  })
  @ApiResponse({ status: 200, description: 'Recommendation evidence.' })
  async getEvidence(@Param('id') id: string) {
    return this.recommendationService.getRecommendationEvidence(id);
  }

  @Get('recommendations/:id/dependencies')
  @ApiOperation({
    summary: 'Get Recommendation Dependencies',
    description: 'Retrieves prerequisite execution dependencies for specified recommendation.',
  })
  @ApiResponse({ status: 200, description: 'Recommendation dependencies.' })
  async getDependencies(@Param('id') id: string) {
    return this.recommendationService.getRecommendationDependencies(id);
  }
}
