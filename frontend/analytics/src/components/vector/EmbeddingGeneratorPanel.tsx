import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Cpu,
  Zap,
  Sparkles,
  Copy,
  Check,
  Clock,
  Layers,
  Hash,
  Terminal,
} from "lucide-react";
import { vectorIntelligenceService } from "@/services";
import type { EmbeddingProvider, VectorEmbeddingResponse } from "@/types";

const PROVIDERS: Array<{
  id: EmbeddingProvider;
  name: string;
  model: string;
  dimension: number;
}> = [
  { id: "OPENAI", name: "OpenAI", model: "text-embedding-3-small", dimension: 1536 },
  { id: "GEMINI", name: "Google Gemini", model: "text-embedding-004", dimension: 768 },
  { id: "VOYAGE", name: "Voyage AI", model: "voyage-3-large", dimension: 1024 },
  { id: "COHERE", name: "Cohere", model: "embed-english-v3.0", dimension: 1024 },
];

export function EmbeddingGeneratorPanel() {
  const [text, setText] = useState(
    "Dyvin AI Enterprise Knowledge Graph: High-dimensional semantic vectors indexing multi-LLM citations and brand authority."
  );
  const [selectedProvider, setSelectedProvider] = useState<EmbeddingProvider>("OPENAI");
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [embeddingResult, setEmbeddingResult] = useState<VectorEmbeddingResponse | null>({
    provider: "OPENAI",
    model: "text-embedding-3-small",
    dimension: 1536,
    tokens: 28,
    vector: [
      0.0241, -0.0152, 0.0483, -0.0091, 0.0315, -0.0227, 0.0189, -0.0412,
      0.0356, -0.0194, 0.0278, -0.0331, 0.0145, -0.0289, 0.0412, -0.0173,
    ],
    latencyMs: 24,
  });

  const handleGenerate = async () => {
    if (!text.trim()) return;
    setIsGenerating(true);
    try {
      const res = await vectorIntelligenceService.generateEmbedding(text.trim(), selectedProvider);
      setEmbeddingResult(res);
      toast.success("Vector embedding generated successfully");
    } catch (err) {
      console.error("Embedding generation failed:", err);
      toast.error("Failed to generate embedding");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyVector = () => {
    if (!embeddingResult?.vector) return;
    navigator.clipboard.writeText(JSON.stringify(embeddingResult.vector));
    setCopied(true);
    toast.success("Vector float array copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const activeProviderMeta = PROVIDERS.find((p) => p.id === selectedProvider);

  return (
    <Card className="border border-border/60 bg-surface-elevated/40 shadow-xs">
      <CardHeader className="p-4 pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Cpu className="size-4.5 text-emerald-500" />
              Live Vector Embedding Generator
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground mt-0.5">
              Transform raw text payloads into normalized high-dimensional dense float arrays using multi-provider engines
            </CardDescription>
          </div>
          <Badge variant="outline" className="text-xs font-mono bg-emerald-500/10 text-emerald-600 border-emerald-500/30 w-fit">
            Dense Float32 Representation
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-4 pt-0 space-y-4">
        {/* Provider Switcher */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground">Select Embedding Provider</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {PROVIDERS.map((p) => {
              const isSelected = selectedProvider === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setSelectedProvider(p.id)}
                  className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                    isSelected
                      ? "border-emerald-500/60 bg-emerald-500/10 shadow-xs"
                      : "border-border/60 bg-surface/60 hover:bg-surface-elevated/60"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-foreground">{p.name}</span>
                    <Badge variant="secondary" className="text-[10px] font-mono">
                      {p.dimension}d
                    </Badge>
                  </div>
                  <p className="text-[11px] text-muted-foreground font-mono truncate mt-1">{p.model}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Input Text Area */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-foreground">Text Payload</label>
            <span className="text-[10px] text-muted-foreground font-mono">
              ~{Math.ceil(text.length / 4)} estimated tokens ({text.length} chars)
            </span>
          </div>
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type or paste text to generate vector embedding..."
            rows={3}
            className="text-xs bg-surface leading-relaxed resize-none"
          />
        </div>

        {/* Action Button */}
        <div className="flex justify-end">
          <Button
            onClick={handleGenerate}
            disabled={isGenerating || !text.trim()}
            className="gap-2 px-5 font-medium cursor-pointer"
          >
            {isGenerating ? (
              <>
                <Clock className="size-4 animate-spin" />
                Generating Float Array...
              </>
            ) : (
              <>
                <Zap className="size-4" />
                Generate {activeProviderMeta?.dimension}d Vector
              </>
            )}
          </Button>
        </div>

        {/* Output Vector Preview */}
        {embeddingResult && (
          <div className="space-y-3 pt-3 border-t border-border/50">
            {/* Meta Row */}
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs bg-surface/60 p-2.5 rounded-lg border border-border/50 font-mono">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-muted-foreground">Provider: <strong className="text-foreground">{embeddingResult.provider}</strong></span>
                <span className="text-muted-foreground">Model: <strong className="text-foreground">{embeddingResult.model}</strong></span>
                <span className="text-muted-foreground">Dimension: <strong className="text-emerald-500">{embeddingResult.dimension}d</strong></span>
                <span className="text-muted-foreground">Tokens: <strong className="text-foreground">{embeddingResult.tokens}</strong></span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-amber-500 font-semibold flex items-center gap-1">
                  <Clock className="size-3" />
                  {embeddingResult.latencyMs} ms
                </span>
                <button
                  type="button"
                  onClick={handleCopyVector}
                  className="flex items-center gap-1 text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  {copied ? <Check className="size-3 text-emerald-500" /> : <Copy className="size-3" />}
                  {copied ? "Copied" : "Copy Array"}
                </button>
              </div>
            </div>

            {/* Float Vector Matrix View */}
            <div className="bg-surface-elevated/80 border border-border/60 rounded-md p-3 space-y-2">
              <div className="flex items-center justify-between text-[11px] text-muted-foreground font-mono">
                <span className="flex items-center gap-1.5">
                  <Terminal className="size-3 text-emerald-500" />
                  Float32 Normalized Vector Preview (First {Math.min(embeddingResult.vector.length, 32)} Elements):
                </span>
                <span>Total Length: {embeddingResult.vector.length}</span>
              </div>
              <div className="font-mono text-[11px] text-muted-foreground/90 overflow-x-auto p-2 bg-surface/80 rounded border border-border/40 custom-scrollbar max-h-36">
                [
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-1.5 my-1 text-center">
                  {embeddingResult.vector.slice(0, 32).map((val, idx) => (
                    <span
                      key={idx}
                      className="px-1.5 py-0.5 rounded bg-surface border border-border/50 text-foreground font-mono text-[10px]"
                    >
                      {val >= 0 ? `+${val.toFixed(4)}` : val.toFixed(4)}
                    </span>
                  ))}
                </div>
                {embeddingResult.vector.length > 32 && (
                  <p className="text-[10px] text-muted-foreground italic mt-1">
                    ... and {embeddingResult.vector.length - 32} more dimensions
                  </p>
                )}
                ]
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
