import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ExportFormat, ReportType, Role } from '@prisma/client';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { ReportEngineService } from './services/report-engine.service';

export class GenerateReportDto {
  projectId!: string;
  reportType?: ReportType;
  title?: string;
}

export class ExportReportDto {
  reportId!: string;
  format?: ExportFormat;
}

@ApiTags('Reports, Analytics & Executive Dashboard Engine')
@Controller()
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ReportController {
  constructor(private readonly reportEngine: ReportEngineService) {}

  @Get('dashboard')
  @ApiOperation({
    summary: 'Get Executive Dashboard Overview',
    description: 'Retrieves overall AI visibility score cards, category breakdown, verifications, and auto-fix assets.',
  })
  @ApiQuery({ name: 'projectId', required: true, description: 'Project ID' })
  @ApiResponse({ status: 200, description: 'Executive dashboard overview.' })
  async getDashboard(
    @Query('projectId') projectId: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.reportEngine.getExecutiveDashboard(projectId, userId);
  }

  @Get('dashboard/widgets')
  @ApiOperation({
    summary: 'Get Dashboard Widgets & Chart Payloads',
    description: 'Retrieves API-ready chart visualization data (Line Charts, Bar Charts, Pie Charts, Heatmaps).',
  })
  @ApiQuery({ name: 'projectId', required: true, description: 'Project ID' })
  @ApiResponse({ status: 200, description: 'Dashboard widgets.' })
  async getWidgets(@Query('projectId') projectId: string) {
    return this.reportEngine.getDashboardWidgets(projectId);
  }

  @Get('analytics')
  @ApiOperation({
    summary: 'Get Analytics Overview & Snapshots',
    description: 'Retrieves historical score snapshots (Knowledge, Authority, Trust, Technical).',
  })
  @ApiQuery({ name: 'projectId', required: true, description: 'Project ID' })
  @ApiResponse({ status: 200, description: 'Analytics overview.' })
  async getAnalytics(@Query('projectId') projectId: string) {
    return this.reportEngine.getAnalyticsOverview(projectId);
  }

  @Get('analytics/trends')
  @ApiOperation({
    summary: 'Get Score Trends & Industry Benchmarks',
    description: 'Retrieves visibility growth trends and industry comparison benchmarks.',
  })
  @ApiQuery({ name: 'projectId', required: true, description: 'Project ID' })
  @ApiQuery({ name: 'periodDays', required: false, description: 'Period days (default 30)' })
  @ApiResponse({ status: 200, description: 'Trend analysis data.' })
  async getTrends(
    @Query('projectId') projectId: string,
    @Query('periodDays') periodDays?: number,
  ) {
    return this.reportEngine.getTrendAnalysis(projectId, periodDays);
  }

  @Get('reports')
  @ApiOperation({
    summary: 'List Generated Reports',
    description: 'Lists all executive, technical, knowledge, and verification reports.',
  })
  @ApiQuery({ name: 'projectId', required: false, description: 'Filter by Project ID' })
  @ApiResponse({ status: 200, description: 'List of reports.' })
  async getReports(@Query('projectId') projectId?: string) {
    return this.reportEngine.getReports(projectId);
  }

  @Get('reports/:id')
  @ApiOperation({
    summary: 'Get Report Overview & Sections',
    description: 'Retrieves report details, summary, and structured content sections.',
  })
  @ApiResponse({ status: 200, description: 'Report details.' })
  async getReportDetails(@Param('id') reportId: string) {
    return this.reportEngine.getReportDetails(reportId);
  }

  @Post('reports/generate')
  @Roles(Role.OWNER, Role.ADMIN, Role.MANAGER)
  @ApiOperation({
    summary: 'Generate Intelligence Report',
    description: 'Builds a new executive, AI visibility, knowledge, technical, or verification report.',
  })
  @ApiBody({ type: GenerateReportDto })
  @ApiResponse({ status: 201, description: 'Report generated successfully.' })
  async generateReport(
    @CurrentUser('id') userId: string,
    @Body() dto: GenerateReportDto,
  ) {
    return this.reportEngine.generateReport(dto.projectId, dto.reportType, dto.title, userId);
  }

  @Post('reports/export')
  @Roles(Role.OWNER, Role.ADMIN, Role.MANAGER, Role.MEMBER)
  @ApiOperation({
    summary: 'Export Report Document',
    description: 'Exports generated report document to PDF, CSV, Excel, JSON, or Markdown format.',
  })
  @ApiBody({ type: ExportReportDto })
  @ApiResponse({ status: 200, description: 'Export job completed.' })
  async exportReport(
    @CurrentUser('id') userId: string,
    @Body() dto: ExportReportDto,
  ) {
    return this.reportEngine.exportReport(dto.reportId, dto.format, userId);
  }
}
