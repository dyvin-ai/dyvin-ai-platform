import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sparkles,
  Copy,
  Check,
  BookOpen,
  Wand2,
  FileText,
  SlidersHorizontal,
} from "lucide-react";
import type { PromptLibraryItem, PromptTemplateItem, PromptTemplateType } from "@/types";

interface GenerativePromptConsoleCardProps {
  promptLibrary: PromptLibraryItem[];
  templates: PromptTemplateItem[];
  isLoading?: boolean;
  onGeneratePrompt?: (keyword: string, templateType: PromptTemplateType) => Promise<void>;
  isGenerating?: boolean;
}

export function GenerativePromptConsoleCard({
  promptLibrary,
  templates,
  isLoading = false,
  onGeneratePrompt,
  isGenerating = false,
}: GenerativePromptConsoleCardProps) {
  const [selectedKeyword, setSelectedKeyword] = useState("enterprise ai search visibility");
  const [selectedTemplate, setSelectedTemplate] = useState<PromptTemplateType>("COMPARISON");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleGenerate = async () => {
    if (!onGeneratePrompt || !selectedKeyword.trim()) return;
    await onGeneratePrompt(selectedKeyword.trim(), selectedTemplate);
  };

  const getTemplateBadge = (type: PromptTemplateType) => {
    switch (type) {
      case "COMPARISON":
        return <Badge variant="outline" className="border-purple-500/40 text-purple-400 bg-purple-500/10">Comparison</Badge>;
      case "FAQ":
        return <Badge variant="outline" className="border-blue-500/40 text-blue-400 bg-blue-500/10">FAQ</Badge>;
      case "BUYER":
        return <Badge variant="outline" className="border-emerald-500/40 text-emerald-400 bg-emerald-500/10">Buyer Guide</Badge>;
      case "PROBLEM":
        return <Badge variant="outline" className="border-amber-500/40 text-amber-400 bg-amber-500/10">Problem</Badge>;
      case "PRICING":
        return <Badge variant="outline" className="border-cyan-500/40 text-cyan-400 bg-cyan-500/10">Pricing</Badge>;
      case "ALTERNATIVE":
        return <Badge variant="outline" className="border-rose-500/40 text-rose-400 bg-rose-500/10">Alternative</Badge>;
      default:
        return <Badge variant="outline" className="border-zinc-500/40 text-zinc-300 bg-zinc-500/10">General</Badge>;
    }
  };

  return (
    <Card className="border border-border/50 bg-card/60 backdrop-blur-sm">
      <CardHeader className="p-6 pb-4 border-b border-border/40">
        <div>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Wand2 className="w-5 h-5 text-indigo-400" />
            Generative Prompt Synthesis & Library
          </CardTitle>
          <CardDescription className="text-sm mt-0.5">
            Craft high-fidelity prompts designed to evaluate and optimize generative engine citations across models.
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        {/* Interactive Synthesis Console */}
        <div className="p-4 rounded-xl border border-indigo-500/30 bg-indigo-950/10 space-y-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400">
            <Sparkles className="w-4 h-4" />
            Synthesize Evaluation Prompt
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-2">
              <label className="text-xs text-muted-foreground block mb-1">Target Keyword Query</label>
              <Input
                value={selectedKeyword}
                onChange={(e) => setSelectedKeyword(e.target.value)}
                placeholder="Enter query, e.g. best ai search platform"
                className="h-9 text-xs bg-background/50 border-border/60"
              />
            </div>

            <div>
              <label className="text-xs text-muted-foreground block mb-1">Prompt Template</label>
              <select
                value={selectedTemplate}
                onChange={(e) => setSelectedTemplate(e.target.value as PromptTemplateType)}
                aria-label="Prompt Template"
                className="w-full h-9 rounded-md border border-border/60 bg-background/50 px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              >
                <option value="COMPARISON">Head-to-Head Comparison</option>
                <option value="FAQ">FAQ & Knowledge</option>
                <option value="BUYER">Buyer Guide & Matrix</option>
                <option value="PROBLEM">Problem & Remediation</option>
                <option value="PRICING">Pricing & Valuation</option>
                <option value="ALTERNATIVE">Alternative & Disruptor</option>
                <option value="GENERAL">General Overview</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              size="sm"
              onClick={handleGenerate}
              disabled={isGenerating || !selectedKeyword.trim()}
              className="gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs"
            >
              <Sparkles className={`w-3.5 h-3.5 ${isGenerating ? "animate-spin" : ""}`} />
              {isGenerating ? "Generating..." : "Synthesize Prompt"}
            </Button>
          </div>
        </div>

        {/* Saved Prompt Library */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-muted-foreground" />
              Prompt Library ({promptLibrary.length})
            </h4>
            <span className="text-xs text-muted-foreground">Ordered by test usage frequency</span>
          </div>

          {isLoading ? (
            <div className="py-6 text-center text-xs text-muted-foreground animate-pulse">
              Loading prompt library...
            </div>
          ) : promptLibrary.length === 0 ? (
            <div className="py-6 text-center text-xs text-muted-foreground">
              No prompts synthesized yet.
            </div>
          ) : (
            <div className="space-y-3">
              {promptLibrary.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-xl border border-border/40 bg-background/40 hover:border-indigo-500/30 transition-all duration-200 space-y-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-xs text-foreground">{item.title}</span>
                      {getTemplateBadge(item.templateType)}
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-muted-foreground text-[11px]">{item.usageCount} tests</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleCopy(item.id, item.promptText)}
                        className="h-7 w-7 text-muted-foreground hover:text-foreground"
                      >
                        {copiedId === item.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground bg-muted/20 p-2.5 rounded-lg border border-border/20 font-mono">
                    "{item.promptText}"
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
