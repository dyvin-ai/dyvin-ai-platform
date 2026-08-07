import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as notificationApi from '@services/api/notification.api';
import type { UpdatePreferenceRequest } from '@app-types/notification.types';

export function useNotifications() {
  return useQuery({
    queryKey: ['notifications'],
    queryFn: notificationApi.getNotifications,
  });
}

export function useNotificationPreferences() {
  return useQuery({
    queryKey: ['notification-preferences'],
    queryFn: notificationApi.getNotificationPreferences,
  });
}

export function useUpdateNotificationPreference() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdatePreferenceRequest) =>
      notificationApi.updateNotificationPreference(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notification-preferences'] });
    },
  });
}

export function useMarkNotificationAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => notificationApi.markNotificationAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}

export function useMarkAllNotificationsAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => notificationApi.markAllNotificationsAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}

export function useActivityFeed(orgId?: string, projectId?: string) {
  return useQuery({
    queryKey: ['activity-feed', orgId, projectId],
    queryFn: () => notificationApi.getActivityFeed(orgId, projectId),
  });
}
