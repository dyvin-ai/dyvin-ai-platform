import { Injectable, Logger } from '@nestjs/common';
import { SupportPriority, SupportStatus } from '@prisma/client';
import { PrismaService } from '../../../database/prisma.service';

export interface CreateSupportTicketInput {
  tenantId: string;
  subject: string;
  description: string;
  priority?: SupportPriority;
}

@Injectable()
export class SupportTicketService {
  private readonly logger = new Logger(SupportTicketService.name);

  constructor(private readonly prisma: PrismaService) {}

  async createTicket(input: CreateSupportTicketInput) {
    this.logger.log(`Creating support ticket for tenant ${input.tenantId}`);

    return this.prisma.supportTicket.create({
      data: {
        tenantId: input.tenantId,
        subject: input.subject,
        description: input.description,
        priority: input.priority || SupportPriority.MEDIUM,
        status: SupportStatus.OPEN,
      },
    });
  }

  async addComment(ticketId: string, authorId: string, commentBody: string, isInternal: boolean = false) {
    return this.prisma.supportComment.create({
      data: {
        ticketId,
        authorId,
        commentBody,
        isInternal,
      },
    });
  }

  async getTickets(tenantId?: string) {
    return this.prisma.supportTicket.findMany({
      where: tenantId ? { tenantId } : undefined,
      include: { comments: true },
      take: 50,
    });
  }
}
