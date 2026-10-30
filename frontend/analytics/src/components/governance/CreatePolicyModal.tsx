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
import { Scale, ShieldCheck } from "lucide-react";
import type { CreatePolicyInput } from "@/types";

interface CreatePolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (input: CreatePolicyInput) => Promise<void>;
  organizationId?: string;
}

export function CreatePolicyModal({
  isOpen,
  onClose,
  onSubmit,
  organizationId = "f5bb0153-e41a-49ee-97dc-e03dc6228403",
}: CreatePolicyModalProps) {
  const [policyName, setPolicyName] = useState("");
  const [policyType, setPolicyType] = useState("SECURITY_AND_COMPLIANCE");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!policyName.trim()) return;

    try {
      setIsSubmitting(true);
      await onSubmit({
        organizationId,
        policyName: policyName.trim(),
        policyType,
      });
      setPolicyName("");
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
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <Scale className="w-5 h-5" />
              </div>
              <DialogTitle className="text-lg font-bold">
                Create AI Governance Policy
              </DialogTitle>
            </div>
            <DialogDescription className="text-xs text-muted-foreground mt-1">
              Configure a deterministic boundary policy enforced across multi-model executions and autonomous agents.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-1.5">
              <Label htmlFor="policy-name" className="text-xs font-medium">
                Policy Name
              </Label>
              <Input
                id="policy-name"
                placeholder="e.g. Real-Time Financial Advice Boundary Filter"
                value={policyName}
                onChange={(e) => setPolicyName(e.target.value)}
                required
                className="h-9 text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="policy-type" className="text-xs font-medium">
                Policy Category / Type
              </Label>
              <select
                id="policy-type"
                value={policyType}
                onChange={(e) => setPolicyType(e.target.value)}
                className="w-full h-9 rounded-md border border-input bg-background/50 px-3 py-1 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              >
                <option value="SECURITY_AND_COMPLIANCE">Security & Compliance</option>
                <option value="DATA_PRIVACY">Data Privacy Shield</option>
                <option value="SAFETY_AND_ACCURACY">Safety & Grounding Check</option>
                <option value="WORKFLOW_GOVERNANCE">Workflow Approval Dual Sign-Off</option>
                <option value="RESPONSIBLE_AI">Responsible AI & Bias Mitigation</option>
                <option value="OPERATIONAL_RESILIENCE">Operational Resilience & Latency</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground">
                Target Organization
              </Label>
              <Input
                value={organizationId}
                disabled
                className="h-9 text-xs font-mono bg-muted/30 text-muted-foreground"
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isSubmitting || !policyName.trim()}
              className="gap-1.5"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{isSubmitting ? "Enforcing..." : "Enforce Policy"}</span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
