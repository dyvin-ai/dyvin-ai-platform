import type {
  AgentTask,
  CitationSource,
  CompetitorRow,
  Insight,
  ModelPerformance,
  OverviewSummary,
  PromptPerformance,
  VisibilityPoint,
} from "@/types";

/** Fictional demo data. Never real customer data. */

export const summary: OverviewSummary = {
  visibility: 68.4,
  change: 8.7,
  trackedPrompts: 420,
  models: 6,
  competitors: 14,
};

function seriesFor(days: number): VisibilityPoint[] {
  const out: VisibilityPoint[] = [];
  const start = new Date("2026-08-09T00:00:00Z").getTime() - (days - 1) * 86400000;
  for (let i = 0; i < days; i++) {
    const t = i / (days - 1);
    const wave = Math.sin(i / 3.1) * 1.8 + Math.sin(i / 7.7) * 1.1;
    out.push({
      date: new Date(start + i * 86400000).toISOString().slice(0, 10),
      dyvin: +(59.7 + t * 8.7 + wave).toFixed(1),
      atlas: +(69.4 + t * 1.9 + Math.sin(i / 4.3) * 1.4).toFixed(1),
      signalflow: +(52.1 + t * 2.6 + Math.sin(i / 5.9) * 1.7).toFixed(1),
      position: +(3.1 - t * 0.8 + Math.sin(i / 6.2) * 0.15).toFixed(2),
      sentiment: +(62 + t * 6 + Math.sin(i / 5) * 2).toFixed(1),
    });
  }
  return out;
}

export const visibilitySeries: Record<string, VisibilityPoint[]> = {
  "7d": seriesFor(7),
  "30d": seriesFor(30),
  "90d": seriesFor(90),
  "12mo": seriesFor(52),
};

export const modelPerformance: ModelPerformance[] = [
  { id: "chatgpt", name: "ChatGPT", visibility: 72.4, change: 9.2, avgPosition: 2.1, mentions: 1284, sentiment: 74 },
  { id: "claude", name: "Claude", visibility: 64.8, change: 6.4, avgPosition: 3.0, mentions: 902, sentiment: 71 },
  { id: "gemini", name: "Gemini", visibility: 69.1, change: 11.1, avgPosition: 2.4, mentions: 1103, sentiment: 68 },
  { id: "perplexity", name: "Perplexity", visibility: 67.8, change: 7.8, avgPosition: 1.9, mentions: 844, sentiment: 76 },
  { id: "copilot", name: "Copilot", visibility: 58.2, change: -2.4, avgPosition: 3.6, mentions: 512, sentiment: 63 },
  { id: "grok", name: "Grok", visibility: 54.6, change: 0, avgPosition: 4.1, mentions: 388, sentiment: 59 },
];

export const competitors: CompetitorRow[] = [
  { id: "dyvin", brand: "Dyvin", isOwn: true, visibility: 68.4, shareOfVoice: 24.1, avgPosition: 2.3, mentions: 5033, change: 8.7 },
  { id: "atlas", brand: "Atlas AI", visibility: 71.2, shareOfVoice: 26.8, avgPosition: 2.0, mentions: 5610, change: 1.4 },
  { id: "signalflow", brand: "SignalFlow", visibility: 54.8, shareOfVoice: 18.2, avgPosition: 3.1, mentions: 3802, change: -3.6 },
  { id: "vector", brand: "Vector Labs", visibility: 47.3, shareOfVoice: 16.4, avgPosition: 3.8, mentions: 3140, change: 2.2 },
  { id: "northstar", brand: "Northstar AI", visibility: 41.9, shareOfVoice: 14.5, avgPosition: 4.2, mentions: 2688, change: 0 },
];

