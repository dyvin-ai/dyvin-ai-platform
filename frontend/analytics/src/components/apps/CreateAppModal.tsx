import { useState } from "react";
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
import { AppWindow, Plus } from "lucide-react";
import type { CreateAppInput } from "@/types";

interface CreateAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (input: CreateAppInput) => Promise<void>;
  organizationId?: string;
}

export function CreateAppModal({
  isOpen,
  onClose,
  onSubmit,
  organizationId = "f5bb0153-e41a-49ee-97dc-e03dc6228403",
}: CreateAppModalProps) {
  const [appName, setAppName] = useState("");
  const [appType, setAppType] = useState("LOW_CODE_AI_APP");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!appName.trim()) return;

    try {
      setIsSubmitting(true);
      await onSubmit({
        organizationId,
        appName: appName.trim(),
        appType,
      });
      setAppName("");
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
              <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                <AppWindow className="w-5 h-5" />
              </div>
              <DialogTitle className="text-lg font-bold">Create Custom AI Application</DialogTitle>
            </div>
            <DialogDescription className="text-xs text-muted-foreground mt-1">
              Deploy a new low-code AI application or autonomous pipeline within your sovereign tenant boundary.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="appName" className="text-xs font-semibold">
                Application Name
              </Label>
              <Input
                id="appName"
                placeholder="e.g. Executive Citation Intelligence Radar"
                value={appName}
                onChange={(e) => setAppName(e.target.value)}
                required
                className="bg-background/50 border-border/70 text-sm"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="appType" className="text-xs font-semibold">
                Application Type
              </Label>
              <select
                id="appType"
                value={appType}
                onChange={(e) => setAppType(e.target.value)}
                className="w-full h-10 px-3 rounded-md bg-background/50 border border-border/70 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              >
                <option value="LOW_CODE_AI_APP">Low-Code AI App</option>
                <option value="ANALYTICS_DASHBOARD">Analytics Dashboard</option>
                <option value="MARKET_INTELLIGENCE">Market Intelligence</option>
                <option value="WORKFLOW_AUTOMATION">Workflow Automation</option>
                <option value="SECURITY_GUARDRAIL">Security Guardrail</option>
              </select>
            </div>

            <div className="p-3 rounded-lg bg-background/40 border border-border/50 text-[11px] text-muted-foreground space-y-1">
              <span className="font-semibold text-foreground">Tenant Isolation Boundary:</span>
              <p>Target Organization: <code className="text-xs text-indigo-400">{organizationId}</code></p>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting} className="text-xs">
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !appName.trim()}
              className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white gap-1.5"
            >
              {isSubmitting ? (
                "Creating..."
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create App</span>
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
