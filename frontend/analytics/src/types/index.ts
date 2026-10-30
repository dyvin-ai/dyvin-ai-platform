/**
 * Dyvin AI — Formal Domain Model Types
 * Single source of truth for all domain entities, relationships, and API contracts.
 */

// Stable Entity Identifiers
export type WorkspaceId = string;
export type BrandId = string;
export type PromptId = string;
export type ModelId = "chatgpt" | "claude" | "gemini" | "perplexity" | "copilot" | "grok";
export type CompetitorId = string;
export type SourceId = string;
export type InsightId = string;
export type DecisionId = string;
export type ActionPlanId = string;
export type AgentTaskId = string;
export type ScanId = string;
export type ReportId = string;
export type NotificationId = string;

// Workspace & Tenancy
export interface Workspace {
  id: WorkspaceId;
  name: string;
  domain: string;
  brandName: string;
  industry: string;
  createdAt: string;
  updatedAt: string;
  plan: "starter" | "growth" | "enterprise";
  status: "active" | "trial" | "suspended";
  latestScanId?: ScanId | undefined;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string | null | undefined;
  role?: string | undefined;
}

export interface ProjectWebsite {
  id: string;
  url: string;
  domain: string;
  subdomain?: string | null | undefined;
  isPrimary: boolean;
  verificationStatus?: string | undefined;
}

export interface Project {
  id: string;
  name: string;
  slug: string;
  primaryDomain?: string | undefined;
  organizationId: string;
  websites?: ProjectWebsite[] | undefined;
  createdAt?: string | undefined;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn?: number | undefined;
}

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isEmailVerified?: boolean | undefined;
  avatarUrl?: string | null | undefined;
  memberships?: {
    role: string;
    organization: Organization;
  }[] | undefined;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: "owner" | "admin" | "analyst" | "viewer" | string;
  avatarUrl?: string | null | undefined;
}

export interface AuthResponse {
  user: AuthUser;
  tokens: AuthTokens;
}

export interface WorkspaceMembership {
  userId: string;
  workspaceId: WorkspaceId;
  role: User["role"];
  permissions: string[];
}

// Brand
export interface Brand {
  id: BrandId;
  name: string;
  isOwn?: boolean | undefined;
}

// Visibility & Time Series
export interface VisibilityPoint {
  date: string;
  dyvin: number;
  atlas: number;
  signalflow: number;
  position: number;
  sentiment: number;
}

export interface OverviewSummary {
  visibility: number;
  change: number;
  trackedPrompts: number;
  models: number;
  competitors: number;
  shareOfVoice?: number | undefined;
  avgPosition?: number | undefined;
  mentions?: number | undefined;
  sentiment?: number | undefined;
  lastUpdatedAt?: string | undefined;
  scanId?: ScanId | undefined;
}

// AI Models
export interface AIModel {
  id: ModelId;
  name: string;
  provider: string;
  status: "active" | "degraded" | "inactive";
}

export interface ModelPerformance {
  id: ModelId;
  name: string;
  visibility: number;
  change: number;
  avgPosition: number;
  mentions: number;
  sentiment: number;
  provider?: string | undefined;
  strongestArea?: string | undefined;
  weakestArea?: string | undefined;
}

export interface ModelGapAnalysis {
  name: string;
  vis: string;
  rank: string;
  trend: string;
  weakness: string;
  strat: string;
}

// Prompts & Clusters
export interface PromptPerformance {
  id: PromptId;
  prompt: string;
  category: "Commercial" | "Informational" | "Comparison" | "Brand" | string;
  visibility: number;
  position: number;
  mentioned: boolean;
  sentiment: "positive" | "neutral" | "negative";
  change: number;
  priority?: "P0" | "P1" | "P2" | "P3" | undefined;
  opportunity?: string | undefined;
  answerSnapshot?: string | undefined;
  influencingSources?: string[] | undefined;
  competitorsPresent?: string[] | undefined;
  clusterId?: string | undefined;
  importance?: "Strategic" | "High" | "Medium" | "Low" | undefined;
}

export interface PromptCluster {
  id: string;
  name: string;
  promptCount: number;
  visibility: number;
  leadingCompetitor: string;
  weakestModel: string;
  citationGap: string;
  trend: number;
  recommendation: string;
}

export interface PromptAnswer {
  promptId: PromptId;
  modelId: ModelId;
  scanId: ScanId;
  answerText: string;
  brandPresence: boolean;
  brandPosition?: number | undefined;
  competitorMentions: string[];
  citations: string[];
  sentiment: "positive" | "neutral" | "negative";
  timestamp: string;
}

// Competitors
export interface CompetitorRow {
  id: CompetitorId;
  brand: string;
  isOwn?: boolean | undefined;
  visibility: number;
  shareOfVoice: number;
  avgPosition: number;
  mentions: number;
  change: number;
  overlapPrompts?: string[] | undefined;
  citationGaps?: { domain: string; authority: number; status: string }[] | undefined;
  vulnerabilities?: string[] | undefined;
}

// Citation Sources
export interface CitationSource {
  id: SourceId;
  domain: string;
  category?: "Editorial" | "Community" | "Review" | "Research" | "Industry" | "Corporate" | undefined;
  citations: number;
  share: number;
  authority: number;
  change: number;
  opportunityStatus?: "High opportunity" | "Competitor-dominated" | "Missing citation" | "Growing source" | "Top source" | undefined;
  topCompetitor?: string | undefined;
  influencedCategories?: { category: string; percentage: number }[] | undefined;
  recommendedMove?: string | undefined;
}

// Insights
export interface InsightEvidence {
  currentScore?: number;
  previousScore?: number;
  delta?: number;
  affectedPrompts?: string[];
  affectedCompetitors?: string[];
  affectedDomains?: string[];
  affectedModels?: string[];
  competitorBrand?: string;
  competitorScore?: number;
  gap?: number;
  totalPrompts?: number;
  unmentionedCount?: number;
  highAuthorityCount?: number;
  weakestModel?: string;
  weakestScore?: number;
  bestModel?: string;
  bestScore?: number;
  spread?: number;
  sentimentScore?: number;
}

export interface Insight {
  id: string;
  type?: 'VISIBILITY' | 'PROMPT_COVERAGE' | 'COMPETITOR' | 'CITATION' | 'MODEL_PERFORMANCE' | 'SENTIMENT' | 'CONTENT_AUTHORITY' | 'TECHNICAL_TRUST';
  category: "winning" | "losing" | "opportunity" | "competitive" | "source" | "prompt";
  severity?: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';
  title: string;
  summary?: string;
  why: string;
  action: string;
  evidence?: InsightEvidence;
  impact?: string | undefined;
  confidence?: "High" | "Medium" | "Low" | undefined;
  status?: "new" | "investigating" | "action_created" | "monitoring" | "resolved" | "expired" | "dismissed" | undefined;
  recommendation?: string;
  source?: string;
  route?: string;
  provenance?: 'LIVE' | 'DETERMINISTIC_FALLBACK' | 'DERIVED';
  createdAt?: string | undefined;
  evidenceIds?: string[] | undefined;
}

// Strategy & Priority Actions
export interface StrategyAction {
  id: string;
  title: string;
  description: string;
  category: 'Competitor' | 'Prompts' | 'Citations' | 'Visibility' | 'Technical';
  priority: 'P0' | 'P1' | 'P2' | 'P3';
  status: 'RECOMMENDED' | 'IN_PROGRESS' | 'COMPLETED' | 'DISMISSED';
  impactScore: number;
  effortScore: number;
  effort: 'Low' | 'Medium' | 'High';
  confidence: 'High' | 'Medium' | 'Low';
  expectedGain: string;
  sourceInsightId: string;
  affectedPrompts: string[];
  affectedDomains: string[];
  affectedCompetitors: string[];
  affectedModels: string[];
  destinationRoute: string;
  createdAt: string;
}

export interface ExecutiveRecommendation {
  headline: string;
  situation: string;
  recommendedMove: string;
  expectedMetric: string;
  priority: 'P0' | 'P1' | 'P2';
  confidence: 'High' | 'Medium' | 'Low';
  effort: 'Low' | 'Medium' | 'High';
  destinationRoute: string;
}

export interface StrategyOverview {
  executiveRecommendation: ExecutiveRecommendation | null;
  actions: StrategyAction[];
  summary: {
    totalActions: number;
    highPriorityCount: number;
    estimatedPointGain: number;
    provenance: 'LIVE' | 'DETERMINISTIC_FALLBACK' | 'DERIVED';
  };
  provenance: 'LIVE' | 'DETERMINISTIC_FALLBACK' | 'DERIVED';
}

// Decisions
export interface DecisionItem {
  id: DecisionId;
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
  actionPlanId?: ActionPlanId | undefined;
  createdAt?: string | undefined;
  updatedAt?: string | undefined;
}

// Action Plans
export interface ActionPlanItem {
  id: ActionPlanId;
  workspaceId?: WorkspaceId | undefined;
  title: string;
  goal: string;
  evidence: string;
  priority: "P0" | "P1" | "P2" | "P3";
  impact: "High" | "Medium" | "Low";
  effort: "Low" | "Medium" | "High";
  targetMetric: string;
  baseline?: string | undefined;
  target?: string | undefined;
  gap?: string | undefined;
  status: "Not started" | "In progress" | "Complete";
  outcomeStatus?: "Effective" | "Neutral" | "Negative" | "Inconclusive" | "Measurement pending" | string | undefined;
  owner?: string | undefined;
  sourceInsightId?: string | undefined;
  suggestedQueries?: string[] | undefined;
  suggestedSources?: string[] | undefined;
  steps?: Array<{ id: string; text: string; done: boolean }> | undefined;
  createdAt?: string | undefined;
  updatedAt?: string | undefined;
  completedAt?: string | undefined;
}

// Recommendation Outcomes (Learning Loop)
export interface RecommendationOutcome {
  id: string;
  recommendation: string;
  completedDate: string;
  result: string;
  outcomeStatus: "Effective" | "Neutral" | "Negative" | "Inconclusive" | "Measurement pending" | string;
  targetMetric: string;
}

