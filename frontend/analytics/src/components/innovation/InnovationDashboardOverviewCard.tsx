import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  FlaskConical,
  Sparkles,
  Zap,
  TrendingUp,
  ShieldCheck,
  ArrowRight,
  Cpu,
  Layers,
  CheckCircle2,
  Clock,
  Radio,
  Plus,
} from "lucide-react";
import type { InnovationDashboardData, InnovationLabStatistics } from "@/types";

interface InnovationDashboardOverviewCardProps {
  overview?: InnovationDashboardData | null;
  statistics?: InnovationLabStatistics | null;
  onNavigateTab: (tab: string) => void;
  onOpenCreateModal: () => void;
  isLoading?: boolean;
}

export function InnovationDashboardOverviewCard({
  overview,
  statistics,
  onNavigateTab,
  onOpenCreateModal,
  isLoading,
}: InnovationDashboardOverviewCardProps) {
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

  const sandboxState = overview?.sandboxState ?? "ACTIVE_ISOLATED_SANDBOX";
  const runningExperiments = overview?.runningExperimentsCount ?? 18;
  const promotionsPending = overview?.promotionsPendingCount ?? 4;
  const browserSuccess = overview?.browserAgentSuccessPct ? `${overview.browserAgentSuccessPct}%` : "98.2%";
  const voiceLatency = overview?.voiceLatencyMs ? `${overview.voiceLatencyMs}ms` : "180ms";
  const multimodalReadiness = overview?.multimodalReadiness ?? "READY_FOR_STAGING";

  const totalPromotions = statistics?.totalPromotionsToStaging ?? 24;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <Card className="border border-primary/30 bg-gradient-to-r from-primary/10 via-surface-elevated to-surface-card overflow-hidden">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="border-primary/50 text-primary bg-primary/10 gap-1.5 py-0.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  {sandboxState}
                </Badge>
                <Badge variant="secondary" className="bg-surface-subtle text-foreground-muted text-xs">
                  Readiness: {multimodalReadiness}
                </Badge>
              </div>
              <h2 className="text-xl lg:text-2xl font-semibold tracking-tight text-foreground">
                Enterprise AI Innovation Lab & Experimentation Sandbox
              </h2>
              <p className="text-sm text-foreground-muted max-w-3xl leading-relaxed">
                Isolated sandbox environment for testing preview foundation models, running evolutionary prompt
                tournaments, evaluating browser & voice agents, and promoting validated AI capabilities into staging.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onNavigateTab("models")}
                className="gap-2 border-border/80 hover:bg-surface-elevated"
              >
                <Cpu className="h-4 w-4 text-blue-400" />
                Preview Models
              </Button>
              <Button
                size="sm"
                onClick={onOpenCreateModal}
                className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Plus className="h-4 w-4" />
                New Experiment
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 4 Core KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border border-border/60 bg-surface-elevated/60 hover:border-primary/40 transition-colors">
          <CardContent className="p-4 space-y-2">
            <div className="flex items-center justify-between text-foreground-muted text-xs font-medium">
              <span>Sandboxed Experiments</span>
              <FlaskConical className="h-4 w-4 text-primary" />
            </div>
            <div className="text-2xl font-bold tracking-tight text-foreground">
              {runningExperiments} Active
            </div>
            <p className="text-xs text-emerald-400 flex items-center gap-1 font-medium">
              <CheckCircle2 className="h-3 w-3" />
              100% Sandbox Isolated
            </p>
          </CardContent>
        </Card>

        <Card className="border border-border/60 bg-surface-elevated/60 hover:border-primary/40 transition-colors">
          <CardContent className="p-4 space-y-2">
            <div className="flex items-center justify-between text-foreground-muted text-xs font-medium">
              <span>Promotions Pending</span>
              <Layers className="h-4 w-4 text-amber-400" />
            </div>
            <div className="text-2xl font-bold tracking-tight text-foreground">
              {promotionsPending} Ready
            </div>
            <p className="text-xs text-foreground-muted">
              Gate threshold &gt; 95% passed
            </p>
          </CardContent>
        </Card>

        <Card className="border border-border/60 bg-surface-elevated/60 hover:border-primary/40 transition-colors">
          <CardContent className="p-4 space-y-2">
            <div className="flex items-center justify-between text-foreground-muted text-xs font-medium">
              <span>Browser Agent Success</span>
              <Sparkles className="h-4 w-4 text-purple-400" />
            </div>
            <div className="text-2xl font-bold tracking-tight text-foreground">
              {browserSuccess}
            </div>
            <p className="text-xs text-emerald-400 flex items-center gap-1 font-medium">
              <TrendingUp className="h-3 w-3" />
              DOM Navigation & Extraction
            </p>
          </CardContent>
        </Card>

        <Card className="border border-border/60 bg-surface-elevated/60 hover:border-primary/40 transition-colors">
          <CardContent className="p-4 space-y-2">
            <div className="flex items-center justify-between text-foreground-muted text-xs font-medium">
              <span>Voice Engine Latency</span>
              <Radio className="h-4 w-4 text-blue-400" />
            </div>
            <div className="text-2xl font-bold tracking-tight text-foreground">
              {voiceLatency}
            </div>
            <p className="text-xs text-foreground-muted">
              Ultra-low latency STT + TTS
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Security & Gate Verification Bar */}
      <Card className="border border-border/60 bg-surface-card">
        <CardContent className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border/60 gap-4">
            <div className="flex items-center gap-4 py-2 md:py-0 md:px-4">
              <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-foreground-muted font-medium">Safety Isolation Level</p>
                <p className="text-base font-bold text-foreground">Strict Air-Gapped Sandbox</p>
                <p className="text-xs text-foreground-muted">Zero access to customer production data</p>
              </div>
            </div>

            <div className="flex items-center gap-4 py-2 md:py-0 md:px-4">
              <div className="h-10 w-10 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                <Layers className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-foreground-muted font-medium">Cumulative Promotions</p>
                <p className="text-base font-bold text-foreground">{totalPromotions} to Staging</p>
                <p className="text-xs text-foreground-muted">Successfully passed quality gates</p>
              </div>
            </div>

            <div className="flex items-center gap-4 py-2 md:py-0 md:px-4">
              <div className="h-10 w-10 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center shrink-0">
                <Zap className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-foreground-muted font-medium">Supported Modalities</p>
                <p className="text-base font-bold text-foreground">Vision, Voice, Web, IoT</p>
                <p className="text-xs text-foreground-muted">Full multimodal evaluation ready</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
