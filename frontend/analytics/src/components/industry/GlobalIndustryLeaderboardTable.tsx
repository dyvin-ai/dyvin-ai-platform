import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Trophy,
  Medal,
  Crown,
  Search,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  Flame,
} from "lucide-react";
import type { IndustryLeaderboardResponse, IndustryLeaderboardItem } from "@/types";

interface GlobalIndustryLeaderboardTableProps {
  leaderboard?: IndustryLeaderboardResponse | null;
  selectedCategory: string;
  onCategoryChange: (cat: string) => void;
  isLoading?: boolean;
}

const CATEGORIES = [
  { id: "B2B_SAAS", label: "B2B SaaS" },
  { id: "ENTERPRISE_AI", label: "Enterprise AI" },
  { id: "FINANCIAL_SERVICES", label: "Financial Services" },
  { id: "HEALTHCARE_TECH", label: "Healthcare Tech" },
];

export function GlobalIndustryLeaderboardTable({
  leaderboard,
  selectedCategory,
  onCategoryChange,
  isLoading,
}: GlobalIndustryLeaderboardTableProps) {
  const [filterText, setFilterText] = useState("");

  if (isLoading) {
    return (
      <Card className="border border-border/60 bg-surface-elevated/40">
        <CardContent className="p-6 space-y-4">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-10 w-full" />
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const rankings = leaderboard?.rankings || [];
  const filtered = rankings.filter((r) =>
    r.domain.toLowerCase().includes(filterText.toLowerCase())
  );

  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return (
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold">
            <Crown className="w-3.5 h-3.5 text-amber-400" />
            #1
          </div>
        );
      case 2:
        return (
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-300/20 text-slate-200 border border-slate-300/30 text-xs font-bold">
            <Medal className="w-3.5 h-3.5 text-slate-300" />
            #2
          </div>
        );
      case 3:
        return (
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-700/20 text-amber-600 border border-amber-700/30 text-xs font-bold">
            <Medal className="w-3.5 h-3.5 text-amber-600" />
            #3
          </div>
        );
      default:
        return (
          <div className="px-2 py-0.5 rounded-full bg-surface-elevated text-muted-foreground border border-border/40 text-xs font-semibold">
            #{rank}
          </div>
        );
    }
  };

  const getTierBadge = (badge: string) => {
    switch (badge.toUpperCase()) {
      case "GLOBAL_LEADER":
        return (
          <Badge className="bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-semibold">
            <Flame className="w-3 h-3 mr-1" />
            GLOBAL LEADER
          </Badge>
        );
      case "TOP_TIER":
        return (
          <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold">
            <ShieldCheck className="w-3 h-3 mr-1" />
            TOP TIER
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="border-border/60 text-muted-foreground text-xs font-semibold">
            <TrendingUp className="w-3 h-3 mr-1" />
            {badge}
          </Badge>
        );
    }
  };

  return (
    <Card className="border border-border/60 bg-surface-elevated/40">
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            <div>
              <CardTitle className="text-base font-semibold">
                Global Opt-In Industry Leaderboards
              </CardTitle>
              <CardDescription className="text-xs">
                Verified domain rankings by composite AI search visibility, citation weight, and cross-model consensus.
              </CardDescription>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-1.5">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => onCategoryChange(cat.id)}
                className={`px-2.5 py-1 text-xs rounded-md font-medium transition-all ${
                  selectedCategory === cat.id
                    ? "bg-amber-500 text-slate-950 font-semibold shadow-sm"
                    : "bg-surface-elevated text-muted-foreground hover:bg-surface-elevated/80 border border-border/40"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Filter Input */}
        <div className="mt-3 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            placeholder="Filter domains in leaderboard..."
            className="pl-9 bg-background/50 border-border/60 text-xs h-9"
          />
        </div>
      </CardHeader>

      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-border/60 text-muted-foreground text-xs uppercase tracking-wider">
                <th className="py-2.5 px-3 w-16">Rank</th>
                <th className="py-2.5 px-3">Verified Domain</th>
                <th className="py-2.5 px-3 w-36 text-right">Visibility Score</th>
                <th className="py-2.5 px-3 w-36 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-xs text-muted-foreground">
                    No leaderboard domains found matching "{filterText}".
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr
                    key={item.domain}
                    className="hover:bg-surface-elevated/80 transition-colors group"
                  >
                    <td className="py-3 px-3">
                      {getRankBadge(item.rank)}
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-foreground">{item.domain}</span>
                        <ExternalLink className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="font-mono font-bold text-foreground text-sm">
                        {item.score.toFixed(1)} / 100
                      </div>
                    </td>
                    <td className="py-3 px-3 text-center">
                      {getTierBadge(item.badge)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
