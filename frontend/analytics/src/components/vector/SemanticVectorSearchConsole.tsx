import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Zap,
  Sparkles,
  Layers,
  FileCode,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  SlidersHorizontal,
  Clock,
  Code2,
} from "lucide-react";
import { vectorIntelligenceService } from "@/services";
import type { VectorSearchResponse } from "@/types";

interface SemanticVectorSearchConsoleProps {
  organizationId?: string;
}

const PRESET_QUERIES = [
  "AI Search Visibility",
  "Generative Engine Optimization",
  "Brand Consistency & Hallucination Mitigation",
  "Multi-LLM Citation Tracking & Attribution",
];

export function SemanticVectorSearchConsole({ organizationId }: SemanticVectorSearchConsoleProps) {
  const [query, setQuery] = useState("AI Search Visibility");
  const [topK, setTopK] = useState<number>(5);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResponse, setSearchResponse] = useState<VectorSearchResponse | null>(null);
  const [expandedJson, setExpandedJson] = useState(false);

  const handleSearch = async (targetQuery?: string) => {
    const q = targetQuery !== undefined ? targetQuery : query;
    if (!q.trim()) return;

    setIsSearching(true);
    try {
      const res = await vectorIntelligenceService.search(q.trim(), organizationId, topK);
      setSearchResponse(res);
    } catch (err) {
      console.error("Vector search failed:", err);
    } finally {
      setIsSearching(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 0.9) return "bg-emerald-500 text-white";
    if (score >= 0.8) return "bg-blue-500 text-white";
    if (score >= 0.7) return "bg-amber-500 text-white";
    return "bg-slate-500 text-white";
  };

  return (
    <Card className="border border-border/60 bg-surface-elevated/40 shadow-xs">
      <CardHeader className="p-4 pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Search className="size-4.5 text-brand" />
              Hybrid Semantic Vector Search Console
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground mt-0.5">
              Execute dense vector cosine similarity queries against high-dimensional indexed document chunks
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground font-mono">Top-K:</span>
            <div className="flex items-center gap-1 bg-surface border border-border/60 rounded-md p-0.5">
              {[3, 5, 10, 20].map((k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => setTopK(k)}
                  className={`px-2 py-0.5 text-xs font-mono rounded ${
                    topK === k
                      ? "bg-brand text-brand-foreground font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {k}
                </button>
              ))}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 pt-0 space-y-4">
        {/* Search Input Bar */}
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 size-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch();
              }}
              placeholder="Enter semantic search query or prompt concept..."
              className="pl-9 h-10 text-sm bg-surface"
            />
          </div>
          <Button
            onClick={() => handleSearch()}
            disabled={isSearching || !query.trim()}
            className="h-10 px-5 gap-2 shrink-0 font-medium cursor-pointer"
          >
            {isSearching ? (
              <>
                <Clock className="size-4 animate-spin" />
                Executing...
              </>
            ) : (
              <>
                <Zap className="size-4" />
                Search Vectors
              </>
            )}
          </Button>
        </div>

        {/* Suggested Queries */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-muted-foreground font-mono text-[11px] mr-1">Presets:</span>
          {PRESET_QUERIES.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => {
                setQuery(preset);
                handleSearch(preset);
              }}
              className="px-2 py-1 rounded bg-surface border border-border/60 text-muted-foreground hover:text-foreground hover:border-brand/40 text-[11px] transition-colors cursor-pointer"
            >
              {preset}
            </button>
          ))}
        </div>

        {/* Search Results Area */}
        {searchResponse && (
          <div className="space-y-3 pt-2 border-t border-border/50">
            {/* Meta bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs bg-surface/50 p-2.5 rounded-lg border border-border/50 font-mono">
              <div className="flex items-center gap-3">
                <span className="text-muted-foreground">Query: <strong className="text-foreground">"{searchResponse.query}"</strong></span>
                <span className="text-muted-foreground">Results: <strong className="text-foreground">{searchResponse.results.length}</strong></span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-emerald-500 font-semibold flex items-center gap-1">
                  <Clock className="size-3" />
                  {searchResponse.executionMs} ms latency
                </span>
                <button
                  type="button"
                  onClick={() => setExpandedJson(!expandedJson)}
                  className="flex items-center gap-1 text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  <Code2 className="size-3" />
                  {expandedJson ? "Hide JSON" : "Inspect JSON"}
                  {expandedJson ? <ChevronUp className="size-3" /> : <ChevronDown className="size-3" />}
                </button>
              </div>
            </div>

            {/* Collapsible Raw JSON */}
            {expandedJson && (
              <div className="bg-surface-elevated/80 border border-border/60 rounded-md p-3 font-mono text-[11px] text-muted-foreground overflow-x-auto max-h-60 custom-scrollbar">
                <pre>{JSON.stringify(searchResponse, null, 2)}</pre>
              </div>
            )}

            {/* Results List */}
            <div className="space-y-2.5">
              {searchResponse.results.length === 0 ? (
                <div className="p-6 text-center text-muted-foreground text-xs">
                  No matching vector chunks met the cosine similarity threshold.
                </div>
              ) : (
                searchResponse.results.map((result, idx) => {
                  const pct = Math.round(result.similarityScore * 100);
                  return (
                    <div
                      key={result.id || idx}
                      className="p-3 rounded-lg border border-border/60 bg-surface/60 hover:bg-surface-elevated/60 transition-all space-y-2"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <Badge variant="outline" className="text-[10px] font-mono bg-surface shrink-0">
                            {result.id}
                          </Badge>
                          <span className="text-[11px] text-muted-foreground font-mono truncate">
                            Doc: {result.documentId}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <div className="w-24 bg-surface rounded-full h-2 overflow-hidden border border-border/40 hidden sm:block">
                            <div
                              className="h-full bg-emerald-500 transition-all duration-300"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <Badge className={`text-[10px] font-mono ${getScoreColor(result.similarityScore)}`}>
                            {(result.similarityScore * 100).toFixed(1)}% Match
                          </Badge>
                        </div>
                      </div>
                      <p className="text-xs text-foreground leading-relaxed pl-1 border-l-2 border-brand/50">
                        {result.content}
                      </p>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
