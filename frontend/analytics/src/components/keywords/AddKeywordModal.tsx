import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import type { CreateKeywordInput, KeywordClusterItem, KeywordIntentType } from "@/types";

interface AddKeywordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (input: CreateKeywordInput) => Promise<void>;
  organizationId: string;
  clusters: KeywordClusterItem[];
}

export function AddKeywordModal({
  isOpen,
  onClose,
  onSubmit,
  organizationId,
  clusters,
}: AddKeywordModalProps) {
  const [text, setText] = useState("");
  const [intent, setIntent] = useState<KeywordIntentType>("COMMERCIAL");
  const [searchVolume, setSearchVolume] = useState("2400");
  const [difficulty, setDifficulty] = useState("35");
  const [opportunityScore, setOpportunityScore] = useState("85");
  const [clusterId, setClusterId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        organizationId,
        text: text.trim(),
        intent,
        searchVolume: parseInt(searchVolume, 10) || 1200,
        difficulty: parseInt(difficulty, 10) || 30,
        opportunityScore: parseFloat(opportunityScore) || 80.0,
        clusterId: clusterId || undefined,
      });
      setText("");
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-2xl animate-in fade-in zoom-in-95">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <Search className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-foreground">Add Discovery Term</h3>
            <p className="text-xs text-muted-foreground">
              Register a new keyword to analyze search demand & generative engine visibility.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-foreground block mb-1">
              Keyword Query <span className="text-rose-400">*</span>
            </label>
            <Input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="e.g. enterprise ai search visibility"
              className="text-xs"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-foreground block mb-1">Intent Category</label>
              <select
                value={intent}
                onChange={(e) => setIntent(e.target.value as KeywordIntentType)}
                aria-label="Intent Category"
                className="w-full h-9 rounded-md border border-input bg-background px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              >
                <option value="COMMERCIAL">Commercial</option>
                <option value="INFORMATIONAL">Informational</option>
                <option value="TRANSACTIONAL">Transactional</option>
                <option value="COMPARISON">Comparison</option>
                <option value="QUESTION">Question</option>
                <option value="LOCAL">Local</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-foreground block mb-1">Topic Cluster</label>
              <select
                value={clusterId}
                onChange={(e) => setClusterId(e.target.value)}
                aria-label="Topic Cluster"
                className="w-full h-9 rounded-md border border-input bg-background px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              >
                <option value="">(None / Standalone)</option>
                {clusters.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-medium text-foreground block mb-1">Est. Volume</label>
              <Input
                type="number"
                value={searchVolume}
                onChange={(e) => setSearchVolume(e.target.value)}
                className="text-xs"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-foreground block mb-1">Difficulty (0-100)</label>
              <Input
                type="number"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="text-xs"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-foreground block mb-1">Opportunity %</label>
              <Input
                type="number"
                value={opportunityScore}
                onChange={(e) => setOpportunityScore(e.target.value)}
                className="text-xs"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-border/50">
            <Button type="button" variant="outline" size="sm" onClick={onClose} className="text-xs">
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isSubmitting || !text.trim()}
              className="bg-blue-600 hover:bg-blue-500 text-white text-xs"
            >
              {isSubmitting ? "Adding..." : "Add Discovery Term"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
