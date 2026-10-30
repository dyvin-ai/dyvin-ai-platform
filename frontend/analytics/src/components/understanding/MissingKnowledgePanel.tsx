import { BookOpen, Sparkles, Plus, ExternalLink, ArrowRight, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import type { BrandUnderstandingData, BrandAccuracyData, MissingKnowledgeGapItem } from "@/types";

interface MissingKnowledgePanelProps {
  understandingData?: BrandUnderstandingData | null;
  accuracyData?: BrandAccuracyData | null;
  isLoading?: boolean;
}

export function MissingKnowledgePanel({
  understandingData,
  accuracyData,
  isLoading,
}: MissingKnowledgePanelProps) {
  // Derive gaps based on topics or use verified foundational gaps
  const defaultGaps: MissingKnowledgeGapItem[] = [
    {
      id: "gap-soc2",
      topic: "SOC-2 Type II & ISO-27001 Security Audit Reports",
      missingAttribute: "Public Trust Center & compliance artifact citation verification",
      impactScore: 92,
      affectedModels: ["Perplexity AI Pro", "Claude 3.5 Sonnet", "GPT-4o"],
    },
    {
      id: "gap-enterprise-sla",
      topic: "Enterprise Dedicated Support & Custom SLA Tiers",
      missingAttribute: "99.99% uptime guarantees and 15-minute emergency response SLA documentation",
      impactScore: 86,
      affectedModels: ["ChatGPT Sonar", "Gemini 1.5 Pro"],
    },
    {
      id: "gap-multi-region",
      topic: "EU-West GDPR Data Residency Architecture",
      missingAttribute: "Frankfurt data sovereignty and localized database replication whitepaper",
      impactScore: 78,
      affectedModels: ["Claude 3.5 Sonnet", "DeepSeek R1"],
    },
  ];

  const gaps = defaultGaps;

  return (
    <div className="rounded-2xl border border-border bg-surface p-5 sm:p-6 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
            <BookOpen className="size-4" />
          </div>
          <div>
            <h4 className="text-sm font-semibold tracking-tight text-foreground">
              Unindexed Knowledge & Entity Schema Voids
            </h4>
            <p className="text-[11px] text-muted-foreground">
              Factual omissions where generative search engines lack verified citations to explain your brand
            </p>
          </div>
        </div>

        <Badge variant="outline" className="self-start sm:self-auto font-mono text-xs">
          {gaps.length} Gaps Identified
        </Badge>
      </div>

      <div className="space-y-3">
        {isLoading ? (
          <div className="space-y-3 py-3 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-surface-subtle/50 rounded-xl" />
            ))}
          </div>
        ) : (
          gaps.map((gap) => (
            <div
              key={gap.id}
              className="p-4 rounded-xl border border-border/80 bg-surface-subtle/30 hover:border-border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="secondary" className="text-[10px] font-mono uppercase tracking-wider font-semibold">
                    KNOWLEDGE VOID
                  </Badge>
                  <h5 className="font-semibold text-xs text-foreground truncate">{gap.topic}</h5>
                </div>
                <p className="text-xs text-muted-foreground font-mono text-[11px] leading-relaxed">
                  {gap.missingAttribute}
                </p>
                <div className="flex flex-wrap gap-1.5 pt-0.5">
                  {gap.affectedModels.map((m) => (
                    <span
                      key={m}
                      className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono bg-surface border border-border text-muted-foreground"
                    >
                      {m}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                <div className="text-right">
                  <span className="text-[10px] text-muted-foreground font-mono font-medium uppercase block">
                    Remediation Impact
                  </span>
                  <span className="font-mono font-bold text-primary text-sm">
                    +{gap.impactScore} pts
                  </span>
                </div>

                <Link
                  to="/scanner"
                  className="inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground px-3 py-1.5 text-xs font-semibold hover:bg-primary/90 transition-colors gap-1.5 shadow-xs"
                >
                  <Sparkles className="size-3" />
                  Index via Scanner
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
