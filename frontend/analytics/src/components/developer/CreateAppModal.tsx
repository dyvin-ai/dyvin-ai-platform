import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Layers, X } from "lucide-react";
import type { CreateDeveloperAppInput } from "@/types";

interface CreateAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (input: CreateDeveloperAppInput) => Promise<void>;
  organizationId: string;
}

export function CreateAppModal({
  isOpen,
  onClose,
  onSubmit,
  organizationId,
}: CreateAppModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<'DEVELOPMENT' | 'STAGING' | 'PRODUCTION'>('DEVELOPMENT');
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
        description: description.trim() || undefined,
        status,
      });
      setName("");
      setDescription("");
      setStatus("DEVELOPMENT");
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-card border border-border rounded-xl shadow-2xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground p-1 rounded-md cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-lg border border-emerald-500/20">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground">Register Developer App</h3>
            <p className="text-xs text-muted-foreground">Provision an application to issue API keys and webhooks</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">
              Application Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Northwind GEO Citation Worker"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-surface text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">
              Description
            </label>
            <textarea
              rows={3}
              placeholder="Describe the workload or client integrating with Dyvin AI..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-surface text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">
              Environment Stage
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-surface text-foreground focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="DEVELOPMENT">Development</option>
              <option value="STAGING">Staging</option>
              <option value="PRODUCTION">Production</option>
            </select>
          </div>

          <div className="pt-3 flex items-center justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || !name.trim()} className="bg-emerald-600 hover:bg-emerald-700 text-white">
              {isSubmitting ? "Creating App..." : "Create Application"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
