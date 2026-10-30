import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BookOpen,
  FileText,
  TrendingUp,
  TrendingDown,
  Sparkles,
  Bot,
  ExternalLink,
  Download,
  Calendar,
  Layers,
} from "lucide-react";
import type {
  IndustryReportsData,
  IndustryTrendData,
  IndustryModelsPreference,
  IndustryPublicationItem,
} from "@/types";

interface IndustryResearchPublicationConsoleProps {
  reports?: IndustryReportsData | null;
  trends?: IndustryTrendData | null;
  models?: IndustryModelsPreference | null;
  publications?: IndustryPublicationItem[] | null;
  isLoading?: boolean;
}

export function IndustryResearchPublicationConsole({
  reports,
  trends,
  models,
  publications,
  isLoading,
}: IndustryResearchPublicationConsoleProps) {
  if (isLoading) {
    return (
      <Card className="border border-border/60 bg-surface-elevated/40">
        <CardContent className="p-6 space-y-4">
          <Skeleton className="h-6 w-48" />
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-28 w-full" />
            <Skeleton className="h-28 w-full" />
          </div>
          <Skeleton className="h-40 w-full" />
        </CardContent>
      </Card>
    );
  }

  const latestReport = reports?.latestReport ?? {
    title: "Q3 Global AI Search Industry Digest",
    status: "PUBLISHED",
  };

  const emergingTopics = trends?.emergingTopics ?? [
    "Vector Search Optimization",
    "LLM Citation Authority",
    "Autonomous Agents",
  ];

  const decliningDomains = trends?.decliningDomains ?? [
    "legacy-seo-farms.net",
    "keyword-stuffing-dir.com",
  ];

  const preferredSaasModel = models?.mostPreferredModelForSaas ?? "GPT-4o";
  const preferredResearchModel = models?.mostPreferredModelForResearch ?? "Claude 3.5 Sonnet";

  const pubList = publications || [
    {
      id: "pub-1",
      title: "State of LLM Citation & Knowledge Graphs 2026",
      publishedAt: "2026-09-15",
    },
    {
      id: "pub-2",
      title: "Generative Engine Optimization Benchmarks in High Tech",
      publishedAt: "2026-10-01",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Grid: Latest Digest & Foundation Model Preferences */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Latest Automated Report Card */}
        <Card className="border border-border/60 bg-surface-elevated/40">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-primary" />
                Latest Executive Digest
              </span>
              <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-semibold">
                {latestReport.status}
              </Badge>
            </div>
            <CardTitle className="text-base font-semibold text-foreground mt-1">
              {latestReport.title}
            </CardTitle>
            <CardDescription className="text-xs">
              Automated quarterly AI search and Generative Engine Optimization benchmarks across 42,000+ brands.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="flex items-center justify-between p-3 rounded-lg bg-surface-elevated border border-border/40 text-xs">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Generated Q3 2026</span>
              </div>
              <Button size="sm" variant="outline" className="h-7 text-xs border-border/60 gap-1.5">
                <Download className="w-3.5 h-3.5" />
                Download PDF
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Foundation Model Distribution Preference */}
        <Card className="border border-border/60 bg-surface-elevated/40">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Bot className="w-3.5 h-3.5 text-cyan-400" />
                LLM Industry Preference
              </span>
              <Badge variant="outline" className="text-[10px] border-border/60 text-muted-foreground">
                Consensus Telemetry
              </Badge>
            </div>
            <CardTitle className="text-base font-semibold text-foreground mt-1">
              Cross-Model Citation Engine Bias
            </CardTitle>
            <CardDescription className="text-xs">
              Most preferred foundation models observed across enterprise commercial evaluation queries.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2 space-y-2">
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-surface-elevated border border-border/40 text-xs">
              <span className="text-muted-foreground">Top Commercial / SaaS Model:</span>
              <Badge className="bg-primary/10 text-primary border border-primary/20 font-bold">
                {preferredSaasModel}
              </Badge>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-surface-elevated border border-border/40 text-xs">
              <span className="text-muted-foreground">Top Deep Research Model:</span>
              <Badge className="bg-purple-500/10 text-purple-400 border border-purple-500/20 font-bold">
                {preferredResearchModel}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Search Trend Detection Console */}
      <Card className="border border-border/60 bg-surface-elevated/40">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <div>
              <CardTitle className="text-base font-semibold">
                AI Search Trend & Volatility Detection
              </CardTitle>
              <CardDescription className="text-xs">
                Real-time algorithmic drift tracking emerging semantic themes and depreciating content farm domains.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Emerging Topics */}
          <div>
            <div className="text-xs font-semibold text-foreground flex items-center gap-1.5 mb-2">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              Emerging High-Velocity Search Topics
            </div>
            <div className="flex flex-wrap gap-2">
              {emergingTopics.map((topic, i) => (
                <div
                  key={i}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium"
                >
                  <Sparkles className="w-3 h-3" />
                  {topic}
                </div>
              ))}
            </div>
          </div>

          {/* Declining Domains */}
          <div>
            <div className="text-xs font-semibold text-foreground flex items-center gap-1.5 mb-2">
              <TrendingDown className="w-3.5 h-3.5 text-rose-400" />
              Declining / De-indexed Content Farms
            </div>
            <div className="flex flex-wrap gap-2">
              {decliningDomains.map((dom, i) => (
                <div
                  key={i}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-medium"
                >
                  <TrendingDown className="w-3 h-3" />
                  {dom}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Published Research Whitepapers */}
      <Card className="border border-border/60 bg-surface-elevated/40">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              <div>
                <CardTitle className="text-base font-semibold">
                  Published AI Research Studies & Whitepapers
                </CardTitle>
                <CardDescription className="text-xs">
                  Peer-reviewed Generative Engine Optimization studies and enterprise RAG architecture papers.
                </CardDescription>
              </div>
            </div>
            <Badge variant="outline" className="border-border/60 text-xs text-muted-foreground">
              {pubList.length} Studies Active
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {pubList.map((pub) => (
              <div
                key={pub.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl border border-border/60 bg-surface-elevated/50 hover:bg-surface-elevated transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 border border-primary/20 text-primary shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-foreground text-sm">{pub.title}</div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                      <span>Published: {new Date(pub.publishedAt).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>Dyvin Research Labs</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Button size="sm" variant="ghost" className="h-8 text-xs gap-1.5 hover:text-primary">
                    <ExternalLink className="w-3.5 h-3.5" />
                    Read Study
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
