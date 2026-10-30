import { useState } from "react";
import type { PromptPerformance } from "@/types";
import { TrendBadge } from "@/components/analytics/TrendBadge";
import { promptsService } from "@/services";
import { ArrowRight, CheckCircle2, Loader2, Sparkles } from "lucide-react";

interface PromptDetailDrawerProps {
  prompt: PromptPerformance | null;
  isOpen: boolean;
  onClose: () => void;
}

export function PromptDetailDrawer({ prompt, isOpen, onClose }: PromptDetailDrawerProps) {
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionResult, setExecutionResult] = useState<any | null>(null);
  const [executionError, setExecutionError] = useState<string | null>(null);

  if (!isOpen || !prompt) return null;

  const handleExecute = async () => {
    setIsExecuting(true);
    setExecutionError(null);
    try {
      const result = await promptsService.executePrompt(prompt.id);
      setExecutionResult(result);
    } catch (err) {
      setExecutionError(err instanceof Error ? err.message : "Failed to execute prompt.");
    } finally {
      setIsExecuting(false);
    }
  };

  const currentAnswer = executionResult?.answerText || prompt.answerSnapshot || "AI answer generated across ChatGPT and Claude models.";

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-surface border-l border-border h-full overflow-y-auto p-6 flex flex-col justify-between shadow-2xl">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between gap-4 border-b border-border pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded bg-surface-subtle px-2 py-0.5 font-mono text-[11px] border border-border text-muted-foreground">
                  {prompt.category}
                </span>
                {prompt.priority && (
                  <span className="rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 font-mono text-[10px] font-semibold px-2 py-0.5 border border-amber-500/20">
                    {prompt.priority} PRIORITY
                  </span>
                )}
                {executionResult && (
                  <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-500 font-semibold">
                    <CheckCircle2 className="size-3" /> Live Executed
                  </span>
                )}
              </div>
              <h2 className="mt-2 text-base font-semibold text-foreground leading-snug">{prompt.prompt}</h2>
            </div>
            <button
              type="button"
              onClick={() => {
                setExecutionResult(null);
                setExecutionError(null);
                onClose();
              }}
              className="rounded-md border border-border p-1.5 text-muted-foreground hover:text-foreground hover:bg-surface-subtle transition-colors cursor-pointer"
            >
              ✕
            </button>
          </div>

          {/* Metric Bar */}
          <div className="grid grid-cols-3 gap-3 rounded-lg border border-border bg-surface-subtle p-3.5 text-center">
            <div>
              <span className="text-[10px] uppercase tracking-wider font-mono text-muted-foreground">Visibility</span>
              <p className="font-mono text-lg font-semibold tnum mt-0.5">{prompt.visibility}%</p>
              <TrendBadge value={prompt.change} className="mt-1 justify-center" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider font-mono text-muted-foreground">Avg. Rank</span>
              <p className="font-mono text-lg font-semibold tnum mt-0.5">#{prompt.position}</p>
              <span className="text-[11px] text-muted-foreground mt-1 block">
                {prompt.mentioned ? "Mentioned" : "Not Cited"}
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider font-mono text-muted-foreground">Sentiment</span>
              <p
                className={`font-mono text-xs font-semibold capitalize mt-1.5 ${
                  prompt.sentiment === "positive"
                    ? "text-emerald-600 dark:text-emerald-400"
                    : prompt.sentiment === "negative"
                    ? "text-rose-600 dark:text-rose-400"
                    : "text-muted-foreground"
                }`}
              >
                {prompt.sentiment}
              </p>
            </div>
          </div>

          {/* AI Execution & Answer Snapshot */}
          <div className="rounded-lg border border-border bg-surface-subtle p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Sparkles className="size-3.5 text-brand" />
                Live AI Search Execution
              </span>
              {executionResult?.latencyMs && (
                <span className="text-[10px] font-mono text-muted-foreground">
                  {executionResult.latencyMs}ms · {executionResult.providerCode || "GPT-4o"}
                </span>
              )}
            </div>

            <div className="rounded border border-border bg-surface p-3 text-xs text-foreground/90 leading-relaxed font-mono">
              "{currentAnswer}"
            </div>

            {executionError && (
              <p className="text-xs text-rose-500">{executionError}</p>
            )}

            <button
              type="button"
              onClick={handleExecute}
              disabled={isExecuting}
              className="w-full flex items-center justify-center gap-2 rounded-md border border-border bg-foreground text-background px-3 py-2 text-xs font-medium hover:bg-foreground/90 transition-colors cursor-pointer disabled:opacity-50"
            >
              {isExecuting ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  Executing AI Query across Models...
                </>
              ) : (
                <>
                  {executionResult ? "Re-run Live AI Execution" : "Execute Live AI Query"}
                  <ArrowRight className="size-3.5" />
                </>
              )}
            </button>
          </div>

          {/* Competitors Present */}
          {prompt.competitorsPresent && prompt.competitorsPresent.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Competitors Detected</span>
              <div className="flex flex-wrap gap-2">
                {prompt.competitorsPresent.map((c) => (
                  <span key={c} className="rounded bg-surface-subtle border border-border px-2.5 py-1 text-xs font-medium text-foreground">
                    {c}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Influencing Sources */}
          {prompt.influencingSources && prompt.influencingSources.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Influencing Sources</span>
              <div className="flex flex-wrap gap-2">
                {prompt.influencingSources.map((s) => (
                  <span key={s} className="rounded bg-surface-subtle border border-border px-2.5 py-1 text-xs font-mono text-muted-foreground">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Actionable Opportunity */}
          {prompt.opportunity && (
            <div className="rounded-lg border border-border bg-surface-subtle p-4 space-y-2">
              <span className="text-xs font-mono uppercase tracking-wider text-foreground font-semibold">Recommended Action</span>
              <p className="text-xs text-muted-foreground leading-relaxed">{prompt.opportunity}</p>
              <div className="pt-2 flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Estimated Impact: +4–8 pts</span>
                <button
                  type="button"
                  onClick={() => alert(`Created optimization workflow for: ${prompt.prompt}`)}
                  className="font-medium text-foreground hover:underline cursor-pointer"
                >
                  Create Action Plan →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Action */}
        <div className="pt-6 border-t border-border flex items-center justify-between">
          <span className="text-xs text-muted-foreground font-mono">Prompt ID: {prompt.id.slice(0, 8)}...</span>
          <button
            type="button"
            onClick={() => {
              setExecutionResult(null);
              setExecutionError(null);
              onClose();
            }}
            className="rounded-md border border-border bg-surface-subtle px-4 py-2 text-xs font-medium text-foreground hover:bg-surface transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
