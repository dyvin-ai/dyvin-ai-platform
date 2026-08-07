import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ApprovalStatus, GeneratedContentStatus } from '@prisma/client';
import { PrismaService } from '../../../database/prisma.service';
import { AuditService } from '../../audit/audit.service';

@Injectable()
export class ApprovalWorkflowService {
  private readonly logger = new Logger(ApprovalWorkflowService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  async approveContent(contentId: string, userId?: string, notes?: string) {
    const content = await this.prisma.generatedContent.findUnique({
      where: { id: contentId },
    });

    if (!content) {
      throw new NotFoundException('Generated content asset not found.');
    }

    const previousStatus = content.status;
    const newStatus = GeneratedContentStatus.APPROVED;

    await this.prisma.generatedContent.update({
      where: { id: contentId },
      data: { status: newStatus },
    });

    await this.prisma.generationHistory.create({
      data: {
        contentId,
        previousStatus,
        newStatus,
        changedById: userId,
      },
    });

    const request = await this.prisma.approvalRequest.create({
      data: {
        contentId,
        requestedById: userId,
        status: ApprovalStatus.APPROVED,
        notes,
      },
    });

    await this.prisma.approvalHistory.create({
      data: {
        requestId: request.id,
        action: 'APPROVED',
        actedById: userId,
      },
    });

    await this.auditService.logAction({
      userId,
      action: 'CONTENT_APPROVED',
      metadata: { contentId, previousStatus, newStatus },
    });

    return { message: 'Generated content approved successfully.', contentId, status: newStatus };
  }

  async rejectContent(contentId: string, userId?: string, notes?: string) {
    const content = await this.prisma.generatedContent.findUnique({
      where: { id: contentId },
    });

    if (!content) {
      throw new NotFoundException('Generated content asset not found.');
    }

    const previousStatus = content.status;
    const newStatus = GeneratedContentStatus.REJECTED;

    await this.prisma.generatedContent.update({
      where: { id: contentId },
      data: { status: newStatus },
    });

    await this.prisma.generationHistory.create({
      data: {
        contentId,
        previousStatus,
        newStatus,
        changedById: userId,
      },
    });

    const request = await this.prisma.approvalRequest.create({
      data: {
        contentId,
        requestedById: userId,
        status: ApprovalStatus.REJECTED,
        notes,
      },
    });

    await this.prisma.approvalHistory.create({
      data: {
        requestId: request.id,
        action: 'REJECTED',
        actedById: userId,
      },
    });

    await this.auditService.logAction({
      userId,
      action: 'CONTENT_REJECTED',
      metadata: { contentId, previousStatus, newStatus, notes },
    });

    return { message: 'Generated content rejected successfully.', contentId, status: newStatus };
  }
}
