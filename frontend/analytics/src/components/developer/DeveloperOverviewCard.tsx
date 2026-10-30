import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Code2,
  Key,
  Webhook,
  Activity,
  Zap,
  Plus,
  ArrowUpRight,
  ShieldCheck,
  Server,
  Layers,
} from "lucide-react";
import type { DeveloperPlatformOverview } from "@/types";

interface DeveloperOverviewCardProps {
  overview?: DeveloperPlatformOverview;
  isLoading?: boolean;
  onCreateAppClick?: () => void;
  onGenerateKeyClick?: () => void;
  onCreateWebhookClick?: () => void;
}

export function DeveloperOverviewCard({
  overview,
  isLoading = false,
  onCreateAppClick,
  onGenerateKeyClick,
  onCreateWebhookClick,
}: DeveloperOverviewCardProps) {
  if (isLoading || !overview) {
    return (
      <Card className="border border-border/50 bg-card/60 backdrop-blur-sm animate-pulse">
        <CardHeader className="h-28" />
        <CardContent className="h-48" />
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <Card className="border border-emerald-500/30 bg-emerald-950/10 backdrop-blur-sm overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl -z-10" />
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20 text-emerald-400">
                <Code2 className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold tracking-tight text-foreground">
                    Developer Platform & Public API Gateway
                  </h3>
                  <Badge variant="outline" className="border-emerald-500/40 text-emerald-400 bg-emerald-500/10">
                    GATEWAY ACTIVE
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-0.5">
                  High-throughput REST and streaming gateway, hashed API credentials, OAuth2 token issuance, and event webhooks.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {onCreateAppClick && (
                <Button size="sm" onClick={onCreateAppClick} className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white">
                  <Plus className="w-4 h-4" />
                  <span>New Application</span>
                </Button>
              )}
              {onGenerateKeyClick && (
                <Button size="sm" variant="outline" onClick={onGenerateKeyClick} className="gap-1.5 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10">
                  <Key className="w-4 h-4" />
                  <span>Generate API Key</span>
                </Button>
              )}
              {onCreateWebhookClick && (
                <Button size="sm" variant="outline" onClick={onCreateWebhookClick} className="gap-1.5 border-border hover:bg-surface-subtle">
                  <Webhook className="w-4 h-4" />
                  <span>Register Webhook</span>
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border border-border/50 bg-card/60 backdrop-blur-sm hover:border-border transition-colors">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider font-mono">
                Developer Apps
              </span>
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                <Layers className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono tracking-tight text-foreground">
                {overview.totalApps}
              </span>
              <span className="text-xs text-emerald-400 flex items-center font-medium">
                Active in Org
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Registered production & staging apps</p>
          </CardContent>
        </Card>

        <Card className="border border-border/50 bg-card/60 backdrop-blur-sm hover:border-border transition-colors">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider font-mono">
                Active API Keys
              </span>
              <div className="p-2 rounded-lg bg-sky-500/10 text-sky-400">
                <Key className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono tracking-tight text-foreground">
                {overview.activeApiKeys}
              </span>
              <span className="text-xs text-sky-400 flex items-center font-medium">
                <ShieldCheck className="w-3 h-3 mr-0.5" />
                Hashed SHA-256
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Live scoped authentication tokens</p>
          </CardContent>
        </Card>

        <Card className="border border-border/50 bg-card/60 backdrop-blur-sm hover:border-border transition-colors">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider font-mono">
                24h Gateway Calls
              </span>
              <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
                <Zap className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono tracking-tight text-foreground">
                {overview.totalRequests24h.toLocaleString()}
              </span>
              <span className="text-xs text-emerald-400 flex items-center font-medium">
                <ArrowUpRight className="w-3 h-3 mr-0.5" />
                +14.2%
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Rate limit window: 1200 req/min</p>
          </CardContent>
        </Card>

        <Card className="border border-border/50 bg-card/60 backdrop-blur-sm hover:border-border transition-colors">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider font-mono">
                Avg Latency & Errors
              </span>
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
                <Activity className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono tracking-tight text-foreground">
                {overview.averageLatencyMs}ms
              </span>
              <span className="text-xs text-muted-foreground font-mono">
                | {overview.errorRatePct}% err
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Quota consumption: {overview.quotaConsumptionPct}%</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
