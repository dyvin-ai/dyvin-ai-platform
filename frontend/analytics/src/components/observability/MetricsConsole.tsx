import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Terminal, Copy, Check, Search, RefreshCw, Radio } from "lucide-react";
import { toast } from "sonner";

interface MetricsConsoleProps {
  metricsText: string;
  isLoading?: boolean;
  onRefresh?: () => void;
}

export function MetricsConsole({
  metricsText = "",
  isLoading,
  onRefresh,
}: MetricsConsoleProps) {
  const [filterQuery, setFilterQuery] = useState("");
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(metricsText);
    setCopied(true);
    toast.success("Prometheus metrics text copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const lines = metricsText.split("\n");
  const filteredLines = filterQuery.trim()
    ? lines.filter((l) => l.toLowerCase().includes(filterQuery.toLowerCase()))
    : lines;

  if (isLoading) {
    return (
      <Card className="border border-border bg-card p-6 shadow-xs rounded-2xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <Skeleton className="h-6 w-60" />
          <Skeleton className="h-6 w-24" />
        </div>
        <Skeleton className="h-64 rounded-xl" />
      </Card>
    );
  }

  return (
    <Card className="border border-border bg-card rounded-2xl p-6 shadow-xs space-y-5">
      <CardHeader className="p-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <Terminal className="size-5 text-primary shrink-0" />
            <span>Prometheus Metrics Scraper Console</span>
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            Live OpenMetrics / Prometheus exposition stream served at{" "}
            <code className="bg-muted/40 px-1.5 py-0.5 rounded font-mono text-[11px] text-foreground">
              /api/v1/metrics
            </code>{" "}
            for Grafana collectors.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {onRefresh && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              className="h-8 gap-1.5 text-xs border-border"
            >
              <RefreshCw className="size-3.5" />
              <span>Refresh Feed</span>
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className="h-8 gap-1.5 text-xs border-border"
          >
            {copied ? <Check className="size-3.5 text-emerald-500" /> : <Copy className="size-3.5" />}
            <span>{copied ? "Copied" : "Copy Raw"}</span>
          </Button>
          <Badge
            variant="outline"
            className="bg-emerald-500/10 text-emerald-500 border-emerald-500/30 text-[10px] font-mono gap-1"
          >
            <Radio className="size-2.5 animate-pulse" />
            <span>LIVE 200 OK</span>
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-0 space-y-4">
        {/* Metric Prefix Filter */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Filter by metric key (e.g. dyvin_visibility, http_latency, slo_)..."
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-surface border border-border rounded-xl text-xs text-foreground font-mono placeholder:text-muted-foreground focus:outline-hidden focus:ring-1 focus:ring-primary transition-all"
            />
          </div>
          <span className="text-[11px] font-mono text-muted-foreground shrink-0">
            {filteredLines.length} / {lines.length} lines
          </span>
        </div>

        {/* Console Output */}
        <div className="p-4 rounded-xl border border-border bg-[#0d1117] text-[#c9d1d9] font-mono text-xs max-h-[360px] overflow-y-auto custom-scrollbar space-y-0.5">
          {filteredLines.length === 0 ? (
            <div className="text-muted-foreground py-6 text-center">
              No metrics match prefix "{filterQuery}".
            </div>
          ) : (
            filteredLines.map((line, idx) => {
              const isHelp = line.startsWith("# HELP");
              const isType = line.startsWith("# TYPE");
              const isComment = line.startsWith("#");

              if (isHelp) {
                return (
                  <div key={idx} className="text-[#8b949e]">
                    {line}
                  </div>
                );
              }
              if (isType) {
                return (
                  <div key={idx} className="text-[#79c0ff]">
                    {line}
                  </div>
                );
              }
              if (isComment) {
                return (
                  <div key={idx} className="text-[#6e7681]">
                    {line}
                  </div>
                );
              }

              // Normal metric row: split key and value
              const parts = line.split(" ");
              const key = parts[0];
              const val = parts.slice(1).join(" ");

              return (
                <div key={idx} className="flex justify-between hover:bg-white/5 px-1 rounded transition-colors">
                  <span className="text-[#7ee787]">{key}</span>
                  <span className="text-[#ffa657] font-bold">{val}</span>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}
