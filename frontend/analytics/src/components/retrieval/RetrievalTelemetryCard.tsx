import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Activity,
  Search,
  ExternalLink,
  Zap,
  Clock,
  Coins,
  CheckCircle2,
  AlertTriangle,
  XCircle,
} from "lucide-react";
import type { RetrievalOverviewData, RetrievalTimelineItem } from "@/types";

interface SampleRetrievalItem {
  id: string;
  executionId: string;
  domain: string;
  url: string;
  rankPosition: number;
  confidence: number;
  latencyMs: number;
  tokensUsed: number;
  costUsd: number;
  status: "SUCCESS" | "PARTIAL" | "FAILED";
}

interface RetrievalTelemetryCardProps {
  overview?: RetrievalOverviewData;
  timeline?: RetrievalTimelineItem[];
  sampleRetrievals?: SampleRetrievalItem[];
  isLoading?: boolean;
}

export function RetrievalTelemetryCard({
  overview,
  timeline = [],
  sampleRetrievals = [
    {
      id: "ret-1",
      executionId: "exec-rag-001",
      domain: "docs.stripe.com",
      url: "https://docs.stripe.com/billing/subscriptions/overview",
      rankPosition: 1,
      confidence: 0.96,
      latencyMs: 145,
      tokensUsed: 380,
      costUsd: 0.0011,
      status: "SUCCESS",
    },
    {
      id: "ret-2",
      executionId: "exec-rag-001",
      domain: "developer.mozilla.org",
      url: "https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API",
      rankPosition: 2,
      confidence: 0.94,
      latencyMs: 180,
      tokensUsed: 420,
      costUsd: 0.0013,
      status: "SUCCESS",
    },
    {
      id: "ret-3",
      executionId: "exec-rag-002",
      domain: "en.wikipedia.org",
      url: "https://en.wikipedia.org/wiki/Retrieval-augmented_generation",
      rankPosition: 1,
      confidence: 0.98,
      latencyMs: 110,
      tokensUsed: 520,
      costUsd: 0.0015,
      status: "SUCCESS",
    },
    {
      id: "ret-4",
      executionId: "exec-rag-003",
      domain: "github.com",
      url: "https://github.com/langchain-ai/langchain",
      rankPosition: 1,
      confidence: 0.91,
      latencyMs: 230,
      tokensUsed: 610,
      costUsd: 0.0018,
      status: "SUCCESS",
    },
    {
      id: "ret-5",
      executionId: "exec-rag-004",
      domain: "arxiv.org",
      url: "https://arxiv.org/abs/2312.10997",
      rankPosition: 1,
      confidence: 0.95,
      latencyMs: 195,
      tokensUsed: 740,
      costUsd: 0.0022,
      status: "SUCCESS",
    },
  ],
}: RetrievalTelemetryCardProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const filteredRetrievals = useMemo(() => {
    return sampleRetrievals.filter((r) => {
      const matchSearch =
        r.domain.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.executionId.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus = statusFilter === "ALL" || r.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [sampleRetrievals, searchTerm, statusFilter]);

  return (
    <Card className="border border-border/50 bg-card/60 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary" />
              RAG Retrieval Telemetry & Vector Inspection
            </CardTitle>
            <CardDescription className="text-xs">
              Live inspection of indexed semantic vector chunks, latency budgets, and token costs
            </CardDescription>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative w-48 sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="Search domain or URL..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 h-8 text-xs bg-background/50 border-border/60"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-8 rounded-md border border-border/60 bg-background/50 px-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="ALL">All Statuses</option>
              <option value="SUCCESS">Success</option>
              <option value="PARTIAL">Partial</option>
              <option value="FAILED">Failed</option>
            </select>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* Telemetry Summary Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5 p-3 rounded-lg bg-background/40 border border-border/40">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-amber-400" />
            <div>
              <div className="text-xs text-muted-foreground">Avg Latency</div>
              <div className="text-sm font-semibold">{overview?.avgLatencyMs || 172} ms</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Coins className="h-4 w-4 text-purple-400" />
            <div>
              <div className="text-xs text-muted-foreground">Tokens / Pass</div>
              <div className="text-sm font-semibold">{overview?.avgTokensPerRetrieval || 534} tokens</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <div>
              <div className="text-xs text-muted-foreground">Precision Rate</div>
              <div className="text-sm font-semibold">{overview?.successRatePct || 98.5}%</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-blue-400" />
            <div>
              <div className="text-xs text-muted-foreground">Active Reranker</div>
              <div className="text-sm font-semibold">Hybrid BM25+Dense</div>
            </div>
          </div>
        </div>

        {/* Timeline representation */}
        {timeline.length > 0 && (
          <div className="mb-5 p-3 rounded-lg bg-background/30 border border-border/40">
            <div className="text-xs font-medium text-muted-foreground mb-2 flex items-center justify-between">
              <span>Retrieval Volume Timeline</span>
              <span className="text-[11px] text-primary">Live Daily Aggregation</span>
            </div>
            <div className="flex items-end gap-2 h-16 pt-2">
              {timeline.map((item, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1 group">
                  <div
                    className="w-full bg-primary/20 hover:bg-primary/40 rounded-t transition-all relative"
                    style={{ height: `${Math.min(100, Math.max(20, item.retrievals / 2))}%` }}
                  >
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-6 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground text-[10px] px-1.5 py-0.5 rounded shadow pointer-events-none whitespace-nowrap z-10 border border-border">
                      {item.retrievals} runs
                    </div>
                  </div>
                  <span className="text-[10px] text-muted-foreground truncate w-full text-center">
                    {item.date.slice(5)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Retrievals Table */}
        <div className="rounded-lg border border-border/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-muted/40 text-muted-foreground font-medium border-b border-border/50">
                <tr>
                  <th className="py-2.5 px-3">Execution ID</th>
                  <th className="py-2.5 px-3">Apex Domain & URL</th>
                  <th className="py-2.5 px-3">Rank</th>
                  <th className="py-2.5 px-3">Confidence</th>
                  <th className="py-2.5 px-3">Latency</th>
                  <th className="py-2.5 px-3">Tokens / Cost</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {filteredRetrievals.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-muted-foreground">
                      No retrieval operations match your filter.
                    </td>
                  </tr>
                ) : (
                  filteredRetrievals.map((r) => (
                    <tr key={r.id} className="hover:bg-muted/20 transition-colors">
                      <td className="py-2.5 px-3 font-mono text-muted-foreground">
                        {r.executionId}
                      </td>
                      <td className="py-2.5 px-3 max-w-xs">
                        <div className="font-medium text-foreground truncate">{r.domain}</div>
                        <a
                          href={r.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[11px] text-muted-foreground hover:text-primary flex items-center gap-1 truncate"
                        >
                          <span className="truncate">{r.url}</span>
                          <ExternalLink className="h-2.5 w-2.5 shrink-0" />
                        </a>
                      </td>
                      <td className="py-2.5 px-3">
                        <Badge variant="outline" className="text-[11px] font-mono">
                          #{r.rankPosition}
                        </Badge>
                      </td>
                      <td className="py-2.5 px-3 font-medium text-emerald-400">
                        {(r.confidence * 100).toFixed(0)}%
                      </td>
                      <td className="py-2.5 px-3 text-muted-foreground font-mono">
                        {r.latencyMs} ms
                      </td>
                      <td className="py-2.5 px-3 text-muted-foreground font-mono">
                        <div>{r.tokensUsed} tok</div>
                        <div className="text-[10px] text-muted-foreground/70">${r.costUsd.toFixed(4)}</div>
                      </td>
                      <td className="py-2.5 px-3">
                        {r.status === "SUCCESS" ? (
                          <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 bg-emerald-500/10 text-[10px]">
                            Success
                          </Badge>
                        ) : r.status === "PARTIAL" ? (
                          <Badge variant="outline" className="border-amber-500/30 text-amber-400 bg-amber-500/10 text-[10px]">
                            Partial
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="border-rose-500/30 text-rose-400 bg-rose-500/10 text-[10px]">
                            Failed
                          </Badge>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
