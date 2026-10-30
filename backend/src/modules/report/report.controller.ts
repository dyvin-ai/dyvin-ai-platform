import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Res,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from "class-validator";
import { ExportFormat, ReportType, Role } from "@prisma/client";
import { Response } from "express";
import * as fs from "fs";
import { CurrentOrganization } from "../../common/decorators/current-organization.decorator";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { Roles } from "../../common/decorators/roles.decorator";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { ReportEngineService } from "./services/report-engine.service";

export class GenerateReportDto {
  @IsString()
  @IsNotEmpty()
  projectId!: string;

  @IsOptional()
  @IsEnum(ReportType)
  reportType?: ReportType;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsNumber()
  periodDays?: number;

  @IsOptional()
  @IsString()
  periodStart?: string;

  @IsOptional()
  @IsString()
  periodEnd?: string;
}

export class ExportReportDto {
  @IsOptional()
  @IsString()
  reportId?: string;

  @IsOptional()
  @IsEnum(ExportFormat)
  format?: ExportFormat;
}

@ApiTags("Reports, Analytics & Executive Dashboard Engine")
@Controller()
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ReportController {
  constructor(private readonly reportEngine: ReportEngineService) {}

  @Get("dashboard")
  @ApiOperation({
    summary: "Get Executive Dashboard Overview",
    description:
      "Retrieves overall AI visibility score cards, category breakdown, verifications, and auto-fix assets.",
  })
  @ApiQuery({ name: "projectId", required: true, description: "Project ID" })
  @ApiResponse({ status: 200, description: "Executive dashboard overview." })
  async getDashboard(
    @Query("projectId") projectId: string,
    @CurrentUser("id") userId: string,
  ) {
    return this.reportEngine.getExecutiveDashboard(projectId, userId);
  }

  @Get("dashboard/widgets")
  @ApiOperation({
    summary: "Get Dashboard Widgets & Chart Payloads",
    description:
      "Retrieves API-ready chart visualization data (Line Charts, Bar Charts, Pie Charts, Heatmaps).",
  })
  @ApiQuery({ name: "projectId", required: true, description: "Project ID" })
  @ApiResponse({ status: 200, description: "Dashboard widgets." })
  async getWidgets(@Query("projectId") projectId: string) {
    return this.reportEngine.getDashboardWidgets(projectId);
  }

  @Get("analytics")
  @ApiOperation({
    summary: "Get Analytics Overview & Snapshots",
    description:
      "Retrieves historical score snapshots (Knowledge, Authority, Trust, Technical).",
  })
  @ApiQuery({ name: "projectId", required: true, description: "Project ID" })
  @ApiResponse({ status: 200, description: "Analytics overview." })
  async getAnalytics(@Query("projectId") projectId: string) {
    return this.reportEngine.getAnalyticsOverview(projectId);
  }

  @Get("analytics/trends")
  @ApiOperation({
    summary: "Get Score Trends & Industry Benchmarks",
    description:
      "Retrieves visibility growth trends and industry comparison benchmarks.",
  })
  @ApiQuery({ name: "projectId", required: true, description: "Project ID" })
  @ApiQuery({
    name: "periodDays",
    required: false,
    description: "Period days (default 30)",
  })
  @ApiResponse({ status: 200, description: "Trend analysis data." })
  async getTrends(
    @Query("projectId") projectId: string,
    @Query("periodDays") periodDays?: number,
  ) {
    return this.reportEngine.getTrendAnalysis(projectId, periodDays);
  }

  @Get("reports")
  @ApiOperation({
    summary: "List Generated Reports",
    description:
      "Lists all executive, technical, knowledge, and verification reports.",
  })
  @ApiQuery({
    name: "projectId",
    required: false,
    description: "Filter by Project ID",
  })
  @ApiResponse({ status: 200, description: "List of reports." })
  async getReports(
    @Query("projectId") projectId?: string,
    @CurrentOrganization() organizationId?: string,
  ) {
    return this.reportEngine.getReports(projectId, organizationId || undefined);
  }

  @Get("reports/:id")
  @ApiOperation({
    summary: "Get Report Overview & Sections",
    description:
      "Retrieves report details, summary, and structured content sections.",
  })
  @ApiResponse({ status: 200, description: "Report details." })
  async getReportDetails(
    @Param("id") reportId: string,
    @CurrentOrganization() organizationId?: string,
  ) {
    return this.reportEngine.getReportDetails(
      reportId,
      organizationId || undefined,
    );
  }

  @Post(["reports", "reports/generate"])
  @Roles(Role.OWNER, Role.ADMIN, Role.MANAGER, Role.MEMBER)
  @ApiOperation({
    summary: "Generate Intelligence Report",
    description:
      "Builds a new executive, AI visibility, knowledge, technical, or verification report.",
  })
  @ApiBody({ type: GenerateReportDto })
  @ApiResponse({ status: 201, description: "Report generated successfully." })
  async generateReport(
    @CurrentUser("id") userId: string,
    @CurrentOrganization() organizationId: string | null,
    @Body() dto: GenerateReportDto,
  ) {
    return this.reportEngine.generateReport(
      dto.projectId,
      dto.reportType,
      dto.title,
      userId,
      organizationId || undefined,
      dto.periodDays,
      dto.periodStart,
      dto.periodEnd,
    );
  }

  @Post(["reports/:id/export", "reports/export"])
  @Roles(Role.OWNER, Role.ADMIN, Role.MANAGER, Role.MEMBER)
  @ApiOperation({
    summary: "Export Report Document",
    description:
      "Exports generated report document to PDF, CSV, Excel, JSON, or Markdown format.",
  })
  @ApiBody({ type: ExportReportDto })
  @ApiResponse({ status: 200, description: "Export job completed." })
  async exportReport(
    @CurrentUser("id") userId: string,
    @CurrentOrganization() organizationId: string | null,
    @Param("id") paramId: string | undefined,
    @Body() dto: ExportReportDto,
  ) {
    const reportId = paramId || dto.reportId;
    if (!reportId) {
      throw new Error("Report ID is required for export.");
    }
    return this.reportEngine.exportReport(
      reportId,
      dto.format,
      userId,
      organizationId || undefined,
    );
  }

  @Get("reports/:id/exports")
  @ApiOperation({
    summary: "List Report Exports",
    description: "Lists all generated export artifacts for a specific report.",
  })
  async getExports(
    @Param("id") reportId: string,
    @CurrentOrganization() organizationId?: string,
  ) {
    return this.reportEngine.getExports(reportId, organizationId || undefined);
  }

  @Get("reports/:id/exports/:exportId/download")
  @ApiOperation({
    summary: "Download Export File Artifact",
    description:
      "Streams the exported PDF, CSV, or JSON file directly with authenticated attachment headers.",
  })
  async downloadExport(
    @Param("id") reportId: string,
    @Param("exportId") exportId: string,
    @CurrentUser("id") userId: string,
    @CurrentOrganization() organizationId: string | null,
    @Res() res: Response,
  ) {
    const fileData = await this.reportEngine.getExportFile(
      reportId,
      exportId,
      organizationId || undefined,
      userId,
    );

    res.setHeader("Content-Type", fileData.mimeType);
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${fileData.filename}"`,
    );
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    if (fileData.fileSizeBytes) {
      res.setHeader("Content-Length", fileData.fileSizeBytes);
    }

    const fileStream = fs.createReadStream(fileData.filePath);
    fileStream.pipe(res);
  }

  @Delete("reports/:id")
  @Roles(Role.OWNER, Role.ADMIN, Role.MANAGER)
  @ApiOperation({
    summary: "Delete Generated Report",
    description: "Permanently removes a report snapshot and its export files.",
  })
  async deleteReport(
    @Param("id") reportId: string,
    @CurrentUser("id") userId: string,
    @CurrentOrganization() organizationId?: string,
  ) {
    return this.reportEngine.deleteReport(
      reportId,
      organizationId || undefined,
      userId,
    );
  }
}
