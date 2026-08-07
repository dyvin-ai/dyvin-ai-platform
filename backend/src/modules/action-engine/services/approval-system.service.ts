import { Injectable, Logger } from '@nestjs/common';
import { ActionApprovalStatus } from '@prisma/client';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class ApprovalSystemService {
  private readonly logger = new Logger(ApprovalSystemService.name);

  constructor(private readonly prisma: PrismaService) {}

  async requestApproval(actionId: string, approverId: string) {
    this.logger.log(`Requesting approval for action ${actionId} by approver ${approverId}`);

    return this.prisma.actionApproval.create({
      data: {
        actionId,
        approverId,
        status: ActionApprovalStatus.PENDING,
      },
    });
  }

  async processApproval(approvalId: string, approved: boolean, notes?: string) {
    const status = approved ? ActionApprovalStatus.APPROVED : ActionApprovalStatus.REJECTED;

    return this.prisma.actionApproval.update({
      where: { id: approvalId },
      data: {
        status,
        notes,
        approvedAt: new Date(),
      },
    });
  }
}
