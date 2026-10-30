import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ShieldCheck, CheckCircle2, Clock, Wrench } from "lucide-react";
import type { SreIncidentItem } from "@/types";

interface IncidentTimelineProps {
  incidents?: SreIncidentItem[];
  isLoading?: boolean;
}

const DEFAULT_INCIDENTS: SreIncidentItem[] = [
  {
    id: "inc-101",
    title: "LLM Provider Latency Spike (Gemini 1.5 Pro > 300ms)",
    severity: "MEDIUM",
    status: "RESOLVED",
    autoRemediated: true,
    durationMins: 4,
    rootCause: "Upstream Provider Limit",
    timestamp: "Today, 04:12 AM",
  },
  {
    id: "inc-102",
    title: "Redis Cache Memory High Watermark (82% Utilization)",
    severity: "LOW",
    status: "RESOLVED",
    autoRemediated: true,
    durationMins: 2,
    rootCause: "Transient Spike",
    timestamp: "Yesterday, 11:45 PM",
  },
];

export function IncidentTimeline({
  incidents = DEFAULT_INCIDENTS,
  isLoading,
}: IncidentTimelineProps) {
  if (isLoading) {
    return (
      <Card className="border border-border bg-card p-6 shadow-xs rounded-2xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <Skeleton className="h-6 w-80" />
          <Skeleton className="h-6 w-28" />
        </div>
        <div className="space-y-3 pt-2">
          {Array.from({ length: 2 }).map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-xl" />
          ))}
        </div>
      </Card>
    );
  }

  const activeIncidents = incidents.length > 0 ? incidents : DEFAULT_INCIDENTS;

  return (
    <Card className="border border-border bg-card rounded-2xl p-6 shadow-xs space-y-4">
      <CardHeader className="p-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <ShieldCheck className="size-5 text-emerald-500 shrink-0" />
            <span>SRE Incident & Automated Remediation Log</span>
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            Zero-human-touch self-healing audit trail triggered by Prometheus alerts and autonomic SRE playbooks.
          </p>
        </div>
        <Badge variant="outline" className="font-mono text-xs w-fit">
          {activeIncidents.length} Resolved Log Entries
        </Badge>
      </CardHeader>

      <CardContent className="p-0 space-y-3 pt-1">
        {activeIncidents.map((inc) => (
          <div
            key={inc.id}
            className="p-4 rounded-xl border border-border bg-muted/20 hover:border-primary/40 transition-all space-y-2.5"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge
                  variant={
                    inc.severity === "CRITICAL" || inc.severity === "SEV-1"
                      ? "destructive"
                      : inc.severity === "HIGH" || inc.severity === "SEV-2"
                      ? "default"
                      : "secondary"
                  }
                  className="text-[10px] uppercase font-mono font-semibold"
                >
                  {inc.severity}
                </Badge>
                <h4 className="font-bold text-foreground text-sm">{inc.title}</h4>
              </div>

              <Badge
                variant="outline"
                className="text-emerald-500 border-emerald-500/30 font-mono text-[11px] self-start sm:self-auto"
              >
                {inc.status}
              </Badge>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-muted-foreground text-xs pt-1 border-t border-border/40">
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1 text-emerald-500 font-semibold text-xs">
                  <CheckCircle2 className="size-3.5" />
                  <span>Auto-Remediated by SRE Playbook</span>
                </span>
                {inc.rootCause && (
                  <span className="text-[11px] text-muted-foreground">
                    • Root Cause: <code className="text-foreground">{inc.rootCause}</code>
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3 text-[11px] font-mono">
                {inc.durationMins && (
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="size-3" />
                    <span>Duration: {inc.durationMins}m</span>
                  </span>
                )}
                <span>{inc.timestamp}</span>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
