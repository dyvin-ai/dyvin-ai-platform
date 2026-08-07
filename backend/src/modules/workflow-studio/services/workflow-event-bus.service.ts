import { Injectable, Logger } from '@nestjs/common';
import { WorkflowEventType } from '@prisma/client';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class WorkflowEventBusService {
  private readonly logger = new Logger(WorkflowEventBusService.name);

  constructor(private readonly prisma: PrismaService) {}

  async publishEvent(eventType: WorkflowEventType, payload: Record<string, any>) {
    this.logger.log(`Publishing workflow event: ${eventType}`);

    return this.prisma.workflowEvent.create({
      data: {
        eventType,
        payloadJson: payload,
      },
    });
  }

  async getHistory() {
    return this.prisma.workflowHistory.findMany({ take: 50 });
  }
}
