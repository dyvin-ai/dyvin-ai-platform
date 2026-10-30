import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Bot, Send, Sparkles, User, Terminal, CheckCircle2 } from "lucide-react";
import type { CopilotChatMessage } from "@/types";

interface CopilotPanelProps {
  onActionTrigger?: (actionName: string) => void;
}

const INITIAL_MESSAGES: CopilotChatMessage[] = [
  {
    id: "cop-0",
    sender: "COPILOT",
    messageText:
      "Autonomous Operations Copilot online. Telemetry stream is active across Aurora PostgreSQL, Redis queues, and edge POP nodes. How can I assist with your SRE workload?",
    actionSuggested: "Telemetry Audit: All Systems Normal",
    timestamp: "12:00 PM",
  },
  {
    id: "cop-1",
    sender: "USER",
    messageText: "Check Aurora storage headroom and verify permanent ingestion ledger retention.",
    timestamp: "12:02 PM",
  },
  {
    id: "cop-2",
    sender: "COPILOT",
    messageText:
      "Aurora PostgreSQL 16 primary storage is at 42.1% utilization (280 GB forecasted at 30 days). Permanent append-only audit ledger is fully synchronized with zero purge events.",
    actionSuggested: "Retention Policy: PERMANENT_NEVER_DELETE",
    timestamp: "12:02 PM",
  },
];

const QUICK_PROMPTS = [
  "Check Aurora storage headroom",
  "Scale BullMQ Worker Pool +2",
  "Run Redis Cache Flush Playbook",
  "Audit upstream LLM latency",
];

export function CopilotPanel({ onActionTrigger }: CopilotPanelProps) {
  const [messages, setMessages] = useState<CopilotChatMessage[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    const userMsg: CopilotChatMessage = {
      id: `usr-${Date.now()}`,
      sender: "USER",
      messageText: text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setIsTyping(true);

    setTimeout(() => {
      let replyText = `Telemetry analysis completed for "${text}". All database read replicas are operating under 2.4ms RTT with 100% capacity margin on Aurora PostgreSQL and Redis clusters.`;
      let suggestion = "Playbook Verified: Zero Bottlenecks";

      if (text.toLowerCase().includes("scale")) {
        replyText = `Dispatched scaling directive to AWS EKS cluster. BullMQ container pool increased by +2 replicas (Total: 14 active worker pods).`;
        suggestion = "Executed: EKS Worker Scaling Directive";
      } else if (text.toLowerCase().includes("redis") || text.toLowerCase().includes("cache")) {
        replyText = `Evaluated Redis cluster status. Cache hit ratio is at 98.5% with 38.5% memory watermark. No eviction events detected.`;
        suggestion = "ElastiCache Status: Peak Performance";
      } else if (text.toLowerCase().includes("latency") || text.toLowerCase().includes("llm")) {
        replyText = `Cross-model latency analysis shows OpenAI GPT-4o at 110ms, Claude 3.5 Sonnet at 125ms, and Gemini 1.5 Pro normalized at 85ms.`;
        suggestion = "Upstream Failover: Nominal";
      }

      const copilotResponse: CopilotChatMessage = {
        id: `cop-${Date.now()}`,
        sender: "COPILOT",
        messageText: replyText,
        actionSuggested: suggestion,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, copilotResponse]);
      setIsTyping(false);
      if (onActionTrigger && suggestion) {
        onActionTrigger(suggestion);
      }
    }, 700);
  };

  return (
    <Card className="border border-border bg-card rounded-2xl p-6 shadow-xs space-y-4 flex flex-col h-[520px]">
      <CardHeader className="p-0 flex flex-row items-center justify-between border-b border-border pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
            <Bot className="size-4" />
          </div>
          <div>
            <CardTitle className="text-base font-bold text-foreground">
              Autonomous AI Copilot Workspace
            </CardTitle>
            <p className="text-[11px] text-muted-foreground">
              Natural language SRE runbook execution and cluster capacity control.
            </p>
          </div>
        </div>
        <Badge variant="outline" className="font-mono text-[11px] text-emerald-500 border-emerald-500/30">
          ONLINE • COPILOT v2.4
        </Badge>
      </CardHeader>

      {/* Quick Prompts Strip */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs shrink-0 no-scrollbar">
        {QUICK_PROMPTS.map((prompt, i) => (
          <button
            key={i}
            onClick={() => handleSendMessage(prompt)}
            className="px-2.5 py-1 rounded-lg bg-muted/30 border border-border hover:border-primary/40 hover:bg-muted/50 text-[11px] text-muted-foreground hover:text-foreground transition-all shrink-0 cursor-pointer text-left font-medium"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto space-y-3 p-1 text-xs">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-2.5 ${msg.sender === "USER" ? "justify-end" : "justify-start"}`}
          >
            {msg.sender === "COPILOT" && (
              <div className="size-7 rounded-lg bg-primary/15 flex items-center justify-center text-primary shrink-0">
                <Bot className="size-4" />
              </div>
            )}

            <div
              className={`p-3.5 rounded-xl max-w-[85%] space-y-1.5 ${
                msg.sender === "USER"
                  ? "bg-primary text-primary-foreground font-medium"
                  : "bg-muted/30 border border-border text-foreground"
              }`}
            >
              <p className="leading-relaxed">{msg.messageText}</p>
              {msg.actionSuggested && (
                <div className="pt-1">
                  <Badge
                    variant="secondary"
                    className="text-[10px] gap-1 font-mono font-medium py-0.5 bg-background/60"
                  >
                    <Sparkles className="size-3 text-amber-500" />
                    <span>{msg.actionSuggested}</span>
                  </Badge>
                </div>
              )}
              <span
                className={`text-[9px] block text-right font-mono ${
                  msg.sender === "USER" ? "text-primary-foreground/75" : "text-muted-foreground"
                }`}
              >
                {msg.timestamp}
              </span>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-2 text-muted-foreground text-xs p-2">
            <Bot className="size-4 animate-bounce text-primary" />
            <span className="font-mono text-[11px]">AI Copilot querying telemetry...</span>
          </div>
        )}
      </div>

      {/* Input Controls */}
      <div className="flex gap-2 pt-2 border-t border-border">
        <Input
          placeholder="Ask AI Copilot to run SRE playbooks, check capacity, or scale workers..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          className="text-xs h-9 bg-background"
        />
        <Button
          size="sm"
          onClick={() => handleSendMessage()}
          disabled={!inputText.trim() || isTyping}
          className="h-9 gap-1.5 px-3 text-xs font-semibold"
        >
          <span>Send</span>
          <Send className="size-3.5" />
        </Button>
      </div>
    </Card>
  );
}
