import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AppWindow,
  ShoppingBag,
  Users,
  DollarSign,
  Workflow,
  Sparkles,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  Plus,
} from "lucide-react";
import type { AppPlatformDashboardData, AppPlatformStatistics } from "@/types";

interface AppPlatformDashboardOverviewCardProps {
  overview?: AppPlatformDashboardData;
  statistics?: AppPlatformStatistics;
  isLoading?: boolean;
  onCreateAppClick?: () => void;
  onPublishListingClick?: () => void;
  onPublishWorkflowClick?: () => void;
}

export function AppPlatformDashboardOverviewCard({
  overview,
  statistics,
  isLoading = false,
  onCreateAppClick,
  onPublishListingClick,
  onPublishWorkflowClick,
}: AppPlatformDashboardOverviewCardProps) {
  if (isLoading || !overview) {
    return (
      <Card className="border border-border/50 bg-card/60 backdrop-blur-sm animate-pulse">
        <CardHeader className="h-28" />
        <CardContent className="h-48" />
      </Card>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Top Extensibility & Marketplace Platform Banner */}
      <Card className="border border-indigo-500/30 bg-indigo-950/10 backdrop-blur-sm overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl -z-10" />
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-indigo-500/10 rounded-xl border border-indigo-500/20 text-indigo-400">
                <AppWindow className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold tracking-tight text-foreground">
                    Enterprise AI App Platform & Marketplace Hub
                  </h3>
                  <Badge variant="outline" className="border-indigo-500/40 text-indigo-400 bg-indigo-500/10">
                    {statistics?.platformStatus || "EXTENSIBILITY_READY_V2_ACTIVE"}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Unified enterprise ecosystem for low-code AI apps, marketplace integrations, modular extensions, and developer SDKs.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {onCreateAppClick && (
                <Button size="sm" onClick={onCreateAppClick} className="gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white">
                  <Plus className="w-4 h-4" />
                  <span>Create App</span>
                </Button>
              )}
              {onPublishListingClick && (
                <Button size="sm" variant="outline" onClick={onPublishListingClick} className="gap-1.5 border-indigo-500/30 hover:bg-indigo-500/10">
                  <ShoppingBag className="w-4 h-4 text-indigo-400" />
                  <span>Publish Listing</span>
                </Button>
              )}
              {onPublishWorkflowClick && (
                <Button size="sm" variant="outline" onClick={onPublishWorkflowClick} className="gap-1.5 border-border hover:bg-accent/50">
                  <Workflow className="w-4 h-4 text-muted-foreground" />
                  <span>Publish Workflow</span>
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 4 Primary KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Installed Apps */}
        <Card className="border border-border/50 bg-card/50 backdrop-blur-sm">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Installed Apps
              </span>
              <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400">
                <AppWindow className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-3xl font-extrabold text-foreground">
                {overview.installedAppsCount}
              </div>
              <p className="text-xs text-indigo-400 mt-1 flex items-center gap-1">
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>Enterprise & workspace active</span>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* KPI 2: Marketplace Listings */}
        <Card className="border border-border/50 bg-card/50 backdrop-blur-sm">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Marketplace Listings
              </span>
              <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400">
                <ShoppingBag className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-3xl font-extrabold text-foreground">
                {overview.marketplaceListingsCount}
              </div>
              <p className="text-xs text-purple-400 mt-1 flex items-center gap-1">
                <span>Verified integrations & modules</span>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* KPI 3: Active Developers */}
        <Card className="border border-border/50 bg-card/50 backdrop-blur-sm">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Developer Community
              </span>
              <div className="p-2 bg-cyan-500/10 rounded-lg text-cyan-400">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-3xl font-extrabold text-foreground">
                {overview.activeDevelopersCount.toLocaleString()}
              </div>
              <p className="text-xs text-cyan-400 mt-1 flex items-center gap-1">
                <span>Certified app builders</span>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* KPI 4: Monthly Platform Revenue */}
        <Card className="border border-border/50 bg-card/50 backdrop-blur-sm">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Platform Revenue (MRR)
              </span>
              <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-3xl font-extrabold text-foreground">
                {formatCurrency(overview.monthlyPlatformRevenue)}
              </div>
              <p className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>+14.8% net revenue share</span>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Telemetry Strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border border-border/40 bg-card/30 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Workflow Templates Ready</p>
              <p className="text-lg font-bold text-foreground">{overview.publishedTemplatesCount} Blueprints</p>
            </div>
          </div>
        </Card>

        <Card className="border border-border/40 bg-card/30 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
              <Workflow className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Automated Workflow Executions</p>
              <p className="text-lg font-bold text-foreground">{overview.workflowExecutionsCount.toLocaleString()} Runs</p>
            </div>
          </div>
        </Card>

        <Card className="border border-border/40 bg-card/30 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Security Sandbox & Isolation</p>
              <p className="text-lg font-bold text-emerald-400">Level-4 MicroVM Encrypted</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
