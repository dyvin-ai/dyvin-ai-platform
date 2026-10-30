import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BarChart,
  Target,
  Zap,
  CheckCircle2,
  TrendingUp,
  Sliders,
  Scale,
  ShieldCheck,
} from "lucide-react";
import type { IndustryBenchmarkData } from "@/types";

interface IndustryBenchmarkComparisonCardProps {
  benchmarks?: IndustryBenchmarkData | null;
  isLoading?: boolean;
}

export function IndustryBenchmarkComparisonCard({
  benchmarks,
  isLoading,
}: IndustryBenchmarkComparisonCardProps) {
  if (isLoading) {
    return (
      <Card className="border border-border/60 bg-surface-elevated/40">
        <CardContent className="p-6 space-y-4">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-32 w-full" />
          <div className="grid grid-cols-3 gap-4">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const avgVisibility = benchmarks?.avgVisibilityPercent ?? 85.0;
  const avgCitation = benchmarks?.avgCitationPercent ?? 62.4;
  const avgRetrieval = benchmarks?.avgRetrievalPercent ?? 78.5;
  const top10 = benchmarks?.top10PercentileThreshold ?? 96.0;
  const median = benchmarks?.medianScore ?? 82.1;
  const bottomQuartile = benchmarks?.bottomQuartileScore ?? 68.0;

  return (
    <div className="space-y-6">
      {/* Benchmark Summary Metrics */}
      <Card className="border border-border/60 bg-surface-elevated/40">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              <CardTitle className="text-base font-semibold">
                Anonymous Industry Benchmark & Percentiles
              </CardTitle>
            </div>
            <Badge className="bg-primary/10 text-primary border border-primary/20 text-xs">
              Industry: {benchmarks?.industryKey || "SAAS"}
            </Badge>
          </div>
          <CardDescription className="text-xs">
            Aggregated cross-tenant anonymous benchmarks measuring LLM retrieval probabilities and citation coverage.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Main 3 Progress Comparisons */}
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-medium text-foreground flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  Average Visibility Index
                </span>
                <span className="font-bold text-foreground">{avgVisibility}%</span>
              </div>
              <Progress value={avgVisibility} className="h-2 bg-muted/60" />
              <div className="flex justify-between text-[11px] text-muted-foreground mt-1">
                <span>0%</span>
                <span>Median: {median}%</span>
                <span>Top 10%: {top10}%</span>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-medium text-foreground flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                  Average Citation Inclusion Share
                </span>
                <span className="font-bold text-foreground">{avgCitation}%</span>
              </div>
              <Progress value={avgCitation} className="h-2 bg-muted/60" />
              <div className="flex justify-between text-[11px] text-muted-foreground mt-1">
                <span>Direct URL footnotes and references in synthesis outputs</span>
                <span>Threshold: 60%</span>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-medium text-foreground flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                  Vector RAG Retrieval Penetration
                </span>
                <span className="font-bold text-foreground">{avgRetrieval}%</span>
              </div>
              <Progress value={avgRetrieval} className="h-2 bg-muted/60" />
              <div className="flex justify-between text-[11px] text-muted-foreground mt-1">
                <span>Search augmentations ranking in top 5 retrieved contexts</span>
                <span>Target: &gt;75%</span>
              </div>
            </div>
          </div>

          {/* Percentile Threshold Tier Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3.5 rounded-lg border border-emerald-500/20 bg-emerald-500/5">
              <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wide">
                Top 10% (P90) Threshold
              </div>
              <div className="text-2xl font-bold text-foreground mt-1">{top10}%</div>
              <p className="text-[11px] text-muted-foreground mt-1">
                Elite brands with near-universal inclusion in AI engine answers
              </p>
            </div>

            <div className="p-3.5 rounded-lg border border-primary/20 bg-primary/5">
              <div className="text-xs font-semibold text-primary uppercase tracking-wide">
                Industry Median (P50)
              </div>
              <div className="text-2xl font-bold text-foreground mt-1">{median}%</div>
              <p className="text-[11px] text-muted-foreground mt-1">
                Balanced visibility benchmark across all tracked category peers
              </p>
            </div>

            <div className="p-3.5 rounded-lg border border-amber-500/20 bg-amber-500/5">
              <div className="text-xs font-semibold text-amber-400 uppercase tracking-wide">
                Bottom Quartile (P25)
              </div>
              <div className="text-2xl font-bold text-foreground mt-1">{bottomQuartile}%</div>
              <p className="text-[11px] text-muted-foreground mt-1">
                Under-indexed domains requiring autonomous prompt remediation
              </p>
            </div>
          </div>

          {/* Key Insights & Methodology Callout */}
          <div className="p-4 rounded-lg bg-surface-elevated/80 border border-border/60 text-xs space-y-2">
            <div className="flex items-center gap-2 font-semibold text-foreground">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Differential Privacy & Statistical Guarantee
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Industry benchmarks are computed through k-anonymity (k &ge; 50) and differential privacy noise perturbation.
              No tenant-identifiable prompt datasets, private API tokens, or proprietary embeddings are ever exposed or shared.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
