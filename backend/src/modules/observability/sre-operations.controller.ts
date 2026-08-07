import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { SREOperationsService } from './sre-operations.service';

@ApiTags('Enterprise SRE Operations & Observability')
@Controller('api/v1/ops')
export class SREOperationsController {
  constructor(private readonly sreService: SREOperationsService) {}

  @Get('health')
  @ApiOperation({ summary: 'Get real-time operational health registry' })
  async getHealth() {
    return this.sreService.getHealthRegistry();
  }

  @Get('status')
  @ApiOperation({ summary: 'Get global platform status summary' })
  async getStatus() {
    const health = await this.sreService.getHealthRegistry();
    return {
      status: 'OPERATIONAL',
      componentsCount: health.length,
      unhealthyCount: health.filter((h) => h.status !== 'UP').length,
    };
  }

  @Get('slo')
  @ApiOperation({ summary: 'Get Service Level Objectives (SLO) metrics' })
  async getSLO() {
    return this.sreService.getSLOMetrics();
  }

  @Get('sla')
  @ApiOperation({ summary: 'Get Service Level Agreements (SLA) status' })
  async getSLA() {
    return this.sreService.getSLAMetrics();
  }

  @Get('alerts')
  @ApiOperation({ summary: 'List active and recent alerts' })
  async getAlerts() {
    return this.sreService.getActiveAlerts();
  }

  @Get('incidents')
  @ApiOperation({ summary: 'Get incident history and postmortem logs' })
  async getIncidents() {
    return this.sreService.getIncidentsHistory();
  }

  @Get('capacity')
  @ApiOperation({ summary: 'Get 30-day capacity forecast metrics' })
  async getCapacity() {
    return this.sreService.getCapacityForecast();
  }

  @Get('costs')
  @ApiOperation({ summary: 'Get FinOps cost breakdown per provider' })
  async getCosts() {
    return this.sreService.getCostObservability();
  }

  @Get('performance')
  @ApiOperation({ summary: 'Get real-time API and queue performance metrics' })
  async getPerformance() {
    return this.sreService.getPerformanceAnalytics();
  }

  @Get('dependencies')
  @ApiOperation({ summary: 'Get third-party dependency health' })
  async getDependencies() {
    return this.sreService.getDependenciesHealth();
  }
}
