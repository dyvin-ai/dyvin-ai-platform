import React, { useState, useMemo } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  FileCheck2,
  Search,
  ExternalLink,
  ShieldCheck,
  Calendar,
  Globe,
  Tag,
} from "lucide-react";
import type { KnowledgeFact } from "@/types";

interface SemanticFactsListProps {
  facts: KnowledgeFact[];
  isLoading?: boolean;
}

export function SemanticFactsList({ facts, isLoading }: SemanticFactsListProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFacts = useMemo(() => {
    return facts.filter((f) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        f.predicate.toLowerCase().includes(q) ||
        f.value.toLowerCase().includes(q) ||
        (f.entity?.name && f.entity.name.toLowerCase().includes(q))
      );
    });
  }, [facts, searchQuery]);

  if (isLoading) {
    return (
      <Card className="border border-border/60 bg-surface-elevated/40">
        <CardContent className="p-8 text-center text-muted-foreground text-sm">
          Loading semantic facts and provenance trails...
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-border/60 bg-surface-elevated/30">
      <CardHeader className="p-5 pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
              <FileCheck2 className="h-4 w-4 text-emerald-400" />
              Semantic Facts & Provenance Attribution
            </CardTitle>
            <CardDescription className="text-xs">
              Extracted enterprise statements backed by verified web intelligence citations
            </CardDescription>
          </div>

          <div className="relative w-64">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Search predicates, values, entities..."
              className="h-8 pl-8 text-xs bg-surface/50"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-5 pt-2">
        {filteredFacts.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground text-xs">
            No semantic facts found matching "{searchQuery}".
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredFacts.map((fact) => (
              <div
                key={fact.id}
                className="p-4 rounded-lg border border-border/50 bg-surface-elevated/40 hover:bg-surface-elevated/60 transition-all space-y-3"
              >
                {/* Header: Entity & Predicate */}
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-1.5">
                    {fact.entity?.name && (
                      <Badge variant="secondary" className="text-xs font-semibold">
                        {fact.entity.name}
                      </Badge>
                    )}
                    <Badge
                      variant="outline"
                      className="text-xs font-mono bg-primary/10 text-primary border-primary/20"
                    >
                      {fact.predicate}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-foreground">
                      {fact.confidenceScore}%
                    </span>
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                  </div>
                </div>

                {/* Fact Value */}
                <p className="text-sm font-medium text-foreground bg-surface/60 p-2.5 rounded-md border border-border/40">
                  {fact.value}
                </p>

                {/* Provenance Sources */}
                {fact.sources && fact.sources.length > 0 && (
                  <div className="pt-1 border-t border-border/40 space-y-1.5">
                    <span className="text-[11px] font-medium text-muted-foreground flex items-center gap-1">
                      <Globe className="h-3 w-3" />
                      Provenance Evidence Sources ({fact.sources.length}):
                    </span>
                    <div className="space-y-1">
                      {fact.sources.map((src) => (
                        <div
                          key={src.id}
                          className="flex items-center justify-between text-xs p-1.5 rounded bg-surface/30 border border-border/30 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <div className="flex items-center gap-1.5 truncate mr-2">
                            <ExternalLink className="h-3 w-3 shrink-0 text-muted-foreground/60" />
                            <a
                              href={src.sourceUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="hover:underline truncate text-[11px] font-mono"
                            >
                              {src.sourceUrl}
                            </a>
                          </div>
                          {src.extractedAt && (
                            <span className="text-[10px] text-muted-foreground/60 shrink-0">
                              {new Date(src.extractedAt).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
