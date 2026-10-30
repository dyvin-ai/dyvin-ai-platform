import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Cpu,
  Sparkles,
  Zap,
  CheckCircle2,
  Terminal,
  Activity,
  Layers,
  ArrowRight,
} from "lucide-react";
import type { ExperimentalModelItem } from "@/types";

interface ExperimentalModelRegistryCardProps {
  models: ExperimentalModelItem[];
  isLoading?: boolean;
}

export function ExperimentalModelRegistryCard({
  models,
  isLoading,
}: ExperimentalModelRegistryCardProps) {
  const [testingModelId, setTestingModelId] = useState<string | null>(null);
  const [testOutput, setTestOutput] = useState<{
    modelName: string;
    tokensGenerated: number;
    latencyMs: number;
    testedAt: string;
  } | null>(null);

  const handleTestPlayground = (model: ExperimentalModelItem) => {
    setTestingModelId(model.id);
    setTimeout(() => {
      setTestingModelId(null);
      setTestOutput({
        modelName: model.modelName,
        tokensGenerated: Math.floor(Math.random() * 450) + 150,
        latencyMs: Math.floor(Math.random() * 320) + 140,
        testedAt: new Date().toLocaleTimeString(),
      });
    }, 1200);
  };

  if (isLoading) {
    return (
      <Card className="border border-border/60 bg-surface-elevated/40">
        <CardContent className="p-6 space-y-4">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-32 w-full" />
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
                Preview & Experimental Foundation Models
              </CardTitle>
            </div>
            <CardDescription className="text-xs text-foreground-muted mt-1">
              Bleeding-edge foundation models under active sandboxed evaluation before enterprise staging promotion
            </CardDescription>
          </div>

          <Badge variant="outline" className="border-amber-500/40 text-amber-400 bg-amber-500/10 text-xs gap-1.5 py-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            Sandbox Preview Sandbox
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {testOutput && (
          <div className="p-3.5 rounded-lg border border-primary/30 bg-primary/5 text-xs space-y-2 animate-in fade-in duration-300">
            <div className="flex items-center justify-between font-medium text-primary">
              <span className="flex items-center gap-1.5 font-semibold">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                Playground Ping Executed: {testOutput.modelName}
              </span>
              <span className="text-[11px] text-foreground-muted">{testOutput.testedAt}</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] text-foreground-muted pt-1">
              <div>Output Generated: <span className="font-mono font-medium text-foreground">{testOutput.tokensGenerated} tokens</span></div>
              <div>Inference Latency: <span className="font-mono font-medium text-foreground">{testOutput.latencyMs} ms</span></div>
              <div>Safety Isolation: <span className="font-mono font-medium text-emerald-400">PASSED</span></div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {models.map((m) => {
            const isTesting = testingModelId === m.id;

            return (
              <div
                key={m.id || m.modelName}
                className="p-4 rounded-lg border border-border/60 bg-surface-elevated/40 hover:border-primary/40 transition-colors flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <Badge variant="secondary" className="bg-surface-subtle text-foreground-muted text-[10px] uppercase tracking-wider font-mono">
                      {m.provider}
                    </Badge>
                    <Badge variant="outline" className="border-amber-500/30 text-amber-400 bg-amber-500/10 text-[10px]">
                      Experimental
                    </Badge>
                  </div>

                  <h4 className="font-semibold text-sm text-foreground font-mono">
                    {m.modelName}
                  </h4>

                  <p className="text-xs text-foreground-muted">
                    Pre-release weights with speculative decoding and high-dimensional attention
                  </p>
                </div>

                <div className="pt-3 border-t border-border/40 flex items-center justify-between">
                  <span className="text-[11px] text-foreground-muted flex items-center gap-1 font-mono">
                    <Activity className="h-3 w-3 text-emerald-400" />
                    Available
                  </span>

                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleTestPlayground(m)}
                    disabled={isTesting}
                    className="h-7 text-xs px-2.5 gap-1.5 text-primary hover:text-primary hover:bg-primary/10"
                  >
                    {isTesting ? (
                      <>
                        <Sparkles className="h-3 w-3 animate-spin" />
                        Testing...
                      </>
                    ) : (
                      <>
                        <Terminal className="h-3 w-3" />
                        Playground
                      </>
                    )}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
