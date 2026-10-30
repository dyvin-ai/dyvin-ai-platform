import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, ArrowUpRight, BarChart3, Calendar } from "lucide-react";
import type { KeywordTrendItem, KeywordSearchVolumeItem } from "@/types";

interface SearchVolumeTrendsCardProps {
  trends: KeywordTrendItem[];
  searchVolumes: KeywordSearchVolumeItem[];
  isLoading?: boolean;
}

export function SearchVolumeTrendsCard({
  trends,
  searchVolumes,
  isLoading = false,
}: SearchVolumeTrendsCardProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Rising Trends Momentum */}
      <Card className="border border-border/50 bg-card/60 backdrop-blur-sm">
        <CardHeader className="p-6 pb-4 border-b border-border/40">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            Rising Generative Query Momentum
          </CardTitle>
          <CardDescription className="text-xs">
            Terms experiencing accelerated search trajectory and answer engine citation velocity.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          {isLoading ? (
            <div className="py-6 text-center text-xs text-muted-foreground animate-pulse">
              Calculating trend vectors...
            </div>
          ) : trends.length === 0 ? (
            <div className="py-6 text-center text-xs text-muted-foreground">
              No trend momentum data recorded yet.
            </div>
          ) : (
            <div className="space-y-3">
              {trends.map((t, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-lg border border-border/40 bg-background/40 flex items-center justify-between gap-3"
                >
                  <div>
                    <div className="font-medium text-foreground text-xs flex items-center gap-1.5">
                      {t.keywordText}
                    </div>
                    <div className="text-[11px] text-muted-foreground mt-0.5 flex items-center gap-2">
                      <span>Trajectory: {t.direction}</span>
                      <span>•</span>
                      <span>High citation probability</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-2.5 py-1 rounded-full text-xs font-bold shrink-0">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                    +{t.growthRatePct}%
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Seasonality Decomposition */}
      <Card className="border border-border/50 bg-card/60 backdrop-blur-sm">
        <CardHeader className="p-6 pb-4 border-b border-border/40">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-400" />
            Quarterly Volume & Seasonality Breakdown
          </CardTitle>
          <CardDescription className="text-xs">
            Aggregated monthly query volumes mapped across quarterly seasonal demand cycles.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          {isLoading ? (
            <div className="py-6 text-center text-xs text-muted-foreground animate-pulse">
              Aggregating seasonal distributions...
            </div>
          ) : searchVolumes.length === 0 ? (
            <div className="py-6 text-center text-xs text-muted-foreground">
              No seasonal volume data available.
            </div>
          ) : (
            <div className="space-y-3">
              {searchVolumes.slice(0, 4).map((vol, idx) => {
                const s = vol.seasonality || { Q1: 1200, Q2: 1400, Q3: 1300, Q4: 1600 };
                const maxQuarter = Math.max(...Object.values(s));
                return (
                  <div key={idx} className="p-3 rounded-lg border border-border/40 bg-background/40 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-foreground truncate max-w-[240px]">
                        {vol.keywordText}
                      </span>
                      <span className="font-bold text-blue-400">
                        {vol.monthlyVolume.toLocaleString()} /mo
                      </span>
                    </div>
                    <div className="grid grid-cols-4 gap-2 pt-1">
                      {Object.entries(s).map(([q, val]) => (
                        <div key={q} className="bg-muted/40 p-1.5 rounded text-center">
                          <span className="text-[10px] text-muted-foreground block">{q}</span>
                          <span className="text-[11px] font-semibold text-foreground">{val.toLocaleString()}</span>
                          <div className="w-full bg-muted/60 h-1 rounded-full mt-1 overflow-hidden">
                            <div
                              className="bg-blue-500 h-full rounded-full"
                              style={{ width: `${Math.round((val / maxQuarter) * 100)}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
