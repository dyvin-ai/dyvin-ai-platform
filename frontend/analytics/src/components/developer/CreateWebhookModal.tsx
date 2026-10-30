import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Webhook, X, Shield } from "lucide-react";
import type { DeveloperAppItem, CreateDeveloperWebhookInput } from "@/types";

interface CreateWebhookModalProps {
  isOpen: boolean;
  onClose: () => void;
  applications: DeveloperAppItem[];
  selectedAppId?: string;
  onSubmit: (input: CreateDeveloperWebhookInput) => Promise<void>;
}

export function CreateWebhookModal({
  isOpen,
  onClose,
  applications = [],
  selectedAppId,
  onSubmit,
}: CreateWebhookModalProps) {
  const [appId, setAppId] = useState(selectedAppId || (applications[0]?.id ?? ""));
  const [targetUrl, setTargetUrl] = useState("");
  const [secret, setSecret] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!appId || !targetUrl.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        applicationId: appId,
        targetUrl: targetUrl.trim(),
        secret: secret.trim() || undefined,
      });
      setTargetUrl("");
      setSecret("");
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-card border border-border rounded-xl shadow-2xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground p-1 rounded-md cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="p-2.5 bg-purple-500/10 text-purple-400 rounded-lg border border-purple-500/20">
            <Webhook className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground">Subscribe Event Webhook</h3>
            <p className="text-xs text-muted-foreground">Receive real-time push events from the gateway</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">
              Target Application *
            </label>
            <select
              required
              value={appId}
              onChange={(e) => setAppId(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-surface text-foreground focus:outline-none focus:ring-1 focus:ring-purple-500"
            >
              {applications.map((app) => (
                <option key={app.id} value={app.id}>
                  {app.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">
              Webhook Endpoint URL *
            </label>
            <input
              type="url"
              required
              placeholder="https://api.yourdomain.com/webhooks/dyvin"
              value={targetUrl}
              onChange={(e) => setTargetUrl(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-surface text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-purple-500 font-mono text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">
              HMAC Secret Key (Optional)
            </label>
            <input
              type="text"
              placeholder="whsec_custom_secret_key (auto-generated if empty)"
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-surface text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-purple-500 font-mono text-xs"
            />
          </div>

          <div className="p-3 rounded-lg bg-surface border border-border flex items-start gap-2.5 text-xs text-muted-foreground">
            <Shield className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
            <div>
              Webhooks include retry backoff (3 attempts with exponential delay) on HTTP 5xx responses.
            </div>
          </div>

          <div className="pt-3 flex items-center justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || !targetUrl.trim()} className="bg-purple-600 hover:bg-purple-700 text-white">
              {isSubmitting ? "Registering..." : "Register Webhook"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
