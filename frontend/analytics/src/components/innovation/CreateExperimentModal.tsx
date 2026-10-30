import React, { useState } from "react";
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
import { Badge } from "@/components/ui/badge";
import { FlaskConical, ShieldAlert, Sparkles } from "lucide-react";
import type { CreateExperimentInput } from "@/types";

interface CreateExperimentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (input: CreateExperimentInput) => Promise<void>;
  isSubmitting?: boolean;
}

export function CreateExperimentModal({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
}: CreateExperimentModalProps) {
  const [title, setTitle] = useState("");
  const [owner, setOwner] = useState("");
  const [riskLevel, setRiskLevel] = useState("LOW");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !owner.trim()) return;

    await onSubmit({
      title: title.trim(),
      owner: owner.trim(),
      riskLevel,
    });

    setTitle("");
    setOwner("");
    setRiskLevel("LOW");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md border-border/80 bg-surface-card">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <FlaskConical className="h-4 w-4" />
            </div>
            <div>
              <DialogTitle className="text-base font-semibold text-foreground">
                Register Sandboxed AI Experiment
              </DialogTitle>
              <DialogDescription className="text-xs text-foreground-muted">
                Create a strictly isolated experiment without touching customer data
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="exp-title" className="text-xs font-medium text-foreground">
              Experiment Title
            </Label>
            <Input
              id="exp-title"
              placeholder="e.g. Gemini 2.0 Multimodal Grounding Benchmark"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="h-9 text-xs bg-surface-elevated border-border/60"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="exp-owner" className="text-xs font-medium text-foreground">
              Lead Researcher / Team
            </Label>
            <Input
              id="exp-owner"
              placeholder="e.g. Cognitive Systems Lab"
              value={owner}
              onChange={(e) => setOwner(e.target.value)}
              className="h-9 text-xs bg-surface-elevated border-border/60"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-foreground block">
              Risk Classification
            </Label>
            <div className="grid grid-cols-3 gap-2">
              {["LOW", "MEDIUM", "HIGH"].map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setRiskLevel(level)}
                  className={`py-2 px-3 text-xs rounded-lg border text-center transition-all ${
                    riskLevel === level
                      ? "border-primary bg-primary/10 text-primary font-semibold ring-1 ring-primary/30"
                      : "border-border/60 bg-surface-elevated/40 text-foreground-muted hover:bg-surface-elevated"
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          <div className="p-3 rounded-lg border border-border/40 bg-surface-elevated/40 text-[11px] text-foreground-muted space-y-1">
            <div className="flex items-center gap-1.5 text-foreground font-medium">
              <ShieldAlert className="h-3.5 w-3.5 text-amber-400" />
              <span>Sandbox Isolation Guarantee</span>
            </div>
            <p>
              Experiments are assigned ephemeral containers and air-gapped from live user sessions until promoted via Evaluation Gate.
            </p>
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={isSubmitting}
              className="text-xs h-8"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isSubmitting || !title.trim() || !owner.trim()}
              className="text-xs h-8 bg-primary text-primary-foreground hover:bg-primary/90 gap-1.5"
            >
              {isSubmitting ? (
                <>
                  <Sparkles className="h-3 w-3 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <FlaskConical className="h-3 w-3" />
                  Register Experiment
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
