import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Bot,
  Activity,
  Layers,
  Zap,
  CheckCircle2,
  Clock,
  Sparkles,
} from "lucide-react";
import type { CoordinatedAgentItem } from "@/types";

interface AgentCoordinationMatrixCardProps {
  agents?: CoordinatedAgentItem[];
  isLoading?: boolean;
}

export function AgentCoordinationMatrixCard({
  agents = [],
  isLoading = false,
}: AgentCoordinationMatrixCardProps) {
  const defaultAgents: CoordinatedAgentItem[] = [
    { role: "RESEARCH_AGENT", status: "IDLE", currentTask: "Awaiting scheduled hourly crawl" },
    { role: "SEO_AGENT", status: "EXECUTING", currentTask: "Syncing Schema triples to public knowledge graph" },
    { role: "CITATION_AGENT", status: "IDLE", currentTask: "Standby for cross-engine citation anomalies" },
    { role: "ACTION_AGENT", status: "EXECUTING", currentTask: "Autonomous payload drift mutation running" },
    { role: "CUSTOMER_SUCCESS_AGENT", status: "IDLE", currentTask: "Scheduled executive digest dispatch at 00:00 UTC" },
  ];

  const agentList = agents.length > 0 ? agents : defaultAgents;

  const getRoleIconColor = (role: string) => {
    switch (role) {
      case "RESEARCH_AGENT":
        return "text-blue-500 bg-blue-500/10";
      case "SEO_AGENT":
        return "text-emerald-500 bg-emerald-500/10";
      case "CITATION_AGENT":
        return "text-amber-500 bg-amber-500/10";
      case "ACTION_AGENT":
        return "text-purple-500 bg-purple-500/10";
      default:
        return "text-cyan-500 bg-cyan-500/10";
    }
  };

  return (
    <Card className="border border-border/80 bg-card shadow-sm">
      <CardHeader className="p-5 pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-purple-500" />
              <CardTitle className="text-base font-semibold text-foreground">
                Coordinated Autonomous Agents Roster
              </CardTitle>
            </div>
            <CardDescription className="text-xs text-muted-foreground mt-0.5">
              Specialized domain agents operating in parallel consensus to execute enterprise GEO and AI visibility mandates
            </CardDescription>
          </div>

          <Badge variant="outline" className="bg-purple-500/10 text-purple-500 border-purple-500/20 text-xs w-fit">
            <Layers className="h-3 w-3 mr-1" />
            Parallel Consensus Engine
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-5 pt-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {agentList.map((agent) => (
            <div
              key={agent.role}
              className="p-3.5 rounded-lg border border-border/60 bg-muted/10 hover:bg-muted/20 transition-colors space-y-2.5"
            >
              <div className="flex items-start justify-between">
                <div className={`p-2 rounded-lg ${getRoleIconColor(agent.role)}`}>
                  <Bot className="h-4 w-4" />
                </div>
                <Badge
                  variant="outline"
                  className={`text-[10px] font-medium ${
                    agent.status === "EXECUTING"
                      ? "text-emerald-500 bg-emerald-500/10 border-emerald-500/20"
                      : "text-muted-foreground border-border/60"
                  }`}
                >
                  {agent.status}
                </Badge>
              </div>

              <div>
                <div className="text-xs font-bold text-foreground font-mono truncate">{agent.role}</div>
                <p className="text-[11px] text-muted-foreground mt-1 line-clamp-2">
                  {agent.currentTask || "Active standby"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
