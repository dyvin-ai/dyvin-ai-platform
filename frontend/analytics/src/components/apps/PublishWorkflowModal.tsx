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
import { Workflow, Plus } from "lucide-react";
import type { PublishWorkflowInput } from "@/types";

interface PublishWorkflowModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (input: PublishWorkflowInput) => Promise<void>;
}

export function PublishWorkflowModal({
  isOpen,
  onClose,
  onSubmit,
}: PublishWorkflowModalProps) {
  const [workflowName, setWorkflowName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!workflowName.trim()) return;

    try {
      setIsSubmitting(true);
      await onSubmit({
        workflowName: workflowName.trim(),
      });
      setWorkflowName("");
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[440px] border-border/80 bg-card/95 backdrop-blur-xl">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                <Workflow className="w-5 h-5" />
              </div>
              <DialogTitle className="text-lg font-bold">Publish Automated Workflow</DialogTitle>
            </div>
            <DialogDescription className="text-xs text-muted-foreground mt-1">
              Package and deploy an autonomous orchestration pipeline across your enterprise team.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="workflowName" className="text-xs font-semibold">
                Workflow Name
              </Label>
              <Input
                id="workflowName"
                placeholder="e.g. Citation Graph Automated Re-Index"
                value={workflowName}
                onChange={(e) => setWorkflowName(e.target.value)}
                required
                className="bg-background/50 border-border/70 text-sm"
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting} className="text-xs">
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !workflowName.trim()}
              className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white gap-1.5"
            >
              {isSubmitting ? (
                "Publishing..."
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5" />
                  <span>Publish Workflow</span>
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
