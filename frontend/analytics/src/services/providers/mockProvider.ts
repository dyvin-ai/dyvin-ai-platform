import {
  agentTasks,
  competitors,
  insights,
  modelPerformance,
  prompts,
  sources,
  summary,
  visibilitySeries,
} from "@/data/mock";
import { activeDecisions, previousRecommendations } from "@/lib/decisionEngine";
import type {
  ActionPlanId,
  ActionPlanItem,
  AgentDefinition,
  AgentRunResult,
  AgentTask,
  CitationSource,
  CompetitorRow,
  BrandProfileData,
  BrandUnderstandingData,
  BrandAccuracyData,
  BrandPresenceData,
  CompetitiveGapItem,
  BrandIntelligenceResponse,
  ScanItem,
  ScanPageItem,
  ScanMetadataItem,
  StructuredDataItem,
  TechnologyItem,
  InvoiceItem,
  OrganizationSubscription,
  SubscriptionPlan,
  SubscriptionState,
  UsageMetric,
  WarehouseStats,
  CrossModelStats,
  AiResponseLedgerItem,
  ModelConsistencyMetric,
  CompetitorBenchmarkItem,
  ConsistencyPlatformStats,
  ResearchThreatItem,
  RemediationActionItem,
  RemediationPlaybookItem,
  RemediationArtifactItem,
  RemediationStats,
  UnifiedBrandScoreSummary,
  ExplainabilityDecisionNode,
  GlobalCommandCenterTelemetry,
  ExecutiveStrategicDecision,
  OpsComponentHealth,
  SreIncidentItem,
  CapacityForecastMetric,
  AutonomousOpsOverview,
  TenantAdminItem,
  TenantQuotaOverridePayload,
  SupportTicketItem,
  CreateSupportTicketPayload,
  AdminAuditLogItem,
  FeatureFlagItem,
  CreateFeatureFlagPayload,
  UpdateFeatureFlagPayload,
  DistributedTraceWaterfall,
  DependencyTelemetryItem,
  ObservabilityTelemetrySummary,
  DigitalEmployee,
  HireDigitalEmployeePayload,
  WorkforceDepartment,
  WorkforceTask,
  AssignWorkforceTaskPayload,
  WorkforceOverviewTelemetry,
  WorkforcePerformanceTelemetry,
  WorkforceTrainingTelemetry,
  WorkforceScheduleItem,
  WorkforceStatisticsTelemetry,
  KnowledgeGraphSummary,
  KnowledgeEntity,
  KnowledgeRelationship,
  KnowledgeFact,
  KnowledgeProduct,
  KnowledgeServiceItem,
  EmbeddingProvider,
  VectorEngineMetrics,
  VectorEmbeddingProviderInfo,
  VectorIndexConfig,
  VectorCollectionItem,
  VectorSearchResponse,
  VectorSimilarityResponse,
  VectorEmbeddingResponse,
  GeoDashboardOverview,
  GeoVisibilityTrends,
  GeoCitationOverview,
  GeoRetrievalAnalytics,
  GeoModelComparisonItem,
  GeoCompetitorBenchmarkItem,
  GeoDomainAnalyticsItem,
  GeoUrlAnalyticsItem,
  GeoSourceProfile,
  GeoKeywordAnalytics,
  GeoRecommendationItem,
  GeoActionExecutionResult,
  GeoPlatformStatistics,
  BusinessExecutionDashboardOverview,
  BusinessOpportunityItem,
  RootCauseAnalysisItem,
  ExecutionStrategyItem,
  ContentExecutionItem,
  PublishingExecutionItem,
  WorkforceExecutionStatus,
  ClosedLoopOptimizationStatus,
  BusinessExecutionHistory,
  BusinessExecutionStatistics,
  GenerateStrategyInput,
  GenerateContentInput,
  PublishContentInput,
  RunExecutionInput,
  CustomerIntelligenceDashboardOverview,
  CustomerTimelineItem,
  CustomerMemoryItem,
  CustomerHistoryItem,
  CustomerKnowledgeGraphResponse,
  CustomerKnowledgeNodeItem,
  CustomerGoalsTelemetry,
  CustomerReportsTelemetry,
  CustomerWarehouseItem,
  CustomerPrivacyVerification,
  CustomerSuccessDashboardOverview,
  CustomerHealthScoreData,
  CustomerJourneyMilestoneItem,
  ProductAdoptionMetrics,
  CustomerChurnPredictionData,
  CustomerRenewalForecast,
  CustomerExpansionOpportunity,
  CustomerSuccessPlanResponse,
  CustomerSuccessReportsData,
  CustomerAcademyProgress,
  CustomerAdvocacyStatus,
  IndustryOverviewData,
  IndustryBenchmarkData,
  IndustryTrendData,
  IndustryLeaderboardItem,
  IndustryLeaderboardResponse,
  IndustryAuthorityData,
  IndustryModelsPreference,
  IndustryPublicationItem,
  IndustryPlatformStatistics,
  IndustryReportsData,
  IndustryPublicIndexData,
  EcosystemDashboardOverview,
  AgencyProfileItem,
  RegisterAgencyInput,
  PartnerProfileItem,
  RegisterPartnerInput,
  EcosystemReferralItem,
  CreateReferralInput,
  AcademyCourseItem,
  ProfessionalCertificateItem,
  CommunityForumPostItem,
  PlatformEventItem,
  PartnerListingItem,
  EvolutionDashboardData,
  EvolutionModelProfile,
  ModelEvaluation,
  PromptEvolution,
  WorkflowEvolution,
  StrategyEvolution,
  AIQualityOverview,
  BenchmarkSnapshot,
  AIProviderScorecard,
  EvolutionHistoryRecord,
  EvolutionStatistics,
  OptimalRouteRecommendation,
  LearningOptimizationRecord,
  InnovationDashboardData,
  InnovationExperimentItem,
  CreateExperimentInput,
  ExperimentalModelItem,
  InnovationEvaluationItem,
  InnovationPromotionItem,
  MultimodalCapabilityData,
  BrowserAutomationStatusData,
  VoiceIntelligenceStatusData,
  InnovationLabStatistics,
  GovernanceDashboardData,
  GovernancePolicyItem,
  CreatePolicyInput,
  GovernanceApprovalItem,
  ApproveWorkflowInput,
  GovernanceRiskData,
  GovernanceComplianceData,
  GovernanceAuditItem,
  GovernanceTrustData,
  ResponsibleAiData,
  ExplainabilityData,
  GovernanceStatistics,
  AppPlatformDashboardData,
  PlatformAppItem,
  CreateAppInput,
  MarketplaceListingItem,
  PublishListingInput,
  PlatformExtensionItem,
  PlatformSDKItem,
  PlatformDeveloperItem,
  WorkflowTemplateItem,
  PublishedWorkflowItem,
  PublishWorkflowInput,
  AppPlatformStatistics,
  IntegrationItem,
  ConnectProviderInput,
  IntegrationProviderItem,
  IntegrationHubStatus,
  SyncIntegrationInput,
  SyncIntegrationResult,
  ProcessWebhookInput,
  WebhookEventItem,
  PublishCMSContentInput,
  PublishCMSContentResult,
  IntegrationHistoryItem,
  IntegrationMetricItem,
  DeveloperAppItem,
  CreateDeveloperAppInput,
  DeveloperAPIKeyItem,
  CreateDeveloperAPIKeyInput,
  CreateAPIKeyResult,
  DeveloperOAuthTokenResult,
  GenerateOAuthTokenInput,
  DeveloperWebhookItem,
  CreateDeveloperWebhookInput,
  DeveloperLogItem,
  DeveloperUsageItem,
  DeveloperMarketplaceAppItem,
  PublishDeveloperAppInput,
  DeveloperPlatformOverview,
  KeywordItem,
  KeywordClusterItem,
  KeywordOpportunityItem,
  KeywordTrendItem,
  KeywordSearchVolumeItem,
  KeywordCampaignItem,
  KeywordCampaignResultItem,
  PromptLibraryItem,
  PromptTemplateItem,
  KeywordIntelligenceOverview,
  CreateKeywordInput,
  ImportKeywordsInput,
  CreateCampaignInput,
  GeneratePromptInput,
  RetrievalOverviewData,
  RetrievalItem,
  RetrievalTimelineItem,
  CitationsOverviewData,
  CitationsTimelineItem,
  SourceItem,
  SourceLeaderboardItem,
  URLPerformanceItem,
  DomainPerformanceItem,
  PromptPerformanceItem,
  ModelComparisonItem,
  ResearchProjectItem,
  ResearchTopicItem,
  ResearchFindingItem,
  ResearchTrendItem,
  ResearchOpportunityItem,
  ResearchReportItem,
  ResearchBenchmarkItem,
  ResearchExecutionHistoryItem,
  StartResearchInput,
  DecisionItem,
  ExportFormat,
  ExportJobItem,
  FilterParams,
  GenerateReportPayload,
  Insight,
  ModelPerformance,
  NotificationItem,
  OverviewResponse,
  OverviewSummary,
  PromptCluster,
  PromptPerformance,
  RecommendationOutcome,
  ReportItem,
  ReportSnapshot,
  ReportSummary,
  ScanStatus,
  StrategyAction,
  StrategyOverview,
  User,
  VisibilityBaselineState,
  VisibilityPoint,
  Workspace,
  GlobalIntelligenceWarehouseStats,
  GlobalCitationItem,
  GlobalDomainProfile,
  GlobalUrlProfile,
  GlobalModelBehaviorItem,
  GlobalKnowledgeGraphOverview,
  GlobalTopicItem,
  GlobalTrendItem,
  GlobalArchiveStats,
  GlobalNetworkStatistics,
  MultiRegionLatencyItem,
  AIOperatingSystemDashboardData,
  StrategicGoalItem,
  CreateStrategicGoalInput,
  ExecutionPlanItem,
  GenerateExecutionPlanInput,
  ExecutionTaskItem,
  ExecuteTaskInput,
  OsRecommendationItem,
  OsStrategyItem,
  OsDecisionItem,
  OsReflectionItem,
  CoordinatedAgentItem,
} from "@/types";
import type {
  IActionPlansProvider,
  IAgentsProvider,
  IAnalyticsProvider,
  IAuthProvider,
  IBillingProvider,
  IAutonomousOpsProvider,
  IBrandIntelligenceProvider,
  IConsistencyProvider,
  IExecutiveProvider,
  IRemediationProvider,
  IScanProvider,
  IUnderstandingProvider,
  ICompetitorsProvider,
  IDecisionsProvider,
  IInsightsProvider,
  INotificationsProvider,
  IPromptsProvider,
  IReportsProvider,
  ISourcesProvider,
  IStrategyProvider,
  IWorkspaceProvider,
  IPlatformAdminProvider,
  IObservabilityProvider,
  IWorkforceProvider,
  IKnowledgeGraphProvider,
  IVectorIntelligenceProvider,
  IAiSearchIntelligenceProvider,
  IBusinessExecutionProvider,
  ICustomerIntelligenceProvider,
  ICustomerSuccessProvider,
  IIndustryCloudProvider,
  IEcosystemProvider,
  IAiEvolutionProvider,
  IInnovationLabProvider,
  IAiGovernanceProvider,
  IAppPlatformProvider,
  IIntegrationHubProvider,
  IDeveloperPlatformProvider,
  IKeywordIntelligenceProvider,
  IRetrievalIntelligenceProvider,
  IGlobalIntelligenceProvider,
  IAIOperatingSystemProvider,
} from "./interfaces";

// In-memory state for MockProvider to simulate real persistence during session
const state = {
  actionPlans: [
    {
      id: "ap-overview-1",
      workspaceId: "ws_demo_northwind",
      title: "Counter Atlas AI Commercial Prompt Gain",
      goal: "Reclaim #1 spot on commercial queries by updating Gartner citation coverage.",
      evidence: "Atlas AI gained +9.2 pts on commercial comparison prompts across 4 new citations.",
      priority: "P0",
      impact: "High",
      effort: "Low",
      targetMetric: "Commercial Prompt Visibility (61.2% → 68.0%)",
      baseline: "61.2%",
      target: "68.0%",
      gap: "+6.8 pts",
      status: "In progress",
      outcomeStatus: "Measurement pending",
      owner: "Alex Mercer",
      createdAt: "2026-08-01T10:00:00Z",
      updatedAt: "2026-08-10T12:00:00Z",
    },
  ] as ActionPlanItem[],

  decisions: [...activeDecisions] as DecisionItem[],
  insights: [...insights] as Insight[],
  agentTasks: [...agentTasks] as AgentTask[],
  workspace: {
    id: "ws_demo_northwind",
    name: "Northwind Labs",
    domain: "northwind.ai",
    brandName: "Dyvin AI",
    industry: "Enterprise AI & Software",
    createdAt: "2026-06-01T00:00:00Z",
    updatedAt: "2026-08-10T12:00:00Z",
    plan: "enterprise",
    status: "active",
    latestScanId: "scan_20260810_001",
  } as Workspace,

  scanStatus: {
    id: "scan_20260810_001",
    workspaceId: "ws_demo_northwind",
    status: "completed",
    promptCount: 248,
    modelCoverage: 6,
    startedAt: "2026-08-10T11:48:00Z",
    completedAt: "2026-08-10T11:52:00Z",
    freshnessPercentage: 99.4,
    lastScannedMinutesAgo: 12,
  } as ScanStatus,

  notifications: [
    {
      id: "n-1",
      workspaceId: "ws_demo_northwind",
      title: "AI Visibility Surge (+8.7 pts)",
      body: "ChatGPT and Gemini commercial prompt rankings improved following G2 citation updates.",
      time: "2h ago",
      priority: "Important",
      actionLabel: "View Drivers →",
      actionRoute: "/visibility",
      read: false,
      createdAt: "2026-08-10T10:00:00Z",
    },
    {
      id: "n-2",
      workspaceId: "ws_demo_northwind",
      title: "Competitor Citation Opportunity",
      body: "Atlas AI acquired 4 new citations on gartner.com where Dyvin AI is currently unmentioned.",
      time: "5h ago",
      priority: "Critical",
      actionLabel: "Review Sources →",
      actionRoute: "/sources",
      read: false,
      createdAt: "2026-08-10T07:00:00Z",
    },
    {
      id: "n-3",
      workspaceId: "ws_demo_northwind",
      title: "Autonomous Agent Task Completed",
      body: "Source Scout completed 30-day citation gap analysis across 148 tracked domains.",
      time: "1d ago",
      priority: "Informational",
      actionLabel: "Open Agent Work →",
      actionRoute: "/agents",
      read: true,
      createdAt: "2026-08-09T12:00:00Z",
    },
  ] as NotificationItem[],

  reports: [
    {
      id: "rep-1",
      workspaceId: "ws_demo_northwind",
      title: "Monthly AI Visibility & Share of Voice Audit",
      date: "August 2026",
      slides: 6,
      author: "Dyvin AI Intelligence Engine",
      summary: "Comprehensive executive breakdown covering ChatGPT, Claude, Gemini, and Perplexity performance.",
      highlights: [
        "Overall visibility: 68.4% (+8.7 pts)",
        "Share of voice: 24.1%",
        "148 citation domains analyzed",
        "Top commercial prompt win rate: 82.4%",
      ],
      sourceRoute: "/overview",
      generatedAt: "14 min ago",
      sourceScanId: "scan_20260810_001",
      status: "ready",
    },
    {
      id: "rep-2",
      workspaceId: "ws_demo_northwind",
      title: "Competitive Landscape & Gap Analysis",
      date: "Q3 2026",
      slides: 4,
      author: "Competitive Intelligence Agent",
      summary: "Head-to-head comparison against Atlas AI, SignalFlow, and Vector Labs across 248 tracked commercial prompts.",
      highlights: [
        "Closed gap with Atlas AI to 2.8 pts",
        "Lead in commercial category prompts (82.4%)",
        "3 key competitor weak points identified on Gartner & TechCrunch",
      ],
      sourceRoute: "/competitors",
      generatedAt: "2h ago",
      sourceScanId: "scan_20260810_001",
      status: "ready",
    },
  ] as ReportSummary[],

  promptClusters: [
    {
      id: "cluster-1",
      name: "Enterprise AI Visibility",
      promptCount: 42,
      visibility: 82.4,
      leadingCompetitor: "Dyvin AI (#1)",
      weakestModel: "Copilot",
      citationGap: "g2.com",
      trend: 12.4,
      recommendation: "Maintain G2 review volume to preserve #1 spot on ChatGPT and Gemini.",
    },
    {
      id: "cluster-2",
      name: "AI Search Analytics",
      promptCount: 31,
      visibility: 74.1,
      leadingCompetitor: "Dyvin AI (#2)",
      weakestModel: "Grok",
      citationGap: "reddit.com",
      trend: 6.9,
      recommendation: "Publish updated tutorial to capture top position from manual API auditing blogs.",
    },
    {
      id: "cluster-3",
      name: "Competitor Comparison",
      promptCount: 27,
      visibility: 61.8,
      leadingCompetitor: "Atlas AI (#1)",
      weakestModel: "Perplexity",
      citationGap: "gartner.com",
      trend: -2.1,
      recommendation: "Publish comparison whitepaper to capture Gartner citation advantage.",
    },
    {
      id: "cluster-4",
      name: "Enterprise Reporting",
      promptCount: 19,
      visibility: 19.4,
      leadingCompetitor: "Atlas AI (#1)",
      weakestModel: "Claude",
      citationGap: "forbes.com",
      trend: -7.3,
      recommendation: "P0 Priority: Dyvin AI currently unmentioned due to missing Gartner research coverage.",
    },
  ] as PromptCluster[],
};

export class MockAnalyticsProvider implements IAnalyticsProvider {
  async getSummary(): Promise<OverviewSummary> {
    return {
      ...summary,
      lastUpdatedAt: state.scanStatus.completedAt,
      scanId: state.scanStatus.id,
    };
  }
  async getVisibilitySeries(period: string = "30d"): Promise<VisibilityPoint[]> {
    return visibilitySeries[period] ?? visibilitySeries["30d"]!;
  }
  async getModelPerformance(): Promise<ModelPerformance[]> {
    return modelPerformance;
  }
  async getScanStatus(): Promise<ScanStatus> {
    return state.scanStatus;
  }
  async triggerScan(): Promise<ScanStatus> {
    state.scanStatus = {
      ...state.scanStatus,
      startedAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
      lastScannedMinutesAgo: 0,
      freshnessPercentage: 100,
    };
    return state.scanStatus;
  }
  async getBaselineState(_projectId?: string): Promise<VisibilityBaselineState> {
    return {
      jobId: "mock_job_1",
      organizationId: "org-mock",
      projectId: "proj-mock",
      status: "READY",
      stage: "COMPLETED",
      progress: 100,
      brandName: "Northwind Traders",
      domain: "northwind.com",
      visibilityScore: 68.4,
      provenance: "SEEDED",
      providerCoverage: {
        available: 4,
        measured: 4,
        total: 4,
        providers: [
          { code: "OPENAI", name: "ChatGPT (GPT-4o)", status: "LIVE", executionsCount: 12 },
          { code: "CLAUDE", name: "Claude (3.5 Sonnet)", status: "LIVE", executionsCount: 12 },
          { code: "GEMINI", name: "Gemini (1.5 Pro)", status: "LIVE", executionsCount: 12 },
          { code: "PERPLEXITY", name: "Perplexity (Sonar Pro)", status: "LIVE", executionsCount: 12 },
        ],
      },
      promptsTotal: 48,
      promptsCompleted: 48,
      lastScannedAt: new Date().toISOString(),
    };
  }
  async triggerBaselineScan(_projectId?: string): Promise<VisibilityBaselineState> {
    return this.getBaselineState();
  }
  async getOverview(_projectId?: string): Promise<OverviewResponse> {
    return {
      baseline: {
        status: "READY",
        stage: "COMPLETED",
        progress: 100,
        score: summary.visibility,
        lastScannedAt: new Date().toISOString(),
        provenance: "SEEDED",
        brandName: "Northwind Traders",
        domain: "northwind.com",
      },
      visibility: {
        score: summary.visibility,
        change: summary.change,
        trend: "RISING",
        shareOfVoice: 28.4,
        avgPosition: 1.8,
        mentions: 5033,
        sentiment: 74,
      },
      providers: {
        total: 4,
        live: 4,
        partial: false,
        items: modelPerformance,
      },
      prompts: {
        total: prompts.length,
        tracked: prompts.length,
        mentioned: prompts.filter((p) => p.mentioned).length,
        averageVisibility: 71.4,
        items: prompts,
        topOpportunity: "Top enterprise cloud data governance platforms 2026",
      },
      competitors: {
        tracked: competitors.length,
        leader: "Atlas AI",
        brandPosition: 2,
        visibilityGap: -2.8,
        items: competitors,
      },
      citations: {
        sources: sources.length,
        citations: 43,
        averageAuthority: 82.4,
        citationGapCount: 4,
        topSources: sources.slice(0, 5).map((s) => ({
          id: s.id,
          domain: s.domain,
          authority: s.authority,
          citations: s.citations,
          share: s.share,
          change: s.change,
        })),
      },
      timeline: visibilitySeries["30d"] ?? [],
      decisions: activeDecisions,
      outcomes: previousRecommendations,
      alerts: [
        {
          id: "alt-1",
          type: "COMPETITOR_LEAD",
          severity: "HIGH",
          title: "Atlas AI leads visibility by 2.8 points",
          description: "Atlas AI maintains higher citation frequency on comparison queries.",
          createdAt: new Date().toISOString(),
          source: "Competitor Intelligence",
          destination: "/competitors",
        },
      ],
      recentActivity: [
        {
          id: "act-1",
          type: "BASELINE_MEASURED",
          title: "Monthly AI Visibility Audit Completed",
          description: "Analyzed 12 models across 248 tracked queries.",
          timestamp: new Date().toISOString(),
        },
      ],
    };
  }
}

export class MockPromptsProvider implements IPromptsProvider {
  async list(filter?: FilterParams): Promise<PromptPerformance[]> {
    let result = prompts;
    if (filter?.categories && filter.categories.length > 0 && !filter.categories.includes("All")) {
      result = result.filter((p) => filter.categories!.includes(p.category));
    }
    if (filter?.search) {
      const q = filter.search.toLowerCase();
      result = result.filter((p) => p.prompt.toLowerCase().includes(q));
    }
    return result;
  }
  async get(id: string): Promise<PromptPerformance | undefined> {
    return prompts.find((p) => p.id === id);
  }
  async getClusters(): Promise<PromptCluster[]> {
    return state.promptClusters;
  }
  async executePrompt(promptId: string, providerCode?: string): Promise<any> {
    const p = prompts.find((item) => item.id === promptId);
    return {
      id: `exec-${Date.now()}`,
      promptId,
      status: "SUCCESS",
      providerCode: providerCode || "OPENAI",
      modelCode: "gpt-4o",
      latencyMs: 760,
      answerText: p?.answerSnapshot || "AI answer successfully generated across ChatGPT and Claude models.",
      visibilityScore: p?.visibility || 85,
    };
  }
}

export class MockCompetitorsProvider implements ICompetitorsProvider {
  async list(): Promise<CompetitorRow[]> {
    return competitors;
  }
  async get(id: string): Promise<CompetitorRow | undefined> {
    return competitors.find((c) => c.id === id);
  }
  async runComparison(competitorId: string, brandScore: number = 85.0): Promise<any> {
    const comp = competitors.find((c) => c.id === competitorId);
    return {
      competitorId,
      brandScore,
      competitorScore: comp?.visibility || 71.2,
      winRate: 54.2,
      lossRate: 45.8,
      metricsJson: {
        visibilityDiff: brandScore - (comp?.visibility || 71.2),
        citationCount: 42,
        sourceDiversity: 0.85,
      },
    };
  }
}

export class MockSourcesProvider implements ISourcesProvider {
  async list(filter?: FilterParams): Promise<CitationSource[]> {
    let result = sources;
    if (filter?.categories && filter.categories.length > 0 && !filter.categories.includes("All")) {
      result = result.filter((s) => filter.categories!.includes(s.category || ""));
    }
    if (filter?.search) {
      const q = filter.search.toLowerCase();
      result = result.filter((s) => s.domain.toLowerCase().includes(q));
    }
    return result;
  }
  async get(id: string): Promise<CitationSource | undefined> {
    return sources.find((s) => s.id === id);
  }
}

export class MockInsightsProvider implements IInsightsProvider {
  async list(projectId?: string): Promise<Insight[]> {
    return state.insights;
  }
  async get(id: string): Promise<Insight | undefined> {
    return state.insights.find((i) => i.id === id);
  }
  async updateStatus(id: string, status: Insight["status"]): Promise<Insight | undefined> {
    const item = state.insights.find((i) => i.id === id);
    if (item) {
      item.status = status;
    }
    return item;
  }
}

export class MockStrategyProvider implements IStrategyProvider {
  async getOverview(projectId?: string): Promise<StrategyOverview> {
    const actions: StrategyAction[] = [
      {
        id: "act-ins-comp-gap-1",
        title: "Deploy Head-to-Head Comparison Guide Against Atlas AI",
        description: "Deploy comparison landing pages and secure review coverage on the domains where Atlas AI is cited.",
        category: "Competitor",
        priority: "P0",
        status: "RECOMMENDED",
        impactScore: 92,
        effortScore: 40,
        effort: "Medium",
        confidence: "High",
        expectedGain: "-16.2 pts competitive deficit",
        sourceInsightId: "ins-comp-gap-1",
        affectedPrompts: ["Enterprise AI visibility comparison", "Best brand monitoring tools"],
        affectedDomains: ["gartner.com", "g2.com"],
        affectedCompetitors: ["Atlas AI"],
        affectedModels: ["ChatGPT 4o", "Claude 3.5 Sonnet"],
        destinationRoute: "/competitors",
        createdAt: new Date().toISOString(),
      },
      {
        id: "act-ins-prompt-gap-2",
        title: "Target High-Intent Commercial Evaluation Queries",
        description: "Publish technical comparison guides and product whitepapers specifically answering enterprise evaluation queries.",
        category: "Prompts",
        priority: "P1",
        status: "RECOMMENDED",
        impactScore: 88,
        effortScore: 25,
        effort: "Low",
        confidence: "High",
        expectedGain: "+9.6 pts potential gain",
        sourceInsightId: "ins-prompt-gap-2",
        affectedPrompts: ["best enterprise ai visibility platform", "generative ai brand monitoring tools"],
        affectedDomains: ["docs.dyvin.ai"],
        affectedCompetitors: ["Atlas AI"],
        affectedModels: ["Perplexity Pro"],
        destinationRoute: "/prompts",
        createdAt: new Date().toISOString(),
      },
      {
        id: "act-ins-citation-gap-3",
        title: "Secure High-Authority Research Publication Citations",
        description: "Establish editorial presence and verified organizational profiles on top industry research domains.",
        category: "Citations",
        priority: "P1",
        status: "RECOMMENDED",
        impactScore: 82,
        effortScore: 65,
        effort: "High",
        confidence: "High",
        expectedGain: "+5.8 pts citation authority",
        sourceInsightId: "ins-citation-gap-3",
        affectedPrompts: [],
        affectedDomains: ["arxiv.org", "nature.com", "gartner.com"],
        affectedCompetitors: ["Atlas AI"],
        affectedModels: ["ChatGPT 4o", "Claude 3.5 Sonnet"],
        destinationRoute: "/sources",
        createdAt: new Date().toISOString(),
      },
      {
        id: "act-ins-model-gap-4",
        title: "Deploy Schema.org JSON-LD to Close Claude Model Gap",
        description: "Deploy Organization and Product JSON-LD structured schema to improve entity disambiguation on Claude 3.5 Sonnet.",
        category: "Technical",
        priority: "P2",
        status: "RECOMMENDED",
        impactScore: 72,
        effortScore: 20,
        effort: "Low",
        confidence: "Medium",
        expectedGain: "+6.7 pts model alignment",
        sourceInsightId: "ins-model-gap-4",
        affectedPrompts: [],
        affectedDomains: ["dyvin.ai"],
        affectedCompetitors: [],
        affectedModels: ["Claude 3.5 Sonnet"],
        destinationRoute: "/visibility",
        createdAt: new Date().toISOString(),
      },
    ];

    return {
      executiveRecommendation: {
        headline: "Deploy Head-to-Head Comparison Guide Against Atlas AI",
        situation: "Atlas AI leads by 16.2 points on generative market share across commercial evaluation prompts.",
        recommendedMove: "Deploy comparison landing pages and secure review coverage on the domains where Atlas AI is cited.",
        expectedMetric: "+8.5 pts estimated gain",
        priority: "P0",
        confidence: "High",
        effort: "Medium",
        destinationRoute: "/competitors",
      },
      actions,
      summary: {
        totalActions: actions.length,
        highPriorityCount: 1,
        estimatedPointGain: 8.5,
        provenance: "DERIVED",
      },
      provenance: "DERIVED",
    };
  }

  async updateActionStatus(actionId: string, status: StrategyAction["status"]): Promise<any> {
    return { success: true, actionId, status };
  }
}

export class MockDecisionsProvider implements IDecisionsProvider {
  async list(): Promise<DecisionItem[]> {
    return state.decisions;
  }
  async get(id: string): Promise<DecisionItem | undefined> {
    return state.decisions.find((d) => d.id === id);
  }
  async getOutcomes(): Promise<RecommendationOutcome[]> {
    return previousRecommendations as RecommendationOutcome[];
  }
}

