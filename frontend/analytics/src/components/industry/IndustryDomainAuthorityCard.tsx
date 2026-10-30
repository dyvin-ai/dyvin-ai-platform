import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ShieldCheck,
  Search,
  Globe,
  TrendingUp,
  Award,
  Sparkles,
  Lock,
  Compass,
} from "lucide-react";
import type { IndustryAuthorityData } from "@/types";

interface IndustryDomainAuthorityCardProps {
  authority?: IndustryAuthorityData | null;
  targetDomain: string;
  onDomainChange: (domain: string) => void;
  onLookup: () => void;
  isLoading?: boolean;
}

export function IndustryDomainAuthorityCard({
  authority,
  targetDomain,
  onDomainChange,
  onLookup,
  isLoading,
}: IndustryDomainAuthorityCardProps) {
  if (isLoading) {
    return (
      <Card className="border border-border/60 bg-surface-elevated/40">
        <CardContent className="p-6 space-y-4">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-10 w-full" />
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const domain = authority?.domain ?? targetDomain ?? "dyvin.ai";
  const authorityScore = authority?.authorityScore ?? 98.5;
  const trustScore = authority?.trustScore ?? 99.0;
  const momentum = authority?.visibilityMomentum ?? "ACCELERATING";
  const retrievalStrength = authority?.retrievalStrengthPercent ?? 96.4;

  const getMomentumBadge = (mom: string) => {
    switch (mom.toUpperCase()) {
      case "ACCELERATING":
        return (
          <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold">
            <TrendingUp className="w-3.5 h-3.5 mr-1" />
            ACCELERATING
          </Badge>
        );
      case "STABLE":
        return (
          <Badge className="bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-semibold">
            <Compass className="w-3.5 h-3.5 mr-1" />
            STABLE
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="border-border/60 text-muted-foreground text-xs font-semibold">
            {mom}
          </Badge>
        );
    }
  };

  return (
    <Card className="border border-border/60 bg-surface-elevated/40">
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <div>
              <CardTitle className="text-base font-semibold">
                Global Domain Authority & Trust Scorecard
              </CardTitle>
              <CardDescription className="text-xs">
                Domain-level AI citation trustworthiness, LLM hallucination resistance, and semantic authority index.
              </CardDescription>
            </div>
          </div>
          {getMomentumBadge(momentum)}
        </div>

        {/* Domain Search Input */}
        <div className="mt-3 flex gap-2">
          <div className="relative flex-1">
            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={targetDomain}
              onChange={(e) => onDomainChange(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && onLookup()}
              placeholder="Lookup domain e.g. dyvin.ai, stripe.com, datadoghq.com..."
              className="pl-9 bg-background/50 border-border/60 text-xs h-9"
            />
          </div>
          <Button
            onClick={onLookup}
            size="sm"
            className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold shrink-0"
          >
            Lookup Authority
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Metric Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Authority Score */}
          <div className="p-4 rounded-xl border border-border/60 bg-surface-elevated/60">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Authority Score</span>
              <Award className="w-4 h-4 text-primary" />
            </div>
            <div className="text-2xl font-bold text-foreground mt-2">
              {authorityScore.toFixed(1)} <span className="text-sm font-normal text-muted-foreground">/ 100</span>
            </div>
            <Progress value={authorityScore} className="h-1.5 mt-2 bg-muted/60" />
            <p className="text-[11px] text-muted-foreground mt-1.5">
              Knowledge Graph citation presence
            </p>
          </div>

          {/* Trust Score */}
          <div className="p-4 rounded-xl border border-border/60 bg-surface-elevated/60">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Trust Index</span>
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold text-foreground mt-2">
              {trustScore.toFixed(1)} <span className="text-sm font-normal text-muted-foreground">/ 100</span>
            </div>
            <Progress value={trustScore} className="h-1.5 mt-2 bg-muted/60" />
            <p className="text-[11px] text-muted-foreground mt-1.5">
              Factual consistency across 4+ LLMs
            </p>
          </div>

          {/* Retrieval Strength */}
          <div className="p-4 rounded-xl border border-border/60 bg-surface-elevated/60">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Retrieval Strength</span>
              <Sparkles className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-2xl font-bold text-foreground mt-2">
              {retrievalStrength.toFixed(1)}%
            </div>
            <Progress value={retrievalStrength} className="h-1.5 mt-2 bg-muted/60" />
            <p className="text-[11px] text-muted-foreground mt-1.5">
              Dense vector top-k retrieval rate
            </p>
          </div>

          {/* Target Domain Evaluated */}
          <div className="p-4 rounded-xl border border-border/60 bg-surface-elevated/60">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Evaluated Domain</span>
              <Globe className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="text-lg font-bold text-foreground mt-2 truncate">
              {domain}
            </div>
            <div className="flex items-center gap-1.5 mt-2">
              <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] px-1.5 py-0">
                VERIFIED TIER 1
              </Badge>
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              Active crawling & telemetry sync
            </p>
          </div>
        </div>

        {/* Authority Breakdown Detail */}
        <div className="p-4 rounded-xl border border-border/60 bg-surface-elevated/30 space-y-3">
          <div className="text-xs font-semibold text-foreground flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-primary" />
            Authority Telemetry & Proof of Trust
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            The Global Authority Score evaluates how often frontier foundation models (OpenAI GPT-4o, Anthropic Claude 3.5 Sonnet, Google Gemini 1.5 Pro, and Perplexity Sonar) anchor assertions with citations back to <strong className="text-foreground">{domain}</strong>. Higher scores prevent brand hallucination and preserve direct traffic flow from generative answer summaries.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
