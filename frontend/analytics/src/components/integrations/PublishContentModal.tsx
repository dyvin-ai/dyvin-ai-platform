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
import { Send, Globe } from "lucide-react";
import type { PublishCMSContentInput } from "@/types";

interface PublishContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (input: PublishCMSContentInput) => Promise<void>;
}

export function PublishContentModal({
  isOpen,
  onClose,
  onSubmit,
}: PublishContentModalProps) {
  const [platform, setPlatform] = useState<"WORDPRESS" | "WEBFLOW" | "SHOPIFY">("WORDPRESS");
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState<"DRAFT" | "PUBLISHED">("PUBLISHED");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    try {
      setIsSubmitting(true);
      await onSubmit({
        platform,
        title: title.trim(),
        slug: slug.trim() || undefined,
        content: content.trim(),
        status,
      });
      setTitle("");
      setSlug("");
      setContent("");
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[520px] border-border/80 bg-card/95 backdrop-blur-xl">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-sky-500/10 text-sky-400">
                <Send className="w-5 h-5" />
              </div>
              <DialogTitle className="text-lg font-bold">Publish Content to CMS</DialogTitle>
            </div>
            <DialogDescription className="text-xs text-muted-foreground mt-1">
              Deploy optimized citations, FAQ schema, and articles directly into your connected CMS platform.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="platform" className="text-xs font-semibold">
                  CMS Target
                </Label>
                <select
                  id="platform"
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value as any)}
                  className="w-full h-9 px-3 rounded-md bg-background/50 border border-border/70 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                >
                  <option value="WORDPRESS">WordPress</option>
                  <option value="WEBFLOW">Webflow</option>
                  <option value="SHOPIFY">Shopify</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="status" className="text-xs font-semibold">
                  Publication State
                </Label>
                <select
                  id="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full h-9 px-3 rounded-md bg-background/50 border border-border/70 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                >
                  <option value="PUBLISHED">Published (Live)</option>
                  <option value="DRAFT">Draft</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="title" className="text-xs font-semibold">
                Article / Content Title
              </Label>
              <Input
                id="title"
                placeholder="e.g. Generative Engine Optimization: The Definitive Guide"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (!slug) {
                    setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""));
                  }
                }}
                required
                className="bg-background/50 border-border/70 text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="slug" className="text-xs font-semibold">
                URL Slug
              </Label>
              <Input
                id="slug"
                placeholder="e.g. geo-optimization-guide"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="bg-background/50 border-border/70 text-xs font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="content" className="text-xs font-semibold">
                Content Body (Markdown or HTML)
              </Label>
              <textarea
                id="content"
                rows={5}
                placeholder="Enter rich content or JSON-LD FAQ schemas..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                className="w-full p-2.5 rounded-md bg-background/50 border border-border/70 text-xs font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-ring resize-none"
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting} className="text-xs">
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !title.trim() || !content.trim()}
              className="text-xs bg-sky-600 hover:bg-sky-700 text-white gap-1.5"
            >
              {isSubmitting ? (
                "Publishing..."
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Publish to CMS</span>
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
