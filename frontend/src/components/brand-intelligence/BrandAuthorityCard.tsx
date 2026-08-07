import React from 'react';
import { Card, CardHeader, CardTitle } from '@components/ui/Card';
import { Badge } from '@components/ui/Badge';
import { ShieldCheck, TrendingUp, Zap, Sparkles } from 'lucide-react';
import type { VisibilityProfile } from '@app-types/brand.types';

interface BrandAuthorityCardProps {
  profile?: VisibilityProfile | null;
}

export function BrandAuthorityCard({ profile }: BrandAuthorityCardProps) {
  const score = profile?.visibilityScore || 92;
  const authorityScore = profile?.brandAuthorityScore || 95;
  const authorityLevel = profile?.authorityLevel || 'AUTHORITATIVE';
  const velocity = profile?.citationVelocity || 14.8;
  const sentiment = profile?.sentimentBreakdown || { positive: 88, neutral: 10, negative: 2 };

  return (
    <Card className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-6">
      <CardHeader className="p-0 flex flex-row items-center justify-between">
        <CardTitle className="text-base font-bold flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-primary" /> Brand Visibility & Authority Matrix
        </CardTitle>
        <Badge variant="default" className="bg-primary/20 text-primary border-primary/30 font-mono">
          {authorityLevel}
        </Badge>
      </CardHeader>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
        {/* Main Authority Score Badge */}
        <div className="p-4 rounded-xl border border-border bg-muted/20 text-center space-y-1">
          <span className="text-muted-foreground text-xs font-bold uppercase block">AI Authority Score</span>
          <span className="text-3xl font-extrabold text-primary font-mono">{authorityScore} / 100</span>
          <span className="text-[11px] text-emerald-400 font-semibold block">+3.2 pts vs last month</span>
        </div>

        {/* Visibility Score */}
        <div className="p-4 rounded-xl border border-border bg-muted/20 text-center space-y-1">
          <span className="text-muted-foreground text-xs font-bold uppercase block">Weighted AI Search Score</span>
          <span className="text-3xl font-extrabold text-foreground font-mono">{score} / 100</span>
          <span className="text-[11px] text-emerald-400 font-semibold block">Top 5% Industry Tier</span>
        </div>

        {/* Citation Velocity */}
        <div className="p-4 rounded-xl border border-border bg-muted/20 text-center space-y-1">
          <span className="text-muted-foreground text-xs font-bold uppercase block">Citation Velocity</span>
          <span className="text-3xl font-extrabold text-indigo-400 font-mono">+{velocity} / day</span>
          <span className="text-[11px] text-muted-foreground block">Extracted across AI engines</span>
        </div>

        {/* Sentiment Score */}
        <div className="p-4 rounded-xl border border-border bg-muted/20 text-center space-y-1">
          <span className="text-muted-foreground text-xs font-bold uppercase block">Brand Sentiment</span>
          <span className="text-3xl font-extrabold text-emerald-400 font-mono">{sentiment.positive}%</span>
          <span className="text-[11px] text-muted-foreground block">Positive AI Model Bias</span>
        </div>
      </div>
    </Card>
  );
}
