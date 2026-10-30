import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Globe,
  Quote,
  TrendingUp,
  ExternalLink,
  Shield,
  CheckCircle2,
} from "lucide-react";
import type {
  GlobalCitationItem,
  GlobalDomainProfile,
  GlobalUrlProfile,
  GlobalTrendItem,
} from "@/types";

interface GlobalCitationsMatrixCardProps {
  citations?: GlobalCitationItem[];
  domains?: GlobalDomainProfile[];
  urls?: GlobalUrlProfile[];
  trends?: GlobalTrendItem;
  isLoading?: boolean;
}

export function GlobalCitationsMatrixCard({
  citations = [],
  domains = [],
  urls = [],
  trends,
  isLoading = false,
}: GlobalCitationsMatrixCardProps) {
  const defaultCitations: GlobalCitationItem[] = [
    { id: "cit-1", domain: "wikipedia.org", url: "https://wikipedia.org/wiki/Artificial_intelligence", frequency: 245000, authorityScore: 98.0 },
    { id: "cit-2", domain: "docs.dyvin.ai", url: "https://docs.dyvin.ai/enterprise/architecture", frequency: 185000, authorityScore: 97.5 },
    { id: "cit-3", domain: "github.com", url: "https://github.com/dyvin-ai/platform", frequency: 142000, authorityScore: 96.5 },
    { id: "cit-4", domain: "arxiv.org", url: "https://arxiv.org/abs/2602.09102", frequency: 89000, authorityScore: 98.5 },
  ];

  const citationList = citations.length > 0 ? citations : defaultCitations;

  const defaultDomains: GlobalDomainProfile[] = [
    { domain: "wikipedia.org", trustScore: 99.2, citationCount: 42000, visibilityTrend: "UPWARD" },
    { domain: "docs.dyvin.ai", trustScore: 97.5, citationCount: 28400, visibilityTrend: "UPWARD" },
    { domain: "github.com", trustScore: 96.0, citationCount: 22100, visibilityTrend: "STABLE" },
    { domain: "arxiv.org", trustScore: 98.8, citationCount: 19500, visibilityTrend: "UPWARD" },
  ];

  const domainList = domains.length > 0 ? domains : defaultDomains;

  const fastestGrowing = trends?.fastestGrowingCitationDomains || [
    "docs.dyvin.ai",
    "docs.github.com",
    "developer.mozilla.org",
    "arxiv.org",
  ];

  return (
    <Card className="border border-border/80 bg-card shadow-sm">
      <CardHeader className="p-5 pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <Quote className="h-5 w-5 text-amber-500" />
              <CardTitle className="text-base font-semibold text-foreground">
                Global Citations & Apex Domain Authority Matrix
              </CardTitle>
            </div>
            <CardDescription className="text-xs text-muted-foreground mt-0.5">
              Aggregated cross-engine citation volume, domain trust scores, and authoritative URL provenance
            </CardDescription>
          </div>

          <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20 text-xs w-fit">
            <Shield className="h-3 w-3 mr-1" />
            Verified Authority Index
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-5 pt-3">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Left Column: Top Cited Domains */}
          <div className="space-y-3">
            <div className="text-xs font-semibold text-foreground flex items-center justify-between">
              <span>Top Apex Citation Domains</span>
              <span className="text-[11px] text-muted-foreground">Indexed Across All Models</span>
            </div>

            <div className="space-y-2">
              {domainList.map((domain, idx) => (
                <div
                  key={domain.domain}
                  className="p-3 rounded-lg border border-border/60 bg-muted/10 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-muted text-[11px] font-bold text-muted-foreground">
                      {idx + 1}
                    </span>
                    <div>
                      <div className="text-xs font-semibold text-foreground flex items-center gap-1">
                        {domain.domain}
                        <ExternalLink className="h-3 w-3 text-muted-foreground" />
                      </div>
                      <div className="text-[11px] text-muted-foreground">
                        {domain.citationCount.toLocaleString()} total citations
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-[10px] text-emerald-500 border-emerald-500/20">
                      {domain.visibilityTrend}
                    </Badge>
                    <div className="text-right">
                      <span className="text-xs font-bold text-foreground">{domain.trustScore}</span>
                      <span className="text-[10px] text-muted-foreground block">Trust Score</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: High Frequency Citation URLs & Emerging Trends */}
          <div className="space-y-3">
            <div className="text-xs font-semibold text-foreground flex items-center justify-between">
              <span>Top Citations by Frequency</span>
              <span className="text-[11px] text-muted-foreground">Global Count</span>
            </div>

            <div className="space-y-2">
              {citationList.slice(0, 4).map((cit) => (
                <div
                  key={cit.id || cit.domain}
                  className="p-3 rounded-lg border border-border/60 bg-muted/10 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-foreground truncate max-w-[240px]">
                      {cit.domain}
                    </span>
                    <Badge variant="secondary" className="text-[10px] font-mono">
                      {cit.frequency.toLocaleString()} citations
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                    <span className="truncate max-w-[200px] font-mono text-[10px]">
                      {cit.url || `https://${cit.domain}`}
                    </span>
                    <span className="font-semibold text-foreground">Auth: {cit.authorityScore}/100</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Fastest growing domains banner */}
            <div className="mt-3 p-3 rounded-lg border border-border/60 bg-card text-xs space-y-1">
              <div className="font-medium text-foreground flex items-center gap-1.5 text-[11px]">
                <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
                Emergent Growth Domains:
              </div>
              <div className="flex flex-wrap gap-1 pt-1">
                {fastestGrowing.map((dom) => (
                  <Badge key={dom} variant="outline" className="text-[10px] font-mono">
                    {dom}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
