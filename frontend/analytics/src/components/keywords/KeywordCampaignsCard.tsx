import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Zap, Play, CheckCircle2, Clock, Activity, Plus, ShieldCheck } from "lucide-react";
import type { KeywordCampaignItem } from "@/types";

interface KeywordCampaignsCardProps {
  campaigns: KeywordCampaignItem[];
  isLoading?: boolean;
  onRunCampaign?: (campaignId: string) => Promise<void>;
  onCreateCampaignClick?: () => void;
}

export function KeywordCampaignsCard({
  campaigns,
  isLoading = false,
  onRunCampaign,
  onCreateCampaignClick,
}: KeywordCampaignsCardProps) {
  const [runningId, setRunningId] = useState<string | null>(null);

  const handleRun = async (id: string) => {
    if (!onRunCampaign) return;
    setRunningId(id);
    try {
      await onRunCampaign(id);
    } finally {
      setRunningId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "RUNNING":
        return <Badge variant="outline" className="border-cyan-500/40 text-cyan-400 bg-cyan-500/10 animate-pulse">Running</Badge>;
      case "COMPLETED":
        return <Badge variant="outline" className="border-emerald-500/40 text-emerald-400 bg-emerald-500/10">Completed</Badge>;
      case "SCHEDULED":
        return <Badge variant="outline" className="border-amber-500/40 text-amber-400 bg-amber-500/10">Scheduled</Badge>;
      default:
        return <Badge variant="outline" className="border-muted-foreground/40 text-muted-foreground">{status}</Badge>;
    }
  };

  return (
    <Card className="border border-border/50 bg-card/60 backdrop-blur-sm">
      <CardHeader className="p-6 pb-4 border-b border-border/40">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Zap className="w-5 h-5 text-cyan-400" />
              Automated Keyword Monitoring Campaigns
            </CardTitle>
            <CardDescription className="text-sm mt-0.5">
              Scheduled citation audits tracking answer engine mentions, brand positioning, and visibility scores.
            </CardDescription>
          </div>

          {onCreateCampaignClick && (
            <Button
              size="sm"
              onClick={onCreateCampaignClick}
              className="gap-2 bg-cyan-600 hover:bg-cyan-500 text-white text-xs self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              New Campaign
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-6">
        {isLoading ? (
          <div className="py-8 text-center text-sm text-muted-foreground animate-pulse">
            Loading monitoring campaigns...
          </div>
        ) : campaigns.length === 0 ? (
          <div className="py-8 text-center">
            <Clock className="w-8 h-8 text-muted-foreground mx-auto mb-2 opacity-50" />
            <p className="text-sm text-muted-foreground">No automated campaigns configured.</p>
            {onCreateCampaignClick && (
              <Button size="sm" variant="outline" onClick={onCreateCampaignClick} className="mt-3 text-xs">
                Create First Campaign
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {campaigns.map((camp) => (
              <div
                key={camp.id}
                className="p-4 rounded-xl border border-border/50 bg-background/40 hover:border-cyan-500/30 transition-all duration-200"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-foreground text-sm">{camp.name}</h4>
                      {getStatusBadge(camp.status)}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                      <span>Frequency: <strong className="text-foreground">{camp.frequency}</strong></span>
                      <span>•</span>
                      <span>Targeting <strong className="text-foreground">{camp.keywordCount}</strong> discovery terms</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRun(camp.id)}
                      disabled={runningId === camp.id}
                      className="gap-1.5 text-xs border-border/60"
                    >
                      <Play className={`w-3.5 h-3.5 text-cyan-400 ${runningId === camp.id ? "animate-spin" : ""}`} />
                      {runningId === camp.id ? "Executing Run..." : "Run Now"}
                    </Button>
                  </div>
                </div>

                {camp.results && camp.results.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-border/30">
                    <div className="text-[11px] font-medium text-muted-foreground mb-1.5">
                      Latest Run Telemetry:
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                      {camp.results.slice(0, 3).map((res, idx) => (
                        <div key={idx} className="p-2 rounded bg-muted/30 border border-border/20 text-xs">
                          <div className="font-medium text-foreground truncate">{res.keywordText}</div>
                          <div className="flex items-center justify-between mt-1 text-[11px]">
                            <span className="text-cyan-400 font-bold">{res.visibilityScore}% Visibility</span>
                            <span className="text-muted-foreground">{res.citationsCount} citations</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
