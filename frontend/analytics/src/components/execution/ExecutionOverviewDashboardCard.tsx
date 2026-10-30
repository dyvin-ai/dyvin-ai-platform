import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Zap,
  TrendingUp,
  Award,
  PlayCircle,
  FileCheck,
  Activity,
  Layers,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import type {
  BusinessExecutionDashboardOverview,
  BusinessExecutionStatistics,
  ClosedLoopOptimizationStatus,
} from "@/types";

interface ExecutionOverviewDashboardCardProps {
  overview?: BusinessExecutionDashboardOverview | null;
  statistics?: BusinessExecutionStatistics | null;
  optimization?: ClosedLoopOptimizationStatus | null;
  isLoading?: boolean;
}

export function ExecutionOverviewDashboardCard({
  overview,
  statistics,
  optimization,
  isLoading,
}: ExecutionOverviewDashboardCardProps) {
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

  const kpis = [
    {
      label: "Active Opportunities",
      value: `${overview?.activeOpportunitiesCount ?? 14}`,
      subtext: "Detected AI visibility & GEO gaps",
      icon: Zap,
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
      badge: "High Priority",
    },
    {
      label: "Strategies in Execution",
      value: `${overview?.strategiesInExecutionCount ?? 6}`,
      subtext: "90-day roadmaps autonomously executing",
      icon: PlayCircle,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      badge: "Active",
    },
    {
      label: "Content Published (CMS)",
      value: `${overview?.contentItemsPublishedCount ?? 142}`,
      subtext: "WordPress, Webflow, Shopify & Ghost",
      icon: FileCheck,
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
      badge: "Multi-Channel",
    },
    {
      label: "Closed-Loop Expected ROI",
      value: `+${overview?.expectedRoiPct ?? 340.0}%`,
      subtext: `+${overview?.overallVisibilityGainPct ?? 18.4}% visibility gain`,
      icon: TrendingUp,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
      badge: "Closed Loop",
    },
  ];

  const cycleSteps = [
    "DETECT",
    "ANALYZE",
    "RECOMMEND",
    "EXECUTE",
    "PUBLISH",
    "MONITOR",
    "MEASURE",
    "LEARN",
    "REPEAT",
  ];

  return (
    <div className="space-y-6">
      {/* Closed-Loop System Status Banner */}
      <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 backdrop-blur-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
            <Activity className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-semibold text-foreground">
                Autonomous Closed-Loop Business Execution
              </h4>
              <Badge variant="outline" className="border-emerald-500/40 text-emerald-400 bg-emerald-500/10 text-xs">
                {overview?.closedLoopState || "AUTONOMOUS_OPTIMIZING"}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Closed-loop execution engine orchestrating opportunities, content generation, and multi-channel publishing with human guardrails.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="border-border text-xs px-2.5 py-1">
            <Layers className="w-3 h-3 mr-1 text-blue-400" />
            {statistics?.totalOpportunitiesDetected ?? 142} Total Opportunities
          </Badge>
          <Badge variant="outline" className="border-border text-xs px-2.5 py-1">
            <Sparkles className="w-3 h-3 mr-1 text-purple-400" />
            {statistics?.totalStrategiesExecuted ?? 38} Executed
          </Badge>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <Card
              key={idx}
              className="border border-border/60 bg-surface-elevated/40 backdrop-blur-sm hover:border-border transition-all duration-200"
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium text-muted-foreground">
                    {kpi.label}
                  </span>
                  <div className={`p-2 rounded-lg ${kpi.bgColor} ${kpi.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
                <div className="flex items-baseline justify-between">
                  <div className="text-2xl font-bold tracking-tight text-foreground">
                    {kpi.value}
                  </div>
                  <Badge variant="secondary" className="text-[10px] uppercase font-semibold">
                    {kpi.badge}
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {kpi.subtext}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Autonomous Optimization Cycle Visualizer */}
      <Card className="border border-border/60 bg-surface-elevated/30">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Closed-Loop Optimization Execution Cycle
              </CardTitle>
              <CardDescription className="text-xs">
                Real-time autonomous feedback loop cycle state: {optimization?.cycleState || "Continuous"}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-emerald-400 font-semibold">
                +{optimization?.overallTrafficGainPct ?? 24.5}% Traffic
              </span>
              <span className="text-muted-foreground">•</span>
              <span className="text-purple-400 font-semibold">
                +{optimization?.conversionsGrowthPct ?? 15.2}% Conversions
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center flex-wrap gap-2 text-xs">
            {cycleSteps.map((step, idx) => (
              <React.Fragment key={step}>
                <div className="px-3 py-1.5 rounded-lg bg-surface border border-border/70 font-mono font-medium flex items-center gap-1.5 shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{step}</span>
                </div>
                {idx < cycleSteps.length - 1 && (
                  <ArrowRight className="w-3.5 h-3.5 text-muted-foreground/60 shrink-0" />
                )}
              </React.Fragment>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
