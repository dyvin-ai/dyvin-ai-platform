import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  FlaskConical,
  Play,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  FileText,
  ChevronDown,
  ChevronRight,
  Sparkles,
  Layers,
  ArrowUpRight,
  ShieldAlert,
} from "lucide-react";
import type {
  ResearchProjectItem,
  ResearchOpportunityItem,
  ResearchThreatItem,
  ResearchTrendItem,
} from "@/types";

interface ResearchProjectsConsoleCardProps {
  projects?: ResearchProjectItem[];
  opportunities?: ResearchOpportunityItem[];
  threats?: ResearchThreatItem[];
  trends?: ResearchTrendItem[];
  onNewRunClick?: () => void;
  isLoading?: boolean;
}

export function ResearchProjectsConsoleCard({
  projects = [],
  opportunities = [],
  threats = [],
  trends = [],
  onNewRunClick,
}: ResearchProjectsConsoleCardProps) {
  const [expandedProjectId, setExpandedProjectId] = useState<string | null>(
    projects.length > 0 ? projects[0].id : null
  );

  const toggleExpand = (id: string) => {
    setExpandedProjectId(expandedProjectId === id ? null : id);
  };

  return (
    <div className="space-y-6">
      {/* Opportunities & Threats Strip */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Strategic Opportunities */}
        <Card className="border border-emerald-500/20 bg-emerald-500/5 backdrop-blur-sm">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2 text-emerald-400">
              <Lightbulb className="h-4 w-4" />
              Autonomous Citation & Content Opportunities
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-1 space-y-2.5">
            {opportunities.slice(0, 3).map((opp, idx) => (
              <div
                key={opp.id || idx}
                className="p-2.5 rounded-lg border border-emerald-500/20 bg-background/50 text-xs"
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="font-semibold text-foreground">{opp.title}</span>
                  <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 bg-emerald-500/10 text-[10px]">
                    +{opp.potentialImpact}% impact
                  </Badge>
                </div>
                <p className="text-[11px] text-muted-foreground">{opp.description}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Competitor Threats */}
        <Card className="border border-rose-500/20 bg-rose-500/5 backdrop-blur-sm">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2 text-rose-400">
              <ShieldAlert className="h-4 w-4" />
              Competitor Search Disruption & Threats
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-1 space-y-2.5">
            {threats.slice(0, 3).map((thr, idx) => (
              <div
                key={thr.id || idx}
                className="p-2.5 rounded-lg border border-rose-500/20 bg-background/50 text-xs"
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="font-semibold text-foreground">{thr.title}</span>
                  <Badge variant="outline" className="border-rose-500/30 text-rose-400 bg-rose-500/10 text-[10px]">
                    {thr.severity} Severity
                  </Badge>
                </div>
                <p className="text-[11px] text-muted-foreground">{thr.description}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Main Research Projects Console */}
      <Card className="border border-border/50 bg-card/60 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <FlaskConical className="h-4 w-4 text-rose-400" />
                Autonomous Research Discovery Projects
              </CardTitle>
              <CardDescription className="text-xs">
                Multi-agent discovery sweeps analyzing knowledge graph shifts, brand mentions, and LLM citations
              </CardDescription>
            </div>

            <Button
              size="sm"
              onClick={onNewRunClick}
              className="gap-1.5 bg-primary hover:bg-primary/90 text-primary-foreground text-xs h-8"
            >
              <Play className="h-3.5 w-3.5 fill-current" />
              Launch Discovery Run
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {projects.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground text-xs">
              No research discovery projects recorded yet. Click &quot;Launch Discovery Run&quot; to begin.
            </div>
          ) : (
            projects.map((p) => {
              const isExpanded = expandedProjectId === p.id;
              return (
                <div
                  key={p.id}
                  className="rounded-xl border border-border/50 bg-background/40 transition-all overflow-hidden"
                >
                  {/* Project Header Row */}
                  <div
                    onClick={() => toggleExpand(p.id)}
                    className="p-4 flex items-center justify-between gap-4 cursor-pointer hover:bg-muted/20 select-none"
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-muted-foreground">
                        {isExpanded ? (
                          <ChevronDown className="h-4 w-4 text-primary" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </div>
                      <div>
                        <div className="font-semibold text-foreground text-sm flex items-center gap-2">
                          {p.title}
                          {p.status === "COMPLETED" ? (
                            <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 bg-emerald-500/10 text-[10px]">
                              Completed
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="border-amber-500/30 text-amber-400 bg-amber-500/10 text-[10px]">
                              In Progress
                            </Badge>
                          )}
                          <Badge variant="outline" className="text-[10px] font-mono">
                            {p.priority}
                          </Badge>
                        </div>
                        {p.description && (
                          <p className="text-xs text-muted-foreground mt-0.5 max-w-2xl">
                            {p.description}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="text-right text-xs text-muted-foreground hidden sm:block shrink-0">
                      <div>Created {new Date(p.createdAt).toLocaleDateString()}</div>
                      <div className="text-[11px] text-primary">
                        {p.topics?.length || 0} Topics • {p.findings?.length || 0} Findings
                      </div>
                    </div>
                  </div>

                  {/* Expanded Content Drawer */}
                  {isExpanded && (
                    <div className="p-4 pt-0 border-t border-border/40 mt-1 space-y-4">
                      {/* Topics */}
                      {p.topics && p.topics.length > 0 && (
                        <div>
                          <div className="text-xs font-semibold text-muted-foreground mb-2 flex items-center gap-1.5">
                            <Layers className="h-3.5 w-3.5 text-primary" />
                            Research Topics & Semantic Clusters
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            {p.topics.map((top) => (
                              <div
                                key={top.id}
                                className="p-3 rounded-lg border border-border/40 bg-muted/20 text-xs"
                              >
                                <div className="font-semibold text-foreground mb-1">
                                  {top.name}
                                </div>
                                <p className="text-[11px] text-muted-foreground">
                                  {top.description}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Findings */}
                      {p.findings && p.findings.length > 0 && (
                        <div>
                          <div className="text-xs font-semibold text-muted-foreground mb-2 flex items-center gap-1.5">
                            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                            Synthesized Research Findings
                          </div>
                          <div className="space-y-2">
                            {p.findings.map((find) => (
                              <div
                                key={find.id}
                                className="p-3 rounded-lg border border-border/40 bg-muted/10 text-xs flex flex-col gap-1"
                              >
                                <div className="flex items-center justify-between gap-2">
                                  <span className="font-semibold text-foreground">
                                    {find.title}
                                  </span>
                                  <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 bg-emerald-500/5 text-[10px]">
                                    {find.confidence} Confidence
                                  </Badge>
                                </div>
                                <p className="text-[11px] text-muted-foreground">
                                  {find.summary}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Generated Reports */}
                      {p.reports && p.reports.length > 0 && (
                        <div>
                          <div className="text-xs font-semibold text-muted-foreground mb-2 flex items-center gap-1.5">
                            <FileText className="h-3.5 w-3.5 text-blue-400" />
                            Generated Intelligence Reports
                          </div>
                          <div className="space-y-2">
                            {p.reports.map((rep) => (
                              <div
                                key={rep.id}
                                className="p-3 rounded-lg border border-blue-500/20 bg-blue-500/5 text-xs"
                              >
                                <div className="flex items-center justify-between gap-2 mb-1">
                                  <span className="font-semibold text-foreground">
                                    {rep.title}
                                  </span>
                                  <Badge variant="outline" className="border-blue-500/30 text-blue-400 bg-blue-500/10 text-[10px]">
                                    {rep.reportType}
                                  </Badge>
                                </div>
                                <div className="p-2 rounded bg-background/60 border border-border/30 text-[11px] text-muted-foreground whitespace-pre-wrap font-mono">
                                  {rep.contentBody}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </CardContent>
      </Card>
    </div>
  );
}
