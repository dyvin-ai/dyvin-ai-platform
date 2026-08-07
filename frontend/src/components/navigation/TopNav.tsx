import React, { useState } from 'react';
import { Search, Bell, Sun, Moon, Monitor } from 'lucide-react';
import { useThemeStore } from '@stores/themeStore';
import { useNotificationStore } from '@stores/notificationStore';
import { useAuthStore } from '@stores/authStore';
import { OrganizationSwitcher } from '@components/organization/OrganizationSwitcher';
import { CreateWorkspaceModal } from '@components/modals/CreateWorkspaceModal';
import { cn } from '@lib/utils';
import type { Theme } from '@stores/themeStore';

const themeOptions: { value: Theme; icon: React.ElementType; label: string }[] = [
  { value: 'light', icon: Sun, label: 'Light' },
  { value: 'dark', icon: Moon, label: 'Dark' },
  { value: 'system', icon: Monitor, label: 'System' },
];

export function TopNav() {
  const { theme, setTheme } = useThemeStore();
  const { unreadCount } = useNotificationStore();
  const { user } = useAuthStore();
  const [isWorkspaceModalOpen, setIsWorkspaceModalOpen] = useState(false);

  const initials = user
    ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
    : 'U';

  return (
    <header className="h-14 bg-nav border-b border-nav-border flex items-center justify-between px-6 flex-shrink-0 sticky top-0 z-sticky backdrop-blur-sm bg-nav/95">
      {/* Left: Organization & Workspace Switcher */}
      <div className="flex items-center gap-4">
        <OrganizationSwitcher
          onOpenCreateWorkspace={() => setIsWorkspaceModalOpen(true)}
        />

        {/* Search trigger */}
        <button className="hidden md:flex items-center gap-2.5 px-3 py-1.5 rounded-xl border border-border/60 bg-muted/30 text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors text-xs min-w-48">
          <Search className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="flex-1 text-left">Search platform...</span>
          <kbd className="flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] bg-background border border-border rounded font-medium">
            ⌘K
          </kbd>
        </button>
      </div>

      <div className="flex items-center gap-2">
        {/* Theme switcher */}
        <div className="flex items-center gap-0.5 p-0.5 rounded-lg bg-muted/50 border border-border/50">
          {themeOptions.map(({ value, icon: Icon, label }) => (
            <button
              key={value}
              onClick={() => setTheme(value)}
              title={label}
              className={cn(
                'p-1.5 rounded-md transition-colors',
                theme === value
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Icon className="w-3.5 h-3.5" />
            </button>
          ))}
        </div>

        {/* Notifications */}
        <button className="relative p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 bg-danger rounded-full" />
          )}
        </button>

        {/* Avatar */}
        <button className="ml-1 w-7 h-7 rounded-full bg-brand-500 text-white text-xs font-semibold flex items-center justify-center hover:opacity-90 transition-opacity shadow-sm">
          {initials}
        </button>
      </div>

      <CreateWorkspaceModal
        isOpen={isWorkspaceModalOpen}
        onClose={() => setIsWorkspaceModalOpen(false)}
      />
    </header>
  );
}
