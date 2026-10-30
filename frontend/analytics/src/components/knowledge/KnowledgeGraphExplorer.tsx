import React, { useState, useMemo } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Network,
  Search,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Building,
  Package,
  Layers,
  User,
  MapPin,
  Tag,
  ArrowRight,
  ExternalLink,
  Info,
} from "lucide-react";
import type {
  KnowledgeEntity,
  KnowledgeRelationship,
  KnowledgeFact,
  KnowledgeEntityType,
} from "@/types";

interface KnowledgeGraphExplorerProps {
  entities: KnowledgeEntity[];
  relationships: KnowledgeRelationship[];
  facts: KnowledgeFact[];
  isLoading?: boolean;
}

const TYPE_CONFIG: Record<
  string,
  { label: string; color: string; bg: string; border: string; icon: React.ElementType }
> = {
  COMPANY: {
    label: "Company",
    color: "text-emerald-400",
    bg: "fill-emerald-500/20",
    border: "stroke-emerald-400",
    icon: Building,
  },
  PRODUCT: {
    label: "Product",
    color: "text-indigo-400",
    bg: "fill-indigo-500/20",
    border: "stroke-indigo-400",
    icon: Package,
  },
  SERVICE: {
    label: "Service",
    color: "text-cyan-400",
    bg: "fill-cyan-500/20",
    border: "stroke-cyan-400",
    icon: Layers,
  },
  PERSON: {
    label: "Person",
    color: "text-amber-400",
    bg: "fill-amber-500/20",
    border: "stroke-amber-400",
    icon: User,
  },
  LOCATION: {
    label: "Location",
    color: "text-rose-400",
    bg: "fill-rose-500/20",
    border: "stroke-rose-400",
    icon: MapPin,
  },
  CATEGORY: {
    label: "Category",
    color: "text-purple-400",
    bg: "fill-purple-500/20",
    border: "stroke-purple-400",
    icon: Tag,
  },
};

