import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ChannelType, NotificationCategory } from '@prisma/client';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { NotificationEngineService } from './services/notification-engine.service';

export class UpdatePreferenceDto {
  category!: NotificationCategory;
  isEnabled!: boolean;
  channel?: ChannelType;
}

export class CreateCommentDto {
  entityType!: string;
  entityId!: string;
  content!: string;
  parentId?: string;
  mentionedUserIds?: string[];
}

export class CreateMentionDto {
  commentId!: string;
  mentionedUserId!: string;
}

@ApiTags('Notification Center, Alerts & Collaboration Platform')
@Controller()
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class NotificationController {
  constructor(private readonly notificationEngine: NotificationEngineService) {}

  @Get('notifications')
  @ApiOperation({
    summary: 'Get In-App Notifications',
    description: 'Retrieves all notifications and delivery statuses for the authenticated user.',
  })
  @ApiResponse({ status: 200, description: 'List of notifications.' })
  async getNotifications(@CurrentUser('id') userId: string) {
    return this.notificationEngine.getNotifications(userId);
  }

  @Get('notifications/:id')
  @ApiOperation({
    summary: 'Get Notification Overview',
    description: 'Retrieves notification details, message payload, and channel delivery statuses.',
  })
  @ApiResponse({ status: 200, description: 'Notification details.' })
  async getNotificationDetails(@Param('id') id: string) {
    return this.notificationEngine.getNotificationDetails(id);
  }

  @Patch('notifications/:id/read')
  @ApiOperation({
    summary: 'Mark Notification as Read',
    description: 'Updates notification read status and sets timestamp.',
  })
  @ApiResponse({ status: 200, description: 'Notification marked as read.' })
  async markAsRead(@Param('id') id: string) {
    return this.notificationEngine.markAsRead(id);
  }

  @Patch('notifications/read-all')
  @ApiOperation({
    summary: 'Mark All Notifications as Read',
    description: 'Marks all unread notifications as read for current user.',
  })
  @ApiResponse({ status: 200, description: 'All notifications marked as read.' })
  async markAllAsRead(@CurrentUser('id') userId: string) {
    return this.notificationEngine.markAllAsRead(userId);
  }

  @Delete('notifications/:id')
  @ApiOperation({
    summary: 'Dismiss / Delete Single Notification',
    description: 'Permanently deletes a single notification for the authenticated user.',
  })
  @ApiResponse({ status: 200, description: 'Notification deleted.' })
  async deleteNotification(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
  ) {
    return this.notificationEngine.deleteNotification(userId, id);
  }

  @Delete('notifications')
  @ApiOperation({
    summary: 'Clear All Notifications',
    description: 'Permanently deletes all notifications for the authenticated user.',
  })
  @ApiResponse({ status: 200, description: 'All notifications cleared.' })
  async clearAllNotifications(@CurrentUser('id') userId: string) {
    return this.notificationEngine.clearAllNotifications(userId);
  }

  @Get('notifications/preferences')
  @ApiOperation({
    summary: 'Get User Notification Preferences',
    description: 'Retrieves per-channel mute rules and notification preferences.',
  })
  @ApiResponse({ status: 200, description: 'Notification preferences.' })
  async getPreferences(@CurrentUser('id') userId: string) {
    return this.notificationEngine.getPreferences(userId);
  }

  @Patch('notifications/preferences')
  @ApiOperation({
    summary: 'Update Notification Preferences',
    description: 'Toggles notification delivery settings for specific categories and channels.',
  })
  @ApiBody({ type: UpdatePreferenceDto })
  @ApiResponse({ status: 200, description: 'Preferences updated.' })
  async updatePreferences(
    @CurrentUser('id') userId: string,
    @Body() dto: UpdatePreferenceDto,
  ) {
    return this.notificationEngine.updatePreferences(userId, dto.category, dto.isEnabled, dto.channel);
  }

  @Post('comments')
  @ApiOperation({
    summary: 'Post Team Collaboration Comment',
    description: 'Adds team comment on recommendation, scan, report, or entity with optional @mentions.',
  })
  @ApiBody({ type: CreateCommentDto })
  @ApiResponse({ status: 201, description: 'Comment created.' })
  async createComment(
    @CurrentUser('id') userId: string,
    @Body() dto: CreateCommentDto,
  ) {
    return this.notificationEngine.createComment({
      entityType: dto.entityType,
      entityId: dto.entityId,
      userId,
      content: dto.content,
      parentId: dto.parentId,
      mentionedUserIds: dto.mentionedUserIds,
    });
  }

  @Post('mentions')
  @ApiOperation({
    summary: 'Trigger User Mention Notification',
    description: 'Triggers @user mention notification on existing comment.',
  })
  @ApiBody({ type: CreateMentionDto })
  @ApiResponse({ status: 201, description: 'Mention created.' })
  async createMention(
    @CurrentUser('id') userId: string,
    @Body() dto: CreateMentionDto,
  ) {
    return this.notificationEngine.createMention(dto.commentId, dto.mentionedUserId, userId);
  }

  @Get('activity')
  @ApiOperation({
    summary: 'Get Team Activity Feed',
    description: 'Retrieves audit activity logs across team members and project entities.',
  })
  @ApiQuery({ name: 'organizationId', required: false, description: 'Filter by Organization ID' })
  @ApiQuery({ name: 'projectId', required: false, description: 'Filter by Project ID' })
  @ApiResponse({ status: 200, description: 'Activity feed records.' })
  async getActivityFeed(
    @Query('organizationId') organizationId?: string,
    @Query('projectId') projectId?: string,
  ) {
    return this.notificationEngine.getActivityFeed(organizationId, projectId);
  }
}
