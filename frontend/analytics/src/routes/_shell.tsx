import { createFileRoute, Outlet, useRouterState, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { useWorkspace } from "@/context/WorkspaceContext";

export const Route = createFileRoute("/_shell")({
  component: ShellLayout,
});

const titles: Record<string, string> = {
  "/overview": "Overview",
  "/visibility": "AI Visibility",
  "/brand": "Brand Intelligence",
  "/scanner": "Website Intelligence",
  "/prompts": "Prompts",
  "/understanding": "AI Understanding & Trust",
  "/consistency": "AI Consistency Intelligence",
  "/remediation": "AI Optimization & Remediation",
  "/executive": "Executive Intelligence & Command Center",
  "/operations": "Autonomous Operations & Copilot",

  "/competitors": "Competitors",
  "/sources": "Sources",
  "/insights": "Insights",
  "/strategy": "Strategy",
  "/agents": "Agents",
  "/reports": "Reports",
  "/settings": "Settings",
};

function ShellLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useWorkspace();
  const key = Object.keys(titles).find((k) => pathname.startsWith(k));

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate({ to: "/" });
    }
  }, [isLoading, isAuthenticated, navigate]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="size-6 animate-spin rounded-full border-2 border-border border-t-foreground" />
          <span className="font-mono text-xs text-muted-foreground uppercase tracking-widest">
            Loading Workspace...
          </span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-background p-4">
        <div className="flex flex-col items-center gap-4 text-center max-w-sm">
          <div className="size-10 rounded-full bg-surface-subtle border border-border flex items-center justify-center font-mono font-bold text-sm text-foreground">
            DY
          </div>
          <div>
            <h2 className="text-base font-semibold text-foreground">Workspace Access</h2>
            <p className="text-xs text-muted-foreground mt-1">Please sign in to access your AI visibility workspace.</p>
          </div>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-lg bg-foreground text-background px-4 py-2 text-xs font-semibold hover:opacity-90 transition-opacity"
          >
            Go to Sign In →
          </a>
        </div>
      </div>
    );
  }

  return (
    <AppShell title={key ? titles[key]! : "Dyvin"}>
      <Outlet />
    </AppShell>
  );
}
