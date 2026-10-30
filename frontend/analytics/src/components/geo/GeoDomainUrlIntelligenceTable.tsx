import React, { useState, useMemo } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Globe,
  Link2,
  Search,
  ExternalLink,
  ShieldCheck,
  FileText,
  Calendar,
  Layers,
} from "lucide-react";
import type { GeoDomainAnalyticsItem, GeoUrlAnalyticsItem } from "@/types";

interface GeoDomainUrlIntelligenceTableProps {
  domains?: GeoDomainAnalyticsItem[];
  urls?: GeoUrlAnalyticsItem[];
  isLoading?: boolean;
}

export function GeoDomainUrlIntelligenceTable({
  domains = [],
  urls = [],
  isLoading,
}: GeoDomainUrlIntelligenceTableProps) {
  const [filterQuery, setFilterQuery] = useState("");
  const [activeSubTab, setActiveSubTab] = useState<"domains" | "urls">("domains");

  const filteredDomains = useMemo(() => {
    if (!filterQuery.trim()) return domains;
    const q = filterQuery.toLowerCase();
    return domains.filter((d) => d.domainName.toLowerCase().includes(q));
  }, [domains, filterQuery]);

  const filteredUrls = useMemo(() => {
    if (!filterQuery.trim()) return urls;
    const q = filterQuery.toLowerCase();
    return urls.filter((u) => u.url.toLowerCase().includes(q));
  }, [urls, filterQuery]);

  if (isLoading) {
    return (
      <Card className="border border-border/60 bg-surface-elevated/40">
        <CardHeader className="p-4">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-72" />
        </CardHeader>
        <CardContent className="p-4 pt-0 space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full rounded-md" />
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-border/60 bg-surface-elevated/40 shadow-xs">
      <CardHeader className="p-4 pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Globe className="size-4.5 text-teal-500" />
              Domain & URL Authority Intelligence
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground mt-0.5">
              Specific pages and high-authority referrers generating LLM citation attribution
            </CardDescription>
          </div>

          <div className="flex items-center gap-2">
            {/* Sub-tab toggle */}
            <div className="flex items-center gap-1 bg-surface border border-border/60 rounded-md p-0.5">
              <button
                type="button"
                onClick={() => setActiveSubTab("domains")}
                className={`px-2.5 py-1 text-xs rounded transition-colors cursor-pointer ${
                  activeSubTab === "domains"
                    ? "bg-brand text-brand-foreground font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Authority Domains ({domains.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveSubTab("urls")}
                className={`px-2.5 py-1 text-xs rounded transition-colors cursor-pointer ${
                  activeSubTab === "urls"
                    ? "bg-brand text-brand-foreground font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Indexed URLs ({urls.length})
              </button>
            </div>

            {/* Search Input */}
            <div className="relative w-44 sm:w-56">
              <Search className="absolute left-2.5 top-2.5 size-3.5 text-muted-foreground" />
              <Input
                placeholder="Filter results..."
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                className="pl-8 h-8 text-xs bg-surface"
              />
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 pt-0">
        {activeSubTab === "domains" ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-border/60 text-muted-foreground font-mono text-[11px] uppercase tracking-wider bg-surface/50">
                  <th className="py-2.5 px-3 font-semibold">Domain</th>
                  <th className="py-2.5 px-3 font-semibold">Authority Rank</th>
                  <th className="py-2.5 px-3 font-semibold">Trust Score</th>
                  <th className="py-2.5 px-3 font-semibold text-right">Citations Contributed</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {filteredDomains.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-6 text-center text-muted-foreground">
                      No domains match your search query.
                    </td>
                  </tr>
                ) : (
                  filteredDomains.map((dom) => (
                    <tr key={dom.domainName} className="hover:bg-surface-subtle/50 transition-colors">
                      <td className="py-3 px-3">
                        <div className="font-semibold text-foreground flex items-center gap-2">
                          <Globe className="size-3.5 text-teal-500 shrink-0" />
                          <span>{dom.domainName}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 font-mono">
                        <Badge variant="outline" className="text-[10px] font-mono bg-surface">
                          Rank {dom.authorityRank}
                        </Badge>
                      </td>
                      <td className="py-3 px-3 font-mono">
                        <div className="flex items-center gap-1.5 text-emerald-500">
                          <ShieldCheck className="size-3.5" />
                          <span>{dom.trustScore}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-foreground font-medium">
                        {(dom.citationsContributed ?? 320).toLocaleString()} citations
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-border/60 text-muted-foreground font-mono text-[11px] uppercase tracking-wider bg-surface/50">
                  <th className="py-2.5 px-3 font-semibold">URL Endpoint</th>
                  <th className="py-2.5 px-3 font-semibold">Citations Count</th>
                  <th className="py-2.5 px-3 font-semibold">Content Quality Score</th>
                  <th className="py-2.5 px-3 font-semibold text-right">Last Indexed</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {filteredUrls.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-6 text-center text-muted-foreground">
                      No URLs match your search query.
                    </td>
                  </tr>
                ) : (
                  filteredUrls.map((u) => (
                    <tr key={u.url} className="hover:bg-surface-subtle/50 transition-colors">
                      <td className="py-3 px-3 max-w-[320px]">
                        <div className="font-mono text-foreground truncate flex items-center gap-2">
                          <Link2 className="size-3.5 text-blue-500 shrink-0" />
                          <span className="truncate">{u.url}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 font-mono">
                        <Badge variant="secondary" className="text-[10px] font-mono">
                          {u.citationCount} citations
                        </Badge>
                      </td>
                      <td className="py-3 px-3 font-mono">
                        <div className="flex items-center gap-2">
                          <span className="text-foreground font-semibold">
                            {u.contentQualityScore ?? 92.0}%
                          </span>
                          <div className="w-16 bg-surface-elevated rounded-full h-1.5 overflow-hidden hidden sm:block">
                            <div
                              className="h-full bg-emerald-500"
                              style={{ width: `${u.contentQualityScore ?? 92}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-muted-foreground whitespace-nowrap">
                        <span className="flex items-center justify-end gap-1 text-[11px]">
                          <Calendar className="size-3 text-muted-foreground/70" />
                          {u.lastIndexedDate || "Recent"}
                        </span>
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