// Autonomous Agents
export interface AgentRunResult {
  id: string;
  agentId: string;
  organizationId: string;
  projectId: string;
  status: "COMPLETED" | "FAILED" | "PARTIAL";
  progress: number;
  startedAt: string;
  completedAt: string;
  finding: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | "INFO";
  evidence: Record<string, any>;
  recommendation: string;
  relatedRoute: string;
  relatedInsightId?: string;
  relatedStrategyActionId?: string;
  provenance: "LIVE" | "DETERMINISTIC_FALLBACK" | "DERIVED";
  notificationDispatched: boolean;
}

export interface AgentDefinition {
  id: string;
  name: string;
  type: "VISIBILITY" | "COMPETITOR" | "CITATION" | "PROMPT" | "MODEL" | "STRATEGY";
  description: string;
  schedule: string;
  icon: string;
  subject: string;
  enabled: boolean;
  status: "ACTIVE" | "PAUSED" | "ERROR" | "DRAFT";
  lastRunAt?: string;
  nextRunAt?: string;
  lastResult?: AgentRunResult | null;
  provenance: "LIVE" | "DETERMINISTIC_FALLBACK" | "DERIVED";
}

export interface AgentTask {
  id: AgentTaskId;
  agent: string;
  subject: string;
  progress: number;
  status: "running" | "complete" | "completed_with_warnings" | "failed";
  reason?: string | undefined;
  currentStage?: string | undefined;
  results: string[];
  outputs?: string[] | undefined;
  lastRunAt?: string | undefined;
}

// Scans
export interface ScanStatus {
  id: ScanId;
  workspaceId: WorkspaceId;
  status: "queued" | "running" | "completed" | "completed_with_warnings" | "failed" | "cancelled";
  promptCount: number;
  modelCoverage: number;
  startedAt: string;
  completedAt?: string | undefined;
  freshnessPercentage: number;
  lastScannedMinutesAgo: number;
  error?: string | undefined;
}

export interface VisibilityBaselineState {
  jobId: string;
  organizationId: string;
  projectId: string;
  status: 'NOT_STARTED' | 'SCANNING' | 'READY' | 'PARTIAL' | 'FAILED';
  stage: 'IDLE' | 'VALIDATING_DOMAIN' | 'ANALYZING_WEBSITE' | 'GENERATING_PROMPTS' | 'EXECUTING_AI' | 'ANALYZING_RESPONSES' | 'CALCULATING_SCORE' | 'FINALIZING' | 'COMPLETED' | 'FAILED';
  progress: number;
  brandName: string;
  domain: string;
  visibilityScore: number | null;
  provenance: 'LIVE' | 'DETERMINISTIC_FALLBACK' | 'SEEDED' | 'UNKNOWN' | 'NONE';
  providerCoverage: {
    available: number;
    measured: number;
    total: number;
    providers: Array<{
      code: string;
      name: string;
      status: 'LIVE' | 'UNAVAILABLE' | 'DETERMINISTIC_FALLBACK';
      executionsCount: number;
    }>;
  };
  promptsTotal: number;
  promptsCompleted: number;
  lastScannedAt?: string;
  error?: string;
}

export interface OverviewResponse {
  baseline: {
    status: 'NOT_STARTED' | 'SCANNING' | 'READY' | 'PARTIAL' | 'FAILED';
    stage?: string;
    progress?: number;
    score: number | null;
    lastScannedAt?: string;
    provenance: 'LIVE' | 'DETERMINISTIC_FALLBACK' | 'SEEDED' | 'UNKNOWN' | 'NONE';
    brandName: string;
    domain: string;
  };
  visibility: {
    score: number | null;
    change: number;
    trend: 'RISING' | 'STABLE' | 'DECLINING';
    shareOfVoice: number;
    avgPosition: number;
    mentions: number;
    sentiment: number;
  };
  providers: {
    total: number;
    live: number;
    partial: boolean;
    items: ModelPerformance[];
  };
  prompts: {
    total: number;
    tracked: number;
    mentioned: number;
    averageVisibility: number;
    items: PromptPerformance[];
    topOpportunity?: string;
  };
  competitors: {
    tracked: number;
    leader: string;
    brandPosition: number;
    visibilityGap: number;
    items: CompetitorRow[];
  };
  citations: {
    sources: number;
    citations: number;
    averageAuthority: number;
    citationGapCount: number;
    topSources: Array<{
      id: string;
      domain: string;
      authority: number;
      citations: number;
      share: number;
      change: number;
    }>;
  };
  timeline: VisibilityPoint[];
  decisions: DecisionItem[];
  outcomes: RecommendationOutcome[];
  alerts: Array<{
    id: string;
    type: string;
    severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';
    title: string;
    description: string;
    createdAt: string;
    source: string;
    destination?: string;
  }>;
  recentActivity: Array<{
    id: string;
    type: string;
    title: string;
    description: string;
    timestamp: string;
  }>;
}

// Reports
export type ReportType = "EXECUTIVE" | "AI_VISIBILITY" | "COMPETITIVE" | "CITATION" | "PROMPT" | "CUSTOM";
export type ReportStatus = "QUEUED" | "GENERATING" | "COMPLETED" | "FAILED";
export type ExportFormat = "PDF" | "CSV" | "JSON";
export type ExportStatus = "QUEUED" | "PROCESSING" | "COMPLETED" | "FAILED";

export interface ReportSnapshot {
  reportId: string;
  organizationId: string;
  projectId: string;
  projectName: string;
  type: ReportType;
  period: {
    start: string;
    end: string;
    days: number;
  };
  generatedAt: string;
  provenance: string;
  status: ReportStatus;
  summary: {
    visibilityScore: number;
    visibilityChange: number;
    competitorPosition: number;
    citationSources: number;
    trackedPrompts: number;
  };
  executiveNarrative: string;
  visibility?: {
    overallScore: number;
    components?: {
      knowledge: number;
      authority: number;
      technical: number;
      trust: number;
    };
    trend?: Array<{ date: string; score: number }>;
  };
  competitors?: Array<{
    name: string;
    visibilityScore: number;
    shareOfVoice: number;
    rank: number;
    gap: number;
  }>;
  citations?: {
    totalSources: number;
    authorityTiers?: Record<string, number>;
    topDomains?: Array<{ domain: string; authority: number; citations: number }>;
    missingDomains?: string[];
  };
  prompts?: {
    totalTracked: number;
    topPrompts?: Array<{ query: string; visibility: number; sentiment: string }>;
  };
  models?: Array<{ name: string; score: number; rank: number; status: string }>;
  insights?: Array<{
    id: string;
    title: string;
    finding: string;
    severity: string;
    evidence: Record<string, any>;
  }>;
  strategy?: {
    recommendation: string;
    actions: Array<{
      id: string;
      title: string;
      priority: string;
      impact: string;
      effort: string;
      status: string;
    }>;
  };
  agentEvents?: Array<{
    agentName: string;
    type: string;
    severity: string;
    finding: string;
  }>;
  dataQuality?: {
    overall: string;
    liveProviders: number;
    fallbackProviders: number;
    unavailableProviders: number;
    missingSections: string[];
    observationCount: number;
  };
  checksum?: string;
}

export interface ReportItem {
  id: string;
  projectId: string;
  title: string;
  reportType: ReportType;
  status: ReportStatus;
  summary?: string;
  dataPayload?: ReportSnapshot;
  generatedBy?: string;
  createdAt: string;
  updatedAt: string;
  sections?: Array<{
    id: string;
    title: string;
    orderIndex: number;
    contentBody: any;
  }>;
  exports?: ExportJobItem[];
}

export interface ExportJobItem {
  id: string;
  reportId: string;
  format: ExportFormat;
  status: ExportStatus;
  downloadUrl?: string;
  fileSizeBytes: number;
  createdAt: string;
  completedAt?: string;
}

export interface GenerateReportPayload {
  projectId: string;
  reportType?: ReportType;
  title?: string;
  periodDays?: number;
  periodStart?: string;
  periodEnd?: string;
}

export interface ReportSummary {
  id: ReportId;
  workspaceId?: WorkspaceId | undefined;
  title: string;
  date: string;
  slides: number;
  author: string;
  summary: string;
  highlights: string[];
  sourceRoute: string;
  generatedAt?: string | undefined;
  sourceScanId?: ScanId | undefined;
  status?: "ready" | "generating" | "outdated" | "failed" | undefined;
}

// Notifications
export interface NotificationItem {
  id: NotificationId;
  workspaceId?: WorkspaceId | undefined;
  title: string;
  body: string;
  time: string;
  priority: "Critical" | "Important" | "Informational";
  actionLabel: string;
  actionRoute: string;
  deduplicationKey?: string | undefined;
  read?: boolean | undefined;
  createdAt?: string | undefined;
}

// Normalized Application Error Model
export interface AppError {
  code:
    | "UNAUTHORIZED"
    | "FORBIDDEN"
    | "NOT_FOUND"
    | "VALIDATION_ERROR"
    | "RATE_LIMITED"
    | "PROVIDER_ERROR"
    | "SCAN_FAILED"
    | "NETWORK_ERROR"
    | "INTERNAL_ERROR";
  message: string;
  status?: number | undefined;
  retryable?: boolean | undefined;
  details?: Record<string, unknown> | undefined;
}

// Pagination & Filtering
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasNextPage: boolean;
}

export interface FilterParams {
  dateRange?: "7d" | "30d" | "90d" | "12mo" | string | undefined;
  modelIds?: ModelId[] | undefined;
  categories?: string[] | undefined;
  competitors?: string[] | undefined;
  status?: string | undefined;
  search?: string | undefined;
  limit?: number | undefined;
}

// Brand Intelligence & Competitive Intelligence (F7)
export interface BrandProfileData {
  brandName: string;
  domain: string;
  description: string | null;
  industry: string;
  businessSize?: string | null;
  status: string;
  products: Array<{ id: string; name: string; description?: string | null; price?: string | null }>;
  services: Array<{ id: string; name: string; description?: string | null }>;
  entities: Array<{ id: string; name: string; type: string; confidence: number; verificationState: string }>;
  attributes: Array<{ label: string; value: string; source: string; verified: boolean }>;
}