export class MockActionPlansProvider implements IActionPlansProvider {
  async list(): Promise<ActionPlanItem[]> {
    return state.actionPlans;
  }
  async get(id: ActionPlanId): Promise<ActionPlanItem | undefined> {
    return state.actionPlans.find((p) => p.id === id);
  }
  async create(plan: Omit<ActionPlanItem, "id" | "createdAt" | "updatedAt">): Promise<ActionPlanItem> {
    const existing = state.actionPlans.find((p) => p.title === plan.title);
    if (existing) {
      return existing;
    }
    const newPlan: ActionPlanItem = {
      ...plan,
      id: `ap-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    state.actionPlans.push(newPlan);
    return newPlan;
  }
  async updateStatus(id: ActionPlanId, status: ActionPlanItem["status"]): Promise<ActionPlanItem | undefined> {
    const item = state.actionPlans.find((p) => p.id === id);
    if (item) {
      item.status = status;
      item.updatedAt = new Date().toISOString();
      if (status === "Complete") {
        item.completedAt = new Date().toISOString();
        item.outcomeStatus = "Measurement pending";
      }
    }
    return item;
  }
  async delete(id: ActionPlanId): Promise<boolean> {
    const idx = state.actionPlans.findIndex((p) => p.id === id);
    if (idx !== -1) {
      state.actionPlans.splice(idx, 1);
      return true;
    }
    return false;
  }
}

export class MockAgentsProvider implements IAgentsProvider {
  private mockAgents: AgentDefinition[] = [
    {
      id: "agent-vis-monitor",
      name: "Visibility Drift Monitor",
      type: "VISIBILITY",
      description: "Continuously tracks brand AI visibility score movements and detects abrupt model-specific drops.",
      schedule: "Every 24 hours",
      icon: "Radar",
      subject: "Overall AI Search Visibility",
      enabled: true,
      status: "ACTIVE",
      provenance: "DERIVED",
      lastRunAt: new Date(Date.now() - 3600000).toISOString(),
      nextRunAt: new Date(Date.now() + 43200000).toISOString(),
      lastResult: {
        id: "run-agent-vis-monitor-1",
        agentId: "agent-vis-monitor",
        organizationId: "org-default",
        projectId: "proj-default",
        status: "COMPLETED",
        progress: 100,
        startedAt: new Date(Date.now() - 3600000).toISOString(),
        completedAt: new Date(Date.now() - 3600000).toISOString(),
        finding: "AI Search Visibility declined by 30.5 pts across tracked models.",
        severity: "HIGH",
        evidence: { previousScore: 81.7, currentScore: 51.2, delta: -30.5 },
        recommendation: "Audit low-performing commercial comparison queries and refresh outdated technical documentation.",
        relatedRoute: "/visibility",
        provenance: "DERIVED",
        notificationDispatched: false,
      },
    },
    {
      id: "agent-comp-watch",
      name: "Competitor Intelligence Watch",
      type: "COMPETITOR",
      description: "Monitors competitor share-of-voice gains, ranking changes, and generative overtake events.",
      schedule: "Every 12 hours",
      icon: "Users",
      subject: "Competitive Share-of-Voice",
      enabled: true,
      status: "ACTIVE",
      provenance: "DERIVED",
      lastRunAt: new Date(Date.now() - 7200000).toISOString(),
      nextRunAt: new Date(Date.now() + 36000000).toISOString(),
      lastResult: {
        id: "run-agent-comp-watch-1",
        agentId: "agent-comp-watch",
        organizationId: "org-default",
        projectId: "proj-default",
        status: "COMPLETED",
        progress: 100,
        startedAt: new Date(Date.now() - 7200000).toISOString(),
        completedAt: new Date(Date.now() - 7200000).toISOString(),
        finding: "Atlas AI leads generative share of voice by 16.2 pts.",
        severity: "HIGH",
        evidence: { competitorBrand: "Atlas AI", gap: 16.2 },
        recommendation: "Deploy comparison landing pages targeting competitor strengths.",
        relatedRoute: "/competitors",
        provenance: "DERIVED",
        notificationDispatched: false,
      },
    },
    {
      id: "agent-citation-watch",
      name: "Citation Authority Scout",
      type: "CITATION",
      description: "Detects new authoritative domain citations and identifies missing citation sources leveraged by rivals.",
      schedule: "Every 24 hours",
      icon: "Link2",
      subject: "Authoritative Citation Footprint",
      enabled: true,
      status: "ACTIVE",
      provenance: "DERIVED",
      lastRunAt: new Date(Date.now() - 10800000).toISOString(),
      nextRunAt: new Date(Date.now() + 75600000).toISOString(),
      lastResult: {
        id: "run-agent-citation-watch-1",
        agentId: "agent-citation-watch",
        organizationId: "org-default",
        projectId: "proj-default",
        status: "COMPLETED",
        progress: 100,
        startedAt: new Date(Date.now() - 10800000).toISOString(),
        completedAt: new Date(Date.now() - 10800000).toISOString(),
        finding: "High-authority citation gap detected across github.com, gartner.com.",
        severity: "HIGH",
        evidence: { affectedDomains: ["github.com", "gartner.com"] },
        recommendation: "Establish editorial presence and verified organizational profiles on github.com.",
        relatedRoute: "/sources",
        provenance: "DERIVED",
        notificationDispatched: false,
      },
    },
  ];

  async list(projectId?: string): Promise<AgentDefinition[]> {
    return this.mockAgents;
  }
  async get(id: string, projectId?: string): Promise<AgentDefinition | undefined> {
    return this.mockAgents.find((a) => a.id === id);
  }
  async triggerRun(agentId: string, projectId?: string): Promise<AgentRunResult> {
    const agent = this.mockAgents.find((a) => a.id === agentId);
    const run: AgentRunResult = {
      id: `run-${agentId}-${Date.now()}`,
      agentId,
      organizationId: "org-default",
      projectId: projectId || "proj-default",
      status: "COMPLETED",
      progress: 100,
      startedAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
      finding: agent?.lastResult?.finding || "Real-time evaluation finished cleanly.",
      severity: agent?.lastResult?.severity || "LOW",
      evidence: agent?.lastResult?.evidence || {},
      recommendation: agent?.lastResult?.recommendation || "Maintain current schedule.",
      relatedRoute: agent?.lastResult?.relatedRoute || "/overview",
      provenance: "DERIVED",
      notificationDispatched: false,
    };
    if (agent) {
      agent.lastRunAt = run.completedAt;
      agent.lastResult = run;
    }
    return run;
  }
  async updateStatus(
    agentId: string,
    update: { enabled?: boolean; status?: "ACTIVE" | "PAUSED" },
    projectId?: string,
  ): Promise<AgentDefinition> {
    const agent = this.mockAgents.find((a) => a.id === agentId);
    if (!agent) throw new Error("Agent not found");
    if (update.enabled !== undefined) agent.enabled = update.enabled;
    if (update.status !== undefined) agent.status = update.status;
    else agent.status = agent.enabled ? "ACTIVE" : "PAUSED";
    return agent;
  }
  async getRuns(agentId: string, projectId?: string): Promise<AgentRunResult[]> {
    const agent = this.mockAgents.find((a) => a.id === agentId);
    return agent?.lastResult ? [agent.lastResult] : [];
  }
}

export class MockReportsProvider implements IReportsProvider {
  private mockReports: ReportItem[] = [
    {
      id: "rep-exec-1",
      projectId: "proj-default",
      title: "Executive AI Visibility Intelligence Report",
      reportType: "EXECUTIVE",
      status: "COMPLETED",
      summary: "During the 30-day reporting period, Dyvin AI achieved an AI Search Visibility score of 51.2/100 (+4.2 pts).",
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 86400000).toISOString(),
      dataPayload: {
        reportId: "rep-exec-1",
        organizationId: "org-default",
        projectId: "proj-default",
        projectName: "Dyvin AI",
        type: "EXECUTIVE",
        period: {
          start: new Date(Date.now() - 30 * 86400000).toISOString(),
          end: new Date().toISOString(),
          days: 30,
        },
        generatedAt: new Date(Date.now() - 86400000).toISOString(),
        provenance: "DERIVED",
        status: "COMPLETED",
        summary: {
          visibilityScore: 51.2,
          visibilityChange: 4.2,
          competitorPosition: 2,
          citationSources: 10,
          trackedPrompts: 12,
        },
        executiveNarrative:
          "During the 30-day reporting period, Dyvin AI achieved an AI Search Visibility score of 51.2/100 (+4.2 pts). Steady brand presence on OpenAI and Perplexity, while identifying competitor overtake risk from Atlas AI.",
        visibility: {
          overallScore: 51.2,
          components: {
            knowledge: 54.0,
            authority: 48.5,
            technical: 52.0,
            trust: 50.5,
          },
          trend: [
            { date: "2026-07-22", score: 47.0 },
            { date: "2026-08-21", score: 51.2 },
          ],
        },
        competitors: [
          { name: "Atlas AI", visibilityScore: 67.4, shareOfVoice: 34.5, rank: 1, gap: 16.2 },
          { name: "Dyvin AI", visibilityScore: 51.2, shareOfVoice: 28.2, rank: 2, gap: 0.0 },
        ],
        citations: {
          totalSources: 10,
          authorityTiers: { high: 4, medium: 4, low: 2 },
          topDomains: [
            { domain: "github.com", authority: 96, citations: 18 },
            { domain: "gartner.com", authority: 95, citations: 12 },
          ],
          missingDomains: ["g2.com", "forbes.com"],
        },
        prompts: {
          totalTracked: 12,
          topPrompts: [
            { query: "Best Enterprise GEO Platforms", visibility: 68.4, sentiment: "POSITIVE" },
          ],
        },
        models: [
          { name: "ChatGPT 4o", score: 62.4, rank: 1, status: "STRONG" },
          { name: "Claude 3.5 Sonnet", score: 44.8, rank: 3, status: "DEGRADED" },
        ],
        insights: [
          {
            id: "ins-1",
            title: "Claude Brand Mention Omission",
            finding: "Claude 3.5 Sonnet omits brand in 68% of commercial comparison queries.",
            severity: "HIGH",
            evidence: { model: "Claude 3.5 Sonnet", omissionRate: 68 },
          },
        ],
        strategy: {
          recommendation: "Deploy comparison landing pages targeting competitor strengths.",
          actions: [
            {
              id: "act-1",
              title: "Publish Competitor Comparison Matrix",
              priority: "P0",
              impact: "High",
              effort: "Medium",
              status: "RECOMMENDED",
            },
          ],
        },
        agentEvents: [
          {
            agentName: "Visibility Drift Monitor",
            type: "VISIBILITY",
            severity: "HIGH",
            finding: "AI Search Visibility declined by 30.5 pts across tracked models.",
          },
        ],
        dataQuality: {
          overall: "HIGH",
          liveProviders: 2,
          fallbackProviders: 2,
          unavailableProviders: 0,
          missingSections: [],
          observationCount: 24,
        },
        checksum: "sha256:4995b7b9c7a28c6be58bc970642f9f461d660dfc6890173a2e1c88fd2ced9471",
      },
      sections: [
        {
          id: "sec-1",
          title: "Executive Summary",
          orderIndex: 1,
          contentBody: { narrative: "Executive narrative..." },
        },
      ],
      exports: [
        {
          id: "exp-1",
          reportId: "rep-exec-1",
          format: "PDF",
          status: "COMPLETED",
          downloadUrl: "/api/v1/reports/rep-exec-1/exports/exp-1/download",
          fileSizeBytes: 1024 * 180,
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          completedAt: new Date(Date.now() - 86400000).toISOString(),
        },
      ],
    },
  ];

  async list(projectId?: string): Promise<ReportItem[]> {
    return this.mockReports;
  }
  async get(id: string): Promise<ReportItem | undefined> {
    return this.mockReports.find((r) => r.id === id);
  }
  async generate(payload: GenerateReportPayload): Promise<ReportItem> {
    const newReport: ReportItem = {
      id: `rep-${Date.now()}`,
      projectId: payload.projectId,
      title: payload.title || "Generated Intelligence Report",
      reportType: payload.reportType || "EXECUTIVE",
      status: "COMPLETED",
      summary: "Executive intelligence report generated.",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      dataPayload: {
        reportId: `rep-${Date.now()}`,
        organizationId: "org-default",
        projectId: payload.projectId,
        projectName: "Dyvin AI",
        type: payload.reportType || "EXECUTIVE",
        period: {
          start: payload.periodStart || new Date(Date.now() - 30 * 86400000).toISOString(),
          end: payload.periodEnd || new Date().toISOString(),
          days: payload.periodDays || 30,
        },
        generatedAt: new Date().toISOString(),
        provenance: "DERIVED",
        status: "COMPLETED",
        summary: {
          visibilityScore: 51.2,
          visibilityChange: 4.2,
          competitorPosition: 2,
          citationSources: 10,
          trackedPrompts: 12,
        },
        executiveNarrative: "Executive intelligence report generated cleanly.",
        checksum: "sha256:60815ab3668715b997aadea7e0b49c5997257d77dad064a077980612871bc150",
      },
      sections: [],
      exports: [],
    };
    this.mockReports.unshift(newReport);
    return newReport;
  }
  async export(reportId: string, format: ExportFormat): Promise<ExportJobItem> {
    const report = this.mockReports.find((r) => r.id === reportId);
    const exportJob: ExportJobItem = {
      id: `exp-${Date.now()}`,
      reportId,
      format,
      status: "COMPLETED",
      downloadUrl: `/api/v1/reports/${reportId}/exports/exp-${Date.now()}/download`,
      fileSizeBytes: 1024 * 120,
      createdAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
    };
    if (report) {
      if (!report.exports) report.exports = [];
      report.exports.unshift(exportJob);
    }
    return exportJob;
  }
  async getExports(reportId: string): Promise<ExportJobItem[]> {
    const report = this.mockReports.find((r) => r.id === reportId);
    return report?.exports || [];
  }
  async delete(reportId: string): Promise<boolean> {
    const idx = this.mockReports.findIndex((r) => r.id === reportId);
    if (idx !== -1) {
      this.mockReports.splice(idx, 1);
      return true;
    }
    return false;
  }
  getDownloadUrl(reportId: string, exportId: string): string {
    return `/api/v1/reports/${reportId}/exports/${exportId}/download`;
  }
  async downloadExport(
    reportId: string,
    exportId: string,
    format: ExportFormat = "PDF",
    fallbackName?: string,
  ): Promise<{ filename: string; blob: Blob }> {
    const report = this.mockReports.find((r) => r.id === reportId);
    const sanitizedTitle = (report?.title || fallbackName || "dyvin-ai-executive-report")
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, "_");
    const filename = `${sanitizedTitle}-${exportId}.${format.toLowerCase()}`;

    let blob;
    if (format === "PDF") {
      const p: any = report?.dataPayload || {};
      const kpis = p.summary || {};
      const score = kpis.visibilityScore !== undefined ? String(kpis.visibilityScore) : "51.2";
      const change = kpis.visibilityChange !== undefined ? `${kpis.visibilityChange >= 0 ? "+" : ""}${kpis.visibilityChange}` : "+4.2";
      const rank = String(kpis.competitorPosition || 2);
      const citCount = String(kpis.citationSources || 10);
      const prCount = String(kpis.trackedPrompts || 12);
      const proj = p.projectName || report?.title || "Dyvin AI";
      const prov = p.provenance || "DERIVED";
      const checksum = p.checksum || "sha256:4995b7b9c7a28c6be58bc970642f9f461d660dfc6890173a2e1c88fd2ced9471";
      const narrative = p.executiveNarrative || report?.summary || "During the 30-day reporting period, Dyvin AI achieved an AI Search Visibility score of 51.2/100 (+4.2 pts). Steady brand presence on OpenAI and Perplexity, while identifying competitor overtake risk from Atlas AI.";
      const comps = p.visibility?.components || { knowledge: 54, authority: 48.5, technical: 52, trust: 50.5 };

      // Page 1 Stream: Header, Sec 1 (Narrative), Sec 2 (5 KPI Cards), Sec 3 (Dimensions & Real Vector Trend Chart)
      const p1 = [
        "0.16 0.59 1.00 rg 40 800 515 4 re f",
        "BT /F1 8 Tf 0.39 0.45 0.55 rg 40 788 Td (DYVIN AI - EXECUTIVE INTELLIGENCE REPORT) Tj ET",
        `BT /F1 15 Tf 0.06 0.09 0.16 rg 40 766 Td (${report?.title || "Dyvin AI Executive Intelligence Report"}) Tj ET`,
        `BT /F2 8 Tf 0.39 0.45 0.55 rg 40 748 Td (Project: ${proj}   |   Reporting Period: 22 Jul 2026 to 21 Aug 2026   |   Provenance: ${prov}   |   Status: COMPLETED) Tj ET`,
        "0.88 0.91 0.94 RG 0.75 w 40 738 m 555 738 l S",
        "BT /F1 10.5 Tf 0.06 0.09 0.16 rg 40 720 Td (1. Executive Summary Narrative) Tj ET",
        "0.97 0.98 0.98 rg 0.88 0.91 0.94 RG 40 655 515 52 re B",
        `BT /F2 8.5 Tf 0.20 0.25 0.33 rg 48 692 Td (${narrative.slice(0, 96)}) Tj ET`,
        `BT /F2 8.5 Tf 0.20 0.25 0.33 rg 48 678 Td (${narrative.slice(96, 195)}) Tj ET`,
        "BT /F1 10.5 Tf 0.06 0.09 0.16 rg 40 635 Td (2. Key Performance Indicators) Tj ET",
        "0.95 0.96 0.97 rg 0.80 0.84 0.88 RG 40 575 96 46 re B",
        "0.95 0.96 0.97 rg 0.80 0.84 0.88 RG 144 575 96 46 re B",
        "0.95 0.96 0.97 rg 0.80 0.84 0.88 RG 248 575 96 46 re B",
        "0.95 0.96 0.97 rg 0.80 0.84 0.88 RG 352 575 96 46 re B",
        "0.95 0.96 0.97 rg 0.80 0.84 0.88 RG 456 575 96 46 re B",
        "BT /F1 6.5 Tf 0.39 0.45 0.55 rg 48 608 Td (AI VISIBILITY) Tj ET",
        `BT /F1 11 Tf 0.06 0.09 0.16 rg 48 588 Td (${score} / 100) Tj ET`,
        "BT /F1 6.5 Tf 0.39 0.45 0.55 rg 152 608 Td (PERIOD CHANGE) Tj ET",
        `BT /F1 11 Tf 0.09 0.64 0.29 rg 152 588 Td (${change} pts) Tj ET`,
        "BT /F1 6.5 Tf 0.39 0.45 0.55 rg 256 608 Td (MARKET RANK) Tj ET",
        `BT /F1 11 Tf 0.06 0.09 0.16 rg 256 588 Td (#${rank}) Tj ET`,
        "BT /F1 6.5 Tf 0.39 0.45 0.55 rg 360 608 Td (CITATION SOURCES) Tj ET",
        `BT /F1 11 Tf 0.06 0.09 0.16 rg 360 588 Td (${citCount}) Tj ET`,
        "BT /F1 6.5 Tf 0.39 0.45 0.55 rg 464 608 Td (TRACKED PROMPTS) Tj ET",
        `BT /F1 11 Tf 0.06 0.09 0.16 rg 464 588 Td (${prCount}) Tj ET`,
        "BT /F1 10.5 Tf 0.06 0.09 0.16 rg 40 550 Td (3. AI Search Visibility Dimensions & Period Trend) Tj ET",
        "1.00 1.00 1.00 rg 0.88 0.91 0.94 RG 40 498 120 38 re B",
        "1.00 1.00 1.00 rg 0.88 0.91 0.94 RG 170 498 120 38 re B",
        "1.00 1.00 1.00 rg 0.88 0.91 0.94 RG 300 498 120 38 re B",
        "1.00 1.00 1.00 rg 0.88 0.91 0.94 RG 430 498 125 38 re B",
        "BT /F1 7 Tf 0.39 0.45 0.55 rg 48 524 Td (Knowledge) Tj ET",
        `BT /F1 10 Tf 0.15 0.39 0.92 rg 48 508 Td (${comps.knowledge !== undefined ? comps.knowledge : 54} / 100) Tj ET`,
        "BT /F1 7 Tf 0.39 0.45 0.55 rg 178 524 Td (Authority) Tj ET",
        `BT /F1 10 Tf 0.15 0.39 0.92 rg 178 508 Td (${comps.authority !== undefined ? comps.authority : 48.5} / 100) Tj ET`,
        "BT /F1 7 Tf 0.39 0.45 0.55 rg 308 524 Td (Technical) Tj ET",
        `BT /F1 10 Tf 0.15 0.39 0.92 rg 308 508 Td (${comps.technical !== undefined ? comps.technical : 52} / 100) Tj ET`,
        "BT /F1 7 Tf 0.39 0.45 0.55 rg 438 524 Td (Trust) Tj ET",
        `BT /F1 10 Tf 0.15 0.39 0.92 rg 438 508 Td (${comps.trust !== undefined ? comps.trust : 50.5} / 100) Tj ET`,
        // Real Vector Trend Chart Box & Path Operators
        "0.97 0.98 0.98 rg 0.88 0.91 0.94 RG 40 405 515 78 re B",
        "BT /F1 7.5 Tf 0.20 0.25 0.33 rg 48 468 Td (Visibility Trend: 22 Jul 2026 to 21 Aug 2026   [Period Growth: +4.2 pts]) Tj ET",
        "0.88 0.91 0.94 RG 0.5 w 85 418 m 505 418 l S",
        "0.88 0.91 0.94 RG 0.5 w 85 436 m 505 436 l S",
        "0.88 0.91 0.94 RG 0.5 w 85 454 m 505 454 l S",
        "BT /F2 6 Tf 0.58 0.64 0.72 rg 62 416 Td (0) Tj ET",
        "BT /F2 6 Tf 0.58 0.64 0.72 rg 58 434 Td (50) Tj ET",
        "BT /F2 6 Tf 0.58 0.64 0.72 rg 54 452 Td (100) Tj ET",
        // Vector Line & Point Nodes
        "0.15 0.39 0.92 RG 1.75 w 85 435 m 505 438 l S",
        "0.15 0.39 0.92 rg 85 435 3 0 360 re f",
        "0.15 0.39 0.92 rg 505 438 3 0 360 re f",
        "BT /F1 6.5 Tf 0.12 0.25 0.69 rg 76 442 Td (47.0) Tj ET",
        "BT /F1 6.5 Tf 0.12 0.25 0.69 rg 494 445 Td (51.2) Tj ET",
        "0.88 0.91 0.94 RG 0.5 w 40 40 m 555 40 l S",
        `BT /F2 7 Tf 0.58 0.64 0.72 rg 40 28 Td (Page 1 of 3   |   Provenance: ${prov}   |   Integrity (abbrev): ${checksum.slice(0, 24)}...) Tj ET`,
      ].join("\n");

      // Page 2 Stream: Sec 4 (Competitors), Sec 5 (Citations), Sec 6 (Prompts), Sec 7 (Models)
      const p2 = [
        "BT /F2 7 Tf 0.58 0.64 0.72 rg 40 818 Td (DYVIN AI - EXECUTIVE INTELLIGENCE REPORT) Tj ET",
        `BT /F2 7 Tf 0.58 0.64 0.72 rg 320 818 Td (${report?.title || "Executive Report"}) Tj ET`,
        "0.88 0.91 0.94 RG 0.5 w 40 810 m 555 810 l S",
        "BT /F1 10.5 Tf 0.06 0.09 0.16 rg 40 788 Td (4. Competitive Positioning & Share-of-Voice) Tj ET",
        "0.12 0.16 0.23 rg 40 760 515 18 re f",
        "BT /F1 7.5 Tf 1.00 1.00 1.00 rg 45 765 Td (RANK) Tj ET",
        "BT /F1 7.5 Tf 1.00 1.00 1.00 rg 85 765 Td (COMPETITOR) Tj ET",
        "BT /F1 7.5 Tf 1.00 1.00 1.00 rg 270 765 Td (SHARE OF VOICE) Tj ET",
        "BT /F1 7.5 Tf 1.00 1.00 1.00 rg 380 765 Td (VISIBILITY SCORE) Tj ET",
        "BT /F1 7.5 Tf 1.00 1.00 1.00 rg 480 765 Td (MARKET GAP) Tj ET",
        "1.00 1.00 1.00 rg 40 742 515 18 re f",
        "BT /F1 7.5 Tf 0.06 0.09 0.16 rg 45 747 Td (#1) Tj ET",
        "BT /F1 7.5 Tf 0.06 0.09 0.16 rg 85 747 Td (Atlas AI) Tj ET",
        "BT /F2 7.5 Tf 0.20 0.25 0.33 rg 270 747 Td (34.5%) Tj ET",
        "BT /F1 7.5 Tf 0.06 0.09 0.16 rg 380 747 Td (67.4) Tj ET",
        "BT /F2 7.5 Tf 0.09 0.64 0.29 rg 480 747 Td (+16.2) Tj ET",
        "0.97 0.98 0.98 rg 40 724 515 18 re f",
        "BT /F1 7.5 Tf 0.06 0.09 0.16 rg 45 729 Td (#2) Tj ET",
        "BT /F1 7.5 Tf 0.15 0.39 0.92 rg 85 729 Td (Dyvin AI) Tj ET",
        "BT /F2 7.5 Tf 0.20 0.25 0.33 rg 270 729 Td (28.2%) Tj ET",
        "BT /F1 7.5 Tf 0.06 0.09 0.16 rg 380 729 Td (51.2) Tj ET",
        "BT /F2 7.5 Tf 0.39 0.45 0.55 rg 480 729 Td (0.0) Tj ET",
        "BT /F1 10.5 Tf 0.06 0.09 0.16 rg 40 690 Td (5. Citation Authority Network & Sources) Tj ET",
        "BT /F2 8 Tf 0.20 0.25 0.33 rg 40 675 Td (Total Cited Sources: 10   |   High Authority: 4   |   Medium: 4   |   Low Authority: 2) Tj ET",
        "0.12 0.16 0.23 rg 40 650 515 18 re f",
        "BT /F1 7.5 Tf 1.00 1.00 1.00 rg 45 655 Td (DOMAIN) Tj ET",
        "BT /F1 7.5 Tf 1.00 1.00 1.00 rg 280 655 Td (AUTHORITY SCORE) Tj ET",
        "BT /F1 7.5 Tf 1.00 1.00 1.00 rg 440 655 Td (CITATIONS) Tj ET",
        "1.00 1.00 1.00 rg 40 632 515 18 re f",
        "BT /F1 7.5 Tf 0.06 0.09 0.16 rg 45 637 Td (github.com) Tj ET",
        "BT /F2 7.5 Tf 0.20 0.25 0.33 rg 280 637 Td (96 / 100) Tj ET",
        "BT /F1 7.5 Tf 0.15 0.39 0.92 rg 440 637 Td (18) Tj ET",
        "0.97 0.98 0.98 rg 40 614 515 18 re f",
        "BT /F1 7.5 Tf 0.06 0.09 0.16 rg 45 619 Td (gartner.com) Tj ET",
        "BT /F2 7.5 Tf 0.20 0.25 0.33 rg 280 619 Td (95 / 100) Tj ET",
        "BT /F1 7.5 Tf 0.15 0.39 0.92 rg 440 619 Td (12) Tj ET",
        "1.00 0.95 0.95 rg 0.99 0.80 0.80 RG 40 580 515 24 re B",
        "BT /F1 7.5 Tf 0.73 0.11 0.11 rg 48 588 Td (High-Authority Citation Gaps:  g2.com, forbes.com) Tj ET",
        "BT /F1 10.5 Tf 0.06 0.09 0.16 rg 40 548 Td (6. Tracked Prompt Queries & Commercial Intent) Tj ET",
        "BT /F2 8 Tf 0.20 0.25 0.33 rg 40 533 Td (Total Tracked Prompts: 12) Tj ET",
        "0.12 0.16 0.23 rg 40 508 515 18 re f",
        "BT /F1 7.5 Tf 1.00 1.00 1.00 rg 45 513 Td (QUERY / COMMERCIAL INTENT) Tj ET",
        "BT /F1 7.5 Tf 1.00 1.00 1.00 rg 380 513 Td (VISIBILITY) Tj ET",
        "BT /F1 7.5 Tf 1.00 1.00 1.00 rg 470 513 Td (SENTIMENT) Tj ET",
        "1.00 1.00 1.00 rg 40 490 515 18 re f",
        "BT /F2 7.5 Tf 0.06 0.09 0.16 rg 45 495 Td (Best Enterprise GEO Platforms) Tj ET",
        "BT /F1 7.5 Tf 0.15 0.39 0.92 rg 380 495 Td (68.4%) Tj ET",
        "BT /F1 7 Tf 0.09 0.64 0.29 rg 470 495 Td (POSITIVE) Tj ET",
        "BT /F1 10.5 Tf 0.06 0.09 0.16 rg 40 458 Td (7. AI Engine Alignment & Performance Breakdown) Tj ET",
        "0.12 0.16 0.23 rg 40 432 515 18 re f",
        "BT /F1 7.5 Tf 1.00 1.00 1.00 rg 45 437 Td (AI MODEL / ENGINE) Tj ET",
        "BT /F1 7.5 Tf 1.00 1.00 1.00 rg 280 437 Td (VISIBILITY SCORE) Tj ET",
        "BT /F1 7.5 Tf 1.00 1.00 1.00 rg 390 437 Td (MARKET RANK) Tj ET",
        "BT /F1 7.5 Tf 1.00 1.00 1.00 rg 480 437 Td (STATUS) Tj ET",
        "1.00 1.00 1.00 rg 40 414 515 18 re f",
        "BT /F1 7.5 Tf 0.06 0.09 0.16 rg 45 419 Td (ChatGPT 4o) Tj ET",
        "BT /F1 7.5 Tf 0.15 0.39 0.92 rg 280 419 Td (62.4) Tj ET",
        "BT /F2 7.5 Tf 0.20 0.25 0.33 rg 390 419 Td (#1) Tj ET",
        "BT /F1 7 Tf 0.09 0.64 0.29 rg 480 419 Td (STRONG) Tj ET",
        "0.97 0.98 0.98 rg 40 396 515 18 re f",
        "BT /F1 7.5 Tf 0.06 0.09 0.16 rg 45 401 Td (Claude 3.5 Sonnet) Tj ET",
        "BT /F1 7.5 Tf 0.15 0.39 0.92 rg 280 401 Td (44.8) Tj ET",
        "BT /F2 7.5 Tf 0.20 0.25 0.33 rg 390 401 Td (#3) Tj ET",
        "BT /F1 7 Tf 0.86 0.15 0.15 rg 480 401 Td (DEGRADED) Tj ET",
        "0.88 0.91 0.94 RG 0.5 w 40 40 m 555 40 l S",
        `BT /F2 7 Tf 0.58 0.64 0.72 rg 40 28 Td (Page 2 of 3   |   Provenance: ${prov}   |   Integrity (abbrev): ${checksum.slice(0, 24)}...) Tj ET`,
      ].join("\n");

      // Page 3 Stream: Sec 8 (Strategy), Sec 9 (Insights), Sec 10 (Agent Surveillance), Sec 11 (Data Quality)
      const snapshotGeneratedAt = p.generatedAt || report?.createdAt;
      if (!snapshotGeneratedAt) {
        throw new Error("Missing canonical snapshot generation timestamp in report payload.");
      }

      const p3 = [
        "BT /F2 7 Tf 0.58 0.64 0.72 rg 40 818 Td (DYVIN AI - EXECUTIVE INTELLIGENCE REPORT) Tj ET",
        `BT /F2 7 Tf 0.58 0.64 0.72 rg 320 818 Td (${report?.title || "Executive Report"}) Tj ET`,
        "0.88 0.91 0.94 RG 0.5 w 40 810 m 555 810 l S",
        "BT /F1 10.5 Tf 0.06 0.09 0.16 rg 40 788 Td (8. Actionable Strategic Roadmap) Tj ET",
        "0.97 0.98 0.98 rg 0.88 0.91 0.94 RG 40 746 515 30 re B",
        "BT /F2 8 Tf 0.28 0.33 0.41 rg 48 760 Td (Strategic Focus: Deploy comparison landing pages targeting competitor strengths.) Tj ET",
        "1.00 1.00 1.00 rg 0.88 0.91 0.94 RG 40 702 515 34 re B",
        "0.99 0.89 0.89 rg 46 712 22 14 re f",
        "BT /F1 6.5 Tf 0.86 0.15 0.15 rg 48 716 Td (P0) Tj ET",
        "BT /F1 8.5 Tf 0.06 0.09 0.16 rg 74 715 Td (Publish Competitor Comparison Matrix) Tj ET",
        "BT /F2 7 Tf 0.39 0.45 0.55 rg 340 715 Td (High Impact   |   Medium Effort   |   Status: RECOMMENDED) Tj ET",
        "BT /F1 10.5 Tf 0.06 0.09 0.16 rg 40 666 Td (9. Key Intelligence Insights) Tj ET",
        "0.97 0.98 0.98 rg 0.80 0.84 0.88 RG 40 608 515 48 re B",
        "BT /F1 8.5 Tf 0.06 0.09 0.16 rg 48 638 Td (Claude Brand Mention Omission) Tj ET",
        "BT /F1 6.5 Tf 0.86 0.15 0.15 rg 480 638 Td ([HIGH]) Tj ET",
        "BT /F2 7.5 Tf 0.20 0.25 0.33 rg 48 624 Td (Claude 3.5 Sonnet omits brand in 68% of commercial comparison queries.) Tj ET",
        "BT /F2 6.5 Tf 0.39 0.45 0.55 rg 48 612 Td (Evidence: Model: Claude 3.5 Sonnet   |   Omission Rate: 68%) Tj ET",
        "BT /F1 10.5 Tf 0.06 0.09 0.16 rg 40 574 Td (10. Agent Surveillance & Anomaly Events) Tj ET",
        "BT /F2 7.5 Tf 0.39 0.45 0.55 rg 40 560 Td ([Point-in-Time Event Surveillance vs 30-Day Aggregate Trend]) Tj ET",
        "1.00 1.00 1.00 rg 0.88 0.91 0.94 RG 40 514 515 36 re B",
        "BT /F1 8 Tf 0.06 0.09 0.16 rg 48 532 Td (* [VISIBILITY] Visibility Drift Monitor:) Tj ET",
        "BT /F2 7.5 Tf 0.20 0.25 0.33 rg 200 532 Td (AI Search Visibility declined by 30.5 pts across tracked models.) Tj ET",
        "BT /F1 6.5 Tf 0.86 0.15 0.15 rg 480 532 Td ([HIGH]) Tj ET",
        "BT /F1 10.5 Tf 0.06 0.09 0.16 rg 40 478 Td (11. Data Quality & Audit Provenance) Tj ET",
        "0.95 0.96 0.97 rg 0.80 0.84 0.88 RG 40 404 515 62 re B",
        "BT /F1 8 Tf 0.06 0.09 0.16 rg 48 448 Td (Data Quality & Integrity Assessment:) Tj ET",
        "BT /F2 7.5 Tf 0.20 0.25 0.33 rg 48 434 Td (Overall Quality: HIGH   |   Live Providers: 2   |   Fallback Providers: 2   |   Total Observations: 24   |   Missing Sections: 0) Tj ET",
        `BT /F2 7 Tf 0.20 0.25 0.33 rg 48 420 Td (Snapshot Checksum: ${checksum}) Tj ET`,
        `BT /F2 6.5 Tf 0.39 0.45 0.55 rg 48 408 Td (Provenance: ${prov}   |   Snapshot Generated: ${snapshotGeneratedAt}) Tj ET`,
        "0.88 0.91 0.94 RG 0.5 w 40 40 m 555 40 l S",
        `BT /F2 7 Tf 0.58 0.64 0.72 rg 40 28 Td (Page 3 of 3   |   Provenance: ${prov}   |   Integrity (abbrev): ${checksum.slice(0, 24)}...) Tj ET`,
      ].join("\n");

      const s1Bytes = new TextEncoder().encode(p1).length;
      const s2Bytes = new TextEncoder().encode(p2).length;
      const s3Bytes = new TextEncoder().encode(p3).length;

      const pdfContent = [
        "%PDF-1.4",
        "1 0 obj",
        `<< /Title (${report?.title || "Dyvin AI Report"}) /Producer (Dyvin AI Executive Reports Engine) >>`,
        "endobj",
        "2 0 obj",
        "<< /Type /Catalog /Pages 3 0 R >>",
        "endobj",
        "3 0 obj",
        "<< /Type /Pages /Kids [4 0 R 6 0 R 8 0 R] /Count 3 >>",
        "endobj",
        "4 0 obj",
        "<< /Type /Page /Parent 3 0 R /MediaBox [0 0 595 842] /Contents 5 0 R /Resources << /Font << /F1 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >> /F2 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> >> >> >>",
        "endobj",
        "5 0 obj",
        `<< /Length ${s1Bytes} >>`,
        "stream",
        p1,
        "endstream",
        "endobj",
        "6 0 obj",
        "<< /Type /Page /Parent 3 0 R /MediaBox [0 0 595 842] /Contents 7 0 R /Resources << /Font << /F1 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >> /F2 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> >> >> >>",
        "endobj",
        "7 0 obj",
        `<< /Length ${s2Bytes} >>`,
        "stream",
        p2,
        "endstream",
        "endobj",
        "8 0 obj",
        "<< /Type /Page /Parent 3 0 R /MediaBox [0 0 595 842] /Contents 9 0 R /Resources << /Font << /F1 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >> /F2 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> >> >> >>",
        "endobj",
        "9 0 obj",
        `<< /Length ${s3Bytes} >>`,
        "stream",
        p3,
        "endstream",
        "endobj",
        "xref",
        "0 10",
        "0000000000 65535 f ",
        "0000000009 00000 n ",
        "0000000100 00000 n ",
        "0000000150 00000 n ",
        "0000000215 00000 n ",
        "0000000410 00000 n ",
        "0000000550 00000 n ",
        "0000000750 00000 n ",
        "0000000900 00000 n ",
        "0000001100 00000 n ",
        "trailer",
        "<< /Size 10 /Root 2 0 R >>",
        "startxref",
        "2000",
        "%%EOF",
      ].join("\n");

      blob = new Blob([pdfContent], { type: "application/pdf" });
    } else if (format === "CSV") {
      const p: any = report?.dataPayload || {};
      const snapshotGeneratedAt = p.generatedAt || report?.createdAt;
      if (!snapshotGeneratedAt) {
        throw new Error("Missing canonical snapshot generation timestamp in report payload.");
      }

      const lines: string[] = [];
      lines.push('"DYVIN AI INTELLIGENCE REPORT"');
      lines.push(`"Report Title","${(report?.title || "Executive Report").replace(/"/g, '""')}"`);
      lines.push(`"Project","${(p.projectName || report?.title || "Dyvin AI").replace(/"/g, '""')}"`);
      lines.push(`"Report Type","${p.type || report?.reportType || "EXECUTIVE"}"`);
      lines.push(`"Period Start","${p.period?.start || "2026-07-22"}"`);
      lines.push(`"Period End","${p.period?.end || "2026-08-21"}"`);
      lines.push(`"Provenance","${p.provenance || "DERIVED"}"`);
      lines.push(`"Snapshot Generated At","${snapshotGeneratedAt}"`);
      lines.push(`"Checksum","${p.checksum || "sha256:4995b7b9c7a28c6be58bc970642f9f461d660dfc6890173a2e1c88fd2ced9471"}"`);
      lines.push("");

      lines.push('"=== 1. EXECUTIVE SUMMARY NARRATIVE ==="');
      lines.push(`"Executive Narrative","${(p.executiveNarrative || report?.summary || "").replace(/"/g, '""')}"`);
      lines.push("");

      lines.push('"=== 2. KEY PERFORMANCE INDICATORS ==="');
      lines.push('"Metric","Value"');
      lines.push(`"AI Visibility Score","${p.summary?.visibilityScore !== undefined ? p.summary.visibilityScore : 51.2}"`);
      lines.push(`"Period Visibility Change","${p.summary?.visibilityChange !== undefined ? p.summary.visibilityChange : 4.2}"`);
      lines.push(`"Competitor Market Rank","${p.summary?.competitorPosition || 2}"`);
      lines.push(`"Citation Sources","${p.summary?.citationSources || 10}"`);
      lines.push(`"Tracked Prompts","${p.summary?.trackedPrompts || 12}"`);
      lines.push("");

      lines.push('"=== 3. AI SEARCH VISIBILITY DIMENSIONS & PERIOD TREND ==="');
      lines.push('"Dimension / Trend Marker","Score / Value"');
      const comps = p.visibility?.components || { knowledge: 54, authority: 48.5, technical: 52, trust: 50.5 };
      lines.push(`"Knowledge","${comps.knowledge !== undefined ? comps.knowledge : 54}"`);
      lines.push(`"Authority","${comps.authority !== undefined ? comps.authority : 48.5}"`);
      lines.push(`"Technical","${comps.technical !== undefined ? comps.technical : 52}"`);
      lines.push(`"Trust","${comps.trust !== undefined ? comps.trust : 50.5}"`);
      (p.visibility?.trend || [
        { date: "2026-07-22", score: 47.0 },
        { date: "2026-08-21", score: 51.2 },
      ]).forEach((t: any) => {
        lines.push(`"Trend (${t.date})","${t.score}"`);
      });
      lines.push("");

      lines.push('"=== 4. COMPETITIVE POSITIONING & SHARE-OF-VOICE ==="');
      lines.push('"Rank","Competitor Name","Share of Voice %","Visibility Score","Gap"');
      (p.competitors || [
        { rank: 1, name: "Atlas AI", shareOfVoice: 34.5, visibilityScore: 67.4, gap: 16.2 },
        { rank: 2, name: "Dyvin AI", shareOfVoice: 28.2, visibilityScore: 51.2, gap: 0.0 },
      ]).forEach((c: any) => {
        lines.push(`"${c.rank}","${(c.name || "").replace(/"/g, '""')}","${c.shareOfVoice}","${c.visibilityScore}","${c.gap}"`);
      });
      lines.push("");

      lines.push('"=== 5. CITATION AUTHORITY NETWORK & SOURCES ==="');
      lines.push('"Domain","Authority","Citations"');
      (p.citations?.topDomains || [
        { domain: "github.com", authority: 96, citations: 18 },
        { domain: "gartner.com", authority: 95, citations: 12 },
      ]).forEach((d: any) => {
        lines.push(`"${d.domain}","${d.authority}","${d.citations}"`);
      });
      if (p.citations?.missingDomains?.length) {
        lines.push(`"Missing High-Authority Gaps","${p.citations.missingDomains.join(", ")}","0"`);
      }
      lines.push("");

      lines.push('"=== 6. TRACKED PROMPT QUERIES & COMMERCIAL INTENT ==="');
      lines.push('"Prompt Query","Visibility %","Sentiment"');
      (p.prompts?.topPrompts || [
        { query: "Best Enterprise GEO Platforms", visibility: 68.4, sentiment: "POSITIVE" },
      ]).forEach((pr: any) => {
        lines.push(`"${(pr.query || "").replace(/"/g, '""')}","${pr.visibility}","${pr.sentiment}"`);
      });
      lines.push("");

      lines.push('"=== 7. AI ENGINE ALIGNMENT & PERFORMANCE BREAKDOWN ==="');
      lines.push('"Engine / Model","Visibility Score","Market Rank","Status"');
      (p.models || [
        { name: "ChatGPT 4o", score: 62.4, rank: 1, status: "STRONG" },
        { name: "Claude 3.5 Sonnet", score: 44.8, rank: 3, status: "DEGRADED" },
      ]).forEach((m: any) => {
        lines.push(`"${m.name}","${m.score}","${m.rank}","${m.status}"`);
      });
      lines.push("");

      lines.push('"=== 8. ACTIONABLE STRATEGIC ROADMAP ==="');
      if (p.strategy?.recommendation) {
        lines.push(`"Strategic Recommendation","${(p.strategy.recommendation || "").replace(/"/g, '""')}","","",""`);
      }
      lines.push('"Priority","Action Title","Impact","Effort","Status"');
      (p.strategy?.actions || [
        { priority: "P0", title: "Publish Competitor Comparison Matrix", impact: "High", effort: "Medium", status: "RECOMMENDED" },
      ]).forEach((a: any) => {
        lines.push(`"${a.priority}","${(a.title || "").replace(/"/g, '""')}","${a.impact}","${a.effort}","${a.status}"`);
      });
      lines.push("");

      lines.push('"=== 9. KEY INTELLIGENCE INSIGHTS ==="');
      lines.push('"Title","Severity","Finding","Omission Rate"');
      (p.insights || [
        { title: "Claude Brand Mention Omission", severity: "HIGH", finding: "Claude 3.5 Sonnet omits brand in 68% of commercial comparison queries.", evidence: { omissionRate: 68 } },
      ]).forEach((i: any) => {
        lines.push(`"${(i.title || "").replace(/"/g, '""')}","${i.severity}","${(i.finding || "").replace(/"/g, '""')}","${i.evidence?.omissionRate || ""}"`);
      });
      lines.push("");

      lines.push('"=== 10. AGENT SURVEILLANCE & ANOMALY EVENTS ==="');
      lines.push('"Agent Name","Type","Severity","Finding"');
      (p.agentEvents || [
        { agentName: "Visibility Drift Monitor", type: "VISIBILITY", severity: "HIGH", finding: "AI Search Visibility declined by 30.5 pts across tracked models." },
      ]).forEach((e: any) => {
        lines.push(`"${e.agentName}","${e.type}","${e.severity}","${(e.finding || "").replace(/"/g, '""')}"`);
      });
      lines.push("");

      lines.push('"=== 11. DATA QUALITY & AUDIT PROVENANCE ==="');
      lines.push(`"Assessment Metric","Value"`);
      lines.push(`"Overall Quality","${p.dataQuality?.overall || "HIGH"}"`);
      lines.push(`"Live Providers","${p.dataQuality?.liveProviders || 2}"`);
      lines.push(`"Fallback Providers","${p.dataQuality?.fallbackProviders || 2}"`);
      lines.push(`"Unavailable Providers","${p.dataQuality?.unavailableProviders || 0}"`);
      lines.push(`"Total Observations","${p.dataQuality?.observationCount || 24}"`);
      lines.push(`"Missing Sections","${(p.dataQuality?.missingSections || []).join(", ") || "None"}"`);
      lines.push(`"Snapshot Checksum","${p.checksum || "sha256:4995b7b9c7a28c6be58bc970642f9f461d660dfc6890173a2e1c88fd2ced9471"}"`);
      lines.push(`"Provenance","${p.provenance || "DERIVED"}"`);

      const csvContent = lines.join("\n");
      blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    } else {
      const jsonContent = JSON.stringify(report?.dataPayload || report || { id: reportId }, null, 2);
      blob = new Blob([jsonContent], { type: "application/json;charset=utf-8;" });
    }

    if (typeof window !== "undefined" && typeof document !== "undefined") {
      const objectUrl = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = objectUrl;
      anchor.download = filename;
      anchor.style.display = "none";
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      setTimeout(() => URL.revokeObjectURL(objectUrl), 60000);
    }

    return { filename, blob };
  }
  async exportAndDownload(
    reportId: string,
    format: ExportFormat = "PDF",
    fallbackName?: string,
  ): Promise<ExportJobItem> {
    const exportJob = await this.export(reportId, format);
    await this.downloadExport(reportId, exportJob.id, format, fallbackName);
    return exportJob;
  }
}

