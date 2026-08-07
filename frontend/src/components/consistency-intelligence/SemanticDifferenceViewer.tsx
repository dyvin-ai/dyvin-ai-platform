import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@components/ui/Dialog';
import { Button } from '@components/ui/Button';
import { Badge } from '@components/ui/Badge';
import { useConsistencyStore } from '@stores/consistencyStore';
import { Layers, Sparkles, CheckCircle2 } from 'lucide-react';

export function SemanticDifferenceViewer() {
  const { isDiffViewerOpen, setIsDiffViewerOpen, selectedConflictId } = useConsistencyStore();

  return (
    <Dialog open={isDiffViewerOpen} onOpenChange={(open) => !open && setIsDiffViewerOpen(false)}>
      <DialogContent className="max-w-xl bg-card border border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground text-base">
            <Layers className="w-5 h-5 text-primary" /> Semantic Difference & Statement Alignment
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-2 text-xs">
          <div className="p-4 rounded-xl border border-border bg-muted/20 space-y-2">
            <h4 className="font-bold text-foreground">Statement Alignment Recommendation</h4>
            <p className="text-muted-foreground">
              Injecting canonical Organization JSON-LD schema with explicitly declared <code className="text-primary">hasCredential</code> attributes will force Grok 2.0 and Gemini 1.5 Pro to converge on 100% factual consensus.
            </p>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsDiffViewerOpen(false)}>
              Close
            </Button>
            <Button leftIcon={<Sparkles className="w-4 h-4" />}>
              Auto-Align Statements
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
