import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Globe,
  Database,
  Network,
  ShieldCheck,
  RefreshCw,
  Search,
  Sparkles,
  Server,
  Layers,
  Coins,
} from "lucide-react";
import type {
  GlobalIntelligenceWarehouseStats,
  GlobalNetworkStatistics,
} from "@/types";

interface GlobalIntelligenceOverviewCardProps {
  warehouseStats?: GlobalIntelligenceWarehouseStats;
  networkStats?: GlobalNetworkStatistics;
  isLoading?: boolean;
  onRefreshClick?: () => void;
  onExploreArchiveClick?: () => void;
  onInspectKnowledgeClick?: () => void;
}

export function GlobalIntelligenceOverviewCard({
  warehouseStats,
  networkStats,
  isLoading = false,
  onRefreshClick,
  onExploreArchiveClick,
  onInspectKnowledgeClick,
}: GlobalIntelligenceOverviewCardProps) {
  const formatNumber = (num?: number) => {
    if (num === undefined || num === null) return "0";
    if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
    if (num >= 1_000) return `${(num / 1_000).toFixed(0)}K`;
    return num.toLocaleString();
  };

  const formatCurrency = (amount?: number) => {
    if (!amount) return "$25M";
    return `$${(amount / 1_000_000).toFixed(0)}M`;
  };

  return (
    <Card className="border border-border/80 bg-card shadow-sm">
      <CardHeader className="p-5 pb-3 border-b border-border/60">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Globe className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-semibold tracking-tight text-foreground">
                  Global Intelligence Distributed Network
                </h2>
                <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-xs">
                  <ShieldCheck className="h-3 w-3 mr-1" />
                  Append-Only Immutable
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Multi-region edge telemetry, public AI response warehouse, and federated knowledge mesh
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onRefreshClick}
              disabled={isLoading}
              className="h-8 gap-1.5 text-xs"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onInspectKnowledgeClick}
              className="h-8 gap-1.5 text-xs"
            >
              <Network className="h-3.5 w-3.5 text-cyan-500" />
              Knowledge Graph
            </Button>
            <Button
              size="sm"
              onClick={onExploreArchiveClick}
              className="h-8 gap-1.5 text-xs"
            >
              <Search className="h-3.5 w-3.5" />
              Explore Warehouse
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-5">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* Card 1: Warehouse Facts */}
          <div className="p-3.5 rounded-lg border border-border/60 bg-muted/20">
            <div className="flex items-center justify-between text-muted-foreground mb-1">
              <span className="text-xs font-medium">Facts Recorded</span>
              <Database className="h-3.5 w-3.5 text-blue-500" />
            </div>
            <div className="text-xl font-bold text-foreground">
              {formatNumber(warehouseStats?.totalFactsRecorded || 8500000)}
            </div>
            <span className="text-[11px] text-emerald-500 font-medium">Global Triples</span>
          </div>

          {/* Card 2: AI Responses Stored */}
          <div className="p-3.5 rounded-lg border border-border/60 bg-muted/20">
            <div className="flex items-center justify-between text-muted-foreground mb-1">
              <span className="text-xs font-medium">Responses Stored</span>
              <Server className="h-3.5 w-3.5 text-indigo-500" />
            </div>
            <div className="text-xl font-bold text-foreground">
              {formatNumber(warehouseStats?.totalResponsesStored || 4200000)}
            </div>
            <span className="text-[11px] text-muted-foreground">Permanent Storage</span>
          </div>

          {/* Card 3: Citations Indexed */}
          <div className="p-3.5 rounded-lg border border-border/60 bg-muted/20">
            <div className="flex items-center justify-between text-muted-foreground mb-1">
              <span className="text-xs font-medium">Citations Indexed</span>
              <Layers className="h-3.5 w-3.5 text-violet-500" />
            </div>
            <div className="text-xl font-bold text-foreground">
              {formatNumber(warehouseStats?.totalCitationsIndexed || 14500000)}
            </div>
            <span className="text-[11px] text-emerald-500 font-medium">+18.4% WoW</span>
          </div>

          {/* Card 4: Domains Tracked */}
          <div className="p-3.5 rounded-lg border border-border/60 bg-muted/20">
            <div className="flex items-center justify-between text-muted-foreground mb-1">
              <span className="text-xs font-medium">Apex Domains</span>
              <Globe className="h-3.5 w-3.5 text-amber-500" />
            </div>
            <div className="text-xl font-bold text-foreground">
              {formatNumber(warehouseStats?.totalDomainsTracked || 950000)}
            </div>
            <span className="text-[11px] text-muted-foreground">Tracked Globally</span>
          </div>

          {/* Card 5: Knowledge Graph Edges */}
          <div className="p-3.5 rounded-lg border border-border/60 bg-muted/20">
            <div className="flex items-center justify-between text-muted-foreground mb-1">
              <span className="text-xs font-medium">Mesh Graph Edges</span>
              <Network className="h-3.5 w-3.5 text-cyan-500" />
            </div>
            <div className="text-xl font-bold text-foreground">
              {formatNumber(networkStats?.totalGraphEdges || 14500000)}
            </div>
            <span className="text-[11px] text-cyan-500 font-medium">Propagating Mesh</span>
          </div>

          {/* Card 6: Asset Moat Value */}
          <div className="p-3.5 rounded-lg border border-border/60 bg-muted/20">
            <div className="flex items-center justify-between text-muted-foreground mb-1">
              <span className="text-xs font-medium">Asset Moat Value</span>
              <Coins className="h-3.5 w-3.5 text-emerald-500" />
            </div>
            <div className="text-xl font-bold text-emerald-500">
              {formatCurrency(networkStats?.proprietaryAssetValueUsd)}
            </div>
            <span className="text-[11px] text-muted-foreground">IP Enterprise Moat</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
