import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Milestone,
  CheckCircle2,
  Calendar,
  Search,
  Flag,
  Sparkles,
  Layers,
  ArrowRight,
} from "lucide-react";
import type { CustomerTimelineItem } from "@/types";

interface CustomerJourneyTimelinePanelProps {
  timeline: CustomerTimelineItem[];
  isLoading?: boolean;
}

export function CustomerJourneyTimelinePanel({
  timeline,
  isLoading,
}: CustomerJourneyTimelinePanelProps) {
  const [searchQuery, setSearchQuery] = useState("");

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

  const filteredTimeline = timeline.filter((item) => {
    return (
      item.eventKey.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const getEventBadge = (key: string) => {
    switch (key) {
      case "ORGANIZATION_ONBOARDED":
        return <Badge className="bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs">ONBOARDING</Badge>;
      case "FIRST_CRAWL_COMPLETED":
        return <Badge className="bg-purple-500/10 text-purple-400 border border-purple-500/20 text-xs">CRAWL INDEX</Badge>;
      case "FIRST_AI_CITATION_INDEXED":
        return <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs">CITATION MILESTONE</Badge>;
      case "GEO_VISIBILITY_PEAK":
        return <Badge className="bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs">VISIBILITY PEAK</Badge>;
      case "WORKFORCE_ORCHESTRATION_ENROLLED":
        return <Badge className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs">WORKFORCE ACTIVE</Badge>;
      default:
        return <Badge variant="outline" className="text-xs">{key}</Badge>;
    }
  };

  return (
    <Card className="border border-border/60 bg-surface-elevated/40 backdrop-blur-sm">
      <CardHeader className="pb-4 border-b border-border/40">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Milestone className="w-4 h-4 text-emerald-400" />
              Customer Lifecycle Journey Timeline
            </CardTitle>
            <CardDescription className="text-xs">
              Chronological log of customer milestones, from workspace provisioning to autonomous GEO citation breakthroughs.
            </CardDescription>
          </div>

          <div className="relative w-48 sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Search journey milestones..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 h-8 text-xs bg-surface/50 border-border/60"
            />
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        {filteredTimeline.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground text-xs">
            No journey milestones found matching query.
          </div>
        ) : (
          <div className="relative border-l-2 border-border/80 ml-3 sm:ml-4 space-y-6 py-2">
            {filteredTimeline.map((item, idx) => (
              <div key={item.id} className="relative pl-6 sm:pl-8 group">
                {/* Node Marker */}
                <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-surface border-2 border-emerald-500 group-hover:scale-125 transition-transform flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                </div>

                <div className="p-4 rounded-xl border border-border/60 bg-surface/60 hover:border-border transition-all">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-sm font-semibold text-foreground">
                        {item.eventKey.replace(/_/g, " ")}
                      </h4>
                      {getEventBadge(item.eventKey)}
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono">
                      <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                      <span>{item.occurredAt ? new Date(item.occurredAt).toLocaleString() : "Recorded"}</span>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
