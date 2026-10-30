import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Panel, SectionHeading } from "@/components/analytics/Panel";
import { brandIntelligenceService } from "@/services";
import { useWorkspace } from "@/context/WorkspaceContext";
import { cn } from "@/lib/utils";
import {
  ShieldCheck,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  Bot,
  RefreshCw,
  Search,
  Quote,
  AlertCircle,
  Building2,
  Compass,
} from "lucide-react";

export const Route = createFileRoute("/_shell/brand")({
  head: () => ({
    meta: [
      { title: "Dyvin AI | Brand Intelligence" },
      {
        name: "description",
        content: "AI Brand perception, positioning synthesis, product accuracy audit, and competitive intelligence.",
      },
      { property: "og:title", content: "Dyvin AI | Brand Intelligence" },
      {
        property: "og:description",
        content: "AI Brand perception, positioning synthesis, product accuracy audit, and competitive intelligence.",
      },
    ],
  }),
  component: BrandIntelligencePage,
});

type ActiveTab = "understanding" | "accuracy" | "presence" | "gaps";

function ProvenanceBadge({ provenance }: { provenance?: string }) {
  const p = provenance || "DERIVED";
  const styles: Record<string, string> = {
    OBSERVED: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    DERIVED: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    "AI-GENERATED": "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
    UNAVAILABLE: "bg-zinc-500/10 text-zinc-500 border-zinc-500/20",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded px-1.5 py-0.5 font-mono text-[10px] font-semibold border",
        styles[p] || styles.DERIVED,
      )}
    >
      {p}
    </span>
  );
}

function SeverityBadge({ severity }: { severity: string }) {
  const styles: Record<string, string> = {
    CRITICAL: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/25",
    HIGH: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/25",
    MEDIUM: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/25",
    LOW: "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/25",
    INFO: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/25",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider border",
        styles[severity] || styles.LOW,
      )}
    >
      {severity}
    </span>
  );
}

function SentimentBadge({ sentiment }: { sentiment: string }) {
  const s = sentiment.toUpperCase();
  const styles: Record<string, string> = {
    POSITIVE: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    NEUTRAL: "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20",
    NEGATIVE: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded px-2 py-0.5 font-mono text-[10px] font-medium border",
        styles[s] || styles.NEUTRAL,
      )}
    >
      {s}
    </span>
  );
}

