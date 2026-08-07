import { Injectable, Logger } from '@nestjs/common';
import { WorkflowTriggerType } from '@prisma/client';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class WorkflowTriggerConditionService {
  private readonly logger = new Logger(WorkflowTriggerConditionService.name);

  constructor(private readonly prisma: PrismaService) {}

  async evaluateCondition(fieldValue: any, operator: string, targetValue: any): Promise<boolean> {
    switch (operator.toUpperCase()) {
      case 'EQUALS':
        return fieldValue === targetValue;
      case 'CONTAINS':
        return String(fieldValue).includes(String(targetValue));
      case 'GREATER_THAN':
        return Number(fieldValue) > Number(targetValue);
      case 'REGEX':
        return new RegExp(targetValue).test(String(fieldValue));
      default:
        return true;
    }
  }

  async createTrigger(triggerType: WorkflowTriggerType, eventKey?: string) {
    return this.prisma.workflowTrigger.create({
      data: {
        triggerType,
        eventKey,
      },
    });
  }
}
