import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Code2,
  Terminal,
  Download,
  Copy,
  Check,
  Users,
  Layers,
  Sparkles,
  ExternalLink,
  BookOpen,
} from "lucide-react";
import type { PlatformSDKItem, PlatformDeveloperItem, WorkflowTemplateItem } from "@/types";

interface DeveloperSDKConsoleCardProps {
  sdks: PlatformSDKItem[];
  developers: PlatformDeveloperItem[];
  templates: WorkflowTemplateItem[];
  isLoading?: boolean;
}

export function DeveloperSDKConsoleCard({
  sdks,
  developers,
  templates,
  isLoading = false,
}: DeveloperSDKConsoleCardProps) {
  const [copiedSdk, setCopiedSdk] = useState<string | null>(null);
  const [activeSubTab, setActiveSubTab] = useState<"sdks" | "developers" | "templates">("sdks");

  const getInstallCmd = (language: string) => {
    switch (language.toUpperCase()) {
      case "TYPESCRIPT":
      case "NODE":
        return "pnpm add @dyvin-ai/sdk";
      case "PYTHON":
        return "pip install dyvin-ai-sdk";
      case "GO":
        return "go get github.com/dyvin-ai/sdk-go";
      case "JAVA":
        return "mvn dependency:get -Dartifact=ai.dyvin:sdk:2.4.0";
      default:
        return "curl -sSL https://sdk.dyvin.ai/install.sh | bash";
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSdk(id);
    setTimeout(() => setCopiedSdk(null), 2000);
  };

  return (
    <Card className="border border-border/60 bg-card/60 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <Code2 className="w-5 h-5 text-indigo-400" />
              Developer Console, SDKs & Workflow Blueprints
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground mt-1">
              Programmatic access tools, official client SDKs, registered developer organizations, and templates.
            </CardDescription>
          </div>
          <div className="flex items-center gap-1.5 p-1 bg-background/50 rounded-lg border border-border/60">
            <Button
              size="sm"
              variant={activeSubTab === "sdks" ? "default" : "ghost"}
              onClick={() => setActiveSubTab("sdks")}
              className={`text-xs h-7 gap-1.5 ${activeSubTab === "sdks" ? "bg-indigo-600 text-white" : "text-muted-foreground"}`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Client SDKs</span>
            </Button>
            <Button
              size="sm"
              variant={activeSubTab === "developers" ? "default" : "ghost"}
              onClick={() => setActiveSubTab("developers")}
              className={`text-xs h-7 gap-1.5 ${activeSubTab === "developers" ? "bg-indigo-600 text-white" : "text-muted-foreground"}`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Developers</span>
            </Button>
            <Button
              size="sm"
              variant={activeSubTab === "templates" ? "default" : "ghost"}
              onClick={() => setActiveSubTab("templates")}
              className={`text-xs h-7 gap-1.5 ${activeSubTab === "templates" ? "bg-indigo-600 text-white" : "text-muted-foreground"}`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Templates</span>
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="py-12 text-center text-muted-foreground animate-pulse">
            Loading developer assets...
          </div>
        ) : activeSubTab === "sdks" ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sdks.map((sdk) => {
                const cmd = getInstallCmd(sdk.language);
                const isCopied = copiedSdk === sdk.id;
                return (
                  <Card key={sdk.id} className="border border-border/60 bg-background/40">
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Terminal className="w-4 h-4 text-indigo-400" />
                          <span className="font-bold text-foreground text-sm">{sdk.language} SDK</span>
                        </div>
                        <Badge variant="outline" className="border-indigo-500/40 text-indigo-400 bg-indigo-500/10 text-xs">
                          {sdk.version}
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between bg-black/40 px-3 py-2 rounded-lg border border-border/50 font-mono text-xs text-foreground/90">
                        <span className="truncate mr-2">{cmd}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleCopy(cmd, sdk.id)}
                          className="h-6 w-6 text-muted-foreground hover:text-foreground shrink-0"
                        >
                          {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </Button>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[11px] text-muted-foreground">
                          Generated: {new Date(sdk.generatedAt).toLocaleDateString()}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 text-xs gap-1 border-border/70 hover:bg-indigo-500/10 hover:border-indigo-500/40 text-indigo-400"
                          onClick={() => window.open(sdk.downloadUrl, "_blank")}
                        >
                          <Download className="w-3 h-3" />
                          <span>Download Archive</span>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div className="p-4 rounded-xl border border-indigo-500/20 bg-indigo-950/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <BookOpen className="w-5 h-5 text-indigo-400 shrink-0" />
                <div className="text-xs text-muted-foreground">
                  <span className="font-semibold text-foreground">Dyvin Open Extensibility Protocol & Spec:</span> Read the complete OpenAPI 3.1 & gRPC contracts for autonomous agent plug-in architecture.
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="text-xs gap-1 border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/10 shrink-0"
                onClick={() => window.open("/docs", "_blank")}
              >
                <span>Read Docs</span>
                <ExternalLink className="w-3 h-3" />
              </Button>
            </div>
          </div>
        ) : activeSubTab === "developers" ? (
          <div className="divide-y divide-border/40">
            {developers.map((dev) => (
              <div key={dev.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-foreground text-sm">{dev.developerName}</span>
                      <Badge variant="outline" className="text-[10px] border-border/60">
                        {dev.tier.replace(/_/g, " ")}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{dev.email}</p>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">
                  Member since {new Date(dev.registeredAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {templates.map((tmpl) => (
              <Card key={tmpl.id} className="border border-border/60 bg-background/40">
                <CardContent className="p-4 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Layers className="w-4 h-4 text-purple-400" />
                      <span className="font-bold text-foreground text-sm">{tmpl.templateName}</span>
                    </div>
                    <Badge variant="outline" className="text-[10px] border-purple-500/30 text-purple-400 bg-purple-500/10">
                      {tmpl.category.replace(/_/g, " ")}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Pre-packaged configuration and sovereign microservices blueprint.
                  </p>
                  <div className="pt-2 flex justify-end">
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs h-7 border-border hover:bg-purple-500/10 hover:border-purple-500/40 hover:text-purple-400"
                      onClick={() => alert(`Instantiating template ${tmpl.templateName}...`)}
                    >
                      Use Blueprint
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
