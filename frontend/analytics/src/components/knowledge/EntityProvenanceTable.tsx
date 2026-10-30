import React, { useState, useMemo } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Search,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  Building,
  Package,
  Layers,
  User,
  MapPin,
  Tag,
  Info,
  Calendar,
} from "lucide-react";
import type { KnowledgeEntity } from "@/types";

interface EntityProvenanceTableProps {
  entities: KnowledgeEntity[];
  isLoading?: boolean;
}

const TYPE_CONFIG: Record<
  string,
  { label: string; color: string; badgeVariant: "default" | "secondary" | "outline" }
> = {
  COMPANY: { label: "Company", color: "text-emerald-400 border-emerald-500/30", badgeVariant: "outline" },
  PRODUCT: { label: "Product", color: "text-indigo-400 border-indigo-500/30", badgeVariant: "outline" },
  SERVICE: { label: "Service", color: "text-cyan-400 border-cyan-500/30", badgeVariant: "outline" },
  PERSON: { label: "Person", color: "text-amber-400 border-amber-500/30", badgeVariant: "outline" },
  LOCATION: { label: "Location", color: "text-rose-400 border-rose-500/30", badgeVariant: "outline" },
  CATEGORY: { label: "Category", color: "text-purple-400 border-purple-500/30", badgeVariant: "outline" },
};

export function EntityProvenanceTable({ entities, isLoading }: EntityProvenanceTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");

  const filteredEntities = useMemo(() => {
    return entities.filter((e) => {
      const matchesType = typeFilter === "ALL" || e.type.toUpperCase() === typeFilter;
      const matchesSearch =
        searchTerm.trim() === "" ||
        e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.canonicalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (e.aliases && e.aliases.some((a) => a.alias.toLowerCase().includes(searchTerm.toLowerCase())));
      return matchesType && matchesSearch;
    });
  }, [entities, typeFilter, searchTerm]);

  if (isLoading) {
    return (
      <Card className="border border-border/60 bg-surface-elevated/40">
        <CardContent className="p-8 text-center text-muted-foreground text-sm">
          Loading canonical entities...
        </CardContent>
      </Card>
    );
  }

  const types = ["ALL", "COMPANY", "PRODUCT", "SERVICE", "PERSON", "LOCATION"];

  return (
    <Card className="border border-border/60 bg-surface-elevated/30">
      <CardHeader className="p-5 pb-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <CardTitle className="text-base font-semibold text-foreground">
              Canonical Entities & Provenance Registry
            </CardTitle>
            <CardDescription className="text-xs">
              Extracted enterprise entities with confidence scoring and alias tracking
            </CardDescription>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="Search entities or aliases..."
                className="h-8 pl-8 text-xs bg-surface/50"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-1">
              {types.map((t) => (
                <Button
                  key={t}
                  variant={typeFilter === t ? "default" : "outline"}
                  size="sm"
                  className="h-8 text-xs"
                  onClick={() => setTypeFilter(t)}
                >
                  {t === "ALL" ? "All" : t.charAt(0) + t.slice(1).toLowerCase()}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="border-border/40 hover:bg-transparent">
              <TableHead className="w-[220px] text-xs font-semibold">Entity Name</TableHead>
              <TableHead className="text-xs font-semibold">Type</TableHead>
              <TableHead className="text-xs font-semibold">Canonical Identity</TableHead>
              <TableHead className="text-xs font-semibold">Known Aliases</TableHead>
              <TableHead className="text-xs font-semibold">Confidence</TableHead>
              <TableHead className="text-xs font-semibold">Verification</TableHead>
              <TableHead className="text-xs font-semibold">Sources</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEntities.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center text-xs text-muted-foreground">
                  No entities matching query.
                </TableCell>
              </TableRow>
            ) : (
              filteredEntities.map((entity) => {
                const config = TYPE_CONFIG[entity.type.toUpperCase()] || {
                  label: entity.type,
                  color: "text-foreground",
                  badgeVariant: "secondary" as const,
                };

                return (
                  <TableRow
                    key={entity.id}
                    className="border-border/40 hover:bg-surface-elevated/40 transition-colors"
                  >
                    <TableCell className="font-medium text-foreground text-xs">
                      <div>
                        <span className="font-semibold">{entity.name}</span>
                        {entity.description && (
                          <p className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5">
                            {entity.description}
                          </p>
                        )}
                      </div>
                    </TableCell>

                    <TableCell>
                      <Badge
                        variant={config.badgeVariant}
                        className={`text-[10px] font-mono uppercase ${config.color}`}
                      >
                        {config.label}
                      </Badge>
                    </TableCell>

                    <TableCell className="text-xs text-muted-foreground font-mono">
                      {entity.canonicalName}
                    </TableCell>

                    <TableCell>
                      <div className="flex flex-wrap gap-1 max-w-[200px]">
                        {entity.aliases && entity.aliases.length > 0 ? (
                          entity.aliases.map((al) => (
                            <Badge
                              key={al.id}
                              variant="secondary"
                              className="text-[10px] py-0 h-4 font-normal"
                            >
                              {al.alias}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-[11px] text-muted-foreground/60">—</span>
                        )}
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="w-24 space-y-1">
                        <div className="flex justify-between items-center text-[10px]">
                          <span className="font-semibold text-foreground">
                            {entity.confidenceScore}%
                          </span>
                        </div>
                        <Progress value={entity.confidenceScore} className="h-1" />
                      </div>
                    </TableCell>

                    <TableCell>
                      {entity.verificationState === "VERIFIED" ? (
                        <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 text-[10px]">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          VERIFIED
                        </Badge>
                      ) : entity.verificationState === "CONFLICTED" ? (
                        <Badge className="bg-rose-500/10 text-rose-400 border-rose-500/30 text-[10px]">
                          <ShieldAlert className="h-3 w-3 mr-1" />
                          CONFLICTED
                        </Badge>
                      ) : (
                        <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/30 text-[10px]">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          UNVERIFIED
                        </Badge>
                      )}
                    </TableCell>

                    <TableCell className="text-xs font-mono text-muted-foreground">
                      {entity.sourceCount} citations
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
