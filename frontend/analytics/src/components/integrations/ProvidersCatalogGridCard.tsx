import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Globe,
  Search,
  Plus,
  CheckCircle2,
  Layers,
  MessageSquare,
  Users,
  Code2,
  HardDrive,
  Workflow,
  Sparkles,
} from "lucide-react";
import type { IntegrationProviderItem, IntegrationItem } from "@/types";

interface ProvidersCatalogGridCardProps {
  providers: IntegrationProviderItem[];
  activeIntegrations?: IntegrationItem[];
  isLoading?: boolean;
  onSelectProvider: (provider: IntegrationProviderItem) => void;
}

export function ProvidersCatalogGridCard({
  providers,
  activeIntegrations = [],
  isLoading = false,
  onSelectProvider,
}: ProvidersCatalogGridCardProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");

  const categories = [
    "ALL",
    "CMS",
    "CRM",
    "COMMUNICATION",
    "DEVELOPER_TOOLS",
    "STORAGE",
    "AUTOMATION",
  ];

  const connectedProviderCodes = useMemo(() => {
    const set = new Set<string>();
    for (const item of activeIntegrations) {
      if (item.connections) {
        for (const conn of item.connections) {
          if (conn.provider?.code) set.add(conn.provider.code);
        }
      }
    }
    return set;
  }, [activeIntegrations]);

  const filteredProviders = useMemo(() => {
    return providers.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.code.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "ALL" || p.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [providers, searchQuery, selectedCategory]);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "CMS":
        return <Globe className="w-4 h-4 text-sky-400" />;
      case "CRM":
        return <Users className="w-4 h-4 text-amber-400" />;
      case "COMMUNICATION":
        return <MessageSquare className="w-4 h-4 text-emerald-400" />;
      case "DEVELOPER_TOOLS":
        return <Code2 className="w-4 h-4 text-purple-400" />;
      case "STORAGE":
        return <HardDrive className="w-4 h-4 text-indigo-400" />;
      case "AUTOMATION":
        return <Workflow className="w-4 h-4 text-pink-400" />;
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
              <Globe className="w-5 h-5 text-sky-400" />
              Supported Enterprise Adapters & Integrations Catalog
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground mt-1">
              Plug-and-play connectors with automated schema mapping, OAuth2 credential rotation, and rate-limit circuit breakers.
            </CardDescription>
          </div>
          <Badge variant="outline" className="border-sky-500/40 text-sky-400 bg-sky-500/10 text-xs w-fit">
            {providers.length} Production Adapters
          </Badge>
        </div>

        {/* Filter and Search */}
        <div className="flex flex-col sm:flex-row gap-3 pt-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search providers (e.g. WordPress, Slack, HubSpot)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-background/50 border-border/70 text-sm"
            />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {categories.map((cat) => (
              <Button
                key={cat}
                variant={selectedCategory === cat ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(cat)}
                className={`text-xs px-2.5 py-1 h-8 ${
                  selectedCategory === cat ? "bg-sky-600 text-white" : "border-border/60 text-muted-foreground"
                }`}
              >
                {cat === "ALL" ? "All Categories" : cat.replace(/_/g, " ")}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="py-12 text-center text-muted-foreground animate-pulse">
            Loading provider catalog...
          </div>
        ) : filteredProviders.length === 0 ? (
          <div className="py-12 text-center border border-dashed border-border/60 rounded-xl">
            <Globe className="w-10 h-10 mx-auto text-muted-foreground mb-2" />
            <p className="text-base font-medium text-foreground">No providers match your criteria</p>
            <p className="text-sm text-muted-foreground mt-1">Try searching for a different keyword or category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProviders.map((provider) => {
              const isConnected = connectedProviderCodes.has(provider.code);
              return (
                <Card
                  key={provider.code}
                  className="border border-border/50 bg-background/40 hover:border-sky-500/40 hover:bg-card/70 transition-all flex flex-col justify-between"
                >
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-lg bg-background/80 border border-border/60">
                          {getCategoryIcon(provider.category)}
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground text-sm">{provider.name}</h4>
                          <span className="text-[11px] text-muted-foreground font-mono">{provider.code}</span>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-[10px] uppercase border-border/60">
                        {provider.category.replace(/_/g, " ")}
                      </Badge>
                    </div>

                    <p className="text-xs text-muted-foreground">
                      Enterprise connector with OAuth2 and API key authentication.
                    </p>

                    <div className="pt-2 flex items-center justify-between border-t border-border/40">
                      {isConnected ? (
                        <div className="flex items-center gap-1.5 text-xs text-emerald-400">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Connected</span>
                        </div>
                      ) : (
                        <span className="text-[11px] text-muted-foreground">Ready to link</span>
                      )}

                      <Button
                        size="sm"
                        variant={isConnected ? "outline" : "default"}
                        onClick={() => onSelectProvider(provider)}
                        className={`text-xs h-7 gap-1 ${
                          isConnected
                            ? "border-border text-foreground hover:bg-sky-500/10 hover:border-sky-500/30"
                            : "bg-sky-600 hover:bg-sky-700 text-white"
                        }`}
                      >
                        <Plus className="w-3 h-3" />
                        <span>{isConnected ? "Add Another" : "Connect"}</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
