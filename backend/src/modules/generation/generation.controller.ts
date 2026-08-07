import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiHeader, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { ApprovalWorkflowService } from './services/approval-workflow.service';
import { ContentExporterService } from './services/content-exporter.service';
import { ContentGenerationEngineService } from './services/content-generation-engine.service';

export class ApprovalNotesDto {
  notes?: string;
}

export class ExportFormatDto {
  format?: string;
}

@ApiTags('AI Content Generation & Auto-Fix Engine')
@Controller()
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
@ApiHeader({
  name: 'X-Organization-Id',
  description: 'Active Organization ID',
  required: true,
})
export class GenerationController {
  constructor(
    private readonly generationService: ContentGenerationEngineService,
    private readonly approvalWorkflow: ApprovalWorkflowService,
    private readonly contentExporter: ContentExporterService,
  ) {}

  @Post('recommendations/:id/generate')
  @Roles(Role.OWNER, Role.ADMIN, Role.MANAGER)
  @ApiOperation({
    summary: 'Generate AI Auto-Fix Assets',
    description: 'Generates Schema.org JSON-LD, SEO metadata, FAQs, or trust pages for a recommendation.',
  })
  @ApiResponse({ status: 201, description: 'AI content generation queued.' })
  async generateContent(
    @Param('id') recommendationId: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.generationService.initiateContentGeneration(recommendationId, userId);
  }

  @Get('generated-content')
  @ApiOperation({
    summary: 'List Generated Content Assets',
    description: 'Lists all AI-generated implementation assets for project or recommendation.',
  })
  @ApiQuery({ name: 'projectId', required: false, description: 'Filter by Project ID' })
  @ApiResponse({ status: 200, description: 'List of generated content assets.' })
  async getGeneratedContents(@Query('projectId') projectId?: string) {
    return this.generationService.getGeneratedContents(projectId);
  }

  @Get('generated-content/:id')
  @ApiOperation({
    summary: 'Get Generated Content Overview & Assets',
    description: 'Retrieves generated asset details, code blocks, confidence score, and review status.',
  })
  @ApiResponse({ status: 200, description: 'Generated content details.' })
  async getGeneratedContentDetails(@Param('id') id: string) {
    return this.generationService.getGeneratedContentDetails(id);
  }

  @Get('generated-content/:id/versions')
  @ApiOperation({
    summary: 'Get Generated Content Version History',
    description: 'Retrieves historical versions of generated code bodies.',
  })
  @ApiResponse({ status: 200, description: 'Generation version history.' })
  async getVersions(@Param('id') id: string) {
    return this.generationService.getGeneratedContentVersions(id);
  }

  @Post('generated-content/:id/approve')
  @Roles(Role.OWNER, Role.ADMIN, Role.MANAGER)
  @ApiOperation({
    summary: 'Approve Generated Content Asset',
    description: 'Human approval transition: moves content asset from REVIEW/PREVIEW to APPROVED for export.',
  })
  @ApiBody({ type: ApprovalNotesDto, required: false })
  @ApiResponse({ status: 200, description: 'Generated content approved.' })
  async approveContent(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @Body() dto?: ApprovalNotesDto,
  ) {
    return this.approvalWorkflow.approveContent(id, userId, dto?.notes);
  }

  @Post('generated-content/:id/reject')
  @Roles(Role.OWNER, Role.ADMIN, Role.MANAGER)
  @ApiOperation({
    summary: 'Reject Generated Content Asset',
    description: 'Human rejection transition: marks content asset as REJECTED with feedback notes.',
  })
  @ApiBody({ type: ApprovalNotesDto, required: false })
  @ApiResponse({ status: 200, description: 'Generated content rejected.' })
  async rejectContent(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @Body() dto?: ApprovalNotesDto,
  ) {
    return this.approvalWorkflow.rejectContent(id, userId, dto?.notes);
  }

  @Post('generated-content/:id/export')
  @Roles(Role.OWNER, Role.ADMIN, Role.MANAGER, Role.MEMBER)
  @ApiOperation({
    summary: 'Export Approved Content Asset',
    description: 'Exports approved AI implementation asset in JSON, Markdown, HTML, or Plain Text format.',
  })
  @ApiBody({ type: ExportFormatDto, required: false })
  @ApiResponse({ status: 200, description: 'Exported asset output.' })
  async exportContent(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @Body() dto?: ExportFormatDto,
  ) {
    return this.contentExporter.exportContent(id, dto?.format || 'json', userId);
  }
}