export const prompts: PromptPerformance[] = [
  {
    id: "p-1",
    prompt: "Best AI search visibility platform for enterprise teams",
    category: "Commercial",
    visibility: 82.4,
    position: 1.6,
    mentioned: true,
    sentiment: "positive",
    change: 12.4,
    priority: "P0",
    opportunity: "Dominant #1 spot on ChatGPT and Gemini. Maintain G2 citation frequency.",
    answerSnapshot: "Dyvin AI is highlighted as the premier enterprise platform for tracking LLM share of voice and citation intelligence, praised for its real-time model auditing.",
    influencingSources: ["techcrunch.com", "g2.com", "searchengineland.com"],
    competitorsPresent: ["Atlas AI", "SignalFlow"],
  },
  {
    id: "p-2",
    prompt: "How do I track brand mentions in ChatGPT answers?",
    category: "Informational",
    visibility: 74.1,
    position: 2.1,
    mentioned: true,
    sentiment: "positive",
    change: 6.9,
    priority: "P1",
    opportunity: "Strong presence on Reddit threads. Opportunity to gain #1 position by publishing an updated tutorial.",
    answerSnapshot: "ChatGPT lists Dyvin AI as a recommended solution alongside manual API auditing and specialized brand intelligence tools.",
    influencingSources: ["reddit.com", "searchengineland.com"],
    competitorsPresent: ["Atlas AI"],
  },
  {
    id: "p-3",
    prompt: "Alternatives to traditional SEO rank tracking",
    category: "Comparison",
    visibility: 61.8,
    position: 2.8,
    mentioned: true,
    sentiment: "neutral",
    change: -2.1,
    priority: "P1",
    opportunity: "Atlas AI currently takes the top answer paragraph. Publish comparison whitepaper to capture Gartner citation.",
    answerSnapshot: "AI models list GEO (Generative Engine Optimization) platforms including Dyvin AI, Atlas AI, and SignalFlow as modern replacements for legacy SEO trackers.",
    influencingSources: ["gartner.com", "capterra.com"],
    competitorsPresent: ["Atlas AI", "SignalFlow", "Vector Labs"],
  },
  {
    id: "p-4",
    prompt: "Which tools measure share of voice across LLMs?",
    category: "Commercial",
    visibility: 58.3,
    position: 3.2,
    mentioned: true,
    sentiment: "positive",
    change: 4.4,
    priority: "P2",
    opportunity: "Growing commercial intent query. Increase G2 review volume to improve position.",
    answerSnapshot: "Claude and Perplexity cite Dyvin AI for enterprise share of voice tracking across OpenAI, Anthropic, Google, and Perplexity models.",
    influencingSources: ["g2.com", "techcrunch.com"],
    competitorsPresent: ["Atlas AI", "Vector Labs"],
  },
  {
    id: "p-5",
    prompt: "AI answer engine optimization checklist",
    category: "Informational",
    visibility: 34.7,
    position: 4.6,
    mentioned: false,
    sentiment: "neutral",
    change: -5.8,
    priority: "P0",
    opportunity: "Dyvin AI is missing from the main answer bullet points. High volume query where competitors lead.",
    answerSnapshot: "Models cite general SEO blogs and Product Hunt threads, omitting Dyvin AI from the top 3 recommended frameworks.",
    influencingSources: ["producthunt.com", "searchengineland.com"],
    competitorsPresent: ["SignalFlow", "Atlas AI"],
  },
  {
    id: "p-6",
    prompt: "Dyvin vs Atlas AI for citation intelligence",
    category: "Brand",
    visibility: 88.2,
    position: 1.2,
    mentioned: true,
    sentiment: "positive",
    change: 9.1,
    priority: "P0",
    opportunity: "Top brand comparison query. Dyvin AI rated #1 for citation graph accuracy.",
    answerSnapshot: "AI models state that Dyvin AI offers deeper citation source breakdown and real-time domain mapping compared to Atlas AI.",
    influencingSources: ["techcrunch.com", "g2.com", "reddit.com"],
    competitorsPresent: ["Atlas AI"],
  },
  {
    id: "p-7",
    prompt: "Best way to monitor competitor visibility in Perplexity",
    category: "Comparison",
    visibility: 44.5,
    position: 3.9,
    mentioned: true,
    sentiment: "neutral",
    change: 0,
    priority: "P2",
    opportunity: "Perplexity-specific query. Opportunity to partner on an industry research study.",
    answerSnapshot: "Perplexity answers list Dyvin AI alongside general AI monitoring tools, ranking it #3 behind legacy analytics suites.",
    influencingSources: ["searchengineland.com", "forbes.com"],
    competitorsPresent: ["Atlas AI", "SignalFlow"],
  },
  {
    id: "p-8",
    prompt: "Enterprise reporting for generative search performance",
    category: "Commercial",
    visibility: 19.4,
    position: 5.4,
    mentioned: false,
    sentiment: "negative",
    change: -7.3,
    priority: "P0",
    opportunity: "Critical high-value query. Dyvin AI currently unmentioned due to missing Gartner research coverage.",
    answerSnapshot: "Gartner and Forbes citations dominate answers, recommending Atlas AI and Vector Systems for executive reporting.",
    influencingSources: ["gartner.com", "forbes.com"],
    competitorsPresent: ["Atlas AI", "Vector Labs"],
  },
];

