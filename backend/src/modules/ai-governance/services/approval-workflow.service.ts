import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class ApprovalWorkflowService {
  private readonly logger = new Logger(ApprovalWorkflowService.name);

  constructor(private readonly prisma: PrismaService) {}

  async approveWorkflow(organizationId: string, workflowName: string, approverRole = 'EXECUTIVE_APPROVER') {
    return this.prisma.governanceApproval.create({
      data: {
        organizationId,
        workflowName,
        status: 'APPROVED',
        approverRole,
      },
    });
  }

  async getApprovals(organizationId: string) {
    return this.prisma.governanceApproval.findMany({
      where: { organizationId },
    });
  }
}
