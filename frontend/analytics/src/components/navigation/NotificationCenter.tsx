import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { notificationsService } from "@/services";
import type { NotificationItem } from "@/types";
import { X, Bell, CheckCheck, ArrowUpRight, Trash2 } from "lucide-react";

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationCenter({ isOpen, onClose }: NotificationCenterProps) {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      notificationsService.list()
        .then((data) => setNotifications(Array.isArray(data) ? data : []))
        .catch(() => setNotifications([]))
        .finally(() => setIsLoading(false));
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || typeof document === "undefined") return null;

  const handleMarkAllRead = async () => {
    await notificationsService.markAsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleDismiss = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await notificationsService.delete(id);
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const handleClearAll = async () => {
    await notificationsService.clearAll();
    setNotifications([]);
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex justify-end p-3 sm:p-4 md:p-6 bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Workspace Alerts"
    >
      {/* Floating Curved Card Panel */}
      <div
        className="relative w-full max-w-[420px] bg-surface/98 backdrop-blur-2xl border border-border/80 rounded-2xl sm:rounded-3xl h-full max-h-[calc(100vh-24px)] sm:max-h-[calc(100vh-32px)] md:max-h-[calc(100vh-48px)] overflow-hidden flex flex-col justify-between shadow-[0_24px_64px_-12px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.06)] animate-in slide-in-from-right-8 duration-200 ease-out"
      >
        {/* Top Header */}
        <div className="p-5 border-b border-border/70 flex items-center justify-between shrink-0 bg-surface/50">
          <div className="flex items-center gap-3">
            <div className="size-8 rounded-xl bg-brand/10 border border-brand/20 flex items-center justify-center text-brand">
              <Bell className="size-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-sm text-foreground tracking-tight">Workspace Alerts</h3>
                {unreadCount > 0 && (
                  <span className="rounded-full bg-brand/15 border border-brand/30 text-brand px-2 py-0.2 text-[10px] font-mono font-medium">
                    {unreadCount} new
                  </span>
                )}
              </div>
              <p className="text-[11px] text-muted-foreground font-mono mt-0.5">Real-time Presence Intelligence</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="size-8 rounded-full border border-border/70 p-1 text-muted-foreground hover:text-foreground hover:bg-surface-subtle cursor-pointer transition-colors flex items-center justify-center"
            aria-label="Close notification center"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Scrollable Notifications List */}
        <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar p-4 space-y-3">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-48 gap-2">
              <div className="size-5 animate-spin rounded-full border-2 border-border border-t-foreground" />
              <span className="text-xs font-mono text-muted-foreground">Loading alerts...</span>
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 gap-2 text-center p-6">
              <div className="size-10 rounded-full bg-surface-subtle border border-border/60 flex items-center justify-center text-muted-foreground">
                <Bell className="size-5" />
              </div>
              <p className="text-xs font-medium text-foreground">No alerts right now</p>
              <p className="text-[11px] text-muted-foreground">You're all caught up with your workspace notifications.</p>
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                className="relative rounded-2xl border border-border/70 bg-surface-subtle/60 hover:bg-surface-subtle hover:border-border transition-all duration-150 p-4 space-y-2 group shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[10px] font-mono font-semibold uppercase px-2.5 py-0.5 rounded-full border ${
                      (n.priority as string) === "Critical" || (n.priority as string) === "HIGH"
                        ? "bg-rose-500/10 border-rose-500/20 text-rose-500"
                        : (n.priority as string) === "Important" || (n.priority as string) === "MED"
                        ? "bg-amber-500/10 border-amber-500/20 text-amber-500"
                        : "bg-surface border-border text-muted-foreground"
                    }`}
                  >
                    {n.priority}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono text-muted-foreground">{n.time}</span>
                    <button
                      type="button"
                      onClick={(e) => handleDismiss(n.id, e)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 rounded-md cursor-pointer"
                      title="Dismiss notification"
                      aria-label="Dismiss notification"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </div>

                <h4 className="font-semibold text-xs text-foreground leading-snug tracking-tight pt-0.5">
                  {n.title}
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {n.body}
                </p>

                {n.actionLabel && (
                  <div className="pt-2 flex items-center justify-end">
                    <a
                      href={n.actionRoute || "#"}
                      onClick={onClose}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-foreground hover:text-brand transition-colors cursor-pointer group-hover:translate-x-0.5 duration-150"
                    >
                      <span>{n.actionLabel}</span>
                      <ArrowUpRight className="size-3" />
                    </a>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Bottom Footer Controls */}
        <div className="p-4 border-t border-border/70 bg-surface/50 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleMarkAllRead}
              disabled={notifications.length === 0}
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground cursor-pointer font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <CheckCheck className="size-3.5" />
              <span>Mark all read</span>
            </button>
            <button
              type="button"
              onClick={handleClearAll}
              disabled={notifications.length === 0}
              className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-rose-500 cursor-pointer font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Trash2 className="size-3" />
              <span>Clear all</span>
            </button>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-foreground text-background px-4 py-2 text-xs font-semibold hover:bg-foreground/90 transition-all cursor-pointer shadow-xs"
          >
            Done
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
