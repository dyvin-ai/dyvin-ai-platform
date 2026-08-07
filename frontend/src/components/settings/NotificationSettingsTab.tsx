import React from 'react';
import { useNotificationPreferences, useUpdateNotificationPreference } from '@hooks/useNotifications';
import { Bell, Mail, MessageSquare, ShieldAlert } from 'lucide-react';
import toast from 'react-hot-toast';
import type { NotificationCategory } from '@app-types/notification.types';

const CATEGORIES: { key: NotificationCategory; label: string; desc: string }[] = [
  { key: 'ANALYSIS', label: 'Analysis & Scan Notifications', desc: 'Updates when scans or AI analyses complete.' },
  { key: 'RECOMMENDATION', label: 'AI Strategy Recommendations', desc: 'Alerts on high-impact strategic recommendations.' },
  { key: 'VERIFICATION', label: 'Domain Verification Alerts', desc: 'Notifications regarding website verifications.' },
  { key: 'MONITORING', label: 'Continuous Monitoring Alerts', desc: 'Real-time alerts on competitive rank changes.' },
  { key: 'BILLING', label: 'Billing & Usage Alerts', desc: 'Notifications on quota limits and subscription invoices.' },
  { key: 'COLLABORATION', label: 'Team Mentions & Comments', desc: 'Notifications when tagged in comments or projects.' },
  { key: 'SYSTEM', label: 'System & Security Announcements', desc: 'Platform maintenance and critical security alerts.' },
];

export function NotificationSettingsTab() {
  const { data: preferences = [] } = useNotificationPreferences();
  const { mutateAsync: updatePref } = useUpdateNotificationPreference();

  const isCategoryEnabled = (cat: NotificationCategory) => {
    const item = preferences.find((p) => p.category === cat);
    return item ? item.isEnabled : true;
  };

  const handleToggle = async (cat: NotificationCategory, current: boolean) => {
    try {
      await updatePref({ category: cat, isEnabled: !current });
      toast.success('Notification preference updated');
    } catch {
      toast.error('Failed to update preference');
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-border pb-4">
        <h2 className="text-heading-md font-bold text-foreground flex items-center gap-2">
          <Bell className="w-5 h-5 text-primary" /> Notification Center & Preferences
        </h2>
        <p className="text-body-xs text-muted-foreground">
          Configure per-category notification delivery and channel rules.
        </p>
      </div>

      <div className="space-y-3 max-w-2xl">
        {CATEGORIES.map((cat) => {
          const enabled = isCategoryEnabled(cat.key);
          return (
            <div
              key={cat.key}
              className="flex items-center justify-between p-4 rounded-xl border border-border bg-card hover:bg-muted/20 transition-colors"
            >
              <div className="space-y-0.5">
                <div className="text-sm font-semibold text-foreground">{cat.label}</div>
                <div className="text-xs text-muted-foreground">{cat.desc}</div>
              </div>
              <button
                type="button"
                onClick={() => handleToggle(cat.key, enabled)}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  enabled ? 'bg-primary' : 'bg-muted-foreground/30'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    enabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
