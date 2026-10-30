import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentOrganization } from '../../common/decorators/current-organization.decorator';
import { CurrentUser, UserPayload } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RootCauseEngineService, InsightItem } from './services/root-cause-engine.service';

@ApiTags('AI Insights Intelligence')
@Controller('insights')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class InsightsController {
  constructor(private readonly rootCauseEngine: RootCauseEngineService) {}

  @Get()
  @ApiOperation({
    summary: 'Get Diagnostic AI Insights',
    description: 'Returns explainable, evidence-based insights derived from real visibility observations, competitor gaps, citation health, and prompt performance.',
  })
  @ApiQuery({ name: 'projectId', required: false, description: 'Optional project scope within the active organization' })
  @ApiResponse({ status: 200, description: 'Array of diagnostic insight items' })
  async getInsights(
    @CurrentOrganization() orgId?: string | null,
    @Query('projectId') projectId?: string,
    @CurrentUser() user?: UserPayload,
  ): Promise<InsightItem[]> {
    const targetOrgId = orgId || 'org-default';
    return this.rootCauseEngine.diagnoseRootCauses(targetOrgId, projectId, user?.id);
  }
}
