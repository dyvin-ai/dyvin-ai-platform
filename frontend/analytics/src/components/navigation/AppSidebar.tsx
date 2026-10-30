import { Link, useRouterState } from "@tanstack/react-router";
import { icons } from "@/lib/icons";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const primary = [
  { label: "Overview", to: "/overview", icon: icons.overview },
  { label: "AI Visibility", to: "/visibility", icon: icons.visibility },
  { label: "Brand Intelligence", to: "/brand", icon: icons.brand },
  { label: "Website Intelligence", to: "/scanner", icon: icons.scanner },
  { label: "Prompts", to: "/prompts", icon: icons.prompts },
  { label: "Understanding", to: "/understanding", icon: icons.understanding },
  { label: "Consistency", to: "/consistency", icon: icons.consistency },
  { label: "Remediation", to: "/remediation", icon: icons.remediation },
  { label: "Executive", to: "/executive", icon: icons.executive },
  { label: "Operations", to: "/operations", icon: icons.operations },
  { label: "Observability", to: "/observability", icon: icons.observability },

  { label: "Competitors", to: "/competitors", icon: icons.competitors },
  { label: "Sources", to: "/sources", icon: icons.sources },
  { label: "Insights", to: "/insights", icon: icons.insights },
  { label: "Strategy", to: "/strategy", icon: icons.strategy },
  { label: "Agents", to: "/agents", icon: icons.agents },
  { label: "AI Workforce", to: "/workforce", icon: icons.workforce },
  { label: "Knowledge Graph", to: "/knowledge", icon: icons.knowledge },
  { label: "Vector Intelligence", to: "/vector", icon: icons.vector },
  { label: "GEO Analytics", to: "/geo", icon: icons.geo },
  { label: "Business Execution", to: "/execution", icon: icons.execution },
  { label: "Customer Intelligence", to: "/customer", icon: icons.customer },
  { label: "Customer Success", to: "/success", icon: icons.customerSuccess },
  { label: "Industry Cloud", to: "/industry", icon: icons.industryCloud },
  { label: "Partner Ecosystem", to: "/ecosystem", icon: icons.ecosystem },
  { label: "AI Evolution", to: "/evolution", icon: icons.evolution },
  { label: "Innovation Lab", to: "/innovation", icon: icons.innovation },
  { label: "AI Governance", to: "/governance", icon: icons.governance },
  { label: "App Platform", to: "/apps", icon: icons.apps },
  { label: "Integration Hub", to: "/integrations", icon: icons.integrations },
  { label: "Developer Platform", to: "/developer", icon: icons.developer },
  { label: "Keyword Discovery", to: "/keywords", icon: icons.keywords },
  { label: "Research & Retrieval", to: "/research", icon: icons.retrieval },
  { label: "Global Intelligence", to: "/global", icon: icons.global },
  { label: "AI Operating System", to: "/os", icon: icons.os },
] as const;

const secondary = [
  { label: "Reports", to: "/reports", icon: icons.reports },
  { label: "Settings", to: "/settings", icon: icons.settings },
  { label: "Platform Admin", to: "/admin", icon: icons.admin },
] as const;

function NavItem({
  to,
  label,
  Icon,
  collapsed,
  active,
}: {
  to: string;
  label: string;
  Icon: typeof icons.overview;
  collapsed: boolean;
  active: boolean;
}) {
  const link = (
    <Link
      to={to}
      className={cn(
        "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-medium transition-all duration-150 group select-none",
        collapsed && "justify-center px-0 py-2.5",
        active
          ? "bg-surface-elevated text-foreground font-semibold shadow-xs border border-border"
          : "text-muted-foreground hover:bg-surface-subtle/80 hover:text-foreground",
      )}
      aria-current={active ? "page" : undefined}
    >
      <Icon
        className={cn(
          "size-[18px] shrink-0 transition-colors",
          active ? "text-foreground" : "text-muted-foreground group-hover:text-foreground",
        )}
        aria-hidden
      />
      {!collapsed && <span className="truncate">{label}</span>}
      {collapsed && <span className="sr-only">{label}</span>}
    </Link>
  );

  if (!collapsed) return link;
  return (
    <Tooltip>
      <TooltipTrigger asChild>{link}</TooltipTrigger>
      <TooltipContent side="right" className="font-medium text-xs">
        {label}
      </TooltipContent>
    </Tooltip>
  );
}

import { useWorkspace } from "@/context/WorkspaceContext";

