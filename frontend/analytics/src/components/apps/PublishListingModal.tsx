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
import { ShoppingBag, Plus } from "lucide-react";
import type { PublishListingInput } from "@/types";

interface PublishListingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (input: PublishListingInput) => Promise<void>;
}

export function PublishListingModal({
  isOpen,
  onClose,
  onSubmit,
}: PublishListingModalProps) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("AI_WORKFLOW_TEMPLATES");
  const [price, setPrice] = useState("0");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      setIsSubmitting(true);
      await onSubmit({
        title: title.trim(),
        category,
        price: parseFloat(price) || 0,
      });
      setTitle("");
      setPrice("0");
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
              <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <DialogTitle className="text-lg font-bold">Publish to Marketplace</DialogTitle>
            </div>
            <DialogDescription className="text-xs text-muted-foreground mt-1">
              List your validated AI model extension, schema generator, or prompt playbook on the public exchange.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-xs font-semibold">
                Listing Title
              </Label>
              <Input
                id="title"
                placeholder="e.g. DeepSeek R1 GEO Citation Auditor"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="bg-background/50 border-border/70 text-sm"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category" className="text-xs font-semibold">
                Category
              </Label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full h-10 px-3 rounded-md bg-background/50 border border-border/70 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              >
                <option value="AI_WORKFLOW_TEMPLATES">AI Workflow Templates</option>
                <option value="INTELLIGENCE_MODULES">Intelligence Modules</option>
                <option value="MODEL_PLUGINS">Model Plugins</option>
                <option value="CRM_INTEGRATIONS">CRM Integrations</option>
                <option value="SECURITY_POLICIES">Security Policies</option>
                <option value="RETRIEVAL_CONNECTORS">Retrieval Connectors</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="price" className="text-xs font-semibold">
                Price (USD, $0 for Free Community Tier)
              </Label>
              <Input
                id="price"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
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
              disabled={isSubmitting || !title.trim()}
              className="text-xs bg-purple-600 hover:bg-purple-700 text-white gap-1.5"
            >
              {isSubmitting ? (
                "Publishing..."
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5" />
                  <span>Publish Listing</span>
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
