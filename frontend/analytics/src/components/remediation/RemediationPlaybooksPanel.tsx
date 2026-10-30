import { Play, Sparkles, BookOpen, ChevronRight, ArrowRight, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { RemediationPlaybookItem } from "@/types";

interface RemediationPlaybooksPanelProps {
  playbooks?: RemediationPlaybookItem[] | null;
  isLoading?: boolean;
  onDispatchPlaybook: (playbook: RemediationPlaybookItem) => void;
}

export function RemediationPlaybooksPanel({
  playbooks,
  isLoading,
  onDispatchPlaybook,
}: RemediationPlaybooksPanelProps) {
  const playbookList: RemediationPlaybookItem[] =
    playbooks && playbooks.length > 0
      ? playbooks
      : [
          {
            name: "Recover Visibility Playbook",
            category: "RECOVER_VISIBILITY",
            description: "3-step automated strategy to recover lost citations and visibility.",
            steps: ["Audit lost citations", "Generate JSON-LD Organization Schema", "Deploy FAQ Knowledge Expansion"],
          },
          {
            name: "Beat Competitor Playbook",
            category: "BEAT_COMPETITOR",
            description: "Targeted actions to counter competitor brand expansion in AI Search engines.",
            steps: ["Generate Comparison Landing Page", "Generate Product Page Schema", "Run Authority Outreach Campaign"],
          },
          {
            name: "Improve AI Search Playbook",
            category: "IMPROVE_AI_SEARCH",
            description: "Improve prompt coverage and citation probability across foundation models.",
            steps: ["Fill Knowledge Gaps", "Expand Entity Graph References", "Generate Technical Documentation"],
          },
        ];

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-border bg-surface p-6 shadow-xs animate-pulse space-y-4">
        <div className="h-6 bg-surface-subtle rounded w-1/3" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-44 bg-surface-subtle/50 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-surface p-5 sm:p-6 shadow-xs space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            <BookOpen className="size-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold tracking-tight text-foreground">
              Autonomous Remediation Playbooks
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Standardized, multi-step optimization recipes curated for answer engine dominance
            </p>
          </div>
        </div>

        <Badge variant="outline" className="font-mono text-xs">
          {playbookList.length} Playbooks Ready
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {playbookList.map((pb) => {
          const categoryBadge =
            pb.category === "RECOVER_VISIBILITY"
              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/25"
              : pb.category === "BEAT_COMPETITOR"
              ? "bg-rose-500/10 text-rose-500 border-rose-500/25"
              : "bg-blue-500/10 text-blue-500 border-blue-500/25";

          return (
            <div
              key={pb.name}
              className="p-4 rounded-xl border border-border/80 bg-surface-subtle/30 flex flex-col justify-between space-y-4 hover:border-primary/40 transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-semibold text-foreground text-sm leading-snug">
                    {pb.name}
                  </h4>
                  <Badge variant="outline" className={`text-[10px] font-mono shrink-0 uppercase ${categoryBadge}`}>
                    {pb.category.replace(/_/g, " ")}
                  </Badge>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed">
                  {pb.description}
                </p>

                {/* Steps List */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground block">
                    Execution Pipeline:
                  </span>
                  <div className="space-y-1 text-xs">
                    {pb.steps.map((step, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-foreground/90 text-[11px]">
                        <span className="size-4 rounded-full bg-primary/10 text-primary font-mono text-[10px] flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <span className="truncate">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-border/40 flex justify-end">
                <Button
                  size="sm"
                  className="w-full text-xs h-8 gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90"
                  onClick={() => onDispatchPlaybook(pb)}
                >
                  <Play className="size-3" />
                  Dispatch Playbook
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
