import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Search,
  Hash,
  TrendingUp,
  Layers,
  Sparkles,
  Plus,
  Upload,
  Zap,
  Target,
  FileSpreadsheet,
} from "lucide-react";
import type { KeywordIntelligenceOverview } from "@/types";

interface KeywordIntelligenceOverviewCardProps {
  overview?: KeywordIntelligenceOverview;
  isLoading?: boolean;
  onAddKeywordClick?: () => void;
  onImportCsvClick?: () => void;
  onGenerateClustersClick?: () => void;
  onNewCampaignClick?: () => void;
}

export function KeywordIntelligenceOverviewCard({
  overview,
  isLoading = false,
  onAddKeywordClick,
  onImportCsvClick,
  onGenerateClustersClick,
  onNewCampaignClick,
}: KeywordIntelligenceOverviewCardProps) {
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
      label: "Tracked Discovery Terms",
      value: overview.totalTrackedKeywords.toLocaleString(),
      subtext: "Across 6 intent categories",
      icon: Search,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
    },
    {
      label: "Monthly Search Volume",
      value: overview.totalSearchVolume.toLocaleString(),
      subtext: "Generative & traditional engines",
      icon: TrendingUp,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
    },
    {
      label: "Avg Opportunity Score",
      value: `${overview.avgOpportunityScore}%`,
      subtext: "Based on authority gap & ROI",
      icon: Target,
      color: "text-purple-400",
      bg: "bg-purple-500/10",
      border: "border-purple-500/20",
    },
    {
      label: "Topic Clusters Active",
      value: overview.activeClustersCount.toString(),
      subtext: "AI semantic groupings",
      icon: Layers,
      color: "text-amber-400",
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
    },
    {
      label: "Active Campaigns",
      value: overview.activeCampaignsCount.toString(),
      subtext: "Automated citation sweeps",
      icon: Zap,
      color: "text-cyan-400",
      bg: "bg-cyan-500/10",
      border: "border-cyan-500/20",
    },
    {
      label: "Avg LLM Citation Score",
      value: `${overview.avgCitationScore}%`,
      subtext: "ChatGPT, Perplexity, Gemini",
      icon: Sparkles,
      color: "text-indigo-400",
      bg: "bg-indigo-500/10",
      border: "border-indigo-500/20",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <Card className="border border-blue-500/30 bg-blue-950/10 backdrop-blur-sm overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl -z-10" />
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-500/20 border border-blue-500/40 rounded-xl">
                <Search className="w-8 h-8 text-blue-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold tracking-tight text-foreground">
                    Keyword & Generative Search Discovery Platform
                  </h2>
                  <Badge variant="outline" className="border-blue-500/40 text-blue-400 bg-blue-500/10 text-xs">
                    Phase F32
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
                  Analyze search demand across LLMs and search engines, group terms into semantic topic clusters,
                  and generate precision prompts to capture generative engine mindshare.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onImportCsvClick}
                className="gap-2 border-border/60 hover:bg-accent/40"
              >
                <Upload className="w-4 h-4 text-emerald-400" />
                Import CSV
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={onGenerateClustersClick}
                className="gap-2 border-border/60 hover:bg-accent/40"
              >
                <Layers className="w-4 h-4 text-purple-400" />
                Cluster AI
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={onAddKeywordClick}
                className="gap-2 bg-blue-600 hover:bg-blue-500 text-white"
              >
                <Plus className="w-4 h-4" />
                Add Keyword
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <Card
              key={idx}
              className={`border ${kpi.border} bg-card/60 backdrop-blur-sm hover:border-border transition-all duration-200`}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground">{kpi.label}</span>
                  <div className={`p-2 rounded-lg ${kpi.bg}`}>
                    <Icon className={`w-4 h-4 ${kpi.color}`} />
                  </div>
                </div>
                <div className="mt-2">
                  <div className="text-2xl font-bold tracking-tight text-foreground">{kpi.value}</div>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{kpi.subtext}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
