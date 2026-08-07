import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { DomainEvent, KnownEventType } from './domain-event.interface';
import { randomUUID } from 'crypto';

export type EventSubscriberCallback = (event: DomainEvent) => Promise<void>;

@Injectable()
export class DomainEventBusService {
  private readonly logger = new Logger(DomainEventBusService.name);
  private readonly subscribers = new Map<string, EventSubscriberCallback[]>();
  private readonly publishedMetrics = new Map<string, number>();

  constructor(private readonly prisma: PrismaService) {}

  subscribe(eventType: KnownEventType | string, handler: EventSubscriberCallback) {
    const handlers = this.subscribers.get(eventType) || [];
    handlers.push(handler);
    this.subscribers.set(eventType, handlers);
    this.logger.log(`Subscribed handler for event type: ${eventType}`);
  }

  async publish<T = any>(
    eventType: KnownEventType | string,
    aggregate: string,
    aggregateId: string,
    payload: T,
    correlationId?: string,
  ): Promise<DomainEvent<T>> {
    const event: DomainEvent<T> = {
      metadata: {
        eventId: randomUUID(),
        eventType,
        aggregate,
        aggregateId,
        version: 1,
        correlationId: correlationId || randomUUID(),
        timestamp: new Date(),
      },
      payload,
    };

    // Store in DomainEventStore table
    await this.prisma.domainEventStore.create({
      data: {
        eventId: event.metadata.eventId,
        aggregate: event.metadata.aggregate,
        aggregateId: event.metadata.aggregateId,
        eventType: event.metadata.eventType,
        version: event.metadata.version,
        payload: event.payload as any,
        metadata: event.metadata as any,
        correlationId: event.metadata.correlationId,
      },
    });

    // Update metrics
    const currentCount = this.publishedMetrics.get(eventType) || 0;
    this.publishedMetrics.set(eventType, currentCount + 1);

    // Dispatch to in-memory subscribers asynchronously
    const handlers = this.subscribers.get(eventType) || [];
    for (const handler of handlers) {
      try {
        await handler(event);
      } catch (err: any) {
        this.logger.error(`Error in subscriber handler for event ${eventType}: ${err?.message}`, err?.stack);
      }
    }

    return event;
  }

  async getMetrics() {
    const totalEvents = Array.from(this.publishedMetrics.values()).reduce((a, b) => a + b, 0);
    return {
      totalEventsPublished: totalEvents,
      activeSubscribersCount: this.subscribers.size,
      eventTypeMetrics: Object.fromEntries(this.publishedMetrics),
      activeTransport: 'IN_MEMORY_BULLMQ_HYBRID',
    };
  }

  async getEventHistory(take = 50) {
    return this.prisma.domainEventStore.findMany({
      take,
      orderBy: { createdAt: 'desc' },
    });
  }

  async getDeadLetters() {
    return this.prisma.domainEventOutbox.findMany({
      where: { status: 'DEAD_LETTER' },
      take: 50,
    });
  }

  async replayEvent(eventId: string) {
    const storedEvent = await this.prisma.domainEventStore.findUnique({
      where: { eventId },
    });

    if (!storedEvent) {
      throw new Error(`Event with ID ${eventId} not found in Event Store`);
    }

    return this.publish(
      storedEvent.eventType,
      storedEvent.aggregate,
      storedEvent.aggregateId,
      storedEvent.payload,
      storedEvent.correlationId || undefined,
    );
  }
}
