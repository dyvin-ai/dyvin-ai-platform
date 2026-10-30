import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Layers, Sparkles, Copy, Check, CheckCircle2, AlertTriangle, ArrowRight } from "lucide-react";
import type { ConflictItemData } from "./ConflictTable";

interface SemanticDifferenceViewerProps {
  conflict: ConflictItemData | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SemanticDifferenceViewer({
  conflict,
  open,
  onOpenChange,
}: SemanticDifferenceViewerProps) {
  const [copied, setCopied] = useState(false);
  const [isAligning, setIsAligning] = useState(false);

  if (!conflict) return null;

  const sampleSchema = `{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Dyvin AI",
  "url": "https://dyvin.ai",
  "sameAs": [
    "https://twitter.com/dyvin_ai",
    "https://linkedin.com/company/dyvin-ai"
  ],
  "description": "Enterprise AI search intelligence and generative engine optimization platform.",
  "knowsAbout": [
    "AI Search Optimization",
    "Generative Engine Optimization",
    "Perplexity Sonar Visibility",
    "Citation Network Analysis"
  ]
}`;

  const handleCopySchema = () => {
    navigator.clipboard.writeText(sampleSchema);
    setCopied(true);
    toast.success("Canonical JSON-LD Schema copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAutoAlign = () => {
    setIsAligning(true);
    setTimeout(() => {
      setIsAligning(false);
      toast.success("Automated Statement Alignment queued", {
        description: "Canonical JSON-LD schema update and crawler ping scheduled for active project.",
      });
      onOpenChange(false);
    }, 600);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-surface border-border p-6 space-y-5">
        <DialogHeader className="space-y-1.5 border-b border-border/60 pb-3">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2 text-foreground text-base font-semibold">
              <div className="p-1.5 rounded-md bg-primary/10 text-primary">
                <Layers className="size-4" />
              </div>
              Semantic Difference & Statement Alignment
            </DialogTitle>
            <Badge
              variant="outline"
              className={`text-[10px] font-mono uppercase ${
                conflict.severity === "HIGH"
                  ? "bg-rose-500/10 text-rose-500 border-rose-500/25"
                  : conflict.severity === "MEDIUM"
                  ? "bg-amber-500/10 text-amber-500 border-amber-500/25"
                  : "bg-emerald-500/10 text-emerald-600 border-emerald-500/25"
              }`}
            >
              {conflict.severity} SEVERITY
            </Badge>
          </div>
          <DialogDescription className="text-xs text-muted-foreground">
            {conflict.topic} — Delta Divergence: {conflict.conflictDelta}%
          </DialogDescription>
        </DialogHeader>

        {/* Side-by-side statement view */}
        <div className="space-y-3">
          <h4 className="text-xs font-semibold text-foreground tracking-tight uppercase">
            Model Assertion Comparison
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-surface-subtle/50 border border-border/80 space-y-1.5">
              <span className="font-semibold text-primary block text-[11px] uppercase tracking-wider">
                {conflict.modelA}
              </span>
              <p className="text-muted-foreground text-[11px] leading-relaxed italic">
                "{conflict.statementA}"
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-surface-subtle/50 border border-border/80 space-y-1.5">
              <span className="font-semibold text-indigo-400 block text-[11px] uppercase tracking-wider">
                {conflict.modelB}
              </span>
              <p className="text-muted-foreground text-[11px] leading-relaxed italic">
                "{conflict.statementB}"
              </p>
            </div>
          </div>
        </div>

        {/* Semantic Alignment Recommendation */}
        <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 space-y-2">
          <div className="flex items-center gap-2">
            <Sparkles className="size-4 text-primary" />
            <h4 className="text-xs font-semibold text-foreground">
              Statement Alignment Recommendation
            </h4>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {conflict.recommendation ||
              "Injecting canonical Organization JSON-LD schema with explicitly declared entity relationships forces AI answer engines to converge on 100% factual consensus."}
          </p>
        </div>

        {/* JSON-LD Schema Snippet */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-muted-foreground">Target Schema.org Payload</span>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-[11px] gap-1 px-2 text-muted-foreground hover:text-foreground"
              onClick={handleCopySchema}
            >
              {copied ? <Check className="size-3 text-emerald-500" /> : <Copy className="size-3" />}
              {copied ? "Copied" : "Copy JSON-LD"}
            </Button>
          </div>
          <pre className="p-3 rounded-lg bg-surface-subtle border border-border/60 text-[11px] font-mono text-muted-foreground overflow-x-auto max-h-36">
            {sampleSchema}
          </pre>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-border/60">
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button
            size="sm"
            className="gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90"
            disabled={isAligning}
            onClick={handleAutoAlign}
          >
            <Sparkles className="size-3.5" />
            {isAligning ? "Queuing Alignment..." : "Auto-Align Statements"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
