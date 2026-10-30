import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Layers,
  Copy,
  Check,
  Key,
  Webhook,
  Activity,
  Plus,
  Terminal,
  Search,
} from "lucide-react";
import type { DeveloperAppItem } from "@/types";

interface DeveloperApplicationsListCardProps {
  applications: DeveloperAppItem[];
  isLoading?: boolean;
  selectedAppId?: string;
  onSelectApp?: (appId: string) => void;
  onCreateAppClick?: () => void;
  onGenerateKeyClick?: (appId: string) => void;
}

export function DeveloperApplicationsListCard({
  applications = [],
  isLoading = false,
  selectedAppId,
  onSelectApp,
  onCreateAppClick,
  onGenerateKeyClick,
}: DeveloperApplicationsListCardProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const handleCopy = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filtered = applications.filter((app) =>
    app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card className="border border-border/50 bg-card/60 backdrop-blur-sm">
      <CardHeader className="p-5 pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-emerald-400" />
              <CardTitle className="text-base font-semibold text-foreground">
                Registered Applications
              </CardTitle>
              <Badge variant="secondary" className="font-mono text-xs">
                {applications.length}
              </Badge>
            </div>
            <CardDescription className="text-xs text-muted-foreground mt-1">
              Select an application to inspect its API keys, webhooks, and request telemetry.
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Filter applications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-8 pl-8 pr-3 text-xs rounded-md border border-border bg-surface text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-emerald-500 w-48"
              />
            </div>
            {onCreateAppClick && (
              <Button size="sm" onClick={onCreateAppClick} className="gap-1.5 h-8 bg-emerald-600 hover:bg-emerald-700 text-white text-xs">
                <Plus className="w-3.5 h-3.5" />
                <span>Add App</span>
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-5 pt-2">
        {isLoading ? (
          <div className="py-8 text-center text-sm text-muted-foreground animate-pulse">
            Loading developer applications...
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-8 text-center text-sm text-muted-foreground">
            No developer applications match your search.
          </div>
        ) : (
          <div className="divide-y divide-border/40">
            {filtered.map((app) => {
              const isSelected = app.id === selectedAppId;
              const statusVariant =
                app.status === "PRODUCTION"
                  ? "border-emerald-500/30 text-emerald-400 bg-emerald-500/10"
                  : app.status === "STAGING"
                  ? "border-amber-500/30 text-amber-400 bg-amber-500/10"
                  : "border-sky-500/30 text-sky-400 bg-sky-500/10";

              return (
                <div
                  key={app.id}
                  onClick={() => onSelectApp?.(app.id)}
                  className={`py-3.5 px-3 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer transition-colors ${
                    isSelected
                      ? "bg-surface-elevated border border-border/80 shadow-2xs"
                      : "hover:bg-surface-subtle/50"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-surface border border-border text-foreground shrink-0 mt-0.5">
                      <Terminal className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-foreground">
                          {app.name}
                        </span>
                        <Badge variant="outline" className={`text-[10px] uppercase font-mono px-1.5 py-0 ${statusVariant}`}>
                          {app.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                        {app.description || "No description provided."}
                      </p>
                      <div className="flex items-center gap-3 mt-1.5 text-[11px] text-muted-foreground font-mono">
                        <span className="flex items-center gap-1">
                          ID: {app.id.substring(0, 8)}...
                          <button
                            type="button"
                            onClick={(e) => handleCopy(app.id, e)}
                            className="hover:text-foreground p-0.5 rounded cursor-pointer"
                            title="Copy application ID"
                          >
                            {copiedId === app.id ? (
                              <Check className="w-3 h-3 text-emerald-400" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </span>
                        <span>•</span>
                        <span>Keys: {app.apiKeys?.length ?? 1}</span>
                        <span>•</span>
                        <span>Webhooks: {app.webhooks?.length ?? 1}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    {onGenerateKeyClick && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          onGenerateKeyClick(app.id);
                        }}
                        className="h-7 text-xs gap-1 text-muted-foreground hover:text-foreground"
                      >
                        <Key className="w-3.5 h-3.5" />
                        <span>Key</span>
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant={isSelected ? "default" : "outline"}
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectApp?.(app.id);
                      }}
                      className="h-7 text-xs"
                    >
                      {isSelected ? "Selected" : "Manage"}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
