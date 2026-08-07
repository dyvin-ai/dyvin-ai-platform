import React, { useState } from 'react';
import { Card, CardHeader, CardTitle } from '@components/ui/Card';
import { Button } from '@components/ui/Button';
import { Input } from '@components/ui/Input';
import { Badge } from '@components/ui/Badge';
import { useAutonomousOpsStore } from '@stores/autonomousOpsStore';
import { Sparkles, Send, Bot, User } from 'lucide-react';

export function CopilotPanel() {
  const { copilotMessages, addCopilotMessage } = useAutonomousOpsStore();
  const [inputText, setInputText] = useState('');

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const userMsg = {
      id: `usr-${Date.now()}`,
      sender: 'USER' as const,
      messageText: inputText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    addCopilotMessage(userMsg);
    setInputText('');

    setTimeout(() => {
      const copilotResponse = {
        id: `cop-${Date.now()}`,
        sender: 'COPILOT' as const,
        messageText: `Executed query check for "${userMsg.messageText}". Infrastructure telemetry confirms zero memory pressure on AWS Redis clusters and 100% capacity margin on Aurora PostgreSQL.`,
        actionSuggested: 'Trigger Playbook: Scale Worker Pool +2',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      addCopilotMessage(copilotResponse);
    }, 800);
  };

  return (
    <Card className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4 flex flex-col h-[480px]">
      <CardHeader className="p-0 flex flex-row items-center justify-between border-b border-border pb-3">
        <CardTitle className="text-base font-bold flex items-center gap-2">
          <Bot className="w-5 h-5 text-primary" /> Autonomous AI Copilot Workspace
        </CardTitle>
        <Badge variant="outline" className="font-mono text-emerald-400 border-emerald-500/30">
          ONLINE • COPILOT v2.4
        </Badge>
      </CardHeader>

      <div className="flex-1 overflow-y-auto space-y-3 p-1 text-xs">
        {copilotMessages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-2.5 ${msg.sender === 'USER' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'COPILOT' && (
              <div className="w-7 h-7 rounded-lg bg-primary/20 flex items-center justify-center text-primary shrink-0">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={`p-3 rounded-xl max-w-[80%] space-y-1 ${
                msg.sender === 'USER'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted/30 border border-border text-foreground'
              }`}
            >
              <p>{msg.messageText}</p>
              {msg.actionSuggested && (
                <div className="pt-1">
                  <Badge variant="secondary" className="text-[10px]">
                    <Sparkles className="w-3 h-3 mr-1" /> {msg.actionSuggested}
                  </Badge>
                </div>
              )}
              <span className="text-[9px] opacity-70 block text-right font-mono">{msg.timestamp}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2 pt-2 border-t border-border">
        <Input
          placeholder="Ask AI Copilot to run SRE playbooks, check capacity, or scale workers..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          className="text-xs"
        />
        <Button size="sm" onClick={handleSendMessage} leftIcon={<Send className="w-3.5 h-3.5" />}>
          Send
        </Button>
      </div>
    </Card>
  );
}
