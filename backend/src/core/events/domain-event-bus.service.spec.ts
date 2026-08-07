import { Test, TestingModule } from '@nestjs/testing';
import { DomainEventBusService } from './domain-event-bus.service';
import { EventOutboxService } from './event-outbox.service';
import { PrismaService } from '../../database/prisma.service';

describe('DomainEventBusService & Event-Driven Architecture Spec', () => {
  let eventBus: DomainEventBusService;
  let outboxService: EventOutboxService;

  const mockPrismaService = {
    domainEventStore: {
      create: jest.fn().mockImplementation(({ data }) => Promise.resolve({ id: 'store-1', ...data })),
      findMany: jest.fn().mockResolvedValue([]),
      findUnique: jest.fn().mockImplementation(({ where }) => Promise.resolve({
        eventId: where.eventId,
        eventType: 'CitationDetected',
        aggregate: 'Citation',
        aggregateId: 'cite-100',
        payload: { rank: 1 },
        correlationId: 'corr-100',
      })),
    },
    domainEventOutbox: {
      create: jest.fn().mockImplementation(({ data }) => Promise.resolve({ id: 'out-1', ...data })),
      findMany: jest.fn().mockResolvedValue([]),
      update: jest.fn().mockImplementation(({ where, data }) => Promise.resolve({ id: where.id, ...data })),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DomainEventBusService,
        EventOutboxService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    eventBus = module.get<DomainEventBusService>(DomainEventBusService);
    outboxService = module.get<EventOutboxService>(EventOutboxService);
  });

  it('should publish domain event and trigger registered subscriber handler', async () => {
    let subscriberFired = false;

    eventBus.subscribe('CitationDetected', async (event) => {
      subscriberFired = true;
      expect(event.metadata.eventType).toBe('CitationDetected');
      expect(event.payload.url).toBe('https://dyvin.ai');
    });

    const event = await eventBus.publish(
      'CitationDetected',
      'Citation',
      'cite-100',
      { url: 'https://dyvin.ai', rank: 1 },
    );

    expect(event).toBeDefined();
    expect(event.metadata.eventId).toBeDefined();
    expect(subscriberFired).toBe(true);
  });

  it('should return metrics for published domain events', async () => {
    await eventBus.publish('VisibilityScoreUpdated', 'Visibility', 'vis-1', { score: 94.2 });

    const metrics = await eventBus.getMetrics();
    expect(metrics.totalEventsPublished).toBeGreaterThanOrEqual(1);
    expect(metrics.eventTypeMetrics['VisibilityScoreUpdated']).toBeGreaterThanOrEqual(1);
  });

  it('should save domain event to Transactional Outbox', async () => {
    const outbox = await outboxService.saveToOutbox(
      'Organization',
      'org-100',
      'OrganizationCreated',
      { name: 'Dyvin Corp' },
    );

    expect(outbox).toBeDefined();
    expect(outbox.id).toBe('out-1');
  });

  it('should replay historical domain event from Event Store', async () => {
    const replayed = await eventBus.replayEvent('event-uuid-100');
    expect(replayed).toBeDefined();
    expect(replayed.metadata.eventType).toBe('CitationDetected');
  });
});
