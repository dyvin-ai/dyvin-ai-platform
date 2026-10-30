import React, { useState, useMemo } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  FileSpreadsheet,
  Upload,
  Search,
  Hash,
  TrendingUp,
  Sparkles,
  Layers,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { aiSearchIntelligenceService } from "@/services";
import type { GeoKeywordAnalytics } from "@/types";

interface GeoKeywordClusteringConsoleProps {
  keywordData?: GeoKeywordAnalytics | null;
  isLoading?: boolean;
  onRefresh?: () => void;
}

const DEFAULT_KEYWORDS = [
  { keyword: "generative engine optimization", volume: 14200, difficulty: "High", geoRank: 1 },
  { keyword: "ai search visibility tool", volume: 9800, difficulty: "Medium", geoRank: 1 },
  { keyword: "llm citation tracking platform", volume: 6400, difficulty: "Medium", geoRank: 2 },
  { keyword: "chatgpt brand monitoring", volume: 18500, difficulty: "High", geoRank: 2 },
  { keyword: "perplexity search optimization", volume: 5200, difficulty: "Low", geoRank: 1 },
  { keyword: "multi-model citation attribution", volume: 4100, difficulty: "Low", geoRank: 1 },
  { keyword: "ai knowledge graph seo", volume: 7300, difficulty: "Medium", geoRank: 2 },
];

export function GeoKeywordClusteringConsole({
  keywordData,
  isLoading,
  onRefresh,
}: GeoKeywordClusteringConsoleProps) {
  const [searchFilter, setSearchFilter] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const keywordsList = keywordData?.keywordList || DEFAULT_KEYWORDS;

  const filtered = useMemo(() => {
    if (!searchFilter.trim()) return keywordsList;
    const q = searchFilter.toLowerCase();
    return keywordsList.filter((k) => k.keyword.toLowerCase().includes(q));
  }, [keywordsList, searchFilter]);

  const handleUploadCsv = async () => {
    setIsUploading(true);
    try {
      const res = await aiSearchIntelligenceService.uploadKeywords("geo_enterprise_keywords_q4.csv", 1500);
      toast.success(`Successfully uploaded and clustered ${res.keywordsCount ?? 1500} keywords`);
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error("Failed to upload keywords CSV:", err);
      toast.error("Failed to upload keywords CSV");
    } finally {
      setIsUploading(false);
    }
  };

  if (isLoading) {
    return (
      <Card className="border border-border/60 bg-surface-elevated/40">
        <CardHeader className="p-4">
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent className="p-4 pt-0 space-y-3">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-40 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-border/60 bg-surface-elevated/40 shadow-xs">
      <CardHeader className="p-4 pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <FileSpreadsheet className="size-4.5 text-amber-500" />
              Keyword 2.0 Semantic Clustering
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground mt-0.5">
              High-intent generative search query clusters, search volume, and localized retrieval rankings
            </CardDescription>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleUploadCsv}
              disabled={isUploading}
              className="h-8 gap-1.5 text-xs font-medium cursor-pointer"
            >
              {isUploading ? (
                <>
                  <Clock className="size-3.5 animate-spin" />
                  Clustering...
                </>
              ) : (
                <>
                  <Upload className="size-3.5" />
                  Upload Keywords CSV
                </>
              )}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 pt-0 space-y-4">
        {/* KPI Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3 rounded-lg border border-border/60 bg-surface/60 space-y-1">
            <p className="text-xs text-muted-foreground font-mono">Total Tracked Keywords</p>
            <p className="text-2xl font-bold font-display text-foreground">
              {(keywordData?.totalKeywordsTracked ?? 1500).toLocaleString()}
            </p>
          </div>

          <div className="p-3 rounded-lg border border-border/60 bg-surface/60 space-y-1">
            <p className="text-xs text-muted-foreground font-mono">Semantic Clusters</p>
            <p className="text-2xl font-bold font-display text-amber-500">
              {keywordData?.clustersCount ?? 12} Clusters
            </p>
          </div>

          <div className="p-3 rounded-lg border border-border/60 bg-surface/60 space-y-1">
            <p className="text-xs text-muted-foreground font-mono">Top Impact Query</p>
            <p className="text-xs font-semibold text-foreground truncate mt-2">
              {keywordData?.topKeyword ?? "Generative Engine Optimization"}
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 size-3.5 text-muted-foreground" />
          <Input
            placeholder="Search keyword clusters..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="pl-8 h-8 text-xs bg-surface"
          />
        </div>

        {/* Keywords Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-border/60 text-muted-foreground font-mono text-[11px] uppercase tracking-wider bg-surface/50">
                <th className="py-2.5 px-3 font-semibold">Keyword Phrase</th>
                <th className="py-2.5 px-3 font-semibold">Monthly Search Volume</th>
                <th className="py-2.5 px-3 font-semibold">Engine Competition</th>
                <th className="py-2.5 px-3 font-semibold text-right">GEO Rank</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-muted-foreground">
                    No keywords match your search query.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item.keyword} className="hover:bg-surface-subtle/50 transition-colors">
                    <td className="py-3 px-3">
                      <div className="font-semibold text-foreground flex items-center gap-2">
                        <Hash className="size-3.5 text-muted-foreground" />
                        <span>{item.keyword}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 font-mono text-foreground">
                      {item.volume.toLocaleString()} searches
                    </td>
                    <td className="py-3 px-3 font-mono">
                      <Badge
                        variant="secondary"
                        className={`text-[10px] font-mono ${
                          item.difficulty === "High"
                            ? "text-rose-500 bg-rose-500/10"
                            : item.difficulty === "Medium"
                            ? "text-amber-500 bg-amber-500/10"
                            : "text-emerald-500 bg-emerald-500/10"
                        }`}
                      >
                        {item.difficulty} Competition
                      </Badge>
                    </td>
                    <td className="py-3 px-3 text-right font-mono">
                      <Badge
                        className={`text-[10px] font-mono ${
                          item.geoRank === 1
                            ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/30"
                            : "bg-blue-500/10 text-blue-600 border border-blue-500/30"
                        }`}
                      >
                        Rank #{item.geoRank}
                      </Badge>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
