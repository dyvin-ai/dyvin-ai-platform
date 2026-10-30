import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Milestone,
  CheckCircle2,
  Calendar,
  Search,
  Flag,
  Sparkles,
  ArrowRight,
  Clock,
} from "lucide-react";
import type { CustomerJourneyMilestoneItem } from "@/types";

interface SuccessJourneyMilestonesTimelineProps {
  milestones: CustomerJourneyMilestoneItem[];
  isLoading?: boolean;
}

export function SuccessJourneyMilestonesTimeline({
  milestones,
  isLoading,
}: SuccessJourneyMilestonesTimelineProps) {
  const [searchQuery, setSearchQuery] = useState("");

  if (isLoading) {
    return (
      <Card className="border border-border/60 bg-surface-elevated/40">
        <CardContent className="p-6 space-y-4">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </CardContent>
      </Card>
    );
  }

  const filteredMilestones = milestones.filter((item) =>
    item.milestone.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getMilestoneBadge = (key: string) => {
    if (key.includes("ONBOARD")) {
      return <Badge className="bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs">ONBOARDING</Badge>;
    }
    if (key.includes("CRAWL") || key.includes("DOMAIN")) {
      return <Badge className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs">DISCOVERY</Badge>;
    }
    if (key.includes("CITATION") || key.includes("INDEX")) {
      return <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs">VISIBILITY</Badge>;
    }
    if (key.includes("WORKFORCE")) {
      return <Badge className="bg-purple-500/10 text-purple-400 border border-purple-500/20 text-xs">AUTOMATION</Badge>;
    }
    return <Badge className="bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs">EXECUTIVE</Badge>;
  };

  return (
    <Card className="border border-border/60 bg-surface-elevated/40 shadow-xs">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Milestone className="w-4 h-4 text-cyan-400" />
              Customer Success Journey & Lifecycle Milestones
            </CardTitle>
            <CardDescription className="text-xs mt-0.5">
              Chronological log of key onboarding, integration, and adoption achievements.
            </CardDescription>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search milestone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 text-xs h-8 bg-surface-elevated/80 border-border/60"
            />
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {filteredMilestones.length === 0 ? (
          <div className="py-8 text-center text-xs text-muted-foreground">
            No milestones found matching "{searchQuery}".
          </div>
        ) : (
          <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-[2px] before:bg-border/60">
            {filteredMilestones.map((item, index) => {
              const dateStr = item.achievedAt
                ? new Date(item.achievedAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                : "Recent";

              return (
                <div key={item.id || index} className="relative group">
                  {/* Timeline bullet icon */}
                  <div className="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-background border-2 border-cyan-400 flex items-center justify-center">
                    <CheckCircle2 className="w-3 h-3 text-cyan-400" />
                  </div>

                  <div className="p-3.5 rounded-xl border border-border/60 bg-surface-elevated/60 hover:bg-surface-elevated transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-xs text-foreground font-mono">
                          {item.milestone}
                        </span>
                        {getMilestoneBadge(item.milestone)}
                      </div>

                      <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{dateStr}</span>
                      </div>
                    </div>

                    <div className="mt-2 text-xs text-muted-foreground">
                      Milestone verified on tenant timeline ledger.
                    </div>
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