export interface BrandUnderstandingData {
  totalAnswersAnalyzed: number;
  totalMentions: number;
  mentionRate: number;
  positioningStatement: string;
  associatedTopics: Array<{ topic: string; mentions: number; percentage: number }>;
  associatedProducts: Array<{ name: string; status: 'OBSERVED_IN_ANSWERS' | 'CATALOG_ONLY' | 'OMITTED_IN_SEARCH'; mentionCount: number }>;
  answerExcerpts: Array<{
    id: string;
    promptText: string;
    category: string;
    provider: string;
    model: string;
    answerExcerpt: string;
    sentiment: 'positive' | 'neutral' | 'negative' | 'unknown';
    position: number | null;
    brandMentioned: boolean;
    citations: string[];
    timestamp: string;
    provenance: 'OBSERVED' | 'DERIVED' | 'AI-GENERATED' | 'UNAVAILABLE';
  }>;
}

export interface BrandAccuracyFinding {
  id: string;
  title: string;
  severity: 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';
  category: 'MISSING_PRODUCT' | 'CONFLICTING_DESCRIPTION' | 'OMITTED_MENTION' | 'SENTIMENT_FRICTION' | 'OUTDATED_INFO';
  issue: string;
  impact: string;
  recommendation: string;
  evidence: {
    promptText: string;
    provider: string;
    model: string;
    excerpt: string;
    timestamp: string;
    provenance: 'OBSERVED' | 'DERIVED' | 'AI-GENERATED';
  };
}

export interface BrandAccuracyData {
  accuracyScore: number;
  totalAuditedPrompts: number;
  verifiedConsistentCount: number;
  findings: BrandAccuracyFinding[];
}

export interface BrandPresenceData {
  visibilityScore: number;
  shareOfVoice: number;
  avgPosition: number;
  totalMentions: number;
  sentimentBreakdown: { positive: number; neutral: number; negative: number };
  providerBreakdown: Array<{
    provider: string;
    code: string;
    visibility: number;
    mentions: number;
    avgPosition: number;
    sentiment: number;
    status: 'LIVE' | 'DETERMINISTIC_FALLBACK' | 'UNAVAILABLE';
  }>;
  citationDomains: Array<{ domain: string; authority: number; citations: number }>;
}

export interface CompetitiveGapItem {
  id: string;
  competitorName: string;
  competitorDomain: string;
  gapType: 'PROMPT_ABSENCE' | 'CITATION_GAP' | 'MODEL_WEAKNESS' | 'TOPIC_GAP';
  title: string;
  description: string;
  evidence: {
    promptText: string;
    competitorAppeared: boolean;
    brandAppeared: boolean;
    provider: string;
    answerExcerpt: string;
    timestamp: string;
  };
  actionableMove: string;
  impactPts: number;
}

export interface BrandIntelligenceResponse {
  profile: BrandProfileData;
  understanding: BrandUnderstandingData;
  accuracy: BrandAccuracyData;
  presence: BrandPresenceData;
  competitiveGaps: CompetitiveGapItem[];
  provenance: 'OBSERVED' | 'DERIVED' | 'AI-GENERATED' | 'UNAVAILABLE';
  lastScannedAt: string;
}

// Website Intelligence & Scanner Types
export type ScanStatusType = 'QUEUED' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';

export interface ScanPageItem {
  id: string;
  url: string;
  statusCode: number;
  contentType: string | null;
  title: string | null;
  metaDescription: string | null;
  wordCount: number;
  readingTime: number;
  language: string | null;
  canonicalUrl: string | null;
  depth: number;
  createdAt: string;
}

export interface ScanMetadataItem {
  id: string;
  scanPageId: string;
  key: string;
  value: string;
  createdAt: string;
  scanPage?: {
    url: string;
    title: string | null;
  };
}

export interface StructuredDataItem {
  id: string;
  scanPageId: string;
  type: string;
  rawJson: Record<string, any>;
  createdAt: string;
  scanPage?: {
    url: string;
    title: string | null;
  };
}

export interface TechnologyItem {
  id: string;
  scanId: string;
  name: string;
  category: string;
  version: string | null;
  confidence: number;
  scanPage?: {
    url: string;
  };
}

export interface ScanItem {
  id: string;
  projectId: string;
  websiteId: string;
  status: ScanStatusType;
  pagesDiscovered: number;
  pagesCrawled: number;
  startedAt: string | null;
  completedAt: string | null;
  errorMessage: string | null;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  project?: {
    id: string;
    name: string;
    primaryDomain: string | null;
    organizationId?: string;
  };
  website?: {
    id: string;
    url: string;
    domain: string;
  };
  _count?: {
    pages: number;
    assets: number;
    technologies: number;
    securityFindings: number;
  };
}

// Billing & Subscription Platform
export type PlanTier = "FREE" | "STARTER" | "GROWTH" | "PROFESSIONAL" | "ENTERPRISE";
export type SubscriptionStatusType = "INCOMPLETE" | "TRIALING" | "ACTIVE" | "PAST_DUE" | "CANCELED" | "UNPAID";

export interface SubscriptionFeature {
  id: string;
  name: string;
  description?: string | null;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  code: string;
  description?: string | null;
  priceMonthly: number;
  priceYearly: number;
  currency: string;
  isActive: boolean;
  features?: SubscriptionFeature[];
}

export interface OrganizationSubscription {
  id: string;
  organizationId: string;
  planId: string;
  status: SubscriptionStatusType;
  interval: "MONTHLY" | "YEARLY";
  providerCode: "STRIPE" | "RAZORPAY" | "MOCK";
  externalSubId?: string | null;
  currentPeriodStart?: string;
  currentPeriodEnd?: string;
  cancelAtPeriodEnd?: boolean;
  canceledAt?: string | null;
  trialEndsAt?: string | null;
  plan?: SubscriptionPlan;
}

export interface SubscriptionState {
  hasSubscription: boolean;
  subscription: OrganizationSubscription | null;
}

export interface UsageMetric {
  id: string;
  organizationId: string;
  metricType: "SCANS" | "AI_REQUESTS" | "STORAGE_BYTES" | "REPORTS" | string;
  monthlyLimit: number;
  currentUsage: number;
  resetAt?: string;
}

export interface InvoiceItem {
  id: string;
  organizationId?: string;
  subscriptionId?: string | null;
  invoiceNumber: string;
  amount: number;
  currency: string;
  status: string;
  invoiceUrl?: string | null;
  pdfUrl?: string | null;
  dueDate?: string | null;
  paidAt?: string | null;
  createdAt?: string;
}

// AI Understanding & Trust Intelligence Platform Types (Phase F9)
export interface AiResponseLedgerItem {
  id: string;
  organizationId?: string;
  modelName: string;
  promptText: string;
  responseText: string;
  understandingScore: number;
  trustScore: number;
  hallucinationDetected: boolean;
  executedAt: string;
}

export interface AiCitationLedgerItem {
  id: string;
  domain: string;
  url: string;
  relevanceScore: number;
  authorityScore: number;
  createdAt: string;
}

export interface HallucinationRecord {
  id: string;
  modelName: string;
  claimSnippet: string;
  actualTruth: string;
  severity: "HIGH" | "MEDIUM" | "LOW" | "INFO";
  verificationStatus: "FLAGGED" | "VERIFIED_CORRECTED" | "DISMISSED";
  category?: string;
  detectedAt?: string;
}

export interface MissingKnowledgeGapItem {
  id: string;
  topic: string;
  missingAttribute: string;
  impactScore: number;
  affectedModels: string[];
}

export interface ModelPerformanceMetric {
  model: string;
  visibilityScore: number;
  citationRate: number;
  avgLatencyMs: number;
}

export interface CrossModelStats {
  models: ModelPerformanceMetric[];
}

export interface WarehouseStats {
  totalStoredResponses: number;
  totalStoredCitations: number;
  totalPredictionsGenerated: number;
  warehouseStatus: string;
}

// AI Consistency Intelligence Platform Types (Phase F10)
export interface ModelConsistencyMetric {
  modelName: string;
  consistencyScore: number;
  varianceRate: number;
  consensusGrade: 'HIGH' | 'MEDIUM' | 'LOW';
  lastScannedAt: string;
  provider?: string;
  supportsCitations?: boolean;
}

export interface StatementConflictItem {
  id: string;
  topic: string;
  modelA: string;
  statementA: string;
  modelB: string;
  statementB: string;
  severity: 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';
  resolutionStatus: 'UNRESOLVED' | 'RESOLVED' | 'IGNORED';
  conflictDelta: number;
  recommendation?: string;
}

export interface CompetitorBenchmarkItem {
  competitorName: string;
  visibilityScore: number;
  citationCount: number;
}

export interface ConsistencyPlatformStats {
  consistencyScore: number;
  varianceRate: number;
  activeConflicts: number;
  consensusGrade: string;
  trackedPrompts: number;
  trackedCitations: number;
  aiSearchStatus?: string;
}

export interface ResearchThreatItem {
  id?: string;
  title: string;
  threatLevel?: 'HIGH' | 'MEDIUM' | 'LOW';
  severity?: 'HIGH' | 'MEDIUM' | 'LOW' | string;
  description: string;
  detectedAt?: string;
}

// Autonomous AI Optimization & Remediation Engine Types (Phase F11)
export type RemediationActionStatus =
  | 'PENDING'
  | 'RUNNING'
  | 'COMPLETED'
  | 'FAILED'
  | 'CANCELLED'
  | 'REJECTED'
  | 'WAITING_APPROVAL';

export type RemediationActionPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface RemediationActionItem {
  id: string;
  organizationId: string;
  title: string;
  description?: string | null;
  type: string;
  status: RemediationActionStatus;
  priority: RemediationActionPriority;
  triggerType: string;
  payloadJson?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  executions?: Array<{
    id: string;
    actionId: string;
    status: string;
    startedAt: string;
    completedAt?: string | null;
  }>;
  artifacts?: Array<{
    id: string;
    actionId: string;
    title: string;
    contentType?: string;
    contentBody?: string;
  }>;
  results?: Array<{
    id: string;
    actionId: string;
    summaryText: string;
    dataJson?: Record<string, any>;
  }>;
}

export interface RemediationPlaybookItem {
  id?: string;
  name: string;
  category: string;
  description: string;
  steps: string[];
}

export interface RemediationArtifactItem {
  id: string;
  actionId: string;
  title: string;
  contentType: string;
  contentBody: string;
  fileUrl?: string | null;
  createdAt?: string;
}

export interface RemediationStats {
  readinessScore: number;
  activePlaybooks: number;
  pendingActions: number;
  completedActions: number;
  guardrailStatus: string;
}

