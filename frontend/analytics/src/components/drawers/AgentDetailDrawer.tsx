import { useState } from "react";
import { Link } from "@tanstack/react-router";
import type { AgentDefinition, AgentRunResult } from "@/types";
import {
  ArrowUpRight,
  Bot,
  CheckCircle2,
  Clock,
  Compass,
  Link2,
  MessageSquareText,
  Pause,
  Play,
  Radar,
  RefreshCw,
  Sparkles,
  Users,
  X,
  Zap,
} from "lucide-react";

interface AgentDetailDrawerProps {
  agent: AgentDefinition | null;
  isOpen: boolean;
  onClose: () => void;
  onRunNow?: (agentId: string) => Promise<void> | void;
  onToggleStatus?: (agentId: string, enabled: boolean) => Promise<void> | void;
  isRunning?: boolean;
  runs?: AgentRunResult[];
}

export function AgentDetailDrawer({
  agent,
  isOpen,
  onClose,
  onRunNow,
  onToggleStatus,
  isRunning = false,
  runs = [],
}: AgentDetailDrawerProps) {
  if (!isOpen || !agent) return null;

  const result = agent.lastResult;

  const typeIcons: Record<string, any> = {
    VISIBILITY: Radar,
    COMPETITOR: Users,
    CITATION: Link2,
    PROMPT: MessageSquareText,
    MODEL: Zap,
    STRATEGY: Compass,
  };

  const IconComponent = typeIcons[agent.type] || Bot;

  const severityStyles: Record<string, string> = {
    CRITICAL: "bg-rose-500/10 text-rose-500 border-rose-500/20",
    HIGH: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    MEDIUM: "bg-sky-500/10 text-sky-500 border-sky-500/20",
    LOW: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    INFO: "bg-surface-subtle text-muted-foreground border-border",
  };

  const sevClass = result?.severity ? severityStyles[result.severity] || severityStyles.INFO : severityStyles.INFO;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200 select-none">
      <div className="relative w-full max-w-xl bg-surface border-l border-border h-full overflow-y-auto p-6 flex flex-col justify-between shadow-2xl space-y-6">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between gap-4 border-b border-border pb-4">
            <div className="flex items-start gap-3">
              <div className="size-10 rounded-xl bg-surface-subtle border border-border flex items-center justify-center text-foreground shrink-0 mt-0.5">
                <IconComponent className="size-5" />
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="rounded bg-surface-subtle px-2 py-0.5 font-mono text-[10px] uppercase border border-border text-muted-foreground">
                    {agent.type} AGENT
                  </span>
                  <span
                    className={`rounded font-mono text-[10px] font-semibold px-2 py-0.5 border ${
                      agent.status === "ACTIVE"
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                        : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                    }`}
                  >
                    {agent.status}
                  </span>
                  <span className="rounded bg-brand/10 text-brand border border-brand/20 px-2 py-0.5 font-mono text-[10px]">
                    {agent.provenance}
                  </span>
                </div>

                <h2 className="mt-2 text-lg font-semibold text-foreground tracking-tight">{agent.name}</h2>
                <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">{agent.description}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-border p-1.5 text-muted-foreground hover:text-foreground hover:bg-surface-subtle transition-colors cursor-pointer"
            >
              <X className="size-4" />
            </button>
          </div>

          {/* Schedule & Monitoring Rules */}
          <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl border border-border bg-surface-subtle/50 text-xs">
            <div>
              <span className="font-mono text-[10px] text-muted-foreground uppercase block">Surveillance Schedule</span>
              <span className="font-semibold text-foreground mt-0.5 flex items-center gap-1">
                <Clock className="size-3 text-muted-foreground" />
                {agent.schedule}
              </span>
            </div>

            <div>
              <span className="font-mono text-[10px] text-muted-foreground uppercase block">Monitored Target</span>
              <span className="font-semibold text-foreground mt-0.5 block truncate">{agent.subject}</span>
            </div>
          </div>

          {/* Latest Intelligence Finding Hero */}
          {result ? (
            <div className="rounded-xl border border-border bg-surface p-4 space-y-3 shadow-xs">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <span className="text-xs font-mono uppercase text-muted-foreground font-semibold flex items-center gap-1.5">
                  <Sparkles className="size-3.5 text-brand" />
                  Latest Observational Finding
                </span>
                <span className={`rounded-full px-2 py-0.2 font-mono text-[10px] font-bold uppercase border ${sevClass}`}>
                  {result.severity} SEVERITY
                </span>
              </div>

              <p className="text-sm font-semibold text-foreground leading-snug">{result.finding}</p>

              {/* Concrete Recommendation */}
              <div className="pt-2 border-t border-border/60">
                <span className="text-[11px] font-mono uppercase text-muted-foreground block mb-1">Recommendation</span>
                <p className="text-xs text-muted-foreground leading-relaxed">{result.recommendation}</p>
              </div>

              {/* Structured Evidence Key-Values */}
              {result.evidence && Object.keys(result.evidence).length > 0 && (
                <div className="pt-2 border-t border-border/60 space-y-1.5">
                  <span className="text-[11px] font-mono uppercase text-muted-foreground block">Evidence Breakdown</span>
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                    {Object.entries(result.evidence).map(([key, val]) => (
                      <div key={key} className="p-2 rounded border border-border/60 bg-surface-subtle/40">
                        <span className="text-[10px] text-muted-foreground uppercase block truncate">{key}</span>
                        <span className="text-foreground font-medium block truncate mt-0.5">
                          {Array.isArray(val) ? val.join(", ") : String(val)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Destination Surface Link */}
              {result.relatedRoute && (
                <div className="pt-2 flex justify-end">
                  <Link
                    to={result.relatedRoute}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-brand hover:underline cursor-pointer"
                  >
                    <span>Inspect evidence in {result.relatedRoute}</span>
                    <ArrowUpRight className="size-3.5" />
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <div className="p-6 rounded-xl border border-border bg-surface text-center space-y-2">
              <span className="text-xs text-muted-foreground">No intelligence runs recorded yet for this project.</span>
            </div>
          )}

          {/* Run History */}
          {runs.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Execution History</span>
              <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
                {runs.map((r) => (
                  <div key={r.id} className="rounded-lg border border-border bg-surface-subtle p-3 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] text-muted-foreground">
                        {new Date(r.completedAt).toLocaleString()}
                      </span>
                      <span className={`px-1.5 py-0.2 rounded font-mono text-[10px] uppercase border ${severityStyles[r.severity]}`}>
                        {r.severity}
                      </span>
                    </div>
                    <p className="font-medium text-foreground text-xs">{r.finding}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Action Controls */}
        <div className="pt-4 border-t border-border flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {onToggleStatus && (
              <button
                type="button"
                onClick={() => onToggleStatus(agent.id, !agent.enabled)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-surface-subtle transition-colors cursor-pointer"
              >
                {agent.enabled ? (
                  <>
                    <Pause className="size-3.5 text-amber-500" />
                    <span>Pause Agent</span>
                  </>
                ) : (
                  <>
                    <Play className="size-3.5 text-emerald-500" />
                    <span>Enable Agent</span>
                  </>
                )}
              </button>
            )}

            {onRunNow && (
              <button
                type="button"
                onClick={() => onRunNow(agent.id)}
                disabled={isRunning}
                className="inline-flex items-center gap-1.5 rounded-lg bg-foreground text-background px-3.5 py-1.5 text-xs font-semibold hover:bg-foreground/90 transition-colors cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`size-3.5 ${isRunning ? "animate-spin" : ""}`} />
                <span>{isRunning ? "Running Agent..." : "Run Now"}</span>
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-border bg-surface-subtle px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
