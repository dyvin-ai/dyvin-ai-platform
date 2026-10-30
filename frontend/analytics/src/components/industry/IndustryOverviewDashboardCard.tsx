import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Building2,
  TrendingUp,
  Search,
  Globe,
  Award,
  Layers,
  Sparkles,
  BarChart3,
  ExternalLink,
} from "lucide-react";
import type {
  IndustryOverviewData,
  IndustryPlatformStatistics,
  IndustryPublicIndexData,
} from "@/types";

interface IndustryOverviewDashboardCardProps {
  overview?: IndustryOverviewData | null;
  platformStats?: IndustryPlatformStatistics | null;
  publicIndex?: IndustryPublicIndexData | null;
  selectedIndustry: string;
  onIndustryChange: (ind: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSearchSubmit: () => void;
  isLoading?: boolean;
}

const INDUSTRIES = [
  { id: "SAAS", label: "Cloud SaaS & Software" },
  { id: "FINTECH", label: "Fintech & Banking" },
  { id: "HEALTHCARE", label: "Healthcare & Life Sciences" },
  { id: "ECOMMERCE", label: "E-Commerce & Retail" },
  { id: "EDTECH", label: "EdTech & Learning" },
  { id: "LOGISTICS", label: "Supply Chain & Logistics" },
];

export function IndustryOverviewDashboardCard({
  overview,
  platformStats,
  publicIndex,
  selectedIndustry,
  onIndustryChange,
  searchQuery,
  onSearchChange,
  onSearchSubmit,
  isLoading,
}: IndustryOverviewDashboardCardProps) {
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

  const trackedCompanies = overview?.totalTrackedCompanies?.toLocaleString() ?? "42,000";
  const avgVisibility = overview?.avgVisibilityScore ?? 84.5;
  const topDomain = overview?.topCitationDomain ?? "cloud-saas-leader.io";
  const growthTrend = overview?.growthTrend ?? "ACCELERATING";

  return (
    <div className="space-y-6">
      {/* Industry Selector & Platform Counters */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 rounded-xl border border-border/60 bg-surface-elevated/40 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-primary/10 border border-primary/20 text-primary">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-foreground text-sm">Industry Vertical:</span>
              <div className="flex flex-wrap gap-1.5">
                {INDUSTRIES.map((ind) => (
                  <button
                    key={ind.id}
                    onClick={() => onIndustryChange(ind.id)}
                    className={`px-2.5 py-1 text-xs rounded-md font-medium transition-all ${
                      selectedIndustry === ind.id
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "bg-surface-elevated text-muted-foreground hover:bg-surface-elevated/80 border border-border/40"
                    }`}
                  >
                    {ind.label}
                  </button>
                ))}
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Cross-sector AI model citation baselines and Generative Engine Optimization benchmarks.
            </p>
          </div>
        </div>

        {platformStats && (
          <div className="flex items-center gap-3 border-t lg:border-t-0 lg:border-l border-border/40 pt-3 lg:pt-0 lg:pl-4">
            <div className="text-right">
              <div className="text-xs text-muted-foreground">Classified Sectors</div>
              <div className="text-base font-bold text-foreground">
                {platformStats.totalIndustriesClassified}
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-muted-foreground">Global Boards</div>
              <div className="text-base font-bold text-foreground">
                {platformStats.totalGlobalLeaderboards}
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-muted-foreground">Publications</div>
              <div className="text-base font-bold text-foreground">
                {platformStats.activeResearchPublications}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Overview Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Tracked Companies */}
        <Card className="border border-border/60 bg-surface-elevated/40">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Tracked Entities
              </span>
              <Layers className="w-4 h-4 text-primary" />
            </div>
            <div className="mt-2 text-2xl font-bold text-foreground">{trackedCompanies}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Active verified domains in {overview?.industryKey || selectedIndustry}
            </p>
          </CardContent>
        </Card>

        {/* Industry Avg Visibility */}
        <Card className="border border-border/60 bg-surface-elevated/40">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Industry Visibility
              </span>
              <BarChart3 className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="mt-2 text-2xl font-bold text-foreground">{avgVisibility}%</div>
            <div className="flex items-center gap-1.5 mt-1">
              <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] px-1.5 py-0">
                P50 Benchmark
              </Badge>
              <span className="text-xs text-muted-foreground">across LLM answers</span>
            </div>
          </CardContent>
        </Card>

        {/* Top Citation Authority */}
        <Card className="border border-border/60 bg-surface-elevated/40">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                P1 Citation Leader
              </span>
              <Award className="w-4 h-4 text-amber-400" />
            </div>
            <div className="mt-2 text-base font-bold text-foreground truncate">{topDomain}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Highest RAG retrieval frequency
            </p>
          </CardContent>
        </Card>

        {/* Growth Trend */}
        <Card className="border border-border/60 bg-surface-elevated/40">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Vertical Velocity
              </span>
              <TrendingUp className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="mt-2 text-2xl font-bold text-foreground">{growthTrend}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Prompt volume expansion rate
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Public AI Search Index Explorer */}
      <Card className="border border-border/60 bg-surface-elevated/30">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-primary" />
              <CardTitle className="text-base font-semibold">Public AI Search Index Query</CardTitle>
            </div>
            <Badge variant="outline" className="text-xs border-border/60 text-muted-foreground">
              Index Ver. 2026.4
            </Badge>
          </div>
          <CardDescription className="text-xs">
            Query the public AI discovery index to evaluate prompt volume and competitive index density.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && onSearchSubmit()}
                placeholder="Search indexed query e.g. SaaS Visibility, Enterprise AI Workflow..."
                className="pl-9 bg-background/60 border-border/60 text-sm"
              />
            </div>
            <Button
              onClick={onSearchSubmit}
              className="bg-primary hover:bg-primary/90 text-primary-foreground shrink-0 text-xs font-semibold"
            >
              Explore Index
            </Button>
          </div>
          {publicIndex && (
            <div className="mt-3 flex items-center justify-between px-3 py-2 rounded-lg bg-surface-elevated/60 border border-border/40 text-xs">
              <div className="flex items-center gap-2 text-muted-foreground">
                <span>Active Query:</span>
                <span className="font-semibold text-foreground">"{publicIndex.query}"</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Indexed Occurrences:</span>
                <Badge className="bg-primary/10 text-primary border border-primary/20 font-bold">
                  {publicIndex.resultsCount.toLocaleString()} results
                </Badge>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
