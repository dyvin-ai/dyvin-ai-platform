import type { ActionPlanItem } from "@/components/drawers/ActionPlanDrawer";

export interface DecisionItem {
  id: string;
  rank: number;
  title: string;
  situation: string;
  impactCategory: "Strategic" | "High" | "Medium" | "Low";
  priorityScore: number;
  whyScore: string;
  evidenceChain: {
    affectedPromptsCount: number;
    modelsAnalyzedCount: number;
    citationGapsCount: number;
    leadingCompetitor: string;
    gapPts: number;
  };
  recommendedMove: string;
  expectedMetric: string;
  baselineValue: string;
  targetValue: string;
  gapValue: string;
  confidence: "High" | "Medium" | "Low";
  evidenceRoute: string;
  actionPlanId?: string;
}

export const activeDecisions: DecisionItem[] = [
  {
    id: "dec-1",
    rank: 1,
    title: "Close Atlas AI's commercial prompt gap on Gartner & Forbes",
    situation: "Atlas AI acquired 4 new citations on Gartner and Forbes, taking top answer slots on 23 commercial comparison queries.",
    impactCategory: "Strategic",
    priorityScore: 94,
    whyScore: "High commercial buyer intent × 23 affected prompts × 4 authoritative citation gaps",
    evidenceChain: {
      affectedPromptsCount: 23,
      modelsAnalyzedCount: 6,
      citationGapsCount: 4,
      leadingCompetitor: "Atlas AI",
      gapPts: 8.4,
    },
    recommendedMove: "Publish an updated enterprise AI visibility whitepaper on Gartner and Capterra.",
    expectedMetric: "Commercial Prompt Visibility",
    baselineValue: "61.2%",
    targetValue: "68.0%",
    gapValue: "+6.8 pts",
    confidence: "High",
    evidenceRoute: "/competitors",
    actionPlanId: "ap-overview-1",
  },
  {
    id: "dec-2",
    rank: 2,
    title: "Capture missing review citations on Product Hunt & Capterra",
    situation: "Dyvin AI is missing from 14 high-authority review threads cited by Claude and Perplexity.",
    impactCategory: "High",
    priorityScore: 88,
    whyScore: "High authority domain presence × 14 missing citations × competitor-dominated threads",
    evidenceChain: {
      affectedPromptsCount: 14,
      modelsAnalyzedCount: 4,
      citationGapsCount: 2,
      leadingCompetitor: "SignalFlow",
      gapPts: 5.2,
    },
    recommendedMove: "Submit product profile and encourage user reviews on Capterra & Product Hunt.",
    expectedMetric: "Informational Prompt Visibility",
    baselineValue: "74.1%",
    targetValue: "80.0%",
    gapValue: "+5.9 pts",
    confidence: "High",
    evidenceRoute: "/sources",
  },
  {
    id: "dec-3",
    rank: 3,
    title: "Protect ChatGPT #1 position on enterprise prompt queries",
    situation: "Dyvin AI ranks #1.6 on ChatGPT for core brand queries, but position dropped on 4 comparison queries.",
    impactCategory: "High",
    priorityScore: 82,
    whyScore: "Defensive protection × 4 declining prompts × high ChatGPT answer share",
    evidenceChain: {
      affectedPromptsCount: 4,
      modelsAnalyzedCount: 1,
      citationGapsCount: 1,
      leadingCompetitor: "Atlas AI",
      gapPts: 2.1,
    },
    recommendedMove: "Update comparison documentation and refresh TechCrunch editorial press citations.",
    expectedMetric: "ChatGPT Average Rank",
    baselineValue: "#2.1",
    targetValue: "#1.6",
    gapValue: "+0.5 rank",
    confidence: "Medium",
    evidenceRoute: "/prompts",
  },
];

export const previousRecommendations = [
  {
    id: "rec-prev-1",
    recommendation: "Strengthen G2 comparison review coverage",
    completedDate: "July 24, 2026",
    result: "+3.1 pts commercial visibility",
    outcomeStatus: "Effective",
    targetMetric: "Commercial Visibility (79.3% → 82.4%)",
  },
  {
    id: "rec-prev-2",
    recommendation: "Publish Reddit technical tracking guide",
    completedDate: "August 2, 2026",
    result: "+6.9 pts informational prompt growth",
    outcomeStatus: "Effective",
    targetMetric: "Informational Visibility (67.2% → 74.1%)",
  },
];