const NOTIF_STORAGE_KEY = "dyvin_mock_notifications_state";

const defaultMockNotifications: NotificationItem[] = [
  {
    id: "notif-1",
    title: "AI Search Visibility Update",
    body: "Visibility score reached 51.2 (+4.2 pts) across tracked models.",
    time: "1 hour ago",
    priority: "Informational",
    actionLabel: "View Overview",
    actionRoute: "/overview",
    read: false,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
];

function getStoredMockNotifications(): NotificationItem[] {
  try {
    const raw = localStorage.getItem(NOTIF_STORAGE_KEY);
    if (raw !== null) {
      return JSON.parse(raw);
    }
  } catch {}
  return [...defaultMockNotifications];
}

function setStoredMockNotifications(items: NotificationItem[]): void {
  try {
    localStorage.setItem(NOTIF_STORAGE_KEY, JSON.stringify(items));
  } catch {}
}

export class MockNotificationsProvider implements INotificationsProvider {
  async list(): Promise<NotificationItem[]> {
    return getStoredMockNotifications();
  }
  async markAsRead(id?: string): Promise<boolean> {
    const list = getStoredMockNotifications();
    if (id) {
      const item = list.find((n) => n.id === id);
      if (item) item.read = true;
    } else {
      list.forEach((n) => {
        n.read = true;
      });
    }
    setStoredMockNotifications(list);
    return true;
  }
  async delete(id: string): Promise<boolean> {
    const list = getStoredMockNotifications();
    const filtered = list.filter((n) => n.id !== id);
    setStoredMockNotifications(filtered);
    return true;
  }
  async clearAll(): Promise<boolean> {
    setStoredMockNotifications([]);
    return true;
  }
}

export class MockWorkspaceProvider implements IWorkspaceProvider {
  async getWorkspace(): Promise<Workspace> {
    return state.workspace;
  }
  async updateWorkspace(data: Partial<Workspace>): Promise<Workspace> {
    state.workspace = { ...state.workspace, ...data, updatedAt: new Date().toISOString() };
    return state.workspace;
  }
  async getTeamMembers(): Promise<User[]> {
    return [
      { id: "u-1", name: "Alex Mercer", email: "alex@northwind.ai", role: "owner" },
      { id: "u-2", name: "Sarah Chen", email: "sarah@northwind.ai", role: "admin" },
      { id: "u-3", name: "Demo User", email: "demo@dyvin.ai", role: "analyst" },
    ];
  }
}

export class MockAuthProvider implements IAuthProvider {
  async getCurrentUser(): Promise<User | null> {
    return { id: "u-1", name: "Alex Mercer", email: "alex@northwind.ai", role: "owner" };
  }
  async login(email: string): Promise<User> {
    return { id: "u-1", name: email.split("@")[0] || "User", email, role: "owner" };
  }
  async logout(): Promise<void> {
    localStorage.removeItem("dyvin_auth_token");
  }
  getSessionToken(): string | null {
    return localStorage.getItem("dyvin_auth_token") || "demo_token_authenticated";
  }
}

export class MockBrandIntelligenceProvider implements IBrandIntelligenceProvider {
  private mockData: BrandIntelligenceResponse = {
    profile: {
      brandName: "Dyvin AI",
      domain: "dyvin.ai",
      industry: "AI Visibility & Generative Engine Optimization (GEO)",
      description: "Enterprise AI visibility, generative engine optimization, and brand presence tracking platform.",
      businessSize: "Mid-Market / Enterprise",
      status: "ACTIVE",
      products: [
        { id: "prod-1", name: "Dyvin Visibility Tracker", description: "Enterprise AI visibility telemetry tool.", price: "Custom" },
        { id: "prod-2", name: "Executive Intelligence Reporter", description: "Multi-engine PDF and audit export.", price: "Custom" },
        { id: "prod-3", name: "Citation Authority Scout", description: "24/7 web domain link networks.", price: "Custom" },
      ],
      services: [
        { id: "serv-1", name: "GEO Readiness Audit", description: "Technical and knowledge graph assessment" },
        { id: "serv-2", name: "Knowledge Graph Integration", description: "JSON-LD schema modeling" },
      ],
      entities: [
        { id: "ent-1", name: "Dyvin AI Inc.", type: "Organization", confidence: 0.98, verificationState: "VERIFIED" },
        { id: "ent-2", name: "Generative Engine Optimization", type: "Topic", confidence: 0.95, verificationState: "VERIFIED" },
      ],
      attributes: [
        { label: "Founded", value: "2024", source: "Official Docs", verified: true },
        { label: "Category", value: "Generative Engine Optimization (GEO)", source: "Entity Graph", verified: true },
      ],
    },
    understanding: {
      totalAnswersAnalyzed: 160,
      totalMentions: 116,
      mentionRate: 72.5,
      positioningStatement:
        "Dyvin AI is widely recognized across generative engines as a specialized AI Search Visibility (GEO) analytics platform, frequently associated with synthetic search audit, citation graph tracking, and enterprise model monitoring.",
      associatedTopics: [
        { topic: "Generative Engine Optimization", mentions: 48, percentage: 33.8 },
        { topic: "AI Search Visibility Analytics", mentions: 39, percentage: 27.5 },
        { topic: "Citation Authority Scoring", mentions: 28, percentage: 19.7 },
        { topic: "Enterprise Knowledge Graph", mentions: 18, percentage: 12.7 },
        { topic: "Legacy SEO Monitoring", mentions: 9, percentage: 6.3 },
      ],
      associatedProducts: [
        { name: "Dyvin Visibility Tracker", status: "OBSERVED_IN_ANSWERS", mentionCount: 54 },
        { name: "Executive Intelligence Reporter", status: "OBSERVED_IN_ANSWERS", mentionCount: 42 },
        { name: "Citation Authority Scout", status: "OBSERVED_IN_ANSWERS", mentionCount: 31 },
        { name: "Dyvin Automated Outreach", status: "CATALOG_ONLY", mentionCount: 0 },
      ],
      answerExcerpts: [
        {
          id: "exc-1",
          promptText: "What is Dyvin AI and how does it optimize generative engine discovery?",
          category: "Brand Discovery",
          provider: "Perplexity",
          model: "sonar-medium",
          answerExcerpt: "Dyvin AI is an enterprise Generative Engine Optimization (GEO) platform that analyzes how foundational models (ChatGPT, Claude, Gemini, Perplexity) synthesize corporate brands and sources.",
          sentiment: "positive",
          position: 1,
          brandMentioned: true,
          citations: ["dyvin.ai/docs/geo-guide", "techcrunch.com/features/geo-platforms"],
          timestamp: new Date(Date.now() - 86400000).toISOString(),
          provenance: "OBSERVED",
        },
        {
          id: "exc-2",
          promptText: "Best software for tracking Perplexity and ChatGPT enterprise brand mentions",
          category: "Commercial Comparison",
          provider: "OpenAI",
          model: "gpt-4o",
          answerExcerpt: "Dyvin AI and Profound are the leading solutions for tracking visibility across answer engines, providing sovereign telemetry on citation graphs.",
          sentiment: "positive",
          position: 1,
          brandMentioned: true,
          citations: ["github.com/dyvin-ai", "venturebeat.com/ai-search-rankings"],
          timestamp: new Date(Date.now() - 172800000).toISOString(),
          provenance: "OBSERVED",
        },
        {
          id: "exc-3",
          promptText: "Does Dyvin AI offer automated backlink outreach?",
          category: "Feature Inquiry",
          provider: "Anthropic",
          model: "claude-3-5-sonnet",
          answerExcerpt: "While Dyvin AI audits domain citation networks, some sources state it generates autonomous email backlink pitches, though Dyvin's official documentation focuses solely on knowledge graphs and analytics.",
          sentiment: "neutral",
          position: 2,
          brandMentioned: true,
          citations: ["dyvin.ai/overview"],
          timestamp: new Date(Date.now() - 259200000).toISOString(),
          provenance: "DERIVED",
        },
      ],
    },
    accuracy: {
      accuracyScore: 86.5,
      totalAuditedPrompts: 160,
      verifiedConsistentCount: 138,
      findings: [
        {
          id: "acc-1",
          title: "Hallucinated 'Automated Cold Outreach' capability in Claude & Perplexity",
          severity: "HIGH",
          category: "CONFLICTING_DESCRIPTION",
          issue: "Models are confusing Dyvin's citation intelligence with outbound PR/cold email marketing software.",
          impact: "Diverts prospects seeking pure analytics and causes confusion around outbound compliance.",
          recommendation: "Publish an explicit 'What Dyvin AI Is & Isn't' positioning guide and clarify JSON-LD schemas on `/about` and `/product` pages.",
          evidence: {
            promptText: "Does Dyvin AI automate cold email backlink pitches?",
            provider: "Anthropic",
            model: "claude-3-5-sonnet",
            excerpt: "Dyvin AI automates outbound PR email sequences to webmasters for link placement.",
            timestamp: new Date(Date.now() - 86400000).toISOString(),
            provenance: "OBSERVED",
          },
        },
        {
          id: "acc-2",
          title: "Legacy beta pricing cited by Gemini 1.5 Pro",
          severity: "MEDIUM",
          category: "OUTDATED_INFO",
          issue: "Gemini frequently references early-stage tier pricing ($49/mo) instead of the current enterprise plan structure.",
          impact: "Anchor pricing mismatch leads to friction in enterprise sales cycles.",
          recommendation: "Deploy updated Schema.org `Product` with `offers` block specifying active pricing and deprecated tier dates.",
          evidence: {
            promptText: "How much does Dyvin AI cost?",
            provider: "Google",
            model: "gemini-1.5-pro",
            excerpt: "Pricing starts with a free hobby plan and $49/month starter tier.",
            timestamp: new Date(Date.now() - 172800000).toISOString(),
            provenance: "OBSERVED",
          },
        },
        {
          id: "acc-3",
          title: "Citation Authority Scout omitted in general GEO comparison answers",
          severity: "LOW",
          category: "OMITTED_MENTION",
          issue: "Models mention Visibility Tracker but fail to cite the real-time crawler Citation Authority Scout.",
          impact: "Under-represents Dyvin's real-time citation discovery moat against competitors.",
          recommendation: "Enhance technical documentation indexing and ensure Citation Authority Scout has dedicated landing page metadata.",
          evidence: {
            promptText: "Top tools to audit AI citation authority",
            provider: "OpenAI",
            model: "gpt-4o",
            excerpt: "Dyvin provides visibility dashboards, while specialized scouts are omitted.",
            timestamp: new Date(Date.now() - 259200000).toISOString(),
            provenance: "DERIVED",
          },
        },
      ],
    },
    presence: {
      visibilityScore: 51.2,
      shareOfVoice: 28.2,
      avgPosition: 1.9,
      totalMentions: 116,
      sentimentBreakdown: { positive: 81, neutral: 27, negative: 8 },
      providerBreakdown: [
        { provider: "OpenAI", code: "openai", visibility: 62.4, mentions: 34, avgPosition: 1.8, sentiment: 78, status: "LIVE" },
        { provider: "Anthropic", code: "anthropic", visibility: 44.8, mentions: 26, avgPosition: 2.1, sentiment: 72, status: "LIVE" },
        { provider: "Perplexity", code: "perplexity", visibility: 58.6, mentions: 35, avgPosition: 1.4, sentiment: 82, status: "LIVE" },
        { provider: "Google", code: "google", visibility: 38.9, mentions: 21, avgPosition: 2.5, sentiment: 68, status: "LIVE" },
      ],
      citationDomains: [
        { domain: "github.com", authority: 96, citations: 18 },
        { domain: "gartner.com", authority: 95, citations: 12 },
        { domain: "venturebeat.com", authority: 91, citations: 9 },
      ],
    },
    competitiveGaps: [
      {
        id: "gap-1",
        competitorName: "Profound",
        competitorDomain: "profound.com",
        gapType: "PROMPT_ABSENCE",
        title: "Enterprise Buying Intent Absence",
        description: "Profound captured prominent recommendations in Fortune 500 enterprise optimization queries while Dyvin AI was absent.",
        evidence: {
          promptText: "Best enterprise AI search optimization platform for Fortune 500",
          competitorAppeared: true,
          brandAppeared: false,
          provider: "OpenAI",
          answerExcerpt: "Profound is the preferred choice for enterprise Fortune 500 compliance and scale...",
          timestamp: new Date(Date.now() - 86400000).toISOString(),
        },
        actionableMove: "Publish enterprise SOC2 / security compliance whitepaper and pitch for inclusion in Gartner emerging tech quadrants.",
        impactPts: 9.4,
      },
      {
        id: "gap-2",
        competitorName: "Peec AI",
        competitorDomain: "peec.ai",
        gapType: "TOPIC_GAP",
        title: "Technical Benchmark Omission",
        description: "Peec AI is favored in open developer and technical benchmarking queries.",
        evidence: {
          promptText: "Open source vs hosted generative engine analytics",
          competitorAppeared: true,
          brandAppeared: false,
          provider: "Anthropic",
          answerExcerpt: "Peec AI provides transparent token benchmarking and open synthetic prompts...",
          timestamp: new Date(Date.now() - 172800000).toISOString(),
        },
        actionableMove: "Release open evaluation dataset and benchmark runner on HuggingFace and GitHub to capture developer mindshare.",
        impactPts: 7.8,
      },
      {
        id: "gap-3",
        competitorName: "Athena Search",
        competitorDomain: "athenasearch.io",
        gapType: "CITATION_GAP",
        title: "Agency Citation Footprint",
        description: "Athena Search captures agency directories and digital marketing publications.",
        evidence: {
          promptText: "Real-time citation intelligence for marketing agencies",
          competitorAppeared: true,
          brandAppeared: false,
          provider: "Perplexity",
          answerExcerpt: "Athena Search offers dedicated multi-tenant agency workspaces and client reporting...",
          timestamp: new Date(Date.now() - 259200000).toISOString(),
        },
        actionableMove: "Launch Agency Partner Program and partner with prominent agency publications.",
        impactPts: 6.5,
      },
    ],
    provenance: "OBSERVED",
    lastScannedAt: new Date().toISOString(),
  };

  async getBrandIntelligence(projectId?: string): Promise<BrandIntelligenceResponse> {
    return this.mockData;
  }
  async getBrandProfile(projectId?: string): Promise<BrandProfileData> {
    return this.mockData.profile;
  }
  async getBrandUnderstanding(projectId?: string): Promise<BrandUnderstandingData> {
    return this.mockData.understanding;
  }
  async getBrandAccuracy(projectId?: string): Promise<BrandAccuracyData> {
    return this.mockData.accuracy;
  }
  async getBrandPresence(projectId?: string): Promise<BrandPresenceData> {
    return this.mockData.presence;
  }
  async getCompetitiveGaps(projectId?: string): Promise<CompetitiveGapItem[]> {
    return this.mockData.competitiveGaps;
  }
}

export class MockScanProvider implements IScanProvider {
  private mockScans: ScanItem[] = [];
  private pagesByScanId = new Map<string, ScanPageItem[]>();
  private metadataByScanId = new Map<string, ScanMetadataItem[]>();
  private schemasByScanId = new Map<string, StructuredDataItem[]>();
  private technologiesByScanId = new Map<string, TechnologyItem[]>();

  constructor() {
    this.initDefaultScan();
  }

  private initDefaultScan() {
    const defaultScanId = "scan-mock-1";
    const defaultUrl = "https://northwind.ai";
    const defaultDomain = "northwind.ai";
    const defaultBrand = "Northwind AI";

    const defaultScan: ScanItem = {
      id: defaultScanId,
      projectId: "proj_demo_core",
      websiteId: "web-mock-northwind",
      status: "COMPLETED",
      pagesDiscovered: 4,
      pagesCrawled: 4,
      startedAt: new Date(Date.now() - 3600000).toISOString(),
      completedAt: new Date(Date.now() - 3540000).toISOString(),
      errorMessage: null,
      createdBy: "usr_demo_dev",
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      updatedAt: new Date(Date.now() - 3540000).toISOString(),
      website: {
        id: "web-mock-northwind",
        url: defaultUrl,
        domain: defaultDomain,
      },
      project: {
        id: "proj_demo_core",
        name: "Dyvin Visibility Engine",
        primaryDomain: defaultDomain,
      },
      _count: {
        pages: 4,
        assets: 12,
        technologies: 6,
        securityFindings: 0,
      },
    };

    const defaultPages: ScanPageItem[] = [
      {
        id: "page-nw-1",
        url: `${defaultUrl}/`,
        statusCode: 200,
        contentType: "text/html",
        title: `${defaultBrand} — Enterprise AI Intelligence Platform`,
        metaDescription: "Measure how AI search engines discover, cite, and evaluate your brand across generative models.",
        wordCount: 1450,
        readingTime: 6,
        language: "en",
        canonicalUrl: `${defaultUrl}/`,
        depth: 0,
        createdAt: new Date(Date.now() - 3590000).toISOString(),
      },
      {
        id: "page-nw-2",
        url: `${defaultUrl}/solutions`,
        statusCode: 200,
        contentType: "text/html",
        title: `AI Visibility Solutions & Analytics — ${defaultBrand}`,
        metaDescription: "Real-time prompt benchmarking, GEO strategy roadmaps, and competitor citation intelligence.",
        wordCount: 1720,
        readingTime: 7,
        language: "en",
        canonicalUrl: `${defaultUrl}/solutions`,
        depth: 1,
        createdAt: new Date(Date.now() - 3580000).toISOString(),
      },
      {
        id: "page-nw-3",
        url: `${defaultUrl}/platform`,
        statusCode: 200,
        contentType: "text/html",
        title: `Enterprise Architecture & Technology — ${defaultBrand}`,
        metaDescription: "Explore our crawler engine, LLM evaluation pipelines, and Knowledge Graph validation.",
        wordCount: 1100,
        readingTime: 5,
        language: "en",
        canonicalUrl: `${defaultUrl}/platform`,
        depth: 1,
        createdAt: new Date(Date.now() - 3570000).toISOString(),
      },
      {
        id: "page-nw-4",
        url: `${defaultUrl}/privacy`,
        statusCode: 200,
        contentType: "text/html",
        title: `Compliance & Security Standards — ${defaultBrand}`,
        metaDescription: "Enterprise tenant isolation, data confidentiality, and SOC2 compliant telemetry.",
        wordCount: 1950,
        readingTime: 8,
        language: "en",
        canonicalUrl: `${defaultUrl}/privacy`,
        depth: 1,
        createdAt: new Date(Date.now() - 3560000).toISOString(),
      },
    ];

    const defaultSchemas: StructuredDataItem[] = [
      {
        id: "schema-nw-1",
        scanPageId: "page-nw-1",
        type: "Organization",
        rawJson: {
          "@context": "https://schema.org",
          "@type": "Organization",
          name: defaultBrand,
          url: defaultUrl,
          description: "Enterprise AI Visibility and Intelligence Platform.",
        },
        createdAt: new Date(Date.now() - 3590000).toISOString(),
        scanPage: { url: `${defaultUrl}/`, title: `${defaultBrand} — Enterprise AI Intelligence Platform` },
      },
      {
        id: "schema-nw-2",
        scanPageId: "page-nw-1",
        type: "WebSite",
        rawJson: {
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: defaultBrand,
          url: defaultUrl,
        },
        createdAt: new Date(Date.now() - 3590000).toISOString(),
        scanPage: { url: `${defaultUrl}/`, title: `${defaultBrand} — Enterprise AI Intelligence Platform` },
      },
    ];

    const defaultMetadata: ScanMetadataItem[] = [
      { id: "meta-nw-1", scanPageId: "page-nw-1", key: "og:title", value: `${defaultBrand} — Enterprise AI Intelligence Platform`, createdAt: new Date().toISOString() },
      { id: "meta-nw-2", scanPageId: "page-nw-1", key: "og:description", value: "Measure how AI search engines discover and cite your brand.", createdAt: new Date().toISOString() },
      { id: "meta-nw-3", scanPageId: "page-nw-1", key: "twitter:card", value: "summary_large_image", createdAt: new Date().toISOString() },
      { id: "meta-nw-4", scanPageId: "page-nw-1", key: "robots", value: "index, follow", createdAt: new Date().toISOString() },
    ];

    const defaultTechnologies: TechnologyItem[] = [
      { id: "tech-nw-1", scanId: defaultScanId, name: "React", category: "Frontend Frameworks", version: "18.3", confidence: 99 },
      { id: "tech-nw-2", scanId: defaultScanId, name: "Vite / SSR", category: "Build Tooling", version: "5.4", confidence: 95 },
      { id: "tech-nw-3", scanId: defaultScanId, name: "Tailwind CSS", category: "UI & Styling", version: "3.4", confidence: 98 },
      { id: "tech-nw-4", scanId: defaultScanId, name: "Cloudflare", category: "CDN & Security", version: null, confidence: 90 },
      { id: "tech-nw-5", scanId: defaultScanId, name: "Google Analytics 4", category: "Analytics", version: null, confidence: 92 },
      { id: "tech-nw-6", scanId: defaultScanId, name: "Schema.org JSON-LD", category: "Structured Data", version: "JSON-LD", confidence: 100 },
    ];

    this.mockScans = [defaultScan];
    this.pagesByScanId.set(defaultScanId, defaultPages);
    this.schemasByScanId.set(defaultScanId, defaultSchemas);
    this.metadataByScanId.set(defaultScanId, defaultMetadata);
    this.technologiesByScanId.set(defaultScanId, defaultTechnologies);
  }

  async getScans(projectId?: string): Promise<ScanItem[]> {
    if (projectId) {
      return this.mockScans.filter((s) => s.projectId === projectId);
    }
    return this.mockScans;
  }

  async getScanDetails(scanId: string): Promise<ScanItem> {
    const found = this.mockScans.find((s) => s.id === scanId);
    return found || this.mockScans[0];
  }

  async getScanPages(scanId: string): Promise<ScanPageItem[]> {
    return this.pagesByScanId.get(scanId) || this.pagesByScanId.get("scan-mock-1") || [];
  }

  async getScanMetadata(scanId: string): Promise<ScanMetadataItem[]> {
    return this.metadataByScanId.get(scanId) || this.metadataByScanId.get("scan-mock-1") || [];
  }

  async getScanStructuredData(scanId: string): Promise<StructuredDataItem[]> {
    return this.schemasByScanId.get(scanId) || this.schemasByScanId.get("scan-mock-1") || [];
  }

  async getScanTechnologies(scanId: string): Promise<TechnologyItem[]> {
    return this.technologiesByScanId.get(scanId) || this.technologiesByScanId.get("scan-mock-1") || [];
  }

  async triggerScan(projectId: string, url?: string): Promise<ScanItem> {
    const rawTarget = (url || "https://northwind.ai").trim();
    const targetUrl = rawTarget.startsWith("http://") || rawTarget.startsWith("https://")
      ? rawTarget
      : `https://${rawTarget}`;

    let targetDomain = "northwind.ai";
    try {
      targetDomain = new URL(targetUrl).hostname.toLowerCase();
    } catch {
      targetDomain = targetUrl.replace(/^https?:\/\//, "").split("/")[0].toLowerCase() || "northwind.ai";
    }

    const domainParts = targetDomain.replace(/^www\./, "").split(".");
    const rawBrand = domainParts[0] || "Target";
    const brandName = rawBrand.charAt(0).toUpperCase() + rawBrand.slice(1);
    const scanId = `scan-mock-${Date.now()}`;
    const cleanUrl = targetUrl.replace(/\/$/, "");

    const newScan: ScanItem = {
      id: scanId,
      projectId: projectId || "proj_demo_core",
      websiteId: `web-mock-${targetDomain}`,
      status: "COMPLETED",
      pagesDiscovered: 4,
      pagesCrawled: 4,
      startedAt: new Date(Date.now() - 45000).toISOString(),
      completedAt: new Date().toISOString(),
      errorMessage: null,
      createdBy: "usr_demo_dev",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      website: {
        id: `web-mock-${targetDomain}`,
        url: cleanUrl,
        domain: targetDomain,
      },
      project: {
        id: projectId || "proj_demo_core",
        name: projectId === "proj_demo_core" ? "Dyvin Visibility Engine" : brandName,
        primaryDomain: targetDomain,
      },
      _count: { pages: 4, assets: 10, technologies: 6, securityFindings: 0 },
    };

    const targetPages: ScanPageItem[] = [
      {
        id: `page-${scanId}-1`,
        url: `${cleanUrl}/`,
        statusCode: 200,
        contentType: "text/html",
        title: `${brandName} — Official Website & Digital Presence`,
        metaDescription: `Explore ${brandName}'s official catalog, digital services, and enterprise presence across AI search engines.`,
        wordCount: 1580,
        readingTime: 6,
        language: "en",
        canonicalUrl: `${cleanUrl}/`,
        depth: 0,
        createdAt: new Date().toISOString(),
      },
      {
        id: `page-${scanId}-2`,
        url: `${cleanUrl}/products`,
        statusCode: 200,
        contentType: "text/html",
        title: `Products & Offerings — ${brandName}`,
        metaDescription: `Discover the complete collection of products, services, and digital offerings from ${brandName}.`,
        wordCount: 1820,
        readingTime: 8,
        language: "en",
        canonicalUrl: `${cleanUrl}/products`,
        depth: 1,
        createdAt: new Date().toISOString(),
      },
      {
        id: `page-${scanId}-3`,
        url: `${cleanUrl}/about`,
        statusCode: 200,
        contentType: "text/html",
        title: `About ${brandName} — Story, Vision & Company`,
        metaDescription: `Learn more about the background, mission, executive leadership, and innovations at ${brandName}.`,
        wordCount: 940,
        readingTime: 4,
        language: "en",
        canonicalUrl: `${cleanUrl}/about`,
        depth: 1,
        createdAt: new Date().toISOString(),
      },
      {
        id: `page-${scanId}-4`,
        url: `${cleanUrl}/privacy`,
        statusCode: 200,
        contentType: "text/html",
        title: `Privacy & Security Terms — ${brandName}`,
        metaDescription: `Review our security disclosures, data privacy controls, and user protection standards at ${brandName}.`,
        wordCount: 2200,
        readingTime: 9,
        language: "en",
        canonicalUrl: `${cleanUrl}/privacy`,
        depth: 1,
        createdAt: new Date().toISOString(),
      },
    ];

    const targetSchemas: StructuredDataItem[] = [
      {
        id: `schema-${scanId}-1`,
        scanPageId: `page-${scanId}-1`,
        type: "Organization",
        rawJson: {
          "@context": "https://schema.org",
          "@type": "Organization",
          name: brandName,
          url: cleanUrl,
          description: `Official organizational entity for ${brandName} indexed in LLM knowledge graph.`,
        },
        createdAt: new Date().toISOString(),
        scanPage: { url: `${cleanUrl}/`, title: `${brandName} — Official Website & Digital Presence` },
      },
      {
        id: `schema-${scanId}-2`,
        scanPageId: `page-${scanId}-1`,
        type: "WebSite",
        rawJson: {
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: brandName,
          url: cleanUrl,
        },
        createdAt: new Date().toISOString(),
        scanPage: { url: `${cleanUrl}/`, title: `${brandName} — Official Website & Digital Presence` },
      },
    ];

    const targetMetadata: ScanMetadataItem[] = [
      { id: `meta-${scanId}-1`, scanPageId: `page-${scanId}-1`, key: "og:title", value: `${brandName} — Official Website & Digital Presence`, createdAt: new Date().toISOString() },
      { id: `meta-${scanId}-2`, scanPageId: `page-${scanId}-1`, key: "og:description", value: `Explore ${brandName}'s official services and products.`, createdAt: new Date().toISOString() },
      { id: `meta-${scanId}-3`, scanPageId: `page-${scanId}-1`, key: "twitter:card", value: "summary_large_image", createdAt: new Date().toISOString() },
      { id: `meta-${scanId}-4`, scanPageId: `page-${scanId}-1`, key: "robots", value: "index, follow", createdAt: new Date().toISOString() },
    ];

    const targetTechnologies: TechnologyItem[] = [
      { id: `tech-${scanId}-1`, scanId, name: "React", category: "Frontend Frameworks", version: "18.3", confidence: 99 },
      { id: `tech-${scanId}-2`, scanId, name: "Next.js", category: "Web Frameworks", version: "14.2", confidence: 96 },
      { id: `tech-${scanId}-3`, scanId, name: "Tailwind CSS", category: "UI & Styling", version: "3.4", confidence: 98 },
      { id: `tech-${scanId}-4`, scanId, name: "Cloudflare", category: "CDN & Security", version: null, confidence: 94 },
      { id: `tech-${scanId}-5`, scanId, name: "Google Analytics 4", category: "Analytics", version: null, confidence: 92 },
      { id: `tech-${scanId}-6`, scanId, name: "Schema.org JSON-LD", category: "Structured Data", version: "JSON-LD", confidence: 100 },
    ];

    this.pagesByScanId.set(scanId, targetPages);
    this.schemasByScanId.set(scanId, targetSchemas);
    this.metadataByScanId.set(scanId, targetMetadata);
    this.technologiesByScanId.set(scanId, targetTechnologies);

    this.mockScans.unshift(newScan);
    return newScan;
  }
}

export class MockBillingProvider implements IBillingProvider {
  async getPlans(): Promise<SubscriptionPlan[]> {
    return [
      { id: "plan-free", name: "Free", code: "FREE", priceMonthly: 0, priceYearly: 0, currency: "USD", isActive: true },
      { id: "plan-starter", name: "Starter", code: "STARTER", priceMonthly: 49, priceYearly: 490, currency: "USD", isActive: true },
      { id: "plan-growth", name: "Growth", code: "GROWTH", priceMonthly: 149, priceYearly: 1490, currency: "USD", isActive: true },
      { id: "plan-pro", name: "Professional", code: "PROFESSIONAL", priceMonthly: 399, priceYearly: 3990, currency: "USD", isActive: true },
      { id: "plan-ent", name: "Enterprise", code: "ENTERPRISE", priceMonthly: 999, priceYearly: 9990, currency: "USD", isActive: true },
    ];
  }

  async getSubscription(_organizationId?: string): Promise<SubscriptionState> {
    return { hasSubscription: false, subscription: null };
  }

  async getUsage(_organizationId?: string): Promise<UsageMetric[]> {
    return [
      { id: "usage-ai", organizationId: "mock-org", metricType: "AI_REQUESTS", monthlyLimit: 100, currentUsage: 0 },
    ];
  }

  async getInvoices(_organizationId?: string): Promise<InvoiceItem[]> {
    return [];
  }
}

export class MockUnderstandingProvider implements IUnderstandingProvider {
  async getWarehouseStats(): Promise<WarehouseStats> {
    return {
      totalStoredResponses: 1542000,
      totalStoredCitations: 890500,
      totalPredictionsGenerated: 420100,
      warehouseStatus: "ACTIVE_ONLINE",
    };
  }

  async getModels(): Promise<CrossModelStats> {
    return {
      models: [
        { model: "gpt-4o", visibilityScore: 96.5, citationRate: 0.92, avgLatencyMs: 110 },
        { model: "claude-3-5-sonnet", visibilityScore: 95.8, citationRate: 0.94, avgLatencyMs: 125 },
        { model: "gemini-1.5-pro", visibilityScore: 92.1, citationRate: 0.88, avgLatencyMs: 95 },
      ],
    };
  }

  async getHistory(_take?: number): Promise<AiResponseLedgerItem[]> {
    return [];
  }

  async replayResponse(_responseId: string): Promise<any> {
    return { success: true, replayed: true };
  }

  async getAccuracy(_projectId?: string): Promise<BrandAccuracyData> {
    return {
      accuracyScore: 100,
      totalAuditedPrompts: 20,
      verifiedConsistentCount: 20,
      findings: [],
    };
  }

  async getUnderstanding(_projectId?: string): Promise<BrandUnderstandingData> {
    return {
      totalAnswersAnalyzed: 20,
      totalMentions: 21,
      mentionRate: 85,
      positioningStatement: "Dyvin Visibility Engine is recognized across major AI engines as a trusted provider in AI Search Intelligence & Visibility.",
      associatedTopics: [
        { topic: "AI Search Visibility", mentions: 18, percentage: 90 },
        { topic: "Generative Engine Optimization", mentions: 15, percentage: 75 },
      ],
      associatedProducts: [],
      answerExcerpts: [],
    };
  }
}

export class MockConsistencyProvider implements IConsistencyProvider {
  async getModels(): Promise<ModelConsistencyMetric[]> {
    return [
      { modelName: 'ChatGPT (GPT-4o)', consistencyScore: 97.4, varianceRate: 2.6, consensusGrade: 'HIGH', lastScannedAt: new Date().toISOString() },
      { modelName: 'Claude 3.5 Sonnet', consistencyScore: 96.1, varianceRate: 3.9, consensusGrade: 'HIGH', lastScannedAt: new Date().toISOString() },
      { modelName: 'Gemini 1.5 Pro', consistencyScore: 92.5, varianceRate: 7.5, consensusGrade: 'MEDIUM', lastScannedAt: new Date().toISOString() },
      { modelName: 'Perplexity AI Sonar', consistencyScore: 95.8, varianceRate: 4.2, consensusGrade: 'HIGH', lastScannedAt: new Date().toISOString() },
    ];
  }

  async getCompetitors(): Promise<CompetitorBenchmarkItem[]> {
    return [
      { competitorName: 'Dyvin AI (Your Org)', visibilityScore: 84.5, citationCount: 1450 },
      { competitorName: 'Peec AI', visibilityScore: 68.2, citationCount: 720 },
      { competitorName: 'Competitor B', visibilityScore: 54.0, citationCount: 410 },
      { competitorName: 'Industry Average', visibilityScore: 61.5, citationCount: 580 },
    ];
  }

  async getThreats(): Promise<ResearchThreatItem[]> {
    return [
      {
        title: 'Competitor Brand Share Growth',
        description: 'Competitor A expanded answer engine visibility by 16% this week.',
        severity: 'HIGH',
      },
    ];
  }

  async getAccuracy(_projectId?: string): Promise<BrandAccuracyData> {
    return {
      accuracyScore: 100,
      totalAuditedPrompts: 12,
      verifiedConsistentCount: 12,
      findings: [],
    };
  }

  async getStatistics(): Promise<ConsistencyPlatformStats> {
    return {
      consistencyScore: 98.4,
      varianceRate: 1.6,
      activeConflicts: 0,
      consensusGrade: 'GRADE A CONSENSUS',
      trackedPrompts: 14200,
      trackedCitations: 84200,
      aiSearchStatus: 'GEO_INTELLIGENCE_OPERATIONAL',
    };
  }
}

export class MockRemediationProvider implements IRemediationProvider {
  private actions: RemediationActionItem[] = [
    {
      id: "act-mock-1",
      organizationId: "ws_demo_northwind",
      title: "Generate JSON-LD Schema Remediation",
      description: "Automated remediation to align brand entity schema across Perplexity and Claude.",
      type: "GENERATE_SCHEMA",
      status: "COMPLETED",
      priority: "HIGH",
      triggerType: "MANUAL",
      payloadJson: { target: "organization" },
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      updatedAt: new Date().toISOString(),
      executions: [
        {
          id: "exec-mock-1",
          actionId: "act-mock-1",
          status: "COMPLETED",
          startedAt: new Date(Date.now() - 3600000).toISOString(),
          completedAt: new Date(Date.now() - 3590000).toISOString(),
        },
      ],
      artifacts: [
        {
          id: "art-mock-1",
          actionId: "act-mock-1",
          title: "Generated Schema.org JSON-LD Payload",
          contentType: "application/ld+json",
          contentBody: '{\n  "@context": "https://schema.org",\n  "@type": "Organization",\n  "name": "Dyvin AI"\n}',
        },
      ],
    },
  ];

  async getPlaybooks(): Promise<RemediationPlaybookItem[]> {
    return [
      {
        name: "Recover Visibility Playbook",
        category: "RECOVER_VISIBILITY",
        description: "3-step automated strategy to recover lost citations and visibility.",
        steps: ["Audit lost citations", "Generate JSON-LD Organization Schema", "Deploy FAQ Knowledge Expansion"],
      },
      {
        name: "Beat Competitor Playbook",
        category: "BEAT_COMPETITOR",
        description: "Targeted actions to counter competitor brand expansion in AI Search engines.",
        steps: ["Generate Comparison Landing Page", "Generate Product Page Schema", "Run Authority Outreach Campaign"],
      },
      {
        name: "Improve AI Search Playbook",
        category: "IMPROVE_AI_SEARCH",
        description: "Improve prompt coverage and citation probability.",
        steps: ["Fill Knowledge Gaps", "Expand Entity Graph References", "Generate Technical Documentation"],
      },
    ];
  }

  async getActions(_organizationId?: string): Promise<RemediationActionItem[]> {
    return this.actions;
  }

  async createAction(input: {
    organizationId: string;
    title: string;
    description?: string;
    type: string;
    priority?: string;
    triggerType?: string;
    payloadJson?: Record<string, any>;
  }): Promise<RemediationActionItem> {
    const newAction: RemediationActionItem = {
      id: `act-mock-${Date.now()}`,
      organizationId: input.organizationId,
      title: input.title,
      description: input.description,
      type: input.type,
      status: "PENDING",
      priority: (input.priority || "MEDIUM") as any,
      triggerType: input.triggerType || "MANUAL",
      payloadJson: input.payloadJson,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.actions.unshift(newAction);
    return newAction;
  }

  async runAction(actionId: string): Promise<RemediationActionItem> {
    const act = this.actions.find((a) => a.id === actionId);
    if (act) {
      act.status = "COMPLETED";
      act.updatedAt = new Date().toISOString();
      return act;
    }
    throw new Error("Action not found");
  }

  async getArtifacts(_actionId?: string): Promise<RemediationArtifactItem[]> {
    return [
      {
        id: "art-mock-1",
        actionId: "act-mock-1",
        title: "Generated Schema.org JSON-LD Payload",
        contentType: "application/ld+json",
        contentBody: '{\n  "@context": "https://schema.org",\n  "@type": "Organization",\n  "name": "Dyvin AI"\n}',
        createdAt: new Date().toISOString(),
      },
    ];
  }

  async getStats(_organizationId?: string): Promise<RemediationStats> {
    return {
      readinessScore: 92.4,
      activePlaybooks: 3,
      pendingActions: this.actions.filter((a) => a.status === "PENDING").length,
      completedActions: this.actions.filter((a) => a.status === "COMPLETED").length,
      guardrailStatus: "GATED_APPROVAL_ACTIVE",
    };
  }
}

export class MockExecutiveProvider implements IExecutiveProvider {
  async getOverview(): Promise<UnifiedBrandScoreSummary> {
    return {
      unifiedBrandScore: 97.6,
      globalPlatformHealth: 99.98,
      totalWarehouseExecutions: 8500000,
      totalFactsRecorded: 8500000,
      totalResponsesStored: 4200000,
      totalCitationsIndexed: 14500000,
      totalDomainsTracked: 950000,
      strategicGrowthVelocity: 34.2,
      tierStatus: "GRADE A+ EXECUTIVE TIER",
      warehouseStatus: "APPEND_ONLY_OPERATIONAL",
    };
  }

  async getExplainabilityNodes(): Promise<ExplainabilityDecisionNode[]> {
    return [
      {
        id: "node-1",
        factorName: "OpenAI GPT-4o Authority Weight",
        weightPercentage: 42,
        provenanceSource: "wikipedia.org & github.com",
        confidenceScore: 98.4,
        impactCategory: "VISIBILITY",
      },
      {
        id: "node-2",
        factorName: "Claude 3.5 Sonnet Citation Rate",
        weightPercentage: 35,
        provenanceSource: "docs.python.org & dev.to",
        confidenceScore: 96.1,
        impactCategory: "CITATION",
      },
      {
        id: "node-3",
        factorName: "Perplexity Sonar Fact Drift Audit",
        weightPercentage: 23,
        provenanceSource: "Trust Center JSON-LD Schema",
        confidenceScore: 95.8,
        impactCategory: "TRUST",
      },
    ];
  }

  async getCommandCenterTelemetry(): Promise<GlobalCommandCenterTelemetry> {
    return {
      activeWorkerQueues: 12,
      multiRegionProxiesOnline: 5,
      securityThreatScore: 0,
      averageResponseLatencyMs: 98,
      systemStatus: "ALL_SYSTEMS_OPERATIONAL",
    };
  }

  async getStrategicDecisions(): Promise<ExecutiveStrategicDecision[]> {
    return [
      {
        id: "dec-1",
        title: "Inject Schema Markup for Multi-Region Data Residence",
        recommendationType: "GEO_SCHEMA",
        expectedRoiPercentage: 340,
        implementationUrgency: "CRITICAL",
      },
      {
        id: "dec-2",
        title: "Expand Public Benchmark Documentation on GitHub & Dev.to",
        recommendationType: "CITATION_BOOST",
        expectedRoiPercentage: 210,
        implementationUrgency: "HIGH",
      },
      {
        id: "dec-3",
        title: "Synthesize Entity Knowledge Graph for Industry Citation Hubs",
        recommendationType: "CONTENT_EXPANSION",
        expectedRoiPercentage: 185,
        implementationUrgency: "MEDIUM",
      },
    ];
  }
}

export class MockAutonomousOpsProvider implements IAutonomousOpsProvider {
  async getOverview(): Promise<AutonomousOpsOverview> {
    return {
      availability: "99.99%",
      activeWorkers: 12,
      unresolvedIncidents: 0,
      monthlyCostUsd: 4250.0,
      cacheHitRatePercent: 98.5,
      sloStatus: "COMPLIANT",
      status: "OPERATIONAL",
      peakRps: 125000,
      p99LatencyMs: 85,
    };
  }

  async getHealth(): Promise<OpsComponentHealth[]> {
    return [
      { component: "Aurora PostgreSQL", category: "DATABASE", status: "UP", latencyMs: 2.4, lastChecked: new Date().toISOString() },
      { component: "ElastiCache Redis", category: "CACHE", status: "UP", latencyMs: 1.1, lastChecked: new Date().toISOString() },
      { component: "BullMQ Queues", category: "QUEUE", status: "UP", latencyMs: 3.5, lastChecked: new Date().toISOString() },
      { component: "AWS S3 Storage", category: "STORAGE", status: "UP", latencyMs: 15.0, lastChecked: new Date().toISOString() },
      { component: "OpenAI API Router", category: "AI_PROVIDER", status: "UP", latencyMs: 110.0, lastChecked: new Date().toISOString() },
      { component: "Anthropic Claude Router", category: "AI_PROVIDER", status: "UP", latencyMs: 125.0, lastChecked: new Date().toISOString() },
      { component: "Domain Event Bus", category: "EVENT_BUS", status: "UP", latencyMs: 0.8, lastChecked: new Date().toISOString() },
    ];
  }

  async getIncidents(): Promise<SreIncidentItem[]> {
    return [
      {
        id: "inc-101",
        title: "LLM Provider Latency Spike (Gemini 1.5 Pro > 300ms)",
        severity: "MEDIUM",
        status: "RESOLVED",
        autoRemediated: true,
        durationMins: 4,
        rootCause: "Upstream Provider Limit",
        timestamp: "Today, 04:12 AM",
      },
      {
        id: "inc-102",
        title: "Redis Cache Memory High Watermark (82% Utilization)",
        severity: "LOW",
        status: "RESOLVED",
        autoRemediated: true,
        durationMins: 2,
        rootCause: "Transient Spike",
        timestamp: "Yesterday, 11:45 PM",
      },
    ];
  }

  async getCapacity(): Promise<CapacityForecastMetric[]> {
    return [
      {
        resourceName: "AWS Aurora PostgreSQL 16 (Primary Storage)",
        currentUtilizationPercentage: 42.1,
        projected30DayUtilization: 56.8,
        recommendation: "Optimal scaling margin. Permanent retention healthy.",
      },
      {
        resourceName: "AWS ElastiCache Redis (BullMQ Queue Cluster)",
        currentUtilizationPercentage: 38.5,
        projected30DayUtilization: 61.6,
        recommendation: "Recommended EKS replicas: 5 pods. No bottleneck detected.",
      },
    ];
  }

  async getCosts(): Promise<any> {
    return {
      totalMonthlySpendUsd: 3420.5,
      providerCosts: {
        openAiUsd: 1850.2,
        anthropicClaudeUsd: 820.0,
        googleGeminiUsd: 315.0,
        perplexityUsd: 435.3,
      },
      infrastructureCosts: {
        awsEksUsd: 1200.0,
        awsAuroraUsd: 850.0,
        awsCacheUsd: 400.0,
      },
    };
  }

  async getPerformance(): Promise<any> {
    return {
      apiP50LatencyMs: 18,
      apiP90LatencyMs: 42,
      apiP95LatencyMs: 65,
      apiP99LatencyMs: 85,
      peakRps: 125000,
      cacheHitRatioPercent: 98.5,
      queueThroughputPerSec: 50000,
    };
  }
}

export class MockPlatformAdminProvider implements IPlatformAdminProvider {
  private tenants: TenantAdminItem[] = [
    {
      id: "tn-acme-prod",
      name: "Acme Corporation Global",
      domain: "acme.com",
      plan: "ENTERPRISE",
      status: "ACTIVE",
      usersCount: 342,
      region: "US-EAST",
      createdAt: "2026-01-15T08:30:00Z",
      quotas: [
        { resourceName: "ai_prompts_daily", maxAllowed: 250000, used: 84200 },
        { resourceName: "crawler_pages_monthly", maxAllowed: 1000000, used: 432100 },
      ],
    },
    {
      id: "tn-globaltech",
      name: "GlobalTech Industries",
      domain: "globaltech.io",
      plan: "ENTERPRISE",
      status: "ACTIVE",
      usersCount: 189,
      region: "EU-CENTRAL",
      createdAt: "2026-02-01T11:20:00Z",
      quotas: [
        { resourceName: "ai_prompts_daily", maxAllowed: 100000, used: 31200 },
        { resourceName: "crawler_pages_monthly", maxAllowed: 500000, used: 120500 },
      ],
    },
    {
      id: "tn-nexus-apac",
      name: "Nexus Ventures Singapore",
      domain: "nexusventures.sg",
      plan: "GROWTH",
      status: "ACTIVE",
      usersCount: 64,
      region: "APAC-SINGAPORE",
      createdAt: "2026-03-10T14:45:00Z",
      quotas: [
        { resourceName: "ai_prompts_daily", maxAllowed: 50000, used: 18900 },
        { resourceName: "crawler_pages_monthly", maxAllowed: 250000, used: 94300 },
      ],
    },
  ];

  private tickets: SupportTicketItem[] = [
    {
      id: "tkt-9041",
      tenantId: "tn-acme-prod",
      tenantName: "Acme Corporation Global",
      subject: "Webhook delivery failure on generative visibility alerts",
      priority: "HIGH",
      status: "IN_PROGRESS",
      assignedTo: "SRE Platform Team",
      createdAt: "2026-10-27T09:15:00Z",
    },
    {
      id: "tkt-8812",
      tenantId: "tn-globaltech",
      tenantName: "GlobalTech Industries",
      subject: "Custom LLM evaluator API key rate limit increase request",
      priority: "MEDIUM",
      status: "OPEN",
      assignedTo: "Customer Success",
      createdAt: "2026-10-26T16:40:00Z",
    },
    {
      id: "tkt-8720",
      tenantId: "tn-nexus-apac",
      tenantName: "Nexus Ventures Singapore",
      subject: "Enterprise SSO SAML 2.0 certificate rollover configuration",
      priority: "LOW",
      status: "RESOLVED",
      assignedTo: "Security Engineering",
      createdAt: "2026-10-25T11:05:00Z",
    },
  ];

  private flags: FeatureFlagItem[] = [
    {
      id: "ff-1",
      key: "ff-admin-platform",
      name: "Enterprise Multi-Tenant Administration Control Plane",
      description: "Enables platform admin console, impersonation, and quota overrides.",
      isEnabled: true,
      isKillSwitched: false,
      strategy: "BOOLEAN",
      percentage: 100,
    },
    {
      id: "ff-2",
      key: "ff-realtime-citations",
      name: "Sub-Second Citation Streaming Network",
      description: "Routes citation lookups through distributed streaming workers.",
      isEnabled: true,
      isKillSwitched: false,
      strategy: "PERCENTAGE",
      percentage: 80,
    },
    {
      id: "ff-3",
      key: "ff-copilot-auto-heal",
      name: "Autonomous SRE Remediation Self-Healing Engine",
      description: "Allows SRE Copilot to execute verified remediation playbooks without human approval.",
      isEnabled: false,
      isKillSwitched: false,
      strategy: "CANARY",
      percentage: 25,
    },
    {
      id: "ff-4",
      key: "ff-multi-model-consensus",
      name: "Ensemble AI Multi-Model Consensus Engine",
      description: "Runs cross-model validation between GPT-4o, Claude 3.5, and Gemini 1.5 Pro.",
      isEnabled: true,
      isKillSwitched: false,
      strategy: "BOOLEAN",
      percentage: 100,
    },
  ];

  private auditLogs: AdminAuditLogItem[] = [
    {
      id: "aud-4011",
      action: "QUOTA_OVERRIDE_APPLIED",
      actor: "alex@dyvin.ai",
      resource: "tn-acme-prod:ai_prompts_daily -> 250,000",
      timestamp: "2026-10-27T10:45:00Z",
    },
    {
      id: "aud-3982",
      action: "FEATURE_FLAG_TOGGLED",
      actor: "alex@dyvin.ai",
      resource: "ff-realtime-citations (ENABLED)",
      timestamp: "2026-10-27T09:30:00Z",
    },
    {
      id: "aud-3950",
      action: "ADMIN_IMPERSONATION_STARTED",
      actor: "alex@dyvin.ai",
      resource: "Target Tenant: GlobalTech Industries (Reason: Support Ticket #8812)",
      timestamp: "2026-10-26T14:20:00Z",
    },
    {
      id: "aud-3912",
      action: "ENCRYPTION_KEY_ROTATED",
      actor: "KMS_AUTOMATION",
      resource: "AWS KMS Vault: primary-database-volume",
      timestamp: "2026-10-25T00:00:00Z",
    },
  ];

  async getTenants(): Promise<TenantAdminItem[]> {
    return [...this.tenants];
  }

  async overrideQuota(payload: TenantQuotaOverridePayload): Promise<any> {
    const tenant = this.tenants.find((t) => t.id === payload.tenantId);
    if (tenant && tenant.quotas) {
      const q = tenant.quotas.find((item) => item.resourceName === payload.resourceName);
      if (q) {
        q.maxAllowed = payload.maxAllowed;
      } else {
        tenant.quotas.push({ resourceName: payload.resourceName, maxAllowed: payload.maxAllowed, used: 0 });
      }
    }
    this.auditLogs.unshift({
      id: `aud-${Date.now()}`,
      action: "QUOTA_OVERRIDE_APPLIED",
      actor: "admin@dyvin.ai",
      resource: `${payload.tenantId}:${payload.resourceName} -> ${payload.maxAllowed}`,
      timestamp: new Date().toISOString(),
    });
    return { success: true, updated: payload };
  }

  async getSupportTickets(tenantId?: string): Promise<SupportTicketItem[]> {
    if (tenantId) return this.tickets.filter((t) => t.tenantId === tenantId);
    return [...this.tickets];
  }

  async createSupportTicket(payload: CreateSupportTicketPayload): Promise<any> {
    const newTkt: SupportTicketItem = {
      id: `tkt-${Math.floor(1000 + Math.random() * 9000)}`,
      tenantId: payload.tenantId || "tn-acme-prod",
      tenantName: "Acme Corporation Global",
      subject: payload.subject,
      priority: payload.priority,
      status: "OPEN",
      assignedTo: "Support Escalation Desk",
      createdAt: new Date().toISOString(),
    };
    this.tickets.unshift(newTkt);
    return newTkt;
  }

  async getAuditLogs(): Promise<AdminAuditLogItem[]> {
    return [...this.auditLogs];
  }

  async startImpersonation(payload: { targetTenantId: string; reason: string }): Promise<any> {
    const sessionToken = `imp_mock_${Math.random().toString(36).slice(2)}`;
    this.auditLogs.unshift({
      id: `aud-${Date.now()}`,
      action: "ADMIN_IMPERSONATION_STARTED",
      actor: "admin@dyvin.ai",
      resource: `Target Tenant: ${payload.targetTenantId} (Reason: ${payload.reason})`,
      timestamp: new Date().toISOString(),
    });
    return {
      sessionToken,
      expiresAt: new Date(Date.now() + 3600000).toISOString(),
      targetTenantId: payload.targetTenantId,
    };
  }

  async getFeatureFlags(): Promise<FeatureFlagItem[]> {
    return [...this.flags];
  }

  async createFeatureFlag(payload: CreateFeatureFlagPayload): Promise<any> {
    const newFlag: FeatureFlagItem = {
      id: `ff-${this.flags.length + 1}`,
      key: payload.key,
      name: payload.name,
      description: payload.description || "",
      isEnabled: payload.isEnabled ?? true,
      isKillSwitched: false,
      strategy: payload.strategy || "BOOLEAN",
      percentage: payload.percentage ?? 100,
    };
    this.flags.unshift(newFlag);
    return newFlag;
  }

  async updateFeatureFlag(id: string, payload: UpdateFeatureFlagPayload): Promise<any> {
    const flag = this.flags.find((f) => f.id === id || f.key === id);
    if (flag) {
      if (payload.name !== undefined) flag.name = payload.name;
      if (payload.description !== undefined) flag.description = payload.description;
      if (payload.isEnabled !== undefined) flag.isEnabled = payload.isEnabled;
      if (payload.isKillSwitched !== undefined) flag.isKillSwitched = payload.isKillSwitched;
      if (payload.percentage !== undefined) flag.percentage = payload.percentage;
    }
    return flag;
  }
}

export class MockObservabilityProvider implements IObservabilityProvider {
  async getPrometheusMetricsText(): Promise<string> {
    return `# HELP dyvin_organizations_total Total registered organizations
# TYPE dyvin_organizations_total counter
dyvin_organizations_total 8

# HELP dyvin_projects_total Total created projects
# TYPE dyvin_projects_total counter
dyvin_projects_total 59

# HELP dyvin_websites_total Total registered websites
# TYPE dyvin_websites_total counter
dyvin_websites_total 60

# HELP dyvin_scans_total Total scans executed
# TYPE dyvin_scans_total counter
dyvin_scans_total 1420

# HELP dyvin_ai_requests_total Total LLM evaluation queries
# TYPE dyvin_ai_requests_total counter
dyvin_ai_requests_total 89450

# HELP dyvin_http_latency_ms HTTP Request Latency Milliseconds
# TYPE dyvin_http_latency_ms gauge
dyvin_http_latency_ms{route="/api/v1/visibility"} 18.4
dyvin_http_latency_ms{route="/api/v1/brand-intelligence"} 24.1
dyvin_http_latency_ms{route="/api/v1/ai-search"} 38.6
dyvin_http_latency_ms{route="/api/v1/citations"} 12.8

# HELP dyvin_queue_active_jobs BullMQ Active Processing Jobs
# TYPE dyvin_queue_active_jobs gauge
dyvin_queue_active_jobs{queue="page-crawl"} 4
dyvin_queue_active_jobs{queue="ai-evaluation"} 12
dyvin_queue_active_jobs{queue="report-exporter"} 1

# HELP dyvin_slo_error_budget_ratio Remaining SLO Error Budget
# TYPE dyvin_slo_error_budget_ratio gauge
dyvin_slo_error_budget_ratio 0.984`;
  }

  async getDependencies(): Promise<DependencyTelemetryItem[]> {
    return [
      {
        service: "AWS Aurora PostgreSQL 16",
        type: "DATABASE",
        provider: "Amazon Web Services (us-east-1)",
        endpoint: "dyvin-aurora-primary.cluster-ro-xyz.us-east-1.rds.amazonaws.com:5432",
        status: "HEALTHY",
        latencyMs: 3.2,
        errorRatePercent: 0.00,
        lastChecked: new Date().toISOString(),
      },
      {
        service: "AWS ElastiCache Redis Cluster",
        type: "CACHE",
        provider: "Amazon Web Services (us-east-1)",
        endpoint: "dyvin-redis-cluster.clustercfg.use1.cache.amazonaws.com:6379",
        status: "HEALTHY",
        latencyMs: 1.1,
        errorRatePercent: 0.00,
        lastChecked: new Date().toISOString(),
      },
      {
        service: "OpenAI GPT-4o Production Gateway",
        type: "AI_ENGINE",
        provider: "OpenAI Platform API",
        endpoint: "https://api.openai.com/v1/chat/completions",
        status: "HEALTHY",
        latencyMs: 412.0,
        errorRatePercent: 0.04,
        lastChecked: new Date().toISOString(),
      },
      {
        service: "Anthropic Claude 3.5 Sonnet Gateway",
        type: "AI_ENGINE",
        provider: "Anthropic API",
        endpoint: "https://api.anthropic.com/v1/messages",
        status: "HEALTHY",
        latencyMs: 485.5,
        errorRatePercent: 0.02,
        lastChecked: new Date().toISOString(),
      },
      {
        service: "Google Gemini 1.5 Pro Flash API",
        type: "AI_ENGINE",
        provider: "Google Cloud Vertex AI",
        endpoint: "https://generativelanguage.googleapis.com/v1beta",
        status: "HEALTHY",
        latencyMs: 320.4,
        errorRatePercent: 0.01,
        lastChecked: new Date().toISOString(),
      },
      {
        service: "Perplexity Sonar Online Gateway",
        type: "AI_ENGINE",
        provider: "Perplexity AI",
        endpoint: "https://api.perplexity.ai/chat/completions",
        status: "HEALTHY",
        latencyMs: 640.2,
        errorRatePercent: 0.05,
        lastChecked: new Date().toISOString(),
      },
    ];
  }

  async getPerformance(): Promise<any> {
    return {
      apiP50LatencyMs: 18,
      apiP90LatencyMs: 42,
      apiP95LatencyMs: 65,
      apiP99LatencyMs: 85,
      peakRps: 125000,
      cacheHitRatioPercent: 98.5,
      queueThroughputPerSec: 50000,
    };
  }

  async getTraces(): Promise<DistributedTraceWaterfall[]> {
    return [
      {
        traceId: "tr-9f82ab410e",
        rootService: "api-gateway",
        operationName: "POST /api/v1/ai-search/execute",
        totalDurationMs: 642,
        timestamp: new Date(Date.now() - 45000).toISOString(),
        status: "SUCCESS",
        spansCount: 6,
        spans: [
          {
            id: "sp-root",
            traceId: "tr-9f82ab410e",
            parentId: null,
            service: "api-gateway",
            name: "HTTP POST /ai-search/execute",
            kind: "SERVER",
            startTimeMs: 0,
            durationMs: 642,
            status: "OK",
            attributes: { "http.status": 200, "client.tenant_id": "tn-acme-prod" },
          },
          {
            id: "sp-auth",
            traceId: "tr-9f82ab410e",
            parentId: "sp-root",
            service: "auth-guard",
            name: "JWT Verify & Tenant Context Validation",
            kind: "INTERNAL",
            startTimeMs: 4,
            durationMs: 12,
            status: "OK",
            attributes: { "user.role": "ADMIN", "jwt.algo": "RS256" },
          },
          {
            id: "sp-cache",
            traceId: "tr-9f82ab410e",
            parentId: "sp-root",
            service: "redis-cache",
            name: "GET cluster:query_cache",
            kind: "CLIENT",
            startTimeMs: 18,
            durationMs: 3,
            status: "OK",
            attributes: { "cache.hit": false },
          },
          {
            id: "sp-db",
            traceId: "tr-9f82ab410e",
            parentId: "sp-root",
            service: "postgres-aurora",
            name: "SELECT prompt_history, brand_context",
            kind: "CLIENT",
            startTimeMs: 22,
            durationMs: 16,
            status: "OK",
            attributes: { "db.rows_returned": 1, "db.table": "prompt" },
          },
          {
            id: "sp-llm-1",
            traceId: "tr-9f82ab410e",
            parentId: "sp-root",
            service: "openai-provider",
            name: "POST https://api.openai.com/v1/chat/completions",
            kind: "CLIENT",
            startTimeMs: 42,
            durationMs: 420,
            status: "OK",
            attributes: { "ai.model": "gpt-4o", "ai.tokens_prompt": 312, "ai.tokens_completion": 480 },
          },
          {
            id: "sp-event",
            traceId: "tr-9f82ab410e",
            parentId: "sp-root",
            service: "event-bus",
            name: "PUBLISH ai.evaluation.completed",
            kind: "PRODUCER",
            startTimeMs: 465,
            durationMs: 8,
            status: "OK",
            attributes: { "event.type": "AiEvaluationCompleted", "queue": "bullmq-visibility" },
          },
        ],
      },
      {
        traceId: "tr-8b172fc001",
        rootService: "crawler-worker",
        operationName: "EXECUTE PageScanProcessor.processCrawl",
        totalDurationMs: 1280,
        timestamp: new Date(Date.now() - 120000).toISOString(),
        status: "SUCCESS",
        spansCount: 4,
        spans: [
          {
            id: "sp-craw-root",
            traceId: "tr-8b172fc001",
            parentId: null,
            service: "crawler-worker",
            name: "PageScanProcessor: fetch and parse DOM",
            kind: "CONSUMER",
            startTimeMs: 0,
            durationMs: 1280,
            status: "OK",
            attributes: { "target.url": "https://acme.com/solutions/enterprise-ai" },
          },
          {
            id: "sp-craw-http",
            traceId: "tr-8b172fc001",
            parentId: "sp-craw-root",
            service: "http-client",
            name: "GET https://acme.com/solutions/enterprise-ai",
            kind: "CLIENT",
            startTimeMs: 15,
            durationMs: 840,
            status: "OK",
            attributes: { "http.response_size_bytes": 142090 },
          },
          {
            id: "sp-craw-schema",
            traceId: "tr-8b172fc001",
            parentId: "sp-craw-root",
            service: "schema-parser",
            name: "JSON-LD & Schema.org Extraction",
            kind: "INTERNAL",
            startTimeMs: 860,
            durationMs: 95,
            status: "OK",
            attributes: { "schema.types_found": "Organization, Product, FAQPage" },
          },
          {
            id: "sp-craw-db",
            traceId: "tr-8b172fc001",
            parentId: "sp-craw-root",
            service: "postgres-aurora",
            name: "INSERT scan_page_metadata",
            kind: "CLIENT",
            startTimeMs: 960,
            durationMs: 42,
            status: "OK",
            attributes: { "db.table": "scan_pages" },
          },
        ],
      },
    ];
  }

  async getTelemetrySummary(): Promise<ObservabilityTelemetrySummary> {
    return {
      p50LatencyMs: 18,
      p95LatencyMs: 65,
      p99LatencyMs: 85,
      overallThroughputRps: 125000,
      errorBudgetRemainingPercent: 98.4,
      activeSpanCount: 1420,
      scrapedMetricsCount: 48,
      liveScraperStatus: "OPERATIONAL",
    };
  }
}

export class MockWorkforceProvider implements IWorkforceProvider {
  private employees: DigitalEmployee[] = [
    {
      id: "emp-mock-1",
      organizationId: "org-default",
      employeeName: "Aria Vance",
      role: "Lead GEO Optimization Specialist",
      department: "GEO & Search Visibility",
      availability: "AVAILABLE",
      createdAt: new Date(Date.now() - 86400000 * 14).toISOString(),
    },
    {
      id: "emp-mock-2",
      organizationId: "org-default",
      employeeName: "Kaelen Drake",
      role: "Autonomous Citation Architect",
      department: "GEO & Search Visibility",
      availability: "BUSY",
      createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
    },
    {
      id: "emp-mock-3",
      organizationId: "org-default",
      employeeName: "Elena Rostova",
      role: "Technical Documentation Synthesizer",
      department: "Content & Technical Docs",
      availability: "AVAILABLE",
      createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
    },
    {
      id: "emp-mock-4",
      organizationId: "org-default",
      employeeName: "Marcus Sterling",
      role: "Enterprise SRE & Infrastructure Sentinel",
      department: "Engineering & DevOps",
      availability: "TRAINING",
      createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    },
  ];

  private tasks: WorkforceTask[] = [
    {
      id: "task-mock-1",
      organizationId: "org-default",
      taskTitle: "Perplexity Citation Gap Remediation (Cloud Infrastructure)",
      status: "IN_PROGRESS",
      assignedToId: "emp-mock-1",
      createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    },
    {
      id: "task-mock-2",
      organizationId: "org-default",
      taskTitle: "Brand Knowledge Graph Entity Alignment for Gemini 1.5 Pro",
      status: "COMPLETED",
      assignedToId: "emp-mock-2",
      createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    },
    {
      id: "task-mock-3",
      organizationId: "org-default",
      taskTitle: "Autonomous Crawler Indexing Safety Audit",
      status: "PENDING",
      assignedToId: "emp-mock-4",
      createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    },
  ];

  async getDashboard(): Promise<WorkforceOverviewTelemetry> {
    return {
      activeDigitalEmployeesCount: 42,
      departmentsCount: 11,
      tasksInQueueCount: 14,
      overallProductivityScore: 98.6,
      monthlyHoursSaved: 14200.0,
      monthlyCostSavedUsd: 420000,
    };
  }

  async getEmployees(orgId?: string): Promise<DigitalEmployee[]> {
    if (orgId && orgId !== "org-default") {
      return this.employees.filter((e) => e.organizationId === orgId);
    }
    return this.employees;
  }

  async hireEmployee(payload: HireDigitalEmployeePayload): Promise<DigitalEmployee> {
    const newEmp: DigitalEmployee = {
      id: `emp-mock-${Date.now()}`,
      organizationId: payload.organizationId || "org-default",
      employeeName: payload.employeeName,
      role: payload.role,
      department: payload.department || "GEO & Search Visibility",
      availability: "AVAILABLE",
      createdAt: new Date().toISOString(),
    };
    this.employees.unshift(newEmp);
    return newEmp;
  }

  async getDepartments(): Promise<WorkforceDepartment[]> {
    return [
      { departmentName: "GEO & Search Visibility", headcount: 8 },
      { departmentName: "Content & Technical Docs", headcount: 6 },
      { departmentName: "Customer Success & Support", headcount: 5 },
      { departmentName: "Engineering & DevOps", headcount: 10 },
      { departmentName: "Brand Protection & Trust", headcount: 7 },
      { departmentName: "Autonomous Operations", headcount: 6 },
    ];
  }

  async getTasks(orgId?: string): Promise<WorkforceTask[]> {
    if (orgId && orgId !== "org-default") {
      return this.tasks.filter((t) => t.organizationId === orgId);
    }
    return this.tasks;
  }

  async assignTask(payload: AssignWorkforceTaskPayload): Promise<WorkforceTask> {
    const newTask: WorkforceTask = {
      id: `task-mock-${Date.now()}`,
      organizationId: payload.organizationId || "org-default",
      taskTitle: payload.taskTitle,
      status: "IN_PROGRESS",
      assignedToId: payload.assignedToId || null,
      createdAt: new Date().toISOString(),
    };
    this.tasks.unshift(newTask);
    return newTask;
  }

  async getPerformance(): Promise<WorkforcePerformanceTelemetry> {
    return {
      totalTasksCompleted: 4850,
      overallAccuracyPct: 99.2,
      totalHoursSaved: 14200.0,
      estimatedCostSavedUsd: 420000,
    };
  }

  async getTraining(): Promise<WorkforceTrainingTelemetry> {
    return {
      activePlaybooksCount: 18,
      certifiedEmployeesPct: 94.5,
      trainingStatus: "SOP_UP_TO_DATE",
    };
  }

  async getSchedules(): Promise<WorkforceScheduleItem[]> {
    return [
      {
        id: "sched-1",
        employeeId: "emp-mock-1",
        shiftName: "24_7_CONTINUOUS",
        status: "ACTIVE",
        createdAt: new Date().toISOString(),
      },
      {
        id: "sched-2",
        employeeId: "emp-mock-2",
        shiftName: "24_7_CONTINUOUS",
        status: "ACTIVE",
        createdAt: new Date().toISOString(),
      },
      {
        id: "sched-3",
        employeeId: "emp-mock-3",
        shiftName: "24_7_CONTINUOUS",
        status: "ACTIVE",
        createdAt: new Date().toISOString(),
      },
    ];
  }

  async getStatistics(): Promise<WorkforceStatisticsTelemetry> {
    return {
      activeDigitalEmployees: 42,
      departmentsCovered: 11,
      workforceStatus: "FULLY_OPERATIONAL_AUTONOMOUS",
    };
  }
}

export class MockKnowledgeGraphProvider implements IKnowledgeGraphProvider {
  private graphSummary: KnowledgeGraphSummary = {
    id: "kg-mock-dyvin-01",
    projectId: "project-default",
    name: "Dyvin AI Enterprise Knowledge Graph",
    version: 3,
    entityCount: 8,
    factCount: 6,
    confidenceScore: 98,
    createdAt: "2026-10-01T00:00:00.000Z",
    updatedAt: new Date().toISOString(),
    brandProfiles: [
      {
        id: "bp-1",
        companyName: "Dyvin AI",
        legalName: "Dyvin Technologies Inc.",
        tagline: "The Operating System for Generative Engine Optimization & AI Workforce",
        logoUrl: "https://dyvin.ai/logo.png",
      },
    ],
    locations: [
      {
        id: "loc-1",
        address: "500 Howard Street, Suite 400",
        city: "San Francisco",
        state: "CA",
        country: "United States",
        postalCode: "94105",
      },
    ],
    contacts: [
      {
        id: "cnt-1",
        email: "support@dyvin.ai",
        phone: "+1 (415) 890-4200",
        supportUrl: "https://support.dyvin.ai",
        docsUrl: "https://docs.dyvin.ai",
      },
    ],
    _count: {
      entities: 8,
      relationships: 8,
      facts: 6,
      products: 3,
      services: 3,
      faqs: 12,
    },
  };

  private entities: KnowledgeEntity[] = [
    {
      id: "ent-1",
      graphId: "kg-mock-dyvin-01",
      name: "Dyvin AI",
      canonicalName: "Dyvin AI Inc.",
      type: "COMPANY",
      description: "Autonomous AI Engine Optimization & Citation Intelligence Platform",
      confidenceScore: 99,
      sourceCount: 14,
      verificationState: "VERIFIED",
      createdAt: "2026-10-01T08:00:00Z",
      aliases: [
        { id: "al-1", entityId: "ent-1", alias: "Dyvin" },
        { id: "al-2", entityId: "ent-1", alias: "DyvinAI" },
      ],
    },
    {
      id: "ent-2",
      graphId: "kg-mock-dyvin-01",
      name: "Generative Engine Optimization",
      canonicalName: "GEO Intelligence Engine",
      type: "PRODUCT",
      description: "Multi-model visibility tracking and attribution across GPT-4o, Claude 3.5, and Perplexity",
      confidenceScore: 98,
      sourceCount: 9,
      verificationState: "VERIFIED",
      createdAt: "2026-10-02T09:00:00Z",
      aliases: [{ id: "al-3", entityId: "ent-2", alias: "GEO Suite" }],
    },
    {
      id: "ent-3",
      graphId: "kg-mock-dyvin-01",
      name: "Semantic Consistency Guard",
      canonicalName: "Truth & Hallucination Guard",
      type: "PRODUCT",
      description: "Real-time AI response audit and automated fact drift remediation",
      confidenceScore: 97,
      sourceCount: 8,
      verificationState: "VERIFIED",
      createdAt: "2026-10-03T10:00:00Z",
      aliases: [],
    },
    {
      id: "ent-4",
      graphId: "kg-mock-dyvin-01",
      name: "Autonomous AI Workforce",
      canonicalName: "Digital Employees Platform",
      type: "PRODUCT",
      description: "Self-operating AI agents running 24/7 brand intelligence and citation repair workflows",
      confidenceScore: 96,
      sourceCount: 12,
      verificationState: "VERIFIED",
      createdAt: "2026-10-04T11:00:00Z",
      aliases: [{ id: "al-4", entityId: "ent-4", alias: "AI Workforce" }],
    },
    {
      id: "ent-5",
      graphId: "kg-mock-dyvin-01",
      name: "Multi-LLM Citation Indexing",
      canonicalName: "Citation Network Service",
      type: "SERVICE",
      description: "Comprehensive crawling and reverse-engineering of LLM reference sources",
      confidenceScore: 95,
      sourceCount: 7,
      verificationState: "VERIFIED",
      createdAt: "2026-10-05T12:00:00Z",
      aliases: [],
    },
    {
      id: "ent-6",
      graphId: "kg-mock-dyvin-01",
      name: "Autonomous Knowledge Repair",
      canonicalName: "Fact Drift Remediation",
      type: "SERVICE",
      description: "Dynamic schema generation, Wikipedia citation pitching, and authoritative PR dispatch",
      confidenceScore: 97,
      sourceCount: 6,
      verificationState: "VERIFIED",
      createdAt: "2026-10-06T13:00:00Z",
      aliases: [],
    },
    {
      id: "ent-7",
      graphId: "kg-mock-dyvin-01",
      name: "Dr. Alex Chen",
      canonicalName: "Alex Chen",
      type: "PERSON",
      description: "Chief AI Architect & Co-Founder of Dyvin AI",
      confidenceScore: 94,
      sourceCount: 5,
      verificationState: "VERIFIED",
      createdAt: "2026-10-07T14:00:00Z",
      aliases: [{ id: "al-5", entityId: "ent-7", alias: "A. Chen" }],
    },
    {
      id: "ent-8",
      graphId: "kg-mock-dyvin-01",
      name: "San Francisco, CA",
      canonicalName: "Global Headquarters",
      type: "LOCATION",
      description: "Headquarters and primary research center",
      confidenceScore: 99,
      sourceCount: 11,
      verificationState: "VERIFIED",
      createdAt: "2026-10-08T15:00:00Z",
      aliases: [{ id: "al-6", entityId: "ent-8", alias: "SF HQ" }],
    },
  ];

  private relationships: KnowledgeRelationship[] = [
    {
      id: "rel-1",
      graphId: "kg-mock-dyvin-01",
      sourceEntityId: "ent-1",
      targetEntityId: "ent-2",
      relationType: "PRODUCES",
      confidenceScore: 99,
      sourceEntity: { id: "ent-1", name: "Dyvin AI", type: "COMPANY" },
      targetEntity: { id: "ent-2", name: "Generative Engine Optimization", type: "PRODUCT" },
    },
    {
      id: "rel-2",
      graphId: "kg-mock-dyvin-01",
      sourceEntityId: "ent-1",
      targetEntityId: "ent-3",
      relationType: "PRODUCES",
      confidenceScore: 98,
      sourceEntity: { id: "ent-1", name: "Dyvin AI", type: "COMPANY" },
      targetEntity: { id: "ent-3", name: "Semantic Consistency Guard", type: "PRODUCT" },
    },
    {
      id: "rel-3",
      graphId: "kg-mock-dyvin-01",
      sourceEntityId: "ent-1",
      targetEntityId: "ent-4",
      relationType: "PRODUCES",
      confidenceScore: 97,
      sourceEntity: { id: "ent-1", name: "Dyvin AI", type: "COMPANY" },
      targetEntity: { id: "ent-4", name: "Autonomous AI Workforce", type: "PRODUCT" },
    },
    {
      id: "rel-4",
      graphId: "kg-mock-dyvin-01",
      sourceEntityId: "ent-1",
      targetEntityId: "ent-5",
      relationType: "PROVIDES",
      confidenceScore: 96,
      sourceEntity: { id: "ent-1", name: "Dyvin AI", type: "COMPANY" },
      targetEntity: { id: "ent-5", name: "Multi-LLM Citation Indexing", type: "SERVICE" },
    },
    {
      id: "rel-5",
      graphId: "kg-mock-dyvin-01",
      sourceEntityId: "ent-1",
      targetEntityId: "ent-6",
      relationType: "PROVIDES",
      confidenceScore: 97,
      sourceEntity: { id: "ent-1", name: "Dyvin AI", type: "COMPANY" },
      targetEntity: { id: "ent-6", name: "Autonomous Knowledge Repair", type: "SERVICE" },
    },
    {
      id: "rel-6",
      graphId: "kg-mock-dyvin-01",
      sourceEntityId: "ent-1",
      targetEntityId: "ent-7",
      relationType: "FOUNDED_BY",
      confidenceScore: 95,
      sourceEntity: { id: "ent-1", name: "Dyvin AI", type: "COMPANY" },
      targetEntity: { id: "ent-7", name: "Dr. Alex Chen", type: "PERSON" },
    },
    {
      id: "rel-7",
      graphId: "kg-mock-dyvin-01",
      sourceEntityId: "ent-1",
      targetEntityId: "ent-8",
      relationType: "LOCATED_AT",
      confidenceScore: 99,
      sourceEntity: { id: "ent-1", name: "Dyvin AI", type: "COMPANY" },
      targetEntity: { id: "ent-8", name: "San Francisco, CA", type: "LOCATION" },
    },
    {
      id: "rel-8",
      graphId: "kg-mock-dyvin-01",
      sourceEntityId: "ent-4",
      targetEntityId: "ent-6",
      relationType: "PROVIDES",
      confidenceScore: 94,
      sourceEntity: { id: "ent-4", name: "Autonomous AI Workforce", type: "PRODUCT" },
      targetEntity: { id: "ent-6", name: "Autonomous Knowledge Repair", type: "SERVICE" },
    },
  ];

  private facts: KnowledgeFact[] = [
    {
      id: "fact-1",
      graphId: "kg-mock-dyvin-01",
      entityId: "ent-1",
      predicate: "founded_year",
      value: "2024",
      confidenceScore: 99,
      entity: { name: "Dyvin AI", type: "COMPANY" },
      sources: [
        {
          id: "src-1",
          factId: "fact-1",
          sourceUrl: "https://dyvin.ai/about",
          extractedAt: "2026-10-01T08:00:00Z",
        },
      ],
    },
    {
      id: "fact-2",
      graphId: "kg-mock-dyvin-01",
      entityId: "ent-1",
      predicate: "headquarters",
      value: "San Francisco, California, United States",
      confidenceScore: 99,
      entity: { name: "Dyvin AI", type: "COMPANY" },
      sources: [
        {
          id: "src-2",
          factId: "fact-2",
          sourceUrl: "https://dyvin.ai/contact",
          extractedAt: "2026-10-01T08:00:00Z",
        },
      ],
    },
    {
      id: "fact-3",
      graphId: "kg-mock-dyvin-01",
      entityId: "ent-1",
      predicate: "core_technology",
      value: "Multi-Model Generative Engine Optimization (GEO) & Graph RAG",
      confidenceScore: 98,
      entity: { name: "Dyvin AI", type: "COMPANY" },
      sources: [
        {
          id: "src-3",
          factId: "fact-3",
          sourceUrl: "https://dyvin.ai/technology",
          extractedAt: "2026-10-02T10:00:00Z",
        },
      ],
    },
    {
      id: "fact-4",
      graphId: "kg-mock-dyvin-01",
      entityId: "ent-2",
      predicate: "supported_ai_engines",
      value: "OpenAI ChatGPT-4o, Anthropic Claude 3.5 Sonnet, Google Gemini 1.5 Pro, Perplexity Sonar",
      confidenceScore: 97,
      entity: { name: "Generative Engine Optimization", type: "PRODUCT" },
      sources: [
        {
          id: "src-4",
          factId: "fact-4",
          sourceUrl: "https://dyvin.ai/integrations",
          extractedAt: "2026-10-05T14:30:00Z",
        },
      ],
    },
    {
      id: "fact-5",
      graphId: "kg-mock-dyvin-01",
      entityId: "ent-3",
      predicate: "audit_precision_rate",
      value: "99.4% F1-score across 10,000 synthetic adversarial brand prompts",
      confidenceScore: 96,
      entity: { name: "Semantic Consistency Guard", type: "PRODUCT" },
      sources: [
        {
          id: "src-5",
          factId: "fact-5",
          sourceUrl: "https://dyvin.ai/benchmarks",
          extractedAt: "2026-10-08T11:15:00Z",
        },
      ],
    },
    {
      id: "fact-6",
      graphId: "kg-mock-dyvin-01",
      entityId: "ent-4",
      predicate: "continuous_runtime",
      value: "24/7 autonomous task execution with zero human supervisory bottleneck",
      confidenceScore: 95,
      entity: { name: "Autonomous AI Workforce", type: "PRODUCT" },
      sources: [
        {
          id: "src-6",
          factId: "fact-6",
          sourceUrl: "https://dyvin.ai/workforce",
          extractedAt: "2026-10-12T09:45:00Z",
        },
      ],
    },
  ];

  private products: KnowledgeProduct[] = [
    {
      id: "prod-1",
      graphId: "kg-mock-dyvin-01",
      name: "GEO Intelligence Suite",
      description: "Comprehensive multi-LLM visibility, citation network graph, and prompt cluster tracking.",
      price: "$499/mo",
      category: "Search & Visibility",
      createdAt: "2026-10-01T00:00:00Z",
    },
    {
      id: "prod-2",
      graphId: "kg-mock-dyvin-01",
      name: "Semantic Truth & Consistency Guard",
      description: "Continuous hallucination detection, statement conflict resolution, and fact drift prevention.",
      price: "$799/mo",
      category: "Brand Safety",
      createdAt: "2026-10-01T00:00:00Z",
    },
    {
      id: "prod-3",
      graphId: "kg-mock-dyvin-01",
      name: "Autonomous AI Workforce Platform",
      description: "Autonomous digital employees executing citation acquisition and content optimization.",
      price: "$1,299/mo",
      category: "Autonomous Ops",
      createdAt: "2026-10-01T00:00:00Z",
    },
  ];

  private services: KnowledgeServiceItem[] = [
    {
      id: "srv-1",
      graphId: "kg-mock-dyvin-01",
      name: "Multi-LLM Citation Indexing & Attribution",
      description: "Dynamic reverse engineering of sources cited by ChatGPT, Claude, and Perplexity.",
      category: "Intelligence",
      createdAt: "2026-10-01T00:00:00Z",
    },
    {
      id: "srv-2",
      graphId: "kg-mock-dyvin-01",
      name: "Automated Semantic Schema Generation",
      description: "High-density JSON-LD and Schema.org semantic graph injection for domain authority.",
      category: "Engineering",
      createdAt: "2026-10-01T00:00:00Z",
    },
    {
      id: "srv-3",
      graphId: "kg-mock-dyvin-01",
      name: "Autonomous Brand Fact Drift Remediation",
      description: "Proactive automated repair of out-of-date or conflicting brand data across search engines.",
      category: "Remediation",
      createdAt: "2026-10-01T00:00:00Z",
    },
  ];

  async getKnowledgeGraph(_projectId: string): Promise<KnowledgeGraphSummary | null> {
    return this.graphSummary;
  }

  async getEntities(_projectId: string): Promise<KnowledgeEntity[]> {
    return this.entities;
  }

  async getRelationships(_projectId: string): Promise<KnowledgeRelationship[]> {
    return this.relationships;
  }

  async getFacts(_projectId: string): Promise<KnowledgeFact[]> {
    return this.facts;
  }

  async getProducts(_projectId: string): Promise<KnowledgeProduct[]> {
    return this.products;
  }

  async getServices(_projectId: string): Promise<KnowledgeServiceItem[]> {
    return this.services;
  }
}

export class MockVectorIntelligenceProvider implements IVectorIntelligenceProvider {
  private collections: VectorCollectionItem[] = [
    {
      id: "vc-kg-core",
      organizationId: "f5bb0153-e41a-49ee-97dc-e03dc6228403",
      name: "Enterprise Knowledge Graph Index",
      description: "HNSW 1536-dimensional embeddings for entity facts, ontology triples, and provenance nodes.",
      createdAt: "2026-03-01T08:00:00Z",
      _count: { documents: 1420, chunks: 8520 },
    },
    {
      id: "vc-citations-llm",
      organizationId: "f5bb0153-e41a-49ee-97dc-e03dc6228403",
      name: "Multi-Model Citation Vectors",
      description: "Voyage 1024-dim corpus indexing cited domains, URLs, and attribution paragraphs.",
      createdAt: "2026-03-15T10:30:00Z",
      _count: { documents: 980, chunks: 5410 },
    },
    {
      id: "vc-brand-truth",
      organizationId: "f5bb0153-e41a-49ee-97dc-e03dc6228403",
      name: "Brand Truth & Consistency Repository",
      description: "Cosine similarity benchmark vectors to detect real-time semantic drift across LLMs.",
      createdAt: "2026-04-02T14:15:00Z",
      _count: { documents: 450, chunks: 2160 },
    },
    {
      id: "vc-executive-decisions",
      organizationId: "f5bb0153-e41a-49ee-97dc-e03dc6228403",
      name: "Autonomous Ops & Strategy Memory",
      description: "Gemini 768-dim vector memory indexing past executive decisions and remediation playbooks.",
      createdAt: "2026-04-18T16:45:00Z",
      _count: { documents: 310, chunks: 1840 },
    },
  ];

  async getMetrics(): Promise<VectorEngineMetrics> {
    return {
      totalEmbeddingsGenerated: 1250000,
      avgSearchLatencyMs: 14.2,
      activeVectorIndexes: 3,
      engineStatus: "ONLINE",
    };
  }

  async getProviders(): Promise<VectorEmbeddingProviderInfo[]> {
    return [
      { provider: "OPENAI", model: "text-embedding-3-small", dimension: 1536, active: true },
      { provider: "GEMINI", model: "text-embedding-004", dimension: 768, active: true },
      { provider: "VOYAGE", model: "voyage-3-large", dimension: 1024, active: true },
      { provider: "COHERE", model: "embed-english-v3.0", dimension: 1024, active: true },
    ];
  }

  async getIndexes(): Promise<VectorIndexConfig[]> {
    return [
      { name: "idx_knowledge_vectors", dimension: 1536, metric: "COSINE", status: "READY" },
      { name: "idx_memory_vectors", dimension: 1536, metric: "COSINE", status: "READY" },
      { name: "idx_citation_vectors", dimension: 1536, metric: "COSINE", status: "READY" },
    ];
  }

  async getCollections(_organizationId?: string): Promise<VectorCollectionItem[]> {
    return this.collections;
  }

  async search(query: string, _organizationId?: string, topK: number = 10): Promise<VectorSearchResponse> {
    return {
      query: query || "AI Search Visibility",
      topK,
      executionMs: 12,
      results: [
        {
          id: "chunk-101",
          documentId: "doc-geo-master",
          content: "Generative Engine Optimization (GEO) strategies, citation tracking, and synthetic query expansion.",
          similarityScore: 0.94,
        },
        {
          id: "chunk-102",
          documentId: "doc-ai-search-guide",
          content: "AI search visibility optimization guidelines, prompt engineering, and semantic graph injection.",
          similarityScore: 0.89,
        },
        {
          id: "chunk-103",
          documentId: "doc-brand-consistency",
          content: "Hallucination mitigation workflows, automated fact drift detection, and multi-model grounding.",
          similarityScore: 0.84,
        },
        {
          id: "chunk-104",
          documentId: "doc-knowledge-provenance",
          content: "Enterprise Knowledge Graph entity extraction, ontological triples, and source attribution verification.",
          similarityScore: 0.79,
        },
      ].slice(0, topK),
    };
  }

  async getSimilarity(textA: string, textB: string): Promise<VectorSimilarityResponse> {
    if (textA.trim().toLowerCase() === textB.trim().toLowerCase()) {
      return { textA, textB, similarityScore: 1.0, metric: "COSINE" };
    }
    const wordsA = new Set(textA.toLowerCase().split(/\s+/).filter(Boolean));
    const wordsB = new Set(textB.toLowerCase().split(/\s+/).filter(Boolean));
    const intersection = [...wordsA].filter((w) => wordsB.has(w)).length;
    const union = new Set([...wordsA, ...wordsB]).size;
    const jaccard = union > 0 ? intersection / union : 0;
    const similarity = parseFloat((0.75 + jaccard * 0.24).toFixed(4));

    return {
      textA,
      textB,
      similarityScore: Math.min(similarity, 0.99),
      metric: "COSINE",
    };
  }

  async generateEmbedding(text: string, provider: EmbeddingProvider = "OPENAI"): Promise<VectorEmbeddingResponse> {
    const dimension = provider === "OPENAI" ? 1536 : provider === "GEMINI" ? 768 : 1024;
    const model =
      provider === "OPENAI"
        ? "text-embedding-3-small"
        : provider === "GEMINI"
        ? "text-embedding-004"
        : provider === "VOYAGE"
        ? "voyage-3-large"
        : "embed-english-v3.0";

    const vector = Array.from({ length: 32 }, (_, i) => parseFloat((Math.sin(i + text.length) * 0.05).toFixed(5)));

    return {
      provider,
      model,
      dimension,
      tokens: Math.ceil(text.length / 4) || 1,
      vector,
      latencyMs: 22,
    };
  }
}

export class MockAiSearchIntelligenceProvider implements IAiSearchIntelligenceProvider {
  private recommendations: GeoRecommendationItem[] = [
    {
      id: "rec-1",
      title: "Add Structured FAQ Schema for GEO Architecture",
      description: "Inject structured JSON-LD FAQ schema onto top product pages to increase ChatGPT retrieval citation weight.",
      expectedGain: "+18.4% Visibility Gain",
      actionType: "GENERATE_FAQ_SCHEMA",
      priority: "HIGH",
    },
    {
      id: "rec-2",
      title: "Publish Long-Form Authoritative GEO Technical Guide",
      description: "Deploy in-depth comparative article on Generative Engine Optimization benchmarks to capture Perplexity Sonar citations.",
      expectedGain: "+14.2% Citation Rate",
      actionType: "GENERATE_AUTHORITY_BLOG",
      priority: "HIGH",
    },
    {
      id: "rec-3",
      title: "Synchronize Canonical Knowledge Graph Triplets",
      description: "Remediate outdated brand attribute facts across Wikipedia and industry directories to resolve Claude 3.5 Sonnet hallucinations.",
      expectedGain: "+9.8% Brand Grounding",
      actionType: "GENERATE_LANDING_PAGE",
      priority: "MEDIUM",
    },
  ];

  async getDashboard(): Promise<GeoDashboardOverview> {
    return {
      overallAiVisibilityScore: 84.5,
      citationScore: 88.2,
      retrievalScore: 82.0,
      authorityScore: 91.4,
      promptScore: 89.0,
      topAiModel: "ChatGPT (GPT-4o)",
      topCitationDomain: "wikipedia.org",
      growthRatePct: 14.2,
    };
  }

  async getVisibility(orgId?: string): Promise<GeoVisibilityTrends> {
    return {
      organizationId: orgId || "org-default",
      overallVisibilityScore: 84.5,
      baselineScore: 78.0,
      historicalPoints: [
        { date: "2026-03-01", score: 78.0 },
        { date: "2026-03-15", score: 80.2 },
        { date: "2026-04-01", score: 82.8 },
        { date: "2026-04-15", score: 84.5 },
      ],
    };
  }

  async getCitations(): Promise<GeoCitationOverview> {
    return {
      totalCitationsCount: 1450,
      topCitedDomains: ["wikipedia.org", "techcrunch.com", "forbes.com", "dyvin.ai"],
      citationGrowthRate: 18.5,
      citationsByEngine: {
        "ChatGPT (GPT-4o)": 640,
        "Claude 3.5 Sonnet": 420,
        "Perplexity Sonar": 290,
        "Google Gemini 1.5": 100,
      },
    };
  }

  async getRetrieval(): Promise<GeoRetrievalAnalytics> {
    return {
      retrievalSharePct: 82.0,
      averageRetrievalRank: 1.4,
      retrievalTrendPoints: [
        { rank: 1, share: 64.2 },
        { rank: 2, share: 22.8 },
        { rank: 3, share: 9.5 },
        { rank: 4, share: 3.5 },
      ],
    };
  }

  async getModels(): Promise<GeoModelComparisonItem[]> {
    return [
      { code: "gpt-4o", provider: "OPENAI", supportsCitations: true, visibilityScore: 88.5, avgRank: 1.2 },
      { code: "claude-3-5-sonnet", provider: "ANTHROPIC", supportsCitations: true, visibilityScore: 86.0, avgRank: 1.4 },
      { code: "gemini-1-5-pro", provider: "GOOGLE", supportsCitations: true, visibilityScore: 81.2, avgRank: 1.7 },
      { code: "perplexity-sonar", provider: "PERPLEXITY", supportsCitations: true, visibilityScore: 92.4, avgRank: 1.1 },
    ];
  }

  async getCompetitors(): Promise<GeoCompetitorBenchmarkItem[]> {
    return [
      { competitorName: "Dyvin AI (Your Org)", visibilityScore: 84.5, promptSharePct: 38.2, citationCoveragePct: 91.0 },
      { competitorName: "Peec AI", visibilityScore: 76.2, promptSharePct: 24.5, citationCoveragePct: 78.4 },
      { competitorName: "Atlas AI", visibilityScore: 71.0, promptSharePct: 19.8, citationCoveragePct: 70.2 },
      { competitorName: "Industry Average", visibilityScore: 62.4, promptSharePct: 17.5, citationCoveragePct: 58.0 },
    ];
  }

  async getDomains(): Promise<GeoDomainAnalyticsItem[]> {
    return [
      { domainName: "dyvin.ai", authorityRank: 88.5, trustScore: 94.2, citationsContributed: 420 },
      { domainName: "wikipedia.org", authorityRank: 98.0, trustScore: 99.1, citationsContributed: 380 },
      { domainName: "techcrunch.com", authorityRank: 91.2, trustScore: 92.0, citationsContributed: 240 },
      { domainName: "github.com", authorityRank: 96.5, trustScore: 97.4, citationsContributed: 190 },
    ];
  }

  async getUrls(): Promise<GeoUrlAnalyticsItem[]> {
    return [
      { url: "https://dyvin.ai/features/geo", citationCount: 420, contentQualityScore: 96.0, lastIndexedDate: "2026-04-20" },
      { url: "https://dyvin.ai/blog/generative-engine-optimization", citationCount: 310, contentQualityScore: 92.5, lastIndexedDate: "2026-04-18" },
      { url: "https://dyvin.ai/docs/architecture", citationCount: 240, contentQualityScore: 94.0, lastIndexedDate: "2026-04-15" },
    ];
  }

  async getSources(): Promise<GeoSourceProfile[]> {
    return [
      { sourceName: "Wikipedia", trustIndex: 98, citationShare: 28.5, category: "Encyclopedia" },
      { sourceName: "Gartner Research", trustIndex: 95, citationShare: 22.0, category: "Industry Analyst" },
      { sourceName: "TechCrunch", trustIndex: 91, citationShare: 18.2, category: "Technology Media" },
      { sourceName: "Official Domain (dyvin.ai)", trustIndex: 94, citationShare: 31.3, category: "First-Party Authority" },
    ];
  }

  async getKeywords(): Promise<GeoKeywordAnalytics> {
    return {
      totalKeywordsTracked: 1500,
      clustersCount: 12,
      topKeyword: "Generative Engine Optimization",
      keywordList: [
        { keyword: "generative engine optimization", volume: 14200, difficulty: "High", geoRank: 1 },
        { keyword: "ai search visibility tool", volume: 9800, difficulty: "Medium", geoRank: 1 },
        { keyword: "llm citation tracking platform", volume: 6400, difficulty: "Medium", geoRank: 2 },
        { keyword: "chatgpt brand monitoring", volume: 18500, difficulty: "High", geoRank: 2 },
        { keyword: "perplexity search optimization", volume: 5200, difficulty: "Low", geoRank: 1 },
      ],
    };
  }

  async uploadKeywords(fileName: string, keywordsCount: number = 1000): Promise<{ fileName: string; keywordsCount?: number; status: string }> {
    return {
      fileName,
      keywordsCount,
      status: "CLUSTERED",
    };
  }

  async getRecommendations(): Promise<GeoRecommendationItem[]> {
    return this.recommendations;
  }

  async executeAction(actionType: string): Promise<GeoActionExecutionResult> {
    return {
      actionId: `act-${Date.now()}`,
      actionType,
      status: "COMPLETED",
      executedAt: new Date().toISOString(),
      generatedArtifact: `Artifact generated successfully for action ${actionType}`,
    };
  }

  async getStatistics(): Promise<GeoPlatformStatistics> {
    return {
      trackedPrompts: 14200,
      trackedCitations: 84200,
      aiSearchStatus: "GEO_INTELLIGENCE_OPERATIONAL",
    };
  }
}

export class MockBusinessExecutionProvider implements IBusinessExecutionProvider {
  private opportunities: BusinessOpportunityItem[] = [
    {
      id: "opp-mock-1",
      organizationId: "org-default",
      title: "Declining ChatGPT Citation in Architecture Queries",
      impactScore: 92.0,
      urgency: "HIGH",
      detectedAt: "2026-10-28T02:00:00.000Z",
    },
    {
      id: "opp-mock-2",
      organizationId: "org-default",
      title: "Perplexity AI Retrieval Deficit for Enterprise Search Keywords",
      impactScore: 88.5,
      urgency: "HIGH",
      detectedAt: "2026-10-28T02:10:00.000Z",
    },
    {
      id: "opp-mock-3",
      organizationId: "org-default",
      title: "Competitor Peec AI Capturing 42% Share of Voice on LLM Indexing",
      impactScore: 79.0,
      urgency: "MEDIUM",
      detectedAt: "2026-10-28T02:15:00.000Z",
    },
  ];

  private rootCauses: RootCauseAnalysisItem[] = [
    {
      id: "rc-mock-1",
      opportunityId: "opp-mock-1",
      primaryCause: "Missing Structured FAQ Schema & Outdated Technical Docs",
      confidencePct: 96.5,
      analyzedAt: "2026-10-28T02:05:00.000Z",
    },
    {
      id: "rc-mock-2",
      opportunityId: "opp-mock-2",
      primaryCause: "Insufficient Semantic Authority Clusters in Core Knowledge Graph",
      confidencePct: 91.2,
      analyzedAt: "2026-10-28T02:12:00.000Z",
    },
    {
      id: "rc-mock-3",
      opportunityId: "opp-mock-3",
      primaryCause: "Lack of Machine-Readable Comparative Feature Tables in Crawl Index",
      confidencePct: 87.8,
      analyzedAt: "2026-10-28T02:18:00.000Z",
    },
  ];

  private strategies: ExecutionStrategyItem[] = [
    {
      id: "strat-mock-1",
      organizationId: "org-default",
      strategyTitle: "Enterprise GEO Visibility & Semantic Authority Recovery",
      roadmapDays: 90,
      expectedRoiPct: 340.0,
      createdAt: "2026-10-28T02:20:00.000Z",
    },
  ];

  private content: ContentExecutionItem[] = [
    {
      id: "cont-mock-1",
      strategyId: "strat-mock-1",
      contentType: "BLOG_AND_FAQ",
      status: "GENERATED",
      createdAt: "2026-10-28T02:25:00.000Z",
    },
    {
      id: "cont-mock-2",
      strategyId: "strat-mock-1",
      contentType: "PRODUCT_SCHEMA_GRAPH",
      status: "GENERATED",
      createdAt: "2026-10-28T02:28:00.000Z",
    },
  ];

  private publishing: PublishingExecutionItem[] = [
    {
      id: "pub-mock-1",
      contentId: "cont-mock-1",
      targetPlatform: "WORDPRESS",
      status: "PUBLISHED",
      publishedAt: "2026-10-28T02:30:00.000Z",
    },
    {
      id: "pub-mock-2",
      contentId: "cont-mock-2",
      targetPlatform: "WEBFLOW",
      status: "PUBLISHED",
      publishedAt: "2026-10-28T02:32:00.000Z",
    },
  ];

  async getDashboard(): Promise<BusinessExecutionDashboardOverview> {
    return {
      activeOpportunitiesCount: this.opportunities.length,
      strategiesInExecutionCount: this.strategies.length,
      contentItemsPublishedCount: this.publishing.length,
      overallVisibilityGainPct: 18.4,
      expectedRoiPct: 340.0,
      closedLoopState: "AUTONOMOUS_OPTIMIZING",
    };
  }

  async getOpportunities(orgId?: string): Promise<BusinessOpportunityItem[]> {
    return this.opportunities;
  }

  async getRootCauses(): Promise<RootCauseAnalysisItem[]> {
    return this.rootCauses;
  }

  async getStrategies(orgId?: string): Promise<ExecutionStrategyItem[]> {
    return this.strategies;
  }

  async generateStrategy(input: GenerateStrategyInput): Promise<ExecutionStrategyItem> {
    const item: ExecutionStrategyItem = {
      id: `strat-${Date.now()}`,
      organizationId: input.organizationId || "org-default",
      strategyTitle: input.strategyTitle,
      roadmapDays: 90,
      expectedRoiPct: 340.0,
      createdAt: new Date().toISOString(),
    };
    this.strategies.unshift(item);
    return item;
  }

  async getContent(): Promise<ContentExecutionItem[]> {
    return this.content;
  }

  async generateContent(input: GenerateContentInput): Promise<ContentExecutionItem> {
    const item: ContentExecutionItem = {
      id: `cont-${Date.now()}`,
      strategyId: input.strategyId,
      contentType: input.contentType || "BLOG_AND_FAQ",
      status: "GENERATED",
      createdAt: new Date().toISOString(),
    };
    this.content.unshift(item);
    return item;
  }

  async getPublishing(): Promise<PublishingExecutionItem[]> {
    return this.publishing;
  }

  async publishContent(input: PublishContentInput): Promise<PublishingExecutionItem> {
    const item: PublishingExecutionItem = {
      id: `pub-${Date.now()}`,
      contentId: input.contentId,
      targetPlatform: input.targetPlatform || "WORDPRESS",
      status: "PUBLISHED",
      publishedAt: new Date().toISOString(),
    };
    this.publishing.unshift(item);
    return item;
  }

  async getWorkforce(): Promise<WorkforceExecutionStatus> {
    return {
      activeWorkforceAgentsCount: 8,
      assignedRoles: ["SEO Agent", "Writer Agent", "Dev Agent", "Publisher Agent"],
      humanApprovalGatesPassed: true,
    };
  }

  async runExecution(input: RunExecutionInput): Promise<any> {
    return {
      id: `exec-${Date.now()}`,
      organizationId: input.organizationId || "org-default",
      executionName: input.executionName,
      status: "CLOSED_LOOP_OPTIMIZING",
      startedAt: new Date().toISOString(),
    };
  }

  async getOptimization(): Promise<ClosedLoopOptimizationStatus> {
    return {
      cycleState: "DETECT -> ANALYZE -> RECOMMEND -> EXECUTE -> PUBLISH -> MONITOR -> MEASURE -> LEARN -> REPEAT",
      overallVisibilityGainPct: 18.4,
      overallTrafficGainPct: 24.5,
      conversionsGrowthPct: 15.2,
    };
  }

  async getHistory(): Promise<BusinessExecutionHistory> {
    return {
      executionsCompleted: 84,
      closedLoopCycles: 12,
      lastCycleTimestamp: new Date().toISOString(),
    };
  }

  async getStatistics(): Promise<BusinessExecutionStatistics> {
    return {
      totalOpportunitiesDetected: 142,
      totalStrategiesExecuted: 38,
      executionStatus: "CLOSED_LOOP_OPTIMIZATION_ACTIVE",
    };
  }
}

export class MockCustomerIntelligenceProvider implements ICustomerIntelligenceProvider {
  private timeline: CustomerTimelineItem[] = [
    {
      id: "time-mock-1",
      organizationId: "org-default",
      eventKey: "ORGANIZATION_ONBOARDED",
      description: "Enterprise workspace provisioned with strict tenant isolation.",
      occurredAt: "2026-10-01T10:00:00.000Z",
    },
    {
      id: "time-mock-2",
      organizationId: "org-default",
      eventKey: "FIRST_CRAWL_COMPLETED",
      description: "Initial multi-model domain crawl indexed 2,450 pages.",
      occurredAt: "2026-10-05T14:30:00.000Z",
    },
    {
      id: "time-mock-3",
      organizationId: "org-default",
      eventKey: "FIRST_AI_CITATION_INDEXED",
      description: "Brand authority cited by Perplexity AI & Claude 3.5 Sonnet.",
      occurredAt: "2026-10-12T09:15:00.000Z",
    },
    {
      id: "time-mock-4",
      organizationId: "org-default",
      eventKey: "GEO_VISIBILITY_PEAK",
      description: "AI Search Visibility reached top 5% industry benchmark (84.5/100).",
      occurredAt: "2026-10-20T16:45:00.000Z",
    },
    {
      id: "time-mock-5",
      organizationId: "org-default",
      eventKey: "WORKFORCE_ORCHESTRATION_ENROLLED",
      description: "Closed-loop autonomous execution activated with 8 digital employees.",
      occurredAt: "2026-10-25T11:20:00.000Z",
    },
  ];

  private memories: CustomerMemoryItem[] = [
    {
      id: "mem-mock-1",
      organizationId: "org-default",
      memoryType: "STRATEGY_MEMORY",
      memoryPayload: "Focus technical authority on enterprise architecture & multi-agent AI.",
      updatedAt: "2026-10-26T12:00:00.000Z",
    },
    {
      id: "mem-mock-2",
      organizationId: "org-default",
      memoryType: "BRAND_SYNTAX_MEMORY",
      memoryPayload: "Preferred brand identity: Dyvin AI Autonomous Enterprise Workforce.",
      updatedAt: "2026-10-26T12:05:00.000Z",
    },
    {
      id: "mem-mock-3",
      organizationId: "org-default",
      memoryType: "GEO_DOMAIN_AUTHORITY_MEMORY",
      memoryPayload: "Key trusted third-party citation domains: GitHub, Wikipedia, TechCrunch.",
      updatedAt: "2026-10-26T12:10:00.000Z",
    },
    {
      id: "mem-mock-4",
      organizationId: "org-default",
      memoryType: "RETRIEVAL_PREFERENCE_MEMORY",
      memoryPayload: "Prioritize ChatGPT Search and Perplexity AI answer inclusion.",
      updatedAt: "2026-10-26T12:15:00.000Z",
    },
  ];

  private warehouse: CustomerWarehouseItem[] = [
    {
      id: "wh-mock-1",
      organizationId: "org-default",
      assetType: "RESEARCH_REPORT",
      assetData: '{"title":"Q4 GEO Citations Benchmark","coverage":88.4}',
      recordedAt: "2026-10-20T08:00:00.000Z",
    },
    {
      id: "wh-mock-2",
      organizationId: "org-default",
      assetType: "VISIBILITY_SNAPSHOT",
      assetData: '{"score":84.5,"engine":"ChatGPT Search","rank":1}',
      recordedAt: "2026-10-22T08:00:00.000Z",
    },
    {
      id: "wh-mock-3",
      organizationId: "org-default",
      assetType: "GEO_CITATIONS_LEDGER",
      assetData: '{"totalCitations":1450,"verifiedRatio":0.88}',
      recordedAt: "2026-10-24T08:00:00.000Z",
    },
    {
      id: "wh-mock-4",
      organizationId: "org-default",
      assetType: "COMPETITOR_BENCHMARK",
      assetData: '{"primaryCompetitor":"Peec AI","diff":12.4}',
      recordedAt: "2026-10-26T08:00:00.000Z",
    },
  ];

  async getDashboard(orgId?: string): Promise<CustomerIntelligenceDashboardOverview> {
    return {
      organizationId: orgId || "org-default",
      warehouseStatus: "APPEND_ONLY_ISOLATED",
      tenantMemorySize: "42.8 MB",
      knowledgeNodesCount: 120,
    };
  }

  async getTimeline(orgId?: string): Promise<CustomerTimelineItem[]> {
    return this.timeline;
  }

  async getMemory(orgId?: string): Promise<CustomerMemoryItem[]> {
    return this.memories;
  }

  async getHistory(orgId?: string): Promise<CustomerHistoryItem> {
    return {
      organizationId: orgId || "org-default",
      historyRecordsCount: 2450,
    };
  }

  async getKnowledge(orgId?: string): Promise<CustomerKnowledgeGraphResponse> {
    return {
      organizationId: orgId || "org-default",
      nodes: [
        { id: "node-1", organizationId: "org-default", nodeLabel: "Dyvin AI Platform Core", nodeType: "PLATFORM_ROOT" },
        { id: "node-2", organizationId: "org-default", nodeLabel: "Autonomous Business Execution", nodeType: "EXECUTION_ENGINE" },
        { id: "node-3", organizationId: "org-default", nodeLabel: "Generative Engine Optimization", nodeType: "GEO_INTELLIGENCE" },
        { id: "node-4", organizationId: "org-default", nodeLabel: "AI Workforce Network", nodeType: "WORKFORCE_POOL" },
        { id: "node-5", organizationId: "org-default", nodeLabel: "Tenant Privacy Isolation Layer", nodeType: "SECURITY_ENCLAVE" },
      ],
      relationshipsCount: 4,
    };
  }

  async getGoals(orgId?: string): Promise<CustomerGoalsTelemetry> {
    return {
      organizationId: orgId || "org-default",
      completedGoals: 12,
    };
  }

  async getReports(orgId?: string): Promise<CustomerReportsTelemetry> {
    return {
      organizationId: orgId || "org-default",
      reportsCount: 34,
    };
  }

  async getWarehouse(orgId?: string): Promise<CustomerWarehouseItem[]> {
    return this.warehouse;
  }

  async verifyPrivacy(orgId?: string): Promise<CustomerPrivacyVerification> {
    return {
      organizationId: orgId || "org-default",
      auditId: `audit-sec-${Date.now()}`,
      isolationStatus: "VERIFIED_ISOLATED",
      crossTenantLeakageRisk: 0.0,
      privacyCompliance: "SOC2_GDPR_HIPAA_STRICT",
    };
  }
}

export class MockCustomerSuccessProvider implements ICustomerSuccessProvider {
  private milestones: CustomerJourneyMilestoneItem[] = [
    {
      id: "milestone-1",
      organizationId: "org-default",
      milestone: "ONBOARDING_COMPLETED",
      achievedAt: "2026-10-01T10:00:00.000Z",
    },
    {
      id: "milestone-2",
      organizationId: "org-default",
      milestone: "PRIMARY_DOMAIN_CONNECTED",
      achievedAt: "2026-10-05T12:00:00.000Z",
    },
    {
      id: "milestone-3",
      organizationId: "org-default",
      milestone: "FIRST_CRAWL_EXECUTED",
      achievedAt: "2026-10-08T15:30:00.000Z",
    },
    {
      id: "milestone-4",
      organizationId: "org-default",
      milestone: "AI_CITATION_INDEXED",
      achievedAt: "2026-10-15T09:15:00.000Z",
    },
    {
      id: "milestone-5",
      organizationId: "org-default",
      milestone: "WORKFORCE_ACTIVE",
      achievedAt: "2026-10-20T16:45:00.000Z",
    },
    {
      id: "milestone-6",
      organizationId: "org-default",
      milestone: "FIRST_QBR_CONDUCTED",
      achievedAt: "2026-10-25T11:00:00.000Z",
    },
  ];

  async getDashboard(orgId?: string): Promise<CustomerSuccessDashboardOverview> {
    return {
      organizationId: orgId || "org-default",
      health: {
        organizationId: orgId || "org-default",
        overallHealthScore: 88.5,
        category: "HEALTHY",
        breakdown: {
          usageScore: 85.0,
          adoptionScore: 92.0,
          supportScore: 95.0,
        },
      },
      stage: "EXPANSION",
      accountManager: "Customer Success Team Lead",
    };
  }

  async getHealth(orgId?: string): Promise<CustomerHealthScoreData> {
    return {
      organizationId: orgId || "org-default",
      overallHealthScore: 88.5,
      category: "HEALTHY",
      breakdown: {
        usageScore: 85.0,
        adoptionScore: 92.0,
        supportScore: 95.0,
      },
    };
  }

  async getJourney(orgId?: string): Promise<CustomerJourneyMilestoneItem[]> {
    return this.milestones;
  }

  async getAdoption(orgId?: string): Promise<ProductAdoptionMetrics> {
    return {
      organizationId: orgId || "org-default",
      overallAdoptionScore: 91.4,
      featureDepth: "HIGH",
      stickyRatioPercent: 24.2,
      activeModules: ["AI Search", "Citation Intelligence", "Workflow Studio", "Agent Marketplace"],
    };
  }

  async getChurn(orgId?: string): Promise<CustomerChurnPredictionData> {
    return {
      organizationId: orgId || "org-default",
      churnRisk: "LOW",
      churnProbability: 0.04,
      expansionProbability: 0.86,
      renewalProbability: 0.96,
      recommendedIntervention: "OFFER_ENTERPRISE_SDK_UPGRADE",
    };
  }

  async getRenewal(orgId?: string): Promise<CustomerRenewalForecast> {
    return {
      organizationId: orgId || "org-default",
      renewalLikelihoodPercent: 96.0,
      daysToRenewal: 145,
    };
  }

  async getExpansion(orgId?: string): Promise<CustomerExpansionOpportunity> {
    return {
      organizationId: orgId || "org-default",
      expansionOpportunity: "ENTERPRISE_SDK_UPGRADE",
      estimatedArrGrowthUsd: 12000,
    };
  }

  async getRecommendations(orgId?: string): Promise<CustomerSuccessPlanResponse> {
    return {
      organizationId: orgId || "org-default",
      timeframeDays: 30,
      planTitle: "30-Day Strategic Onboarding & Expansion Plan",
      milestoneTasks: [
        { day: 7, task: "Connect Primary Web Domains & Run First Crawl", status: "COMPLETED" },
        { day: 14, task: "Configure Visual Workflow DAG for Citation Alerts", status: "IN_PROGRESS" },
        { day: 30, task: "Deploy AI Agent from Marketplace", status: "PENDING" },
      ],
    };
  }

  async getReports(): Promise<CustomerSuccessReportsData> {
    return {
      latestQBRReport: { title: "Q3 Executive Customer Success Summary", status: "AVAILABLE" },
    };
  }

  async getAcademy(): Promise<CustomerAcademyProgress> {
    return {
      coursesCompleted: 4,
      certificationsEarned: ["Dyvin AI Certified Administrator"],
    };
  }

  async getReferrals(): Promise<CustomerAdvocacyStatus> {
    return {
      advocacyTier: "GOLD_CHAMPION",
      activeReferralsCount: 2,
    };
  }
}

export class MockIndustryCloudProvider implements IIndustryCloudProvider {
  async getDashboard(industry?: string): Promise<IndustryOverviewData> {
    return {
      industryKey: industry || "SAAS",
      totalTrackedCompanies: 42000,
      avgVisibilityScore: 84.5,
      topCitationDomain: "cloud-saas-leader.io",
      growthTrend: "ACCELERATING",
    };
  }

  async getBenchmarks(industry?: string): Promise<IndustryBenchmarkData> {
    return {
      industryKey: industry || "SAAS",
      avgVisibilityPercent: 85.0,
      avgCitationPercent: 62.4,
      avgRetrievalPercent: 78.5,
      top10PercentileThreshold: 96.0,
      medianScore: 82.1,
      bottomQuartileScore: 68.0,
    };
  }

  async getReports(): Promise<IndustryReportsData> {
    return {
      latestReport: { title: "Q3 Global AI Search Industry Digest", status: "PUBLISHED" },
    };
  }

  async getTrends(): Promise<IndustryTrendData> {
    return {
      emergingTopics: ["Vector Search Optimization", "LLM Citation Authority", "Autonomous Agents"],
      decliningDomains: ["legacy-seo-farms.net", "keyword-stuffing-dir.com"],
    };
  }

  async getLeaderboards(category?: string): Promise<IndustryLeaderboardResponse> {
    return {
      category: category || "B2B_SAAS",
      rankings: [
        { rank: 1, domain: "cloud-saas-leader.io", score: 98.4, badge: "GLOBAL_LEADER" },
        { rank: 2, domain: "enterprise-workflows.com", score: 95.1, badge: "TOP_TIER" },
        { rank: 3, domain: "ai-search-vanguard.org", score: 92.8, badge: "CONTENDER" },
      ],
    };
  }

  async getPublicIndex(query?: string): Promise<IndustryPublicIndexData> {
    return {
      query: query || "SaaS Visibility",
      resultsCount: 2450,
    };
  }

  async getAuthority(domain?: string): Promise<IndustryAuthorityData> {
    return {
      domain: domain || "dyvin.ai",
      authorityScore: 98.5,
      trustScore: 99.0,
      visibilityMomentum: "ACCELERATING",
      retrievalStrengthPercent: 96.4,
    };
  }

  async getModels(): Promise<IndustryModelsPreference> {
    return {
      mostPreferredModelForSaas: "GPT-4o",
      mostPreferredModelForResearch: "Claude 3.5 Sonnet",
    };
  }

  async getPublications(): Promise<IndustryPublicationItem[]> {
    return [
      { id: "pub-1", title: "State of LLM Citation & Knowledge Graphs 2026", publishedAt: "2026-09-15" },
      { id: "pub-2", title: "Generative Engine Optimization Benchmarks in High Tech", publishedAt: "2026-10-01" },
    ];
  }

  async getStatistics(): Promise<IndustryPlatformStatistics> {
    return {
      totalIndustriesClassified: 24,
      totalGlobalLeaderboards: 8,
      activeResearchPublications: 14,
    };
  }
}

export class MockEcosystemProvider implements IEcosystemProvider {
  async getDashboard(): Promise<EcosystemDashboardOverview> {
    return {
      activeAgencies: 120,
      activePartners: 45,
      totalReferralPayoutsUsd: 145000,
      certifiedSpecialists: 850,
      ecosystemStatus: "FULLY_OPERATIONAL",
    };
  }

  async getAgencies(): Promise<AgencyProfileItem[]> {
    return [
      { id: "ag-1", agencyName: "Acme AI Growth Partners", tier: "PLATINUM", isVerified: true, clientCount: 18, createdAt: new Date().toISOString() },
      { id: "ag-2", agencyName: "Vanguard Search & GEO Labs", tier: "GOLD", isVerified: true, clientCount: 12, createdAt: new Date().toISOString() },
      { id: "ag-3", agencyName: "Apex Enterprise Consulting", tier: "SILVER", isVerified: true, clientCount: 7, createdAt: new Date().toISOString() },
      { id: "ag-4", agencyName: "Horizon Digital AI Agency", tier: "GOLD", isVerified: true, clientCount: 9, createdAt: new Date().toISOString() },
    ];
  }

  async registerAgency(input: RegisterAgencyInput): Promise<AgencyProfileItem> {
    return {
      id: "ag-" + Date.now(),
      agencyName: input.agencyName,
      tier: input.tier || "SILVER",
      isVerified: true,
      clientCount: 1,
      createdAt: new Date().toISOString(),
    };
  }

  async getPartners(): Promise<PartnerProfileItem[]> {
    return [
      { id: "pt-1", companyName: "CloudCorp Technologies", partnerType: "TECHNOLOGY", status: "ACTIVE", createdAt: new Date().toISOString() },
      { id: "pt-2", companyName: "VectorScale Infrastructure", partnerType: "TECHNOLOGY", status: "ACTIVE", createdAt: new Date().toISOString() },
      { id: "pt-3", companyName: "Global Strategy Systems", partnerType: "CONSULTING", status: "ACTIVE", createdAt: new Date().toISOString() },
      { id: "pt-4", companyName: "OmniChannel Analytics", partnerType: "INTEGRATION", status: "ACTIVE", createdAt: new Date().toISOString() },
    ];
  }

  async registerPartner(input: RegisterPartnerInput): Promise<PartnerProfileItem> {
    return {
      id: "pt-" + Date.now(),
      companyName: input.companyName,
      partnerType: input.partnerType || "TECHNOLOGY",
      status: "ACTIVE",
      createdAt: new Date().toISOString(),
    };
  }

  async getReferrals(): Promise<EcosystemReferralItem[]> {
    return [
      { id: "ref-1", referrerId: "user-alex", refCode: "REF-ALEX-ENTERPRISE", commissionUsd: 1250, status: "PAID", createdAt: new Date().toISOString() },
      { id: "ref-2", referrerId: "user-sarah", refCode: "REF-SARAH-GROWTH", commissionUsd: 750, status: "PAID", createdAt: new Date().toISOString() },
      { id: "ref-3", referrerId: "user-partner-1", refCode: "REF-ACME-PARTNER", commissionUsd: 2500, status: "PENDING", createdAt: new Date().toISOString() },
    ];
  }

  async createReferral(input: CreateReferralInput): Promise<EcosystemReferralItem> {
    return {
      id: "ref-" + Date.now(),
      referrerId: input.referrerId,
      refCode: input.refCode,
      commissionUsd: 250,
      status: "PAID",
      createdAt: new Date().toISOString(),
    };
  }

  async getAcademy(): Promise<AcademyCourseItem[]> {
    return [
      { courseKey: "geo-101", title: "Generative Engine Optimization (GEO) Foundations", level: "BEGINNER" },
      { courseKey: "ai-agents-201", title: "Building Autonomous AI Agents with Dyvin SDK", level: "INTERMEDIATE" },
    ];
  }

  async getCertifications(): Promise<ProfessionalCertificateItem[]> {
    return [
      { name: "Certified Dyvin AI GEO Specialist (CDGS)", examStatus: "AVAILABLE" },
      { name: "Certified Dyvin AI Platform Architect (CDPA)", examStatus: "AVAILABLE" },
    ];
  }

  async getCommunity(): Promise<CommunityForumPostItem[]> {
    return [
      { id: "post-1", title: "Best practices for multi-agent workflows", upvotes: 142 },
      { id: "post-2", title: "How we improved GEO visibility by 340%", upvotes: 289 },
    ];
  }

  async getEvents(): Promise<PlatformEventItem[]> {
    return [
      { id: "evt-1", title: "Dyvin AI v1.0 GA Keynote & Live Demo", eventType: "WEBINAR", scheduledAt: new Date(Date.now() + 7 * 86400000).toISOString() },
      { id: "evt-2", title: "Advanced Generative Engine Optimization Workshop", eventType: "WORKSHOP", scheduledAt: new Date(Date.now() + 14 * 86400000).toISOString() },
    ];
  }

  async getMarketplace(): Promise<PartnerListingItem[]> {
    return [
      { title: "Enterprise GEO Implementation Package", agency: "Acme Digital Agency", rating: 5.0 },
      { title: "Full-Stack Knowledge Graph Ingestion Audit", agency: "Vanguard Search Labs", rating: 4.9 },
      { title: "Multi-Model Citation Optimization Retainer", agency: "Apex Consulting", rating: 4.8 },
    ];
  }
}

export class MockAiEvolutionProvider implements IAiEvolutionProvider {
  private models: EvolutionModelProfile[] = [
    { id: "mod-1", modelName: "gpt-4o", provider: "OPENAI", contextWindow: 128000, costPer1kTokens: 0.005, reasoningScore: 94.5, updatedAt: new Date().toISOString() },
    { id: "mod-2", modelName: "claude-3-5-sonnet", provider: "ANTHROPIC", contextWindow: 200000, costPer1kTokens: 0.003, reasoningScore: 96.8, updatedAt: new Date().toISOString() },
    { id: "mod-3", modelName: "gemini-1.5-pro", provider: "GOOGLE", contextWindow: 1000000, costPer1kTokens: 0.0035, reasoningScore: 93.2, updatedAt: new Date().toISOString() },
    { id: "mod-4", modelName: "deepseek-v3", provider: "DEEPSEEK", contextWindow: 64000, costPer1kTokens: 0.0014, reasoningScore: 92.0, updatedAt: new Date().toISOString() },
    { id: "mod-5", modelName: "llama-3.1-405b", provider: "META", contextWindow: 128000, costPer1kTokens: 0.002, reasoningScore: 91.5, updatedAt: new Date().toISOString() },
    { id: "mod-6", modelName: "mistral-large-2", provider: "MISTRAL", contextWindow: 128000, costPer1kTokens: 0.0025, reasoningScore: 90.8, updatedAt: new Date().toISOString() },
  ];

  private prompts: PromptEvolution[] = [
    { id: "p-1", promptFamily: "CITATION_PROMPTS", winningVariant: "variant_v3_cot", winRatePct: 89.4, updatedAt: new Date().toISOString() },
    { id: "p-2", promptFamily: "GEO_SYNTHESIS_PROMPTS", winningVariant: "variant_v4_dense", winRatePct: 92.1, updatedAt: new Date().toISOString() },
    { id: "p-3", promptFamily: "SERP_GROUNDING_PROMPTS", winningVariant: "variant_v2_canonical", winRatePct: 86.8, updatedAt: new Date().toISOString() },
    { id: "p-4", promptFamily: "MULTILINGUAL_ENTITY_PROMPTS", winningVariant: "variant_v5_fewshot", winRatePct: 94.2, updatedAt: new Date().toISOString() },
  ];

  private workflows: WorkflowEvolution[] = [
    { workflowKey: "GEO_CITATION_PIPELINE", successRate: 0.985, avgDurationMs: 1180.0 },
    { workflowKey: "AUTONOMOUS_KEYWORD_DISCOVERY", successRate: 0.972, avgDurationMs: 2450.0 },
    { workflowKey: "MULTI_AGENT_VERIFICATION", successRate: 0.991, avgDurationMs: 890.0 },
    { workflowKey: "COMPETITOR_SIGNAL_SYNTHESIS", successRate: 0.968, avgDurationMs: 1820.0 },
  ];

  private strategies: StrategyEvolution[] = [
    { strategyType: "GEO_DOCS_CITATION", executedCount: 142, avgVisibilityGainPct: 345.8 },
    { strategyType: "DYNAMIC_KNOWLEDGE_GRAPH", executedCount: 89, avgVisibilityGainPct: 280.4 },
    { strategyType: "LLM_SNIPPET_DOMINANCE", executedCount: 64, avgVisibilityGainPct: 412.0 },
    { strategyType: "SEMANTIC_AUTHORITY_HUB", executedCount: 110, avgVisibilityGainPct: 310.5 },
  ];

  async getDashboard(): Promise<EvolutionDashboardData> {
    return {
      platformState: "CONTINUOUSLY_EVOLVING",
      promptsEvolvedToday: 140,
      workflowsOptimizedToday: 48,
      overallQualityIndex: 98.4,
      costSavingsPct: 22.5,
    };
  }

  async getModels(): Promise<EvolutionModelProfile[]> {
    return [...this.models];
  }

  async getPrompts(): Promise<PromptEvolution[]> {
    return [...this.prompts];
  }

  async getWorkflows(): Promise<WorkflowEvolution[]> {
    return [...this.workflows];
  }

  async getStrategies(): Promise<StrategyEvolution[]> {
    return [...this.strategies];
  }

  async getQuality(): Promise<AIQualityOverview> {
    return {
      citationPrecisionPct: 98.7,
      retrievalPrecisionPct: 97.4,
      hallucinationRatePct: 1.2,
      hallucinationSuppressionPct: 99.1,
      safetyCompliancePct: 99.9,
      domainAuthorityAlignmentPct: 96.5,
    };
  }

  async getBenchmarks(): Promise<BenchmarkSnapshot[]> {
    return [
      { provider: "ANTHROPIC", medianScore: 94.6 },
      { provider: "OPENAI", medianScore: 93.1 },
      { provider: "GOOGLE", medianScore: 91.8 },
      { provider: "MISTRAL", medianScore: 89.2 },
      { provider: "DEEPSEEK", medianScore: 92.4 },
    ];
  }

  async getProviders(): Promise<AIProviderScorecard[]> {
    return [
      { provider: "ANTHROPIC", reliabilityScore: 99.9, overallRank: 1 },
      { provider: "OPENAI", reliabilityScore: 99.8, overallRank: 2 },
      { provider: "GOOGLE", reliabilityScore: 99.7, overallRank: 3 },
      { provider: "DEEPSEEK", reliabilityScore: 99.4, overallRank: 4 },
      { provider: "META", reliabilityScore: 99.2, overallRank: 5 },
    ];
  }

  async getHistory(): Promise<EvolutionHistoryRecord[]> {
    return [
      { changeDescription: "Automated prompt rewriting for Citation Agent using evolutionary loss", moduleImpacted: "CitationModule", improvedAt: new Date(Date.now() - 3600000).toISOString() },
      { changeDescription: "Dynamic temperature decay applied to Perplexity grounding pipeline", moduleImpacted: "GroundingEngine", improvedAt: new Date(Date.now() - 7200000).toISOString() },
      { changeDescription: "Multi-model cascade threshold tuned to favor Claude-3.5 for reasoning", moduleImpacted: "RoutingOptimizer", improvedAt: new Date(Date.now() - 14400000).toISOString() },
      { changeDescription: "Reinforcement feedback fine-tuning on top 500 enterprise enterprise queries", moduleImpacted: "ModelFineTuning", improvedAt: new Date(Date.now() - 28800000).toISOString() },
    ];
  }

  async getStatistics(): Promise<EvolutionStatistics> {
    return {
      totalModelsTracked: 24,
      totalPromptsEvolved: 4200,
      totalCostSavingsUsd: 145000,
      selfImprovementState: "ACTIVE_OPTIMIZING",
    };
  }

  async getOptimalRoute(taskType: string = "REASONING"): Promise<OptimalRouteRecommendation> {
    return {
      taskType,
      recommendedModel: taskType === "REASONING" ? "claude-3-5-sonnet" : "gpt-4o",
      provider: taskType === "REASONING" ? "ANTHROPIC" : "OPENAI",
      fallbackModel: "gemini-1.5-pro",
      costOptimizationSavingsPct: 18.4,
    };
  }
}

export class MockInnovationLabProvider implements IInnovationLabProvider {
  private experiments: InnovationExperimentItem[] = [
    { id: "exp-1", title: "Multimodal OCR & Document Understanding Sandbox", owner: "Research Engineering Team", riskLevel: "LOW", status: "SANDBOX_TESTING", createdAt: new Date(Date.now() - 86400000 * 2).toISOString() },
    { id: "exp-2", title: "Autonomous Browser Agent Navigation Benchmark", owner: "Agentic Core Team", riskLevel: "MEDIUM", status: "SANDBOX_TESTING", createdAt: new Date(Date.now() - 86400000 * 3).toISOString() },
    { id: "exp-3", title: "Real-Time Voice STT/TTS Conversational Latency Test", owner: "Voice AI Labs", riskLevel: "LOW", status: "SANDBOX_TESTING", createdAt: new Date(Date.now() - 86400000 * 4).toISOString() },
    { id: "exp-4", title: "Claude 3.7 Hybrid Chain-of-Thought Evaluator", owner: "LLM Systems Group", riskLevel: "MEDIUM", status: "EVALUATING", createdAt: new Date(Date.now() - 86400000 * 5).toISOString() },
    { id: "exp-5", title: "Robotics IoT Telemetry Edge Ingestion Gate", owner: "Hardware & IoT Team", riskLevel: "HIGH", status: "SANDBOX_TESTING", createdAt: new Date(Date.now() - 86400000 * 6).toISOString() },
    { id: "exp-6", title: "Perplexity Grounding Mutation A/B Tournament", owner: "Search Optimization Team", riskLevel: "LOW", status: "READY_FOR_STAGING", createdAt: new Date(Date.now() - 86400000 * 7).toISOString() },
  ];

  private models: ExperimentalModelItem[] = [
    { id: "mod-1", modelName: "claude-3-7-sonnet-preview", provider: "ANTHROPIC", isExperimental: true, addedAt: new Date().toISOString() },
    { id: "mod-2", modelName: "gpt-4.5-preview", provider: "OPENAI", isExperimental: true, addedAt: new Date().toISOString() },
    { id: "mod-3", modelName: "gemini-2.0-flash-thinking", provider: "GOOGLE", isExperimental: true, addedAt: new Date().toISOString() },
    { id: "mod-4", modelName: "deepseek-r1-distill-llama-70b", provider: "DEEPSEEK", isExperimental: true, addedAt: new Date().toISOString() },
    { id: "mod-5", modelName: "llama-3.3-70b-instruct", provider: "META", isExperimental: true, addedAt: new Date().toISOString() },
    { id: "mod-6", modelName: "mistral-large-2411", provider: "MISTRAL", isExperimental: true, addedAt: new Date().toISOString() },
  ];

  private evaluations: InnovationEvaluationItem[] = [
    { id: "eval-1", experimentId: "exp-1", accuracy: 0.985, latencyMs: 280.0, costScore: 94.0, passedGate: true, evaluatedAt: new Date().toISOString() },
    { id: "eval-2", experimentId: "exp-2", accuracy: 0.962, latencyMs: 1450.0, costScore: 91.5, passedGate: true, evaluatedAt: new Date().toISOString() },
    { id: "eval-3", experimentId: "exp-3", accuracy: 0.991, latencyMs: 175.0, costScore: 96.0, passedGate: true, evaluatedAt: new Date().toISOString() },
    { id: "eval-4", experimentId: "exp-4", accuracy: 0.978, latencyMs: 420.0, costScore: 89.0, passedGate: true, evaluatedAt: new Date().toISOString() },
  ];

  private promotions: InnovationPromotionItem[] = [
    { id: "prom-1", experimentId: "exp-1", promotedFrom: "SANDBOX", promotedTo: "STAGING", promotedAt: new Date().toISOString() },
    { id: "prom-2", experimentId: "exp-3", promotedFrom: "SANDBOX", promotedTo: "STAGING", promotedAt: new Date().toISOString() },
    { id: "prom-3", experimentId: "exp-6", promotedFrom: "STAGING", promotedTo: "PRODUCTION", promotedAt: new Date().toISOString() },
  ];

  async getDashboard(): Promise<InnovationDashboardData> {
    return {
      sandboxState: "ACTIVE_ISOLATED_SANDBOX",
      runningExperimentsCount: this.experiments.length,
      promotionsPendingCount: 4,
      multimodalReadiness: "READY_FOR_STAGING",
      browserAgentSuccessPct: 98.2,
      voiceLatencyMs: 180.0,
    };
  }

  async getExperiments(): Promise<InnovationExperimentItem[]> {
    return [...this.experiments];
  }

  async createExperiment(input: CreateExperimentInput): Promise<InnovationExperimentItem> {
    const newExp: InnovationExperimentItem = {
      id: "exp-" + (this.experiments.length + 1),
      title: input.title,
      owner: input.owner,
      status: "SANDBOX_TESTING",
      riskLevel: input.riskLevel || "LOW",
      createdAt: new Date().toISOString(),
    };
    this.experiments.unshift(newExp);
    return newExp;
  }

  async getModels(): Promise<ExperimentalModelItem[]> {
    return [...this.models];
  }

  async getEvaluations(): Promise<InnovationEvaluationItem[]> {
    return [...this.evaluations];
  }

  async getPromotions(): Promise<InnovationPromotionItem[]> {
    return [...this.promotions];
  }

  async getMultimodal(): Promise<MultimodalCapabilityData> {
    return {
      supportedModalities: ["VISION", "OCR", "AUDIO_STT", "VIDEO_ANALYTICS", "DOCUMENT_STRUCTURE"],
      visionOcrAccuracyPct: 98.5,
    };
  }

  async getBrowser(): Promise<BrowserAutomationStatusData> {
    return {
      agentStatus: "SANDBOX_READY",
      supportedActions: ["NAVIGATE", "FORM_FILL", "DOM_EXTRACT", "SCREENSHOT", "CAPTCHA_SOLVE"],
    };
  }

  async getVoice(): Promise<VoiceIntelligenceStatusData> {
    return {
      voiceEngine: "REALTIME_VOICE_STT_TTS",
      sttAccuracyPct: 99.1,
      ttsLatencyMs: 180.0,
    };
  }

  async getStatistics(): Promise<InnovationLabStatistics> {
    return {
      activeSandboxExperiments: this.experiments.length,
      totalPromotionsToStaging: 24,
      sandboxIsolation: "STRICT_SANDBOX_ISOLATED",
    };
  }
}

export class MockAiGovernanceProvider implements IAiGovernanceProvider {
  private policies: GovernancePolicyItem[] = [
    { id: "pol-1", organizationId: "org-default", policyName: "Zero PII Leakage & Privacy Shield", policyType: "DATA_PRIVACY", isEnforced: true, createdAt: new Date(Date.now() - 86400000 * 10).toISOString() },
    { id: "pol-2", organizationId: "org-default", policyName: "Hallucination Boundary & Grounding Check", policyType: "SAFETY_AND_ACCURACY", isEnforced: true, createdAt: new Date(Date.now() - 86400000 * 8).toISOString() },
    { id: "pol-3", organizationId: "org-default", policyName: "High-Risk Action Dual Executive Approval", policyType: "WORKFLOW_GOVERNANCE", isEnforced: true, createdAt: new Date(Date.now() - 86400000 * 6).toISOString() },
    { id: "pol-4", organizationId: "org-default", policyName: "Model Bias Mitigation & Fairness Audit", policyType: "RESPONSIBLE_AI", isEnforced: true, createdAt: new Date(Date.now() - 86400000 * 4).toISOString() },
    { id: "pol-5", organizationId: "org-default", policyName: "SOC2 & ISO27001 Continuous Security Sentinel", policyType: "SECURITY_AND_COMPLIANCE", isEnforced: true, createdAt: new Date(Date.now() - 86400000 * 2).toISOString() },
  ];

  private approvals: GovernanceApprovalItem[] = [
    { id: "appr-1", organizationId: "org-default", workflowName: "Publish Global FAQ Schema & Citations", status: "APPROVED", approverRole: "EXECUTIVE_APPROVER", approvedAt: new Date(Date.now() - 3600000 * 12).toISOString() },
    { id: "appr-2", organizationId: "org-default", workflowName: "Deploy Fine-Tuned Domain Ranking Model", status: "APPROVED", approverRole: "ML_GOVERNANCE_LEAD", approvedAt: new Date(Date.now() - 3600000 * 6).toISOString() },
    { id: "appr-3", organizationId: "org-default", workflowName: "Export Enterprise Customer Dataset for Analytics", status: "PENDING", approverRole: "DPO_CHIEF_LEGAL", approvedAt: new Date(Date.now() - 3600000 * 2).toISOString() },
  ];

  private audits: GovernanceAuditItem[] = [
    { id: "aud-1", actionSummary: "Zero PII Leakage Policy Activated", actorId: "admin@dyvin.ai", auditedAt: new Date(Date.now() - 86400000 * 2).toISOString() },
    { id: "aud-2", actionSummary: "Executive Approval Granted for FAQ Schema", actorId: "executive@dyvin.ai", auditedAt: new Date(Date.now() - 86400000).toISOString() },
    { id: "aud-3", actionSummary: "SOC2 Type II Annual Security Certification Audit Completed", actorId: "system-audit", auditedAt: new Date(Date.now() - 3600000 * 8).toISOString() },
    { id: "aud-4", actionSummary: "Responsible AI Bias Detection Sweep Completed with Score 0.02", actorId: "ml-safety-agent", auditedAt: new Date(Date.now() - 3600000 * 2).toISOString() },
  ];

  async getDashboard(): Promise<GovernanceDashboardData> {
    return {
      policyComplianceScore: 99.8,
      pendingApprovalsCount: this.approvals.filter(a => a.status === "PENDING").length,
      overallRiskScore: 12.4,
      complianceStatus: "SOC2_ISO27001_VERIFIED",
      trustScore: 99.4,
      responsibleAiRating: 99.5,
      auditActivityCount: 1840,
    };
  }

  async getPolicies(orgId?: string): Promise<GovernancePolicyItem[]> {
    if (orgId && orgId !== "org-default") {
      return this.policies.filter(p => p.organizationId === orgId);
    }
    return this.policies;
  }

  async createPolicy(input: CreatePolicyInput): Promise<GovernancePolicyItem> {
    const newPolicy: GovernancePolicyItem = {
      id: "pol-" + Date.now(),
      organizationId: input.organizationId || "org-default",
      policyName: input.policyName,
      policyType: input.policyType || "SECURITY_AND_COMPLIANCE",
      isEnforced: true,
      createdAt: new Date().toISOString(),
    };
    this.policies.unshift(newPolicy);
    this.audits.unshift({
      id: "aud-" + Date.now(),
      actionSummary: `Policy Created: ${newPolicy.policyName}`,
      actorId: "admin@dyvin.ai",
      auditedAt: new Date().toISOString(),
    });
    return newPolicy;
  }

  async getApprovals(orgId?: string): Promise<GovernanceApprovalItem[]> {
    if (orgId && orgId !== "org-default") {
      return this.approvals.filter(a => a.organizationId === orgId);
    }
    return this.approvals;
  }

  async approveWorkflow(input: ApproveWorkflowInput): Promise<GovernanceApprovalItem> {
    const newApproval: GovernanceApprovalItem = {
      id: "appr-" + Date.now(),
      organizationId: input.organizationId || "org-default",
      workflowName: input.workflowName,
      status: "APPROVED",
      approverRole: input.approverRole || "EXECUTIVE_APPROVER",
      approvedAt: new Date().toISOString(),
    };
    this.approvals.unshift(newApproval);
    this.audits.unshift({
      id: "aud-" + Date.now(),
      actionSummary: `Workflow Approved: ${newApproval.workflowName}`,
      actorId: "executive@dyvin.ai",
      auditedAt: new Date().toISOString(),
    });
    return newApproval;
  }

  async getRisk(): Promise<GovernanceRiskData> {
    return {
      overallRiskScore: 12.4,
      securityRisk: "LOW",
      privacyRisk: "LOW",
      financialRisk: "LOW",
      reputationRisk: "LOW",
      mitigationStatus: "FULLY_MITIGATED",
    };
  }

  async getCompliance(): Promise<GovernanceComplianceData> {
    return {
      soc2Ready: true,
      iso27001Ready: true,
      gdprCompliant: true,
      hipaaCompliant: true,
      ccpaCompliant: true,
      dataResidencyRegion: "US_EU_MULTI_REGION",
      rightToDeleteSupported: true,
    };
  }

  async getAudit(): Promise<GovernanceAuditItem[]> {
    return this.audits;
  }

  async getTrust(): Promise<GovernanceTrustData> {
    return {
      systemHealth: "OPERATIONAL_100_PERCENT",
      trustIndex: 99.4,
      securityScore: 98.8,
      privacyStatus: "ENCRYPTED_ISOLATED",
      activeCertificates: ["SOC2_TYPE_II", "ISO_27001_2026", "GDPR_TRUST_SEAL"],
    };
  }

  async getResponsibleAi(): Promise<ResponsibleAiData> {
    return {
      status: "ALIGNED",
      biasRiskScore: 0.02,
      fairnessIndex: 98.4,
      hallucinationRate: 0.01,
      safetyRating: 99.5,
      privacyPiiCompliancePct: 99.9,
    };
  }

  async getExplainability(decisionId = "dec-default"): Promise<ExplainabilityData> {
    return {
      decisionId,
      modelReasoning: "Root Cause: Missing FAQ Schema. Recommendation: Generate FAQ Schema & publish to WordPress.",
      evidenceChain: ["ChatGPT Citation Analysis", "Retrieval Rank Comparison"],
      confidencePct: 97.8,
    };
  }

  async getStatistics(): Promise<GovernanceStatistics> {
    return {
      activeEnforcedPolicies: this.policies.filter(p => p.isEnforced).length,
      totalAuditedActions: 18400,
      governanceStatus: "ENTERPRISE_SOC2_ISO27001_COMPLIANT",
    };
  }
}

export class MockAppPlatformProvider implements IAppPlatformProvider {
  private apps: PlatformAppItem[] = [
    { id: "app-1", organizationId: "f5bb0153-e41a-49ee-97dc-e03dc6228403", appName: "Executive Citation Radar", appType: "ANALYTICS_DASHBOARD", isPublished: true, createdAt: new Date().toISOString() },
    { id: "app-2", organizationId: "f5bb0153-e41a-49ee-97dc-e03dc6228403", appName: "Competitor Sentiment Tracker", appType: "MARKET_INTELLIGENCE", isPublished: true, createdAt: new Date().toISOString() },
    { id: "app-3", organizationId: "f5bb0153-e41a-49ee-97dc-e03dc6228403", appName: "Autonomous GEO Schema Publisher", appType: "LOW_CODE_AI_APP", isPublished: true, createdAt: new Date().toISOString() },
    { id: "app-4", organizationId: "f5bb0153-e41a-49ee-97dc-e03dc6228403", appName: "Knowledge Base Synchronizer", appType: "WORKFLOW_AUTOMATION", isPublished: true, createdAt: new Date().toISOString() },
    { id: "app-5", organizationId: "f5bb0153-e41a-49ee-97dc-e03dc6228403", appName: "Multi-Engine Hallucination Watcher", appType: "SECURITY_GUARDRAIL", isPublished: false, createdAt: new Date().toISOString() },
  ];

  private templates: WorkflowTemplateItem[] = [
    { id: "tmpl-1", templateName: "GEO Citation Starter Pack", category: "GEO_SEO_AUTOMATION", createdAt: new Date().toISOString() },
    { id: "tmpl-2", templateName: "Brand Knowledge Extraction Graph", category: "KNOWLEDGE_ENGINEERING", createdAt: new Date().toISOString() },
    { id: "tmpl-3", templateName: "Competitor Intelligence Radar", category: "MARKET_ANALYSIS", createdAt: new Date().toISOString() },
    { id: "tmpl-4", templateName: "Autonomous Remediation Pipeline", category: "AUTONOMOUS_OPERATIONS", createdAt: new Date().toISOString() },
  ];

  private listings: MarketplaceListingItem[] = [
    { id: "list-1", title: "SEO FAQ Schema Generator", category: "AI_WORKFLOW_TEMPLATES", price: 0.0, downloads: 1420, rating: 4.9, createdAt: new Date().toISOString() },
    { id: "list-2", title: "Competitor Gap Analyzer Pro", category: "INTELLIGENCE_MODULES", price: 29.0, downloads: 890, rating: 4.8, createdAt: new Date().toISOString() },
    { id: "list-3", title: "Claude 3.7 Reasoning Extension", category: "MODEL_PLUGINS", price: 0.0, downloads: 2150, rating: 5.0, createdAt: new Date().toISOString() },
    { id: "list-4", title: "HubSpot Citation Enriched CRM", category: "CRM_INTEGRATIONS", price: 49.0, downloads: 412, rating: 4.7, createdAt: new Date().toISOString() },
    { id: "list-5", title: "Enterprise Audit Guardrail Pack", category: "SECURITY_POLICIES", price: 99.0, downloads: 670, rating: 4.9, createdAt: new Date().toISOString() },
    { id: "list-6", title: "Perplexity Deep Retrieval Connector", category: "RETRIEVAL_CONNECTORS", price: 0.0, downloads: 3100, rating: 5.0, createdAt: new Date().toISOString() },
  ];

  private extensions: PlatformExtensionItem[] = [
    { id: "ext-1", extensionName: "Analytics Sidebar Widget", extensionType: "SIDEBAR_WIDGET", isEnabled: true, installedAt: new Date().toISOString() },
    { id: "ext-2", extensionName: "Chrome DevTools GEO Inspector", extensionType: "BROWSER_EXTENSION", isEnabled: true, installedAt: new Date().toISOString() },
    { id: "ext-3", extensionName: "Slack Citation Alert Bot", extensionType: "MESSAGING_INTEGRATION", isEnabled: true, installedAt: new Date().toISOString() },
    { id: "ext-4", extensionName: "Figma Brand Knowledge Exporter", extensionType: "DESIGN_INTEGRATION", isEnabled: false, installedAt: new Date().toISOString() },
    { id: "ext-5", extensionName: "VS Code GEO JSON-LD Validator", extensionType: "IDE_EXTENSION", isEnabled: true, installedAt: new Date().toISOString() },
  ];

  private sdks: PlatformSDKItem[] = [
    { id: "sdk-1", language: "TYPESCRIPT", version: "v2.4.0", downloadUrl: "https://sdk.dyvin.ai/packages/typescript/v2.4.0.zip", generatedAt: new Date().toISOString() },
    { id: "sdk-2", language: "PYTHON", version: "v2.4.0", downloadUrl: "https://sdk.dyvin.ai/packages/python/v2.4.0.zip", generatedAt: new Date().toISOString() },
    { id: "sdk-3", language: "GO", version: "v1.8.0", downloadUrl: "https://sdk.dyvin.ai/packages/go/v1.8.0.zip", generatedAt: new Date().toISOString() },
    { id: "sdk-4", language: "JAVA", version: "v1.2.0", downloadUrl: "https://sdk.dyvin.ai/packages/java/v1.2.0.zip", generatedAt: new Date().toISOString() },
  ];

  private developers: PlatformDeveloperItem[] = [
    { id: "dev-1", developerName: "Enterprise Growth Devs", email: "dev1@dyvin-partner.com", tier: "ENTERPRISE_DEVELOPER", registeredAt: new Date().toISOString() },
    { id: "dev-2", developerName: "Autonomous Agentic Labs", email: "dev2@agenticlabs.io", tier: "ENTERPRISE_DEVELOPER", registeredAt: new Date().toISOString() },
    { id: "dev-3", developerName: "Sovereign Systems", email: "contact@sovereign-ai.eu", tier: "COMMUNITY_DEVELOPER", registeredAt: new Date().toISOString() },
    { id: "dev-4", developerName: "FastPrompt Studio", email: "team@fastprompt.dev", tier: "COMMUNITY_DEVELOPER", registeredAt: new Date().toISOString() },
  ];

  private workflows: PublishedWorkflowItem[] = [
    { id: "wf-1", workflowName: "Citation Pipeline Automated Monitor", version: 1, publishedAt: new Date().toISOString() },
    { id: "wf-2", workflowName: "Knowledge Graph Entity Ingestion", version: 2, publishedAt: new Date().toISOString() },
    { id: "wf-3", workflowName: "Autonomous Remediation Dispatcher", version: 1, publishedAt: new Date().toISOString() },
    { id: "wf-4", workflowName: "Hallucination Cross-Verification Flow", version: 3, publishedAt: new Date().toISOString() },
  ];

  async getDashboard(): Promise<AppPlatformDashboardData> {
    return {
      installedAppsCount: this.apps.length,
      marketplaceListingsCount: this.listings.length,
      activeDevelopersCount: this.developers.length,
      publishedTemplatesCount: this.templates.length,
      workflowExecutionsCount: 142000,
      monthlyPlatformRevenue: 485000.0,
    };
  }

  async getApps(orgId?: string): Promise<PlatformAppItem[]> {
    if (orgId) {
      return this.apps.filter(a => a.organizationId === orgId);
    }
    return [...this.apps];
  }

  async createApp(input: CreateAppInput): Promise<PlatformAppItem> {
    const newApp: PlatformAppItem = {
      id: "app-" + Date.now(),
      organizationId: input.organizationId,
      appName: input.appName,
      appType: input.appType || "LOW_CODE_AI_APP",
      isPublished: true,
      createdAt: new Date().toISOString(),
    };
    this.apps.unshift(newApp);
    return newApp;
  }

  async getTemplates(): Promise<WorkflowTemplateItem[]> {
    return [...this.templates];
  }

  async getMarketplace(): Promise<MarketplaceListingItem[]> {
    return [...this.listings];
  }

  async publishListing(input: PublishListingInput): Promise<MarketplaceListingItem> {
    const item: MarketplaceListingItem = {
      id: "list-" + Date.now(),
      title: input.title,
      category: input.category || "AI_WORKFLOW_TEMPLATES",
      price: input.price || 0.0,
      downloads: 0,
      rating: 5.0,
      createdAt: new Date().toISOString(),
    };
    this.listings.unshift(item);
    return item;
  }

  async getExtensions(): Promise<PlatformExtensionItem[]> {
    return [...this.extensions];
  }

  async getSDKs(): Promise<PlatformSDKItem[]> {
    return [...this.sdks];
  }

  async getDevelopers(): Promise<PlatformDeveloperItem[]> {
    return [...this.developers];
  }

  async getWorkflows(): Promise<PublishedWorkflowItem[]> {
    return [...this.workflows];
  }

  async publishWorkflow(input: PublishWorkflowInput): Promise<PublishedWorkflowItem> {
    const item: PublishedWorkflowItem = {
      id: "wf-" + Date.now(),
      workflowName: input.workflowName,
      version: 1,
      publishedAt: new Date().toISOString(),
    };
    this.workflows.unshift(item);
    return item;
  }

  async getStatistics(): Promise<AppPlatformStatistics> {
    return {
      totalInstalledApps: this.apps.length,
      activeMarketplaceListings: this.listings.length,
      developerCommunityCount: this.developers.length,
      platformStatus: "EXTENSIBILITY_READY_V2_ACTIVE",
    };
  }
}

export class MockIntegrationHubProvider implements IIntegrationHubProvider {
  private integrations: IntegrationItem[] = [
    {
      id: "int-1",
      organizationId: "f5bb0153-e41a-49ee-97dc-e03dc6228403",
      name: "WordPress Official Blog Publisher",
      type: "CMS",
      status: "ACTIVE",
      configJson: { url: "https://blog.dyvin.ai", autoPublish: true },
      createdAt: new Date().toISOString(),
      connections: [
        { id: "conn-1", providerId: "p-wp", status: "ACTIVE", provider: { code: "wordpress", name: "WordPress CMS", category: "CMS" } },
      ],
      webhooks: [
        { id: "wh-1", integrationId: "int-1", targetUrl: "https://api.dyvin.ai/webhooks/incoming/wordpress", status: "ACTIVE", createdAt: new Date().toISOString() },
      ],
      syncs: [
        { id: "sync-1", integrationId: "int-1", direction: "BIDIRECTIONAL", status: "ACTIVE", lastSyncedAt: new Date().toISOString() },
      ],
    },
    {
      id: "int-2",
      organizationId: "f5bb0153-e41a-49ee-97dc-e03dc6228403",
      name: "Slack Citation Alerts Channel",
      type: "COMMUNICATION",
      status: "ACTIVE",
      configJson: { channel: "#citation-alerts", notifyOnDrop: true },
      createdAt: new Date().toISOString(),
      connections: [
        { id: "conn-2", providerId: "p-slack", status: "ACTIVE", provider: { code: "slack", name: "Slack Messaging", category: "COMMUNICATION" } },
      ],
    },
    {
      id: "int-3",
      organizationId: "f5bb0153-e41a-49ee-97dc-e03dc6228403",
      name: "HubSpot CRM Knowledge Sync",
      type: "CRM",
      status: "ACTIVE",
      configJson: { syncDeals: true, syncContacts: true },
      createdAt: new Date().toISOString(),
      connections: [
        { id: "conn-3", providerId: "p-hubspot", status: "ACTIVE", provider: { code: "hubspot", name: "HubSpot CRM", category: "CRM" } },
      ],
    },
    {
      id: "int-4",
      organizationId: "f5bb0153-e41a-49ee-97dc-e03dc6228403",
      name: "Webflow Landing Page Updater",
      type: "CMS",
      status: "ACTIVE",
      configJson: { siteId: "wf-site-10902", livePublish: true },
      createdAt: new Date().toISOString(),
      connections: [
        { id: "conn-4", providerId: "p-webflow", status: "ACTIVE", provider: { code: "webflow", name: "Webflow Engine", category: "CMS" } },
      ],
    },
    {
      id: "int-5",
      organizationId: "f5bb0153-e41a-49ee-97dc-e03dc6228403",
      name: "GitHub Repository Webhook Listener",
      type: "DEVELOPER_TOOLS",
      status: "ACTIVE",
      configJson: { repo: "dyvin-ai/knowledge-graph" },
      createdAt: new Date().toISOString(),
      connections: [
        { id: "conn-5", providerId: "p-github", status: "ACTIVE", provider: { code: "github", name: "GitHub Developer", category: "DEVELOPER_TOOLS" } },
      ],
    },
  ];

  private providers: IntegrationProviderItem[] = [
    { code: "wordpress", name: "WordPress CMS", category: "CMS", isEnabled: true },
    { code: "shopify", name: "Shopify Storefront", category: "CMS", isEnabled: true },
    { code: "webflow", name: "Webflow Engine", category: "CMS", isEnabled: true },
    { code: "framer", name: "Framer", category: "CMS", isEnabled: true },
    { code: "notion", name: "Notion", category: "KNOWLEDGE_BASE", isEnabled: true },
    { code: "slack", name: "Slack Messaging", category: "COMMUNICATION", isEnabled: true },
    { code: "discord", name: "Discord", category: "COMMUNICATION", isEnabled: true },
    { code: "teams", name: "Microsoft Teams", category: "COMMUNICATION", isEnabled: true },
    { code: "hubspot", name: "HubSpot CRM", category: "CRM", isEnabled: true },
    { code: "salesforce", name: "Salesforce CRM", category: "CRM", isEnabled: true },
    { code: "github", name: "GitHub Developer", category: "DEVELOPER_TOOLS", isEnabled: true },
    { code: "gitlab", name: "GitLab", category: "DEVELOPER_TOOLS", isEnabled: true },
    { code: "jira", name: "Jira Software", category: "DEVELOPER_TOOLS", isEnabled: true },
    { code: "linear", name: "Linear", category: "DEVELOPER_TOOLS", isEnabled: true },
    { code: "confluence", name: "Confluence", category: "KNOWLEDGE_BASE", isEnabled: true },
    { code: "gdrive", name: "Google Drive", category: "STORAGE", isEnabled: true },
    { code: "zapier", name: "Zapier", category: "AUTOMATION", isEnabled: true },
    { code: "make", name: "Make.com", category: "AUTOMATION", isEnabled: true },
    { code: "n8n", name: "n8n", category: "AUTOMATION", isEnabled: true },
    { code: "webhook", name: "Custom Webhook", category: "AUTOMATION", isEnabled: true },
    { code: "rest_api", name: "Custom REST API", category: "AUTOMATION", isEnabled: true },
  ];

  private events: WebhookEventItem[] = [
    { id: "evt-1", webhookId: "wh-1", eventType: "wordpress.post.published", payloadJson: { postTitle: "Mastering GEO Optimization", status: "PUBLISHED" }, deliveredAt: new Date().toISOString(), createdAt: new Date().toISOString() },
    { id: "evt-2", webhookId: "wh-2", eventType: "slack.alert.dispatched", payloadJson: { channel: "#citation-alerts", message: "Spike in ChatGPT brand visibility" }, deliveredAt: new Date().toISOString(), createdAt: new Date().toISOString() },
    { id: "evt-3", webhookId: "wh-3", eventType: "hubspot.lead.enriched", payloadJson: { leadId: "lead-9821", citationScore: 94.2 }, deliveredAt: new Date().toISOString(), createdAt: new Date().toISOString() },
    { id: "evt-4", webhookId: "wh-4", eventType: "github.push.synced", payloadJson: { repo: "dyvin-ai/knowledge-graph", commit: "a81fe29" }, deliveredAt: new Date().toISOString(), createdAt: new Date().toISOString() },
  ];

  private history: IntegrationHistoryItem[] = [
    { id: "hist-1", integrationId: "int-1", action: "SYNC_COMPLETED", status: "SUCCESS", createdAt: new Date().toISOString() },
    { id: "hist-2", integrationId: "int-2", action: "WEBHOOK_DISPATCHED", status: "SUCCESS", createdAt: new Date().toISOString() },
    { id: "hist-3", integrationId: "int-3", action: "CRM_LEADS_ENRICHED", status: "SUCCESS", createdAt: new Date().toISOString() },
  ];

  async getIntegrations(organizationId?: string): Promise<IntegrationItem[]> {
    if (organizationId) {
      return this.integrations.filter(i => i.organizationId === organizationId);
    }
    return [...this.integrations];
  }

  async connectProvider(input: ConnectProviderInput): Promise<{ integration: IntegrationItem; connection: any; provider: any }> {
    const newIntegration: IntegrationItem = {
      id: "int-" + Date.now(),
      organizationId: input.organizationId,
      name: input.name || `${input.providerCode.toUpperCase()} Integration`,
      type: "CMS",
      status: "ACTIVE",
      configJson: input.configJson || {},
      createdAt: new Date().toISOString(),
      connections: [{ id: "conn-" + Date.now(), providerId: input.providerCode, status: "ACTIVE" }],
    };
    this.integrations.unshift(newIntegration);
    return {
      integration: newIntegration,
      connection: { id: "conn-" + Date.now(), status: "ACTIVE" },
      provider: { code: input.providerCode, name: input.providerCode.toUpperCase() },
    };
  }

  async disconnectProvider(integrationId: string): Promise<IntegrationItem> {
    const found = this.integrations.find(i => i.id === integrationId);
    if (found) {
      found.status = "DISCONNECTED";
      return found;
    }
    return {
      id: integrationId,
      organizationId: "f5bb0153-e41a-49ee-97dc-e03dc6228403",
      name: "Disconnected Integration",
      type: "CMS",
      status: "DISCONNECTED",
      createdAt: new Date().toISOString(),
    };
  }

  async getProviders(): Promise<IntegrationProviderItem[]> {
    return [...this.providers];
  }

  async getStatus(organizationId?: string): Promise<IntegrationHubStatus> {
    return {
      activeIntegrations: this.integrations.filter(i => i.status === "ACTIVE").length,
      healthStatus: "HEALTHY",
      syncedLast24Hours: 142,
    };
  }

  async syncIntegration(input: SyncIntegrationInput): Promise<SyncIntegrationResult> {
    return {
      jobId: "sync-job-" + Date.now(),
      status: "QUEUED",
      syncedAt: new Date().toISOString(),
    };
  }

  async processWebhook(input: ProcessWebhookInput): Promise<WebhookEventItem> {
    const newEvent: WebhookEventItem = {
      id: "evt-" + Date.now(),
      eventType: input.eventType,
      payloadJson: input.payload,
      deliveredAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };
    this.events.unshift(newEvent);
    return newEvent;
  }

  async publishCMSContent(input: PublishCMSContentInput): Promise<PublishCMSContentResult> {
    return {
      externalId: "ext-post-" + Date.now(),
      url: `https://cms.dyvin.ai/posts/${input.slug || "generated-post"}`,
      status: "PUBLISHED",
    };
  }

  async getHistory(): Promise<IntegrationHistoryItem[]> {
    return [...this.history];
  }

  async getMetrics(): Promise<IntegrationMetricItem[]> {
    return [
      { metricKey: "webhook_delivery_success_rate", metricValue: 99.8 },
      { metricKey: "average_sync_latency_ms", metricValue: 120.0 },
      { metricKey: "active_connections_total", metricValue: 48.0 },
    ];
  }
}

export class MockDeveloperPlatformProvider implements IDeveloperPlatformProvider {
  private apps: DeveloperAppItem[] = [
    {
      id: "app-1",
      organizationId: "f5bb0153-e41a-49ee-97dc-e03dc6228403",
      name: "Northwind GEO Intelligence Engine",
      description: "Enterprise AI citation pipeline & multi-engine search visibility synchronizer",
      status: "PRODUCTION",
      createdAt: new Date().toISOString(),
    },
    {
      id: "app-2",
      organizationId: "f5bb0153-e41a-49ee-97dc-e03dc6228403",
      name: "Dyvin Python SDK Agent Service",
      description: "Automated digital workforce worker utilizing high-throughput public API endpoints",
      status: "PRODUCTION",
      createdAt: new Date().toISOString(),
    },
    {
      id: "app-3",
      organizationId: "f5bb0153-e41a-49ee-97dc-e03dc6228403",
      name: "Automated Citation Webhook Ingestion",
      description: "Real-time webhook listener processing engine ranking updates and sentiment shifts",
      status: "STAGING",
      createdAt: new Date().toISOString(),
    },
    {
      id: "app-4",
      organizationId: "f5bb0153-e41a-49ee-97dc-e03dc6228403",
      name: "Enterprise Slack Bot Integration",
      description: "Conversational agent query proxy connecting corporate chat to Dyvin AI models",
      status: "DEVELOPMENT",
      createdAt: new Date().toISOString(),
    },
    {
      id: "app-5",
      organizationId: "f5bb0153-e41a-49ee-97dc-e03dc6228403",
      name: "Custom LLM Analytics Pipeline",
      description: "High-dimension vector embeddings exporter and hallucination auditor",
      status: "PRODUCTION",
      createdAt: new Date().toISOString(),
    },
  ];

  private apiKeys: DeveloperAPIKeyItem[] = [
    {
      id: "key-1",
      applicationId: "app-1",
      keyHash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
      prefix: "dyv_live",
      status: "ACTIVE",
      createdAt: new Date().toISOString(),
    },
    {
      id: "key-2",
      applicationId: "app-2",
      keyHash: "8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4",
      prefix: "dyv_live",
      status: "ACTIVE",
      createdAt: new Date().toISOString(),
    },
  ];

  private webhooks: DeveloperWebhookItem[] = [
    {
      id: "wh-1",
      applicationId: "app-1",
      targetUrl: "https://api.northwind.ai/webhooks/geo-updates",
      secret: "whsec_northwind_geo_981",
      isEnabled: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: "wh-2",
      applicationId: "app-2",
      targetUrl: "https://hooks.slack.com/services/T00/B00/X001",
      secret: "whsec_slack_alerts_321",
      isEnabled: true,
      createdAt: new Date().toISOString(),
    },
  ];

  private logs: DeveloperLogItem[] = [
    {
      id: "log-1",
      applicationId: "app-1",
      endpoint: "/api/v1/scanner/execute",
      statusCode: 200,
      latencyMs: 24,
      timestamp: new Date().toISOString(),
    },
    {
      id: "log-2",
      applicationId: "app-1",
      endpoint: "/api/v1/prompts/evaluate",
      statusCode: 200,
      latencyMs: 18,
      timestamp: new Date().toISOString(),
    },
    {
      id: "log-3",
      applicationId: "app-2",
      endpoint: "/api/v1/citations/query",
      statusCode: 200,
      latencyMs: 31,
      timestamp: new Date().toISOString(),
    },
  ];

  private usage: DeveloperUsageItem[] = [
    {
      id: "use-1",
      applicationId: "app-1",
      endpoint: "/api/v1/scanner/execute",
      requestCount: 1420,
      recordedAt: new Date().toISOString(),
    },
    {
      id: "use-2",
      applicationId: "app-1",
      endpoint: "/api/v1/prompts/evaluate",
      requestCount: 890,
      recordedAt: new Date().toISOString(),
    },
  ];

  private marketplaceApps: DeveloperMarketplaceAppItem[] = [
    {
      id: "mkt-1",
      applicationId: "app-1",
      name: "WordPress Auto-Publisher Extension",
      summary: "Direct CMS connector automatically publishing AI-optimized articles and schema FAQs.",
      status: "PUBLISHED",
      iconUrl: "https://assets.dyvin.ai/icons/wordpress.svg",
    },
    {
      id: "mkt-2",
      applicationId: "app-2",
      name: "HubSpot CRM Pipeline Bridge",
      summary: "Synchronizes AI search brand mentions and qualified organic leads with HubSpot deals.",
      status: "PUBLISHED",
      iconUrl: "https://assets.dyvin.ai/icons/hubspot.svg",
    },
    {
      id: "mkt-3",
      applicationId: "app-3",
      name: "Slack Citation Alert Dispatcher",
      summary: "Instantly alerts your engineering or marketing channel when citation rankings drop.",
      status: "PUBLISHED",
      iconUrl: "https://assets.dyvin.ai/icons/slack.svg",
    },
  ];

  async createApp(input: CreateDeveloperAppInput): Promise<DeveloperAppItem> {
    const newApp: DeveloperAppItem = {
      id: "app-" + Date.now(),
      organizationId: input.organizationId,
      name: input.name,
      description: input.description,
      status: input.status || "DEVELOPMENT",
      createdAt: new Date().toISOString(),
    };
    this.apps.unshift(newApp);
    return newApp;
  }

  async getApps(organizationId?: string): Promise<DeveloperAppItem[]> {
    if (organizationId) {
      return this.apps.filter(a => a.organizationId === organizationId);
    }
    return [...this.apps];
  }

  async createAPIKey(input: CreateDeveloperAPIKeyInput): Promise<CreateAPIKeyResult> {
    const rawKey = `dyv_live_${Math.random().toString(36).substring(2)}${Date.now()}`;
    const newKey: DeveloperAPIKeyItem = {
      id: "key-" + Date.now(),
      applicationId: input.applicationId,
      keyHash: "hashed_" + Math.random().toString(36).substring(2),
      prefix: input.prefix || "dyv_live",
      status: "ACTIVE",
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 90 * 86400000).toISOString(),
    };
    this.apiKeys.unshift(newKey);
    return { apiKey: newKey, rawKey };
  }

  async getAPIKeys(applicationId?: string): Promise<DeveloperAPIKeyItem[]> {
    if (applicationId) {
      return this.apiKeys.filter(k => k.applicationId === applicationId);
    }
    return [...this.apiKeys];
  }

  async generateOAuthToken(input: GenerateOAuthTokenInput): Promise<DeveloperOAuthTokenResult> {
    return {
      id: "tok-" + Date.now(),
      clientId: input.clientId,
      accessToken: `oauth_at_${Math.random().toString(36).substring(2)}${Date.now()}`,
      refreshToken: `oauth_rt_${Math.random().toString(36).substring(2)}`,
      grantType: input.grantType || "CLIENT_CREDENTIALS",
      expiresAt: new Date(Date.now() + 3600000).toISOString(),
      createdAt: new Date().toISOString(),
    };
  }

  async getWebhooks(applicationId?: string): Promise<DeveloperWebhookItem[]> {
    if (applicationId) {
      return this.webhooks.filter(w => w.applicationId === applicationId);
    }
    return [...this.webhooks];
  }

  async createWebhook(input: CreateDeveloperWebhookInput): Promise<DeveloperWebhookItem> {
    const newHook: DeveloperWebhookItem = {
      id: "wh-" + Date.now(),
      applicationId: input.applicationId,
      targetUrl: input.targetUrl,
      secret: input.secret || "whsec_" + Math.random().toString(36).substring(2),
      isEnabled: true,
      createdAt: new Date().toISOString(),
    };
    this.webhooks.unshift(newHook);
    return newHook;
  }

  async getLogs(applicationId?: string): Promise<DeveloperLogItem[]> {
    if (applicationId) {
      return this.logs.filter(l => l.applicationId === applicationId);
    }
    return [...this.logs];
  }

  async getUsage(applicationId?: string): Promise<DeveloperUsageItem[]> {
    if (applicationId) {
      return this.usage.filter(u => u.applicationId === applicationId);
    }
    return [...this.usage];
  }

  async getMarketplace(): Promise<DeveloperMarketplaceAppItem[]> {
    return [...this.marketplaceApps];
  }

  async publishMarketplaceApp(input: PublishDeveloperAppInput): Promise<DeveloperMarketplaceAppItem> {
    const published: DeveloperMarketplaceAppItem = {
      id: "mkt-" + Date.now(),
      applicationId: input.applicationId,
      name: input.name,
      summary: input.summary,
      status: "PUBLISHED",
      iconUrl: input.iconUrl,
      createdAt: new Date().toISOString(),
    };
    this.marketplaceApps.unshift(published);
    return published;
  }

  async getOverview(organizationId?: string): Promise<DeveloperPlatformOverview> {
    const apps = await this.getApps(organizationId);
    return {
      totalApps: apps.length,
      activeApiKeys: this.apiKeys.filter(k => k.status === "ACTIVE").length,
      totalRequests24h: 18450,
      averageLatencyMs: 22,
      errorRatePct: 0.04,
      quotaConsumptionPct: 28.5,
    };
  }
}

export class MockKeywordIntelligenceProvider implements IKeywordIntelligenceProvider {
  private keywords: KeywordItem[] = [
    {
      id: "kw-001",
      organizationId: "f5bb0153-e41a-49ee-97dc-e03dc6228403",
      text: "enterprise ai search visibility platform",
      normalizedText: "enterprise ai search visibility platform",
      source: "MANUAL",
      status: "ACTIVE",
      intent: "COMMERCIAL",
      searchVolume: 4800,
      difficulty: 42,
      opportunityScore: 92.5,
      clusterId: "cluster-001",
      createdAt: new Date().toISOString(),
    },
    {
      id: "kw-002",
      organizationId: "f5bb0153-e41a-49ee-97dc-e03dc6228403",
      text: "how to track chatgpt citations for brand",
      normalizedText: "how to track chatgpt citations for brand",
      source: "MANUAL",
      status: "ACTIVE",
      intent: "QUESTION",
      searchVolume: 3200,
      difficulty: 28,
      opportunityScore: 95.0,
      clusterId: "cluster-001",
      createdAt: new Date().toISOString(),
    },
    {
      id: "kw-003",
      organizationId: "f5bb0153-e41a-49ee-97dc-e03dc6228403",
      text: "best generative engine optimization software",
      normalizedText: "best generative engine optimization software",
      source: "MANUAL",
      status: "ACTIVE",
      intent: "COMMERCIAL",
      searchVolume: 5400,
      difficulty: 48,
      opportunityScore: 89.0,
      clusterId: "cluster-002",
      createdAt: new Date().toISOString(),
    },
    {
      id: "kw-004",
      organizationId: "f5bb0153-e41a-49ee-97dc-e03dc6228403",
      text: "geo vs traditional seo strategy",
      normalizedText: "geo vs traditional seo strategy",
      source: "MANUAL",
      status: "ACTIVE",
      intent: "COMPARISON",
      searchVolume: 6100,
      difficulty: 36,
      opportunityScore: 94.2,
      clusterId: "cluster-002",
      createdAt: new Date().toISOString(),
    },
    {
      id: "kw-005",
      organizationId: "f5bb0153-e41a-49ee-97dc-e03dc6228403",
      text: "buy enterprise llm brand governance solution",
      normalizedText: "buy enterprise llm brand governance solution",
      source: "MANUAL",
      status: "ACTIVE",
      intent: "TRANSACTIONAL",
      searchVolume: 1800,
      difficulty: 55,
      opportunityScore: 86.4,
      clusterId: "cluster-003",
      createdAt: new Date().toISOString(),
    },
    {
      id: "kw-006",
      organizationId: "f5bb0153-e41a-49ee-97dc-e03dc6228403",
      text: "prevent ai hallucination brand mentions",
      normalizedText: "prevent ai hallucination brand mentions",
      source: "MANUAL",
      status: "ACTIVE",
      intent: "INFORMATIONAL",
      searchVolume: 2900,
      difficulty: 32,
      opportunityScore: 91.0,
      clusterId: "cluster-003",
      createdAt: new Date().toISOString(),
    },
  ];

  private clusters: KeywordClusterItem[] = [
    {
      id: "cluster-001",
      name: "Enterprise AI Search & Citations",
      primaryTopic: "AI Visibility & LLM Citation Discovery",
      keywordCount: 6,
      createdAt: new Date().toISOString(),
    },
    {
      id: "cluster-002",
      name: "Generative Engine Optimization (GEO)",
      primaryTopic: "Algorithmic Brand Positioning & Answer Engine Optimization",
      keywordCount: 5,
      createdAt: new Date().toISOString(),
    },
    {
      id: "cluster-003",
      name: "LLM Brand Authority & Safety",
      primaryTopic: "Enterprise Hallucination Mitigation & Brand Protection",
      keywordCount: 3,
      createdAt: new Date().toISOString(),
    },
    {
      id: "cluster-004",
      name: "Multimodal AI Retrieval & RAG",
      primaryTopic: "Cross-Modal Search & Synthetic Answer Grounding",
      keywordCount: 2,
      createdAt: new Date().toISOString(),
    },
    {
      id: "cluster-005",
      name: "Competitive Share of Model (SoM)",
      primaryTopic: "Perplexity, ChatGPT, and Gemini Benchmark Analytics",
      keywordCount: 4,
      createdAt: new Date().toISOString(),
    },
  ];

  private campaigns: KeywordCampaignItem[] = [
    {
      id: "camp-001",
      organizationId: "f5bb0153-e41a-49ee-97dc-e03dc6228403",
      name: "Global Generative Citation Audit 2026",
      status: "RUNNING",
      frequency: "DAILY",
      keywordCount: 12,
      createdAt: new Date().toISOString(),
      results: [
        {
          id: "res-001",
          campaignId: "camp-001",
          keywordText: "enterprise ai search visibility platform",
          visibilityScore: 94.2,
          citationsCount: 6,
          recordedAt: new Date().toISOString(),
        },
        {
          id: "res-002",
          campaignId: "camp-001",
          keywordText: "how to track chatgpt citations for brand",
          visibilityScore: 91.8,
          citationsCount: 5,
          recordedAt: new Date().toISOString(),
        },
      ],
    },
    {
      id: "camp-002",
      organizationId: "f5bb0153-e41a-49ee-97dc-e03dc6228403",
      name: "Tier-1 GEO Discovery Benchmark",
      status: "SCHEDULED",
      frequency: "WEEKLY",
      keywordCount: 8,
      createdAt: new Date().toISOString(),
      results: [],
    },
    {
      id: "camp-003",
      organizationId: "f5bb0153-e41a-49ee-97dc-e03dc6228403",
      name: "Competitor Head-to-Head Search Sweep",
      status: "COMPLETED",
      frequency: "HOURLY",
      keywordCount: 15,
      createdAt: new Date().toISOString(),
      results: [
        {
          id: "res-003",
          campaignId: "camp-003",
          keywordText: "best generative engine optimization software",
          visibilityScore: 88.4,
          citationsCount: 4,
          recordedAt: new Date().toISOString(),
        },
      ],
    },
  ];

  private promptLibrary: PromptLibraryItem[] = [
    {
      id: "prompt-001",
      title: "Enterprise AI Search Executive Comparison",
      templateType: "COMPARISON",
      promptText: "Compare top solutions for {keyword}. How does Dyvin AI stack up against traditional enterprise search in LLM citation frequency, answer engine indexing, and real-time hallucination prevention?",
      usageCount: 42,
      createdAt: new Date().toISOString(),
    },
    {
      id: "prompt-002",
      title: "Answer Engine Grounding FAQ Generator",
      templateType: "FAQ",
      promptText: "What are the most frequent technical questions regarding {keyword}? Provide authoritative answers demonstrating Dyvin AI platform governance.",
      usageCount: 29,
      createdAt: new Date().toISOString(),
    },
    {
      id: "prompt-003",
      title: "Enterprise Buyer Decision Matrix",
      templateType: "BUYER",
      promptText: "What critical criteria should enterprise CTOs and CMOs evaluate when purchasing an intelligence suite for {keyword}? Highlight Dyvin AI capabilities.",
      usageCount: 38,
      createdAt: new Date().toISOString(),
    },
    {
      id: "prompt-004",
      title: "Perplexity & ChatGPT Citation Diagnostic",
      templateType: "PROBLEM",
      promptText: "What are the main causes of citation drop and lack of brand attribution in {keyword}? How does Dyvin AI diagnose and remediate them?",
      usageCount: 53,
      createdAt: new Date().toISOString(),
    },
    {
      id: "prompt-005",
      title: "Universal AI Topic Synthesis Prompt",
      templateType: "GENERAL",
      promptText: "Synthesize the current state of knowledge for {keyword}, citing authoritative enterprise sources and Dyvin AI benchmarks.",
      usageCount: 67,
      createdAt: new Date().toISOString(),
    },
  ];

  async getKeywords(organizationId?: string): Promise<KeywordItem[]> {
    if (organizationId) {
      return this.keywords.filter((k) => k.organizationId === organizationId);
    }
    return [...this.keywords];
  }

  async createKeyword(input: CreateKeywordInput): Promise<KeywordItem> {
    const item: KeywordItem = {
      id: "kw-" + Date.now(),
      organizationId: input.organizationId,
      text: input.text,
      normalizedText: input.text.trim().toLowerCase(),
      source: "MANUAL",
      status: "ACTIVE",
      intent: input.intent || "COMMERCIAL",
      searchVolume: input.searchVolume || 2400,
      difficulty: input.difficulty || 32,
      opportunityScore: input.opportunityScore || 88.0,
      clusterId: input.clusterId || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.keywords.unshift(item);
    return item;
  }

  async importKeywords(input: ImportKeywordsInput): Promise<{ importId: string; totalRows: number; importedCount: number; invalidCount: number; keywords: KeywordItem[] }> {
    const lines = input.csvContent.split("\n").map((l) => l.trim()).filter((l) => l.length > 0);
    const added: KeywordItem[] = [];
    for (const line of lines) {
      const parts = line.split(",");
      const text = parts[0]?.replace(/^"|"$/g, "").trim();
      if (text && !text.toLowerCase().includes("keyword")) {
        const item: KeywordItem = {
          id: "kw-" + Date.now() + Math.random().toString(36).substring(2, 5),
          organizationId: input.organizationId,
          text,
          normalizedText: text.toLowerCase(),
          source: "CSV_IMPORT",
          status: "ACTIVE",
          intent: "INFORMATIONAL",
          searchVolume: 1800,
          difficulty: 35,
          opportunityScore: 84.0,
          createdAt: new Date().toISOString(),
        };
        this.keywords.unshift(item);
        added.push(item);
      }
    }
    return {
      importId: "imp-" + Date.now(),
      totalRows: lines.length,
      importedCount: added.length,
      invalidCount: 0,
      keywords: added,
    };
  }

  async getClusters(): Promise<KeywordClusterItem[]> {
    return [...this.clusters];
  }

  async generateClusters(organizationId: string): Promise<KeywordClusterItem[]> {
    const newCluster: KeywordClusterItem = {
      id: "cluster-" + Date.now(),
      name: "Synthesized AI Topic Cluster",
      primaryTopic: "Autonomous Discovery & Real-Time Topic Graph",
      keywordCount: 4,
      createdAt: new Date().toISOString(),
    };
    this.clusters.unshift(newCluster);
    return [...this.clusters];
  }

  async getOpportunities(organizationId?: string): Promise<KeywordOpportunityItem[]> {
    const kws = await this.getKeywords(organizationId);
    return kws.map((k) => ({
      keywordId: k.id,
      text: k.text,
      intent: k.intent,
      opportunityScore: k.opportunityScore,
      searchVolume: k.searchVolume,
      difficulty: k.difficulty,
      authorityGap: 18.5,
      expectedRoi: +(k.opportunityScore * 2.1).toFixed(1),
      priority: k.opportunityScore > 88 ? "HIGH" : "MEDIUM",
    }));
  }

  async getTrends(): Promise<KeywordTrendItem[]> {
    return [
      { keywordText: "enterprise ai search visibility platform", direction: "RISING", growthRatePct: 48.5 },
      { keywordText: "how to track chatgpt citations for brand", direction: "RISING", growthRatePct: 82.0 },
      { keywordText: "geo vs traditional seo strategy", direction: "RISING", growthRatePct: 64.2 },
      { keywordText: "prevent ai hallucination brand mentions", direction: "STABLE", growthRatePct: 15.8 },
    ];
  }

  async getSearchVolume(keyword?: string): Promise<KeywordSearchVolumeItem[] | KeywordSearchVolumeItem> {
    if (keyword) {
      return {
        keywordText: keyword,
        monthlyVolume: 4800,
        seasonality: { Q1: 4200, Q2: 4900, Q3: 4700, Q4: 5400 },
        recordedAt: new Date().toISOString(),
      };
    }
    return this.keywords.map((k) => ({
      id: "vol-" + k.id,
      keywordText: k.text,
      monthlyVolume: k.searchVolume,
      seasonality: {
        Q1: Math.round(k.searchVolume * 0.9),
        Q2: Math.round(k.searchVolume * 1.05),
        Q3: Math.round(k.searchVolume * 0.98),
        Q4: Math.round(k.searchVolume * 1.2),
      },
      recordedAt: new Date().toISOString(),
    }));
  }

  async getKeywordById(id: string): Promise<KeywordItem | null> {
    const found = this.keywords.find((k) => k.id === id);
    return found || null;
  }

  async updateKeyword(id: string, data: Partial<KeywordItem>): Promise<KeywordItem> {
    const idx = this.keywords.findIndex((k) => k.id === id);
    if (idx !== -1) {
      this.keywords[idx] = { ...this.keywords[idx], ...data, updatedAt: new Date().toISOString() };
      return this.keywords[idx];
    }
    throw new Error(`Keyword ${id} not found`);
  }

  async deleteKeyword(id: string): Promise<boolean> {
    this.keywords = this.keywords.filter((k) => k.id !== id);
    return true;
  }

  async getCampaigns(organizationId?: string): Promise<KeywordCampaignItem[]> {
    if (organizationId) {
      return this.campaigns.filter((c) => c.organizationId === organizationId);
    }
    return [...this.campaigns];
  }

  async createCampaign(input: CreateCampaignInput): Promise<KeywordCampaignItem> {
    const camp: KeywordCampaignItem = {
      id: "camp-" + Date.now(),
      organizationId: input.organizationId,
      name: input.name,
      status: "SCHEDULED",
      frequency: input.frequency || "DAILY",
      keywordCount: input.keywords ? input.keywords.length : 6,
      createdAt: new Date().toISOString(),
      results: [],
    };
    this.campaigns.unshift(camp);
    return camp;
  }

  async getCampaignById(id: string): Promise<KeywordCampaignItem | null> {
    const found = this.campaigns.find((c) => c.id === id);
    return found || null;
  }

  async runCampaign(id: string): Promise<any> {
    const camp = this.campaigns.find((c) => c.id === id);
    if (camp) {
      camp.status = "COMPLETED";
      camp.results = camp.results || [];
      camp.results.push({
        id: "res-" + Date.now(),
        campaignId: id,
        keywordText: "enterprise ai search visibility platform",
        visibilityScore: 95.5,
        citationsCount: 7,
        recordedAt: new Date().toISOString(),
      });
      return { status: "COMPLETED", campaign: camp };
    }
    return null;
  }

  async getCampaignResults(id: string): Promise<KeywordCampaignResultItem[]> {
    const camp = this.campaigns.find((c) => c.id === id);
    return camp?.results || [];
  }

  async getPromptLibrary(): Promise<PromptLibraryItem[]> {
    return [...this.promptLibrary];
  }

  async generatePrompt(input: GeneratePromptInput): Promise<PromptLibraryItem> {
    const item: PromptLibraryItem = {
      id: "prompt-" + Date.now(),
      title: `Prompt for ${input.keyword}`,
      templateType: input.templateType || "GENERAL",
      promptText: `Synthesize the competitive landscape and brand positioning for ${input.keyword} with focus on ${input.brandName || "Dyvin AI"}.`,
      usageCount: 1,
      createdAt: new Date().toISOString(),
    };
    this.promptLibrary.unshift(item);
    return item;
  }

  async getPromptTemplates(): Promise<PromptTemplateItem[]> {
    return [
      { type: "GENERAL", name: "General Overview Prompt" },
      { type: "COMPARISON", name: "Head-to-Head Comparison Prompt" },
      { type: "FAQ", name: "FAQ & Knowledge Prompt" },
      { type: "BUYER", name: "Buyer Guide & Evaluation Prompt" },
      { type: "PROBLEM", name: "Problem & Solution Prompt" },
      { type: "PRICING", name: "Pricing & ROI Prompt" },
      { type: "ALTERNATIVE", name: "Alternatives & Competitor Prompt" },
    ];
  }

  async getOverview(organizationId?: string): Promise<KeywordIntelligenceOverview> {
    const kws = await this.getKeywords(organizationId);
    const totalTrackedKeywords = kws.length;
    const totalSearchVolume = kws.reduce((acc, k) => acc + (k.searchVolume || 0), 0);
    const avgOpportunityScore = kws.length > 0
      ? +(kws.reduce((acc, k) => acc + (k.opportunityScore || 0), 0) / kws.length).toFixed(1)
      : 89.2;

    return {
      totalTrackedKeywords,
      totalSearchVolume,
      avgOpportunityScore,
      activeClustersCount: this.clusters.length,
      activeCampaignsCount: this.campaigns.length,
      avgCitationScore: 92.4,
    };
  }
}

export class MockRetrievalIntelligenceProvider implements IRetrievalIntelligenceProvider {
  private sources: SourceItem[] = [
    {
      id: "src-mock-1",
      domain: "docs.stripe.com",
      name: "Stripe Documentation",
      sourceType: "DOCUMENTATION",
      authorityScore: 96,
      trustScore: 98,
      citationCount: 420,
      isVerified: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: "src-mock-2",
      domain: "developer.mozilla.org",
      name: "MDN Web Docs",
      sourceType: "DOCUMENTATION",
      authorityScore: 98,
      trustScore: 99,
      citationCount: 512,
      isVerified: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: "src-mock-3",
      domain: "en.wikipedia.org",
      name: "Wikipedia Knowledge Base",
      sourceType: "WIKIPEDIA",
      authorityScore: 94,
      trustScore: 92,
      citationCount: 680,
      isVerified: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: "src-mock-4",
      domain: "github.com",
      name: "GitHub Repositories",
      sourceType: "DOCUMENTATION",
      authorityScore: 95,
      trustScore: 96,
      citationCount: 389,
      isVerified: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: "src-mock-5",
      domain: "arxiv.org",
      name: "arXiv AI Research",
      sourceType: "ACADEMIC",
      authorityScore: 97,
      trustScore: 98,
      citationCount: 295,
      isVerified: true,
      createdAt: new Date().toISOString(),
    },
  ];

  private projects: ResearchProjectItem[] = [
    {
      id: "rp-mock-1",
      organizationId: "f5bb0153-e41a-49ee-97dc-e03dc6228403",
      title: "Enterprise AI Search & GEO Citation Strategy Q4",
      description: "Comprehensive retrieval intelligence analysis benchmarking Dyvin AI citation share against top AI answer engines.",
      status: "COMPLETED",
      priority: "HIGH",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      topics: [
        {
          id: "top-mock-1",
          projectId: "rp-mock-1",
          name: "Generative Engine Optimization (GEO) Benchmarks",
          description: "Tracking citations across Perplexity Sonar, ChatGPT Search, Claude 3.5, and Google Gemini Pro.",
          createdAt: new Date().toISOString(),
        },
      ],
      findings: [
        {
          id: "find-mock-1",
          projectId: "rp-mock-1",
          topicId: "top-mock-1",
          title: "Schema Markup Correlates with +32% Citation Probability",
          summary: "Websites featuring detailed Organization and SoftwareApplication JSON-LD entities gained 32% more citations.",
          type: "TREND",
          confidence: "HIGH",
          createdAt: new Date().toISOString(),
        },
      ],
      reports: [
        {
          id: "rep-mock-1",
          projectId: "rp-mock-1",
          title: "Q4 Executive AI Retrieval Intelligence Digest",
          reportType: "EXECUTIVE_BRIEF",
          contentBody: "# Executive AI Retrieval Intelligence Digest\n\nRetrieval precision reached 96.2% across primary technical prompts.",
          createdAt: new Date().toISOString(),
        },
      ],
    },
    {
      id: "rp-mock-2",
      organizationId: "f5bb0153-e41a-49ee-97dc-e03dc6228403",
      title: "Autonomous Competitor Search Disruption Monitor",
      description: "Continuous scanning of competitive maneuvers across OpenAI SearchGPT, Perplexity, and Claude.",
      status: "IN_PROGRESS",
      priority: "CRITICAL",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  // Retrieval Intelligence
  async getRetrievalOverview(): Promise<RetrievalOverviewData> {
    return {
      totalRetrievals: 5,
      successRatePct: 98.5,
      avgLatencyMs: 320,
      avgTokensPerRetrieval: 450,
    };
  }

  async getRetrievalHistory(): Promise<any> {
    return this.getRetrievalOverview();
  }

  async getRetrievalTimeline(): Promise<{ timeline: RetrievalTimelineItem[] }> {
    return {
      timeline: [
        { date: "2026-10-25", retrievals: 95 },
        { date: "2026-10-26", retrievals: 110 },
        { date: "2026-10-27", retrievals: 140 },
        { date: "2026-10-28", retrievals: 128 },
        { date: "2026-10-29", retrievals: 165 },
      ],
    };
  }

  async getRetrievalAnalytics(): Promise<RetrievalOverviewData> {
    return this.getRetrievalOverview();
  }

  async getCitationsOverview(): Promise<CitationsOverviewData> {
    return {
      citationsCount: 450,
      uniqueDomains: 85,
    };
  }

  async getCitationsTimeline(): Promise<{ timeline: CitationsTimelineItem[] }> {
    return {
      timeline: [
        { date: "2026-10-25", citations: 32 },
        { date: "2026-10-26", citations: 38 },
        { date: "2026-10-27", citations: 45 },
        { date: "2026-10-28", citations: 52 },
        { date: "2026-10-29", citations: 61 },
      ],
    };
  }

  async getCitationsInsights(): Promise<{ insights: string[] }> {
    return {
      insights: [
        "Domain authority in technical docs increased by 15%",
        "Direct citation probability in comparison queries is 88.5%",
        "Adding schema markup correlates with a 32% boost in Perplexity synthesis",
      ],
    };
  }

  async getSources(limit?: number): Promise<SourceItem[]> {
    return limit ? this.sources.slice(0, limit) : this.sources;
  }

  async getSourceLeaderboard(): Promise<SourceLeaderboardItem[]> {
    return this.sources.map((s, idx) => ({
      id: `lead-${idx + 1}`,
      sourceId: s.id,
      domain: s.domain,
      rankPosition: idx + 1,
      score: +(99 - idx * 2.8).toFixed(1),
      recordedAt: new Date().toISOString(),
    }));
  }

  async getSourceById(id: string): Promise<SourceItem | null> {
    return this.sources.find((s) => s.id === id || s.domain === id) || null;
  }

  async getURLPerformance(url?: string): Promise<URLPerformanceItem[] | URLPerformanceItem> {
    const list: URLPerformanceItem[] = [
      { id: "url-1", url: "https://docs.stripe.com/billing/subscriptions/overview", citationCount: 142, retrievalCount: 520, visibilityScore: 96.5 },
      { id: "url-2", url: "https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API", citationCount: 189, retrievalCount: 680, visibilityScore: 98.2 },
      { id: "url-3", url: "https://en.wikipedia.org/wiki/Retrieval-augmented_generation", citationCount: 310, retrievalCount: 1120, visibilityScore: 99.4 },
      { id: "url-4", url: "https://github.com/langchain-ai/langchain", citationCount: 98, retrievalCount: 430, visibilityScore: 91.0 },
      { id: "url-5", url: "https://arxiv.org/abs/2312.10997", citationCount: 76, retrievalCount: 310, visibilityScore: 89.5 },
    ];
    if (url) {
      return list.find((u) => u.url === url) || list[0];
    }
    return list;
  }

  async getDomainPerformance(domain?: string): Promise<DomainPerformanceItem[] | DomainPerformanceItem> {
    const list: DomainPerformanceItem[] = [
      { id: "dom-1", domain: "docs.stripe.com", totalUrls: 48, totalCitations: 420 },
      { id: "dom-2", domain: "developer.mozilla.org", totalUrls: 72, totalCitations: 512 },
      { id: "dom-3", domain: "en.wikipedia.org", totalUrls: 120, totalCitations: 680 },
      { id: "dom-4", domain: "github.com", totalUrls: 64, totalCitations: 389 },
      { id: "dom-5", domain: "arxiv.org", totalUrls: 36, totalCitations: 295 },
    ];
    if (domain) {
      return list.find((d) => d.domain === domain) || list[0];
    }
    return list;
  }

  async getPromptPerformance(promptId?: string): Promise<PromptPerformanceItem[] | PromptPerformanceItem> {
    const list: PromptPerformanceItem[] = [
      { id: "pp-1", promptId: "prompt-geo-brand-01", successRate: 98.5, citationPct: 91.2, retrievalPct: 95.0, averageRank: 1.2 },
      { id: "pp-2", promptId: "prompt-tech-eval-02", successRate: 96.0, citationPct: 88.0, retrievalPct: 92.5, averageRank: 1.5 },
      { id: "pp-3", promptId: "prompt-competitor-diff-03", successRate: 94.5, citationPct: 84.5, retrievalPct: 89.0, averageRank: 1.8 },
    ];
    if (promptId) {
      return list.find((p) => p.promptId === promptId) || list[0];
    }
    return list;
  }

  async getModelComparison(): Promise<ModelComparisonItem[]> {
    return [
      { provider: "OPENAI", model: "gpt-4o", citationRatePct: 88.5, avgRetrievedSources: 4.2, overlapPct: 82.0 },
      { provider: "CLAUDE", model: "claude-3-5-sonnet", citationRatePct: 91.0, avgRetrievedSources: 4.8, overlapPct: 85.5 },
      { provider: "GEMINI", model: "gemini-1.5-pro", citationRatePct: 84.0, avgRetrievedSources: 3.9, overlapPct: 78.0 },
      { provider: "PERPLEXITY", model: "sonar-pro", citationRatePct: 95.0, avgRetrievedSources: 5.5, overlapPct: 89.0 },
    ];
  }

  // Research Intelligence
  async runResearch(input: StartResearchInput): Promise<ResearchProjectItem> {
    const newProj: ResearchProjectItem = {
      id: `rp-mock-${Date.now()}`,
      organizationId: input.organizationId,
      title: input.title,
      description: input.description || "Autonomous multi-source research discovery project",
      status: "COMPLETED",
      priority: "HIGH",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      topics: [
        {
          id: `top-mock-${Date.now()}`,
          projectId: `rp-mock-${Date.now()}`,
          name: "Emerging AI Search Query Patterns",
          description: "Synthesized from multi-agent discovery queue",
          createdAt: new Date().toISOString(),
        },
      ],
      findings: [
        {
          id: `find-mock-${Date.now()}`,
          projectId: `rp-mock-${Date.now()}`,
          title: "New Citation Vectors Detected",
          summary: "Automated discovery identified 6 new domain citation authorities.",
          type: "TREND",
          confidence: "HIGH",
          createdAt: new Date().toISOString(),
        },
      ],
    };
    this.projects.unshift(newProj);
    return newProj;
  }

  async getResearchProjects(organizationId?: string): Promise<ResearchProjectItem[]> {
    if (organizationId) {
      return this.projects.filter((p) => p.organizationId === organizationId);
    }
    return this.projects;
  }

  async getResearchTopics(projectId?: string): Promise<ResearchTopicItem[]> {
    const topics: ResearchTopicItem[] = [];
    for (const p of this.projects) {
      if (!projectId || p.id === projectId) {
        if (p.topics) topics.push(...p.topics);
      }
    }
    return topics;
  }

  async getResearchTrends(): Promise<ResearchTrendItem[]> {
    return [
      { id: "tr-1", keywordText: "Generative Engine Optimization", direction: "RISING", growthRatePct: 48.5, detectedAt: new Date().toISOString() },
      { id: "tr-2", keywordText: "LLM Citation Provenance Tracking", direction: "RISING", growthRatePct: 62.0, detectedAt: new Date().toISOString() },
      { id: "tr-3", keywordText: "Legacy Keyword Density Optimization", direction: "FALLING", growthRatePct: -18.2, detectedAt: new Date().toISOString() },
    ];
  }

  async getResearchOpportunities(): Promise<ResearchOpportunityItem[]> {
    return [
      { id: "opp-1", title: "Publish Real-Time AI Search Benchmarks Hub", description: "Deploy an open data hub comparing LLM citation speeds to attract 45+ academic citations.", potentialImpact: 94.5, createdAt: new Date().toISOString() },
      { id: "opp-2", title: "Enrich API SDK Documentation with Runnable Sandboxes", description: "Embedding live code execution sandboxes boosts MDN/GitHub developer citations by 28%.", potentialImpact: 89.0, createdAt: new Date().toISOString() },
      { id: "opp-3", title: "Deploy Multi-Agent RAG Fallback Routers", description: "Automatic failover between vector stores ensures zero dropped retrieval operations.", potentialImpact: 91.5, createdAt: new Date().toISOString() },
    ];
  }

  async getResearchThreats(): Promise<ResearchThreatItem[]> {
    return [
      { id: "thr-1", title: "Competitor Beta Released Comprehensive GEO Comparison Guide", description: "Competitor Beta captured 3 key citation slots on Perplexity for enterprise search comparison queries.", severity: "HIGH", detectedAt: new Date().toISOString() },
      { id: "thr-2", title: "Outdated Documentation Rank Decay", description: "Legacy v1 API references lost 12 citations following the latest Perplexity index refresh.", severity: "MEDIUM", detectedAt: new Date().toISOString() },
    ];
  }

  async getResearchFindings(projectId?: string): Promise<ResearchFindingItem[]> {
    const findings: ResearchFindingItem[] = [];
    for (const p of this.projects) {
      if (!projectId || p.id === projectId) {
        if (p.findings) findings.push(...p.findings);
      }
    }
    return findings;
  }

  async getResearchReports(projectId?: string): Promise<ResearchReportItem[]> {
    const reports: ResearchReportItem[] = [];
    for (const p of this.projects) {
      if (!projectId || p.id === projectId) {
        if (p.reports) reports.push(...p.reports);
      }
    }
    return reports;
  }

  async getResearchBenchmarks(): Promise<ResearchBenchmarkItem[]> {
    return [
      { metricName: "Mean Retrieval Latency (ms)", benchmarkValue: 145.0 },
      { metricName: "Citation Verification Rate (%)", benchmarkValue: 92.4 },
      { metricName: "Cross-Model Source Overlap (%)", benchmarkValue: 84.8 },
      { metricName: "RAG Retrieval Precision Score", benchmarkValue: 96.2 },
    ];
  }

  async getResearchHistory(): Promise<ResearchExecutionHistoryItem[]> {
    return [
      { id: "hist-1", action: "Automated discovery scan completed for 42 documentation sources", recordedAt: new Date().toISOString() },
      { id: "hist-2", action: "Cross-model citation alignment analyzed across Perplexity and GPT-4o", recordedAt: new Date().toISOString() },
      { id: "hist-3", action: "Synthesized Executive AI Retrieval Intelligence Digest Q4", recordedAt: new Date().toISOString() },
      { id: "hist-4", action: "Competitor threat alert dispatched: Competitor Beta GEO guide", recordedAt: new Date().toISOString() },
    ];
  }
}

export class MockGlobalIntelligenceProvider implements IGlobalIntelligenceProvider {
  async getGlobalOverview(): Promise<GlobalIntelligenceWarehouseStats> {
    return {
      totalFactsRecorded: 8500000,
      totalResponsesStored: 4200000,
      totalCitationsIndexed: 14500000,
      totalDomainsTracked: 950000,
      warehouseStatus: "APPEND_ONLY_OPERATIONAL",
      retentionPolicy: "PERMANENT_IMMUTABLE",
      activeNodes: 48,
      lastSyncTimestamp: new Date().toISOString(),
    };
  }

  async getWarehouseStats(): Promise<GlobalIntelligenceWarehouseStats> {
    return {
      totalFactsRecorded: 8500000,
      totalResponsesStored: 4200000,
      totalCitationsIndexed: 14500000,
      totalDomainsTracked: 950000,
      warehouseStatus: "APPEND_ONLY_OPERATIONAL",
      retentionPolicy: "PERMANENT_IMMUTABLE",
      activeNodes: 48,
      lastSyncTimestamp: new Date().toISOString(),
    };
  }

  async getGlobalCitations(): Promise<GlobalCitationItem[]> {
    return [
      { id: "cit-1", domain: "wikipedia.org", url: "https://wikipedia.org/wiki/Artificial_intelligence", frequency: 245000, authorityScore: 98.0, firstSeenAt: "2025-01-10T00:00:00Z", lastSeenAt: new Date().toISOString() },
      { id: "cit-2", domain: "github.com", url: "https://github.com/dyvin-ai/platform", frequency: 185000, authorityScore: 96.5, firstSeenAt: "2025-01-15T00:00:00Z", lastSeenAt: new Date().toISOString() },
      { id: "cit-3", domain: "stackoverflow.com", url: "https://stackoverflow.com/questions/ai", frequency: 142000, authorityScore: 94.0, firstSeenAt: "2025-02-01T00:00:00Z", lastSeenAt: new Date().toISOString() },
      { id: "cit-4", domain: "docs.dyvin.ai", url: "https://docs.dyvin.ai/enterprise/architecture", frequency: 98000, authorityScore: 97.5, firstSeenAt: "2025-01-01T00:00:00Z", lastSeenAt: new Date().toISOString() },
      { id: "cit-5", domain: "arxiv.org", url: "https://arxiv.org/abs/2602.09102", frequency: 89000, authorityScore: 98.5, firstSeenAt: "2025-02-10T00:00:00Z", lastSeenAt: new Date().toISOString() },
    ];
  }

  async getGlobalDomains(): Promise<GlobalDomainProfile[] | GlobalDomainProfile> {
    return [
      { domain: "wikipedia.org", trustScore: 99.2, citationCount: 42000, visibilityTrend: "UPWARD", topCitedUrls: ["https://wikipedia.org/wiki/Artificial_intelligence"] },
      { domain: "docs.dyvin.ai", trustScore: 97.5, citationCount: 28400, visibilityTrend: "UPWARD", topCitedUrls: ["https://docs.dyvin.ai/guides/geo-strategy"] },
      { domain: "github.com", trustScore: 96.0, citationCount: 22100, visibilityTrend: "STABLE", topCitedUrls: ["https://github.com/dyvin-ai/platform"] },
      { domain: "arxiv.org", trustScore: 98.8, citationCount: 19500, visibilityTrend: "UPWARD", topCitedUrls: ["https://arxiv.org/abs/2601.12990"] },
    ];
  }

  async getGlobalUrls(): Promise<GlobalUrlProfile[] | GlobalUrlProfile> {
    return [
      { url: "https://wikipedia.org/wiki/Artificial_intelligence", domain: "wikipedia.org", authorityScore: 98.0, citationCount: 12500, freshnessIndex: 0.98 },
      { url: "https://docs.dyvin.ai/enterprise/architecture", domain: "docs.dyvin.ai", authorityScore: 97.0, citationCount: 8400, freshnessIndex: 0.99 },
      { url: "https://arxiv.org/abs/2602.09102", domain: "arxiv.org", authorityScore: 96.5, citationCount: 6200, freshnessIndex: 0.95 },
    ];
  }

  async getGlobalModels(): Promise<GlobalModelBehaviorItem[]> {
    return [
      { provider: "OPENAI", model: "gpt-4o", citationPreference: "TECHNICAL_DOCUMENTATION", avgLatencyMs: 412, confidence: 0.96, hallucinationRate: 0.018 },
      { provider: "ANTHROPIC", model: "claude-3-5-sonnet", citationPreference: "RESEARCH_PAPERS", avgLatencyMs: 382, confidence: 0.97, hallucinationRate: 0.012 },
      { provider: "GOOGLE", model: "gemini-1.5-pro", citationPreference: "STRUCTURED_DATA", avgLatencyMs: 440, confidence: 0.94, hallucinationRate: 0.021 },
      { provider: "PERPLEXITY", model: "sonar-pro", citationPreference: "REALTIME_SEARCH", avgLatencyMs: 315, confidence: 0.95, hallucinationRate: 0.015 },
    ];
  }

  async getGlobalTrends(): Promise<GlobalTrendItem> {
    return {
      topicName: "Generative Search Discovery",
      trendPeriod: "WEEKLY",
      growthPct: 24.8,
      fastestGrowingCitationDomains: [
        "docs.dyvin.ai",
        "docs.github.com",
        "developer.mozilla.org",
        "arxiv.org",
      ],
    };
  }

  async getGlobalResponses(): Promise<any> {
    return {
      responsesStored: 4200000,
      supportedModels: ["GPT-4o", "Claude 3.5 Sonnet", "Gemini 1.5 Pro", "Perplexity Sonar"],
    };
  }

  async getGlobalHistory(): Promise<any> {
    return {
      totalQueriesLogged: 14850000,
      p99LatencyMs: 425,
      auditIntegrityStatus: "VERIFIED",
    };
  }

  async getGlobalSources(): Promise<any> {
    return [
      { sourceKey: "node_docs_dyvin_ai", nodeType: "DOMAIN", influenceScore: 94.8 },
      { sourceKey: "node_arxiv_ai_papers", nodeType: "ACADEMIC_REPO", influenceScore: 98.1 },
      { sourceKey: "node_github_code_artifacts", nodeType: "REPOSITORY", influenceScore: 93.6 },
    ];
  }

  async searchGlobalWarehouse(query: string): Promise<any> {
    return [
      {
        id: "glb-srch-1",
        query,
        matchedContent: "Generative Engine Optimization (GEO) architectural blueprint and citation matrices...",
        model: "gpt-4o",
        timestamp: new Date().toISOString(),
      }
    ];
  }

  async replayGlobalResponse(id: string): Promise<any> {
    return {
      id,
      promptText: "Explain enterprise generative engine optimization (GEO)",
      responseText: "Generative Engine Optimization (GEO) is the discipline of optimizing digital brand authority and content structures for AI answer synthesis...",
      model: "gpt-4o",
      tokens: 342,
      latencyMs: 412.5,
      recordedAt: new Date().toISOString(),
    };
  }

  async getDashboard(): Promise<GlobalKnowledgeGraphOverview> {
    return {
      totalNodes: 84200,
      relationshipsTracked: 1450000,
      graphStatus: "GLOBAL_KNOWLEDGE_PROPAGATING",
      nodes: [
        { id: "n1", nodeKey: "kg_entity_dyvin", nodeType: "PLATFORM", label: "Dyvin AI Enterprise Engine", influenceScore: 98.5 },
        { id: "n2", nodeKey: "kg_entity_geo", nodeType: "CONCEPT", label: "Generative Engine Optimization", influenceScore: 96.2 },
        { id: "n3", nodeKey: "kg_entity_rag", nodeType: "ARCHITECTURE", label: "Retrieval Augmented Generation", influenceScore: 95.0 },
      ],
      edges: [
        { id: "e1", sourceNodeId: "n1", targetNodeId: "n2", relationship: "LEVERAGES_DISCIPLINE" },
        { id: "e2", sourceNodeId: "n2", targetNodeId: "n3", relationship: "INTERSECTS_WITH" },
      ],
    };
  }

  async getModelProfiles(): Promise<GlobalModelBehaviorItem[]> {
    return [
      { provider: "OPENAI", model: "gpt-4o", citationPref: "TECHNICAL_DOCUMENTATION", avgLatencyMs: 412, confidence: 0.96, hallucinationRate: 0.018 },
      { provider: "ANTHROPIC", model: "claude-3-5-sonnet", citationPref: "RESEARCH_PAPERS", avgLatencyMs: 382, confidence: 0.97, hallucinationRate: 0.012 },
      { provider: "GOOGLE", model: "gemini-1.5-pro", citationPref: "STRUCTURED_DATA", avgLatencyMs: 440, confidence: 0.94, hallucinationRate: 0.021 },
      { provider: "PERPLEXITY", model: "sonar-pro", citationPref: "REALTIME_SEARCH", avgLatencyMs: 315, confidence: 0.95, hallucinationRate: 0.015 },
    ];
  }

  async getTopics(): Promise<GlobalTopicItem[]> {
    return [
      { topicName: "Generative Engine Optimization", growthPct: 42.0, category: "AI_SEARCH", visibilityScore: 97.1 },
      { topicName: "Enterprise AI Governance", growthPct: 31.0, category: "GOVERNANCE", visibilityScore: 92.4 },
      { topicName: "Distributed Knowledge Mesh", growthPct: 28.5, category: "INFRASTRUCTURE", visibilityScore: 88.6 },
    ];
  }

  async getCitationEvolution(): Promise<any> {
    return [
      { domain: "docs.dyvin.ai", growthRate: 34.2, rankingShift: "+2" },
      { domain: "arxiv.org", growthRate: 18.5, rankingShift: "+1" },
    ];
  }

  async getSourceProfiles(): Promise<any> {
    return [
      { sourceDomain: "docs.dyvin.ai", authorityScore: 97.2, trustScore: 98.5 },
      { sourceDomain: "arxiv.org", authorityScore: 98.8, trustScore: 99.1 },
      { sourceDomain: "github.com", authorityScore: 95.0, trustScore: 96.5 },
    ];
  }

  async getDomains(): Promise<any> {
    return [
      { domain: "wikipedia.org", citationCount: 15400, trustScore: 99.2 },
      { domain: "docs.dyvin.ai", citationCount: 8400, trustScore: 96.0 },
    ];
  }

  async getKnowledgeGraph(): Promise<GlobalKnowledgeGraphOverview> {
    return this.getDashboard();
  }

  async getTopicTrends(): Promise<GlobalTrendItem[]> {
    return [
      { topicName: "Generative Search Discovery", trendPeriod: "WEEKLY", growthPct: 24.8 },
      { topicName: "Enterprise AI Governance", trendPeriod: "MONTHLY", growthPct: 18.2 },
      { topicName: "Distributed Knowledge Mesh", trendPeriod: "WEEKLY", growthPct: 31.5 },
    ];
  }

  async getArchiveStats(): Promise<GlobalArchiveStats> {
    return {
      archivedResponses: 12500000,
      supportedProviders: ["OPENAI", "ANTHROPIC", "GOOGLE", "PERPLEXITY"],
      retention: "PERMANENT_APPEND_ONLY",
      recentArchives: [
        {
          id: "arc-1",
          promptText: "Identify high-authority domain citations in generative AI search rankings",
          responseText: "Historical response snapshot: Across 1.2M queries analyzed, authoritative documentation domains like docs.dyvin.ai and arxiv.org account for 64% of synthesised citations.",
          provider: "Anthropic",
          model: "claude-3-5-sonnet",
          latencyMs: 395.4,
          archivedAt: new Date().toISOString(),
        },
        {
          id: "arc-2",
          promptText: "Telemetry benchmark for distributed AI nodes across global regions",
          responseText: "Historical response snapshot: Multi-region telemetry confirms p99 latency sub-450ms across US-East, EU-Central, and AP-East edge points.",
          provider: "OpenAI",
          model: "gpt-4o",
          latencyMs: 418.2,
          archivedAt: new Date().toISOString(),
        },
      ],
    };
  }

  async getNetworkStatistics(): Promise<GlobalNetworkStatistics> {
    return {
      proprietaryAssetValueUsd: 25000000,
      totalGraphEdges: 14500000,
      assetStatus: "ESTABLISHED_COMPETITIVE_MOAT",
      activeNodes: 48,
      avgMeshLatencyMs: 14.8,
    };
  }

  async getMultiRegionTelemetry(): Promise<MultiRegionLatencyItem[]> {
    return [
      { region: "us-east-1", location: "N. Virginia (Primary Core)", status: "ONLINE", latencyMs: 12.4, throughputRps: 1840, nodeCount: 16 },
      { region: "us-west-2", location: "Oregon (Pacific Hub)", status: "ONLINE", latencyMs: 24.1, throughputRps: 1250, nodeCount: 12 },
      { region: "eu-central-1", location: "Frankfurt (EMEA Core)", status: "ONLINE", latencyMs: 38.6, throughputRps: 1420, nodeCount: 12 },
      { region: "ap-southeast-1", location: "Singapore (APAC Gateway)", status: "ONLINE", latencyMs: 52.8, throughputRps: 890, nodeCount: 8 },
    ];
  }
}

export class MockAIOperatingSystemProvider implements IAIOperatingSystemProvider {
  private goals: StrategicGoalItem[] = [
    {
      id: "goal-1",
      organizationId: "f5bb0153-e41a-49ee-97dc-e03dc6228403",
      title: "Dominate Perplexity Sonar & Frontier Model Rankings",
      description: "Reach #1 recommendation frequency for enterprise GEO queries across Sonar, GPT-4o, and Claude 3.5 Sonnet.",
      targetDate: "2026-12-31T00:00:00Z",
      progressPct: 74.5,
      status: "IN_PROGRESS",
      createdAt: new Date().toISOString(),
    },
    {
      id: "goal-2",
      organizationId: "f5bb0153-e41a-49ee-97dc-e03dc6228403",
      title: "Scale Authoritative Apex Domain Citations to 500K+",
      description: "Expand verified citations across docs.dyvin.ai, arxiv.org, and top-tier developer platforms.",
      targetDate: "2027-01-31T00:00:00Z",
      progressPct: 62.0,
      status: "IN_PROGRESS",
      createdAt: new Date().toISOString(),
    },
    {
      id: "goal-3",
      organizationId: "f5bb0153-e41a-49ee-97dc-e03dc6228403",
      title: "Automate Closed-Loop Self-Healing Remediation Workflows",
      description: "Execute zero-touch autonomous prompt drift remediation across all production workspace monitors.",
      targetDate: "2026-11-30T00:00:00Z",
      progressPct: 88.0,
      status: "IN_PROGRESS",
      createdAt: new Date().toISOString(),
    },
  ];

  private plans: ExecutionPlanItem[] = [
    {
      id: "plan-1",
      goalId: "goal-1",
      title: "Multi-Agent High-Authority Citation Sweep & Verification",
      riskScore: 0.12,
      estimatedCost: 120.0,
      status: "EXECUTING",
      createdAt: new Date().toISOString(),
    },
    {
      id: "plan-2",
      goalId: "goal-2",
      title: "Cross-Engine Schema Injection & Knowledge Graph Mesh Sync",
      riskScore: 0.08,
      estimatedCost: 85.0,
      status: "EXECUTING",
      createdAt: new Date().toISOString(),
    },
    {
      id: "plan-3",
      goalId: "goal-3",
      title: "Autonomous Drift Detection & Continuous LLM Re-indexing",
      riskScore: 0.15,
      estimatedCost: 160.0,
      status: "EXECUTING",
      createdAt: new Date().toISOString(),
    },
  ];

  private executions: ExecutionTaskItem[] = [
    {
      id: "task-1",
      planId: "plan-1",
      agentRole: "RESEARCH_AGENT",
      title: "Deep crawl 120 technical documentation portals for citation drift",
      taskStatus: "COMPLETED",
      executedAt: new Date().toISOString(),
    },
    {
      id: "task-2",
      planId: "plan-1",
      agentRole: "CITATION_AGENT",
      title: "Synthesize verified source triples for apex domain authority",
      taskStatus: "COMPLETED",
      executedAt: new Date().toISOString(),
    },
    {
      id: "task-3",
      planId: "plan-2",
      agentRole: "SEO_AGENT",
      title: "Inject semantic structured JSON-LD into public knowledge graph",
      taskStatus: "COMPLETED",
      executedAt: new Date().toISOString(),
    },
    {
      id: "task-4",
      planId: "plan-3",
      agentRole: "ACTION_AGENT",
      title: "Trigger automatic prompt payload mutation on degraded visibility prompts",
      taskStatus: "COMPLETED",
      executedAt: new Date().toISOString(),
    },
  ];

  async getDashboard(): Promise<AIOperatingSystemDashboardData> {
    return {
      osVersion: "Dyvin AI 2.0 Autonomous OS",
      status: "HEALTHY_ORCHESTRATING",
      activeGoalsCount: this.goals.length,
      executingPlansCount: this.plans.length,
      coordinatedAgentsCount: 15,
      autonomousExecutionsToday: 240,
      lastHeartbeat: new Date().toISOString(),
    };
  }

  async getStatus(): Promise<AIOperatingSystemDashboardData> {
    return this.getDashboard();
  }

  async getGoals(): Promise<StrategicGoalItem[]> {
    return [...this.goals];
  }

  async createGoal(input: CreateStrategicGoalInput): Promise<StrategicGoalItem> {
    const newGoal: StrategicGoalItem = {
      id: "goal-" + Date.now(),
      organizationId: input.organizationId,
      title: input.title,
      description: input.description,
      targetDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
      progressPct: 0.0,
      status: "IN_PROGRESS",
      createdAt: new Date().toISOString(),
    };
    this.goals.unshift(newGoal);
    return newGoal;
  }

  async getPlans(): Promise<ExecutionPlanItem[]> {
    return [...this.plans];
  }

  async generatePlan(input: GenerateExecutionPlanInput): Promise<ExecutionPlanItem> {
    const newPlan: ExecutionPlanItem = {
      id: "plan-" + Date.now(),
      goalId: input.goalId,
      title: input.title,
      riskScore: 0.12,
      estimatedCost: 120.0,
      status: "EXECUTING",
      createdAt: new Date().toISOString(),
    };
    this.plans.unshift(newPlan);
    return newPlan;
  }

  async getExecutions(): Promise<ExecutionTaskItem[]> {
    return [...this.executions];
  }

  async executeTask(input: ExecuteTaskInput): Promise<ExecutionTaskItem> {
    const newTask: ExecutionTaskItem = {
      id: "task-" + Date.now(),
      planId: input.planId,
      agentRole: input.agentRole,
      title: input.title,
      taskStatus: "COMPLETED",
      executedAt: new Date().toISOString(),
    };
    this.executions.unshift(newTask);
    return newTask;
  }

  async getRecommendations(): Promise<OsRecommendationItem[]> {
    return [
      { id: "rec-1", title: "Deploy Automated Citation Verification Agent on GitHub/ArXiv Repositories", priority: "P0", visibilityGainPct: 54.0, createdAt: new Date().toISOString() },
      { id: "rec-2", title: "Scale Multi-Region Edge Ingress Nodes in EMEA Core to Reduce P99 Latency", priority: "P1", visibilityGainPct: 32.5, createdAt: new Date().toISOString() },
      { id: "rec-3", title: "Activate Closed-Loop Self-Healing Drift Recovery for Commercial Prompts", priority: "P0", visibilityGainPct: 48.0, createdAt: new Date().toISOString() },
    ];
  }

  async getStrategies(topic?: string): Promise<OsStrategyItem> {
    return {
      strategyTopic: topic || "Generative Engine Optimization",
      recommendedPillars: [
        "High-Authority Technical Documentation",
        "Direct Citation Engineering on Wikipedia/GitHub",
        "Cross-Model Preference Alignment",
      ],
      estimatedTimeframeMonths: 3,
      expectedVisibilityGainPct: 340,
    };
  }

  async getDecisions(): Promise<OsDecisionItem[]> {
    return [
      { id: "dec-1", recommendation: "Prioritize documentation-first citation engineering over generic blog syndication", expectedRoi: 4.5, confidence: 0.98, createdAt: new Date().toISOString() },
      { id: "dec-2", recommendation: "Allocate 60% of autonomous agent compute to Perplexity and Claude citation pipelines", expectedRoi: 3.8, confidence: 0.95, createdAt: new Date().toISOString() },
      { id: "dec-3", recommendation: "Enforce real-time telemetry consensus before automated remediation deployment", expectedRoi: 5.2, confidence: 0.97, createdAt: new Date().toISOString() },
    ];
  }

  async getReflections(): Promise<OsReflectionItem[]> {
    return [
      { id: "ref-1", executionId: "exec-sweep-001", success: true, learnings: "Parallel consensus agent coordination reduced total execution latency from 12.4s to 3.8s with zero token overhead.", analyzedAt: new Date().toISOString() },
      { id: "ref-2", executionId: "exec-sweep-002", success: true, learnings: "Direct citation anchoring on technical documentation URLs yielded +28% higher model retrieval retention across Claude 3.5 Sonnet.", analyzedAt: new Date().toISOString() },
      { id: "ref-3", executionId: "exec-sweep-003", success: true, learnings: "Tree-of-thoughts reasoning paths pruned 4 conflicting prompt mutations before production deployment, preventing visibility regressions.", analyzedAt: new Date().toISOString() },
    ];
  }

  async getAgents(): Promise<CoordinatedAgentItem[]> {
    return [
      { role: "RESEARCH_AGENT", status: "IDLE", currentTask: "Awaiting scheduled hourly crawl" },
      { role: "SEO_AGENT", status: "EXECUTING", currentTask: "Syncing Schema triples to public knowledge graph" },
      { role: "CITATION_AGENT", status: "IDLE", currentTask: "Standby for cross-engine citation anomalies" },
      { role: "ACTION_AGENT", status: "EXECUTING", currentTask: "Autonomous payload drift mutation running" },
      { role: "CUSTOMER_SUCCESS_AGENT", status: "IDLE", currentTask: "Scheduled executive digest dispatch at 00:00 UTC" },
    ];
  }
}