// Enterprise Executive Intelligence & Global Command Center Types (Phase F12)
export interface UnifiedBrandScoreSummary {
  unifiedBrandScore: number;
  globalPlatformHealth: number;
  totalWarehouseExecutions: number;
  totalFactsRecorded?: number;
  totalResponsesStored?: number;
  totalCitationsIndexed?: number;
  totalDomainsTracked?: number;
  strategicGrowthVelocity: number;
  tierStatus: string;
  warehouseStatus?: string;
}

export interface ExplainabilityDecisionNode {
  id: string;
  factorName: string;
  weightPercentage: number;
  provenanceSource: string;
  confidenceScore: number;
  impactCategory: 'VISIBILITY' | 'CITATION' | 'TRUST' | 'CONSISTENCY';
}

export interface GlobalCommandCenterTelemetry {
  activeWorkerQueues: number;
  multiRegionProxiesOnline: number;
  securityThreatScore: number;
  averageResponseLatencyMs: number;
  systemStatus: string;
}

export interface ExecutiveStrategicDecision {
  id: string;
  title: string;
  recommendationType: 'GEO_SCHEMA' | 'CITATION_BOOST' | 'CONTENT_EXPANSION' | string;
  expectedRoiPercentage: number;
  implementationUrgency: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
}

// Autonomous SRE Operations, AI Copilot & Capacity Forecasting Types (Phase F13)
export interface OpsComponentHealth {
  component: string;
  category: 'DATABASE' | 'CACHE' | 'QUEUE' | 'STORAGE' | 'AI_PROVIDER' | 'EVENT_BUS' | 'SECURITY';
  status: 'UP' | 'DEGRADED' | 'DOWN';
  latencyMs: number;
  lastChecked: string;
}

export interface SreIncidentItem {
  id: string;
  title: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'SEV-1' | 'SEV-2' | 'SEV-3' | string;
  status: 'RESOLVED' | 'INVESTIGATING' | 'MONITORING' | string;
  autoRemediated?: boolean;
  durationMins?: number;
  rootCause?: string;
  timestamp: string;
}

export interface CapacityForecastMetric {
  resourceName: string;
  currentUtilizationPercentage: number;
  projected30DayUtilization: number;
  recommendation: string;
}

export interface CopilotChatMessage {
  id: string;
  sender: 'USER' | 'COPILOT';
  messageText: string;
  actionSuggested?: string;
  timestamp: string;
}

export interface AutonomousOpsOverview {
  availability: string;
  activeWorkers: number;
  unresolvedIncidents: number;
  monthlyCostUsd: number;
  cacheHitRatePercent: number;
  sloStatus: string;
  status: string;
  peakRps?: number;
  p99LatencyMs?: number;
}

// ============================================================================
// Phase F14: Multi-Tenant Administration & Feature Flag Types
// ============================================================================
export interface TenantAdminItem {
  id: string;
  name: string;
  domain?: string;
  plan: 'ENTERPRISE' | 'GROWTH' | 'PROFESSIONAL' | 'STARTER' | string;
  status: 'ACTIVE' | 'SUSPENDED' | 'TRIAL' | 'PENDING' | string;
  usersCount: number;
  region: string;
  createdAt: string;
  updatedAt?: string;
  quotas?: {
    resourceName: string;
    maxAllowed: number;
    used?: number;
  }[];
}

export interface TenantQuotaOverridePayload {
  tenantId: string;
  resourceName: string;
  maxAllowed: number;
}

export interface SupportTicketItem {
  id: string;
  tenantId?: string;
  tenantName?: string;
  subject: string;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  assignedTo?: string;
  createdAt: string;
}

export interface CreateSupportTicketPayload {
  tenantId?: string;
  subject: string;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  description?: string;
}

export interface AdminAuditLogItem {
  id: string;
  action: string;
  actor: string;
  adminUserId?: string;
  organizationId?: string;
  resource?: string;
  metadata?: Record<string, any>;
  timestamp: string;
}

