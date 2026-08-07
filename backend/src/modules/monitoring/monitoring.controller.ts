import { Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiHeader, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { MonitoringEngineService } from './services/monitoring-engine.service';

@ApiTags('Continuous Monitoring & Automation Engine')
@Controller()
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
@ApiHeader({
  name: 'X-Organization-Id',
  description: 'Active Organization ID',
  required: true,
})
export class MonitoringController {
  constructor(private readonly monitoringService: MonitoringEngineService) {}

  @Post('projects/:id/monitoring/start')
  @Roles(Role.OWNER, Role.ADMIN, Role.MANAGER)
  @ApiOperation({
    summary: 'Start Continuous Monitoring',
    description: 'Enables scheduled website monitoring and automated AI change detection for a project.',
  })
  @ApiResponse({ status: 201, description: 'Monitoring enabled and job scheduled.' })
  async startMonitoring(
    @Param('id') projectId: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.monitoringService.startMonitoring(projectId, userId);
  }

  @Post('projects/:id/monitoring/stop')
  @Roles(Role.OWNER, Role.ADMIN, Role.MANAGER)
  @ApiOperation({
    summary: 'Stop Continuous Monitoring',
    description: 'Disables automated website monitoring schedule for a project.',
  })
  @ApiResponse({ status: 200, description: 'Monitoring stopped.' })
  async stopMonitoring(
    @Param('id') projectId: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.monitoringService.stopMonitoring(projectId, userId);
  }

  @Get('monitoring')
  @ApiOperation({
    summary: 'List Monitoring Jobs',
    description: 'Lists all continuous monitoring jobs for organization or project.',
  })
  @ApiQuery({ name: 'projectId', required: false, description: 'Filter by Project ID' })
  @ApiResponse({ status: 200, description: 'List of monitoring jobs.' })
  async getJobs(@Query('projectId') projectId?: string) {
    return this.monitoringService.getMonitoringJobs(projectId);
  }

  @Get('monitoring/:id')
  @ApiOperation({
    summary: 'Get Monitoring Job Details',
    description: 'Retrieves monitoring job overview, schedule, and recent run history.',
  })
  @ApiResponse({ status: 200, description: 'Monitoring job details.' })
  async getJobDetails(@Param('id') id: string) {
    return this.monitoringService.getMonitoringDetails(id);
  }

  @Get('monitoring/:id/history')
  @ApiOperation({
    summary: 'Get Monitoring Run History',
    description: 'Retrieves historical monitoring run logs and change counts.',
  })
  @ApiResponse({ status: 200, description: 'Monitoring run history.' })
  async getHistory(@Param('id') id: string) {
    return this.monitoringService.getMonitoringHistory(id);
  }

  @Get('monitoring/:id/changes')
  @ApiOperation({
    summary: 'Get Detected Changes',
    description: 'Retrieves detected website, metadata, schema, and tech changes for specified monitoring job.',
  })
  @ApiResponse({ status: 200, description: 'Detected website changes.' })
  async getChanges(@Param('id') id: string) {
    return this.monitoringService.getMonitoringChanges(id);
  }
}
