import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Brain,
  Copy,
  Check,
  Search,
  Lock,
  Layers,
  Sparkles,
} from "lucide-react";
import type { CustomerMemoryItem } from "@/types";

interface CustomerMemoryVaultTableProps {
  memories: CustomerMemoryItem[];
  isLoading?: boolean;
}

export function CustomerMemoryVaultTable({
  memories,
  isLoading,
}: CustomerMemoryVaultTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const filteredMemories = memories.filter((m) => {
    return (
      m.memoryType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.memoryPayload.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const getMemoryBadge = (type: string) => {
    switch (type) {
      case "STRATEGY_MEMORY":
        return <Badge className="bg-purple-500/10 text-purple-400 border border-purple-500/20 text-xs">STRATEGY</Badge>;
      case "BRAND_SYNTAX_MEMORY":
        return <Badge className="bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs">BRAND SYNTAX</Badge>;
      case "GEO_DOMAIN_AUTHORITY_MEMORY":
        return <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs">DOMAIN AUTHORITY</Badge>;
      case "RETRIEVAL_PREFERENCE_MEMORY":
        return <Badge className="bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs">RETRIEVAL PREFERENCE</Badge>;
      default:
        return <Badge variant="outline" className="text-xs">{type}</Badge>;
    }
  };

  return (
    <Card className="border border-border/60 bg-surface-elevated/40 backdrop-blur-sm">
      <CardHeader className="pb-4 border-b border-border/40">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Brain className="w-4 h-4 text-purple-400" />
              Tenant Customer Memory Vault
            </CardTitle>
            <CardDescription className="text-xs">
              Tenant-partitioned episodic, semantic, and strategic working memories guiding autonomous agents and optimization.
            </CardDescription>
          </div>

          <div className="relative w-48 sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Search memory vault..."
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
                <th className="py-3 px-4">Memory Type</th>
                <th className="py-3 px-4">Memory Payload Context</th>
                <th className="py-3 px-4">Organization</th>
                <th className="py-3 px-4">Last Updated</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {filteredMemories.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-muted-foreground">
                    No memories found matching query.
                  </td>
                </tr>
              ) : (
                filteredMemories.map((mem) => (
                  <tr key={mem.id} className="hover:bg-surface/30 transition-colors">
                    <td className="py-3.5 px-4">
                      {getMemoryBadge(mem.memoryType)}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-foreground/90 max-w-md">
                      {mem.memoryPayload}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-muted-foreground">
                      {mem.organizationId}
                    </td>
                    <td className="py-3.5 px-4 text-muted-foreground">
                      {mem.updatedAt ? new Date(mem.updatedAt).toLocaleDateString() : "Active"}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleCopy(mem.id, mem.memoryPayload)}
                        className="h-7 text-xs gap-1 text-muted-foreground hover:text-foreground"
                      >
                        {copiedId === mem.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy</span>
                          </>
                        )}
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
  );
}
