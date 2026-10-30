import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Key, X, Copy, Check, AlertTriangle, ShieldCheck } from "lucide-react";
import type { DeveloperAppItem, CreateAPIKeyResult } from "@/types";

interface GenerateKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  applications: DeveloperAppItem[];
  selectedAppId?: string;
  onGenerate: (applicationId: string, expiresInDays?: number) => Promise<CreateAPIKeyResult>;
}

export function GenerateKeyModal({
  isOpen,
  onClose,
  applications = [],
  selectedAppId,
  onGenerate,
}: GenerateKeyModalProps) {
  const [appId, setAppId] = useState(selectedAppId || (applications[0]?.id ?? ""));
  const [expiresInDays, setExpiresInDays] = useState<number>(90);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generatedResult, setGeneratedResult] = useState<CreateAPIKeyResult | null>(null);
  const [hasCopied, setHasCopied] = useState(false);

  if (!isOpen) return null;

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!appId) return;

    setIsSubmitting(true);
    try {
      const result = await onGenerate(appId, expiresInDays);
      setGeneratedResult(result);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyRawKey = () => {
    if (!generatedResult?.rawKey) return;
    navigator.clipboard.writeText(generatedResult.rawKey);
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2500);
  };

  const handleClose = () => {
    setGeneratedResult(null);
    setHasCopied(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-card border border-border rounded-xl shadow-2xl p-6 relative">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground p-1 rounded-md cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="p-2.5 bg-sky-500/10 text-sky-400 rounded-lg border border-sky-500/20">
            <Key className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground">Generate Public API Key</h3>
            <p className="text-xs text-muted-foreground">Issue SHA-256 hashed credentials for programmatic gateway access</p>
          </div>
        </div>

        {generatedResult ? (
          <div className="space-y-4">
            <div className="p-3.5 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-start gap-2.5 text-xs text-amber-300">
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-amber-200 block text-sm mb-1">
                  Save your secret key now!
                </span>
                For security reasons, this raw secret is hashed with SHA-256 and will never be shown again. If you lose this key, you must generate a new one.
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5 font-mono">
                Secret API Key
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={generatedResult.rawKey}
                  className="w-full px-3 py-2 text-xs font-mono font-medium rounded-lg border border-sky-500/40 bg-surface text-sky-300 select-all"
                />
                <Button
                  size="sm"
                  onClick={handleCopyRawKey}
                  className="shrink-0 gap-1 bg-sky-600 hover:bg-sky-700 text-white text-xs h-9"
                >
                  {hasCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{hasCopied ? "Copied" : "Copy"}</span>
                </Button>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-surface border border-border text-xs text-muted-foreground font-mono space-y-1">
              <div><span className="text-foreground">Key Prefix:</span> {generatedResult.apiKey.prefix}</div>
              <div><span className="text-foreground">SHA-256 Hash:</span> {generatedResult.apiKey.keyHash.substring(0, 24)}...</div>
              <div><span className="text-foreground">Status:</span> {generatedResult.apiKey.status}</div>
            </div>

            <div className="pt-2 flex justify-end">
              <Button onClick={handleClose} className="bg-sky-600 hover:bg-sky-700 text-white">
                I Have Stored My Key Safely
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleGenerate} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">
                Target Application *
              </label>
              <select
                required
                value={appId}
                onChange={(e) => setAppId(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-surface text-foreground focus:outline-none focus:ring-1 focus:ring-sky-500"
              >
                {applications.map((app) => (
                  <option key={app.id} value={app.id}>
                    {app.name} ({app.status})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">
                Key Expiration Policy
              </label>
              <select
                value={expiresInDays}
                onChange={(e) => setExpiresInDays(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-surface text-foreground focus:outline-none focus:ring-1 focus:ring-sky-500"
              >
                <option value={30}>30 Days (Recommended for Staging)</option>
                <option value={90}>90 Days (Enterprise Standard)</option>
                <option value={180}>180 Days (Long Term)</option>
                <option value={365}>1 Year (Automated Daemon)</option>
              </select>
            </div>

            <div className="p-3 rounded-lg bg-surface border border-border flex items-start gap-2.5 text-xs text-muted-foreground">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                Keys are issued with the <code className="text-foreground font-mono">dyv_live_</code> prefix and granted scopes matching your organization's RBAC tier.
              </div>
            </div>

            <div className="pt-3 flex items-center justify-end gap-2">
              <Button type="button" variant="outline" onClick={handleClose} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting || !appId} className="bg-sky-600 hover:bg-sky-700 text-white">
                {isSubmitting ? "Generating Key..." : "Generate Key"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
