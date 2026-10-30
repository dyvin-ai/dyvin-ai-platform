import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Filter,
  Trash2,
  TrendingUp,
  SlidersHorizontal,
  Layers,
  ArrowUpDown,
  Tag,
  Sparkles,
} from "lucide-react";
import type { KeywordItem, KeywordIntentType } from "@/types";

interface KeywordDiscoveryTableCardProps {
  keywords: KeywordItem[];
  isLoading?: boolean;
  onDeleteKeyword?: (id: string) => void;
  onAddKeywordClick?: () => void;
}

export function KeywordDiscoveryTableCard({
  keywords,
  isLoading = false,
  onDeleteKeyword,
  onAddKeywordClick,
}: KeywordDiscoveryTableCardProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIntent, setSelectedIntent] = useState<string>("ALL");
  const [sortBy, setSortBy] = useState<"volume" | "opp" | "diff">("opp");

  const filteredKeywords = useMemo(() => {
    return keywords
      .filter((k) => {
        const matchesSearch =
          k.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
          k.normalizedText.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesIntent = selectedIntent === "ALL" || k.intent === selectedIntent;
        return matchesSearch && matchesIntent;
      })
      .sort((a, b) => {
        if (sortBy === "volume") return (b.searchVolume || 0) - (a.searchVolume || 0);
        if (sortBy === "diff") return (a.difficulty || 0) - (b.difficulty || 0);
        return (b.opportunityScore || 0) - (a.opportunityScore || 0);
      });
  }, [keywords, searchTerm, selectedIntent, sortBy]);

  const getIntentBadge = (intent: KeywordIntentType) => {
    switch (intent) {
      case "COMMERCIAL":
        return <Badge variant="outline" className="border-blue-500/40 text-blue-400 bg-blue-500/10">Commercial</Badge>;
      case "TRANSACTIONAL":
        return <Badge variant="outline" className="border-emerald-500/40 text-emerald-400 bg-emerald-500/10">Transactional</Badge>;
      case "COMPARISON":
        return <Badge variant="outline" className="border-purple-500/40 text-purple-400 bg-purple-500/10">Comparison</Badge>;
      case "QUESTION":
        return <Badge variant="outline" className="border-amber-500/40 text-amber-400 bg-amber-500/10">Question</Badge>;
      case "LOCAL":
        return <Badge variant="outline" className="border-cyan-500/40 text-cyan-400 bg-cyan-500/10">Local</Badge>;
      default:
        return <Badge variant="outline" className="border-zinc-500/40 text-zinc-300 bg-zinc-500/10">Informational</Badge>;
    }
  };

  const getDifficultyBadge = (difficulty: number) => {
    if (difficulty < 35) {
      return <span className="text-emerald-400 font-medium">{difficulty}/100 (Easy)</span>;
    }
    if (difficulty < 50) {
      return <span className="text-amber-400 font-medium">{difficulty}/100 (Moderate)</span>;
    }
    return <span className="text-rose-400 font-medium">{difficulty}/100 (Competitive)</span>;
  };

  return (
    <Card className="border border-border/50 bg-card/60 backdrop-blur-sm">
      <CardHeader className="p-6 pb-4 border-b border-border/40">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Search className="w-5 h-5 text-blue-400" />
              Keyword Discovery & Intent Matrix
            </CardTitle>
            <CardDescription className="text-sm mt-0.5">
              Live repository of tracked discovery queries with multi-intent classification and search difficulty metrics.
            </CardDescription>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Filter keywords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 h-9 text-xs bg-background/50 border-border/60"
              />
            </div>

            <div className="flex items-center gap-1 bg-background/40 p-1 rounded-lg border border-border/50 text-xs">
              {["ALL", "COMMERCIAL", "QUESTION", "COMPARISON", "TRANSACTIONAL"].map((intent) => (
                <button
                  key={intent}
                  onClick={() => setSelectedIntent(intent)}
                  className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                    selectedIntent === intent
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {intent === "ALL" ? "All Intents" : intent.charAt(0) + intent.slice(1).toLowerCase()}
                </button>
              ))}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSortBy((prev) => (prev === "opp" ? "volume" : prev === "volume" ? "diff" : "opp"));
              }}
              className="gap-1.5 h-9 text-xs border-border/60"
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
              Sort: {sortBy === "opp" ? "Opportunity" : sortBy === "volume" ? "Volume" : "Difficulty"}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {isLoading ? (
          <div className="p-8 text-center text-sm text-muted-foreground animate-pulse">
            Loading keyword catalog...
          </div>
        ) : filteredKeywords.length === 0 ? (
          <div className="p-8 text-center">
            <Search className="w-8 h-8 text-muted-foreground mx-auto mb-2 opacity-50" />
            <p className="text-sm text-muted-foreground">No keywords match the selected filter criteria.</p>
            {onAddKeywordClick && (
              <Button size="sm" variant="outline" onClick={onAddKeywordClick} className="mt-3 text-xs">
                Add New Discovery Term
              </Button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/30 text-muted-foreground border-b border-border/40 font-medium">
                <tr>
                  <th className="py-3 px-4">Keyword Query</th>
                  <th className="py-3 px-4">Intent</th>
                  <th className="py-3 px-4">Search Volume</th>
                  <th className="py-3 px-4">Difficulty</th>
                  <th className="py-3 px-4">Opportunity Index</th>
                  <th className="py-3 px-4">Source</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {filteredKeywords.map((kw) => (
                  <tr key={kw.id} className="hover:bg-accent/20 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-foreground text-sm flex items-center gap-1.5">
                        {kw.text}
                      </div>
                      <div className="text-[11px] text-muted-foreground mt-0.5">
                        Norm: <code className="text-muted-foreground/80">{kw.normalizedText}</code>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">{getIntentBadge(kw.intent)}</td>
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-foreground">{kw.searchVolume.toLocaleString()} /mo</div>
                      <div className="text-[10px] text-muted-foreground">Global aggregate</div>
                    </td>
                    <td className="py-3.5 px-4">{getDifficultyBadge(kw.difficulty)}</td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-muted/50 rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              kw.opportunityScore > 90
                                ? "bg-emerald-500"
                                : kw.opportunityScore > 80
                                ? "bg-blue-500"
                                : "bg-amber-500"
                            }`}
                            style={{ width: `${Math.min(100, kw.opportunityScore)}%` }}
                          />
                        </div>
                        <span className="font-bold text-foreground text-xs">{kw.opportunityScore}%</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge variant="secondary" className="text-[10px] py-0 font-normal">
                        {kw.source}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {onDeleteKeyword && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onDeleteKeyword(kw.id)}
                          className="h-7 w-7 text-muted-foreground hover:text-rose-400"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
