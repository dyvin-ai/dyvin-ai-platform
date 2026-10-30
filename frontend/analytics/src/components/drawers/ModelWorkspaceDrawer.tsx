import type { ModelPerformance } from "@/types";
import { TrendBadge } from "@/components/analytics/TrendBadge";

interface ModelWorkspaceDrawerProps {
  model: ModelPerformance | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ModelWorkspaceDrawer({ model, isOpen, onClose }: ModelWorkspaceDrawerProps) {
  if (!isOpen || !model) return null;

  const strongestPrompts = [
    "Best AI search visibility platform for enterprise teams",
    "Dyvin vs Atlas AI for citation intelligence",
  ];

  const weakestPrompts = [
    "Enterprise reporting for generative search performance",
    "AI answer engine optimization checklist",
  ];

  const topSources = ["techcrunch.com", "g2.com", "searchengineland.com"];

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-surface border-l border-border h-full overflow-y-auto p-6 flex flex-col justify-between shadow-2xl">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between gap-4 border-b border-border pb-4">
            <div>
              <span className="rounded bg-surface-subtle px-2 py-0.5 font-mono text-[11px] border border-border text-muted-foreground">
                Model Workspace Audit
              </span>
              <h2 className="mt-2 text-xl font-semibold text-foreground">{model.name}</h2>
              <p className="mt-1 text-xs text-muted-foreground">Specific LLM Model Intelligence Workspace</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-border p-1.5 text-muted-foreground hover:text-foreground hover:bg-surface-subtle transition-colors cursor-pointer"
            >
              ✕
            </button>
          </div>

          {/* Metric Bar */}
          <div className="grid grid-cols-4 gap-2 rounded-lg border border-border bg-surface-subtle p-3 text-center">
            <div>
              <span className="text-[9px] uppercase font-mono tracking-wider text-muted-foreground">Visibility</span>
              <p className="font-mono text-base font-semibold tnum mt-0.5">{model.visibility}%</p>
              <TrendBadge value={model.change} className="mt-1 justify-center" />
            </div>
            <div>
              <span className="text-[9px] uppercase font-mono tracking-wider text-muted-foreground">Rank</span>
              <p className="font-mono text-base font-semibold tnum mt-0.5">#{model.avgPosition}</p>
            </div>
            <div>
              <span className="text-[9px] uppercase font-mono tracking-wider text-muted-foreground">Mentions</span>
              <p className="font-mono text-base font-semibold tnum mt-0.5">{model.mentions}</p>
            </div>
            <div>
              <span className="text-[9px] uppercase font-mono tracking-wider text-muted-foreground">Sentiment</span>
              <p className="font-mono text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-1">{model.sentiment}%</p>
            </div>
          </div>

          {/* Strongest Prompts */}
          <div className="space-y-2">
            <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Strongest Prompts on {model.name}</span>
            <div className="space-y-2">
              {strongestPrompts.map((p) => (
                <div key={p} className="rounded-lg border border-border bg-surface-subtle p-3 text-xs text-foreground font-medium flex items-center justify-between">
                  <span>{p}</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-mono text-[11px] font-semibold">Rank #1</span>
                </div>
              ))}
            </div>
          </div>

          {/* Weakest Prompts */}
          <div className="space-y-2">
            <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Weakest Prompts on {model.name}</span>
            <div className="space-y-2">
              {weakestPrompts.map((p) => (
                <div key={p} className="rounded-lg border border-border bg-surface-subtle p-3 text-xs text-foreground font-medium flex items-center justify-between">
                  <span>{p}</span>
                  <span className="text-rose-600 dark:text-rose-400 font-mono text-[11px] font-semibold">Rank #5+</span>
                </div>
              ))}
            </div>
          </div>

          {/* Influencing Sources */}
          <div className="space-y-2">
            <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Influencing Citation Sources</span>
            <div className="flex flex-wrap gap-2">
              {topSources.map((s) => (
                <span key={s} className="rounded bg-surface-subtle border border-border px-2.5 py-1 text-xs font-mono text-muted-foreground">
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Recommendation */}
          <div className="rounded-lg border border-border bg-surface-subtle p-4 space-y-2">
            <span className="text-xs font-mono uppercase tracking-wider text-foreground font-semibold">Model Optimization Recommendation</span>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Target citation sources on TechCrunch and G2 to capture top answer paragraphs on {model.name}.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-6 border-t border-border flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Model ID: {model.id}</span>
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
