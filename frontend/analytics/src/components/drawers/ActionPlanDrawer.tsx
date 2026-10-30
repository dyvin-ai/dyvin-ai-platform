import { useState } from "react";
import { toast } from "sonner";
import type { ActionPlanItem } from "@/types";
export type { ActionPlanItem };

interface ActionPlanDrawerProps {
  plan: ActionPlanItem | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus?: (id: string, newStatus: ActionPlanItem["status"]) => void;
}

export function ActionPlanDrawer({ plan, isOpen, onClose, onUpdateStatus }: ActionPlanDrawerProps) {
  const [status, setStatus] = useState<ActionPlanItem["status"]>(plan?.status || "Not started");

  if (!isOpen || !plan) return null;

  const handleSave = () => {
    if (onUpdateStatus && plan.id) {
      onUpdateStatus(plan.id, status);
    }
    toast.success(`Saved action plan status as: ${status}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-surface border-l border-border h-full overflow-y-auto p-6 flex flex-col justify-between shadow-2xl">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between gap-4 border-b border-border pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 font-mono text-[10px] font-semibold px-2 py-0.5 border border-amber-500/20">
                  {plan.priority} ACTION PLAN
                </span>
                <span className="rounded bg-surface-subtle border border-border px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
                  Impact: {plan.impact}
                </span>
              </div>
              <h2 className="mt-2 text-lg font-semibold text-foreground leading-snug">{plan.title}</h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-border p-1.5 text-muted-foreground hover:text-foreground hover:bg-surface-subtle transition-colors cursor-pointer"
            >
              ✕
            </button>
          </div>

          {/* Goal & Target Metric */}
          <div className="rounded-lg border border-border bg-surface-subtle p-4 space-y-3">
            <span className="text-[10px] uppercase font-mono tracking-wider text-muted-foreground">Objective & Target Metric</span>
            <p className="text-xs font-medium text-foreground">{plan.goal}</p>

            {/* Baseline -> Target -> Gap Matrix */}
            <div className="grid grid-cols-3 gap-2 rounded border border-border bg-surface p-3 text-center">
              <div>
                <span className="text-[9px] uppercase font-mono text-muted-foreground">Baseline</span>
                <p className="font-mono text-xs font-semibold text-foreground mt-0.5">{plan.baseline || "68.4%"}</p>
              </div>
              <div>
                <span className="text-[9px] uppercase font-mono text-muted-foreground">Target</span>
                <p className="font-mono text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5">{plan.target || "72.0%"}</p>
              </div>
              <div>
                <span className="text-[9px] uppercase font-mono text-muted-foreground">Gap</span>
                <p className="font-mono text-xs font-semibold text-muted-foreground mt-0.5">{plan.gap || "+3.6 pts"}</p>
              </div>
            </div>
          </div>

          {/* Evidence */}
          <div className="space-y-2">
            <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Supporting Evidence</span>
            <div className="rounded-lg border border-border bg-surface-subtle p-3.5 text-xs text-muted-foreground leading-relaxed">
              "{plan.evidence}"
            </div>
          </div>

          {/* Execution Specs */}
          <div className="grid grid-cols-3 gap-3 rounded-lg border border-border bg-surface-subtle p-3 text-center">
            <div>
              <span className="text-[10px] uppercase tracking-wider font-mono text-muted-foreground">Priority</span>
              <p className="font-mono text-xs font-semibold text-foreground mt-1">{plan.priority}</p>
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider font-mono text-muted-foreground">Impact</span>
              <p className="font-mono text-xs font-semibold text-foreground mt-1">{plan.impact}</p>
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider font-mono text-muted-foreground">Effort</span>
              <p className="font-mono text-xs font-semibold text-foreground mt-1">{plan.effort}</p>
            </div>
          </div>

          {/* Action Status Selection */}
          <div className="space-y-2">
            <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Workflow Execution Status</span>
            <div className="flex items-center gap-2">
              {(["Not started", "In progress", "Complete"] as const).map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setStatus(st)}
                  className={`flex-1 py-2 rounded-md text-xs font-medium border transition-colors cursor-pointer ${
                    status === st
                      ? "border-foreground bg-foreground text-background"
                      : "border-border bg-surface text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-6 border-t border-border flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Dyvin AI Action Framework</span>
          <button
            type="button"
            onClick={handleSave}
            className="rounded-md border border-border bg-foreground text-background px-4 py-2 text-xs font-medium hover:bg-foreground/90 transition-colors cursor-pointer"
          >
            Save Progress
          </button>
        </div>
      </div>
    </div>
  );
}
