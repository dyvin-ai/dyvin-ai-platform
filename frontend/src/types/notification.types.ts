export type NotificationCategory =
  | 'ANALYSIS'
  | 'RECOMMENDATION'
  | 'VERIFICATION'
  | 'MONITORING'
  | 'BILLING'
  | 'COLLABORATION'
  | 'SYSTEM';

export type ChannelType =
  | 'IN_APP'
  | 'EMAIL'
  | 'SLACK'
  | 'DISCORD'
  | 'MS_TEAMS'
  | 'WEBHOOK'
  | 'SMS';

export interface NotificationItem {
  id: string;
  userId: string;
  category: NotificationCategory;
  title: string;
  message: string;
  isRead: boolean;
  readAt?: string | null;
  createdAt: string;
  metadata?: Record<string, any>;
}

export interface NotificationPreferenceItem {
  id?: string;
  userId: string;
  category: NotificationCategory;
  channel: ChannelType;
  isEnabled: boolean;
}

export interface UpdatePreferenceRequest {
  category: NotificationCategory;
  isEnabled: boolean;
  channel?: ChannelType;
}

export interface ActivityFeedItem {
  id: string;
  userId?: string;
  organizationId?: string;
  projectId?: string;
  action: string;
  createdAt: string;
  user?: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
  metadata?: Record<string, any>;
}
