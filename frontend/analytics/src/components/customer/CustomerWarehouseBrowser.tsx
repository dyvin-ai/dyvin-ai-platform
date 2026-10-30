import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Database,
  FileCode,
  Search,
  Server,
  Layers,
  Sparkles,
  Lock,
} from "lucide-react";
import type { CustomerWarehouseItem } from "@/types";

interface CustomerWarehouseBrowserProps {
  warehouseItems: CustomerWarehouseItem[];
  isLoading?: boolean;
}

export function CustomerWarehouseBrowser({
  warehouseItems,
  isLoading,
}: CustomerWarehouseBrowserProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAsset, setSelectedAsset] = useState<CustomerWarehouseItem | null>(null);

  if (isLoading) {
    return (
      <Card className="border border-border/60 bg-surface-elevated/40">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="h-6 w-48 bg-muted rounded animate-pulse" />
            <div className="h-20 w-full bg-muted/60 rounded animate-pulse" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const filteredAssets = warehouseItems.filter((item) => {
    return (
      item.assetType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.assetData.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const getAssetBadge = (type: string) => {
    switch (type) {
      case "RESEARCH_REPORT":
        return <Badge className="bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs">RESEARCH REPORT</Badge>;
      case "VISIBILITY_SNAPSHOT":
        return <Badge className="bg-purple-500/10 text-purple-400 border border-purple-500/20 text-xs">VISIBILITY SNAPSHOT</Badge>;
      case "GEO_CITATIONS_LEDGER":
        return <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs">CITATIONS LEDGER</Badge>;
      case "COMPETITOR_BENCHMARK":
        return <Badge className="bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs">COMPETITOR BENCHMARK</Badge>;
      default:
        return <Badge variant="outline" className="text-xs">{type}</Badge>;
    }
  };

  const formatJson = (data: string) => {
    try {
      return JSON.stringify(JSON.parse(data), null, 2);
    } catch {
      return data;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Assets Table */}
      <Card className="border border-border/60 bg-surface-elevated/40 backdrop-blur-sm lg:col-span-2">
        <CardHeader className="pb-4 border-b border-border/40">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Database className="w-4 h-4 text-blue-400" />
                Append-Only Tenant Intelligence Warehouse
              </CardTitle>
              <CardDescription className="text-xs">
                Permanent, immutable storage recording prompts, responses, visibility audits, and research reports.
              </CardDescription>
            </div>

            <div className="relative w-48 sm:w-60">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="Search warehouse..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 h-8 text-xs bg-surface/50 border-border/60"
              />
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-border/50 bg-surface/40 text-muted-foreground font-medium">
                  <th className="py-3 px-4">Asset Type</th>
                  <th className="py-3 px-4">Organization</th>
                  <th className="py-3 px-4">Recorded Date</th>
                  <th className="py-3 px-4 text-right">Inspect Payload</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {filteredAssets.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-muted-foreground">
                      No warehouse assets found matching criteria.
                    </td>
                  </tr>
                ) : (
                  filteredAssets.map((asset) => (
                    <tr
                      key={asset.id}
                      onClick={() => setSelectedAsset(asset)}
                      className={`hover:bg-surface/30 cursor-pointer transition-colors ${
                        selectedAsset?.id === asset.id ? "bg-surface/50 font-medium" : ""
                      }`}
                    >
                      <td className="py-3.5 px-4">
                        {getAssetBadge(asset.assetType)}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-muted-foreground">
                        {asset.organizationId}
                      </td>
                      <td className="py-3.5 px-4 text-muted-foreground">
                        {asset.recordedAt ? new Date(asset.recordedAt).toLocaleString() : "Recorded"}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedAsset(asset);
                          }}
                          className="h-7 text-xs gap-1 border border-border/40 hover:bg-surface-elevated"
                        >
                          <FileCode className="w-3.5 h-3.5 text-blue-400" />
                          View
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Payload Inspector Drawer */}
      <Card className="border border-border/60 bg-surface-elevated/40 backdrop-blur-sm lg:col-span-1">
        <CardHeader className="pb-3 border-b border-border/40">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <FileCode className="w-4 h-4 text-emerald-400" />
            Asset Payload Inspector
          </CardTitle>
          <CardDescription className="text-xs">
            {selectedAsset ? `Asset ID: ${selectedAsset.id.substring(0, 16)}...` : "Select an asset to view raw payload"}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4">
          {selectedAsset ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Type:</span>
                {getAssetBadge(selectedAsset.assetType)}
              </div>
              <div className="p-3 rounded-lg bg-surface/80 border border-border/60 overflow-x-auto">
                <pre className="text-[11px] font-mono text-foreground leading-relaxed">
                  {formatJson(selectedAsset.assetData)}
                </pre>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Cryptographically sealed in append-only storage.
              </p>
            </div>
          ) : (
            <div className="py-16 text-center text-muted-foreground text-xs">
              <Database className="w-8 h-8 mx-auto mb-2 opacity-40" />
              Select an intelligence asset from the left table to inspect its payload schema.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
