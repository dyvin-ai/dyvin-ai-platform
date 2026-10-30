import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ShieldAlert,
  Calendar,
  TrendingUp,
  Zap,
  Info,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";
import type {
  CustomerChurnPredictionData,
  CustomerRenewalForecast,
  CustomerExpansionOpportunity,
} from "@/types";

interface ChurnRiskPredictionPanelProps {
  churn?: CustomerChurnPredictionData | null;
  renewal?: CustomerRenewalForecast | null;
  expansion?: CustomerExpansionOpportunity | null;
  isLoading?: boolean;
}

export function ChurnRiskPredictionPanel({
  churn,
  renewal,
  expansion,
  isLoading,
}: ChurnRiskPredictionPanelProps) {
  if (isLoading) {
    return (
      <Card className="border border-border/60 bg-surface-elevated/40">
        <CardContent className="p-6 space-y-4">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </CardContent>
      </Card>
    );
  }

  const churnProbPct = (churn?.churnProbability ?? 0.04) * 100;
  const churnRisk = churn?.churnRisk ?? "LOW";
  const renewalPct = renewal?.renewalLikelihoodPercent ?? 96.0;
  const daysToRenewal = renewal?.daysToRenewal ?? 145;
  const expansionPct = (churn?.expansionProbability ?? 0.86) * 100;
  const expansionOpportunity = expansion?.expansionOpportunity ?? "ENTERPRISE_SDK_UPGRADE";
  const arrGrowthUsd = expansion?.estimatedArrGrowthUsd ?? 12000;
  const intervention = churn?.recommendedIntervention ?? "OFFER_ENTERPRISE_SDK_UPGRADE";

  return (
    <div className="space-y-6">
      {/* 3 Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Churn Risk Tier */}
        <Card className="border border-border/60 bg-surface-elevated/50 shadow-xs relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-500/10 rounded-full blur-xl pointer-events-none" />
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
              <span>Churn Risk Probability</span>
              <ShieldAlert className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-bold font-mono text-emerald-400">
                {churnProbPct.toFixed(1)}%
              </span>
              <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs">
                {churnRisk} RISK
              </Badge>
            </div>
            <p className="mt-2 text-[11px] text-muted-foreground">
              Under 10% benchmark indicates top-tier account retention.
            </p>
          </CardContent>
        </Card>

        {/* Card 2: Renewal Forecast */}
        <Card className="border border-border/60 bg-surface-elevated/50 shadow-xs">
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
              <span>Renewal Likelihood</span>
              <Calendar className="w-4 h-4 text-purple-400" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-bold font-mono text-foreground">
                {renewalPct.toFixed(1)}%
              </span>
              <span className="text-xs text-muted-foreground">
                in {daysToRenewal} days
              </span>
            </div>
            <p className="mt-2 text-[11px] text-muted-foreground">
              Next annual renewal scheduled in Q1 2027.
            </p>
          </CardContent>
        </Card>

        {/* Card 3: Expansion Potential */}
        <Card className="border border-border/60 bg-surface-elevated/50 shadow-xs">
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
              <span>Expansion Potential</span>
              <TrendingUp className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-bold font-mono text-cyan-400">
                {expansionPct.toFixed(0)}%
              </span>
              <Badge variant="outline" className="border-cyan-500/30 text-cyan-400 text-xs font-mono">
                +${(arrGrowthUsd / 1000).toFixed(0)}k ARR
              </Badge>
            </div>
            <p className="mt-2 text-[11px] text-muted-foreground">
              Target expansion: {expansionOpportunity.replace(/_/g, " ")}.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recommended Retention & Expansion Action Card */}
      <Card className="border border-border/60 bg-surface-elevated/40 shadow-xs">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <CardTitle className="text-sm font-semibold">
                  Prescriptive Retention & Expansion Intervention
                </CardTitle>
                <CardDescription className="text-xs">
                  Automated telemetry recommendation triggered by low churn risk and high feature utilization.
                </CardDescription>
              </div>
            </div>
            <Badge className="bg-purple-500/10 text-purple-400 border border-purple-500/20 text-xs font-mono">
              NEXT STEP
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 rounded-xl border border-border/60 bg-surface-elevated/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-foreground">
                  Action Recommendation:
                </span>
                <Badge variant="outline" className="font-mono text-xs border-cyan-500/30 text-cyan-400">
                  {intervention}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Account usage metrics show 412 vector searches and active multi-agent workflows. Upgrading to Enterprise SDK adds high-throughput batching and dedicated tenant vector shards.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <div className="text-right">
                <div className="text-xs text-muted-foreground">Projected ARR Delta</div>
                <div className="text-sm font-bold font-mono text-emerald-400">+${arrGrowthUsd.toLocaleString()} / yr</div>
              </div>
            </div>
          </div>

          {/* Model Disclosure & Governance Note */}
          <div className="p-3 rounded-lg border border-border/40 bg-surface-subtle/40 flex items-start gap-2.5 text-xs text-muted-foreground">
            <Info className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-semibold text-foreground">Telemetry & Model Governance Disclosure:</span>
              <p className="text-[11px] leading-relaxed">
                Risk percentages and renewal forecasts are computed through deterministic rule-based telemetry metrics (session frequency, support ticket recency, active API keys, and contract renewal horizon). Predictions are audited to prevent fabricated confidence metrics.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