export function KnowledgeGraphExplorer({
  entities,
  relationships,
  facts,
  isLoading,
}: KnowledgeGraphExplorerProps) {
  const [selectedEntityId, setSelectedEntityId] = useState<string | null>(
    entities[0]?.id || null
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>("ALL");
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  // Compute filtered entities
  const filteredEntities = useMemo(() => {
    return entities.filter((e) => {
      const matchesType =
        selectedTypeFilter === "ALL" || e.type.toUpperCase() === selectedTypeFilter;
      const matchesSearch =
        searchQuery.trim() === "" ||
        e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.canonicalName.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesType && matchesSearch;
    });
  }, [entities, selectedTypeFilter, searchQuery]);

  // Selected Entity
  const selectedEntity = useMemo(() => {
    return (
      entities.find((e) => e.id === selectedEntityId) ||
      filteredEntities[0] ||
      entities[0] ||
      null
    );
  }, [entities, selectedEntityId, filteredEntities]);

  // Associated relationships for selected entity
  const entityRelationships = useMemo(() => {
    if (!selectedEntity) return [];
    return relationships.filter(
      (r) =>
        r.sourceEntityId === selectedEntity.id ||
        r.targetEntityId === selectedEntity.id
    );
  }, [relationships, selectedEntity]);

  // Associated facts for selected entity
  const entityFacts = useMemo(() => {
    if (!selectedEntity) return [];
    return facts.filter(
      (f) =>
        f.entityId === selectedEntity.id ||
        f.entity?.name.toLowerCase() === selectedEntity.name.toLowerCase()
    );
  }, [facts, selectedEntity]);

  // Dynamic layout positioning for nodes in SVG
  const nodePositions = useMemo(() => {
    const positions = new Map<string, { x: number; y: number }>();
    const width = 800;
    const height = 500;
    const centerX = width / 2;
    const centerY = height / 2;

    if (entities.length === 0) return positions;

    // Put primary COMPANY entity in center if found
    const company = entities.find((e) => e.type.toUpperCase() === "COMPANY");
    const otherEntities = company
      ? entities.filter((e) => e.id !== company.id)
      : entities.slice(1);

    if (company) {
      positions.set(company.id, { x: centerX, y: centerY });
    } else if (entities[0]) {
      positions.set(entities[0].id, { x: centerX, y: centerY });
    }

    // Distribute remaining entities in concentric circles
    const count = otherEntities.length;
    if (count > 0) {
      const radius = 175;
      otherEntities.forEach((entity, index) => {
        const angle = (index / count) * 2 * Math.PI - Math.PI / 2;
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);
        positions.set(entity.id, { x, y });
      });
    }

    return positions;
  }, [entities]);

  if (isLoading) {
    return (
      <Card className="border border-border/60 bg-surface-elevated/40">
        <CardContent className="h-[520px] flex items-center justify-center">
          <div className="flex flex-col items-center gap-3 text-muted-foreground animate-pulse">
            <Network className="h-8 w-8 text-primary" />
            <p className="text-sm">Synthesizing semantic graph topologies...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const entityTypes = ["ALL", "COMPANY", "PRODUCT", "SERVICE", "PERSON", "LOCATION"];

  return (
    <div className="space-y-4">
      {/* Top Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-surface-elevated/30 p-3 rounded-lg border border-border/50">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-medium text-muted-foreground mr-1">
            Filter Type:
          </span>
          {entityTypes.map((type) => (
            <Button
              key={type}
              variant={selectedTypeFilter === type ? "default" : "outline"}
              size="sm"
              className="h-7 text-xs"
              onClick={() => setSelectedTypeFilter(type)}
            >
              {type === "ALL" ? "All Entities" : TYPE_CONFIG[type]?.label || type}
            </Button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <div className="relative w-48 sm:w-64">
            <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Search graph entities..."
              className="h-8 pl-8 text-xs bg-surface/50"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-1 border border-border/60 rounded-md p-0.5 bg-surface/50">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => setZoomLevel((z) => Math.min(z + 0.15, 1.6))}
              title="Zoom In"
            >
              <ZoomIn className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => setZoomLevel((z) => Math.max(z - 0.15, 0.6))}
              title="Zoom Out"
            >
              <ZoomOut className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => setZoomLevel(1)}
              title="Reset Zoom"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Graph & Detail Split Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* SVG Graph Canvas (2 Columns) */}
        <Card className="lg:col-span-2 border border-border/60 bg-surface-elevated/20 overflow-hidden relative">
          <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between border-b border-border/40">
            <div>
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Network className="h-4 w-4 text-primary" />
                Semantic Topology Graph
              </CardTitle>
              <CardDescription className="text-xs">
                {entities.length} canonical nodes • {relationships.length} directed relations
              </CardDescription>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Real-Time Graph Active</span>
            </div>
          </CardHeader>

          <CardContent className="p-0 relative min-h-[480px] flex items-center justify-center overflow-auto bg-gradient-to-b from-background/40 to-surface/20">
            <div
              className="transition-transform duration-300 ease-out origin-center"
              style={{ transform: `scale(${zoomLevel})` }}
            >
              <svg width="800" height="500" className="overflow-visible select-none">
                <defs>
                  {/* Arrow marker definition */}
                  <marker
                    id="arrowhead"
                    markerWidth="10"
                    markerHeight="7"
                    refX="16"
                    refY="3.5"
                    orient="auto"
                  >
                    <polygon
                      points="0 0, 10 3.5, 0 7"
                      fill="currentColor"
                      className="text-muted-foreground/60"
                    />
                  </marker>
                  <marker
                    id="arrowhead-active"
                    markerWidth="10"
                    markerHeight="7"
                    refX="16"
                    refY="3.5"
                    orient="auto"
                  >
                    <polygon
                      points="0 0, 10 3.5, 0 7"
                      fill="currentColor"
                      className="text-primary"
                    />
                  </marker>
                </defs>

                {/* Relationship Edges */}
                {relationships.map((rel) => {
                  const sourcePos = nodePositions.get(rel.sourceEntityId);
                  const targetPos = nodePositions.get(rel.targetEntityId);
                  if (!sourcePos || !targetPos) return null;

                  const isConnectedToSelected =
                    selectedEntity &&
                    (rel.sourceEntityId === selectedEntity.id ||
                      rel.targetEntityId === selectedEntity.id);

                  const midX = (sourcePos.x + targetPos.x) / 2;
                  const midY = (sourcePos.y + targetPos.y) / 2;

                  return (
                    <g key={rel.id} className="transition-all duration-200">
                      <line
                        x1={sourcePos.x}
                        y1={sourcePos.y}
                        x2={targetPos.x}
                        y2={targetPos.y}
                        stroke="currentColor"
                        strokeWidth={isConnectedToSelected ? 2.5 : 1.2}
                        strokeDasharray={isConnectedToSelected ? "none" : "3,3"}
                        className={
                          isConnectedToSelected
                            ? "text-primary stroke-primary"
                            : "text-border/80"
                        }
                        markerEnd={
                          isConnectedToSelected
                            ? "url(#arrowhead-active)"
                            : "url(#arrowhead)"
                        }
                      />
                      {/* Relation type pill */}
                      <g transform={`translate(${midX}, ${midY})`}>
                        <rect
                          x="-38"
                          y="-10"
                          width="76"
                          height="20"
                          rx="10"
                          fill="currentColor"
                          className={
                            isConnectedToSelected
                              ? "text-surface-elevated fill-surface-elevated stroke-primary/80 stroke-1"
                              : "text-surface fill-surface stroke-border/60 stroke-1"
                          }
                        />
                        <text
                          textAnchor="middle"
                          dy="3.5"
                          className={`text-[9px] font-mono font-medium ${
                            isConnectedToSelected
                              ? "fill-primary font-semibold"
                              : "fill-muted-foreground"
                          }`}
                        >
                          {rel.relationType}
                        </text>
                      </g>
                    </g>
                  );
                })}

                {/* Entity Nodes */}
                {entities.map((entity) => {
                  const pos = nodePositions.get(entity.id);
                  if (!pos) return null;

                  const isSelected = selectedEntity?.id === entity.id;
                  const isFiltered = filteredEntities.some((e) => e.id === entity.id);
                  const config = TYPE_CONFIG[entity.type.toUpperCase()] || {
                    label: entity.type,
                    color: "text-foreground",
                    bg: "fill-surface-elevated",
                    border: "stroke-border",
                    icon: Info,
                  };

                  const radius = entity.type.toUpperCase() === "COMPANY" ? 36 : 28;

                  return (
                    <g
                      key={entity.id}
                      transform={`translate(${pos.x}, ${pos.y})`}
                      onClick={() => setSelectedEntityId(entity.id)}
                      className={`cursor-pointer transition-all duration-200 ${
                        !isFiltered ? "opacity-30" : "opacity-100"
                      }`}
                    >
                      {/* Selection Glow Ring */}
                      {isSelected && (
                        <circle
                          r={radius + 8}
                          className="fill-none stroke-primary/40 stroke-2 animate-pulse"
                        />
                      )}

                      {/* Main Node Circle */}
                      <circle
                        r={radius}
                        className={`${config.bg} ${config.border} stroke-2 ${
                          isSelected
                            ? "stroke-primary shadow-lg fill-surface-elevated"
                            : "hover:stroke-primary/70"
                        } transition-colors`}
                      />

                      {/* Label Text */}
                      <text
                        textAnchor="middle"
                        dy="-4"
                        className="text-[11px] font-semibold fill-foreground pointer-events-none"
                      >
                        {entity.name.length > 14
                          ? `${entity.name.substring(0, 12)}...`
                          : entity.name}
                      </text>
                      <text
                        textAnchor="middle"
                        dy="12"
                        className={`text-[9px] font-mono ${config.color} pointer-events-none`}
                      >
                        {config.label}
                      </text>

                      {/* Confidence Score Chip */}
                      <g transform={`translate(0, ${radius + 12})`}>
                        <rect
                          x="-18"
                          y="-7"
                          width="36"
                          height="14"
                          rx="7"
                          fill="currentColor"
                          className="text-surface fill-surface stroke-border stroke-[0.8]"
                        />
                        <text
                          textAnchor="middle"
                          dy="3.5"
                          className="text-[8px] font-bold fill-muted-foreground"
                        >
                          {entity.confidenceScore}%
                        </text>
                      </g>
                    </g>
                  );
                })}
              </svg>
            </div>
          </CardContent>
        </Card>

        {/* Selected Entity Provenance Inspector (1 Column) */}
        <Card className="border border-border/60 bg-surface-elevated/40 flex flex-col">
          <CardHeader className="p-4 pb-3 border-b border-border/40">
            <div className="flex items-center justify-between">
              <Badge
                variant="outline"
                className={`text-xs uppercase font-mono ${
                  TYPE_CONFIG[selectedEntity?.type?.toUpperCase() || ""]?.color || ""
                }`}
              >
                {selectedEntity?.type || "Entity"}
              </Badge>
              {selectedEntity?.verificationState === "VERIFIED" ? (
                <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 text-xs">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Verified Provenance
                </Badge>
              ) : (
                <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/30 text-xs">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  Unverified
                </Badge>
              )}
            </div>
            <CardTitle className="text-base font-bold text-foreground mt-2">
              {selectedEntity?.name || "Select an entity"}
            </CardTitle>
            <CardDescription className="text-xs">
              Canonical: {selectedEntity?.canonicalName || "—"}
            </CardDescription>
          </CardHeader>

          <CardContent className="p-4 space-y-4 flex-1 overflow-auto">
            {selectedEntity ? (
              <>
                {/* Description */}
                {selectedEntity.description && (
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {selectedEntity.description}
                  </p>
                )}

                {/* Metrics */}
                <div className="space-y-2 bg-surface/50 p-3 rounded-lg border border-border/40">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground">Extraction Confidence</span>
                    <span className="font-semibold text-foreground">
                      {selectedEntity.confidenceScore}%
                    </span>
                  </div>
                  <Progress value={selectedEntity.confidenceScore} className="h-1.5" />
                  <div className="flex justify-between items-center text-xs pt-1 text-muted-foreground">
                    <span>Evidence Sources</span>
                    <span className="font-mono">{selectedEntity.sourceCount} citations</span>
                  </div>
                </div>

                {/* Aliases */}
                {selectedEntity.aliases && selectedEntity.aliases.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-xs font-medium text-foreground">Known Aliases</span>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedEntity.aliases.map((al) => (
                        <Badge
                          key={al.id}
                          variant="secondary"
                          className="text-[11px] font-normal"
                        >
                          {al.alias}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Graph Edges */}
                <div className="space-y-2">
                  <span className="text-xs font-medium text-foreground">
                    Connected Relations ({entityRelationships.length})
                  </span>
                  {entityRelationships.length === 0 ? (
                    <p className="text-xs text-muted-foreground">No direct relations</p>
                  ) : (
                    <div className="space-y-1.5 max-h-40 overflow-auto pr-1">
                      {entityRelationships.map((r) => {
                        const isOutgoing = r.sourceEntityId === selectedEntity.id;
                        const otherName = isOutgoing
                          ? r.targetEntity?.name || "Target"
                          : r.sourceEntity?.name || "Source";
                        return (
                          <div
                            key={r.id}
                            className="flex items-center justify-between p-2 rounded bg-surface/40 text-xs border border-border/30"
                          >
                            <div className="flex items-center gap-1.5">
                              <ArrowRight className="h-3 w-3 text-primary" />
                              <Badge
                                variant="outline"
                                className="text-[10px] font-mono py-0 h-4"
                              >
                                {r.relationType}
                              </Badge>
                            </div>
                            <span className="font-medium text-foreground truncate max-w-[120px]">
                              {otherName}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Extracted Facts */}
                <div className="space-y-2">
                  <span className="text-xs font-medium text-foreground">
                    Semantic Facts ({entityFacts.length})
                  </span>
                  {entityFacts.length === 0 ? (
                    <p className="text-xs text-muted-foreground">No extracted facts</p>
                  ) : (
                    <div className="space-y-2 max-h-48 overflow-auto pr-1">
                      {entityFacts.map((fact) => (
                        <div
                          key={fact.id}
                          className="p-2.5 rounded-lg bg-surface/50 border border-border/40 text-xs space-y-1"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-[11px] text-primary">
                              {fact.predicate}
                            </span>
                            <Badge variant="outline" className="text-[9px] py-0 h-3.5">
                              {fact.confidenceScore}% Conf
                            </Badge>
                          </div>
                          <p className="text-foreground text-xs font-medium">{fact.value}</p>
                          {fact.sources && fact.sources.length > 0 && (
                            <div className="pt-1 flex items-center gap-1 text-[10px] text-muted-foreground">
                              <ExternalLink className="h-3 w-3 text-muted-foreground/60" />
                              <span className="truncate max-w-[200px]">
                                {fact.sources[0]?.sourceUrl}
                              </span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground text-xs">
                Select a node to inspect provenance
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
