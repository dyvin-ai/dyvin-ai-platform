import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AlertCircle,
  CheckCircle2,
  Search,
  Filter,
  ArrowUpRight,
  Zap,
  HelpCircle,
  FileSearch,
} from "lucide-react";
import type { BusinessOpportunityItem, RootCauseAnalysisItem } from "@/types";

interface OpportunityRootCausePanelProps {
  opportunities: BusinessOpportunityItem[];
  rootCauses: RootCauseAnalysisItem[];
  isLoading?: boolean;
}

export function OpportunityRootCausePanel({
  opportunities,
  rootCauses,
  isLoading,
}: OpportunityRootCausePanelProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [urgencyFilter, setUrgencyFilter] = useState<string>("ALL");

  if (isLoading) {
    return (
      <Card className="border border-border/60 bg-surface-elevated/40">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="h-6 w-48 bg-muted rounded animate-pulse" />
            <div className="h-20 w-full bg-muted/60 rounded animate-pulse" />
            <div className="h-20 w-full bg-muted/60 rounded animate-pulse" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const filteredOpportunities = opportunities.filter((opp) => {
    const matchesSearch =
      opp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.urgency.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesUrgency = urgencyFilter === "ALL" || opp.urgency.toUpperCase() === urgencyFilter;
    return matchesSearch && matchesUrgency;
  });

  const getUrgencyBadge = (urgency: string) => {
    switch (urgency.toUpperCase()) {
      case "HIGH":
        return <Badge className="bg-red-500/10 text-red-400 border border-red-500/20 text-xs">HIGH URGENCY</Badge>;
      case "MEDIUM":
        return <Badge className="bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs">MEDIUM</Badge>;
      case "LOW":
      default:
        return <Badge className="bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs">LOW</Badge>;
    }
  };

  return (
    <Card className="border border-border/60 bg-surface-elevated/40 backdrop-blur-sm">
      <CardHeader className="pb-4 border-b border-border/40">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" />
              Detected Business Opportunities & Root Cause Diagnostic
            </CardTitle>
            <CardDescription className="text-xs">
              Automated anomaly detection identifies GEO visibility drops, model shifts, and competitor gains with ML root-cause analysis.
            </CardDescription>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative w-48 sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="Search opportunities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 h-8 text-xs bg-surface/50 border-border/60"
              />
            </div>
            <div className="flex items-center gap-1 border border-border/60 rounded-md p-0.5 bg-surface/40 text-xs">
              {["ALL", "HIGH", "MEDIUM"].map((urgency) => (
                <button
                  key={urgency}
                  onClick={() => setUrgencyFilter(urgency)}
                  className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                    urgencyFilter === urgency
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {urgency}
                </button>
              ))}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 space-y-4">
        {filteredOpportunities.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <AlertCircle className="w-8 h-8 mx-auto mb-2 text-muted-foreground/60" />
            <p className="text-sm font-medium">No opportunities matching criteria</p>
            <p className="text-xs text-muted-foreground mt-1">
              All citation channels and AI search visibility scores are currently optimal.
            </p>
          </div>
        ) : (
          filteredOpportunities.map((opp) => {
            // Find root cause for this opportunity (or match index)
            const matchedRootCause =
              rootCauses.find((rc) => rc.opportunityId === opp.id) || rootCauses[0];

            return (
              <div
                key={opp.id}
                className="p-4 rounded-xl border border-border/70 bg-surface/60 hover:border-border transition-all duration-150 space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-start sm:items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 shrink-0">
                      <Zap className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-foreground leading-tight">
                        {opp.title}
                      </h4>
                      <div className="flex items-center gap-2 text-[11px] text-muted-foreground mt-1">
                        <span>Organization: {opp.organizationId}</span>
                        <span>•</span>
                        <span>
                          Detected: {opp.detectedAt ? new Date(opp.detectedAt).toLocaleDateString() : "Active"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 self-end sm:self-auto">
                    <div className="text-right">
                      <div className="text-xs font-semibold text-foreground">
                        Impact Score: <span className="text-amber-400">{opp.impactScore.toFixed(1)}/100</span>
                      </div>
                      <div className="w-24 bg-surface-elevated h-1.5 rounded-full overflow-hidden mt-1 border border-border/40">
                        <div
                          className="bg-amber-400 h-full rounded-full"
                          style={{ width: `${Math.min(100, opp.impactScore)}%` }}
                        />
                      </div>
                    </div>
                    {getUrgencyBadge(opp.urgency)}
                  </div>
                </div>

                {/* Root Cause Diagnostics Block */}
                {matchedRootCause && (
                  <div className="p-3 rounded-lg border border-border/50 bg-surface-elevated/40 flex items-start gap-2.5 text-xs">
                    <FileSearch className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-foreground/90">
                          ML Root Cause Analysis:
                        </span>
                        <Badge variant="outline" className="text-[10px] text-blue-400 border-blue-500/30 bg-blue-500/5">
                          {matchedRootCause.confidencePct.toFixed(1)}% Confidence
                        </Badge>
                      </div>
                      <p className="text-muted-foreground mt-0.5 leading-relaxed">
                        {matchedRootCause.primaryCause}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