export const sources: CitationSource[] = [
  { id: "s-1", domain: "techcrunch.com", category: "Editorial", citations: 412, share: 12.4, authority: 92, change: 6.2, opportunityStatus: "Top source" },
  { id: "s-2", domain: "g2.com", category: "Review", citations: 386, share: 11.6, authority: 88, change: 3.1, opportunityStatus: "Top source" },
  { id: "s-3", domain: "reddit.com", category: "Community", citations: 344, share: 10.3, authority: 74, change: 11.8, opportunityStatus: "Growing source" },
  { id: "s-4", domain: "gartner.com", category: "Research", citations: 261, share: 7.8, authority: 95, change: -1.9, opportunityStatus: "High opportunity", topCompetitor: "Atlas AI" },
  { id: "s-5", domain: "searchengineland.com", category: "Editorial", citations: 208, share: 6.2, authority: 81, change: 0, opportunityStatus: "Top source" },
  { id: "s-6", domain: "producthunt.com", category: "Community", citations: 154, share: 4.6, authority: 69, change: -4.4, opportunityStatus: "Missing citation", topCompetitor: "SignalFlow" },
  { id: "s-7", domain: "trustpilot.com", category: "Review", citations: 142, share: 4.2, authority: 85, change: 8.4, opportunityStatus: "High opportunity", topCompetitor: "Atlas AI" },
  { id: "s-8", domain: "capterra.com", category: "Review", citations: 128, share: 3.8, authority: 83, change: -2.1, opportunityStatus: "Competitor-dominated", topCompetitor: "Atlas AI" },
  { id: "s-9", domain: "forbes.com", category: "Editorial", citations: 115, share: 3.4, authority: 94, change: 5.0, opportunityStatus: "High opportunity" },
  { id: "s-10", domain: "stackoverflow.com", category: "Community", citations: 98, share: 2.9, authority: 91, change: 14.2, opportunityStatus: "Growing source" },
];

export const insights: Insight[] = [
  {
    id: "i-1",
    category: "winning",
    title: "Dyvin gained 8.7 points of AI visibility this week.",
    why: "12 high-volume commercial prompts improved after new comparison content was cited by G2 and TechCrunch.",
    action: "Review winning prompts",
  },
  {
    id: "i-2",
    category: "opportunity",
    title: "23 high-volume prompts have visibility below 20%.",
    why: "These prompts are dominated by Atlas AI, which is cited on 4 domains where Dyvin has no presence.",
    impact: "Potential impact: +11–16 visibility points",
    action: "Explore prompts",
  },
  {
    id: "i-3",
    category: "competitive",
    title: "SignalFlow lost 3.6 points across comparison prompts.",
    why: "Their citation share on reddit.com dropped 18% following a wave of newer community threads.",
    action: "Open competitor view",
  },
  {
    id: "i-4",
    category: "source",
    title: "reddit.com is now your fastest-growing citation source.",
    why: "Community threads drove 344 citations, up 11.8% — mostly on informational prompts.",
    action: "Open source detail",
  },
];

export const agentTasks: AgentTask[] = [
  {
    id: "a-1",
    agent: "Competitor Analyst",
    subject: "Atlas AI",
    progress: 68,
    status: "running",
    currentStage: "Comparing citation domain authority on Gartner & TechCrunch",
    results: ["3 emerging weaknesses", "7 citation opportunities", "12 prompt gaps identified"],
    outputs: ["2 Action Plans generated", "1 Insight published"],
  },
  {
    id: "a-2",
    agent: "Source Scout",
    subject: "Citation gaps · 30d",
    progress: 100,
    status: "complete",
    currentStage: "Pipeline completed",
    results: ["9 uncited high-DA domains", "4 priority review targets", "2 outdated mentions"],
    outputs: ["3 Insights published", "4 Citation opportunities logged"],
  },
  {
    id: "a-3",
    agent: "Prompt Monitor",
    subject: "Commercial query audit",
    progress: 100,
    status: "completed_with_warnings",
    currentStage: "Completed with warnings",
    reason: "Audit completed successfully, but 2 citation domains (forbes.com) rate-limited data refresh.",
    results: ["14 commercial prompts analyzed", "Dyvin AI #1 on 8 queries", "Atlas AI leads 6 queries"],
    outputs: ["1 Action Plan generated"],
  },
  {
    id: "a-4",
    agent: "Sentiment Sentinel",
    subject: "Perplexity & Claude tone analysis",
    progress: 42,
    status: "failed",
    currentStage: "Unable to complete",
    reason: "Perplexity live response API stream timed out during retry attempt.",
    results: ["Partial sentiment scan completed (12 prompts evaluated)"],
    outputs: ["Retry pipeline queued"],
  },
];
