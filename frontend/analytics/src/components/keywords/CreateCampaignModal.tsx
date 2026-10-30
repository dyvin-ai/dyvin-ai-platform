import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Zap, X } from "lucide-react";
import type { CampaignFrequency, CreateCampaignInput } from "@/types";

interface CreateCampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (input: CreateCampaignInput) => Promise<void>;
  organizationId: string;
}

export function CreateCampaignModal({
  isOpen,
  onClose,
  onSubmit,
  organizationId,
}: CreateCampaignModalProps) {
  const [name, setName] = useState("");
  const [frequency, setFrequency] = useState<CampaignFrequency>("DAILY");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        organizationId,
        name: name.trim(),
        frequency,
      });
      setName("");
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
          <div className="p-2.5 bg-cyan-500/10 border border-cyan-500/20 rounded-lg">
            <Zap className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-foreground">Create Monitoring Campaign</h3>
            <p className="text-xs text-muted-foreground">
              Configure autonomous citation sweeps tracking generative engine presence.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-foreground block mb-1">
              Campaign Name <span className="text-rose-400">*</span>
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Q4 Executive Generative Citation Audit"
              className="text-xs"
              required
            />
          </div>

          <div>
            <label className="text-xs font-medium text-foreground block mb-1">Audit Cadence</label>
            <select
              value={frequency}
              onChange={(e) => setFrequency(e.target.value as CampaignFrequency)}
              aria-label="Audit Cadence"
              className="w-full h-9 rounded-md border border-input bg-background px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            >
              <option value="HOURLY">Hourly High-Frequency Audit</option>
              <option value="DAILY">Daily Standard Sweep</option>
              <option value="WEEKLY">Weekly Executive Benchmark</option>
              <option value="MONTHLY">Monthly Overview Summary</option>
            </select>
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-border/50">
            <Button type="button" variant="outline" size="sm" onClick={onClose} className="text-xs">
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isSubmitting || !name.trim()}
              className="bg-cyan-600 hover:bg-cyan-500 text-white text-xs"
            >
              {isSubmitting ? "Creating..." : "Schedule Campaign"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
