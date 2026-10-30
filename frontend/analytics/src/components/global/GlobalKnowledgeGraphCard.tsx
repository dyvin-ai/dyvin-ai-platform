import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Network,
  Share2,
  TrendingUp,
  Tag,
  ArrowRight,
  Sparkles,
  Layers,
} from "lucide-react";
import type {
  GlobalKnowledgeGraphOverview,
  GlobalTopicItem,
} from "@/types";

interface GlobalKnowledgeGraphCardProps {
  graphData?: GlobalKnowledgeGraphOverview;
  topics?: GlobalTopicItem[];
  isLoading?: boolean;
}

export function GlobalKnowledgeGraphCard({
  graphData,
  topics = [],
  isLoading = false,
}: GlobalKnowledgeGraphCardProps) {
  const [selectedFilter, setSelectedFilter] = useState<string>("ALL");

  const defaultNodes = [
    { id: "n1", nodeKey: "kg_entity_dyvin", nodeType: "PLATFORM", label: "Dyvin AI Enterprise Engine", influenceScore: 98.5 },
    { id: "n2", nodeKey: "kg_entity_geo", nodeType: "CONCEPT", label: "Generative Engine Optimization", influenceScore: 96.2 },
    { id: "n3", nodeKey: "kg_entity_rag", nodeType: "ARCHITECTURE", label: "Retrieval Augmented Generation", influenceScore: 95.0 },
    { id: "n4", nodeKey: "kg_entity_governance", nodeType: "GOVERNANCE", label: "Enterprise Safety & Auditing", influenceScore: 91.8 },
  ];

  const defaultEdges = [
    { id: "e1", source: "Dyvin AI Enterprise Engine", target: "Generative Engine Optimization", relationship: "LEVERAGES_DISCIPLINE" },
    { id: "e2", source: "Generative Engine Optimization", target: "Retrieval Augmented Generation", relationship: "INTERSECTS_WITH" },
    { id: "e3", source: "Dyvin AI Enterprise Engine", target: "Enterprise Safety & Auditing", relationship: "ENFORCES_POLICIES" },
  ];

  const nodes = graphData?.nodes && graphData.nodes.length > 0 ? graphData.nodes : defaultNodes;

  const filteredNodes = selectedFilter === "ALL"
    ? nodes
    : nodes.filter((n) => n.nodeType === selectedFilter);

  const displayTopics = topics.length > 0 ? topics : [
    { topicName: "Generative Engine Optimization", growthPct: 42.0, category: "AI_SEARCH", visibilityScore: 97.1 },
    { topicName: "Enterprise AI Governance", growthPct: 31.0, category: "GOVERNANCE", visibilityScore: 92.4 },
    { topicName: "Distributed Knowledge Mesh", growthPct: 28.5, category: "INFRASTRUCTURE", visibilityScore: 88.6 },
  ];

  const getNodeTypeBadge = (type: string) => {
    switch (type) {
      case "PLATFORM":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "CONCEPT":
        return "bg-purple-500/10 text-purple-500 border-purple-500/20";
      case "ARCHITECTURE":
        return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
      default:
        return "bg-cyan-500/10 text-cyan-500 border-cyan-500/20";
    }
  };

  return (
    <Card className="border border-border/80 bg-card shadow-sm">
      <CardHeader className="p-5 pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Network className="h-5 w-5 text-indigo-500" />
              <CardTitle className="text-base font-semibold text-foreground">
                Public Knowledge Graph & Entity Linkages
              </CardTitle>
            </div>
            <CardDescription className="text-xs text-muted-foreground mt-0.5">
              Federated semantic mesh connecting authoritative enterprise entities, architectures, and search concepts
            </CardDescription>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto">
            {["ALL", "PLATFORM", "CONCEPT", "ARCHITECTURE"].map((filter) => (
              <Button
                key={filter}
                variant={selectedFilter === filter ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedFilter(filter)}
                className="h-7 px-2.5 text-[11px]"
              >
                {filter}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-5 pt-3">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left 2 Cols: Nodes & Entity Relationships */}
          <div className="lg:col-span-2 space-y-3">
            <div className="text-xs font-semibold text-foreground flex items-center justify-between">
              <span>Federated Graph Entities</span>
              <span className="text-[11px] text-muted-foreground">{filteredNodes.length} Active Nodes</span>
            </div>

            <div className="space-y-2">
              {filteredNodes.map((node) => (
                <div
                  key={node.id || node.nodeKey}
                  className="p-3 rounded-lg border border-border/60 bg-muted/10 hover:bg-muted/20 transition-colors flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded bg-primary/10 text-primary">
                      <Layers className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-foreground">{node.label}</div>
                      <div className="text-[11px] font-mono text-muted-foreground">{node.nodeKey}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={`text-[10px] ${getNodeTypeBadge(node.nodeType)}`}>
                      {node.nodeType}
                    </Badge>
                    <div className="text-right">
                      <span className="text-xs font-bold text-foreground">
                        {node.influenceScore ? `${node.influenceScore.toFixed(1)}` : "95.0"}
                      </span>
                      <span className="text-[10px] text-muted-foreground block">Influence</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Entity Linkage Relationships */}
            <div className="mt-4 pt-3 border-t border-border/40">
              <div className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1.5">
                <Share2 className="h-3.5 w-3.5 text-cyan-500" />
                Active Knowledge Graph Relationships
              </div>
              <div className="space-y-1.5">
                {defaultEdges.map((edge) => (
                  <div
                    key={edge.id}
                    className="p-2 rounded border border-border/40 bg-card flex items-center justify-between text-xs"
                  >
                    <span className="font-medium text-foreground">{edge.source}</span>
                    <Badge variant="secondary" className="text-[10px] font-mono px-1.5 py-0 text-cyan-500">
                      {edge.relationship}
                    </Badge>
                    <span className="font-medium text-foreground">{edge.target}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Col: Emergent Topics & Search Trends */}
          <div className="space-y-3">
            <div className="text-xs font-semibold text-foreground flex items-center justify-between">
              <span>Emergent Search Topics</span>
              <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
                <TrendingUp className="h-3 w-3 mr-1" />
                Trending
              </Badge>
            </div>

            <div className="space-y-2">
              {displayTopics.map((topic) => (
                <div
                  key={topic.topicName}
                  className="p-3 rounded-lg border border-border/60 bg-muted/10 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-foreground">{topic.topicName}</span>
                    <Badge variant="outline" className="text-[10px] font-mono text-emerald-500 border-emerald-500/20">
                      +{topic.growthPct}%
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                    <span>Category: {topic.category}</span>
                    <span>Visibility: {topic.visibilityScore || 95}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
