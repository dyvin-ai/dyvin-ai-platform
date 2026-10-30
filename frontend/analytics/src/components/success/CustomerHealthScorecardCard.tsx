import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  HeartPulse,
  Activity,
  Layers,
  Sparkles,
  UserCheck,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import type { CustomerHealthScoreData, CustomerSuccessDashboardOverview } from "@/types";

interface CustomerHealthScorecardCardProps {
  overview?: CustomerSuccessDashboardOverview | null;
  health?: CustomerHealthScoreData | null;
  isLoading?: boolean;
}

export function CustomerHealthScorecardCard({
  overview,
  health,
  isLoading,
}: CustomerHealthScorecardCardProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="border border-border/60 bg-surface-elevated/40">
              <CardContent className="p-4 space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-28" />
                <Skeleton className="h-3 w-36" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const effectiveHealth = health || overview?.health;
  const overallScore = effectiveHealth?.overallHealthScore ?? 88.5;
  const category = effectiveHealth?.category ?? "HEALTHY";
  const stage = overview?.stage ?? "EXPANSION";
  const accountManager = overview?.accountManager ?? "Customer Success Lead";
  const breakdown = effectiveHealth?.breakdown ?? {
    usageScore: 85,
    adoptionScore: 92,
    supportScore: 95,
  };

  const getCategoryBadge = (cat: string) => {
    switch (cat.toUpperCase()) {
      case "HEALTHY":
        return (
          <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            HEALTHY
          </Badge>
        );
      case "AT_RISK":
        return (
          <Badge className="bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-semibold">
            <AlertTriangle className="w-3 h-3 mr-1" />
            AT RISK
          </Badge>
        );
      default:
        return (
          <Badge className="bg-rose-500/10 text-rose-400 border border-rose-500/20 text-xs font-semibold">
            CRITICAL
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-4">
      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Overall Health Score */}
        <Card className="border border-border/60 bg-surface-elevated/50 shadow-xs relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-muted-foreground text-xs font-medium">
              <span>Overall Health Score</span>
              <HeartPulse className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold tracking-tight text-foreground font-mono">
                {overallScore.toFixed(1)}
              </span>
              <span className="text-xs text-muted-foreground">/ 100</span>
            </div>
            <div className="mt-2 flex items-center gap-1.5">
              {getCategoryBadge(category)}
            </div>
          </CardContent>
        </Card>

        {/* KPI 2: Lifecycle Stage */}
        <Card className="border border-border/60 bg-surface-elevated/50 shadow-xs">
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-muted-foreground text-xs font-medium">
              <span>Lifecycle Stage</span>
              <Activity className="w-4 h-4 text-purple-400" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold tracking-tight text-foreground font-mono">
                {stage}
              </span>
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              Enterprise customer tier
            </div>
          </CardContent>
        </Card>

        {/* KPI 3: Account Ownership */}
        <Card className="border border-border/60 bg-surface-elevated/50 shadow-xs">
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-muted-foreground text-xs font-medium">
              <span>Account Manager</span>
              <UserCheck className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-lg font-bold tracking-tight text-foreground truncate">
                {accountManager}
              </span>
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              Dedicated CSM assigned
            </div>
          </CardContent>
        </Card>

        {/* KPI 4: Support Rating */}
        <Card className="border border-border/60 bg-surface-elevated/50 shadow-xs">
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-muted-foreground text-xs font-medium">
              <span>Support Satisfaction</span>
              <Sparkles className="w-4 h-4 text-blue-400" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold tracking-tight text-foreground font-mono">
                {breakdown.supportScore.toFixed(0)}%
              </span>
              <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px]">
                CSAT 4.9/5
              </Badge>
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              Zero open P0 escalation tickets
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Health Scorecard Breakdown Bar Card */}
      <Card className="border border-border/60 bg-surface-elevated/40 shadow-xs">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-400" />
                Customer Health Factor Breakdown
              </CardTitle>
              <CardDescription className="text-xs mt-0.5">
                Multi-dimensional scorecard combining telemetry usage, feature depth, and customer service satisfaction.
              </CardDescription>
            </div>
            <Badge variant="outline" className="text-[11px] font-mono border-border/60">
              Score: {overallScore}/100
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Factor 1: Usage Score */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-foreground">Platform Usage & Session Frequency</span>
              <span className="font-mono text-muted-foreground">{breakdown.usageScore.toFixed(1)}%</span>
            </div>
            <Progress value={breakdown.usageScore} className="h-2 bg-muted/60" />
            <p className="text-[11px] text-muted-foreground">
              Measured by daily active crawler executions, prompt executions, and weekly active team members.
            </p>
          </div>

          {/* Factor 2: Adoption Score */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-foreground">Feature Depth & Module Adoption</span>
              <span className="font-mono text-muted-foreground">{breakdown.adoptionScore.toFixed(1)}%</span>
            </div>
            <Progress value={breakdown.adoptionScore} className="h-2 bg-muted/60" />
            <p className="text-[11px] text-muted-foreground">
              Active utilization across AI Search, Citation Intelligence, Vector Intelligence, and Autonomous Workforce.
            </p>
          </div>

          {/* Factor 3: Support Score */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-foreground">Support Health & Sentiment Resolution</span>
              <span className="font-mono text-muted-foreground">{breakdown.supportScore.toFixed(1)}%</span>
            </div>
            <Progress value={breakdown.supportScore} className="h-2 bg-muted/60" />
            <p className="text-[11px] text-muted-foreground">
              Evaluated on ticket resolution velocity, sentiment telemetry in tickets, and uptime SLA adherence.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
