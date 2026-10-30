import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Cable, Plus } from "lucide-react";
import type { ConnectProviderInput, IntegrationProviderItem } from "@/types";

interface ConnectProviderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (input: ConnectProviderInput) => Promise<void>;
  selectedProvider?: IntegrationProviderItem | null;
  providers?: IntegrationProviderItem[];
  organizationId?: string;
}

export function ConnectProviderModal({
  isOpen,
  onClose,
  onSubmit,
  selectedProvider,
  providers = [],
  organizationId = "f5bb0153-e41a-49ee-97dc-e03dc6228403",
}: ConnectProviderModalProps) {
  const [providerCode, setProviderCode] = useState("wordpress");
  const [name, setName] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [configJsonStr, setConfigJsonStr] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (selectedProvider) {
      setProviderCode(selectedProvider.code);
      setName(`${selectedProvider.name} Integration`);
    } else {
      setProviderCode("wordpress");
      setName("WordPress Official Blog");
    }
  }, [selectedProvider, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    let parsedConfig: Record<string, any> | undefined;
    if (configJsonStr.trim()) {
      try {
        parsedConfig = JSON.parse(configJsonStr);
      } catch {
        alert("Invalid JSON in configuration field.");
        return;
      }
    }

    try {
      setIsSubmitting(true);
      await onSubmit({
        organizationId,
        providerCode,
        name: name.trim(),
        accessToken: accessToken.trim() || undefined,
        configJson: parsedConfig,
      });
      setName("");
      setAccessToken("");
      setConfigJsonStr("");
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[480px] border-border/80 bg-card/95 backdrop-blur-xl">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-sky-500/10 text-sky-400">
                <Cable className="w-5 h-5" />
              </div>
              <DialogTitle className="text-lg font-bold">Connect External Integration</DialogTitle>
            </div>
            <DialogDescription className="text-xs text-muted-foreground mt-1">
              Link third-party platforms with token encryption, automated rate limiting, and webhooks.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="providerCode" className="text-xs font-semibold">
                Integration Provider
              </Label>
              <select
                id="providerCode"
                value={providerCode}
                onChange={(e) => {
                  setProviderCode(e.target.value);
                  const found = providers.find((p) => p.code === e.target.value);
                  if (found) setName(`${found.name} Connector`);
                }}
                className="w-full h-10 px-3 rounded-md bg-background/50 border border-border/70 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              >
                {providers.length > 0 ? (
                  providers.map((p) => (
                    <option key={p.code} value={p.code}>
                      {p.name} ({p.category})
                    </option>
                  ))
                ) : (
                  <>
                    <option value="wordpress">WordPress (CMS)</option>
                    <option value="shopify">Shopify (CMS)</option>
                    <option value="webflow">Webflow (CMS)</option>
                    <option value="slack">Slack (COMMUNICATION)</option>
                    <option value="hubspot">HubSpot (CRM)</option>
                    <option value="github">GitHub (DEVELOPER_TOOLS)</option>
                  </>
                )}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="integrationName" className="text-xs font-semibold">
                Integration Display Name
              </Label>
              <Input
                id="integrationName"
                placeholder="e.g. Production Blog WordPress Sync"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="bg-background/50 border-border/70 text-sm"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="accessToken" className="text-xs font-semibold">
                API Key / Access Token (Encrypted at Rest)
              </Label>
              <Input
                id="accessToken"
                type="password"
                placeholder="Bearer / API Key token..."
                value={accessToken}
                onChange={(e) => setAccessToken(e.target.value)}
                className="bg-background/50 border-border/70 text-sm font-mono"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="configJson" className="text-xs font-semibold">
                Custom Configuration (JSON optional)
              </Label>
              <Input
                id="configJson"
                placeholder='{"webhookUrl": "https://...", "autoSync": true}'
                value={configJsonStr}
                onChange={(e) => setConfigJsonStr(e.target.value)}
                className="bg-background/50 border-border/70 text-xs font-mono"
              />
            </div>

            <div className="p-3 rounded-lg bg-background/40 border border-border/50 text-[11px] text-muted-foreground space-y-1">
              <span className="font-semibold text-foreground">Tenant Isolation Boundary:</span>
              <p>Target Organization: <code className="text-xs text-sky-400">{organizationId}</code></p>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting} className="text-xs">
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !name.trim()}
              className="text-xs bg-sky-600 hover:bg-sky-700 text-white gap-1.5"
            >
              {isSubmitting ? (
                "Connecting..."
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5" />
                  <span>Connect Integration</span>
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
