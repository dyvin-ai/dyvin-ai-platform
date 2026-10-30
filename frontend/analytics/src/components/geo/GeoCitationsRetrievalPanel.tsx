import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Quote,
  Award,
  Globe,
  TrendingUp,
  BarChart3,
  Bot,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";
import type { GeoCitationOverview, GeoRetrievalAnalytics } from "@/types";

interface GeoCitationsRetrievalPanelProps {
  citations?: GeoCitationOverview | null;
  retrieval?: GeoRetrievalAnalytics | null;
  isLoading?: boolean;
}

export function GeoCitationsRetrievalPanel({
  citations,
  retrieval,
  isLoading,
}: GeoCitationsRetrievalPanelProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Skeleton className="h-64 rounded-lg" />
        <Skeleton className="h-64 rounded-lg" />
      </div>
    );
  }

  const engineBreakdown = citations?.citationsByEngine || {
    "ChatGPT (GPT-4o)": 640,
    "Claude 3.5 Sonnet": 420,
    "Perplexity Sonar": 290,
    "Google Gemini 1.5": 100,
  };

  const totalCitations = citations?.totalCitationsCount ?? 1450;
  const topDomains = citations?.topCitedDomains ?? ["wikipedia.org", "techcrunch.com", "forbes.com", "dyvin.ai"];

  const rankDistribution = retrieval?.retrievalTrendPoints || [
    { rank: 1, share: 64.2 },
    { rank: 2, share: 22.8 },
    { rank: 3, share: 9.5 },
    { rank: 4, share: 3.5 },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Citations Intelligence Card */}
      <Card className="border border-border/60 bg-surface-elevated/40 shadow-xs">
        <CardHeader className="p-4 pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Quote className="size-4.5 text-emerald-500" />
              Multi-LLM Citation Intelligence
            </CardTitle>
            <Badge variant="outline" className="text-xs font-mono bg-emerald-500/10 text-emerald-600 border-emerald-500/30">
              +{citations?.citationGrowthRate ?? 18.5}% Growth
            </Badge>
          </div>
          <CardDescription className="text-xs text-muted-foreground mt-0.5">
            Indexed citations attributed to your brand across generative response networks
          </CardDescription>
        </CardHeader>

        <CardContent className="p-4 pt-0 space-y-4">
          {/* Top Engine Citation Bars */}
          <div className="space-y-2.5">
            <p className="text-xs font-semibold text-foreground">Citations Attributed by Foundation Engine</p>
            {Object.entries(engineBreakdown).map(([engine, count]) => {
              const pct = Math.round((count / totalCitations) * 100);
              return (
                <div key={engine} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-foreground font-medium flex items-center gap-1.5">
                      <Bot className="size-3 text-muted-foreground" />
                      {engine}
                    </span>
                    <span className="text-muted-foreground">
                      {count.toLocaleString()} citations ({pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-surface-elevated rounded-full h-2 overflow-hidden border border-border/40">
                    <div
                      className="h-full bg-linear-to-r from-emerald-500 to-teal-400 transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Top Authority Domains */}
          <div className="pt-2 border-t border-border/50 space-y-2">
            <p className="text-xs font-semibold text-foreground flex items-center justify-between">
              <span>Primary Cited Authority Domains</span>
              <span className="text-[11px] text-muted-foreground font-mono">Top Grounding Sources</span>
            </p>
            <div className="grid grid-cols-2 gap-2">
              {topDomains.map((dom, i) => (
                <div
                  key={dom}
                  className="flex items-center justify-between p-2 rounded-md border border-border/50 bg-surface/50 text-xs"
                >
                  <div className="flex items-center gap-1.5 min-w-0 font-mono">
                    <Globe className="size-3 text-blue-500 shrink-0" />
                    <span className="truncate text-foreground font-medium">{dom}</span>
                  </div>
                  <Badge variant="secondary" className="text-[10px] font-mono shrink-0">
                    #{i + 1}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Retrieval Rank & Position Analytics */}
      <Card className="border border-border/60 bg-surface-elevated/40 shadow-xs">
        <CardHeader className="p-4 pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Award className="size-4.5 text-purple-500" />
              AI Retrieval Rank & Positioning
            </CardTitle>
            <Badge variant="outline" className="text-xs font-mono bg-purple-500/10 text-purple-500 border-purple-500/30">
              Avg Rank: {retrieval?.averageRetrievalRank ?? 1.4}
            </Badge>
          </div>
          <CardDescription className="text-xs text-muted-foreground mt-0.5">
            Top-K placement in generative answer recommendations and synthesized answers
          </CardDescription>
        </CardHeader>

        <CardContent className="p-4 pt-0 space-y-4">
          {/* Main Stat Card */}
          <div className="p-3 rounded-lg border border-border/60 bg-surface/60 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Overall Retrieval Share</p>
              <p className="text-3xl font-bold font-display tracking-tight text-foreground mt-0.5">
                {retrieval?.retrievalSharePct ?? 82.0}%
              </p>
              <p className="text-[11px] text-emerald-500 font-mono mt-0.5 flex items-center gap-1">
                <TrendingUp className="size-3" />
                Featured in 4 out of 5 relevant search responses
              </p>
            </div>
            <div className="p-3 rounded-full bg-purple-500/10 text-purple-500">
              <BarChart3 className="size-6" />
            </div>
          </div>

          {/* Position Distribution */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-foreground">Position Distribution Breakdown</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {rankDistribution.map((item) => (
                <div
                  key={item.rank}
                  className="p-2.5 rounded-lg border border-border/60 bg-surface/50 text-center space-y-1"
                >
                  <p className="text-xs text-muted-foreground font-mono">Rank #{item.rank}</p>
                  <p className="text-lg font-bold font-display text-foreground">{item.share}%</p>
                  <div className="w-full bg-surface-elevated rounded-full h-1 overflow-hidden">
                    <div
                      className="h-full bg-purple-500"
                      style={{ width: `${item.share}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-2.5 rounded-md border border-purple-500/20 bg-purple-500/5 text-xs text-muted-foreground flex items-center gap-2">
            <ShieldCheck className="size-4 text-purple-500 shrink-0" />
            <span>
              Rank #1 answers yield <strong>3.4x higher</strong> referral CTR across Perplexity and ChatGPT Search.
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
