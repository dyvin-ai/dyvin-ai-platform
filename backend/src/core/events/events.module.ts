import { Global, Module } from '@nestjs/common';
import { PrismaModule } from '../../database/prisma.module';
import { DomainEventBusService } from './domain-event-bus.service';
import { EventOutboxService } from './event-outbox.service';
import { EventsController } from './events.controller';

@Global()
@Module({
  imports: [PrismaModule],
  controllers: [EventsController],
  providers: [DomainEventBusService, EventOutboxService],
  exports: [DomainEventBusService, EventOutboxService],
})
export class DomainEventsModule {}
