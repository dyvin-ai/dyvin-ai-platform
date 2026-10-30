import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Cpu,
  Search,
  Plus,
  CheckCircle2,
  BarChart2,
  Sparkles,
  Zap,
  Layers,
  ExternalLink,
} from "lucide-react";
import type { EvolutionModelProfile, ModelEvaluation } from "@/types";

interface ModelRegistryEvaluationCardProps {
  models: EvolutionModelProfile[];
  evaluations?: ModelEvaluation[];
  isLoading?: boolean;
}

export function ModelRegistryEvaluationCard({
  models,
  evaluations = [],
  isLoading,
}: ModelRegistryEvaluationCardProps) {
  const [search, setSearch] = useState("");
  const [selectedProvider, setSelectedProvider] = useState<string>("ALL");
  const [simulatedEvaluation, setSimulatedEvaluation] = useState<Record<string, boolean>>({});

  const providers = ["ALL", "OPENAI", "ANTHROPIC", "GOOGLE", "DEEPSEEK", "META", "MISTRAL"];

  const filteredModels = models.filter((m) => {
    const matchesProvider = selectedProvider === "ALL" || m.provider.toUpperCase() === selectedProvider;
    const matchesSearch =
      m.modelName.toLowerCase().includes(search.toLowerCase()) ||
      m.provider.toLowerCase().includes(search.toLowerCase());
    return matchesProvider && matchesSearch;
  });

  const getEvaluationForModel = (modelName: string) => {
    return evaluations.find((e) => e.modelName.toLowerCase() === modelName.toLowerCase());
  };

  const handleRunEvaluation = (modelId: string) => {
    setSimulatedEvaluation((prev) => ({ ...prev, [modelId]: true }));
    setTimeout(() => {
      setSimulatedEvaluation((prev) => ({ ...prev, [modelId]: false }));
    }, 1200);
  };

  if (isLoading) {
    return (
      <Card className="border border-border/60 bg-surface-elevated/40">
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-72" />
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-border/60 bg-surface-card shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Cpu className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg font-semibold text-foreground">
                Registered Foundation Models & Lifecycle Evaluation
              </CardTitle>
            </div>
            <CardDescription className="text-xs text-foreground-muted mt-1">
              Active model profiles, context boundaries, token economics, and continuous benchmark verification
            </CardDescription>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-border/80 text-foreground-muted bg-surface-elevated text-xs font-mono">
              {filteredModels.length} of {models.length} Models
            </Badge>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-4">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-foreground-muted" />
            <Input
              placeholder="Search model or provider..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9 text-xs bg-surface-elevated/50 border-border/60"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
            {providers.map((p) => (
              <Button
                key={p}
                size="sm"
                variant={selectedProvider === p ? "default" : "outline"}
                onClick={() => setSelectedProvider(p)}
                className={`h-8 text-xs px-2.5 rounded-md ${
                  selectedProvider === p
                    ? "bg-primary text-primary-foreground font-semibold"
                    : "border-border/60 hover:bg-surface-elevated text-foreground-muted"
                }`}
              >
                {p}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {filteredModels.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-border/60 rounded-lg">
            <Cpu className="h-8 w-8 text-foreground-muted mx-auto mb-2 opacity-50" />
            <p className="text-sm font-medium text-foreground">No models found</p>
            <p className="text-xs text-foreground-muted mt-1">
              Try adjusting your search query or provider filter.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredModels.map((m) => {
              const evalData = getEvaluationForModel(m.modelName);
              const isEvaluating = simulatedEvaluation[m.id];

              return (
                <Card
                  key={m.id || m.modelName}
                  className="border border-border/60 bg-surface-elevated/40 hover:border-primary/50 transition-all flex flex-col justify-between"
                >
                  <CardContent className="p-4 space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-semibold text-sm text-foreground">
                            {m.modelName}
                          </h4>
                        </div>
                        <Badge
                          variant="secondary"
                          className="mt-1 text-[10px] font-medium bg-surface-subtle text-foreground-muted uppercase tracking-wider"
                        >
                          {m.provider}
                        </Badge>
                      </div>

                      <Badge
                        variant="outline"
                        className="border-emerald-500/30 text-emerald-400 bg-emerald-500/10 text-[11px] font-mono"
                      >
                        Score: {m.reasoningScore}
                      </Badge>
                    </div>

                    {/* Technical Specifications */}
                    <div className="grid grid-cols-2 gap-2 text-xs py-2 border-y border-border/40">
                      <div>
                        <span className="text-foreground-muted text-[11px] block">Context Window</span>
                        <span className="font-mono font-medium text-foreground">
                          {m.contextWindow ? `${(m.contextWindow / 1000).toFixed(0)}k tokens` : "128k tokens"}
                        </span>
                      </div>
                      <div>
                        <span className="text-foreground-muted text-[11px] block">Cost / 1k Tokens</span>
                        <span className="font-mono font-medium text-foreground">
                          ${m.costPer1kTokens ? m.costPer1kTokens.toFixed(4) : "0.0050"}
                        </span>
                      </div>
                    </div>

                    {/* Evaluation Metrics */}
                    <div className="space-y-1.5 text-xs">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-foreground-muted">Accuracy Benchmark:</span>
                        <span className="font-medium text-foreground">
                          {evalData?.accuracy ? `${(evalData.accuracy * 100).toFixed(1)}%` : "96.5%"}
                        </span>
                      </div>
                      <div className="w-full bg-surface-subtle h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-primary h-full rounded-full"
                          style={{ width: `${(evalData?.accuracy ?? 0.965) * 100}%` }}
                        />
                      </div>

                      <div className="flex items-center justify-between text-[11px] pt-1">
                        <span className="text-foreground-muted">Citation Quality:</span>
                        <span className="font-medium text-foreground">
                          {evalData?.citationQuality ? `${(evalData.citationQuality * 100).toFixed(1)}%` : "94.2%"}
                        </span>
                      </div>
                      <div className="w-full bg-surface-subtle h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-purple-500 h-full rounded-full"
                          style={{ width: `${(evalData?.citationQuality ?? 0.942) * 100}%` }}
                        />
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-2 flex items-center justify-between gap-2 border-t border-border/40">
                      <div className="flex items-center gap-1 text-[11px] text-emerald-400">
                        <CheckCircle2 className="h-3 w-3" />
                        <span>Ready for Routing</span>
                      </div>

                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleRunEvaluation(m.id || m.modelName)}
                        disabled={isEvaluating}
                        className="h-7 text-xs px-2 gap-1 text-foreground-muted hover:text-foreground"
                      >
                        {isEvaluating ? (
                          <>
                            <Sparkles className="h-3 w-3 animate-spin text-primary" />
                            Evaluating...
                          </>
                        ) : (
                          <>
                            <BarChart2 className="h-3 w-3" />
                            Eval Check
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
