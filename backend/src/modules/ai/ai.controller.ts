import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AIProviderCode, Role } from '@prisma/client';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { AIService } from './ai.service';

export class TestAIRequestDto {
  prompt!: string;
  providerCode?: AIProviderCode;
}

@ApiTags('AI Provider Abstraction')
@Controller('ai')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class AIController {
  constructor(private readonly aiService: AIService) {}

  @Get('providers')
  @ApiOperation({
    summary: 'List AI Providers',
    description: 'Lists supported AI providers registered in the abstraction layer.',
  })
  @ApiResponse({ status: 200, description: 'List of providers.' })
  async getProviders() {
    return this.aiService.getProviders();
  }

  @Get('models')
  @ApiOperation({
    summary: 'List AI Models & Pricing',
    description: 'Lists active models, context windows, and token pricing rates.',
  })
  @ApiResponse({ status: 200, description: 'List of models and pricing.' })
  async getModels() {
    return this.aiService.getModels();
  }

  @Get('health')
  @ApiOperation({
    summary: 'AI Provider Health Status',
    description: 'Performs real-time latency and health checks across registered AI providers.',
  })
  @ApiResponse({ status: 200, description: 'Provider health results.' })
  async getHealth() {
    return this.aiService.checkHealth();
  }

  @Post('test')
  @Roles(Role.OWNER, Role.ADMIN)
  @ApiOperation({
    summary: 'Test AI Provider Gateway',
    description: 'Executes a test request through the provider-agnostic abstraction layer.',
  })
  @ApiResponse({ status: 200, description: 'Normalized AI response.' })
  async testAI(@Body() dto: TestAIRequestDto) {
    return this.aiService.executeTestRequest(dto.prompt, dto.providerCode);
  }
}
