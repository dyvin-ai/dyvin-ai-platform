import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentOrganization } from '../../common/decorators/current-organization.decorator';
import { CurrentUser, UserPayload } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import {
  BrandAccuracyDto,
  BrandIntelligenceResponseDto,
  BrandIntelligenceService,
  BrandPresenceDto,
  BrandProfileDto,
  BrandUnderstandingDto,
  CompetitiveGapDto,
} from './brand-intelligence.service';

@ApiTags('Brand Intelligence & Competitive Intelligence Platform')
@Controller('brand-intelligence')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class BrandIntelligenceController {
  constructor(private readonly brandService: BrandIntelligenceService) {}

  @Get()
  @ApiOperation({
    summary: 'Get Brand Intelligence Dashboard',
    description: 'Aggregates brand profile, AI understanding, accuracy audits, presence metrics, and competitive gaps for active workspace.',
  })
  @ApiQuery({ name: 'projectId', required: false, description: 'Optional project ID context' })
  @ApiResponse({ status: 200, description: 'Brand intelligence dashboard payload' })
  async getBrandIntelligence(
    @CurrentOrganization() orgIdFromHeader?: string | null,
    @Query('projectId') projectId?: string,
    @CurrentUser() user?: UserPayload,
  ): Promise<BrandIntelligenceResponseDto> {
    const targetOrgId = orgIdFromHeader || 'org-default';
    return this.brandService.getBrandIntelligence(targetOrgId, user?.id, projectId);
  }

  @Get('profile')
  @ApiOperation({ summary: 'Get Brand Profile', description: 'Returns brand identity, catalog products, extracted services, and entities.' })
  @ApiQuery({ name: 'projectId', required: false })
  async getBrandProfile(
    @CurrentOrganization() orgIdFromHeader?: string | null,
    @Query('projectId') projectId?: string,
    @CurrentUser() user?: UserPayload,
  ): Promise<BrandProfileDto> {
    const targetOrgId = orgIdFromHeader || 'org-default';
    return this.brandService.getBrandProfile(targetOrgId, user?.id, projectId);
  }

  @Get('understanding')
  @ApiOperation({ summary: 'Get AI Brand Understanding', description: 'Returns how AI answer engines perceive the brand with excerpts and positioning.' })
  @ApiQuery({ name: 'projectId', required: false })
  async getBrandUnderstanding(
    @CurrentOrganization() orgIdFromHeader?: string | null,
    @Query('projectId') projectId?: string,
    @CurrentUser() user?: UserPayload,
  ): Promise<BrandUnderstandingDto> {
    const targetOrgId = orgIdFromHeader || 'org-default';
    return this.brandService.getBrandUnderstanding(targetOrgId, user?.id, projectId);
  }

  @Get('accuracy')
  @ApiOperation({ summary: 'Get Brand Accuracy & Conflict Audits', description: 'Identifies missing product associations, omitted mentions, and conflicting descriptions.' })
  @ApiQuery({ name: 'projectId', required: false })
  async getBrandAccuracy(
    @CurrentOrganization() orgIdFromHeader?: string | null,
    @Query('projectId') projectId?: string,
    @CurrentUser() user?: UserPayload,
  ): Promise<BrandAccuracyDto> {
    const targetOrgId = orgIdFromHeader || 'org-default';
    return this.brandService.getBrandAccuracy(targetOrgId, user?.id, projectId);
  }

  @Get('presence')
  @ApiOperation({ summary: 'Get Brand Presence & Engine Share', description: 'Returns mention rates, sentiment breakdown, and provider coverage.' })
  @ApiQuery({ name: 'projectId', required: false })
  async getBrandPresence(
    @CurrentOrganization() orgIdFromHeader?: string | null,
    @Query('projectId') projectId?: string,
    @CurrentUser() user?: UserPayload,
  ): Promise<BrandPresenceDto> {
    const targetOrgId = orgIdFromHeader || 'org-default';
    return this.brandService.getBrandPresence(targetOrgId, user?.id, projectId);
  }

  @Get('competitive-gaps')
  @ApiOperation({ summary: 'Get Evidence-Backed Competitive Gaps', description: 'Identifies head-to-head gaps against tracked market competitors.' })
  @ApiQuery({ name: 'projectId', required: false })
  async getCompetitiveGaps(
    @CurrentOrganization() orgIdFromHeader?: string | null,
    @Query('projectId') projectId?: string,
    @CurrentUser() user?: UserPayload,
  ): Promise<CompetitiveGapDto[]> {
    const targetOrgId = orgIdFromHeader || 'org-default';
    return this.brandService.getCompetitiveGaps(targetOrgId, user?.id, projectId);
  }
}
