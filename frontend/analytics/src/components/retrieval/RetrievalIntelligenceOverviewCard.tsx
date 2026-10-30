import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  CheckCircle2,
  Clock,
  Quote,
  Globe,
  FlaskConical,
  Play,
  RefreshCw,
  Search,
  Sparkles,
} from "lucide-react";
import type { RetrievalOverviewData, CitationsOverviewData } from "@/types";

interface RetrievalIntelligenceOverviewCardProps {
  overview?: RetrievalOverviewData;
  citations?: CitationsOverviewData;
  activeProjectsCount?: number;
  isLoading?: boolean;
  onNewResearchClick?: () => void;
  onRefreshClick?: () => void;
  onInspectSourcesClick?: () => void;
  onCompareModelsClick?: () => void;
}

export function RetrievalIntelligenceOverviewCard({
  overview,
  citations,
  activeProjectsCount = 2,
  isLoading = false,
  onNewResearchClick,
  onRefreshClick,
  onInspectSourcesClick,
  onCompareModelsClick,
}: RetrievalIntelligenceOverviewCardProps) {
  if (isLoading || !overview) {
    return (
      <Card className="border border-border/50 bg-card/60 backdrop-blur-sm animate-pulse">
        <CardHeader className="h-28" />
        <CardContent className="h-48" />
      </Card>
    );
  }

  const kpis = [
    {
      label: "Semantic Retrievals",
      value: overview.totalRetrievals.toLocaleString(),
      subtext: "Vector chunk lookups & RAG passes",
      icon: BookOpen,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
    },
    {
      label: "Retrieval Precision",
      value: `${overview.successRatePct}%`,
      subtext: "High-confidence chunk matching",
      icon: CheckCircle2,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
    },
    {
      label: "Mean RAG Latency",
      value: `${overview.avgLatencyMs}ms`,
      subtext: "Hybrid reranking response time",
      icon: Clock,
      color: "text-amber-400",
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
    },
    {
      label: "Tracked Citations",
      value: citations ? citations.citationsCount.toLocaleString() : "450",
      subtext: "Attributed answers across engines",
      icon: Quote,
      color: "text-purple-400",
      bg: "bg-purple-500/10",
      border: "border-purple-500/20",
    },
    {
      label: "Apex Citing Domains",
      value: citations ? citations.uniqueDomains.toLocaleString() : "85",
      subtext: "High-authority knowledge hubs",
      icon: Globe,
      color: "text-cyan-400",
      bg: "bg-cyan-500/10",
      border: "border-cyan-500/20",
    },
    {
      label: "Active Research Runs",
      value: activeProjectsCount.toString(),
      subtext: "Autonomous discovery & briefs",
      icon: FlaskConical,
      color: "text-rose-400",
      bg: "bg-rose-500/10",
      border: "border-rose-500/20",
    },
  ];

  return (
    <Card className="border border-border/50 bg-gradient-to-br from-card/90 via-card/60 to-card/40 backdrop-blur-md shadow-xl overflow-hidden">
      <CardHeader className="p-6 pb-4 border-b border-border/40">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-primary/10 border border-primary/20 text-primary">
                <BookOpen className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-bold tracking-tight text-foreground">
                Research & Retrieval Intelligence Engine
              </h2>
              <Badge variant="outline" className="border-primary/30 text-primary bg-primary/5 text-xs font-semibold">
                Phase F33
              </Badge>
              <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 bg-emerald-500/5 text-xs">
                RAG Explorer Active
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground max-w-2xl">
              Inspect semantic vector chunk retrievals, citation provenance, source leaderboard authority, and run autonomous discovery pipelines.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              onClick={onRefreshClick}
              className="gap-1.5 border-border/60 hover:bg-accent/40"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Refresh
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onInspectSourcesClick}
              className="gap-1.5 border-border/60 hover:bg-accent/40"
            >
              <Search className="h-3.5 w-3.5" />
              Tracked Sources
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onCompareModelsClick}
              className="gap-1.5 border-border/60 hover:bg-accent/40"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Model Comparison
            </Button>
            <Button
              size="sm"
              onClick={onNewResearchClick}
              className="gap-1.5 bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm"
            >
              <Play className="h-3.5 w-3.5 fill-current" />
              New Research Run
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {kpis.map((kpi, idx) => {
            const Icon = kpi.icon;
            return (
              <div
                key={idx}
                className="relative overflow-hidden rounded-xl border border-border/50 bg-background/50 p-4 transition-all duration-200 hover:border-border hover:shadow-md group"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-muted-foreground">
                    {kpi.label}
                  </span>
                  <div className={`p-1.5 rounded-md ${kpi.bg} ${kpi.border} border`}>
                    <Icon className={`h-3.5 w-3.5 ${kpi.color}`} />
                  </div>
                </div>
                <div className="text-2xl font-bold tracking-tight text-foreground">
                  {kpi.value}
                </div>
                <p className="mt-1 text-[11px] text-muted-foreground line-clamp-1">
                  {kpi.subtext}
                </p>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
