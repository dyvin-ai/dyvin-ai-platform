import type { CitationSource } from "@/types";
import { TrendBadge } from "@/components/analytics/TrendBadge";

interface SourceDetailDrawerProps {
  source: CitationSource | null;
  isOpen: boolean;
  onClose: () => void;
}

export function SourceDetailDrawer({ source, isOpen, onClose }: SourceDetailDrawerProps) {
  if (!isOpen || !source) return null;

  const modelsCiting = ["ChatGPT", "Claude", "Gemini", "Perplexity"];
  const topPrompts = [
    "Best AI search visibility platform for enterprise teams",
    "Dyvin vs Atlas AI for citation intelligence",
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-surface border-l border-border h-full overflow-y-auto p-6 flex flex-col justify-between shadow-2xl">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between gap-4 border-b border-border pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded bg-surface-subtle px-2 py-0.5 font-mono text-[11px] border border-border text-muted-foreground">
                  {source.category || "Editorial"}
                </span>
                {source.opportunityStatus && (
                  <span className="rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono text-[10px] font-semibold px-2 py-0.5 border border-emerald-500/20">
                    {source.opportunityStatus}
                  </span>
                )}
              </div>
              <h2 className="mt-2 text-xl font-mono font-semibold text-foreground">{source.domain}</h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-border p-1.5 text-muted-foreground hover:text-foreground hover:bg-surface-subtle transition-colors cursor-pointer"
            >
              ✕
            </button>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-3 gap-3 rounded-lg border border-border bg-surface-subtle p-4 text-center">
            <div>
              <span className="text-[10px] uppercase tracking-wider font-mono text-muted-foreground">Citations</span>
              <p className="font-mono text-lg font-semibold tnum mt-0.5">{source.citations}</p>
              <TrendBadge value={source.change} className="mt-1 justify-center" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider font-mono text-muted-foreground">Share</span>
              <p className="font-mono text-lg font-semibold tnum mt-0.5">{source.share}%</p>
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider font-mono text-muted-foreground">Authority</span>
              <p className="font-mono text-lg font-semibold tnum mt-0.5">{source.authority}</p>
            </div>
          </div>

          {/* Intelligence Graph Mapping */}
          <div className="rounded-lg border border-border bg-surface-subtle p-4 space-y-3">
            <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Citation Intelligence Mapping</span>
            <div className="flex items-center justify-between text-xs font-mono py-2 border-y border-border/60">
              <span className="text-foreground">{source.domain}</span>
              <span className="text-muted-foreground">→</span>
              <span className="text-foreground">AI Models</span>
              <span className="text-muted-foreground">→</span>
              <span className="text-foreground">Dyvin AI Visibility</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Citations from {source.domain} directly influence brand presence across {modelsCiting.length} AI answer engines.
            </p>
          </div>

          {/* Models Citing */}
          <div className="space-y-2">
            <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Citing AI Models</span>
            <div className="flex flex-wrap gap-2">
              {modelsCiting.map((m) => (
                <span key={m} className="rounded bg-surface-subtle border border-border px-2.5 py-1 text-xs font-medium text-foreground">
                  {m}
                </span>
              ))}
            </div>
          </div>

          {/* Prompts Citing This Domain */}
          <div className="space-y-2">
            <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Prompts Influenced</span>
            <div className="space-y-2">
              {topPrompts.map((p) => (
                <div key={p} className="rounded-lg border border-border bg-surface-subtle p-3 text-xs text-foreground font-medium">
                  {p}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-6 border-t border-border flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Source ID: {source.id}</span>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-border bg-surface-subtle px-4 py-2 text-xs font-medium text-foreground hover:bg-surface transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
