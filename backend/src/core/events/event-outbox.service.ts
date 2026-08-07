import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class EventOutboxService {
  private readonly logger = new Logger(EventOutboxService.name);

  constructor(private readonly prisma: PrismaService) {}

  async saveToOutbox(aggregate: string, aggregateId: string, eventType: string, payload: any) {
    return this.prisma.domainEventOutbox.create({
      data: {
        aggregate,
        aggregateId,
        eventType,
        payload,
        status: 'PENDING',
      },
    });
  }

  async processPendingOutboxEvents() {
    const pendingEvents = await this.prisma.domainEventOutbox.findMany({
      where: { status: 'PENDING' },
      take: 50,
    });

    for (const outbox of pendingEvents) {
      await this.prisma.domainEventOutbox.update({
        where: { id: outbox.id },
        data: { status: 'PROCESSED', processedAt: new Date() },
      });
    }

    return pendingEvents.length;
  }
}
