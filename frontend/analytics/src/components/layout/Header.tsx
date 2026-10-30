import { useState, useEffect } from "react";
import { PanelLeftClose, PanelLeftOpen, Moon, Sun, Download, Search, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTheme } from "@/lib/theme/theme-provider";
import { GlobalSearchModal } from "@/components/navigation/GlobalSearchModal";
import { NotificationCenter } from "@/components/navigation/NotificationCenter";
import { notificationsService } from "@/services";

export function Header({
  collapsed,
  onToggleSidebar,
  title,
}: {
  collapsed: boolean;
  onToggleSidebar: () => void;
  title: string;
}) {
  const { resolved, toggle } = useTheme();
  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    notificationsService.list().then((list) => {
      if (Array.isArray(list)) {
        setUnreadCount(list.filter((n) => !n.read).length);
      }
    }).catch(() => {});
  }, [notificationsOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((open) => !open);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <header className="flex h-14 items-center justify-between gap-3 px-4 sm:px-6 select-none">
        {/* Left Side: Collapse Toggle & Breadcrumb Title */}
        <div className="flex items-center gap-3 min-w-0">
          <Button
            variant="ghost"
            size="icon"
            className="size-8 shrink-0 text-muted-foreground hover:text-foreground cursor-pointer"
            onClick={onToggleSidebar}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <PanelLeftOpen className="size-4" />
            ) : (
              <PanelLeftClose className="size-4" />
            )}
          </Button>

          <div className="flex items-center gap-2 min-w-0">
            <span className="text-xs font-mono text-muted-foreground/80 hidden sm:inline">Dyvin AI</span>
            <span className="text-xs font-mono text-muted-foreground/40 hidden sm:inline">/</span>
            <h1 className="truncate text-sm font-semibold tracking-tight text-foreground">{title}</h1>
          </div>
        </div>

        {/* Right Side: Toolbar Filters & Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Date Range Selector */}
          <div className="hidden md:block">
            <Select defaultValue="30d">
              <SelectTrigger className="h-8 w-[124px] text-xs font-medium border-border bg-surface text-foreground shadow-2xs" aria-label="Date range">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border text-foreground">
                <SelectItem value="7d" className="text-xs">Last 7 days</SelectItem>
                <SelectItem value="30d" className="text-xs">Last 30 days</SelectItem>
                <SelectItem value="90d" className="text-xs">Last 90 days</SelectItem>
                <SelectItem value="12mo" className="text-xs">Last 12 months</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Model Filter Selector */}
          <div className="hidden xl:block">
            <Select defaultValue="all">
              <SelectTrigger className="h-8 w-[130px] text-xs font-medium border-border bg-surface text-foreground shadow-2xs" aria-label="AI model filter">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border text-foreground">
                <SelectItem value="all" className="text-xs">All 6 LLM Models</SelectItem>
                <SelectItem value="chatgpt" className="text-xs">ChatGPT 4o</SelectItem>
                <SelectItem value="claude" className="text-xs">Claude 3.5 Sonnet</SelectItem>
                <SelectItem value="gemini" className="text-xs">Gemini 1.5 Pro</SelectItem>
                <SelectItem value="perplexity" className="text-xs">Perplexity Pro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Export Button */}
          <Button
            variant="outline"
            size="sm"
            className="hidden h-8 px-2.5 sm:inline-flex items-center gap-1.5 text-xs font-medium border-border bg-surface text-foreground shadow-2xs hover:bg-surface-subtle cursor-pointer"
            onClick={() => alert("Exporting executive dataset...")}
          >
            <Download className="size-3.5 text-muted-foreground" aria-hidden />
            <span>Export</span>
          </Button>

          {/* Search Trigger */}
          <Button
            variant="ghost"
            size="icon"
            className="size-8 text-muted-foreground hover:text-foreground cursor-pointer"
            aria-label="Search Workspace"
            onClick={() => setSearchOpen(true)}
            title="Search (⌘K)"
          >
            <Search className="size-4" />
          </Button>

          {/* Notifications Trigger */}
          <Button
            variant="ghost"
            size="icon"
            className="size-8 text-muted-foreground hover:text-foreground cursor-pointer relative"
            aria-label="Notifications"
            onClick={() => setNotificationsOpen(true)}
          >
            <Bell className="size-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-brand ring-2 ring-background" />
            )}
          </Button>

          {/* Theme Mode Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="size-8 text-muted-foreground hover:text-foreground cursor-pointer"
            onClick={toggle}
            aria-label={resolved === "dark" ? "Switch to light theme" : "Switch to dark theme"}
            title={resolved === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          >
            {resolved === "dark" ? (
              <Sun className="size-4 text-amber-400 transition-transform duration-200 hover:rotate-45" />
            ) : (
              <Moon className="size-4 text-slate-700 transition-transform duration-200 hover:-rotate-12" />
            )}
          </Button>
        </div>
      </header>

      <GlobalSearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      <NotificationCenter isOpen={notificationsOpen} onClose={() => setNotificationsOpen(false)} />
    </>
  );
}
