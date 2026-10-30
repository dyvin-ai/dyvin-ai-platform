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
import { FlaskConical, Loader2, Sparkles } from "lucide-react";
import type { StartResearchInput, ResearchProjectItem } from "@/types";

interface NewResearchRunModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (input: StartResearchInput) => Promise<ResearchProjectItem | void>;
  organizationId: string;
}

export function NewResearchRunModal({
  open,
  onOpenChange,
  onSubmit,
  organizationId,
}: NewResearchRunModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [sources, setSources] = useState("docs.stripe.com, developer.mozilla.org, en.wikipedia.org");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Please provide a title for the research run.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      const parsedSources = sources
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      await onSubmit({
        organizationId,
        title: title.trim(),
        description: description.trim() || undefined,
        sources: parsedSources.length > 0 ? parsedSources : undefined,
      });

      // Reset and close
      setTitle("");
      setDescription("");
      onOpenChange(false);
    } catch (err: any) {
      setError(err?.message || "Failed to start autonomous research run.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card/95 backdrop-blur-md border-border/60">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400">
                <FlaskConical className="h-4 w-4" />
              </div>
              <DialogTitle className="text-base font-bold text-foreground">
                Launch Autonomous Research Run
              </DialogTitle>
            </div>
            <DialogDescription className="text-xs text-muted-foreground">
              Queue a multi-agent discovery sweep across indexed web sources to capture citation changes and competitor movements.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3.5 py-4 text-xs">
            {error && (
              <div className="p-2.5 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs">
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="res-title" className="text-xs font-semibold">
                Project Title <span className="text-destructive">*</span>
              </Label>
              <Input
                id="res-title"
                placeholder="e.g. Q4 Competitor GEO Citation Disruption Audit"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="h-8 text-xs bg-background/50 border-border/60"
                disabled={isSubmitting}
                autoFocus
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="res-desc" className="text-xs font-semibold">
                Research Scope & Objectives
              </Label>
              <Textarea
                id="res-desc"
                placeholder="Describe specific themes, target AI models, or competitor domains to scan..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="text-xs bg-background/50 border-border/60 resize-none"
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="res-sources" className="text-xs font-semibold">
                Target Seed Domains (Comma-Separated)
              </Label>
              <Input
                id="res-sources"
                placeholder="docs.stripe.com, developer.mozilla.org, en.wikipedia.org"
                value={sources}
                onChange={(e) => setSources(e.target.value)}
                className="h-8 text-xs bg-background/50 border-border/60 font-mono"
                disabled={isSubmitting}
              />
              <p className="text-[10px] text-muted-foreground">
                AI agents will automatically resolve canonical apex domains and extract outbound references.
              </p>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
              className="text-xs h-8 border-border/60"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isSubmitting || !title.trim()}
              className="text-xs h-8 gap-1.5 bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Dispatching Agents...
                </>
              ) : (
                <>
                  <Sparkles className="h-3.5 w-3.5" />
                  Launch Discovery Run
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
