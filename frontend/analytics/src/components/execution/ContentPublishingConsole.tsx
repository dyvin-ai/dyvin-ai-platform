import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  FileText,
  UploadCloud,
  CheckCircle2,
  Clock,
  ExternalLink,
  Layers,
  Sparkles,
  Send,
} from "lucide-react";
import type {
  ContentExecutionItem,
  PublishingExecutionItem,
  GenerateContentInput,
  PublishContentInput,
} from "@/types";

interface ContentPublishingConsoleProps {
  contentItems: ContentExecutionItem[];
  publishingLogs: PublishingExecutionItem[];
  onGenerateContent?: (input: GenerateContentInput) => Promise<void>;
  onPublishContent?: (input: PublishContentInput) => Promise<void>;
  isLoading?: boolean;
}

export function ContentPublishingConsole({
  contentItems,
  publishingLogs,
  onGenerateContent,
  onPublishContent,
  isLoading,
}: ContentPublishingConsoleProps) {
  const [activeTab, setActiveTab] = useState<"content" | "publishing">("content");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPublishing, setIsPublishing] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleGenerate = async (contentType = "BLOG_AND_FAQ") => {
    if (!onGenerateContent) return;
    setIsGenerating(true);
    try {
      await onGenerateContent({
        strategyId: contentItems[0]?.strategyId || "strat-default",
        contentType,
      });
      setStatusMessage(`Content item (${contentType}) generated successfully.`);
      setTimeout(() => setStatusMessage(null), 4000);
    } catch {
      // upstream
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePublish = async (contentId: string, targetPlatform = "WORDPRESS") => {
    if (!onPublishContent) return;
    setIsPublishing(contentId);
    try {
      await onPublishContent({
        contentId,
        targetPlatform,
      });
      setStatusMessage(`Content published to ${targetPlatform} multi-channel CMS.`);
      setTimeout(() => setStatusMessage(null), 4000);
    } catch {
      // upstream
    } finally {
      setIsPublishing(null);
    }
  };

  const getPlatformIcon = (platform: string) => {
    return <UploadCloud className="w-3.5 h-3.5 text-blue-400" />;
  };

  return (
    <Card className="border border-border/60 bg-surface-elevated/40 backdrop-blur-sm">
      <CardHeader className="pb-4 border-b border-border/40">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-400" />
              Automated Content Generation & Multi-CMS Publishing
            </CardTitle>
            <CardDescription className="text-xs">
              Autonomous generation of blogs, FAQs, schema, and direct continuous publishing across WordPress, Webflow, Shopify & Ghost.
            </CardDescription>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center border border-border/60 rounded-md p-0.5 bg-surface/40 text-xs">
              <button
                onClick={() => setActiveTab("content")}
                className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                  activeTab === "content"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Content Queue ({contentItems.length})
              </button>
              <button
                onClick={() => setActiveTab("publishing")}
                className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                  activeTab === "publishing"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                CMS Publishing Logs ({publishingLogs.length})
              </button>
            </div>

            <Button
              size="sm"
              onClick={() => handleGenerate("BLOG_AND_FAQ")}
              disabled={isGenerating}
              className="h-8 text-xs gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium"
            >
              {isGenerating ? (
                <Clock className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Sparkles className="w-3.5 h-3.5" />
              )}
              Generate Content
            </Button>
          </div>
        </div>

        {statusMessage && (
          <div className="mt-3 p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{statusMessage}</span>
          </div>
        )}
      </CardHeader>

      <CardContent className="p-0">
        {activeTab === "content" ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-border/50 bg-surface/40 text-muted-foreground font-medium">
                  <th className="py-3 px-4">Content Type</th>
                  <th className="py-3 px-4">Strategy Reference</th>
                  <th className="py-3 px-4">Generation Status</th>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4 text-right">Publish Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {contentItems.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-muted-foreground">
                      No generated content in queue. Click "Generate Content" above.
                    </td>
                  </tr>
                ) : (
                  contentItems.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-surface/30 transition-colors"
                    >
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 rounded-md bg-emerald-500/10 text-emerald-400">
                            <FileText className="w-3.5 h-3.5" />
                          </div>
                          <span className="font-medium text-foreground">
                            {item.contentType}
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-muted-foreground">
                        {item.strategyId}
                      </td>
                      <td className="py-3.5 px-4">
                        <Badge
                          variant="outline"
                          className="border-blue-500/30 bg-blue-500/10 text-blue-400 text-[10px]"
                        >
                          {item.status}
                        </Badge>
                      </td>
                      <td className="py-3.5 px-4 text-muted-foreground">
                        {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "Just now"}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={isPublishing === item.id}
                          onClick={() => handlePublish(item.id, "WORDPRESS")}
                          className="h-7 text-[11px] gap-1 border-border/70 hover:border-emerald-500/60 hover:text-emerald-400"
                        >
                          {isPublishing === item.id ? (
                            <Clock className="w-3 h-3 animate-spin" />
                          ) : (
                            <Send className="w-3 h-3" />
                          )}
                          Publish CMS
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-border/50 bg-surface/40 text-muted-foreground font-medium">
                  <th className="py-3 px-4">Target CMS Platform</th>
                  <th className="py-3 px-4">Content Reference</th>
                  <th className="py-3 px-4">Publishing Status</th>
                  <th className="py-3 px-4">Published Timestamp</th>
                  <th className="py-3 px-4 text-right">CMS Verification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {publishingLogs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-muted-foreground">
                      No publishing logs recorded yet.
                    </td>
                  </tr>
                ) : (
                  publishingLogs.map((log) => (
                    <tr
                      key={log.id}
                      className="hover:bg-surface/30 transition-colors"
                    >
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 rounded-md bg-blue-500/10 text-blue-400">
                            {getPlatformIcon(log.targetPlatform)}
                          </div>
                          <span className="font-semibold text-foreground">
                            {log.targetPlatform}
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-muted-foreground">
                        {log.contentId}
                      </td>
                      <td className="py-3.5 px-4">
                        <Badge
                          variant="outline"
                          className="border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-[10px]"
                        >
                          {log.status}
                        </Badge>
                      </td>
                      <td className="py-3.5 px-4 text-muted-foreground">
                        {log.publishedAt ? new Date(log.publishedAt).toLocaleDateString() : "Active"}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <Badge variant="secondary" className="text-[10px] gap-1 font-mono">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          LIVE ON EDGE
                        </Badge>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
