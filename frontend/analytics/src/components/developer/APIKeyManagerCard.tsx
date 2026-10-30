import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Key,
  Plus,
  ShieldCheck,
  ShieldAlert,
  Calendar,
  Lock,
  Copy,
  Check,
  AlertTriangle,
} from "lucide-react";
import type { DeveloperAPIKeyItem } from "@/types";

interface APIKeyManagerCardProps {
  apiKeys: DeveloperAPIKeyItem[];
  selectedAppName?: string;
  isLoading?: boolean;
  onGenerateKeyClick?: () => void;
  onRevokeKeyClick?: (keyId: string) => void;
}

export function APIKeyManagerCard({
  apiKeys = [],
  selectedAppName,
  isLoading = false,
  onGenerateKeyClick,
  onRevokeKeyClick,
}: APIKeyManagerCardProps) {
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);

  const handleCopyPrefix = (key: DeveloperAPIKeyItem) => {
    navigator.clipboard.writeText(`${key.prefix}_********************`);
    setCopiedKeyId(key.id);
    setTimeout(() => setCopiedKeyId(null), 2000);
  };

  return (
    <Card className="border border-border/50 bg-card/60 backdrop-blur-sm">
      <CardHeader className="p-5 pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Key className="w-5 h-5 text-sky-400" />
              <CardTitle className="text-base font-semibold text-foreground">
                API Authentication Keys
              </CardTitle>
              {selectedAppName && (
                <Badge variant="outline" className="text-xs font-normal border-border">
                  {selectedAppName}
                </Badge>
              )}
            </div>
            <CardDescription className="text-xs text-muted-foreground mt-1">
              Keys are hashed using SHA-256 before storage. Raw secrets are never retrievable after issuance.
            </CardDescription>
          </div>
          {onGenerateKeyClick && (
            <Button size="sm" onClick={onGenerateKeyClick} className="gap-1.5 h-8 bg-sky-600 hover:bg-sky-700 text-white text-xs">
              <Plus className="w-3.5 h-3.5" />
              <span>Generate Key</span>
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-5 pt-2">
        {isLoading ? (
          <div className="py-8 text-center text-sm text-muted-foreground animate-pulse">
            Loading API keys...
          </div>
        ) : apiKeys.length === 0 ? (
          <div className="py-8 text-center">
            <Lock className="w-8 h-8 text-muted-foreground/40 mx-auto mb-2" />
            <p className="text-sm font-medium text-foreground">No API keys generated</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Create an API key to authenticate requests against the public gateway.
            </p>
            {onGenerateKeyClick && (
              <Button size="sm" onClick={onGenerateKeyClick} className="mt-3 gap-1.5 h-8">
                <Plus className="w-3.5 h-3.5" />
                <span>Create Key Now</span>
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {apiKeys.map((key) => {
              const isActive = key.status === "ACTIVE";
              return (
                <div
                  key={key.id}
                  className="p-3.5 rounded-lg border border-border/60 bg-surface/50 hover:bg-surface transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-semibold text-foreground bg-surface-subtle px-2 py-0.5 rounded border border-border">
                        {key.prefix}_••••••••••••••••••••
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopyPrefix(key)}
                        className="text-muted-foreground hover:text-foreground p-1 rounded cursor-pointer"
                        title="Copy key prefix"
                      >
                        {copiedKeyId === key.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                      <Badge
                        variant="outline"
                        className={`text-[10px] uppercase font-mono px-1.5 py-0 ${
                          isActive
                            ? "border-emerald-500/30 text-emerald-400 bg-emerald-500/10"
                            : "border-red-500/30 text-red-400 bg-red-500/10"
                        }`}
                      >
                        {key.status}
                      </Badge>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground font-mono">
                      <span>Hash: {key.keyHash.substring(0, 16)}...</span>
                      {key.expiresAt && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Expires: {new Date(key.expiresAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    {isActive && onRevokeKeyClick && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onRevokeKeyClick(key.id)}
                        className="h-7 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      >
                        Revoke Key
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}

            <div className="mt-4 p-3 rounded-md bg-amber-500/5 border border-amber-500/20 flex items-start gap-2.5 text-xs text-amber-300/90">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-amber-200">Security Best Practice: </span>
                Rotate API keys every 90 days. Never commit API keys to version control or client-side bundles.
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