export interface FeatureFlagItem {
  id: string;
  key: string;
  name: string;
  description?: string;
  isEnabled: boolean;
  isKillSwitched: boolean;
  defaultValue?: boolean;
  strategy: 'BOOLEAN' | 'PERCENTAGE' | 'TARGET_AUDIENCE' | 'CANARY' | string;
  percentage?: number;
  audiences?: Array<{ targetType: string; targetValue: string }>;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateFeatureFlagPayload {
  key: string;
  name: string;
  description?: string;
  isEnabled?: boolean;
  strategy?: 'BOOLEAN' | 'PERCENTAGE' | 'TARGET_AUDIENCE' | 'CANARY' | string;
  percentage?: number;
}

export interface UpdateFeatureFlagPayload {
  name?: string;
  description?: string;
  isEnabled?: boolean;
  isKillSwitched?: boolean;
  percentage?: number;
}

// ============================================================================
// Phase F15: Enterprise Observability & Distributed Tracing Types
// ============================================================================
export interface DistributedTraceSpan {
  id: string;
  traceId: string;
  parentId?: string | null;
  service: string;
  name: string;
  kind: 'SERVER' | 'CLIENT' | 'PRODUCER' | 'CONSUMER' | 'INTERNAL';
  startTimeMs: number;
  durationMs: number;
  status: 'OK' | 'ERROR';
  attributes: Record<string, string | number | boolean>;
}

export interface DistributedTraceWaterfall {
  traceId: string;
  rootService: string;
  operationName: string;
  totalDurationMs: number;
  timestamp: string;
  status: 'SUCCESS' | 'WARNING' | 'FAILED';
  spansCount: number;
  spans: DistributedTraceSpan[];
}

export interface DependencyTelemetryItem {
  service: string;
  type: 'DATABASE' | 'CACHE' | 'AI_ENGINE' | 'SEARCH_INDEX' | 'MESSAGE_BROKER';
  provider: string;
  endpoint: string;
  status: 'HEALTHY' | 'DEGRADED' | 'DOWN';
  latencyMs: number;
  errorRatePercent: number;
  lastChecked: string;
}

export interface ObservabilityTelemetrySummary {
  p50LatencyMs: number;
  p95LatencyMs: number;
  p99LatencyMs: number;
  overallThroughputRps: number;
  errorBudgetRemainingPercent: number;
  activeSpanCount: number;
  scrapedMetricsCount: number;
  liveScraperStatus: 'OPERATIONAL' | 'DEGRADED' | 'UNAVAILABLE';
}

// ============================================================================
// Phase F17: Enterprise Autonomous AI Workforce Platform Types
// ============================================================================
export interface DigitalEmployee {
  id: string;
  organizationId: string;
  employeeName: string;
  role: string;
  department: string;
  availability: 'AVAILABLE' | 'BUSY' | 'TRAINING' | 'OFFLINE' | string;
  createdAt: string;
}

export interface HireDigitalEmployeePayload {
  organizationId: string;
  employeeName: string;
  role: string;
  department?: string;
}

export interface WorkforceDepartment {
  departmentName: string;
  headcount: number;
}

export interface WorkforceTask {
  id: string;
  organizationId: string;
  taskTitle: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED' | string;
  assignedToId?: string | null;
  createdAt: string;
}

export interface AssignWorkforceTaskPayload {
  organizationId: string;
  taskTitle: string;
  assignedToId?: string;
}

export interface WorkforceOverviewTelemetry {
  activeDigitalEmployeesCount: number;
  departmentsCount: number;
  tasksInQueueCount: number;
  overallProductivityScore: number;
  monthlyHoursSaved: number;
  monthlyCostSavedUsd: number;
}

export interface WorkforcePerformanceTelemetry {
  totalTasksCompleted: number;
  overallAccuracyPct: number;
  totalHoursSaved: number;
  estimatedCostSavedUsd: number;
}

export interface WorkforceTrainingTelemetry {
  activePlaybooksCount: number;
  certifiedEmployeesPct: number;
  trainingStatus: string;
}

export interface WorkforceScheduleItem {
  id: string;
  employeeId: string;
  shiftName: string;
  status: string;
  createdAt: string;
}

export interface WorkforceStatisticsTelemetry {
  activeDigitalEmployees: number;
  departmentsCovered: number;
  workforceStatus: string;
}

// ==========================================
// Phase F18: Knowledge Graph & Semantic Provenance
// ==========================================

export type KnowledgeEntityType =
  | 'COMPANY'
  | 'PRODUCT'
  | 'SERVICE'
  | 'PERSON'
  | 'LOCATION'
  | 'CATEGORY'
  | string;

export type KnowledgeRelationType =
  | 'PRODUCES'
  | 'PROVIDES'
  | 'FOUNDED_BY'
  | 'HAS_MEMBER'
  | 'LOCATED_AT'
  | 'BELONGS_TO_CATEGORY'
  | string;

export type KnowledgeVerificationState =
  | 'UNVERIFIED'
  | 'VERIFIED'
  | 'CONFLICTED'
  | string;

export interface KnowledgeEntityAlias {
  id: string;
  entityId: string;
  alias: string;
  createdAt?: string;
}

export interface KnowledgeEntity {
  id: string;
  graphId: string;
  type: KnowledgeEntityType;
  name: string;
  canonicalName: string;
  description?: string | null;
  confidenceScore: number;
  sourceCount: number;
  verificationState: KnowledgeVerificationState;
  createdAt?: string;
  updatedAt?: string;
  aliases?: KnowledgeEntityAlias[];
}

export interface KnowledgeRelationship {
  id: string;
  graphId: string;
  sourceEntityId: string;
  targetEntityId: string;
  relationType: KnowledgeRelationType;
  confidenceScore: number;
  createdAt?: string;
  sourceEntity?: {
    id: string;
    name: string;
    type: KnowledgeEntityType;
  };
  targetEntity?: {
    id: string;
    name: string;
    type: KnowledgeEntityType;
  };
}

export interface KnowledgeFactSource {
  id: string;
  factId?: string;
  sourceUrl: string;
  htmlSelector?: string | null;
  extractedAt?: string;
  createdAt?: string;
}

export interface KnowledgeFact {
  id: string;
  graphId: string;
  entityId?: string;
  predicate: string;
  value: string;
  confidenceScore: number;
  createdAt?: string;
  updatedAt?: string;
  entity?: {
    name: string;
    type: KnowledgeEntityType;
  };
  sources?: KnowledgeFactSource[];
}

export interface KnowledgeProduct {
  id: string;
  graphId: string;
  name: string;
  description?: string | null;
  price?: string | null;
  category?: string | null;
  createdAt?: string;
}

export interface KnowledgeServiceItem {
  id: string;
  graphId: string;
  name: string;
  description?: string | null;
  category?: string | null;
  createdAt?: string;
}

export interface KnowledgeGraphSummary {
  id: string;
  projectId: string;
  name: string;
  version: number;
  entityCount: number;
  factCount: number;
  confidenceScore: number;
  createdAt: string;
  updatedAt: string;
  brandProfiles?: Array<{
    id: string;
    companyName: string;
    legalName?: string | null;
    tagline?: string | null;
    logoUrl?: string | null;
  }>;
  locations?: Array<{
    id: string;
    address?: string | null;
    city?: string | null;
    state?: string | null;
    country?: string | null;
    postalCode?: string | null;
  }>;
  contacts?: Array<{
    id: string;
    email?: string | null;
    phone?: string | null;
    supportUrl?: string | null;
    docsUrl?: string | null;
  }>;
  _count?: {
    entities: number;
    relationships: number;
    facts: number;
    products: number;
    services: number;
    faqs: number;
  };
}

// ==========================================
// Phase F19 — Enterprise Vector Intelligence Types
// ==========================================

export type EmbeddingProvider = 'OPENAI' | 'GEMINI' | 'VOYAGE' | 'COHERE';

export interface VectorEngineMetrics {
  totalEmbeddingsGenerated: number;
  avgSearchLatencyMs: number;
  activeVectorIndexes: number;
  engineStatus: string;
}

export interface VectorEmbeddingProviderInfo {
  provider: EmbeddingProvider;
  model: string;
  dimension: number;
  active: boolean;
}

export interface VectorIndexConfig {
  name: string;
  dimension: number;
  metric: string;
  status: string;
}

export interface VectorCollectionItem {
  id: string;
  organizationId?: string | null;
  name: string;
  description?: string | null;
  createdAt: string;
  updatedAt?: string;
  _count?: {
    documents?: number;
    chunks?: number;
  };
}

export interface VectorSearchResultItem {
  id: string;
  documentId: string;
  content: string;
  similarityScore: number;
}

export interface VectorSearchResponse {
  query: string;
  topK: number;
  executionMs: number;
  results: VectorSearchResultItem[];
}

export interface VectorSimilarityResponse {
  textA: string;
  textB: string;
  similarityScore: number;
  metric: string;
}

export interface VectorEmbeddingPayload {
  text: string;
  provider?: EmbeddingProvider;
}

export interface VectorEmbeddingResponse {
  provider: EmbeddingProvider;
  model: string;
  dimension: number;
  tokens: number;
  vector: number[];
  latencyMs: number;
}

// ==========================================
// Phase F20 — AI Search Visibility & GEO Analytics Types
// ==========================================

export interface GeoDashboardOverview {
  overallAiVisibilityScore: number;
  citationScore: number;
  retrievalScore: number;
  authorityScore: number;
  promptScore: number;
  topAiModel: string;
  topCitationDomain: string;
  growthRatePct: number;
}

export interface GeoVisibilityTrends {
  organizationId: string;
  overallVisibilityScore: number;
  baselineScore: number;
  historicalPoints: Array<{ date: string; score: number }>;
}

export interface GeoCitationOverview {
  totalCitationsCount: number;
  topCitedDomains: string[];
  citationGrowthRate?: number;
  citationsByEngine?: Record<string, number>;
}

export interface GeoRetrievalAnalytics {
  retrievalSharePct: number;
  averageRetrievalRank: number;
  retrievalTrendPoints?: Array<{ rank: number; share: number }>;
}

export interface GeoModelComparisonItem {
  code: string;
  provider: string;
  supportsCitations: boolean;
  visibilityScore?: number;
  avgRank?: number;
}

export interface GeoCompetitorBenchmarkItem {
  competitorName: string;
  visibilityScore: number;
  promptSharePct?: number;
  citationCoveragePct?: number;
}

export interface GeoDomainAnalyticsItem {
  domainName: string;
  authorityRank: number;
  trustScore: number;
  citationsContributed?: number;
}

export interface GeoUrlAnalyticsItem {
  url: string;
  citationCount: number;
  contentQualityScore?: number;
  lastIndexedDate?: string;
}

export interface GeoSourceProfile {
  sourceName: string;
  trustIndex: number;
  citationShare: number;
  category?: string;
}

export interface GeoKeywordAnalytics {
  totalKeywordsTracked: number;
  clustersCount: number;
  topKeyword: string;
  keywordList?: Array<{
    keyword: string;
    volume: number;
    difficulty: string;
    geoRank: number;
  }>;
}

export interface GeoRecommendationItem {
  id: string;
  title: string;
  description: string;
  expectedGain: string;
  actionType: string;
  priority?: "HIGH" | "MEDIUM" | "LOW";
}

export interface GeoActionExecutionResult {
  actionId?: string;
  actionType: string;
  status: string;
  executedAt?: string;
  generatedArtifact?: string;
}

export interface GeoPlatformStatistics {
  trackedPrompts: number;
  trackedCitations: number;
  aiSearchStatus: string;
}

// ==========================================
// Phase F21 — Enterprise Autonomous Business Execution & Closed-Loop Platform
// ==========================================

export interface BusinessExecutionDashboardOverview {
  activeOpportunitiesCount: number;
  strategiesInExecutionCount: number;
  contentItemsPublishedCount: number;
  overallVisibilityGainPct: number;
  expectedRoiPct: number;
  closedLoopState: string;
}

export interface BusinessOpportunityItem {
  id: string;
  organizationId: string;
  title: string;
  impactScore: number;
  urgency: 'HIGH' | 'MEDIUM' | 'LOW' | string;
  detectedAt?: string;
  createdAt?: string;
}

export interface RootCauseAnalysisItem {
  id: string;
  opportunityId: string;
  primaryCause: string;
  confidencePct: number;
  analyzedAt?: string;
  createdAt?: string;
}

export interface ExecutionStrategyItem {
  id: string;
  organizationId: string;
  strategyTitle: string;
  roadmapDays: number;
  expectedRoiPct: number;
  createdAt?: string;
}

export interface ContentExecutionItem {
  id: string;
  strategyId: string;
  contentType: string;
  status: string;
  createdAt?: string;
}

export interface PublishingExecutionItem {
  id: string;
  contentId: string;
  targetPlatform: string;
  status: string;
  publishedAt?: string;
  createdAt?: string;
}

export interface WorkforceExecutionStatus {
  activeWorkforceAgentsCount: number;
  assignedRoles: string[];
  humanApprovalGatesPassed: boolean;
}

export interface ClosedLoopOptimizationStatus {
  cycleState: string;
  overallVisibilityGainPct: number;
  overallTrafficGainPct: number;
  conversionsGrowthPct: number;
}

export interface BusinessExecutionHistory {
  executionsCompleted: number;
  closedLoopCycles: number;
  lastCycleTimestamp: string | Date;
}

export interface BusinessExecutionStatistics {
  totalOpportunitiesDetected: number;
  totalStrategiesExecuted: number;
  executionStatus: string;
}

export interface GenerateStrategyInput {
  organizationId: string;
  strategyTitle: string;
}

export interface GenerateContentInput {
  strategyId: string;
  contentType?: string;
}

export interface PublishContentInput {
  contentId: string;
  targetPlatform?: string;
}

export interface RunExecutionInput {
  organizationId: string;
  executionName: string;
}

// ==========================================
// Phase F22 — Enterprise Customer Intelligence Layer
// ==========================================

export interface CustomerIntelligenceDashboardOverview {
  organizationId: string;
  warehouseStatus: string;
  tenantMemorySize: string;
  knowledgeNodesCount: number;
}

export interface CustomerTimelineItem {
  id: string;
  organizationId: string;
  eventKey: string;
  description: string;
  occurredAt?: string;
  createdAt?: string;
}

export interface CustomerMemoryItem {
  id: string;
  organizationId: string;
  memoryType: string;
  memoryPayload: string;
  updatedAt?: string;
}

export interface CustomerHistoryItem {
  organizationId: string;
  historyRecordsCount: number;
}

export interface CustomerKnowledgeNodeItem {
  id: string;
  organizationId: string;
  nodeLabel: string;
  nodeType: string;
  createdAt?: string;
}

export interface CustomerKnowledgeGraphResponse {
  organizationId: string;
  nodes: CustomerKnowledgeNodeItem[];
  relationshipsCount: number;
}

export interface CustomerGoalsTelemetry {
  organizationId: string;
  completedGoals: number;
}

export interface CustomerReportsTelemetry {
  organizationId: string;
  reportsCount: number;
}

export interface CustomerWarehouseItem {
  id: string;
  organizationId: string;
  assetType: string;
  assetData: string;
  recordedAt?: string;
}

export interface CustomerPrivacyVerification {
  organizationId: string;
  auditId: string;
  isolationStatus: string;
  crossTenantLeakageRisk: number;
  privacyCompliance: string;
}

// ============================================================================
// Phase F23: Enterprise Customer Success & Churn Prediction Platform Types
// ============================================================================
export interface CustomerHealthBreakdown {
  usageScore: number;
  adoptionScore: number;
  supportScore: number;
}

export interface CustomerHealthScoreData {
  organizationId: string;
  overallHealthScore: number;
  category: 'HEALTHY' | 'AT_RISK' | 'CRITICAL' | string;
  breakdown: CustomerHealthBreakdown;
}

export interface CustomerSuccessDashboardOverview {
  organizationId: string;
  health: CustomerHealthScoreData;
  stage: 'ONBOARDING' | 'ADOPTION' | 'EXPANSION' | 'RENEWAL' | string;
  accountManager: string;
}

export interface CustomerJourneyMilestoneItem {
  id: string;
  organizationId: string;
  milestone: string;
  achievedAt: string;
}

export interface ProductAdoptionMetrics {
  organizationId?: string;
  overallAdoptionScore: number;
  featureDepth: 'LOW' | 'MEDIUM' | 'HIGH' | string;
  stickyRatioPercent: number;
  activeModules: string[];
}

export interface CustomerChurnPredictionData {
  organizationId: string;
  churnRisk: 'LOW' | 'MEDIUM' | 'HIGH' | string;
  churnProbability: number;
  expansionProbability: number;
  renewalProbability: number;
  recommendedIntervention: string;
}

export interface CustomerRenewalForecast {
  organizationId: string;
  renewalLikelihoodPercent: number;
  daysToRenewal: number;
}

export interface CustomerExpansionOpportunity {
  organizationId: string;
  expansionOpportunity: string;
  estimatedArrGrowthUsd: number;
}

export interface MilestoneTaskItem {
  day: number;
  task: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | string;
}

export interface CustomerSuccessPlanResponse {
  organizationId: string;
  timeframeDays: number;
  planTitle: string;
  milestoneTasks: MilestoneTaskItem[];
}

export interface CustomerSuccessReportsData {
  latestQBRReport: {
    title: string;
    status: string;
  };
}

export interface CustomerAcademyProgress {
  coursesCompleted: number;
  certificationsEarned: string[];
}

export interface CustomerAdvocacyStatus {
  advocacyTier: string;
  activeReferralsCount: number;
}

// ============================================================================
// Phase F24: Enterprise AI Industry Cloud Platform Types
// ============================================================================
export interface IndustryOverviewData {
  industryKey: string;
  totalTrackedCompanies: number;
  avgVisibilityScore: number;
  topCitationDomain: string;
  growthTrend: string;
}

export interface IndustryBenchmarkData {
  industryKey: string;
  avgVisibilityPercent: number;
  avgCitationPercent: number;
  avgRetrievalPercent: number;
  top10PercentileThreshold: number;
  medianScore: number;
  bottomQuartileScore: number;
}

export interface IndustryTrendData {
  emergingTopics: string[];
  decliningDomains: string[];
}

export interface IndustryLeaderboardItem {
  rank: number;
  domain: string;
  score: number;
  badge: string;
}

export interface IndustryLeaderboardResponse {
  category: string;
  rankings: IndustryLeaderboardItem[];
}

export interface IndustryAuthorityData {
  domain: string;
  authorityScore: number;
  trustScore: number;
  visibilityMomentum: string;
  retrievalStrengthPercent: number;
}

export interface IndustryModelsPreference {
  mostPreferredModelForSaas: string;
  mostPreferredModelForResearch: string;
}

export interface IndustryPublicationItem {
  id: string;
  title: string;
  publishedAt: string;
  publicationUrl?: string;
}

export interface IndustryPlatformStatistics {
  totalIndustriesClassified: number;
  totalGlobalLeaderboards: number;
  activeResearchPublications: number;
}

export interface IndustryReportsData {
  latestReport: {
    title: string;
    status: string;
  };
}

export interface IndustryPublicIndexData {
  query: string;
  resultsCount: number;
}

// ============================================================================
// Phase F25: Partner Ecosystem & Marketplace Platform Types
// ============================================================================
export interface EcosystemDashboardOverview {
  activeAgencies: number;
  activePartners: number;
  totalReferralPayoutsUsd: number;
  certifiedSpecialists: number;
  ecosystemStatus: string;
}

export interface AgencyProfileItem {
  id: string;
  agencyName: string;
  tier: string;
  isVerified: boolean;
  clientCount: number;
  createdAt: string;
}

export interface RegisterAgencyInput {
  agencyName: string;
  tier?: string;
}

export interface PartnerProfileItem {
  id: string;
  companyName: string;
  partnerType: string;
  status: string;
  createdAt: string;
}

export interface RegisterPartnerInput {
  companyName: string;
  partnerType?: string;
}

export interface EcosystemReferralItem {
  id: string;
  referrerId: string;
  refCode: string;
  commissionUsd: number;
  status: string;
  createdAt: string;
}

export interface CreateReferralInput {
  referrerId: string;
  refCode: string;
}

export interface AcademyCourseItem {
  courseKey: string;
  title: string;
  level: string;
  description?: string;
}

export interface ProfessionalCertificateItem {
  name: string;
  examStatus: string;
}

export interface CommunityForumPostItem {
  id: string;
  title: string;
  upvotes: number;
  content?: string;
}

export interface PlatformEventItem {
  id: string;
  title: string;
  eventType: string;
  scheduledAt: string;
  registrationCount?: number;
}

export interface PartnerListingItem {
  title: string;
  agency?: string;
  category?: string;
  rating: number;
}

// ============================================================================
// Phase F26: Enterprise AI Evolution Platform Types
// ============================================================================

export interface EvolutionDashboardData {
  platformState: string;
  promptsEvolvedToday: number;
  workflowsOptimizedToday: number;
  overallQualityIndex: number;
  costSavingsPct: number;
}

export interface EvolutionModelProfile {
  id: string;
  modelName: string;
  provider: string;
  contextWindow: number;
  costPer1kTokens: number;
  reasoningScore: number;
  updatedAt: string;
}

export interface ModelEvaluation {
  id: string;
  modelName: string;
  accuracy: number;
  citationQuality: number;
  retrievalSuccess: number;
  evaluatedAt: string;
}

export interface PromptEvolution {
  id: string;
  promptFamily: string;
  winningVariant: string;
  winRatePct: number;
  updatedAt: string;
}

export interface WorkflowEvolution {
  id?: string;
  workflowKey: string;
  successRate: number;
  avgDurationMs: number;
  updatedAt?: string;
}

export interface StrategyEvolution {
  id?: string;
  strategyType: string;
  executedCount: number;
  avgVisibilityGainPct: number;
  updatedAt?: string;
}

export interface AIQualityOverview {
  citationPrecisionPct: number;
  retrievalPrecisionPct: number;
  hallucinationRatePct?: number;
  hallucinationSuppressionPct?: number;
  safetyCompliancePct: number;
  domainAuthorityAlignmentPct?: number;
}

export interface BenchmarkSnapshot {
  id?: string;
  provider: string;
  medianScore: number;
  takenAt?: string;
}

export interface AIProviderScorecard {
  provider: string;
  reliabilityScore: number;
  overallRank: number;
}

export interface EvolutionHistoryRecord {
  id?: string;
  changeDescription: string;
  moduleImpacted: string;
  improvedAt: string;
}

export interface EvolutionStatistics {
  totalModelsTracked: number;
  totalPromptsEvolved: number;
  totalCostSavingsUsd: number;
  selfImprovementState: string;
}

export interface OptimalRouteRecommendation {
  taskType: string;
  recommendedModel: string;
  provider: string;
  fallbackModel: string;
  costOptimizationSavingsPct: number;
}

export interface LearningOptimizationRecord {
  id: string;
  engineSource: string;
  optimizationPayload: string;
  appliedAt: string;
}

// ============================================================================
// Phase F27: Enterprise AI Innovation Lab & Experimentation Sandbox Types
// ============================================================================

export interface InnovationDashboardData {
  sandboxState: string;
  runningExperimentsCount: number;
  promotionsPendingCount: number;
  multimodalReadiness: string;
  browserAgentSuccessPct: number;
  voiceLatencyMs: number;
}

export interface InnovationExperimentItem {
  id: string;
  title: string;
  owner: string;
  status: string;
  riskLevel: string;
  createdAt: string;
}

export interface CreateExperimentInput {
  title: string;
  owner: string;
  riskLevel?: string;
}

export interface ExperimentalModelItem {
  id: string;
  modelName: string;
  provider: string;
  isExperimental: boolean;
  addedAt: string;
}

export interface InnovationEvaluationItem {
  id: string;
  experimentId: string;
  accuracy: number;
  latencyMs: number;
  costScore: number;
  passedGate: boolean;
  evaluatedAt: string;
}

export interface InnovationPromotionItem {
  id: string;
  experimentId: string;
  promotedFrom: string;
  promotedTo: string;
  promotedAt: string;
}

export interface MultimodalCapabilityData {
  supportedModalities: string[];
  visionOcrAccuracyPct: number;
}

export interface BrowserAutomationStatusData {
  agentStatus: string;
  supportedActions: string[];
}

export interface VoiceIntelligenceStatusData {
  voiceEngine: string;
  sttAccuracyPct: number;
  ttsLatencyMs: number;
}

export interface InnovationLabStatistics {
  activeSandboxExperiments: number;
  totalPromotionsToStaging: number;
  sandboxIsolation: string;
}

// ==========================================
// Phase F28: Enterprise AI Governance Platform
// ==========================================

export interface GovernanceDashboardData {
  policyComplianceScore: number;
  pendingApprovalsCount: number;
  overallRiskScore: number;
  complianceStatus: string;
  trustScore: number;
  responsibleAiRating: number;
  auditActivityCount: number;
}

export interface GovernancePolicyItem {
  id: string;
  organizationId: string;
  policyName: string;
  policyType: string;
  isEnforced: boolean;
  createdAt: string;
}

export interface CreatePolicyInput {
  organizationId: string;
  policyName: string;
  policyType?: string;
}

export interface GovernanceApprovalItem {
  id: string;
  organizationId: string;
  workflowName: string;
  status: string;
  approverRole: string;
  approvedAt: string;
}

export interface ApproveWorkflowInput {
  organizationId: string;
  workflowName: string;
  approverRole?: string;
}

export interface GovernanceRiskData {
  overallRiskScore: number;
  securityRisk: string;
  privacyRisk: string;
  financialRisk: string;
  reputationRisk: string;
  mitigationStatus: string;
}

export interface GovernanceComplianceData {
  soc2Ready: boolean;
  iso27001Ready: boolean;
  gdprCompliant: boolean;
  hipaaCompliant: boolean;
  ccpaCompliant: boolean;
  dataResidencyRegion: string;
  rightToDeleteSupported: boolean;
}

export interface GovernanceAuditItem {
  id: string;
  actionSummary: string;
  actorId: string;
  auditedAt: string;
}

export interface GovernanceTrustData {
  systemHealth: string;
  trustIndex: number;
  securityScore: number;
  privacyStatus: string;
  activeCertificates: string[];
}

export interface ResponsibleAiData {
  status: string;
  biasRiskScore: number;
  fairnessIndex: number;
  hallucinationRate?: number;
  safetyRating?: number;
  privacyPiiCompliancePct?: number;
}

export interface ExplainabilityData {
  decisionId: string;
  modelReasoning: string;
  evidenceChain: string[];
  confidencePct: number;
}

export interface GovernanceStatistics {
  activeEnforcedPolicies: number;
  totalAuditedActions: number;
  governanceStatus: string;
}

// ==========================================
// Phase F29: Enterprise AI App Platform & Extensibility
// ==========================================

export interface AppPlatformDashboardData {
  installedAppsCount: number;
  marketplaceListingsCount: number;
  activeDevelopersCount: number;
  publishedTemplatesCount: number;
  workflowExecutionsCount: number;
  monthlyPlatformRevenue: number;
}

export interface PlatformAppItem {
  id: string;
  organizationId: string;
  appName: string;
  appType: string;
  isPublished: boolean;
  createdAt: string;
}

export interface CreateAppInput {
  organizationId: string;
  appName: string;
  appType?: string;
}

export interface MarketplaceListingItem {
  id: string;
  title: string;
  category: string;
  price: number;
  downloads: number;
  rating: number;
  createdAt: string;
}

export interface PublishListingInput {
  title: string;
  category?: string;
  price?: number;
}

export interface PlatformExtensionItem {
  id: string;
  extensionName: string;
  extensionType: string;
  isEnabled: boolean;
  installedAt: string;
}

export interface PlatformSDKItem {
  id: string;
  language: string;
  version: string;
  downloadUrl: string;
  generatedAt: string;
}

export interface PlatformDeveloperItem {
  id: string;
  developerName: string;
  email: string;
  tier: string;
  registeredAt: string;
}

export interface WorkflowTemplateItem {
  id: string;
  templateName: string;
  category: string;
  createdAt: string;
}

export interface PublishedWorkflowItem {
  id: string;
  workflowName: string;
  version: number;
  publishedAt: string;
}

export interface PublishWorkflowInput {
  workflowName: string;
}

export interface AppPlatformStatistics {
  totalInstalledApps: number;
  activeMarketplaceListings: number;
  developerCommunityCount: number;
  platformStatus: string;
}

// ==========================================
// Phase F30: Enterprise Integration Hub & Webhooks
// ==========================================

export interface IntegrationConnectionItem {
  id: string;
  providerId: string;
  status: string;
  provider?: IntegrationProviderItem;
}

export interface IntegrationSyncItem {
  id: string;
  integrationId: string;
  direction: string;
  status: string;
  lastSyncedAt?: string;
}

export interface WebhookItem {
  id: string;
  integrationId: string;
  targetUrl: string;
  status: string;
  createdAt: string;
}

export interface WebhookEventItem {
  id: string;
  webhookId?: string;
  eventType: string;
  payloadJson?: Record<string, any>;
  deliveredAt?: string;
  createdAt?: string;
}

export interface IntegrationItem {
  id: string;
  organizationId: string;
  name: string;
  type: string;
  status: string;
  configJson?: Record<string, any>;
  createdAt: string;
  updatedAt?: string;
  connections?: IntegrationConnectionItem[];
  webhooks?: WebhookItem[];
  syncs?: IntegrationSyncItem[];
}

export interface ConnectProviderInput {
  organizationId: string;
  providerCode: string;
  name?: string;
  accessToken?: string;
  configJson?: Record<string, any>;
}

export interface DisconnectProviderInput {
  integrationId: string;
}

export interface IntegrationProviderItem {
  code: string;
  name: string;
  category: string;
  isEnabled?: boolean;
}

export interface IntegrationHubStatus {
  activeIntegrations: number;
  healthStatus: string;
  syncedLast24Hours: number;
}

export interface SyncIntegrationInput {
  integrationId: string;
  direction?: 'INBOUND' | 'OUTBOUND' | 'BIDIRECTIONAL';
}

export interface SyncIntegrationResult {
  jobId?: string;
  status: string;
  syncedAt?: string;
}

export interface ProcessWebhookInput {
  integrationId: string;
  eventType: string;
  payload: Record<string, any>;
}

export interface PublishCMSContentInput {
  platform: 'WORDPRESS' | 'WEBFLOW' | 'SHOPIFY';
  title: string;
  content: string;
  slug?: string;
  status?: 'DRAFT' | 'PUBLISHED';
}

export interface PublishCMSContentResult {
  externalId?: string;
  url?: string;
  status: string;
}

export interface IntegrationHistoryItem {
  id: string;
  integrationId?: string;
  action?: string;
  status?: string;
  details?: Record<string, any>;
  createdAt?: string;
}

export interface IntegrationMetricItem {
  metricKey: string;
  metricValue: number;
  recordedAt?: string;
}

export interface ProviderHealthItem {
  providerCode: string;
  category: string;
  status: 'HEALTHY' | 'DEGRADED' | 'UNAVAILABLE';
  latencyMs: number;
  circuitBreakerState: 'CLOSED' | 'OPEN' | 'HALF_OPEN';
  version: string;
}

// ============================================================================
// Phase F31: Developer Platform & Public API Gateway Types
// ============================================================================

export interface DeveloperAppItem {
  id: string;
  organizationId: string;
  name: string;
  description?: string;
  status: 'DEVELOPMENT' | 'STAGING' | 'PRODUCTION' | 'ARCHIVED';
  createdAt?: string;
  updatedAt?: string;
  apiKeys?: DeveloperAPIKeyItem[];
  oauthClients?: DeveloperOAuthClientItem[];
  webhooks?: DeveloperWebhookItem[];
}

export interface CreateDeveloperAppInput {
  organizationId: string;
  name: string;
  description?: string;
  status?: 'DEVELOPMENT' | 'STAGING' | 'PRODUCTION' | 'ARCHIVED';
}

export interface DeveloperAPIKeyItem {
  id: string;
  applicationId: string;
  keyHash: string;
  prefix: string;
  status: 'ACTIVE' | 'REVOKED' | 'EXPIRED';
  expiresAt?: string;
  createdAt?: string;
}

export interface CreateDeveloperAPIKeyInput {
  applicationId: string;
  prefix?: string;
  expiresInDays?: number;
}

export interface CreateAPIKeyResult {
  apiKey: DeveloperAPIKeyItem;
  rawKey: string;
}

export interface DeveloperOAuthClientItem {
  id: string;
  applicationId: string;
  clientId: string;
  clientSecret?: string;
  redirectUris?: string[];
  createdAt?: string;
}

export interface DeveloperOAuthTokenResult {
  id: string;
  clientId: string;
  accessToken: string;
  refreshToken?: string;
  grantType: string;
  expiresAt: string;
  createdAt?: string;
}

export interface GenerateOAuthTokenInput {
  clientId: string;
  clientSecret?: string;
  grantType?: 'CLIENT_CREDENTIALS' | 'AUTHORIZATION_CODE' | 'REFRESH_TOKEN';
}

export interface DeveloperWebhookItem {
  id: string;
  applicationId: string;
  targetUrl: string;
  secret: string;
  isEnabled?: boolean;
  createdAt?: string;
}

export interface CreateDeveloperWebhookInput {
  applicationId: string;
  targetUrl: string;
  secret?: string;
}

export interface DeveloperLogItem {
  id: string;
  applicationId: string;
  endpoint: string;
  statusCode: number;
  latencyMs: number;
  timestamp: string;
}

export interface DeveloperUsageItem {
  id: string;
  applicationId: string;
  endpoint: string;
  requestCount: number;
  recordedAt: string;
}

export interface DeveloperMarketplaceAppItem {
  id?: string;
  applicationId?: string;
  name: string;
  summary: string;
  status: 'DRAFT' | 'PENDING_REVIEW' | 'PUBLISHED' | 'REJECTED';
  iconUrl?: string;
  createdAt?: string;
}

export interface PublishDeveloperAppInput {
  applicationId: string;
  name: string;
  summary: string;
  iconUrl?: string;
}

export interface DeveloperPlatformOverview {
  totalApps: number;
  activeApiKeys: number;
  totalRequests24h: number;
  averageLatencyMs: number;
  errorRatePct: number;
  quotaConsumptionPct: number;
}

// ==========================================
// Phase F32: Keyword & Generative Search Discovery Platform
// ==========================================

export type KeywordIntentType =
  | 'INFORMATIONAL'
  | 'COMMERCIAL'
  | 'TRANSACTIONAL'
  | 'COMPARISON'
  | 'QUESTION'
  | 'LOCAL';

export type KeywordStatus = 'ACTIVE' | 'ARCHIVED' | 'PAUSED';

export type KeywordSource = 'MANUAL' | 'CSV_IMPORT' | 'AI_DISCOVERY' | 'GEO_TRACKER';

export interface KeywordItem {
  id: string;
  organizationId: string;
  text: string;
  normalizedText: string;
  source: KeywordSource;
  status: KeywordStatus;
  intent: KeywordIntentType;
  searchVolume: number;
  difficulty: number;
  opportunityScore: number;
  clusterId?: string | null;
  cluster?: KeywordClusterItem;
  createdAt?: string;
  updatedAt?: string;
}

export interface KeywordClusterItem {
  id: string;
  name: string;
  primaryTopic: string;
  keywordCount: number;
  createdAt?: string;
  keywords?: KeywordItem[];
}

export interface KeywordOpportunityItem {
  keywordId: string;
  text: string;
  intent: KeywordIntentType;
  opportunityScore: number;
  searchVolume: number;
  difficulty: number;
  authorityGap: number;
  expectedRoi: number;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface KeywordTrendItem {
  keywordText: string;
  direction: 'RISING' | 'STABLE' | 'DECLINING';
  growthRatePct: number;
}

export interface KeywordSearchVolumeItem {
  id?: string;
  keywordText: string;
  monthlyVolume: number;
  seasonality?: Record<string, number>;
  recordedAt?: string;
}

export type CampaignFrequency = 'HOURLY' | 'DAILY' | 'WEEKLY' | 'MONTHLY';
export type CampaignStatus = 'SCHEDULED' | 'RUNNING' | 'COMPLETED' | 'PAUSED' | 'FAILED';

export interface KeywordCampaignItem {
  id: string;
  organizationId: string;
  name: string;
  status: CampaignStatus;
  frequency: CampaignFrequency;
  keywordCount: number;
  createdAt?: string;
  updatedAt?: string;
  runs?: any[];
  results?: KeywordCampaignResultItem[];
}

export interface KeywordCampaignResultItem {
  id: string;
  campaignId: string;
  keywordText: string;
  visibilityScore: number;
  citationsCount: number;
  recordedAt?: string;
}

export type PromptTemplateType =
  | 'GENERAL'
  | 'COMPARISON'
  | 'FAQ'
  | 'BUYER'
  | 'PROBLEM'
  | 'PRICING'
  | 'ALTERNATIVE';

export interface PromptLibraryItem {
  id: string;
  title: string;
  templateType: PromptTemplateType;
  promptText: string;
  usageCount: number;
  createdAt?: string;
}

export interface PromptTemplateItem {
  type: PromptTemplateType;
  name: string;
}

export interface KeywordIntelligenceOverview {
  totalTrackedKeywords: number;
  totalSearchVolume: number;
  avgOpportunityScore: number;
  activeClustersCount: number;
  activeCampaignsCount: number;
  avgCitationScore: number;
}

export interface CreateKeywordInput {
  organizationId: string;
  text: string;
  intent?: KeywordIntentType;
  searchVolume?: number;
  difficulty?: number;
  opportunityScore?: number;
  clusterId?: string;
}

export interface ImportKeywordsInput {
  organizationId: string;
  filename: string;
  csvContent: string;
}

export interface CreateCampaignInput {
  organizationId: string;
  name: string;
  frequency?: CampaignFrequency;
  keywords?: string[];
}

export interface GeneratePromptInput {
  keyword: string;
  templateType?: PromptTemplateType;
  brandName?: string;
}

// ==========================================
// Phase F33: Research & Retrieval Intelligence Engine
// ==========================================

export type RetrievalStatus = 'SUCCESS' | 'PARTIAL' | 'FAILED';

export type RetrievalSourceType =
  | 'ACADEMIC'
  | 'DOCUMENTATION'
  | 'BLOG'
  | 'COMMUNITY'
  | 'NEWS'
  | 'GOVERNMENT'
  | 'SOCIAL'
  | 'WIKIPEDIA'
  | 'THIRD_PARTY';

export type ResearchStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
export type ResearchPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type ResearchType = 'TREND' | 'OPPORTUNITY' | 'THREAT' | 'CITATION' | 'COMPETITOR';
export type ResearchConfidenceLevel = 'LOW' | 'MEDIUM' | 'HIGH';
export type ResearchTrendDirection = 'RISING' | 'STABLE' | 'FALLING';

export interface RetrievalOverviewData {
  totalRetrievals: number;
  successRatePct: number;
  avgLatencyMs: number;
  avgTokensPerRetrieval: number;
}

export interface RetrievalItem {
  id: string;
  executionId: string;
  sourceId?: string | null;
  domain: string;
  url: string;
  rankPosition: number;
  confidence: number;
  latencyMs: number;
  tokensUsed: number;
  costUsd: number;
  status: RetrievalStatus;
  createdAt: string;
}

export interface RetrievalTimelineItem {
  date: string;
  retrievals: number;
}

export interface CitationsOverviewData {
  citationsCount: number;
  uniqueDomains: number;
}

export interface CitationsTimelineItem {
  date: string;
  citations: number;
}

export interface SourceItem {
  id: string;
  domain: string;
  name: string;
  sourceType: RetrievalSourceType;
  authorityScore: number;
  trustScore: number;
  citationCount: number;
  isVerified: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface SourceLeaderboardItem {
  id?: string;
  sourceId?: string;
  domain?: string;
  rankPosition: number;
  score: number;
  recordedAt?: string;
}

export interface URLPerformanceItem {
  id?: string;
  url: string;
  citationCount: number;
  retrievalCount: number;
  visibilityScore: number;
  recordedAt?: string;
}

export interface DomainPerformanceItem {
  id?: string;
  domain: string;
  totalUrls: number;
  totalCitations: number;
  recordedAt?: string;
}

export interface PromptPerformanceItem {
  id?: string;
  promptId: string;
  successRate: number;
  citationPct: number;
  retrievalPct: number;
  averageRank: number;
  recordedAt?: string;
}

export interface ModelComparisonItem {
  provider: string;
  model: string;
  citationRatePct: number;
  avgRetrievedSources: number;
  overlapPct: number;
}

export interface ResearchProjectItem {
  id: string;
  organizationId: string;
  title: string;
  description?: string | null;
  status: ResearchStatus;
  priority: ResearchPriority;
  createdAt: string;
  updatedAt: string;
  topics?: ResearchTopicItem[];
  findings?: ResearchFindingItem[];
  reports?: ResearchReportItem[];
}

export interface ResearchTopicItem {
  id: string;
  projectId: string;
  name: string;
  description?: string | null;
  createdAt: string;
  findings?: ResearchFindingItem[];
  trends?: ResearchTrendItem[];
}

export interface ResearchFindingItem {
  id: string;
  projectId: string;
  topicId?: string | null;
  title: string;
  summary: string;
  type: ResearchType;
  confidence: ResearchConfidenceLevel;
  createdAt: string;
}

export interface ResearchTrendItem {
  id: string;
  topicId?: string | null;
  keywordText: string;
  direction: ResearchTrendDirection;
  growthRatePct: number;
  detectedAt: string;
}

export interface ResearchOpportunityItem {
  id: string;
  title: string;
  description: string;
  potentialImpact: number;
  createdAt: string;
}

export interface ResearchReportItem {
  id: string;
  projectId: string;
  title: string;
  reportType: string;
  contentBody: string;
  createdAt: string;
}

export interface ResearchBenchmarkItem {
  id?: string;
  metricName: string;
  benchmarkValue: number;
  createdAt?: string;
}

export interface ResearchExecutionHistoryItem {
  id?: string;
  action: string;
  recordedAt?: string;
}

export interface StartResearchInput {
  organizationId: string;
  title: string;
  description?: string;
  sources?: string[];
}

// ==========================================
// Phase F34: Global Intelligence Distributed Network Types
// ==========================================

export interface GlobalIntelligenceWarehouseStats {
  totalFactsRecorded: number;
  totalResponsesStored: number;
  totalCitationsIndexed: number;
  totalDomainsTracked: number;
  warehouseStatus: string;
  retentionPolicy?: string;
  activeNodes?: number;
  lastSyncTimestamp?: string;
}

export interface GlobalCitationItem {
  id?: string;
  domain: string;
  url?: string;
  frequency: number;
  authorityScore: number;
  firstSeenAt?: string;
  lastSeenAt?: string;
}

export interface GlobalDomainProfile {
  id?: string;
  domain: string;
  trustScore: number;
  citationCount: number;
  visibilityTrend?: string;
  topCitedUrls?: string[];
  updatedAt?: string;
}

export interface GlobalUrlProfile {
  id?: string;
  url: string;
  domain?: string;
  authorityScore: number;
  citationCount: number;
  freshnessIndex?: number;
  updatedAt?: string;
}

export interface GlobalModelBehaviorItem {
  id?: string;
  provider: string;
  model: string;
  citationPreference?: string;
  citationPref?: string;
  avgLatencyMs: number;
  confidence?: number;
  hallucinationRate?: number;
}

export interface GlobalKnowledgeGraphNodeItem {
  id?: string;
  nodeKey: string;
  nodeType: string;
  label: string;
  influenceScore?: number;
  createdAt?: string;
}

export interface GlobalKnowledgeGraphEdgeItem {
  id?: string;
  sourceNodeId: string;
  targetNodeId: string;
  relationship: string;
}

export interface GlobalKnowledgeGraphOverview {
  totalNodes: number;
  relationshipsTracked: number;
  graphStatus: string;
  nodes?: GlobalKnowledgeGraphNodeItem[];
  edges?: GlobalKnowledgeGraphEdgeItem[];
}

export interface GlobalTopicItem {
  id?: string;
  topicName: string;
  growthPct: number;
  category: string;
  visibilityScore?: number;
}

export interface GlobalTrendItem {
  id?: string;
  topicName?: string;
  trendPeriod?: string;
  growthPct?: number;
  fastestGrowingCitationDomains?: string[];
}

export interface GlobalArchiveItem {
  id: string;
  promptText: string;
  responseText: string;
  provider: string;
  model: string;
  latencyMs: number;
  archivedAt: string;
}

export interface GlobalArchiveStats {
  archivedResponses: number;
  supportedProviders: string[];
  retention: string;
  recentArchives?: GlobalArchiveItem[];
}

export interface GlobalNetworkStatistics {
  proprietaryAssetValueUsd: number;
  totalGraphEdges: number;
  assetStatus: string;
  activeNodes?: number;
  avgMeshLatencyMs?: number;
}

export interface MultiRegionLatencyItem {
  region: string;
  location: string;
  status: 'ONLINE' | 'DEGRADED' | 'MAINTENANCE';
  latencyMs: number;
  throughputRps: number;
  nodeCount: number;
}
// ==========================================
// Phase F35: Dyvin AI 2.0 Autonomous AI Operating System Types
// ==========================================

export interface AIOperatingSystemDashboardData {
  osVersion: string;
  status: string;
  activeGoalsCount: number;
  executingPlansCount: number;
  coordinatedAgentsCount: number;
  autonomousExecutionsToday: number;
  lastHeartbeat?: string;
}

export interface StrategicGoalItem {
  id: string;
  organizationId: string;
  title: string;
  description: string;
  targetDate: string;
  progressPct: number;
  status: string;
  createdAt?: string;
}

export interface CreateStrategicGoalInput {
  organizationId: string;
  title: string;
  description: string;
}

export interface ExecutionPlanItem {
  id: string;
  goalId: string;
  title: string;
  riskScore: number;
  estimatedCost: number;
  status: string;
  createdAt?: string;
}

export interface GenerateExecutionPlanInput {
  goalId: string;
  title: string;
}

export interface ExecutionTaskItem {
  id: string;
  planId: string;
  agentRole: string;
  title: string;
  taskStatus: string;
  executedAt?: string;
}

export interface ExecuteTaskInput {
  planId: string;
  agentRole: string;
  title: string;
}

export interface OsRecommendationItem {
  id: string;
  title: string;
  priority: string;
  visibilityGainPct: number;
  createdAt?: string;
}

export interface OsStrategyItem {
  strategyTopic: string;
  recommendedPillars: string[];
  estimatedTimeframeMonths: number;
  expectedVisibilityGainPct: number;
}

export interface OsDecisionItem {
  id: string;
  recommendation: string;
  expectedRoi: number;
  confidence?: number;
  createdAt?: string;
}

export interface OsReflectionItem {
  id: string;
  executionId: string;
  success: boolean;
  learnings: string;
  analyzedAt?: string;
}

export interface CoordinatedAgentItem {
  role: string;
  status: string;
  currentTask?: string;
  lastPing?: string;
}