export function AppSidebar({ collapsed }: { collapsed: boolean }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { user, activeOrganization, isDemo } = useWorkspace();

  const orgName = activeOrganization?.name || (isDemo ? "Northwind Labs" : "My Workspace");
  const userName = (user as any)?.firstName && (user as any)?.lastName
    ? `${(user as any).firstName} ${(user as any).lastName}`
    : (user as any)?.name || "Alex Mercer";
  const userEmail = user?.email || "alex@northwind.ai";
  const userInitials = userName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "AM";

  return (
    <nav
      aria-label="Primary Workspace Navigation"
      className="flex h-full max-h-full flex-col justify-between p-3 select-none overflow-hidden"
    >
      {/* ZONE A — TOP HEADER (Fixed, never scrolls) */}
      <div className="shrink-0 space-y-3.5">
        {/* Brand Header — Links back to Marketing Landing Page */}
        <Link
          to="/"
          className={cn(
            "flex h-10 items-center gap-2.5 rounded-lg px-1.5 transition-opacity hover:opacity-80",
            collapsed && "justify-center px-0",
          )}
          title="Return to Dyvin AI Home"
        >
          <div className="relative size-6 shrink-0 flex items-center justify-center">
            <img
              src="/dyvin-logo-black.png"
              alt="Dyvin AI"
              className="size-6 shrink-0 object-contain dark:hidden"
            />
            <img
              src="/dyvin-logo-white.png"
              alt="Dyvin AI"
              className="hidden size-6 shrink-0 object-contain dark:block"
            />
          </div>
          {!collapsed && (
            <div className="flex items-center gap-1.5">
              <span className="text-[14px] font-semibold tracking-tight text-foreground font-display">Dyvin AI</span>
              <span className="rounded bg-brand/10 border border-brand/20 text-brand px-1.5 py-0.2 text-[9px] font-mono font-medium">PRO</span>
            </div>
          )}
        </Link>

        {/* Workspace Selector Card */}
        {!collapsed && (
          <button
            type="button"
            className="flex w-full items-center justify-between rounded-lg border border-border bg-surface px-2.5 py-2 text-left shadow-2xs transition-all hover:border-border-strong hover:bg-surface-subtle/50 cursor-pointer"
          >
            <div className="min-w-0 pr-2">
              <span className="block truncate text-xs font-semibold text-foreground">{orgName}</span>
              <span className="block truncate text-[10px] text-muted-foreground font-mono">
                {isDemo ? "Enterprise workspace" : "Active workspace"}
              </span>
            </div>
            <icons.workspaceSwitch className="size-3.5 shrink-0 text-muted-foreground" aria-hidden />
            <span className="sr-only">Switch workspace</span>
          </button>
        )}
      </div>

      {/* ZONE B — CENTER NAVIGATION (Scrolls internally ONLY if viewport height is too small) */}
      <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar my-2 space-y-0.5 pr-0.5">
        {!collapsed && (
          <p className="px-2 pb-1 pt-2 text-[10px] font-mono uppercase tracking-[0.12em] text-muted-foreground/70">
            Intelligence
          </p>
        )}
        <ul className="flex flex-col gap-0.5">
          {primary.map((item) => (
            <li key={item.to}>
              <NavItem
                to={item.to}
                label={item.label}
                Icon={item.icon}
                collapsed={collapsed}
                active={pathname.startsWith(item.to)}
              />
            </li>
          ))}
        </ul>
      </div>

      {/* ZONE C — BOTTOM FOOTER (Anchored to bottom, 100% accessible at all scroll positions) */}
      <div className="shrink-0 pt-3 border-t border-border/60 space-y-3 mt-auto">
        {!collapsed && (
          <p className="px-2 text-[10px] font-mono uppercase tracking-[0.12em] text-muted-foreground/70">
            Workspace
          </p>
        )}
        <ul className="flex flex-col gap-0.5">
          {secondary.map((item) => (
            <li key={item.to}>
              <NavItem
                to={item.to}
                label={item.label}
                Icon={item.icon}
                collapsed={collapsed}
                active={pathname.startsWith(item.to)}
              />
            </li>
          ))}
        </ul>

        {/* User Profile Card */}
        <div className={cn("flex items-center gap-2 rounded-lg p-1.5", collapsed ? "justify-center" : "bg-surface-subtle/50 border border-border/50")}>
          <div className="relative size-7 shrink-0 grid place-items-center rounded-full bg-brand/10 border border-brand/20 text-brand text-[11px] font-semibold font-mono">
            {userInitials}
            <span className="absolute bottom-0 right-0 size-2 rounded-full bg-emerald-500 ring-2 ring-background" />
          </div>
          {!collapsed && (
            <div className="min-w-0 flex-1 pr-1">
              <span className="block truncate text-xs font-medium text-foreground">{userName}</span>
              <span className="block truncate text-[10px] text-muted-foreground">{userEmail}</span>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
