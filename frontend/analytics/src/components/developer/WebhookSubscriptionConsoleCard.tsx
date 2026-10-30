import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Webhook,
  Plus,
  Shield,
  Send,
  Check,
  Copy,
  ExternalLink,
} from "lucide-react";
import type { DeveloperWebhookItem } from "@/types";

interface WebhookSubscriptionConsoleCardProps {
  webhooks: DeveloperWebhookItem[];
  selectedAppName?: string;
  isLoading?: boolean;
  onCreateWebhookClick?: () => void;
  onTestWebhookClick?: (webhook: DeveloperWebhookItem) => void;
}

export function WebhookSubscriptionConsoleCard({
  webhooks = [],
  selectedAppName,
  isLoading = false,
  onCreateWebhookClick,
  onTestWebhookClick,
}: WebhookSubscriptionConsoleCardProps) {
  const [copiedSecretId, setCopiedSecretId] = useState<string | null>(null);

  const handleCopySecret = (webhook: DeveloperWebhookItem) => {
    navigator.clipboard.writeText(webhook.secret);
    setCopiedSecretId(webhook.id);
    setTimeout(() => setCopiedSecretId(null), 2000);
  };

  return (
    <Card className="border border-border/50 bg-card/60 backdrop-blur-sm">
      <CardHeader className="p-5 pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Webhook className="w-5 h-5 text-purple-400" />
              <CardTitle className="text-base font-semibold text-foreground">
                Webhook Subscriptions
              </CardTitle>
              {selectedAppName && (
                <Badge variant="outline" className="text-xs font-normal border-border">
                  {selectedAppName}
                </Badge>
              )}
            </div>
            <CardDescription className="text-xs text-muted-foreground mt-1">
              Events are signed with an HMAC-SHA256 signature in the <code className="text-foreground font-mono">X-Dyvin-Signature</code> header.
            </CardDescription>
          </div>
          {onCreateWebhookClick && (
            <Button size="sm" onClick={onCreateWebhookClick} className="gap-1.5 h-8 bg-purple-600 hover:bg-purple-700 text-white text-xs">
              <Plus className="w-3.5 h-3.5" />
              <span>Add Endpoint</span>
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-5 pt-2">
        {isLoading ? (
          <div className="py-8 text-center text-sm text-muted-foreground animate-pulse">
            Loading webhooks...
          </div>
        ) : webhooks.length === 0 ? (
          <div className="py-8 text-center">
            <Webhook className="w-8 h-8 text-muted-foreground/40 mx-auto mb-2" />
            <p className="text-sm font-medium text-foreground">No webhook subscriptions</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Subscribe external services to asynchronous GEO and engine citation events.
            </p>
            {onCreateWebhookClick && (
              <Button size="sm" onClick={onCreateWebhookClick} className="mt-3 gap-1.5 h-8">
                <Plus className="w-3.5 h-3.5" />
                <span>Register Webhook</span>
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {webhooks.map((hook) => {
              const isEnabled = hook.isEnabled !== false;
              return (
                <div
                  key={hook.id}
                  className="p-3.5 rounded-lg border border-border/60 bg-surface/50 hover:bg-surface transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-medium text-foreground break-all">
                        {hook.targetUrl}
                      </span>
                      <Badge
                        variant="outline"
                        className={`text-[10px] uppercase font-mono px-1.5 py-0 ${
                          isEnabled
                            ? "border-emerald-500/30 text-emerald-400 bg-emerald-500/10"
                            : "border-muted-foreground/30 text-muted-foreground"
                        }`}
                      >
                        {isEnabled ? "ACTIVE" : "PAUSED"}
                      </Badge>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground font-mono">
                      <span className="flex items-center gap-1">
                        <Shield className="w-3 h-3 text-purple-400" />
                        Secret: {hook.secret.substring(0, 10)}•••••
                        <button
                          type="button"
                          onClick={() => handleCopySecret(hook)}
                          className="hover:text-foreground p-0.5 rounded cursor-pointer"
                          title="Copy webhook secret"
                        >
                          {copiedSecretId === hook.id ? (
                            <Check className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </span>
                      <span>•</span>
                      <span>ID: {hook.id.substring(0, 8)}...</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    {onTestWebhookClick && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onTestWebhookClick(hook)}
                        className="h-7 text-xs gap-1 border-border"
                      >
                        <Send className="w-3 h-3" />
                        <span>Send Test</span>
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
