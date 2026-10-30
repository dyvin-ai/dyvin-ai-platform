import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentOrganization } from '../../common/decorators/current-organization.decorator';
import { CurrentUser, UserPayload } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { OverviewResponse, OverviewService } from './overview.service';

@ApiTags('Unified Overview Intelligence')
@Controller('overview')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class OverviewController {
  constructor(private readonly overviewService: OverviewService) {}

  @Get()
  @ApiOperation({
    summary: 'Get Unified Overview Intelligence',
    description: 'Aggregates visibility baseline, prompt intelligence, competitor rankings, citation health, and strategic actions for the active workspace.',
  })
  @ApiQuery({ name: 'projectId', required: false, description: 'Optional target project ID within the active organization' })
  @ApiResponse({ status: 200, description: 'Unified overview intelligence payload' })
  async getOverview(
    @CurrentOrganization() orgIdFromHeader?: string | null,
    @Query('projectId') projectId?: string,
    @CurrentUser() user?: UserPayload,
  ): Promise<OverviewResponse> {
    const targetOrgId = orgIdFromHeader || 'org-default';
    return this.overviewService.getOverview(targetOrgId, user?.id, projectId);
  }
}
