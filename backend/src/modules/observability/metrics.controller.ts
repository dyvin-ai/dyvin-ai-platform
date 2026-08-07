import { Controller, Get, Header } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MetricsService } from './services/metrics.service';

@ApiTags('Business Observability & Telemetry')
@Controller()
export class MetricsController {
  constructor(private readonly metricsService: MetricsService) {}

  @Get('metrics')
  @Header('Content-Type', 'text/plain; version=0.0.4')
  @ApiOperation({
    summary: 'Prometheus Metrics Scraping Endpoint',
    description: 'Exposes real-time business metrics, scan counts, AI requests, revenue, and queue health for Prometheus / Grafana.',
  })
  @ApiResponse({ status: 200, description: 'Prometheus metrics text stream.' })
  async getMetrics(): Promise<string> {
    return this.metricsService.generatePrometheusMetrics();
  }
}
