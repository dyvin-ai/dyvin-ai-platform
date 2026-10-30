import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Users,
  TrendingUp,
  Award,
  Crown,
  BarChart,
  ShieldAlert,
} from "lucide-react";
import type { GeoCompetitorBenchmarkItem } from "@/types";

interface GeoCompetitorBenchmarkTableProps {
  competitors?: GeoCompetitorBenchmarkItem[];
  isLoading?: boolean;
}

export function GeoCompetitorBenchmarkTable({
  competitors = [],
  isLoading,
}: GeoCompetitorBenchmarkTableProps) {
  if (isLoading) {
    return (
      <Card className="border border-border/60 bg-surface-elevated/40">
        <CardHeader className="p-4">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-72" />
        </CardHeader>
        <CardContent className="p-4 pt-0 space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full rounded-md" />
          ))}
        </CardContent>
      </Card>
    );
  }

  const sorted = [...competitors].sort((a, b) => b.visibilityScore - a.visibilityScore);

  return (
    <Card className="border border-border/60 bg-surface-elevated/40 shadow-xs">
      <CardHeader className="p-4 pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Users className="size-4.5 text-blue-500" />
              Competitor GEO & AI Search Benchmarks
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground mt-0.5">
              Head-to-head visibility scores, prompt share of voice, and citation coverage rates
            </CardDescription>
          </div>
          <Badge variant="outline" className="text-xs font-mono bg-blue-500/10 text-blue-500 border-blue-500/30 w-fit">
            Competitive Leader: Dyvin AI (+8.3 Gap)
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-4 pt-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-border/60 text-muted-foreground font-mono text-[11px] uppercase tracking-wider bg-surface/50">
                <th className="py-2.5 px-3 font-semibold">Rank & Entity</th>
                <th className="py-2.5 px-3 font-semibold">AI Visibility Score</th>
                <th className="py-2.5 px-3 font-semibold">Prompt Share of Voice</th>
                <th className="py-2.5 px-3 font-semibold">Citation Coverage</th>
                <th className="py-2.5 px-3 font-semibold text-right">Competitive Stance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {sorted.map((item, index) => {
                const isOrg = item.competitorName.toLowerCase().includes("your org") || item.competitorName.toLowerCase().includes("dyvin");
                const promptShare = item.promptSharePct ?? 25.0;
                const citationCov = item.citationCoveragePct ?? 70.0;

                return (
                  <tr
                    key={item.competitorName}
                    className={`transition-colors ${
                      isOrg
                        ? "bg-blue-500/5 hover:bg-blue-500/10 font-medium"
                        : "hover:bg-surface-subtle/50"
                    }`}
                  >
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2.5">
                        <span className="font-mono text-xs text-muted-foreground w-4 text-center">
                          {index === 0 ? <Crown className="size-4 text-amber-500 inline" /> : `#${index + 1}`}
                        </span>
                        <div>
                          <span className={`text-xs ${isOrg ? "font-bold text-foreground" : "text-foreground"}`}>
                            {item.competitorName}
                          </span>
                          {isOrg && (
                            <Badge variant="outline" className="ml-2 text-[9px] font-mono bg-brand/10 text-brand border-brand/20">
                              Active Workspace
                            </Badge>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-3 font-mono">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-foreground">{item.visibilityScore}</span>
                        <div className="w-16 bg-surface-elevated rounded-full h-1.5 overflow-hidden hidden sm:block">
                          <div
                            className={`h-full ${isOrg ? "bg-blue-500" : "bg-muted-foreground/60"}`}
                            style={{ width: `${item.visibilityScore}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-3 font-mono">
                      <span className="text-foreground">{promptShare}%</span>
                    </td>

                    <td className="py-3 px-3 font-mono">
                      <div className="flex items-center gap-2">
                        <span className="text-foreground">{citationCov}%</span>
                        <Badge
                          variant="secondary"
                          className={`text-[10px] font-mono ${
                            citationCov >= 80 ? "text-emerald-500" : "text-muted-foreground"
                          }`}
                        >
                          {citationCov >= 80 ? "High" : "Standard"}
                        </Badge>
                      </div>
                    </td>

                    <td className="py-3 px-3 text-right">
                      {isOrg ? (
                        <Badge className="text-[10px] bg-emerald-500/10 text-emerald-600 border border-emerald-500/30">
                          Category Leader
                        </Badge>
                      ) : (
                        <span className="text-[11px] text-muted-foreground font-mono">
                          -{(sorted[0].visibilityScore - item.visibilityScore).toFixed(1)} pts
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
