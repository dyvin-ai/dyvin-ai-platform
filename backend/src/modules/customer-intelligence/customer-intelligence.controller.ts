import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CustomerWarehouseService } from './services/customer-warehouse.service';
import { CustomerTimelineService } from './services/customer-timeline.service';
import { CustomerMemoryService } from './services/customer-memory.service';
import { CustomerKnowledgeGraphService } from './services/customer-knowledge-graph.service';
import { PrivacyIsolationService } from './services/privacy-isolation.service';

@ApiTags('Enterprise Customer Intelligence Layer & Privacy')
@Controller('api/v1/customer-intelligence')
export class CustomerIntelligenceController {
  constructor(
    private readonly warehouseService: CustomerWarehouseService,
    private readonly timelineService: CustomerTimelineService,
    private readonly memoryService: CustomerMemoryService,
    private readonly knowledgeGraphService: CustomerKnowledgeGraphService,
    private readonly privacyService: PrivacyIsolationService,
  ) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Get Customer Intelligence Layer dashboard' })
  async getDashboard(@Query('orgId') orgId?: string) {
    return {
      organizationId: orgId || 'org-default',
      warehouseStatus: 'APPEND_ONLY_ISOLATED',
      tenantMemorySize: '42.8 MB',
      knowledgeNodesCount: 120,
    };
  }

  @Get('timeline')
  @ApiOperation({ summary: 'Get customer historical journey timeline' })
  async getTimeline(@Query('orgId') orgId?: string) {
    return this.timelineService.getTimeline(orgId || 'org-default');
  }

  @Get('memory')
  @ApiOperation({ summary: 'Get tenant-isolated customer memory' })
  async getMemory(@Query('orgId') orgId?: string) {
    return this.memoryService.getMemories(orgId || 'org-default');
  }

  @Get('history')
  @ApiOperation({ summary: 'Get customer historical execution log' })
  async getHistory(@Query('orgId') orgId?: string) {
    return {
      organizationId: orgId || 'org-default',
      historyRecordsCount: 2450,
    };
  }

  @Get('knowledge')
  @ApiOperation({ summary: 'Get customer organization knowledge graph' })
  async getKnowledge(@Query('orgId') orgId?: string) {
    return this.knowledgeGraphService.getKnowledgeGraph(orgId || 'org-default');
  }

  @Get('goals')
  @ApiOperation({ summary: 'Get customer goal history' })
  async getGoals(@Query('orgId') orgId?: string) {
    return {
      organizationId: orgId || 'org-default',
      completedGoals: 12,
    };
  }

  @Get('reports')
  @ApiOperation({ summary: 'Get tenant-isolated customer research reports' })
  async getReports(@Query('orgId') orgId?: string) {
    return {
      organizationId: orgId || 'org-default',
      reportsCount: 34,
    };
  }

  @Get('warehouse')
  @ApiOperation({ summary: 'Query tenant-isolated append-only intelligence warehouse' })
  async getWarehouse(@Query('orgId') orgId?: string) {
    return this.warehouseService.getTenantWarehouse(orgId || 'org-default');
  }

  @Get('privacy')
  @ApiOperation({ summary: 'Verify tenant privacy and data isolation compliance' })
  async verifyPrivacy(@Query('orgId') orgId?: string) {
    return this.privacyService.verifyTenantIsolation(orgId || 'org-default');
  }
}
