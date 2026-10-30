/**
 * Dyvin AI — Formal Prioritization Scoring Engine
 * Computes deterministic, explainable priority scores:
 * Score = (Impact × Reach × Confidence × Urgency) / Effort
 * Normalized to range [0, 100].
 */

export interface PriorityFactors {
  impact: 1 | 2 | 3 | 4 | 5;       // 1 (Low) to 5 (Transformative)
  reach: number;                   // Number of affected prompts (e.g. 1 - 100)
  confidence: 0.6 | 0.8 | 1.0;     // 0.6 (Low), 0.8 (Medium), 1.0 (High)
  urgency: 1 | 2 | 3;              // 1 (Standard), 2 (High), 3 (Immediate Competitive Threat)
  effort: 1 | 2 | 3 | 4 | 5;       // 1 (Low effort / quick win) to 5 (High engineering effort)
}

export interface PriorityScoreResult {
  score: number;                   // 0 - 100
  rating: "P0" | "P1" | "P2" | "P3";
  explanation: string;
}

export function calculatePriorityScore(factors: PriorityFactors): PriorityScoreResult {
  const { impact, reach, confidence, urgency, effort } = factors;

  // Safe divisor guard
  const safeEffort = Math.max(1, effort);

  // Normalize reach on log scale so 100 prompts doesn't explode the formula
  const normalizedReach = Math.min(5, Math.max(1, Math.log2(Math.max(1, reach)) + 1));

  // Raw calculation: Max raw = (5 * 5 * 1.0 * 3) / 1 = 75
  const rawScore = (impact * normalizedReach * confidence * urgency) / safeEffort;

  // Map to 0-100 scale with ceiling at 98 for realistic humility
  const score = Math.min(98, Math.max(15, Math.round((rawScore / 75) * 100)));

  let rating: "P0" | "P1" | "P2" | "P3" = "P3";
  if (score >= 90) rating = "P0";
  else if (score >= 75) rating = "P1";
  else if (score >= 50) rating = "P2";

  const explanation = `${factors.impact >= 4 ? "High" : "Standard"} business impact × ${reach} affected queries × ${Math.round(confidence * 100)}% evidence confidence ÷ ${effort <= 2 ? "low" : "moderate"} effort`;

  return {
    score,
    rating,
    explanation,
  };
}
