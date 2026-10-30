import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AppWindow,
  Search,
  Plus,
  ExternalLink,
  ShieldCheck,
  Zap,
  BarChart3,
  Bot,
  Layers,
  CheckCircle2,
  Clock,
} from "lucide-react";
import type { PlatformAppItem } from "@/types";

interface CustomAppDirectoryCardProps {
  apps: PlatformAppItem[];
  isLoading?: boolean;
  onCreateAppClick: () => void;
}

export function CustomAppDirectoryCard({
  apps,
  isLoading = false,
  onCreateAppClick,
}: CustomAppDirectoryCardProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("ALL");

  const appTypes = [
    "ALL",
    "ANALYTICS_DASHBOARD",
    "MARKET_INTELLIGENCE",
    "LOW_CODE_AI_APP",
    "WORKFLOW_AUTOMATION",
    "SECURITY_GUARDRAIL",
  ];

  const filteredApps = useMemo(() => {
    return apps.filter((app) => {
      const matchesSearch = app.appName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = selectedType === "ALL" || app.appType === selectedType;
      return matchesSearch && matchesType;
    });
  }, [apps, searchQuery, selectedType]);

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "ANALYTICS_DASHBOARD":
        return (
          <Badge variant="outline" className="border-cyan-500/40 text-cyan-400 bg-cyan-500/10 gap-1 text-xs">
            <BarChart3 className="w-3 h-3" />
            Analytics Dashboard
          </Badge>
        );
      case "MARKET_INTELLIGENCE":
        return (
          <Badge variant="outline" className="border-indigo-500/40 text-indigo-400 bg-indigo-500/10 gap-1 text-xs">
            <Bot className="w-3 h-3" />
            Market Intelligence
          </Badge>
        );
      case "LOW_CODE_AI_APP":
        return (
          <Badge variant="outline" className="border-purple-500/40 text-purple-400 bg-purple-500/10 gap-1 text-xs">
            <Zap className="w-3 h-3" />
            Low-Code AI App
          </Badge>
        );
      case "WORKFLOW_AUTOMATION":
        return (
          <Badge variant="outline" className="border-amber-500/40 text-amber-400 bg-amber-500/10 gap-1 text-xs">
            <Layers className="w-3 h-3" />
            Workflow Automation
          </Badge>
        );
      case "SECURITY_GUARDRAIL":
        return (
          <Badge variant="outline" className="border-emerald-500/40 text-emerald-400 bg-emerald-500/10 gap-1 text-xs">
            <ShieldCheck className="w-3 h-3" />
            Security Guardrail
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-xs">
            {type}
          </Badge>
        );
    }
  };

  return (
    <Card className="border border-border/60 bg-card/60 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <AppWindow className="w-5 h-5 text-indigo-400" />
              Custom Enterprise Applications Directory
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground mt-1">
              Registered low-code AI micro-apps and sovereign workflows built within your tenant boundary.
            </CardDescription>
          </div>
          <Button onClick={onCreateAppClick} size="sm" className="gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white shrink-0">
            <Plus className="w-4 h-4" />
            <span>Create New App</span>
          </Button>
        </div>

        {/* Filters and search */}
        <div className="flex flex-col sm:flex-row gap-3 pt-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search applications by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-background/50 border-border/70 text-sm"
            />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {appTypes.map((type) => (
              <Button
                key={type}
                variant={selectedType === type ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedType(type)}
                className={`text-xs px-2.5 py-1 h-8 ${
                  selectedType === type ? "bg-indigo-600 text-white" : "border-border/60 text-muted-foreground"
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
            Loading enterprise applications...
          </div>
        ) : filteredApps.length === 0 ? (
          <div className="py-12 text-center border border-dashed border-border/60 rounded-xl">
            <AppWindow className="w-10 h-10 mx-auto text-muted-foreground mb-2" />
            <p className="text-base font-medium text-foreground">No applications found</p>
            <p className="text-sm text-muted-foreground mt-1">
              {searchQuery ? "Try refining your search query." : "Build your first custom AI micro-app now."}
            </p>
            <Button onClick={onCreateAppClick} size="sm" className="mt-4 gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white">
              <Plus className="w-4 h-4" />
              <span>Create Application</span>
            </Button>
          </div>
        ) : (
          <div className="divide-y divide-border/40">
            {filteredApps.map((app) => (
              <div
                key={app.id}
                className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-accent/20 px-3 rounded-lg transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-foreground text-sm">{app.appName}</span>
                    {getTypeBadge(app.appType)}
                    {app.isPublished ? (
                      <Badge variant="outline" className="border-emerald-500/40 text-emerald-400 bg-emerald-500/10 text-xs gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Live
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="border-amber-500/40 text-amber-400 bg-amber-500/10 text-xs gap-1">
                        <Clock className="w-3 h-3" />
                        Draft
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>App ID: {app.id.slice(0, 12)}...</span>
                    <span>Created: {new Date(app.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 gap-1 border-border/70 hover:bg-indigo-500/10 hover:border-indigo-500/40 hover:text-indigo-400 text-xs"
                    onClick={() => {
                      alert(`Launching ${app.appName} in sovereign sandbox microVM...`);
                    }}
                  >
                    <span>Launch</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
