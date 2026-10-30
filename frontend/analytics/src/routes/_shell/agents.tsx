import { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { SectionHeading } from "@/components/analytics/Panel";
import { AgentDetailDrawer } from "@/components/drawers/AgentDetailDrawer";
import { useWorkspace } from "@/context/WorkspaceContext";
import { agentsService } from "@/services";
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
  TriangleAlert,
  Users,
  Zap,
} from "lucide-react";

export const Route = createFileRoute("/_shell/agents")({
  head: () => ({
    meta: [
      { title: "Dyvin AI | Autonomous Intelligence Agents" },
      { name: "description", content: "Continuous surveillance and automated alert radar monitoring visibility shifts, competitor gaps, and citation footprint." },
      { property: "og:title", content: "Dyvin AI | Autonomous Intelligence Agents" },
      { property: "og:description", content: "Continuous surveillance and automated alert radar monitoring visibility shifts, competitor gaps, and citation footprint." },
    ],
  }),
  component: AgentsPage,
});

function AgentsPage() {
  const { activeOrganization, activeProject } = useWorkspace();
  const queryClient = useQueryClient();
  const [selectedAgent, setSelectedAgent] = useState<AgentDefinition | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [runningAgentId, setRunningAgentId] = useState<string | null>(null);

  // TanStack Query v5 fetch
  const {
    data: agents = [],
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["agents", activeOrganization?.id, activeProject?.id],
    queryFn: () => agentsService.fetchList(activeProject?.id),
    staleTime: 30_000,
  });

  // Query for selected agent runs
  const { data: selectedAgentRuns = [] } = useQuery({
    queryKey: ["agent-runs", activeOrganization?.id, activeProject?.id, selectedAgent?.id],
    queryFn: () => (selectedAgent ? agentsService.getRuns(selectedAgent.id, activeProject?.id) : Promise.resolve([])),
    enabled: !!selectedAgent,
  });

  // Mutation: Trigger explicit Run Now
  const runMutation = useMutation({
    mutationFn: async (agentId: string) => {
      setRunningAgentId(agentId);
      return agentsService.triggerRun(agentId, activeProject?.id);
    },
    onSuccess: (runResult) => {
      queryClient.invalidateQueries({ queryKey: ["agents", activeOrganization?.id, activeProject?.id] });
      queryClient.invalidateQueries({ queryKey: ["agent-runs", activeOrganization?.id, activeProject?.id, runResult.agentId] });
      if (selectedAgent && selectedAgent.id === runResult.agentId) {
        setSelectedAgent((prev) => (prev ? { ...prev, lastResult: runResult } : prev));
      }
    },
    onSettled: () => {
      setRunningAgentId(null);
    },
  });

  // Mutation: Pause / Enable agent
  const statusMutation = useMutation({
    mutationFn: async ({ agentId, enabled }: { agentId: string; enabled: boolean }) => {
      return agentsService.updateStatus(agentId, { enabled, status: enabled ? "ACTIVE" : "PAUSED" }, activeProject?.id);
    },
    onSuccess: (updatedAgent) => {
      queryClient.invalidateQueries({ queryKey: ["agents", activeOrganization?.id, activeProject?.id] });
      if (selectedAgent && selectedAgent.id === updatedAgent.id) {
        setSelectedAgent(updatedAgent);
      }
    },
  });

  const typeIcons: Record<string, any> = {
    VISIBILITY: Radar,
    COMPETITOR: Users,
    CITATION: Link2,
    PROMPT: MessageSquareText,
    MODEL: Zap,
    STRATEGY: Compass,
  };

  const severityStyles: Record<string, string> = {
    CRITICAL: "bg-rose-500/10 text-rose-500 border-rose-500/20",
    HIGH: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    MEDIUM: "bg-sky-500/10 text-sky-500 border-sky-500/20",
    LOW: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    INFO: "bg-surface-subtle text-muted-foreground border-border",
  };

  const categories = ["all", "VISIBILITY", "COMPETITOR", "CITATION", "PROMPT", "MODEL", "STRATEGY"];

  const filteredAgents = useMemo(() => {
    return agents.filter((agent) => {
      if (selectedCategory !== "all" && agent.type !== selectedCategory) return false;
      if (selectedStatus !== "all" && agent.status !== selectedStatus) return false;
      return true;
    });
  }, [agents, selectedCategory, selectedStatus]);

  const activeCount = agents.filter((a) => a.status === "ACTIVE").length;
  const pausedCount = agents.filter((a) => a.status === "PAUSED").length;
  const criticalCount = agents.filter((a) => a.lastResult?.severity === "HIGH" || a.lastResult?.severity === "CRITICAL").length;

  const handleOpenDetail = (agent: AgentDefinition) => {
    setSelectedAgent(agent);
    setDrawerOpen(true);
  };

  return (
    <div className="flex flex-col gap-6 select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <SectionHeading
          eyebrow="Continuous Surveillance"
          title="Autonomous Intelligence Agents"
          question="Dedicated background intelligence agents continuously auditing AI search visibility, competitor maneuvers, and citation footprint."
        />

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-surface-subtle transition-colors cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`size-3.5 ${isFetching ? "animate-spin text-brand" : ""}`} />
            <span>Refresh Agents</span>
          </button>
        </div>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl border border-border/80 bg-surface shadow-xs">
          <span className="text-[10px] font-mono uppercase text-muted-foreground">Configured Agents</span>
          <p className="text-xl font-bold font-mono text-foreground mt-1">{agents.length}</p>
          <span className="text-[10px] text-muted-foreground">Specialized surveillance agents</span>
        </div>

        <div className="p-4 rounded-xl border border-border/80 bg-surface shadow-xs">
          <span className="text-[10px] font-mono uppercase text-muted-foreground">Active Surveillance</span>
          <p className="text-xl font-bold font-mono text-emerald-500 mt-1">{activeCount}</p>
          <span className="text-[10px] text-muted-foreground">Continuously watching telemetry</span>
        </div>

        <div className="p-4 rounded-xl border border-border/80 bg-surface shadow-xs">
          <span className="text-[10px] font-mono uppercase text-muted-foreground">Paused Agents</span>
          <p className="text-xl font-bold font-mono text-muted-foreground mt-1">{pausedCount}</p>
          <span className="text-[10px] text-muted-foreground">Manual standby mode</span>
        </div>

        <div className="p-4 rounded-xl border border-border/80 bg-surface shadow-xs">
          <span className="text-[10px] font-mono uppercase text-muted-foreground">Actionable Alerts</span>
          <p className="text-xl font-bold font-mono text-amber-500 mt-1">{criticalCount}</p>
          <span className="text-[10px] text-muted-foreground">Discovered optimization signals</span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 p-3 rounded-xl border border-border/80 bg-surface">
        <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar pb-1 md:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === cat
                  ? "bg-foreground text-background font-semibold shadow-xs"
                  : "text-muted-foreground hover:text-foreground hover:bg-surface-subtle"
              }`}
            >
              {cat === "all" ? "All Agents" : cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="h-8 px-2.5 text-xs rounded-lg border border-border bg-surface-subtle text-foreground focus:outline-none focus:ring-1 focus:ring-brand font-mono"
            aria-label="Filter agents by status"
          >
            <option value="all">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="PAUSED">Paused</option>
          </select>
        </div>
      </div>

      {/* Main Agent Grid */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-64 gap-3">
          <div className="size-6 animate-spin rounded-full border-2 border-border border-t-brand" />
          <span className="text-xs font-mono text-muted-foreground">Loading autonomous intelligence agents...</span>
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center justify-center h-64 gap-3 text-center p-6 rounded-2xl border border-destructive/20 bg-destructive/5">
          <p className="text-sm font-semibold text-destructive">Failed to load intelligence agents.</p>
          <p className="text-xs text-muted-foreground">The agent intelligence backend is temporarily unreachable.</p>
          <button
            type="button"
            onClick={() => refetch()}
            className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-foreground text-background px-3 py-1.5 text-xs font-medium cursor-pointer"
          >
            Retry
          </button>
        </div>
      ) : filteredAgents.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 gap-3 text-center p-6 rounded-2xl border border-border bg-surface">
          <div className="size-12 rounded-full bg-surface-subtle border border-border flex items-center justify-center text-muted-foreground">
            <Bot className="size-6" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-foreground">No agents matched your filter</h4>
            <p className="text-xs text-muted-foreground mt-1">Try resetting your category or status filter above.</p>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredAgents.map((agent) => {
            const Icon = typeIcons[agent.type] || Bot;
            const res = agent.lastResult;
            const sevClass = res?.severity ? severityStyles[res.severity] || severityStyles.INFO : severityStyles.INFO;
            const isRunning = runningAgentId === agent.id;

            return (
              <div
                key={agent.id}
                className="rounded-xl border border-border bg-surface p-5 flex flex-col justify-between transition-all hover:border-border-strong hover:bg-surface-subtle/20 shadow-xs space-y-4 group"
              >
                <div className="space-y-3">
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="size-8 rounded-lg bg-surface-subtle border border-border flex items-center justify-center text-foreground shrink-0 group-hover:text-brand transition-colors">
                        <Icon className="size-4" />
                      </div>
                      <div>
                        <span className="font-mono text-[10px] uppercase text-muted-foreground block">{agent.type}</span>
                        <h3 className="text-sm font-semibold text-foreground leading-snug tracking-tight">{agent.name}</h3>
                      </div>
                    </div>

                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-mono font-semibold border ${
                        agent.status === "ACTIVE"
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                          : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                      }`}
                    >
                      {agent.status}
                    </span>
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{agent.description}</p>

                  {/* Schedule */}
                  <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground pt-1 border-t border-border/60">
                    <span className="flex items-center gap-1">
                      <Clock className="size-3" />
                      {agent.schedule}
                    </span>
                    <span>{agent.provenance}</span>
                  </div>

                  {/* Latest Finding */}
                  {res && (
                    <div className="rounded-lg border border-border/80 bg-surface-subtle/50 p-3 space-y-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-mono uppercase text-muted-foreground font-semibold">Latest Finding</span>
                        <span className={`px-1.5 py-0.2 rounded font-mono text-[9px] font-bold uppercase border ${sevClass}`}>
                          {res.severity}
                        </span>
                      </div>
                      <p className="text-xs font-medium text-foreground leading-snug line-clamp-2">{res.finding}</p>
                    </div>
                  )}
                </div>

                {/* Footer Controls */}
                <div className="pt-3 border-t border-border/60 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => runMutation.mutate(agent.id)}
                      disabled={isRunning}
                      className="inline-flex items-center gap-1 rounded bg-surface-subtle border border-border px-2.5 py-1 text-xs font-medium text-foreground hover:bg-surface-elevated transition-colors cursor-pointer disabled:opacity-50"
                      title="Execute immediate intelligence evaluation"
                    >
                      <RefreshCw className={`size-3 text-brand ${isRunning ? "animate-spin" : ""}`} />
                      <span>{isRunning ? "Running..." : "Run Now"}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => statusMutation.mutate({ agentId: agent.id, enabled: !agent.enabled })}
                      className="inline-flex items-center p-1 rounded border border-border bg-surface-subtle text-muted-foreground hover:text-foreground hover:bg-surface-elevated transition-colors cursor-pointer"
                      title={agent.enabled ? "Pause agent" : "Enable agent"}
                    >
                      {agent.enabled ? <Pause className="size-3 text-amber-500" /> : <Play className="size-3 text-emerald-500" />}
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleOpenDetail(agent)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-brand hover:underline cursor-pointer"
                  >
                    <span>Inspect →</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Agent Detail Drawer */}
      <AgentDetailDrawer
        agent={selectedAgent}
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onRunNow={(agentId) => runMutation.mutate(agentId)}
        onToggleStatus={(agentId, enabled) => statusMutation.mutate({ agentId, enabled })}
        isRunning={runningAgentId === selectedAgent?.id}
        runs={selectedAgentRuns}
      />
    </div>
  );
}
