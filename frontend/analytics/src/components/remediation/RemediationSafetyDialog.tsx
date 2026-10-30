import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShieldAlert, ShieldCheck, Play, Sparkles, AlertTriangle, CheckCircle2, Lock } from "lucide-react";

interface RemediationSafetyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  actionTitle: string;
  actionDescription?: string | null;
  actionType: string;
  onConfirm: () => Promise<void>;
}

export function RemediationSafetyDialog({
  open,
  onOpenChange,
  actionTitle,
  actionDescription,
  actionType,
  onConfirm,
}: RemediationSafetyDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      await onConfirm();
      onOpenChange(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl bg-surface border-border p-6 space-y-5">
        <DialogHeader className="space-y-1.5 border-b border-border/60 pb-3">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2 text-foreground text-base font-semibold">
              <div className="p-1.5 rounded-md bg-amber-500/10 text-amber-500">
                <ShieldAlert className="size-4" />
              </div>
              Authorization & Safety Review Guardrail
            </DialogTitle>
            <Badge variant="outline" className="text-[10px] font-mono bg-amber-500/10 text-amber-500 border-amber-500/25">
              GATED APPROVAL
            </Badge>
          </div>
          <DialogDescription className="text-xs text-muted-foreground">
            Verify automated execution scope before triggering background worker jobs.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 text-xs">
          {/* Action Summary */}
          <div className="p-3.5 rounded-xl border border-border/80 bg-surface-subtle/40 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-foreground text-sm">{actionTitle}</span>
              <Badge variant="outline" className="text-[10px] font-mono">
                {actionType}
              </Badge>
            </div>
            {actionDescription && (
              <p className="text-muted-foreground text-xs leading-relaxed">
                {actionDescription}
              </p>
            )}
          </div>

          {/* Safety Checklist */}
          <div className="rounded-xl border border-border/80 bg-surface-subtle/20 p-3.5 space-y-2.5">
            <span className="font-semibold text-[11px] uppercase tracking-wider text-muted-foreground block">
              Automated Safety Pre-Flight Verification:
            </span>

            <div className="space-y-2 text-xs">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="size-4 text-emerald-500 shrink-0 mt-0.5" />
                <span className="text-foreground">
                  <strong>Non-destructive Execution:</strong> Execution will synthesize brand knowledge artifacts without overwriting production schemas directly.
                </span>
              </div>

              <div className="flex items-start gap-2">
                <CheckCircle2 className="size-4 text-emerald-500 shrink-0 mt-0.5" />
                <span className="text-foreground">
                  <strong>Tenant Scoping Verified:</strong> Action runs exclusively within the active workspace organization boundary.
                </span>
              </div>

              <div className="flex items-start gap-2">
                <CheckCircle2 className="size-4 text-emerald-500 shrink-0 mt-0.5" />
                <span className="text-foreground">
                  <strong>Queue Isolation:</strong> Job is queued asynchronously in Redis Bull queue and logged to the enterprise audit trail.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border/60">
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            size="sm"
            className="gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90"
            disabled={isSubmitting}
            onClick={handleConfirm}
          >
            <Play className="size-3.5" />
            {isSubmitting ? "Queueing Worker Job..." : "Authorize & Execute Action"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
