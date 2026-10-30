import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Globe2,
  Activity,
  Zap,
  Server,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import type { MultiRegionLatencyItem } from "@/types";

interface MultiRegionLatencyMapCardProps {
  telemetry?: MultiRegionLatencyItem[];
  isLoading?: boolean;
}

export function MultiRegionLatencyMapCard({
  telemetry = [],
  isLoading = false,
}: MultiRegionLatencyMapCardProps) {
  const defaultRegions: MultiRegionLatencyItem[] = [
    { region: "us-east-1", location: "N. Virginia (Primary Core)", status: "ONLINE", latencyMs: 12.4, throughputRps: 1840, nodeCount: 16 },
    { region: "us-west-2", location: "Oregon (Pacific Hub)", status: "ONLINE", latencyMs: 24.1, throughputRps: 1250, nodeCount: 12 },
    { region: "eu-central-1", location: "Frankfurt (EMEA Core)", status: "ONLINE", latencyMs: 38.6, throughputRps: 1420, nodeCount: 12 },
    { region: "ap-southeast-1", location: "Singapore (APAC Gateway)", status: "ONLINE", latencyMs: 52.8, throughputRps: 890, nodeCount: 8 },
  ];

  const regions = telemetry.length > 0 ? telemetry : defaultRegions;

  const getLatencyColor = (latency: number) => {
    if (latency < 25) return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
    if (latency < 45) return "text-cyan-500 bg-cyan-500/10 border-cyan-500/20";
    return "text-amber-500 bg-amber-500/10 border-amber-500/20";
  };

  const totalNodes = regions.reduce((acc, r) => acc + r.nodeCount, 0);
  const totalRps = regions.reduce((acc, r) => acc + r.throughputRps, 0);
  const avgLatency = (regions.reduce((acc, r) => acc + r.latencyMs, 0) / regions.length).toFixed(1);

  return (
    <Card className="border border-border/80 bg-card shadow-sm">
      <CardHeader className="p-5 pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <Globe2 className="h-5 w-5 text-cyan-500" />
              <CardTitle className="text-base font-semibold text-foreground">
                Multi-Region Distributed Edge Telemetry
              </CardTitle>
            </div>
            <CardDescription className="text-xs text-muted-foreground mt-0.5">
              Live p99 latency, ingress throughput, and distributed node health across global edge partitions
            </CardDescription>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-xs">
              <CheckCircle2 className="h-3 w-3 mr-1" />
              {totalNodes} Edge Nodes Active
            </Badge>
            <Badge variant="secondary" className="text-xs">
              <Zap className="h-3 w-3 mr-1 text-amber-500" />
              {totalRps.toLocaleString()} RPS Mesh Load
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-5 pt-3">
        {/* Latency summary banner */}
        <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-3 p-3.5 rounded-lg border border-border/60 bg-muted/20 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Global Mean Latency:</span>
            <span className="font-semibold text-foreground">{avgLatency} ms</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Consensus Verification:</span>
            <span className="font-semibold text-emerald-500">Append-Only Raft</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Edge Synchronization:</span>
            <span className="font-semibold text-foreground">Sub-50ms Delta</span>
          </div>
        </div>

        {/* Region node cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {regions.map((region) => (
            <div
              key={region.region}
              className="p-3.5 rounded-lg border border-border/60 bg-card hover:bg-muted/10 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="text-xs font-semibold text-foreground">{region.region}</div>
                  <div className="text-[11px] text-muted-foreground">{region.location}</div>
                </div>
                <Badge
                  variant="outline"
                  className={`text-[10px] font-medium ${
                    region.status === "ONLINE"
                      ? "text-emerald-500 bg-emerald-500/10 border-emerald-500/20"
                      : "text-amber-500 bg-amber-500/10 border-amber-500/20"
                  }`}
                >
                  {region.status}
                </Badge>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-border/40 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-[11px]">Round-Trip Latency:</span>
                  <Badge variant="outline" className={`text-[11px] font-mono px-1.5 py-0 ${getLatencyColor(region.latencyMs)}`}>
                    {region.latencyMs} ms
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-[11px]">Throughput:</span>
                  <span className="font-medium text-foreground">{region.throughputRps.toLocaleString()} rps</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-[11px]">Edge Partitions:</span>
                  <span className="font-medium text-foreground">{region.nodeCount} nodes</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
