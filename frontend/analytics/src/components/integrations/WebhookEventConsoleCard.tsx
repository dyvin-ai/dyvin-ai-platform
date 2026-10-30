import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Radio,
  Send,
  CheckCircle2,
  Clock,
  Code2,
  ShieldCheck,
  Zap,
} from "lucide-react";
import type { WebhookEventItem, ProcessWebhookInput } from "@/types";

interface WebhookEventConsoleCardProps {
  events: WebhookEventItem[];
  isLoading?: boolean;
  onDispatchTestWebhook: (input: ProcessWebhookInput) => Promise<void>;
  defaultIntegrationId?: string;
}

export function WebhookEventConsoleCard({
  events,
  isLoading = false,
  onDispatchTestWebhook,
  defaultIntegrationId = "int-1",
}: WebhookEventConsoleCardProps) {
  const [isDispatching, setIsDispatching] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleTestDispatch = async () => {
    try {
      setIsDispatching(true);
      await onDispatchTestWebhook({
        integrationId: defaultIntegrationId,
        eventType: "citation.spike.detected",
        payload: {
          brand: "Dyvin AI",
          engine: "Perplexity",
          deltaPct: +18.4,
          timestamp: new Date().toISOString(),
          status: "ALERT_DISPATCHED",
        },
      });
    } finally {
      setIsDispatching(false);
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <Card className="border border-border/60 bg-card/60 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <Radio className="w-5 h-5 text-indigo-400" />
              Webhook Activity & Real-Time Event Console
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground mt-1">
              Live delivery log of inbound payloads and outbound notifications signed with HMAC-SHA256 secrets.
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              disabled={isDispatching}
              onClick={handleTestDispatch}
              className="gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs"
            >
              <Send className={`w-3.5 h-3.5 ${isDispatching ? "animate-spin" : ""}`} />
              <span>Dispatch Test Event</span>
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="py-12 text-center text-muted-foreground animate-pulse">
            Loading webhook events stream...
          </div>
        ) : events.length === 0 ? (
          <div className="py-12 text-center border border-dashed border-border/60 rounded-xl">
            <Radio className="w-10 h-10 mx-auto text-muted-foreground mb-2" />
            <p className="text-base font-medium text-foreground">No webhook events logged yet</p>
            <p className="text-sm text-muted-foreground mt-1">
              Trigger a test webhook event to verify signature validation and Redis worker dispatch.
            </p>
            <Button
              onClick={handleTestDispatch}
              size="sm"
              disabled={isDispatching}
              className="mt-4 gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Dispatch Test Webhook</span>
            </Button>
          </div>
        ) : (
          <div className="divide-y divide-border/40">
            {events.map((evt) => {
              const isExpanded = expandedId === evt.id;
              return (
                <div key={evt.id} className="py-3 px-2 hover:bg-accent/20 rounded-lg transition-colors space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="outline" className="border-indigo-500/40 text-indigo-400 bg-indigo-500/10 text-xs font-mono">
                        {evt.eventType}
                      </Badge>
                      <span className="text-xs text-muted-foreground font-mono">ID: {evt.id.slice(0, 12)}...</span>
                      <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 bg-emerald-500/10 text-[10px] gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Delivered
                      </Badge>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>{evt.deliveredAt ? new Date(evt.deliveredAt).toLocaleTimeString() : "Just now"}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleExpand(evt.id)}
                        className="h-6 px-2 text-[11px] gap-1 text-muted-foreground hover:text-foreground"
                      >
                        <Code2 className="w-3 h-3" />
                        <span>{isExpanded ? "Hide Payload" : "Inspect Payload"}</span>
                      </Button>
                    </div>
                  </div>

                  {isExpanded && evt.payloadJson && (
                    <div className="bg-black/50 p-3 rounded-lg border border-border/50 font-mono text-xs text-foreground/90 overflow-x-auto">
                      <pre className="text-[11px]">{JSON.stringify(evt.payloadJson, null, 2)}</pre>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
