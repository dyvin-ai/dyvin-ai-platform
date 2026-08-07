import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { AuditService } from '../../audit/audit.service';

export interface CreateCommentInput {
  entityType: string;
  entityId: string;
  userId: string;
  content: string;
  parentId?: string;
  mentionedUserIds?: string[];
}

@Injectable()
export class CollaborationService {
  private readonly logger = new Logger(CollaborationService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  async createComment(input: CreateCommentInput) {
    const comment = await this.prisma.comment.create({
      data: {
        entityType: input.entityType,
        entityId: input.entityId,
        userId: input.userId,
        content: input.content,
        parentId: input.parentId,
      },
      include: { user: { select: { id: true, firstName: true, lastName: true, email: true } } },
    });

    if (input.mentionedUserIds && input.mentionedUserIds.length > 0) {
      await this.prisma.mention.createMany({
        data: input.mentionedUserIds.map((mentionedUserId) => ({
          commentId: comment.id,
          mentionedUserId,
        })),
      });

      for (const mentionedUserId of input.mentionedUserIds) {
        await this.auditService.logAction({
          userId: input.userId,
          action: 'MENTION_TRIGGERED',
          metadata: { commentId: comment.id, mentionedUserId },
        });
      }
    }

    await this.prisma.activityLog.create({
      data: {
        userId: input.userId,
        action: 'COMMENT_ADDED',
        entityType: input.entityType,
        entityId: input.entityId,
        metadata: { commentId: comment.id },
      },
    });

    await this.auditService.logAction({
      userId: input.userId,
      action: 'COMMENT_ADDED',
      metadata: { commentId: comment.id, entityType: input.entityType, entityId: input.entityId },
    });

    return comment;
  }

  async createMention(commentId: string, mentionedUserId: string, userId?: string) {
    const mention = await this.prisma.mention.create({
      data: {
        commentId,
        mentionedUserId,
      },
    });

    await this.auditService.logAction({
      userId,
      action: 'MENTION_TRIGGERED',
      metadata: { commentId, mentionedUserId },
    });

    return mention;
  }

  async getActivityFeed(organizationId?: string, projectId?: string) {
    return this.prisma.activityLog.findMany({
      where: organizationId ? { organizationId } : {},
      include: { user: { select: { id: true, firstName: true, lastName: true, email: true } } },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }
}
