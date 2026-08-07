import { client } from './client';
import type {
  NotificationItem,
  NotificationPreferenceItem,
  UpdatePreferenceRequest,
  ActivityFeedItem,
} from '@app-types/notification.types';

export async function getNotifications(): Promise<NotificationItem[]> {
  const res = await client.get<NotificationItem[]>('/api/v1/notifications');
  return res.data;
}

export async function markNotificationAsRead(id: string): Promise<NotificationItem> {
  const res = await client.patch<NotificationItem>(`/api/v1/notifications/${id}/read`);
  return res.data;
}

export async function markAllNotificationsAsRead(): Promise<{ success: boolean }> {
  const res = await client.patch<{ success: boolean }>('/api/v1/notifications/read-all');
  return res.data;
}

export async function getNotificationPreferences(): Promise<NotificationPreferenceItem[]> {
  const res = await client.get<NotificationPreferenceItem[]>('/api/v1/notifications/preferences');
  return res.data;
}

export async function updateNotificationPreference(
  data: UpdatePreferenceRequest
): Promise<NotificationPreferenceItem> {
  const res = await client.patch<NotificationPreferenceItem>(
    '/api/v1/notifications/preferences',
    data
  );
  return res.data;
}

export async function getActivityFeed(
  orgId?: string,
  projectId?: string
): Promise<ActivityFeedItem[]> {
  const params: Record<string, string> = {};
  if (orgId) params.organizationId = orgId;
  if (projectId) params.projectId = projectId;

  const res = await client.get<ActivityFeedItem[]>('/api/v1/activity', { params });
  return res.data;
}
