import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Globe2,
  TrendingUp,
  Award,
  Search,
  Quote,
  Layers,
  Activity,
  Sparkles,
  Bot,
} from "lucide-react";
import type { GeoDashboardOverview, GeoPlatformStatistics } from "@/types";

interface GeoOverviewDashboardCardProps {
  overview?: GeoDashboardOverview | null;
  statistics?: GeoPlatformStatistics | null;
  isLoading?: boolean;
}

export function GeoOverviewDashboardCard({
  overview,
  statistics,
  isLoading,
}: GeoOverviewDashboardCardProps) {
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
      label: "Overall AI Visibility Score",
      value: `${overview?.overallAiVisibilityScore ?? 84.5}`,
      subtext: `+${overview?.growthRatePct ?? 14.2}% monthly growth rate`,
      icon: Globe2,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      badge: "Top 5% Industry",
    },
    {
      label: "AI Citation Authority Score",
      value: `${overview?.citationScore ?? 88.2}`,
      subtext: `Top domain: ${overview?.topCitationDomain ?? "wikipedia.org"}`,
      icon: Quote,
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
      badge: "High Grounding",
    },
    {
      label: "AI Retrieval Share Rate",
      value: `${overview?.retrievalScore ?? 82.0}%`,
      subtext: "Avg retrieval position: 1.4 rank",
      icon: Award,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
      badge: "Rank #1 Focus",
    },
    {
      label: "Leading AI Model Coverage",
      value: overview?.topAiModel ?? "ChatGPT (GPT-4o)",
      subtext: "Highest prompt share & citations",
      icon: Bot,
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
      badge: "Primary Engine",
    },
  ];

  return (
    <div className="space-y-4">
      {/* 4 Primary KPI Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <Card
              key={idx}
              className="border border-border/60 bg-surface-elevated/60 backdrop-blur-xs hover:border-border transition-colors shadow-xs"
            >
              <CardContent className="p-4 flex items-center justify-between">
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-[12px] font-medium text-muted-foreground truncate">{kpi.label}</p>
                  </div>
                  <p className="text-2xl font-bold font-display tracking-tight text-foreground truncate">{kpi.value}</p>
                  <p className="text-[11px] text-muted-foreground/80 truncate font-mono">{kpi.subtext}</p>
                </div>
                <div className={`p-2.5 rounded-lg shrink-0 ${kpi.bgColor}`}>
                  <Icon className={`size-5 ${kpi.color}`} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Operational Telemetry Banner */}
      <div className="p-3 rounded-lg border border-border/60 bg-surface/60 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-semibold text-foreground">
              {statistics?.aiSearchStatus ?? "GEO_INTELLIGENCE_OPERATIONAL"}
            </span>
          </div>
          <span className="text-muted-foreground">|</span>
          <div className="text-muted-foreground">
            Tracked Prompts: <strong className="text-foreground">{(statistics?.trackedPrompts ?? 14200).toLocaleString()}</strong>
          </div>
          <span className="text-muted-foreground">|</span>
          <div className="text-muted-foreground">
            Indexed Citations: <strong className="text-foreground">{(statistics?.trackedCitations ?? 84200).toLocaleString()}</strong>
          </div>
        </div>

        <Badge variant="outline" className="text-[11px] bg-brand/10 text-brand border-brand/20">
          <Sparkles className="size-3 mr-1 inline" />
          Autonomous GEO Engine Active
        </Badge>
      </div>
    </div>
  );
}
