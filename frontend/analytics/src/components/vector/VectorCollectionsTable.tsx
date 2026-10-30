import React, { useState, useMemo } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  FolderArchive,
  Search,
  Layers,
  FileText,
  Calendar,
  Building,
  Hash,
  Database,
} from "lucide-react";
import type { VectorCollectionItem } from "@/types";

interface VectorCollectionsTableProps {
  collections?: VectorCollectionItem[];
  isLoading?: boolean;
}

export function VectorCollectionsTable({
  collections = [],
  isLoading,
}: VectorCollectionsTableProps) {
  const [searchFilter, setSearchFilter] = useState("");

  const filteredCollections = useMemo(() => {
    if (!searchFilter.trim()) return collections;
    const q = searchFilter.toLowerCase();
    return collections.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        (c.description && c.description.toLowerCase().includes(q)) ||
        c.id.toLowerCase().includes(q)
    );
  }, [collections, searchFilter]);

  if (isLoading) {
    return (
      <Card className="border border-border/60 bg-surface-elevated/40">
        <CardHeader className="p-4">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-72" />
        </CardHeader>
        <CardContent className="p-4 pt-0 space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-md" />
          ))}
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
              <FolderArchive className="size-4.5 text-blue-500" />
              Vector Collections & Knowledge Partitions
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground mt-0.5">
              Isolated enterprise semantic partitions with dedicated dense vector embeddings
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 size-3.5 text-muted-foreground" />
              <Input
                placeholder="Search collections..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="pl-8 h-8 text-xs bg-surface"
              />
            </div>
            <Badge variant="outline" className="text-xs font-mono shrink-0">
              {filteredCollections.length} {filteredCollections.length === 1 ? "Collection" : "Collections"}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 pt-0">
        {filteredCollections.length === 0 ? (
          <div className="p-8 text-center border border-dashed border-border/60 rounded-lg bg-surface/30">
            <Database className="size-8 mx-auto text-muted-foreground mb-2" />
            <p className="text-sm font-semibold text-foreground">No Vector Collections Found</p>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
              {searchFilter
                ? `No collections match "${searchFilter}". Try adjusting your search query.`
                : "No vector collections are currently provisioned for this organization."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-border/60 text-muted-foreground font-mono text-[11px] uppercase tracking-wider bg-surface/50">
                  <th className="py-2.5 px-3 font-semibold">Collection Name</th>
                  <th className="py-2.5 px-3 font-semibold">ID / Key</th>
                  <th className="py-2.5 px-3 font-semibold">Description</th>
                  <th className="py-2.5 px-3 font-semibold">Documents / Chunks</th>
                  <th className="py-2.5 px-3 font-semibold text-right">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {filteredCollections.map((col) => {
                  const docCount = col._count?.documents ?? 0;
                  const chunkCount = col._count?.chunks ?? 0;
                  const createdDate = col.createdAt
                    ? new Date(col.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "—";

                  return (
                    <tr
                      key={col.id}
                      className="hover:bg-surface-subtle/50 transition-colors group"
                    >
                      <td className="py-3 px-3">
                        <div className="font-semibold text-foreground flex items-center gap-2">
                          <Layers className="size-3.5 text-blue-500 shrink-0" />
                          <span className="truncate max-w-[200px]">{col.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 font-mono text-muted-foreground">
                        <Badge variant="outline" className="text-[10px] font-mono bg-surface">
                          {col.id}
                        </Badge>
                      </td>
                      <td className="py-3 px-3 text-muted-foreground max-w-[320px]">
                        <p className="truncate text-xs">{col.description || "Enterprise vector collection partition"}</p>
                      </td>
                      <td className="py-3 px-3 font-mono">
                        <div className="flex items-center gap-2">
                          <span className="text-foreground font-medium">
                            {docCount > 0 ? `${docCount.toLocaleString()} docs` : "Active"}
                          </span>
                          {chunkCount > 0 && (
                            <Badge variant="secondary" className="text-[10px] font-mono">
                              {chunkCount.toLocaleString()} chunks
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-muted-foreground whitespace-nowrap">
                        <span className="flex items-center justify-end gap-1 text-[11px]">
                          <Calendar className="size-3 text-muted-foreground/70" />
                          {createdDate}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
