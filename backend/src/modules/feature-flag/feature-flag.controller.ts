import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FeatureFlagType, RolloutStrategy } from '@prisma/client';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { FeatureFlagService } from './feature-flag.service';

export class CreateFeatureFlagDto {
  key!: string;
  name!: string;
  description?: string;
  type?: FeatureFlagType;
  isEnabled?: boolean;
  defaultValue?: boolean;
  strategy?: RolloutStrategy;
  percentage?: number;
  startDate?: Date;
  endDate?: Date;
  audiences?: Array<{ targetType: string; targetValue: string }>;
}

export class UpdateFeatureFlagDto {
  name?: string;
  description?: string;
  isEnabled?: boolean;
  isKillSwitched?: boolean;
  defaultValue?: boolean;
  strategy?: RolloutStrategy;
  percentage?: number;
  startDate?: Date;
  endDate?: Date;
}

@ApiTags('Feature Flags & Dynamic Configuration')
@Controller('feature-flags')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class FeatureFlagController {
  constructor(private readonly featureFlagService: FeatureFlagService) {}

  @Get()
  @ApiOperation({
    summary: 'List Feature Flags',
    description: 'Retrieves all feature flags, environments, rollout strategies, and target audiences.',
  })
  @ApiResponse({ status: 200, description: 'List of feature flags.' })
  async getFlags() {
    return this.featureFlagService.getFlags();
  }

  @Get('evaluate')
  @ApiOperation({
    summary: 'Evaluate Feature Flag',
    description: 'Evaluates feature flag status for context (userId, organizationId, country, plan).',
  })
  @ApiQuery({ name: 'key', required: true })
  @ApiQuery({ name: 'organizationId', required: false })
  @ApiQuery({ name: 'country', required: false })
  @ApiQuery({ name: 'plan', required: false })
  @ApiResponse({ status: 200, description: 'Feature flag evaluation result.' })
  async evaluateFlag(
    @Query('key') key: string,
    @CurrentUser('id') userId: string,
    @Query('organizationId') organizationId?: string,
    @Query('country') country?: string,
    @Query('plan') plan?: string,
  ) {
    const isEnabled = await this.featureFlagService.evaluate(key, {
      userId,
      organizationId,
      country,
      plan,
    });
    return { key, isEnabled };
  }

  @Post()
  @Roles('OWNER', 'ADMIN', 'MANAGER')
  @ApiOperation({
    summary: 'Create Feature Flag',
    description: 'Creates feature flag with rollout strategy and target audience rules.',
  })
  @ApiBody({ type: CreateFeatureFlagDto })
  @ApiResponse({ status: 201, description: 'Feature flag created.' })
  async createFlag(
    @CurrentUser('id') userId: string,
    @Body() dto: CreateFeatureFlagDto,
  ) {
    return this.featureFlagService.createFlag(dto, userId);
  }

  @Patch(':id')
  @Roles('OWNER', 'ADMIN', 'MANAGER')
  @ApiOperation({
    summary: 'Update Feature Flag',
    description: 'Updates feature flag rules, enables/disables flag, or triggers instant kill switch.',
  })
  @ApiBody({ type: UpdateFeatureFlagDto })
  @ApiResponse({ status: 200, description: 'Feature flag updated.' })
  async updateFlag(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @Body() dto: UpdateFeatureFlagDto,
  ) {
    return this.featureFlagService.updateFlag(id, dto, userId);
  }

  @Delete(':id')
  @Roles('OWNER', 'ADMIN')
  @ApiOperation({
    summary: 'Delete Feature Flag',
    description: 'Deletes feature flag and clears cached evaluations.',
  })
  @ApiResponse({ status: 200, description: 'Feature flag deleted.' })
  async deleteFlag(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.featureFlagService.deleteFlag(id, userId);
  }
}
