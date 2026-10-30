import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AIProviderCode, PromptStatus, PromptType } from '@prisma/client';
import { CurrentOrganization } from '../../common/decorators/current-organization.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { AISearchAnalyticsService } from './services/ai-search-analytics.service';
import { PromptExecutionService } from './services/prompt-execution.service';
import { PromptLibraryService } from './services/prompt-library.service';

import { IsArray, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePromptBodyDto {
  @IsString()
  @IsNotEmpty()
  aiSearchProjectId!: string;

  @IsString()
  @IsOptional()
  groupId?: string;

  @IsString()
  @IsNotEmpty()
  promptText!: string;

  @IsEnum(PromptType)
  @IsOptional()
  type?: PromptType;

  @IsArray()
  @IsOptional()
  tags?: string[];
}

export class UpdatePromptBodyDto {
  @IsString()
  @IsOptional()
  promptText?: string;

  @IsEnum(PromptStatus)
  @IsOptional()
  status?: PromptStatus;

  @IsString()
  @IsOptional()
  groupId?: string;

  @IsArray()
  @IsOptional()
  tags?: string[];
}

export class ExecutePromptBodyDto {
  @IsString()
  @IsNotEmpty()
  promptId!: string;

  @IsEnum(AIProviderCode)
  @IsOptional()
  providerCode?: AIProviderCode;

  @IsString()
  @IsOptional()
  organizationId?: string;
}

@ApiTags('AI Search Intelligence Platform')
@Controller('ai-search')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class AISearchController {
  constructor(
    private readonly promptLibrary: PromptLibraryService,
    private readonly executionService: PromptExecutionService,
    private readonly analyticsService: AISearchAnalyticsService,
  ) {}

  @Post('prompts')
  @Roles('OWNER', 'ADMIN', 'MANAGER', 'MEMBER')
  @ApiOperation({
    summary: 'Create AI Search Prompt',
    description: 'Creates reusable prompt in library with tags, versioning, and group association.',
  })
  @ApiBody({ type: CreatePromptBodyDto })
  @ApiResponse({ status: 201, description: 'Prompt created.' })
  async createPrompt(
    @CurrentUser('id') userId: string,
    @Body() dto: CreatePromptBodyDto,
  ) {
    return this.promptLibrary.createPrompt(dto, userId);
  }

  @Get('prompts')
  @ApiOperation({
    summary: 'List AI Search Prompts',
    description: 'Retrieves prompts filtered by AI Search Project ID, Project ID, or Organization.',
  })
  @ApiQuery({ name: 'aiSearchProjectId', required: false })
  @ApiQuery({ name: 'projectId', required: false })
  @ApiResponse({ status: 200, description: 'List of prompts.' })
  async getPrompts(
    @CurrentUser('id') userId: string,
    @CurrentOrganization() organizationId?: string,
    @Query('aiSearchProjectId') aiSearchProjectId?: string,
    @Query('projectId') projectId?: string,
  ) {
    return this.promptLibrary.getPrompts(aiSearchProjectId, organizationId, userId, projectId);
  }

  @Get('prompts/:id')
  @ApiOperation({
    summary: 'Get AI Search Prompt Details',
    description: 'Retrieves prompt details, versioning, and execution history.',
  })
  @ApiResponse({ status: 200, description: 'Prompt detail object.' })
  async getPromptById(@Param('id') id: string) {
    return this.promptLibrary.getPromptById(id);
  }

  @Patch('prompts/:id')
  @Roles('OWNER', 'ADMIN', 'MANAGER')
  @ApiOperation({
    summary: 'Update AI Search Prompt',
    description: 'Updates prompt text, status, tags, or increments version.',
  })
  @ApiBody({ type: UpdatePromptBodyDto })
  @ApiResponse({ status: 200, description: 'Prompt updated.' })
  async updatePrompt(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @Body() dto: UpdatePromptBodyDto,
  ) {
    return this.promptLibrary.updatePrompt(id, dto, userId);
  }

  @Delete('prompts/:id')
  @Roles('OWNER', 'ADMIN')
  @ApiOperation({
    summary: 'Delete AI Search Prompt',
    description: 'Removes prompt from library.',
  })
  @ApiResponse({ status: 200, description: 'Prompt deleted.' })
  async deletePrompt(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.promptLibrary.deletePrompt(id, userId);
  }

  @Post('execute')
  @Roles('OWNER', 'ADMIN', 'MANAGER', 'MEMBER')
  @ApiOperation({
    summary: 'Execute AI Search Prompt',
    description: 'Executes prompt via ProviderRouter across ChatGPT, Claude, Gemini, or Perplexity asynchronously.',
  })
  @ApiBody({ type: ExecutePromptBodyDto })
  @ApiResponse({ status: 200, description: 'Prompt execution result.' })
  async executePrompt(
    @CurrentUser('id') userId: string,
    @CurrentOrganization() organizationId: string | undefined,
    @Body() dto: ExecutePromptBodyDto,
  ) {
    return this.executionService.executePrompt({
      promptId: dto.promptId,
      providerCode: dto.providerCode,
      organizationId: dto.organizationId || organizationId,
      userId,
    });
  }

  @Get('history')
  @ApiOperation({
    summary: 'Get Prompt Execution History',
    description: 'Retrieves permanent historical execution logs and comparisons.',
  })
  @ApiQuery({ name: 'aiSearchProjectId', required: false })
  @ApiResponse({ status: 200, description: 'Execution history records.' })
  async getHistory(@Query('aiSearchProjectId') aiSearchProjectId?: string) {
    return this.analyticsService.getExecutionHistory(aiSearchProjectId);
  }

  @Get('executions')
  @ApiOperation({
    summary: 'Get Prompt Executions',
    description: 'Alias endpoint for execution logs.',
  })
  @ApiQuery({ name: 'aiSearchProjectId', required: false })
  async getExecutions(@Query('aiSearchProjectId') aiSearchProjectId?: string) {
    return this.analyticsService.getExecutionHistory(aiSearchProjectId);
  }

  @Get('analytics')
  @ApiOperation({
    summary: 'Get AI Search Platform Analytics',
    description: 'Calculates success rates, average latency, costs, token usage, and AI model benchmarking comparisons.',
  })
  @ApiQuery({ name: 'aiSearchProjectId', required: false })
  @ApiResponse({ status: 200, description: 'Analytics payload.' })
  async getAnalytics(@Query('aiSearchProjectId') aiSearchProjectId?: string) {
    return this.analyticsService.getAnalytics(aiSearchProjectId);
  }

  @Get('providers')
  @ApiOperation({
    summary: 'Get Supported AI Search Providers',
    description: 'Returns supported AI search engines (ChatGPT, Claude, Gemini, Perplexity).',
  })
  async getProviders() {
    return this.analyticsService.getProviders();
  }

  @Get('models')
  @ApiOperation({
    summary: 'Get Supported AI Search Models',
    description: 'Returns available models per provider.',
  })
  async getModels() {
    return this.analyticsService.getModels();
  }
}
