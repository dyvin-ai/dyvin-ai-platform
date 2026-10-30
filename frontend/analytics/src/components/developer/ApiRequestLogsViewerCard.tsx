import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Clock, Terminal, CheckCircle2, AlertCircle } from "lucide-react";
import type { DeveloperLogItem } from "@/types";

interface ApiRequestLogsViewerCardProps {
  logs: DeveloperLogItem[];
  isLoading?: boolean;
}

export function ApiRequestLogsViewerCard({
  logs = [],
  isLoading = false,
}: ApiRequestLogsViewerCardProps) {
  return (
    <Card className="border border-border/50 bg-card/60 backdrop-blur-sm">
      <CardHeader className="p-5 pb-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-amber-400" />
              <CardTitle className="text-base font-semibold text-foreground">
                Public Gateway Request Telemetry
              </CardTitle>
            </div>
            <CardDescription className="text-xs text-muted-foreground mt-1">
              Live audit stream of incoming API gateway invocations and response latencies.
            </CardDescription>
          </div>
          <Badge variant="outline" className="border-border text-muted-foreground font-mono text-xs">
            Live Stream
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-5 pt-2">
        {isLoading ? (
          <div className="py-8 text-center text-sm text-muted-foreground animate-pulse">
            Loading gateway logs...
          </div>
        ) : logs.length === 0 ? (
          <div className="py-8 text-center text-sm text-muted-foreground">
            No gateway requests recorded for this application.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-border text-muted-foreground">
                  <th className="py-2 px-3 font-medium">Timestamp</th>
                  <th className="py-2 px-3 font-medium">Endpoint</th>
                  <th className="py-2 px-3 font-medium">Status</th>
                  <th className="py-2 px-3 font-medium text-right">Latency</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {logs.map((log) => {
                  const isSuccess = log.statusCode >= 200 && log.statusCode < 300;
                  return (
                    <tr key={log.id} className="hover:bg-surface-subtle/50 transition-colors">
                      <td className="py-2.5 px-3 text-muted-foreground whitespace-nowrap">
                        {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </td>
                      <td className="py-2.5 px-3 text-foreground font-medium">
                        <span className="text-muted-foreground mr-1.5">POST</span>
                        {log.endpoint}
                      </td>
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-semibold ${
                            isSuccess
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                              : "bg-red-500/10 text-red-400 border border-red-500/20"
                          }`}
                        >
                          {isSuccess ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                          {log.statusCode}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right text-muted-foreground whitespace-nowrap">
                        {log.latencyMs} ms
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
