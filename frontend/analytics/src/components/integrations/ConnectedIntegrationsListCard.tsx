import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Cable,
  Search,
  Plus,
  RefreshCw,
  PowerOff,
  CheckCircle2,
  XCircle,
  Globe,
  MessageSquare,
  Users,
  Code2,
  Layers,
  Settings,
} from "lucide-react";
import type { IntegrationItem } from "@/types";

interface ConnectedIntegrationsListCardProps {
  integrations: IntegrationItem[];
  isLoading?: boolean;
  onConnectClick: () => void;
  onSyncClick: (integrationId: string) => Promise<void>;
  onDisconnectClick: (integrationId: string) => Promise<void>;
}

export function ConnectedIntegrationsListCard({
  integrations,
  isLoading = false,
  onConnectClick,
  onSyncClick,
  onDisconnectClick,
}: ConnectedIntegrationsListCardProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("ALL");
  const [syncingId, setSyncingId] = useState<string | null>(null);

  const integrationTypes = [
    "ALL",
    "CMS",
    "CRM",
    "COMMUNICATION",
    "DEVELOPER_TOOLS",
    "STORAGE",
    "AUTOMATION",
  ];

  const filteredIntegrations = useMemo(() => {
    return integrations.filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = selectedType === "ALL" || item.type === selectedType;
      return matchesSearch && matchesType;
    });
  }, [integrations, searchQuery, selectedType]);

  const handleSync = async (id: string) => {
    try {
      setSyncingId(id);
      await onSyncClick(id);
    } finally {
      setSyncingId(null);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "CMS":
        return <Globe className="w-4 h-4 text-sky-400" />;
      case "COMMUNICATION":
        return <MessageSquare className="w-4 h-4 text-emerald-400" />;
      case "CRM":
        return <Users className="w-4 h-4 text-amber-400" />;
      case "DEVELOPER_TOOLS":
        return <Code2 className="w-4 h-4 text-purple-400" />;
      default:
        return <Layers className="w-4 h-4 text-primary" />;
    }
  };

  return (
    <Card className="border border-border/60 bg-card/60 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <Cable className="w-5 h-5 text-sky-400" />
              Connected Enterprise Integrations
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground mt-1">
              Active external SaaS pipelines, bidirectional sync endpoints, and notification bridges.
            </CardDescription>
          </div>
          <Button onClick={onConnectClick} size="sm" className="gap-1.5 bg-sky-600 hover:bg-sky-700 text-white shrink-0">
            <Plus className="w-4 h-4" />
            <span>Connect Integration</span>
          </Button>
        </div>

        {/* Filters and search */}
        <div className="flex flex-col sm:flex-row gap-3 pt-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search active integrations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-background/50 border-border/70 text-sm"
            />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {integrationTypes.map((type) => (
              <Button
                key={type}
                variant={selectedType === type ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedType(type)}
                className={`text-xs px-2.5 py-1 h-8 ${
                  selectedType === type ? "bg-sky-600 text-white" : "border-border/60 text-muted-foreground"
                }`}
              >
                {type === "ALL" ? "All Types" : type.replace(/_/g, " ")}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="py-12 text-center text-muted-foreground animate-pulse">
            Loading connected integrations...
          </div>
        ) : filteredIntegrations.length === 0 ? (
          <div className="py-12 text-center border border-dashed border-border/60 rounded-xl">
            <Cable className="w-10 h-10 mx-auto text-muted-foreground mb-2" />
            <p className="text-base font-medium text-foreground">No integrations found</p>
            <p className="text-sm text-muted-foreground mt-1">
              {searchQuery ? "Try refining your search query." : "Connect your first CMS, CRM, or notification provider."}
            </p>
            <Button onClick={onConnectClick} size="sm" className="mt-4 gap-1.5 bg-sky-600 hover:bg-sky-700 text-white">
              <Plus className="w-4 h-4" />
              <span>Connect Provider</span>
            </Button>
          </div>
        ) : (
          <div className="divide-y divide-border/40">
            {filteredIntegrations.map((item) => (
              <div
                key={item.id}
                className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-accent/20 px-3 rounded-lg transition-colors"
              >
                <div className="flex items-start sm:items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-background/60 border border-border/60 mt-1 sm:mt-0">
                    {getTypeIcon(item.type)}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-foreground text-sm">{item.name}</span>
                      <Badge variant="outline" className="text-[10px] uppercase tracking-wider border-border/60">
                        {item.type}
                      </Badge>
                      {item.status === "ACTIVE" ? (
                        <Badge variant="outline" className="border-emerald-500/40 text-emerald-400 bg-emerald-500/10 text-xs gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          Active
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="border-rose-500/40 text-rose-400 bg-rose-500/10 text-xs gap-1">
                          <XCircle className="w-3 h-3" />
                          Disconnected
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                      <span>ID: {item.id.slice(0, 10)}...</span>
                      <span>Connected: {new Date(item.createdAt).toLocaleDateString()}</span>
                      {item.configJson && Object.keys(item.configJson).length > 0 && (
                        <span className="text-muted-foreground/80 font-mono text-[11px]">
                          Config: {JSON.stringify(item.configJson).slice(0, 35)}...
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={syncingId === item.id || item.status !== "ACTIVE"}
                    onClick={() => handleSync(item.id)}
                    className="h-8 text-xs gap-1 border-border hover:bg-sky-500/10 hover:border-sky-500/30 hover:text-sky-400"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${syncingId === item.id ? "animate-spin" : ""}`} />
                    <span>Sync</span>
                  </Button>
                  {item.status === "ACTIVE" && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDisconnectClick(item.id)}
                      className="h-8 text-xs gap-1 text-muted-foreground hover:text-rose-400 hover:bg-rose-500/10"
                    >
                      <PowerOff className="w-3.5 h-3.5" />
                      <span>Disconnect</span>
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
