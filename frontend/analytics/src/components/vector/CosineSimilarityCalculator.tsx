import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  GitCompare,
  Zap,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRightLeft,
  Scale,
} from "lucide-react";
import { vectorIntelligenceService } from "@/services";
import type { VectorSimilarityResponse } from "@/types";

const COMPARISON_PRESETS = [
  {
    title: "Brand Strategy Paraphrase",
    textA: "Dyvin AI delivers autonomous generative engine optimization and multi-model citation intelligence.",
    textB: "Autonomous GEO platform Dyvin AI indexes LLM citation networks and optimizes brand discovery across ChatGPT.",
  },
  {
    title: "Identical Fact Grounding",
    textA: "Northwind Labs provides real-time vector analytics for LLM search visibility.",
    textB: "Northwind Labs provides real-time vector analytics for LLM search visibility.",
  },
  {
    title: "Distinct Topic Contrast",
    textA: "Enterprise knowledge graph ontology triples and provenance verification.",
    textB: "Kubernetes pod autoscaling and Redis queue throughput monitoring.",
  },
];

export function CosineSimilarityCalculator() {
  const [textA, setTextA] = useState(COMPARISON_PRESETS[0].textA);
  const [textB, setTextB] = useState(COMPARISON_PRESETS[0].textB);
  const [isComputing, setIsComputing] = useState(false);
  const [similarityResult, setSimilarityResult] = useState<VectorSimilarityResponse | null>({
    textA: COMPARISON_PRESETS[0].textA,
    textB: COMPARISON_PRESETS[0].textB,
    similarityScore: 0.88,
    metric: "COSINE",
  });

  const handleCompute = async () => {
    if (!textA.trim() || !textB.trim()) return;
    setIsComputing(true);
    try {
      const res = await vectorIntelligenceService.getSimilarity(textA.trim(), textB.trim());
      setSimilarityResult(res);
    } catch (err) {
      console.error("Cosine similarity computation failed:", err);
    } finally {
      setIsComputing(false);
    }
  };

  const getSemanticLabel = (score: number) => {
    if (score >= 0.98) return { label: "Identical Semantic Vectors", color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/30" };
    if (score >= 0.85) return { label: "High Semantic Proximity", color: "bg-blue-500/10 text-blue-500 border-blue-500/30" };
    if (score >= 0.75) return { label: "Moderate Semantic Proximity", color: "bg-amber-500/10 text-amber-500 border-amber-500/30" };
    return { label: "Low Proximity / Divergent", color: "bg-rose-500/10 text-rose-500 border-rose-500/30" };
  };

  const scorePct = similarityResult ? Math.round(similarityResult.similarityScore * 100) : 0;
  const semanticInfo = similarityResult ? getSemanticLabel(similarityResult.similarityScore) : null;

  return (
    <Card className="border border-border/60 bg-surface-elevated/40 shadow-xs">
      <CardHeader className="p-4 pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Scale className="size-4.5 text-purple-500" />
              High-Dimensional Cosine Similarity Comparator
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground mt-0.5">
              Compare semantic vectors of two text payloads to detect brand drift, hallucination, or paraphrase alignment
            </CardDescription>
          </div>
          <Badge variant="outline" className="text-xs font-mono bg-purple-500/10 text-purple-500 border-purple-500/30 w-fit">
            Normalized Cosine Metric
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-4 pt-0 space-y-4">
        {/* Preset Selector */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-muted-foreground font-mono text-[11px] mr-1">Presets:</span>
          {COMPARISON_PRESETS.map((p, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                setTextA(p.textA);
                setTextB(p.textB);
              }}
              className="px-2 py-1 rounded bg-surface border border-border/60 text-muted-foreground hover:text-foreground hover:border-purple-500/40 text-[11px] transition-colors cursor-pointer"
            >
              {p.title}
            </button>
          ))}
        </div>

        {/* Dual Input Grids */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-blue-500" />
                Text Payload A (Baseline / Reference)
              </label>
              <span className="text-[10px] text-muted-foreground font-mono">
                {textA.length} chars
              </span>
            </div>
            <Textarea
              value={textA}
              onChange={(e) => setTextA(e.target.value)}
              placeholder="Enter reference brand statement or canonical truth..."
              rows={3}
              className="text-xs bg-surface leading-relaxed resize-none"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-purple-500" />
                Text Payload B (Target / LLM Output)
              </label>
              <span className="text-[10px] text-muted-foreground font-mono">
                {textB.length} chars
              </span>
            </div>
            <Textarea
              value={textB}
              onChange={(e) => setTextB(e.target.value)}
              placeholder="Enter generated answer, competitor copy, or variant..."
              rows={3}
              className="text-xs bg-surface leading-relaxed resize-none"
            />
          </div>
        </div>

        {/* Execute Button */}
        <div className="flex justify-end">
          <Button
            onClick={handleCompute}
            disabled={isComputing || !textA.trim() || !textB.trim()}
            className="gap-2 px-5 font-medium cursor-pointer"
          >
            {isComputing ? (
              <>
                <Clock className="size-4 animate-spin" />
                Comparing Vectors...
              </>
            ) : (
              <>
                <ArrowRightLeft className="size-4" />
                Calculate Cosine Distance
              </>
            )}
          </Button>
        </div>

        {/* Visual Score Card */}
        {similarityResult && (
          <div className="p-4 rounded-lg border border-border/60 bg-surface/70 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <p className="text-xs font-medium text-muted-foreground">Cosine Similarity Score</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl font-bold font-display tracking-tight text-foreground">
                    {(similarityResult.similarityScore * 100).toFixed(1)}%
                  </span>
                  <span className="text-xs font-mono text-muted-foreground">
                    ({similarityResult.similarityScore.toFixed(4)})
                  </span>
                </div>
              </div>

              {semanticInfo && (
                <Badge variant="outline" className={`text-xs font-medium px-2.5 py-1 ${semanticInfo.color}`}>
                  {semanticInfo.label}
                </Badge>
              )}
            </div>

            {/* Progress Bar */}
            <div className="space-y-1">
              <div className="w-full bg-surface-elevated rounded-full h-2.5 overflow-hidden border border-border/40">
                <div
                  className="h-full bg-linear-to-r from-blue-500 via-purple-500 to-emerald-500 transition-all duration-500"
                  style={{ width: `${scorePct}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
                <span>0.0 (Orthogonal)</span>
                <span>0.5 (Moderate)</span>
                <span>1.0 (Identical)</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
