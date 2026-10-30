import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { Request } from 'express';
import { CurrentOrganization } from '../../common/decorators/current-organization.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { ScanService } from './scan.service';

@ApiTags('Scans')
@Controller()
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
@ApiHeader({
  name: 'X-Organization-Id',
  description: 'Active Organization ID',
  required: true,
})
export class ScanController {
  constructor(private readonly scanService: ScanService) {}

  @Post('projects/:id/scan')
  @Roles(Role.OWNER, Role.ADMIN, Role.MANAGER)
  @ApiOperation({
    summary: 'Initiate Website Scan',
    description:
      'Triggers a structured website crawl and intelligence extraction for the specified project.',
  })
  @ApiResponse({ status: 201, description: 'Scan queued successfully.' })
  async initiateScan(
    @Param('id') projectId: string,
    @CurrentOrganization() orgId: string,
    @CurrentUser('id') userId: string,
    @Body() body?: { url?: string },
    @Req() req: Request = {} as Request,
  ) {
    const ipAddress = req.ip;
    const userAgent = req.get ? req.get('user-agent') : undefined;
    return this.scanService.initiateProjectScan(
      projectId,
      orgId,
      userId,
      ipAddress,
      userAgent,
      body?.url,
    );
  }

  @Get('scans')
  @ApiOperation({
    summary: 'List Organization Scans',
    description: 'Lists all scans for the current active organization, optionally filtered by project.',
  })
  @ApiResponse({ status: 200, description: 'List of scans.' })
  async getScans(
    @CurrentOrganization() orgId: string,
    @Query('projectId') projectId?: string,
  ) {
    return this.scanService.getOrganizationScans(orgId, projectId);
  }

  @Get('scans/:id')
  @ApiOperation({
    summary: 'Get Scan Summary',
    description: 'Retrieves status and count summary for specified scan.',
  })
  @ApiResponse({ status: 200, description: 'Scan summary.' })
  async getScanDetails(
    @Param('id') scanId: string,
    @CurrentOrganization() orgId: string,
  ) {
    return this.scanService.getScanDetails(scanId, orgId);
  }

  @Get('scans/:id/pages')
  @ApiOperation({
    summary: 'Get Crawled Scan Pages',
    description: 'Lists all HTML pages discovered and crawled during scan.',
  })
  @ApiResponse({ status: 200, description: 'List of scan pages.' })
  async getScanPages(
    @Param('id') scanId: string,
    @CurrentOrganization() orgId: string,
  ) {
    return this.scanService.getScanPages(scanId, orgId);
  }

  @Get('scans/:id/metadata')
  @ApiOperation({
    summary: 'Get Scan Page Metadata',
    description: 'Retrieves extracted OpenGraph, Twitter cards, keywords, and meta tags.',
  })
  @ApiResponse({ status: 200, description: 'Extracted scan metadata.' })
  async getScanMetadata(
    @Param('id') scanId: string,
    @CurrentOrganization() orgId: string,
  ) {
    return this.scanService.getScanMetadata(scanId, orgId);
  }

  @Get('scans/:id/structured-data')
  @ApiOperation({
    summary: 'Get Scan Structured Data',
    description: 'Retrieves extracted schema.org JSON-LD and microdata entries.',
  })
  @ApiResponse({ status: 200, description: 'Extracted structured data.' })
  async getScanStructuredData(
    @Param('id') scanId: string,
    @CurrentOrganization() orgId: string,
  ) {
    return this.scanService.getScanStructuredData(scanId, orgId);
  }

  @Get('scans/:id/technologies')
  @ApiOperation({
    summary: 'Get Detected Technologies',
    description: 'Retrieves detected tech stack signatures (React, Next.js, Cloudflare, etc.).',
  })
  @ApiResponse({ status: 200, description: 'Detected technologies.' })
  async getScanTechnologies(
    @Param('id') scanId: string,
    @CurrentOrganization() orgId: string,
  ) {
    return this.scanService.getScanTechnologies(scanId, orgId);
  }
}
