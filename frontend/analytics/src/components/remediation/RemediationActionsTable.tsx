import { useState } from "react";
import {
  ListFilter,
  Play,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ChevronRight,
  ShieldAlert,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { RemediationActionItem } from "@/types";

interface RemediationActionsTableProps {
  actions?: RemediationActionItem[] | null;
  isLoading?: boolean;
  onRunAction: (action: RemediationActionItem) => void;
  onViewArtifacts: (action: RemediationActionItem) => void;
}

export function RemediationActionsTable({
  actions,
  isLoading,
  onRunAction,
  onViewArtifacts,
}: RemediationActionsTableProps) {
  const [filterStatus, setFilterStatus] = useState<string>("ALL");

  const actionList = actions || [];
  const filteredActions =
    filterStatus === "ALL"
      ? actionList
      : actionList.filter((a) => a.status === filterStatus);

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-border bg-surface p-6 shadow-xs animate-pulse space-y-4">
        <div className="h-6 bg-surface-subtle rounded w-1/3" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-surface-subtle/50 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-surface p-5 sm:p-6 shadow-xs space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-500">
            <ListFilter className="size-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold tracking-tight text-foreground">
              Remediation Action Execution Queue
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Live status, execution history, and artifact output of queued autonomous remediation tasks
            </p>
          </div>
        </div>

        {/* Filter Badges */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {["ALL", "PENDING", "RUNNING", "COMPLETED"].map((st) => (
            <Button
              key={st}
              size="sm"
              variant={filterStatus === st ? "default" : "outline"}
              className="text-xs h-7 px-2.5"
              onClick={() => setFilterStatus(st)}
            >
              {st}
            </Button>
          ))}
        </div>
      </div>

      {actionList.length > 0 ? (
        <div className="space-y-3">
          {filteredActions.map((act) => {
            const isCompleted = act.status === "COMPLETED";
            const isRunning = act.status === "RUNNING";
            const isPending = act.status === "PENDING" || act.status === "WAITING_APPROVAL";

            const statusBadge = isCompleted
              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/25"
              : isRunning
              ? "bg-amber-500/10 text-amber-500 border-amber-500/25 animate-pulse"
              : "bg-blue-500/10 text-blue-500 border-blue-500/25";

            const priorityBadge =
              act.priority === "CRITICAL"
                ? "bg-rose-500/10 text-rose-500 border-rose-500/25"
                : act.priority === "HIGH"
                ? "bg-amber-500/10 text-amber-500 border-amber-500/25"
                : "bg-surface-subtle text-muted-foreground border-border";

            return (
              <div
                key={act.id}
                className="p-4 rounded-xl border border-border/80 bg-surface-subtle/30 space-y-3 hover:border-primary/40 transition-all"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={`text-[10px] font-mono font-bold uppercase ${statusBadge}`}>
                      {act.status}
                    </Badge>
                    <Badge variant="outline" className={`text-[10px] font-mono font-bold uppercase ${priorityBadge}`}>
                      {act.priority} PRIORITY
                    </Badge>
                    <h4 className="font-semibold text-foreground text-xs sm:text-sm">
                      {act.title}
                    </h4>
                  </div>

                  <span className="font-mono text-[11px] text-muted-foreground">
                    Type: <strong className="text-foreground">{act.type.replace(/_/g, " ")}</strong>
                  </span>
                </div>

                {act.description && (
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {act.description}
                  </p>
                )}

                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-border/40 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5 text-[11px] font-mono">
                    <Clock className="size-3 text-muted-foreground" />
                    {new Date(act.createdAt).toLocaleString()}
                  </span>

                  <div className="flex items-center gap-2">
                    {isPending && (
                      <Button
                        size="sm"
                        className="text-xs h-7 gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90"
                        onClick={() => onRunAction(act)}
                      >
                        <Play className="size-3" />
                        Run Remediation
                      </Button>
                    )}

                    {isRunning && (
                      <Badge variant="outline" className="text-xs h-7 px-2.5 gap-1.5 text-amber-500 bg-amber-500/10 border-amber-500/30">
                        <Clock className="size-3 animate-spin" />
                        Executing Worker...
                      </Badge>
                    )}

                    {isCompleted && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs h-7 gap-1.5 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/10"
                        onClick={() => onViewArtifacts(act)}
                      >
                        <FileText className="size-3" />
                        View Generated Artifact
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-8 rounded-xl border border-dashed border-border bg-surface-subtle/20 text-center space-y-3">
          <div className="mx-auto size-11 rounded-full bg-surface-subtle flex items-center justify-center text-muted-foreground">
            <CheckCircle2 className="size-6 text-emerald-500" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-semibold text-foreground">
              Remediation Queue Clean
            </h4>
            <p className="text-xs text-muted-foreground max-w-md mx-auto leading-relaxed">
              No pending remediation tasks in the execution queue. Dispatch any playbook above to initiate an automated optimization cycle.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
