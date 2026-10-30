import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, X, FileText, CheckCircle2 } from "lucide-react";
import type { ImportKeywordsInput } from "@/types";

interface ImportKeywordsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (input: ImportKeywordsInput) => Promise<void>;
  organizationId: string;
}

export function ImportKeywordsModal({
  isOpen,
  onClose,
  onSubmit,
  organizationId,
}: ImportKeywordsModalProps) {
  const [filename, setFilename] = useState("enterprise_keywords.csv");
  const [csvContent, setCsvContent] = useState(
    'keyword,intent\n"enterprise ai answer engine optimization",COMMERCIAL\n"chatgpt citation benchmark for brands",QUESTION\n"perplexity ai brand visibility near me",LOCAL\n"best generative search discovery software",COMMERCIAL'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!csvContent.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        organizationId,
        filename: filename.trim() || "import.csv",
        csvContent: csvContent.trim(),
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-lg rounded-xl border border-border bg-card p-6 shadow-2xl animate-in fade-in zoom-in-95">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
            <Upload className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-foreground">Import Keywords from CSV</h3>
            <p className="text-xs text-muted-foreground">
              Bulk ingest search queries, automatically classify intent, and calculate opportunity scores.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-foreground block mb-1">
              File Name
            </label>
            <Input
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              placeholder="e.g. keywords_october.csv"
              className="text-xs"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-medium text-foreground">
                CSV Payload Content (one keyword per line)
              </label>
              <button
                type="button"
                onClick={() =>
                  setCsvContent(
                    'keyword\n"enterprise generative search optimization"\n"how to rank in ai answers"\n"dyvin ai vs trad seo"\n"buy enterprise answer tracking"'
                  )
                }
                className="text-[11px] text-emerald-400 hover:underline"
              >
                Insert Sample Data
              </button>
            </div>
            <textarea
              value={csvContent}
              onChange={(e) => setCsvContent(e.target.value)}
              rows={6}
              className="w-full rounded-md border border-input bg-background p-3 text-xs font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              required
            />
            <p className="text-[11px] text-muted-foreground mt-1">
              Standard format: <code>keyword,intent</code> or simply plain lines of keyword queries.
            </p>
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-border/50">
            <Button type="button" variant="outline" size="sm" onClick={onClose} className="text-xs">
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isSubmitting || !csvContent.trim()}
              className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs"
            >
              {isSubmitting ? "Importing Data..." : "Run Bulk Import"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
