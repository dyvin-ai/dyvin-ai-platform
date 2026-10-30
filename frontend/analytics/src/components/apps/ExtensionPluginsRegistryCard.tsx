import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Puzzle,
  Search,
  CheckCircle2,
  XCircle,
  LayoutGrid,
  Chrome,
  MessageSquare,
  Palette,
  Code2,
  ShieldCheck,
} from "lucide-react";
import type { PlatformExtensionItem } from "@/types";

interface ExtensionPluginsRegistryCardProps {
  extensions: PlatformExtensionItem[];
  isLoading?: boolean;
}

export function ExtensionPluginsRegistryCard({
  extensions,
  isLoading = false,
}: ExtensionPluginsRegistryCardProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [enabledState, setEnabledState] = useState<Record<string, boolean>>({});

  const filteredExtensions = useMemo(() => {
    return extensions.filter((ext) =>
      ext.extensionName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ext.extensionType.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [extensions, searchQuery]);

  const toggleEnabled = (id: string, current: boolean) => {
    setEnabledState((prev) => ({
      ...prev,
      [id]: prev[id] !== undefined ? !prev[id] : !current,
    }));
  };

  const getExtensionIcon = (type: string) => {
    switch (type) {
      case "SIDEBAR_WIDGET":
        return <LayoutGrid className="w-4 h-4 text-cyan-400" />;
      case "BROWSER_EXTENSION":
        return <Chrome className="w-4 h-4 text-amber-400" />;
      case "MESSAGING_INTEGRATION":
        return <MessageSquare className="w-4 h-4 text-indigo-400" />;
      case "DESIGN_INTEGRATION":
        return <Palette className="w-4 h-4 text-pink-400" />;
      case "IDE_EXTENSION":
        return <Code2 className="w-4 h-4 text-emerald-400" />;
      default:
        return <Puzzle className="w-4 h-4 text-primary" />;
    }
  };

  return (
    <Card className="border border-border/60 bg-card/60 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <Puzzle className="w-5 h-5 text-cyan-400" />
              Extensions & Plugin Registry
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground mt-1">
              Active browser extensions, IDE tooling, workspace sidebar widgets, and messaging hooks.
            </CardDescription>
          </div>
          <div className="flex items-center gap-2 text-xs bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-3 py-1.5 rounded-lg">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Sandboxed MicroVM Isolation Active</span>
          </div>
        </div>

        <div className="relative pt-2">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Filter extensions by name or type..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-background/50 border-border/70 text-sm"
          />
        </div>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="py-12 text-center text-muted-foreground animate-pulse">
            Loading extensions registry...
          </div>
        ) : filteredExtensions.length === 0 ? (
          <div className="py-12 text-center border border-dashed border-border/60 rounded-xl">
            <Puzzle className="w-10 h-10 mx-auto text-muted-foreground mb-2" />
            <p className="text-base font-medium text-foreground">No extensions found</p>
            <p className="text-sm text-muted-foreground mt-1">Try adjusting your search filter.</p>
          </div>
        ) : (
          <div className="divide-y divide-border/40">
            {filteredExtensions.map((ext) => {
              const isCurrentlyEnabled =
                enabledState[ext.id] !== undefined ? enabledState[ext.id] : ext.isEnabled;
              return (
                <div
                  key={ext.id}
                  className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-accent/20 px-3 rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-background/60 border border-border/60">
                      {getExtensionIcon(ext.extensionType)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-foreground text-sm">{ext.extensionName}</span>
                        <Badge variant="outline" className="text-[10px] uppercase tracking-wider border-border/60">
                          {ext.extensionType.replace(/_/g, " ")}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Installed on {new Date(ext.installedAt).toLocaleDateString()} · Extension ID: {ext.id.slice(0, 10)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Badge
                      variant="outline"
                      className={`text-xs gap-1 ${
                        isCurrentlyEnabled
                          ? "border-emerald-500/40 text-emerald-400 bg-emerald-500/10"
                          : "border-border/60 text-muted-foreground"
                      }`}
                    >
                      {isCurrentlyEnabled ? (
                        <>
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          <span>Enabled</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3 h-3 text-muted-foreground" />
                          <span>Disabled</span>
                        </>
                      )}
                    </Badge>

                    <Button
                      variant={isCurrentlyEnabled ? "outline" : "default"}
                      size="sm"
                      onClick={() => toggleEnabled(ext.id, ext.isEnabled)}
                      className={`h-8 text-xs ${
                        isCurrentlyEnabled
                          ? "border-border hover:bg-rose-500/10 hover:border-rose-500/30 hover:text-rose-400"
                          : "bg-indigo-600 hover:bg-indigo-700 text-white"
                      }`}
                    >
                      {isCurrentlyEnabled ? "Disable" : "Enable"}
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
