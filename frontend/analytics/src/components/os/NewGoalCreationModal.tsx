import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Target, Loader2, Sparkles, Workflow } from "lucide-react";
import type { CreateStrategicGoalInput } from "@/types";

interface NewGoalCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (input: CreateStrategicGoalInput) => Promise<void>;
}

export function NewGoalCreationModal({
  isOpen,
  onClose,
  onSubmit,
}: NewGoalCreationModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        organizationId: "f5bb0153-e41a-49ee-97dc-e03dc6228403",
        title: title.trim(),
        description: description.trim(),
      });
      setTitle("");
      setDescription("");
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Target className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-base font-semibold">
                Define Strategic Horizon Goal
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Set a high-level corporate objective for Dyvin AI 2.0 to autonomously plan and execute
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label htmlFor="goal-title" className="text-xs font-medium">
              Goal Title
            </Label>
            <Input
              id="goal-title"
              placeholder="e.g. Expand Developer Portal Citations on Tech Portals"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-xs h-9"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="goal-desc" className="text-xs font-medium">
              Operational Mandate & Target Outcome
            </Label>
            <Textarea
              id="goal-desc"
              placeholder="Describe the desired search visibility benchmark, target domains, and horizon timeframe..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="text-xs"
              required
            />
          </div>

          <div className="p-3 rounded-lg border border-border/60 bg-muted/20 text-xs space-y-1">
            <div className="flex items-center gap-1.5 font-medium text-foreground text-[11px]">
              <Workflow className="h-3.5 w-3.5 text-indigo-500" />
              Autonomous Planning Action:
            </div>
            <p className="text-[11px] text-muted-foreground">
              Submitting triggers the multi-agent Planning Engine to formulate risk-scored execution plans across Research, SEO, Citation, and Action agents.
            </p>
          </div>

          <DialogFooter className="gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={isSubmitting}
              className="h-8 text-xs"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isSubmitting || !title.trim() || !description.trim()}
              className="h-8 gap-1.5 text-xs"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Orchestrating...
                </>
              ) : (
                <>
                  <Sparkles className="h-3.5 w-3.5" />
                  Create Goal & Plan
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
