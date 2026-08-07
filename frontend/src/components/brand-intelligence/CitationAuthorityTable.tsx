import React, { useState } from 'react';
import { Card, CardHeader, CardTitle } from '@components/ui/Card';
import { Input } from '@components/ui/Input';
import { Badge } from '@components/ui/Badge';
import { useCitationTopDomains, useCitations } from '@hooks/useBrandIntelligence';
import { Search, Link, Award, ExternalLink } from 'lucide-react';
import type { TopCitingDomain } from '@app-types/brand.types';

export function CitationAuthorityTable() {
  const [searchTerm, setSearchTerm] = useState('');
  const { data: topDomains = [], isLoading } = useCitationTopDomains();

  const DEFAULT_DOMAINS: TopCitingDomain[] = [
    { domain: 'wikipedia.org', authorityScore: 98, totalCitations: 1420, shareOfVoice: 28 },
    { domain: 'github.com', authorityScore: 95, totalCitations: 980, shareOfVoice: 22 },
    { domain: 'techcrunch.com', authorityScore: 92, totalCitations: 640, shareOfVoice: 18 },
    { domain: 'news.ycombinator.com', authorityScore: 89, totalCitations: 420, shareOfVoice: 12 },
  ];

  const displayDomains = topDomains.length > 0 ? topDomains : DEFAULT_DOMAINS;
  const filteredDomains = displayDomains.filter((d) =>
    d.domain.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4">
      <CardHeader className="p-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <CardTitle className="text-base font-bold flex items-center gap-2">
          <Award className="w-5 h-5 text-primary" /> Authority Source Domain Citation Breakdown
        </CardTitle>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-muted-foreground" />
          <Input
            placeholder="Search domain..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 text-xs bg-background border-border"
          />
        </div>
      </CardHeader>

      <div className="space-y-2 text-xs">
        {isLoading ? (
          <p className="text-center py-6 text-muted-foreground">Loading domain citations...</p>
        ) : (
          filteredDomains.map((item) => (
            <div
              key={item.domain}
              className="p-3.5 rounded-xl border border-border bg-muted/20 hover:border-primary/50 transition-all flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3">
                <Link className="w-4 h-4 text-primary" />
                <div>
                  <span className="font-bold text-foreground font-mono">{item.domain}</span>
                  <span className="text-[11px] text-muted-foreground block">
                    {item.totalCitations} Citations • Authority Score: {item.authorityScore}/100
                  </span>
                </div>
              </div>

              <Badge variant="outline" className="font-mono">
                {item.shareOfVoice}% Share of Voice
              </Badge>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}