function BrandIntelligencePage() {
  const { activeOrgId, activeProjectId, activeOrganization, isDemo } = useWorkspace();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<ActiveTab>("understanding");
  const [excerptSearch, setExcerptSearch] = useState("");
  const [selectedProvider, setSelectedProvider] = useState<string>("ALL");

  const {
    data: brandData,
    isLoading,
    isError,
    error,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["brand-intelligence", activeOrgId, activeProjectId],
    queryFn: () => brandIntelligenceService.getBrandIntelligence(activeProjectId || undefined),
    staleTime: 60_000,
  });

  const handleRefresh = async () => {
    await queryClient.invalidateQueries({ queryKey: ["brand-intelligence", activeOrgId, activeProjectId] });
    await refetch();
  };

  const profile = brandData?.profile;
  const understanding = brandData?.understanding;
  const accuracy = brandData?.accuracy;
  const presence = brandData?.presence;
  const gaps = brandData?.competitiveGaps || [];

  const brandDisplayName = profile?.brandName || activeOrganization?.name || (isDemo ? "Dyvin AI" : "Brand Profile");

  // Filter answer excerpts
  const filteredExcerpts = (understanding?.answerExcerpts || []).filter((item) => {
    const matchesSearch =
      excerptSearch === "" ||
      item.promptText.toLowerCase().includes(excerptSearch.toLowerCase()) ||
      item.answerExcerpt.toLowerCase().includes(excerptSearch.toLowerCase());
    const matchesProvider =
      selectedProvider === "ALL" || item.provider.toLowerCase().includes(selectedProvider.toLowerCase());
    return matchesSearch && matchesProvider;
  });

  return (
    <div className="flex flex-col gap-8 pb-12">
      {/* Header & Meta */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono font-medium uppercase tracking-[0.14em] text-muted-foreground">
              BRAND SOVEREIGNTY & AI PERCEPTION
            </span>
            <span className="rounded bg-primary/10 px-2 py-0.5 font-mono text-[10px] font-semibold text-primary border border-primary/20">
              F7
            </span>
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            AI Brand & Competitive Intelligence
          </h1>
          <p className="mt-1 text-sm text-muted-foreground max-w-3xl">
            Audit how frontier AI models synthesize, describe, and recommend {brandDisplayName}. Detect hallucinated features, omitted services, multi-engine presence, and competitive gaps.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleRefresh}
            disabled={isFetching}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-2 text-xs font-medium text-foreground hover:bg-surface-subtle transition-all cursor-pointer shadow-xs disabled:opacity-50"
          >
            <RefreshCw className={cn("size-3.5", isFetching && "animate-spin")} />
            <span>{isFetching ? "Auditing Models..." : "Refresh Intelligence"}</span>
          </button>
        </div>
      </div>

      {isLoading ? (
        <Panel>
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <div className="size-8 animate-spin rounded-full border-2 border-border border-t-foreground" />
            <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
              Synthesizing brand telemetry and LLM presence...
            </span>
          </div>
        </Panel>
      ) : isError ? (
        <Panel>
          <div className="flex flex-col items-center justify-center py-12 gap-3 text-center">
            <AlertCircle className="size-8 text-rose-500" />
            <h3 className="text-base font-semibold text-foreground">Failed to Load Brand Intelligence</h3>
            <p className="text-xs text-muted-foreground max-w-md">
              {error instanceof Error ? error.message : "Unable to contact brand intelligence aggregator service."}
            </p>
            <button
              type="button"
              onClick={() => refetch()}
              className="mt-2 inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground hover:bg-surface-subtle cursor-pointer"
            >
              <RefreshCw className="size-3.5" />
              Retry Query
            </button>
          </div>
        </Panel>
      ) : (
        <>
          {/* Brand Profile Overview Card */}
          <Panel>
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div className="flex items-start gap-4">
                <div className="size-12 rounded-xl bg-surface-subtle border border-border flex items-center justify-center shrink-0">
                  <ShieldCheck className="size-6 text-foreground" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-xl font-bold text-foreground">{brandDisplayName}</h2>
                    {profile?.domain && (
                      <span className="inline-flex items-center gap-1 rounded bg-surface-subtle px-2 py-0.5 font-mono text-xs text-muted-foreground border border-border">
                        <ExternalLink className="size-3" />
                        {profile.domain}
                      </span>
                    )}
                    <ProvenanceBadge provenance={brandData?.provenance} />
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{profile?.industry || "SaaS / Artificial Intelligence"}</p>
                  <p className="mt-2 text-xs text-foreground/80 leading-relaxed max-w-2xl">
                    {profile?.description || "Enterprise AI Search Visibility and Generative Engine Optimization platform."}
                  </p>
                </div>
              </div>

              {/* Verified Catalog Footprint */}
              <div className="rounded-xl border border-border bg-surface-subtle p-4 min-w-[280px]">
                <div className="flex items-center justify-between pb-2 border-b border-border/60">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="size-4 text-emerald-500" />
                    <span className="text-xs font-semibold text-foreground">Verified Knowledge Graph</span>
                  </div>
                  <span className="text-[10px] font-mono text-muted-foreground">
                    {brandData?.lastScannedAt
                      ? new Date(brandData.lastScannedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                      : "Active"}
                  </span>
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                  <div className="rounded bg-surface p-2 border border-border/50">
                    <span className="text-[10px] font-mono text-muted-foreground uppercase block">Products</span>
                    <span className="font-mono text-sm font-bold text-foreground">
                      {profile?.products?.length ?? 0}
                    </span>
                  </div>
                  <div className="rounded bg-surface p-2 border border-border/50">
                    <span className="text-[10px] font-mono text-muted-foreground uppercase block">Services</span>
                    <span className="font-mono text-sm font-bold text-foreground">
                      {profile?.services?.length ?? 0}
                    </span>
                  </div>
                  <div className="rounded bg-surface p-2 border border-border/50">
                    <span className="text-[10px] font-mono text-muted-foreground uppercase block">Entities</span>
                    <span className="font-mono text-sm font-bold text-foreground">
                      {profile?.entities?.length ?? 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick KPI Strip */}
            <div className="mt-6 pt-6 border-t border-border grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
              <div className="rounded-lg border border-border/60 bg-surface-subtle/50 p-3">
                <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider block">
                  Total AI Mentions
                </span>
                <span className="mt-1 font-mono text-xl font-bold text-foreground block">
                  {understanding?.totalMentions ?? presence?.totalMentions ?? 0}
                </span>
                <span className="mt-0.5 text-[10px] text-muted-foreground">Across {understanding?.totalAnswersAnalyzed ?? 0} queries</span>
              </div>

              <div className="rounded-lg border border-border/60 bg-surface-subtle/50 p-3">
                <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider block">
                  Mention Rate
                </span>
                <div className="mt-1 flex items-baseline gap-1.5">
                  <span className="font-mono text-xl font-bold text-foreground">
                    {understanding?.mentionRate?.toFixed(1) ?? "0.0"}%
                  </span>
                  <SentimentBadge
                    sentiment={
                      (understanding?.mentionRate ?? 0) >= 50
                        ? "POSITIVE"
                        : (understanding?.mentionRate ?? 0) >= 20
                          ? "NEUTRAL"
                          : "NEGATIVE"
                    }
                  />
                </div>
                <span className="mt-0.5 text-[10px] text-muted-foreground">Share of brand presence</span>
              </div>

              <div className="rounded-lg border border-border/60 bg-surface-subtle/50 p-3">
                <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider block">
                  Overall Accuracy
                </span>
                <div className="mt-1 flex items-baseline gap-1.5">
                  <span className="font-mono text-xl font-bold text-foreground">
                    {accuracy?.accuracyScore ?? 86.5}
                  </span>
                  <span className="font-mono text-xs text-muted-foreground">/ 100</span>
                </div>
                <span className="mt-0.5 text-[10px] text-muted-foreground">Factual grounding score</span>
              </div>

              <div className="rounded-lg border border-border/60 bg-surface-subtle/50 p-3">
                <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider block">
                  Consistent Answers
                </span>
                <span className="mt-1 font-mono text-xl font-bold text-emerald-600 dark:text-emerald-400 block">
                  {accuracy?.verifiedConsistentCount ?? 0} / {accuracy?.totalAuditedPrompts ?? 0}
                </span>
                <span className="mt-0.5 text-[10px] text-muted-foreground">Free of hallucinations</span>
              </div>

              <div className="rounded-lg border border-border/60 bg-surface-subtle/50 p-3">
                <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider block">
                  Accuracy Findings
                </span>
                <span
                  className={cn(
                    "mt-1 font-mono text-xl font-bold block",
                    (accuracy?.findings?.length ?? 0) > 0
                      ? "text-amber-600 dark:text-amber-400"
                      : "text-emerald-600 dark:text-emerald-400",
                  )}
                >
                  {accuracy?.findings?.length ?? 0}
                </span>
                <span className="mt-0.5 text-[10px] text-muted-foreground">Active discrepancies</span>
              </div>
            </div>
          </Panel>

          {/* Tab Navigation */}
          <div className="flex border-b border-border">
            <button
              type="button"
              onClick={() => setActiveTab("understanding")}
              className={cn(
                "flex items-center gap-2 border-b-2 px-5 py-3 text-xs font-semibold transition-all cursor-pointer",
                activeTab === "understanding"
                  ? "border-foreground text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground",
              )}
            >
              <Sparkles className="size-4" />
              <span>Brand Understanding & Positioning</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("accuracy")}
              className={cn(
                "flex items-center gap-2 border-b-2 px-5 py-3 text-xs font-semibold transition-all cursor-pointer relative",
                activeTab === "accuracy"
                  ? "border-foreground text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground",
              )}
            >
              <ShieldCheck className="size-4" />
              <span>Accuracy & Integrity Audit</span>
              {(accuracy?.findings?.length ?? 0) > 0 && (
                <span className="rounded-full bg-rose-500/15 text-rose-600 dark:text-rose-400 px-1.5 py-0.2 font-mono text-[10px] font-bold">
                  {accuracy?.findings?.length}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("presence")}
              className={cn(
                "flex items-center gap-2 border-b-2 px-5 py-3 text-xs font-semibold transition-all cursor-pointer",
                activeTab === "presence"
                  ? "border-foreground text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground",
              )}
            >
              <Bot className="size-4" />
              <span>LLM Engine Presence</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("gaps")}
              className={cn(
                "flex items-center gap-2 border-b-2 px-5 py-3 text-xs font-semibold transition-all cursor-pointer relative",
                activeTab === "gaps"
                  ? "border-foreground text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground",
              )}
            >
              <Compass className="size-4" />
              <span>Competitive Gaps</span>
              {gaps.length > 0 && (
                <span className="rounded-full bg-primary/15 text-primary px-1.5 py-0.2 font-mono text-[10px] font-bold">
                  {gaps.length}
                </span>
              )}
            </button>
          </div>

          {/* TAB 1: Brand Understanding & Positioning */}
          {activeTab === "understanding" && (
            <div className="flex flex-col gap-8">
              {/* Positioning Synthesis */}
              <Panel>
                <SectionHeading
                  eyebrow="Consensus Synthesis"
                  title="Frontier AI Positioning Statement"
                  question="Unified summary of how frontier models define your brand when asked exploratory and category queries."
                />
                <div className="mt-4 rounded-xl border border-primary/20 bg-primary/5 p-5 relative overflow-hidden">
                  <div className="flex items-start gap-3">
                    <Quote className="size-6 text-primary shrink-0 opacity-80 mt-1" />
                    <div>
                      <p className="text-sm font-medium text-foreground leading-relaxed italic">
                        "{understanding?.positioningStatement}"
                      </p>
                      <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="font-mono text-[11px] font-semibold text-primary">
                          SYNTHESIZED FROM {understanding?.totalAnswersAnalyzed ?? 0}+ MODEL EXECUTIONS
                        </span>
                        <span>•</span>
                        <ProvenanceBadge provenance="DERIVED" />
                      </div>
                    </div>
                  </div>
                </div>
              </Panel>

              {/* Associated Topics & Products Grid */}
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                {/* Associated Topics */}
                <Panel>
                  <SectionHeading
                    eyebrow="Semantic Association"
                    title="Key Topics Associated With Brand"
                    question="Top concepts and themes connected to your brand in AI response vectors."
                  />
                  <div className="mt-4 flex flex-col gap-3">
                    {(understanding?.associatedTopics || []).map((topicItem) => (
                      <div
                        key={topicItem.topic}
                        className="rounded-lg border border-border bg-surface-subtle p-3.5 flex flex-col gap-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-foreground">{topicItem.topic}</span>
                          <span className="font-mono text-xs font-bold text-foreground">
                            {topicItem.percentage}%
                          </span>
                        </div>

                        <div className="h-1.5 w-full bg-border/60 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full transition-all duration-300"
                            style={{ width: `${Math.min(topicItem.percentage, 100)}%` }}
                          />
                        </div>

                        <div className="flex items-center justify-between text-[10px] text-muted-foreground font-mono">
                          <span>{topicItem.mentions} query mentions</span>
                          <ProvenanceBadge provenance="OBSERVED" />
                        </div>
                      </div>
                    ))}
                  </div>
                </Panel>

                {/* Product & Service Recognition Matrix */}
                <Panel>
                  <SectionHeading
                    eyebrow="Catalog Grounding"
                    title="Product & Offering Identification"
                    question="Catalog products recognized by AI models versus unmapped/hallucinated offerings."
                  />
                  <div className="mt-4 flex flex-col gap-3">
                    {(understanding?.associatedProducts || []).map((product) => {
                      const isObserved = product.status === "OBSERVED_IN_ANSWERS";
                      return (
                        <div
                          key={product.name}
                          className={cn(
                            "rounded-lg border p-3.5 flex flex-col gap-2 transition-all",
                            isObserved
                              ? "border-border bg-surface-subtle"
                              : "border-amber-500/30 bg-amber-500/5",
                          )}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-foreground">{product.name}</span>
                              <span
                                className={cn(
                                  "rounded px-1.5 py-0.5 font-mono text-[9px] font-semibold border",
                                  isObserved
                                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                                    : "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/25",
                                )}
                              >
                                {product.status}
                              </span>
                            </div>
                            <span className="font-mono text-xs font-semibold text-foreground">
                              {product.mentionCount} Mentions
                            </span>
                          </div>

                          <div className="flex items-center justify-between pt-1 border-t border-border/40 text-[10px] font-mono text-muted-foreground">
                            <span>Status: {product.status.replace(/_/g, " ")}</span>
                            <ProvenanceBadge provenance={isObserved ? "OBSERVED" : "AI-GENERATED"} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </Panel>
              </div>

              {/* Direct AI Answer Excerpts */}
              <Panel>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <SectionHeading
                    eyebrow="Primary Evidence"
                    title="Real AI Answer Excerpts"
                    question="Direct quotes captured during live search executions across ChatGPT, Claude, Gemini, and Perplexity."
                  />
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="size-3.5 text-muted-foreground absolute left-2.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Search excerpt content..."
                        value={excerptSearch}
                        onChange={(e) => setExcerptSearch(e.target.value)}
                        className="rounded-lg border border-border bg-surface pl-8 pr-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground"
                      />
                    </div>
                    <select
                      value={selectedProvider}
                      onChange={(e) => setSelectedProvider(e.target.value)}
                      className="rounded-lg border border-border bg-surface px-2.5 py-1.5 text-xs text-foreground focus:outline-none cursor-pointer"
                    >
                      <option value="ALL">All Providers</option>
                      <option value="OpenAI">OpenAI</option>
                      <option value="Anthropic">Anthropic</option>
                      <option value="Google">Google</option>
                      <option value="Perplexity">Perplexity</option>
                    </select>
                  </div>
                </div>

                <div className="mt-4 flex flex-col gap-3">
                  {filteredExcerpts.length === 0 ? (
                    <div className="rounded-lg border border-border bg-surface-subtle p-8 text-center">
                      <p className="text-xs text-muted-foreground">No answer excerpts match the search filter.</p>
                    </div>
                  ) : (
                    filteredExcerpts.map((excerpt) => (
                      <div
                        key={excerpt.id}
                        className="rounded-lg border border-border bg-surface-subtle p-4 flex flex-col gap-2.5"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="rounded bg-surface px-2 py-0.5 font-mono text-[11px] font-semibold text-foreground border border-border">
                              {excerpt.provider} ({excerpt.model})
                            </span>
                            <SentimentBadge sentiment={excerpt.sentiment} />
                            <ProvenanceBadge provenance={excerpt.provenance} />
                          </div>
                          <span className="font-mono text-[10px] text-muted-foreground">
                            {new Date(excerpt.timestamp).toLocaleDateString(undefined, {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                        </div>

                        <div className="text-xs font-semibold text-foreground">
                          Query: <span className="text-muted-foreground font-normal">"{excerpt.promptText}"</span>
                        </div>

                        <blockquote className="rounded-md border-l-2 border-foreground/30 bg-surface px-3 py-2 text-xs text-foreground/90 italic">
                          "{excerpt.answerExcerpt}"
                        </blockquote>

                        {excerpt.citations && excerpt.citations.length > 0 && (
                          <div className="flex flex-wrap items-center gap-1.5 pt-1">
                            <span className="text-[10px] font-mono text-muted-foreground uppercase">Citations:</span>
                            {excerpt.citations.map((c, i) => (
                              <span
                                key={i}
                                className="rounded bg-surface px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground border border-border/60"
                              >
                                {c}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </Panel>
            </div>
          )}

          {/* TAB 2: Accuracy & Integrity Audit */}
          {activeTab === "accuracy" && (
            <div className="flex flex-col gap-8">
              {/* Accuracy Hero */}
              <Panel>
                <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                  <SectionHeading
                    eyebrow="Integrity Evaluation"
                    title="Brand Factual Accuracy & Hallucination Audit"
                    question="Identified discrepancies where AI systems output hallucinated features, outdated pricing, or omitted core services."
                  />
                  <div className="rounded-xl border border-border bg-surface-subtle p-4 text-center shrink-0 min-w-[200px]">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground block">
                      Overall Accuracy Index
                    </span>
                    <div className="mt-1 flex items-baseline justify-center gap-1">
                      <span className="font-mono text-3xl font-bold text-foreground">
                        {accuracy?.accuracyScore ?? 86.5}
                      </span>
                      <span className="font-mono text-sm text-muted-foreground">/ 100</span>
                    </div>
                    <span className="text-[10px] text-muted-foreground font-mono mt-0.5 block">
                      Grounding integrity benchmark
                    </span>
                  </div>
                </div>
              </Panel>

              {/* Findings List */}
              <div className="flex flex-col gap-4">
                {(accuracy?.findings || []).map((finding) => (
                  <Panel key={finding.id}>
                    <div className="flex flex-col gap-4">
                      {/* Finding Header */}
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex flex-wrap items-center gap-2">
                          <SeverityBadge severity={finding.severity} />
                          <span className="rounded bg-surface-subtle px-2 py-0.5 font-mono text-[10px] font-semibold text-foreground border border-border">
                            {finding.category}
                          </span>
                          <h3 className="text-sm font-bold text-foreground">{finding.title}</h3>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-2 text-xs">
                        <p className="text-muted-foreground leading-relaxed">
                          <strong className="text-foreground">Issue:</strong> {finding.issue}
                        </p>
                        <p className="text-muted-foreground leading-relaxed">
                          <strong className="text-foreground">Impact:</strong> {finding.impact}
                        </p>
                      </div>

                      {/* Evidence Comparison Block */}
                      <div className="rounded-lg border border-border bg-surface-subtle p-3.5 flex flex-col gap-2.5">
                        <div className="flex items-center justify-between pb-1.5 border-b border-border/60">
                          <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                            Query: "{finding.evidence.promptText}" ({finding.evidence.provider} {finding.evidence.model})
                          </span>
                          <ProvenanceBadge provenance={finding.evidence.provenance} />
                        </div>

                        <div className="rounded border border-rose-500/20 bg-rose-500/5 p-2.5 text-xs">
                          <span className="font-mono text-[10px] font-semibold text-rose-600 dark:text-rose-400 block uppercase">
                            Observed Model Answer (Discrepancy)
                          </span>
                          <p className="mt-1 text-foreground/90 italic">"{finding.evidence.excerpt}"</p>
                        </div>
                      </div>

                      {/* Actionable Recommendation */}
                      <div className="rounded-lg border border-primary/20 bg-primary/5 p-3 flex items-start gap-2.5">
                        <Sparkles className="size-4 text-primary shrink-0 mt-0.5" />
                        <div>
                          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-primary block">
                            Prescriptive Remediation
                          </span>
                          <p className="mt-0.5 text-xs text-foreground/90 leading-relaxed">
                            {finding.recommendation}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Panel>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: LLM Engine Presence */}
          {activeTab === "presence" && (
            <div className="flex flex-col gap-8">
              <Panel>
                <SectionHeading
                  eyebrow="Engine Distribution"
                  title="Presence & Share Across AI Foundational Models"
                  question="Breakdown of how frequently your brand appears across ChatGPT, Claude, Gemini, and Perplexity responses."
                />

                <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {(presence?.providerBreakdown || []).map((prov) => (
                    <div
                      key={prov.code}
                      className="rounded-xl border border-border bg-surface-subtle p-5 flex flex-col justify-between gap-4"
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-foreground">{prov.provider}</span>
                          <Bot className="size-4 text-muted-foreground" />
                        </div>

                        <div className="mt-4 flex items-baseline justify-between">
                          <div>
                            <span className="font-mono text-2xl font-bold text-foreground">
                              {prov.visibility.toFixed(1)}%
                            </span>
                            <span className="text-[10px] font-mono text-muted-foreground block">Visibility</span>
                          </div>
                          <div className="text-right">
                            <span className="font-mono text-lg font-semibold text-foreground">
                              #{prov.avgPosition.toFixed(1)}
                            </span>
                            <span className="text-[10px] font-mono text-muted-foreground block">Avg List Rank</span>
                          </div>
                        </div>

                        <div className="mt-3 flex items-center justify-between text-xs pt-3 border-t border-border/60">
                          <span className="font-mono text-muted-foreground text-[10px] uppercase">Mentions</span>
                          <span className="font-mono font-bold text-foreground">{prov.mentions}</span>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-border/40 flex items-center justify-between text-[10px] font-mono text-muted-foreground">
                        <span className="rounded bg-surface px-1.5 py-0.5 border border-border">{prov.status}</span>
                        <ProvenanceBadge provenance="OBSERVED" />
                      </div>
                    </div>
                  ))}
                </div>
              </Panel>
            </div>
          )}

          {/* TAB 4: Competitive Gaps */}
          {activeTab === "gaps" && (
            <div className="flex flex-col gap-8">
              <Panel>
                <SectionHeading
                  eyebrow="Competitive Vulnerability"
                  title="Evidence-Backed Competitive Gaps"
                  question="Queries where key competitors are recommended by AI engines while your brand is omitted or trailing."
                />

                <div className="mt-6 flex flex-col gap-4">
                  {gaps.length === 0 ? (
                    <div className="rounded-lg border border-border bg-surface-subtle p-8 text-center">
                      <p className="text-xs text-muted-foreground">No significant competitive gaps detected.</p>
                    </div>
                  ) : (
                    gaps.map((gap) => (
                      <div
                        key={gap.id}
                        className="rounded-xl border border-border bg-surface-subtle p-5 flex flex-col gap-4"
                      >
                        {/* Gap Header */}
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="rounded bg-primary/10 px-2 py-0.5 font-mono text-[10px] font-semibold text-primary border border-primary/20">
                              {gap.gapType}
                            </span>
                            <h3 className="text-sm font-bold text-foreground">{gap.title}</h3>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="rounded bg-rose-500/10 px-2 py-0.5 font-mono text-xs font-bold text-rose-600 dark:text-rose-400 border border-rose-500/20">
                              +{gap.impactPts.toFixed(1)} pts Impact
                            </span>
                          </div>
                        </div>

                        <p className="text-xs text-muted-foreground leading-relaxed">{gap.description}</p>

                        {/* Head-to-head metrics */}
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          <div className="rounded-lg border border-border bg-surface p-3">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-semibold text-foreground">Competitor: {gap.competitorName}</span>
                              <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                                {gap.evidence.competitorAppeared ? "Appeared" : "Absent"}
                              </span>
                            </div>
                            <span className="text-[10px] font-mono text-muted-foreground block mt-1">
                              Domain: {gap.competitorDomain}
                            </span>
                          </div>

                          <div className="rounded-lg border border-border bg-surface p-3">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-semibold text-foreground">Brand: {brandDisplayName}</span>
                              <span className="font-mono font-bold text-muted-foreground">
                                {gap.evidence.brandAppeared ? "Appeared" : "Omitted"}
                              </span>
                            </div>
                            <span className="text-[10px] font-mono text-muted-foreground block mt-1">
                              Provider: {gap.evidence.provider}
                            </span>
                          </div>
                        </div>

                        {/* AI Evidence Excerpt */}
                        <div className="rounded-lg border border-border/80 bg-surface p-3 text-xs">
                          <div className="flex items-center justify-between pb-1 text-[10px] font-mono text-muted-foreground">
                            <span>Query: "{gap.evidence.promptText}"</span>
                            <ProvenanceBadge provenance="OBSERVED" />
                          </div>
                          <p className="text-foreground/90 italic mt-1">"{gap.evidence.answerExcerpt}"</p>
                        </div>

                        {/* Action Playbook */}
                        <div className="rounded-lg border border-primary/20 bg-primary/5 p-3 flex items-start justify-between gap-3">
                          <div>
                            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-primary block">
                              Prescriptive Countermove
                            </span>
                            <p className="mt-0.5 text-xs text-foreground/90 leading-relaxed font-medium">
                              {gap.actionableMove}
                            </p>
                          </div>
                          <div className="shrink-0 text-right">
                            <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">
                              +{gap.impactPts.toFixed(1)} pts
                            </span>
                            <span className="text-[9px] font-mono text-muted-foreground block">Potential Gain</span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </Panel>
            </div>
          )}
        </>
      )}
    </div>
  );
}
