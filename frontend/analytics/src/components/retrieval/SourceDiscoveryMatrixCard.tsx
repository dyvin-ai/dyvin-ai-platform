import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Globe,
  Search,
  ExternalLink,
  ShieldCheck,
  Award,
  Link2,
  TrendingUp,
  SlidersHorizontal,
} from "lucide-react";
import type {
  SourceItem,
  SourceLeaderboardItem,
  URLPerformanceItem,
  DomainPerformanceItem,
} from "@/types";

interface SourceDiscoveryMatrixCardProps {
  sources?: SourceItem[];
  leaderboards?: SourceLeaderboardItem[];
  urlPerformances?: URLPerformanceItem[];
  domainPerformances?: DomainPerformanceItem[];
  isLoading?: boolean;
}

export function SourceDiscoveryMatrixCard({
  sources = [],
  leaderboards = [],
  urlPerformances = [],
  domainPerformances = [],
}: SourceDiscoveryMatrixCardProps) {
  const [activeTab, setActiveTab] = useState<"sources" | "leaderboard" | "urls" | "domains">("sources");
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("ALL");

  const filteredSources = useMemo(() => {
    return sources.filter((s) => {
      const matchSearch =
        s.domain.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchType = typeFilter === "ALL" || s.sourceType === typeFilter;
      return matchSearch && matchType;
    });
  }, [sources, searchTerm, typeFilter]);

  const sourceTypes = [
    "ALL",
    "DOCUMENTATION",
    "WIKIPEDIA",
    "ACADEMIC",
    "COMMUNITY",
    "NEWS",
    "THIRD_PARTY",
  ];

  return (
    <Card className="border border-border/50 bg-card/60 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Globe className="h-4 w-4 text-cyan-400" />
              Source Discovery & Provenance Matrix
            </CardTitle>
            <CardDescription className="text-xs">
              Authority rankings, trust scores, and citation share across indexed web domains
            </CardDescription>
          </div>

          <div className="flex items-center gap-1.5 p-1 rounded-lg bg-background/50 border border-border/50">
            <Button
              variant={activeTab === "sources" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("sources")}
              className="text-xs h-7 px-3"
            >
              Sources ({sources.length})
            </Button>
            <Button
              variant={activeTab === "leaderboard" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("leaderboard")}
              className="text-xs h-7 px-3"
            >
              Leaderboard
            </Button>
            <Button
              variant={activeTab === "domains" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("domains")}
              className="text-xs h-7 px-3"
            >
              Domains
            </Button>
            <Button
              variant={activeTab === "urls" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("urls")}
              className="text-xs h-7 px-3"
            >
              Top URLs
            </Button>
          </div>
        </div>

        {activeTab === "sources" && (
          <div className="flex flex-col sm:flex-row items-center gap-2 pt-2">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="Search domain or title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 h-8 text-xs bg-background/50 border-border/60"
              />
            </div>
            <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
              {sourceTypes.map((type) => (
                <Button
                  key={type}
                  variant={typeFilter === type ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTypeFilter(type)}
                  className="text-[11px] h-7 px-2.5 shrink-0"
                >
                  {type === "ALL" ? "All Categories" : type.toLowerCase()}
                </Button>
              ))}
            </div>
          </div>
        )}
      </CardHeader>

      <CardContent>
        {activeTab === "sources" && (
          <div className="rounded-lg border border-border/50 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-muted/40 text-muted-foreground font-medium border-b border-border/50">
                  <tr>
                    <th className="py-2.5 px-3">Domain & Name</th>
                    <th className="py-2.5 px-3">Category</th>
                    <th className="py-2.5 px-3">Authority</th>
                    <th className="py-2.5 px-3">Trust Score</th>
                    <th className="py-2.5 px-3">Citations</th>
                    <th className="py-2.5 px-3">Verification</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {filteredSources.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-muted-foreground">
                        No sources match your filter.
                      </td>
                    </tr>
                  ) : (
                    filteredSources.map((s) => (
                      <tr key={s.id} className="hover:bg-muted/20 transition-colors">
                        <td className="py-2.5 px-3">
                          <div className="font-semibold text-foreground flex items-center gap-1.5">
                            {s.name}
                          </div>
                          <div className="text-[11px] text-muted-foreground flex items-center gap-1">
                            <span>{s.domain}</span>
                          </div>
                        </td>
                        <td className="py-2.5 px-3">
                          <Badge variant="outline" className="text-[10px] font-mono border-primary/20 text-primary">
                            {s.sourceType}
                          </Badge>
                        </td>
                        <td className="py-2.5 px-3">
                          <div className="flex items-center gap-1.5 font-medium">
                            <span className="text-blue-400 font-mono">{s.authorityScore}</span>
                            <div className="w-16 bg-muted rounded-full h-1.5 overflow-hidden">
                              <div
                                className="bg-blue-400 h-1.5 rounded-full"
                                style={{ width: `${s.authorityScore}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="py-2.5 px-3">
                          <div className="flex items-center gap-1.5 font-medium">
                            <span className="text-emerald-400 font-mono">{s.trustScore}</span>
                            <div className="w-16 bg-muted rounded-full h-1.5 overflow-hidden">
                              <div
                                className="bg-emerald-400 h-1.5 rounded-full"
                                style={{ width: `${s.trustScore}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="py-2.5 px-3 font-mono font-semibold text-foreground">
                          {s.citationCount.toLocaleString()}
                        </td>
                        <td className="py-2.5 px-3">
                          {s.isVerified ? (
                            <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 bg-emerald-500/10 text-[10px] gap-1">
                              <ShieldCheck className="h-3 w-3" /> Verified
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-[10px]">
                              Pending
                            </Badge>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "leaderboard" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {leaderboards.map((item, idx) => (
              <div
                key={item.id || idx}
                className="flex items-center justify-between p-3 rounded-lg border border-border/50 bg-background/40 hover:border-border transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-xs ${
                      item.rankPosition === 1
                        ? "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                        : item.rankPosition === 2
                        ? "bg-slate-300/20 text-slate-300 border border-slate-400/40"
                        : item.rankPosition === 3
                        ? "bg-amber-700/20 text-amber-600 border border-amber-700/40"
                        : "bg-muted/40 text-muted-foreground"
                    }`}
                  >
                    #{item.rankPosition}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-foreground">
                      {item.domain || `Source #${item.sourceId}`}
                    </div>
                    <div className="text-[11px] text-muted-foreground">
                      Indexed authority index
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-base font-bold text-primary font-mono">
                    {item.score.toFixed(1)}
                  </div>
                  <div className="text-[10px] text-muted-foreground">Score</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "domains" && (
          <div className="rounded-lg border border-border/50 overflow-hidden">
            <table className="w-full text-xs text-left">
              <thead className="bg-muted/40 text-muted-foreground font-medium border-b border-border/50">
                <tr>
                  <th className="py-2.5 px-3">Apex Domain</th>
                  <th className="py-2.5 px-3">Indexed URLs</th>
                  <th className="py-2.5 px-3">Total Citations</th>
                  <th className="py-2.5 px-3">Visibility Share</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {domainPerformances.map((d, idx) => (
                  <tr key={d.id || idx} className="hover:bg-muted/20">
                    <td className="py-2.5 px-3 font-semibold text-foreground">
                      {d.domain}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-muted-foreground">
                      {d.totalUrls} URLs
                    </td>
                    <td className="py-2.5 px-3 font-mono font-semibold text-primary">
                      {d.totalCitations.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3">
                      <Badge variant="outline" className="border-cyan-500/30 text-cyan-400 bg-cyan-500/10 text-[10px]">
                        High Authority
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "urls" && (
          <div className="rounded-lg border border-border/50 overflow-hidden">
            <table className="w-full text-xs text-left">
              <thead className="bg-muted/40 text-muted-foreground font-medium border-b border-border/50">
                <tr>
                  <th className="py-2.5 px-3">Canonical URL</th>
                  <th className="py-2.5 px-3">Citations</th>
                  <th className="py-2.5 px-3">Retrievals</th>
                  <th className="py-2.5 px-3">Visibility Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {urlPerformances.map((u, idx) => (
                  <tr key={u.id || idx} className="hover:bg-muted/20">
                    <td className="py-2.5 px-3 max-w-sm truncate">
                      <a
                        href={u.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-foreground hover:text-primary flex items-center gap-1 font-mono text-[11px] truncate"
                      >
                        <span className="truncate">{u.url}</span>
                        <ExternalLink className="h-2.5 w-2.5 shrink-0 text-muted-foreground" />
                      </a>
                    </td>
                    <td className="py-2.5 px-3 font-mono font-semibold text-foreground">
                      {u.citationCount}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-muted-foreground">
                      {u.retrievalCount}
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-1.5 font-medium">
                        <span className="text-emerald-400 font-mono">{u.visibilityScore.toFixed(1)}%</span>
                        <div className="w-16 bg-muted rounded-full h-1.5 overflow-hidden">
                          <div
                            className="bg-emerald-400 h-1.5 rounded-full"
                            style={{ width: `${u.visibilityScore}%` }}
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
