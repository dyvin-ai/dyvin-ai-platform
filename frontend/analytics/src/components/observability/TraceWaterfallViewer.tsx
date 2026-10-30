import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Network, Search, ChevronRight, ChevronDown, CheckCircle2, AlertTriangle, Layers, Clock } from "lucide-react";
import type { DistributedTraceWaterfall, DistributedTraceSpan } from "@/types";

interface TraceWaterfallViewerProps {
  traces: DistributedTraceWaterfall[];
  isLoading?: boolean;
}

export function TraceWaterfallViewer({
  traces = [],
  isLoading,
}: TraceWaterfallViewerProps) {
  const [selectedTraceId, setSelectedTraceId] = useState<string>(traces[0]?.traceId || "");
  const [selectedSpan, setSelectedSpan] = useState<DistributedTraceSpan | null>(null);

  const activeTrace = traces.find((t) => t.traceId === selectedTraceId) || traces[0];

  if (isLoading) {
    return (
      <Card className="border border-border bg-card p-6 shadow-xs rounded-2xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <Skeleton className="h-6 w-64" />
          <Skeleton className="h-6 w-28" />
        </div>
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-14 rounded-xl" />
          ))}
        </div>
      </Card>
    );
  }

  if (!activeTrace) {
    return (
      <Card className="border border-border bg-card rounded-2xl p-6 shadow-xs text-center text-xs text-muted-foreground">
        No active OpenTelemetry distributed traces available.
      </Card>
    );
  }

  return (
    <Card className="border border-border bg-card rounded-2xl p-6 shadow-xs space-y-5">
      <CardHeader className="p-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <Network className="size-5 text-primary shrink-0" />
            <span>OpenTelemetry Distributed Tracing Waterfall</span>
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            End-to-end execution breakdown across API gateways, vector indexes, databases, and multi-model LLM calls.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {traces.map((t) => (
            <Button
              key={t.traceId}
              variant={t.traceId === activeTrace.traceId ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setSelectedTraceId(t.traceId);
                setSelectedSpan(null);
              }}
              className="h-8 text-xs font-mono"
            >
              {t.operationName.split(" ")[0]} ({t.totalDurationMs}ms)
            </Button>
          ))}
        </div>
      </CardHeader>

      <CardContent className="p-0 space-y-5">
        {/* Trace Overview Header */}
        <div className="p-4 rounded-xl border border-border bg-muted/15 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <code className="font-mono text-primary font-bold">{activeTrace.traceId}</code>
            <span className="font-semibold text-foreground">{activeTrace.operationName}</span>
            <Badge
              variant="outline"
              className="bg-emerald-500/10 text-emerald-500 border-emerald-500/30 text-[10px] font-mono"
            >
              {activeTrace.status}
            </Badge>
          </div>
          <div className="flex items-center gap-4 text-muted-foreground font-mono text-[11px]">
            <span>Total: <strong className="text-foreground">{activeTrace.totalDurationMs}ms</strong></span>
            <span>Spans: <strong className="text-foreground">{activeTrace.spansCount}</strong></span>
            <span>Service: <strong className="text-foreground">{activeTrace.rootService}</strong></span>
          </div>
        </div>

        {/* Spans Waterfall */}
        <div className="space-y-2 border border-border rounded-xl p-3 bg-surface">
          <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-muted-foreground border-b border-border pb-2 px-2">
            <span>Service & Span Hierarchy</span>
            <span>Timeline / Relative Duration</span>
          </div>

          <div className="space-y-1.5 pt-1">
            {activeTrace.spans.map((span) => {
              const startPercent = (span.startTimeMs / activeTrace.totalDurationMs) * 100;
              const widthPercent = Math.max(2, (span.durationMs / activeTrace.totalDurationMs) * 100);
              const isSelected = selectedSpan?.id === span.id;

              return (
                <div
                  key={span.id}
                  onClick={() => setSelectedSpan(isSelected ? null : span)}
                  className={`p-2.5 rounded-lg border transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs ${
                    isSelected
                      ? "border-primary bg-primary/5 shadow-xs"
                      : "border-border/60 hover:border-border hover:bg-muted/10"
                  }`}
                >
                  {/* Span Info */}
                  <div className="flex items-center gap-2.5 min-w-0 md:w-1/2">
                    <span
                      className="size-2 rounded-full shrink-0"
                      style={{
                        backgroundColor:
                          span.service.includes("openai") || span.service.includes("anthropic")
                            ? "#8b5cf6"
                            : span.service.includes("postgres") || span.service.includes("db")
                            ? "#3b82f6"
                            : span.service.includes("redis")
                            ? "#ef4444"
                            : "#10b981",
                      }}
                    />
                    <Badge variant="secondary" className="text-[10px] font-mono shrink-0">
                      {span.service}
                    </Badge>
                    <span className="font-mono text-xs text-foreground truncate">{span.name}</span>
                  </div>

                  {/* Waterfall Bar */}
                  <div className="flex items-center gap-3 md:w-1/2 justify-end">
                    <div className="relative w-full max-w-[220px] h-3 bg-muted/40 rounded-full overflow-hidden">
                      <div
                        className="absolute h-full rounded-full transition-all"
                        style={{
                          left: `${startPercent}%`,
                          width: `${widthPercent}%`,
                          backgroundColor:
                            span.service.includes("openai") || span.service.includes("anthropic")
                              ? "#8b5cf6"
                              : span.service.includes("postgres")
                              ? "#3b82f6"
                              : span.service.includes("redis")
                              ? "#ef4444"
                              : "#10b981",
                        }}
                      />
                    </div>
                    <span className="text-[11px] font-mono text-muted-foreground w-14 text-right shrink-0">
                      {span.durationMs}ms
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Span Metadata Inspector */}
        {selectedSpan && (
          <div className="p-4 rounded-xl border border-primary/30 bg-primary/5 space-y-2 text-xs">
            <div className="flex items-center justify-between border-b border-primary/20 pb-2">
              <span className="font-bold text-foreground flex items-center gap-2">
                <Layers className="size-4 text-primary" />
                <span>Span Attributes: {selectedSpan.name}</span>
              </span>
              <button
                type="button"
                onClick={() => setSelectedSpan(null)}
                className="text-muted-foreground hover:text-foreground text-xs"
              >
                ✕ Close
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 font-mono text-[11px] pt-1">
              <div>
                <span className="text-muted-foreground block">Span ID:</span>
                <span className="text-foreground">{selectedSpan.id}</span>
              </div>
              <div>
                <span className="text-muted-foreground block">Kind:</span>
                <span className="text-foreground">{selectedSpan.kind}</span>
              </div>
              <div>
                <span className="text-muted-foreground block">Status:</span>
                <span className="text-emerald-500 font-bold">{selectedSpan.status}</span>
              </div>
              {Object.entries(selectedSpan.attributes).map(([key, value]) => (
                <div key={key}>
                  <span className="text-muted-foreground block">{key}:</span>
                  <span className="text-foreground truncate">{String(value)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
