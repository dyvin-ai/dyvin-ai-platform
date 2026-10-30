import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Layers, Sparkles, FolderTree, ArrowRight, Tag } from "lucide-react";
import type { KeywordClusterItem } from "@/types";

interface TopicClustersGridCardProps {
  clusters: KeywordClusterItem[];
  isLoading?: boolean;
  onGenerateClusters?: () => void;
  isGenerating?: boolean;
}

export function TopicClustersGridCard({
  clusters,
  isLoading = false,
  onGenerateClusters,
  isGenerating = false,
}: TopicClustersGridCardProps) {
  return (
    <Card className="border border-border/50 bg-card/60 backdrop-blur-sm">
      <CardHeader className="p-6 pb-4 border-b border-border/40">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Layers className="w-5 h-5 text-purple-400" />
              AI Semantic Topic Clusters & Pillars
            </CardTitle>
            <CardDescription className="text-sm mt-0.5">
              Vector-grouped topical entities structuring keyword relationships for optimal generative engine citation coverage.
            </CardDescription>
          </div>

          {onGenerateClusters && (
            <Button
              variant="outline"
              size="sm"
              onClick={onGenerateClusters}
              disabled={isGenerating}
              className="gap-2 border-purple-500/40 text-purple-400 hover:bg-purple-950/20 text-xs self-start sm:self-auto"
            >
              <Sparkles className={`w-3.5 h-3.5 ${isGenerating ? "animate-spin" : ""}`} />
              {isGenerating ? "Clustering Embeddings..." : "Generate AI Clusters"}
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-6">
        {isLoading ? (
          <div className="py-8 text-center text-sm text-muted-foreground animate-pulse">
            Analyzing semantic cluster vector graphs...
          </div>
        ) : clusters.length === 0 ? (
          <div className="py-8 text-center">
            <FolderTree className="w-8 h-8 text-muted-foreground mx-auto mb-2 opacity-50" />
            <p className="text-sm text-muted-foreground">No topic clusters generated yet.</p>
            {onGenerateClusters && (
              <Button size="sm" variant="outline" onClick={onGenerateClusters} className="mt-3 text-xs">
                Trigger Semantic Clustering
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {clusters.map((cluster) => (
              <div
                key={cluster.id}
                className="p-4 rounded-xl border border-border/50 bg-background/50 hover:border-purple-500/40 transition-all duration-200 group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-semibold text-foreground text-sm group-hover:text-purple-300 transition-colors">
                      {cluster.name}
                    </span>
                    <Badge variant="outline" className="border-purple-500/30 text-purple-400 bg-purple-500/10 text-[11px] shrink-0">
                      {cluster.keywordCount} {cluster.keywordCount === 1 ? "term" : "terms"}
                    </Badge>
                  </div>

                  <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                    {cluster.primaryTopic}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-border/30 flex items-center justify-between text-[11px] text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-purple-400/80" />
                    <span>Semantic Pillar</span>
                  </div>
                  <span className="text-[10px] bg-muted/60 px-2 py-0.5 rounded">
                    32-dim Normalized
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
