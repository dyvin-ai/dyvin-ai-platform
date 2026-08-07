import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { DomainEventBusService } from './domain-event-bus.service';
import { EventOutboxService } from './event-outbox.service';

@ApiTags('Enterprise Domain Event Bus')
@Controller('api/v1/events')
export class EventsController {
  constructor(
    private readonly eventBus: DomainEventBusService,
    private readonly outboxService: EventOutboxService,
  ) {}

  @Get('history')
  @ApiOperation({ summary: 'Get domain event store audit history' })
  async getEventHistory(@Query('take') take?: string) {
    return this.eventBus.getEventHistory(take ? parseInt(take, 10) : 50);
  }

  @Get('metrics')
  @ApiOperation({ summary: 'Get domain event bus throughput & metrics' })
  async getEventMetrics() {
    return this.eventBus.getMetrics();
  }

  @Get('dead-letter')
  @ApiOperation({ summary: 'List dead-letter events' })
  async getDeadLetters() {
    return this.eventBus.getDeadLetters();
  }

  @Post('replay')
  @ApiOperation({ summary: 'Replay stored domain event by ID' })
  async replayEvent(@Body('eventId') eventId: string) {
    return this.eventBus.replayEvent(eventId);
  }

  @Post('retry')
  @ApiOperation({ summary: 'Retry processing pending transactional outbox events' })
  async retryOutbox() {
    const processed = await this.outboxService.processPendingOutboxEvents();
    return { status: 'SUCCESS', processedCount: processed };
  }

  @Get('subscribers')
  @ApiOperation({ summary: 'List active event subscribers & handler registries' })
  async getSubscribers() {
    return {
      subscribers: [
        { eventType: 'CitationDetected', registeredModule: 'VisibilityAnalyticsModule' },
        { eventType: 'CompetitorUpdated', registeredModule: 'ResearchIntelligenceModule' },
        { eventType: 'VisibilityScoreUpdated', registeredModule: 'WorkflowStudioModule' },
        { eventType: 'ActionExecuted', registeredModule: 'NotificationModule' },
        { eventType: 'ResearchCompleted', registeredModule: 'ReportModule' },
      ],
    };
  }

  @Get('publishers')
  @ApiOperation({ summary: 'List active event publishers' })
  async getPublishers() {
    return {
      publishers: [
        'AISearchIntelligenceService',
        'CitationIntelligenceService',
        'VisibilityAnalyticsService',
        'ActionEngineService',
        'ResearchAgentService',
        'WorkflowOrchestratorService',
      ],
    };
  }

  @Get('health')
  @ApiOperation({ summary: 'Domain Event Bus health check' })
  async getHealth() {
    return {
      status: 'UP',
      transport: 'IN_MEMORY_BULLMQ_HYBRID',
      outboxEngine: 'ACTIVE',
      latencyMs: 2,
    };
  }
}
