import {
  actionPlansProvider,
  agentsProvider,
  analyticsProvider,
  authProvider,
  billingProvider,
  brandIntelligenceProvider,
  competitorsProvider,
  decisionsProvider,
  insightsProvider,
  notificationsProvider,
  promptsProvider,
  reportsProvider,
  scanProvider,
  sourcesProvider,
  strategyProvider,
  understandingProvider,
  consistencyProvider,
  remediationProvider,
  executiveProvider,
  autonomousOpsProvider,
  platformAdminProvider,
  observabilityProvider,
  workforceProvider,
  knowledgeGraphProvider,
  vectorIntelligenceProvider,
  aiSearchIntelligenceProvider,
  businessExecutionProvider,
  customerIntelligenceProvider,
  customerSuccessProvider,
  industryCloudProvider,
  ecosystemProvider,
  aiEvolutionProvider,
  innovationLabProvider,
  aiGovernanceProvider,
  appPlatformProvider,
  integrationHubProvider,
  developerPlatformProvider,
  keywordIntelligenceProvider,
  retrievalIntelligenceProvider,
  globalIntelligenceProvider,
  aiOperatingSystemProvider,
  workspaceProvider,
} from "./providers";
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
  BrandProfileData,
  BrandUnderstandingData,
  BrandAccuracyData,
  BrandPresenceData,
  CompetitiveGapItem,
  BrandIntelligenceResponse,
  CitationSource,
  CompetitorRow,
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
  ReportSummary,
  ScanItem,
  ScanMetadataItem,
  ScanPageItem,
  ScanStatus,
  StrategyAction,
  StrategyOverview,
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
  PromptEvolution,
  WorkflowEvolution,
  StrategyEvolution,
  AIQualityOverview,
  BenchmarkSnapshot,
  AIProviderScorecard,
  EvolutionHistoryRecord,
  EvolutionStatistics,
  OptimalRouteRecommendation,
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
  User,
  VisibilityBaselineState,
  VisibilityPoint,
  Workspace,
} from "@/types";


export * from "./apiClient";
export * from "./providers";

/**
 * Domain Service Layer
 * Cleanly separates UI from data providers (MockProvider / ApiProvider).
 */

export const analyticsService = {
  // Sync fallbacks for instant initial render
  getSummary(): OverviewSummary {
    return summary;
  },
  getVisibilitySeries(period: string = "30d"): VisibilityPoint[] {
    return visibilitySeries[period] ?? visibilitySeries["30d"]!;
  },
  getModelPerformance(): ModelPerformance[] {
    return modelPerformance;
  },

  // Async provider methods for backend API integration
  async fetchSummary(): Promise<OverviewSummary> {
    return analyticsProvider.getSummary();
  },
  async fetchVisibilitySeries(period?: string): Promise<VisibilityPoint[]> {
    return analyticsProvider.getVisibilitySeries(period);
  },
  async fetchModelPerformance(): Promise<ModelPerformance[]> {
    return analyticsProvider.getModelPerformance();
  },
  async getScanStatus(): Promise<ScanStatus> {
    return analyticsProvider.getScanStatus();
  },
  async triggerScan(): Promise<ScanStatus> {
    return analyticsProvider.triggerScan();
  },
  async fetchBaselineState(projectId?: string): Promise<VisibilityBaselineState> {
    return analyticsProvider.getBaselineState(projectId);
  },
  async triggerBaselineScan(projectId?: string): Promise<VisibilityBaselineState> {
    return analyticsProvider.triggerBaselineScan(projectId);
  },
  async fetchOverview(projectId?: string): Promise<OverviewResponse> {
    return analyticsProvider.getOverview(projectId);
  },
};

export const competitorsService = {
  list(): CompetitorRow[] {
    return competitors;
  },
  async fetchList(): Promise<CompetitorRow[]> {
    return competitorsProvider.list();
  },
  async get(id: string): Promise<CompetitorRow | undefined> {
    return competitorsProvider.get(id);
  },
  async runComparison(competitorId: string, brandScore?: number): Promise<any> {
    return competitorsProvider.runComparison(competitorId, brandScore);
  },
};

export const promptsService = {
  list(filter?: FilterParams): PromptPerformance[] {
    let result = prompts;
    if (filter?.categories && filter.categories.length > 0 && !filter.categories.includes("All")) {
      result = result.filter((p) => filter.categories!.includes(p.category));
    }
    if (filter?.search) {
      const q = filter.search.toLowerCase();
      result = result.filter((p) => p.prompt.toLowerCase().includes(q));
    }
    return result;
  },
  get(id: string): PromptPerformance | undefined {
    return prompts.find((p) => p.id === id);
  },
  async fetchList(filter?: FilterParams): Promise<PromptPerformance[]> {
    return promptsProvider.list(filter);
  },
  async fetchClusters(): Promise<PromptCluster[]> {
    return promptsProvider.getClusters();
  },
  async executePrompt(promptId: string, providerCode?: string): Promise<any> {
    return promptsProvider.executePrompt(promptId, providerCode);
  },
};

export const sourcesService = {
  list(filter?: FilterParams): CitationSource[] {
    let result = sources;
    if (filter?.categories && filter.categories.length > 0 && !filter.categories.includes("All")) {
      result = result.filter((s) => filter.categories!.includes(s.category || ""));
    }
    if (filter?.search) {
      const q = filter.search.toLowerCase();
      result = result.filter((s) => s.domain.toLowerCase().includes(q));
    }
    return result;
  },
  get(id: string): CitationSource | undefined {
    return sources.find((s) => s.id === id);
  },
  async fetchList(filter?: FilterParams): Promise<CitationSource[]> {
    return sourcesProvider.list(filter);
  },
};

export const insightsService = {
  list(projectId?: string): Insight[] {
    return insights;
  },
  async fetchList(projectId?: string): Promise<Insight[]> {
    return insightsProvider.list(projectId);
  },
  async updateStatus(id: string, status: Insight["status"]): Promise<Insight | undefined> {
    return insightsProvider.updateStatus(id, status);
  },
};

export const strategyService = {
  async getOverview(projectId?: string): Promise<StrategyOverview> {
    return strategyProvider.getOverview(projectId);
  },
  async updateActionStatus(actionId: string, status: StrategyAction["status"]): Promise<any> {
    return strategyProvider.updateActionStatus(actionId, status);
  },
};

export const decisionsService = {
  list(): DecisionItem[] {
    return activeDecisions;
  },
  getOutcomes(): RecommendationOutcome[] {
    return previousRecommendations as RecommendationOutcome[];
  },
  async fetchList(): Promise<DecisionItem[]> {
    return decisionsProvider.list();
  },
  async fetchOutcomes(): Promise<RecommendationOutcome[]> {
    return decisionsProvider.getOutcomes();
  },
};

export const actionPlansService = {
  async list(): Promise<ActionPlanItem[]> {
    return actionPlansProvider.list();
  },
  async get(id: ActionPlanId): Promise<ActionPlanItem | undefined> {
    return actionPlansProvider.get(id);
  },
  async create(plan: Omit<ActionPlanItem, "id" | "createdAt" | "updatedAt">): Promise<ActionPlanItem> {
    return actionPlansProvider.create(plan);
  },
  async updateStatus(id: ActionPlanId, status: ActionPlanItem["status"]): Promise<ActionPlanItem | undefined> {
    return actionPlansProvider.updateStatus(id, status);
  },
  async delete(id: ActionPlanId): Promise<boolean> {
    return actionPlansProvider.delete(id);
  },
};

export const agentsService = {
  list(): AgentTask[] {
    return agentTasks;
  },
  async fetchList(projectId?: string): Promise<AgentDefinition[]> {
    return agentsProvider.list(projectId);
  },
  async get(agentId: string, projectId?: string): Promise<AgentDefinition | undefined> {
    return agentsProvider.get(agentId, projectId);
  },
  async triggerRun(agentId: string, projectId?: string): Promise<AgentRunResult> {
    return agentsProvider.triggerRun(agentId, projectId);
  },
  async updateStatus(
    agentId: string,
    update: { enabled?: boolean; status?: "ACTIVE" | "PAUSED" },
    projectId?: string,
  ): Promise<AgentDefinition> {
    return agentsProvider.updateStatus(agentId, update, projectId);
  },
  async getRuns(agentId: string, projectId?: string): Promise<AgentRunResult[]> {
    return agentsProvider.getRuns(agentId, projectId);
  },
};

export const reportsService = {
  async list(projectId?: string): Promise<ReportItem[]> {
    return reportsProvider.list(projectId);
  },
  async get(id: string): Promise<ReportItem | undefined> {
    return reportsProvider.get(id);
  },
  async generate(payload: GenerateReportPayload): Promise<ReportItem> {
    return reportsProvider.generate(payload);
  },
  async export(reportId: string, format: ExportFormat): Promise<ExportJobItem> {
    return reportsProvider.export(reportId, format);
  },
  async getExports(reportId: string): Promise<ExportJobItem[]> {
    return reportsProvider.getExports(reportId);
  },
  async delete(reportId: string): Promise<boolean> {
    return reportsProvider.delete(reportId);
  },
  getDownloadUrl(reportId: string, exportId: string): string {
    return reportsProvider.getDownloadUrl(reportId, exportId);
  },
  async downloadExport(
    reportId: string,
    exportId: string,
    format: ExportFormat = "PDF",
    fallbackName?: string,
  ): Promise<{ filename: string; blob: Blob }> {
    return reportsProvider.downloadExport(reportId, exportId, format, fallbackName);
  },
  async exportAndDownload(
    reportId: string,
    format: ExportFormat = "PDF",
    fallbackName?: string,
  ): Promise<ExportJobItem> {
    return reportsProvider.exportAndDownload(reportId, format, fallbackName);
  },
};

export const notificationsService = {
  async list(): Promise<NotificationItem[]> {
    return notificationsProvider.list();
  },
  async markAsRead(id?: string): Promise<boolean> {
    return notificationsProvider.markAsRead(id);
  },
  async delete(id: string): Promise<boolean> {
    return notificationsProvider.delete(id);
  },
  async clearAll(): Promise<boolean> {
    return notificationsProvider.clearAll();
  },
};

export const workspaceService = {
  async getWorkspace(): Promise<Workspace> {
    return workspaceProvider.getWorkspace();
  },
  async updateWorkspace(data: Partial<Workspace>): Promise<Workspace> {
    return workspaceProvider.updateWorkspace(data);
  },
  async getTeamMembers(): Promise<User[]> {
    return workspaceProvider.getTeamMembers();
  },
};

export const authService = {
  async getCurrentUser(): Promise<User | null> {
    return authProvider.getCurrentUser();
  },
  async login(email: string): Promise<User> {
    return authProvider.login(email);
  },
  async logout(): Promise<void> {
    return authProvider.logout();
  },
  getSessionToken(): string | null {
    return authProvider.getSessionToken();
  },
};

export const brandIntelligenceService = {
  async getBrandIntelligence(projectId?: string): Promise<BrandIntelligenceResponse> {
    return brandIntelligenceProvider.getBrandIntelligence(projectId);
  },
  async getBrandProfile(projectId?: string): Promise<BrandProfileData> {
    return brandIntelligenceProvider.getBrandProfile(projectId);
  },
  async getBrandUnderstanding(projectId?: string): Promise<BrandUnderstandingData> {
    return brandIntelligenceProvider.getBrandUnderstanding(projectId);
  },
  async getBrandAccuracy(projectId?: string): Promise<BrandAccuracyData> {
    return brandIntelligenceProvider.getBrandAccuracy(projectId);
  },
  async getBrandPresence(projectId?: string): Promise<BrandPresenceData> {
    return brandIntelligenceProvider.getBrandPresence(projectId);
  },
  async getCompetitiveGaps(projectId?: string): Promise<CompetitiveGapItem[]> {
    return brandIntelligenceProvider.getCompetitiveGaps(projectId);
  },
};

export const scanService = {
  async getScans(projectId?: string): Promise<ScanItem[]> {
    return scanProvider.getScans(projectId);
  },
  async getScanDetails(scanId: string): Promise<ScanItem> {
    return scanProvider.getScanDetails(scanId);
  },
  async getScanPages(scanId: string): Promise<ScanPageItem[]> {
    return scanProvider.getScanPages(scanId);
  },
  async getScanMetadata(scanId: string): Promise<ScanMetadataItem[]> {
    return scanProvider.getScanMetadata(scanId);
  },
  async getScanStructuredData(scanId: string): Promise<StructuredDataItem[]> {
    return scanProvider.getScanStructuredData(scanId);
  },
  async getScanTechnologies(scanId: string): Promise<TechnologyItem[]> {
    return scanProvider.getScanTechnologies(scanId);
  },
  async triggerScan(projectId: string, url?: string): Promise<ScanItem> {
    return scanProvider.triggerScan(projectId, url);
  },
};

export const billingService = {
  async getPlans(): Promise<SubscriptionPlan[]> {
    return billingProvider.getPlans();
  },
  async getSubscription(organizationId?: string): Promise<SubscriptionState> {
    return billingProvider.getSubscription(organizationId);
  },
  async getUsage(organizationId?: string): Promise<UsageMetric[]> {
    return billingProvider.getUsage(organizationId);
  },
  async getInvoices(organizationId?: string): Promise<InvoiceItem[]> {
    return billingProvider.getInvoices(organizationId);
  },
};

export const understandingService = {
  async getWarehouseStats(): Promise<WarehouseStats> {
    return understandingProvider.getWarehouseStats();
  },
  async getModels(): Promise<CrossModelStats> {
    return understandingProvider.getModels();
  },
  async getHistory(take?: number): Promise<AiResponseLedgerItem[]> {
    return understandingProvider.getHistory(take);
  },
  async replayResponse(responseId: string): Promise<any> {
    return understandingProvider.replayResponse(responseId);
  },
  async getAccuracy(projectId?: string): Promise<BrandAccuracyData> {
    return understandingProvider.getAccuracy(projectId);
  },
  async getUnderstanding(projectId?: string): Promise<BrandUnderstandingData> {
    return understandingProvider.getUnderstanding(projectId);
  },
};

export const consistencyService = {
  async getModels(): Promise<ModelConsistencyMetric[]> {
    return consistencyProvider.getModels();
  },
  async getCompetitors(): Promise<CompetitorBenchmarkItem[]> {
    return consistencyProvider.getCompetitors();
  },
  async getThreats(): Promise<ResearchThreatItem[]> {
    return consistencyProvider.getThreats();
  },
  async getAccuracy(projectId?: string): Promise<BrandAccuracyData> {
    return consistencyProvider.getAccuracy(projectId);
  },
  async getStatistics(): Promise<ConsistencyPlatformStats> {
    return consistencyProvider.getStatistics();
  },
};

export const remediationService = {
  async getPlaybooks(): Promise<RemediationPlaybookItem[]> {
    return remediationProvider.getPlaybooks();
  },
  async getActions(organizationId?: string): Promise<RemediationActionItem[]> {
    return remediationProvider.getActions(organizationId);
  },
  async createAction(input: {
    organizationId: string;
    title: string;
    description?: string;
    type: string;
    priority?: string;
    triggerType?: string;
    payloadJson?: Record<string, any>;
  }): Promise<RemediationActionItem> {
    return remediationProvider.createAction(input);
  },
  async runAction(actionId: string): Promise<RemediationActionItem> {
    return remediationProvider.runAction(actionId);
  },
  async getArtifacts(actionId?: string): Promise<RemediationArtifactItem[]> {
    return remediationProvider.getArtifacts(actionId);
  },
  async getStats(organizationId?: string): Promise<RemediationStats> {
    return remediationProvider.getStats(organizationId);
  },
};

export const executiveService = {
  async getOverview(): Promise<UnifiedBrandScoreSummary> {
    return executiveProvider.getOverview();
  },
  async getExplainabilityNodes(): Promise<ExplainabilityDecisionNode[]> {
    return executiveProvider.getExplainabilityNodes();
  },
  async getCommandCenterTelemetry(): Promise<GlobalCommandCenterTelemetry> {
    return executiveProvider.getCommandCenterTelemetry();
  },
  async getStrategicDecisions(): Promise<ExecutiveStrategicDecision[]> {
    return executiveProvider.getStrategicDecisions();
  },
};

export const autonomousOpsService = {
  async getOverview(): Promise<AutonomousOpsOverview> {
    return autonomousOpsProvider.getOverview();
  },
  async getHealth(): Promise<OpsComponentHealth[]> {
    return autonomousOpsProvider.getHealth();
  },
  async getIncidents(): Promise<SreIncidentItem[]> {
    return autonomousOpsProvider.getIncidents();
  },
  async getCapacity(): Promise<CapacityForecastMetric[]> {
    return autonomousOpsProvider.getCapacity();
  },
  async getCosts(): Promise<any> {
    return autonomousOpsProvider.getCosts();
  },
  async getPerformance(): Promise<any> {
    return autonomousOpsProvider.getPerformance();
  },
};

export const platformAdminService = {
  async getTenants(): Promise<TenantAdminItem[]> {
    return platformAdminProvider.getTenants();
  },
  async overrideQuota(payload: TenantQuotaOverridePayload): Promise<any> {
    return platformAdminProvider.overrideQuota(payload);
  },
  async getSupportTickets(tenantId?: string): Promise<SupportTicketItem[]> {
    return platformAdminProvider.getSupportTickets(tenantId);
  },
  async createSupportTicket(payload: CreateSupportTicketPayload): Promise<any> {
    return platformAdminProvider.createSupportTicket(payload);
  },
  async getAuditLogs(): Promise<AdminAuditLogItem[]> {
    return platformAdminProvider.getAuditLogs();
  },
  async startImpersonation(payload: { targetTenantId: string; reason: string }): Promise<any> {
    return platformAdminProvider.startImpersonation(payload);
  },
  async getFeatureFlags(): Promise<FeatureFlagItem[]> {
    return platformAdminProvider.getFeatureFlags();
  },
  async createFeatureFlag(payload: CreateFeatureFlagPayload): Promise<any> {
    return platformAdminProvider.createFeatureFlag(payload);
  },
  async updateFeatureFlag(id: string, payload: UpdateFeatureFlagPayload): Promise<any> {
    return platformAdminProvider.updateFeatureFlag(id, payload);
  },
};

export const observabilityService = {
  async getPrometheusMetricsText(): Promise<string> {
    return observabilityProvider.getPrometheusMetricsText();
  },
  async getDependencies(): Promise<DependencyTelemetryItem[]> {
    return observabilityProvider.getDependencies();
  },
  async getPerformance(): Promise<any> {
    return observabilityProvider.getPerformance();
  },
  async getTraces(): Promise<DistributedTraceWaterfall[]> {
    return observabilityProvider.getTraces();
  },
  async getTelemetrySummary(): Promise<ObservabilityTelemetrySummary> {
    return observabilityProvider.getTelemetrySummary();
  },
};

export const workforceService = {
  async getDashboard(): Promise<WorkforceOverviewTelemetry> {
    return workforceProvider.getDashboard();
  },
  async getEmployees(orgId?: string): Promise<DigitalEmployee[]> {
    return workforceProvider.getEmployees(orgId);
  },
  async hireEmployee(payload: HireDigitalEmployeePayload): Promise<DigitalEmployee> {
    return workforceProvider.hireEmployee(payload);
  },
  async getDepartments(): Promise<WorkforceDepartment[]> {
    return workforceProvider.getDepartments();
  },
  async getTasks(orgId?: string): Promise<WorkforceTask[]> {
    return workforceProvider.getTasks(orgId);
  },
  async assignTask(payload: AssignWorkforceTaskPayload): Promise<WorkforceTask> {
    return workforceProvider.assignTask(payload);
  },
  async getPerformance(): Promise<WorkforcePerformanceTelemetry> {
    return workforceProvider.getPerformance();
  },
  async getTraining(): Promise<WorkforceTrainingTelemetry> {
    return workforceProvider.getTraining();
  },
  async getSchedules(): Promise<WorkforceScheduleItem[]> {
    return workforceProvider.getSchedules();
  },
  async getStatistics(): Promise<WorkforceStatisticsTelemetry> {
    return workforceProvider.getStatistics();
  },
};

export const knowledgeGraphService = {
  async getKnowledgeGraph(projectId: string): Promise<KnowledgeGraphSummary | null> {
    return knowledgeGraphProvider.getKnowledgeGraph(projectId);
  },
  async getEntities(projectId: string): Promise<KnowledgeEntity[]> {
    return knowledgeGraphProvider.getEntities(projectId);
  },
  async getRelationships(projectId: string): Promise<KnowledgeRelationship[]> {
    return knowledgeGraphProvider.getRelationships(projectId);
  },
  async getFacts(projectId: string): Promise<KnowledgeFact[]> {
    return knowledgeGraphProvider.getFacts(projectId);
  },
  async getProducts(projectId: string): Promise<KnowledgeProduct[]> {
    return knowledgeGraphProvider.getProducts(projectId);
  },
  async getServices(projectId: string): Promise<KnowledgeServiceItem[]> {
    return knowledgeGraphProvider.getServices(projectId);
  },
};

export const vectorIntelligenceService = {
  async getMetrics(): Promise<VectorEngineMetrics> {
    return vectorIntelligenceProvider.getMetrics();
  },
  async getProviders(): Promise<VectorEmbeddingProviderInfo[]> {
    return vectorIntelligenceProvider.getProviders();
  },
  async getIndexes(): Promise<VectorIndexConfig[]> {
    return vectorIntelligenceProvider.getIndexes();
  },
  async getCollections(organizationId?: string): Promise<VectorCollectionItem[]> {
    return vectorIntelligenceProvider.getCollections(organizationId);
  },
  async search(query: string, organizationId?: string, topK?: number): Promise<VectorSearchResponse> {
    return vectorIntelligenceProvider.search(query, organizationId, topK);
  },
  async getSimilarity(textA: string, textB: string): Promise<VectorSimilarityResponse> {
    return vectorIntelligenceProvider.getSimilarity(textA, textB);
  },
  async generateEmbedding(text: string, provider?: EmbeddingProvider): Promise<VectorEmbeddingResponse> {
    return vectorIntelligenceProvider.generateEmbedding(text, provider);
  },
};

export const aiSearchIntelligenceService = {
  async getDashboard(): Promise<GeoDashboardOverview> {
    return aiSearchIntelligenceProvider.getDashboard();
  },
  async getVisibility(orgId?: string): Promise<GeoVisibilityTrends> {
    return aiSearchIntelligenceProvider.getVisibility(orgId);
  },
  async getCitations(): Promise<GeoCitationOverview> {
    return aiSearchIntelligenceProvider.getCitations();
  },
  async getRetrieval(): Promise<GeoRetrievalAnalytics> {
    return aiSearchIntelligenceProvider.getRetrieval();
  },
  async getModels(): Promise<GeoModelComparisonItem[]> {
    return aiSearchIntelligenceProvider.getModels();
  },
  async getCompetitors(): Promise<GeoCompetitorBenchmarkItem[]> {
    return aiSearchIntelligenceProvider.getCompetitors();
  },
  async getDomains(): Promise<GeoDomainAnalyticsItem[]> {
    return aiSearchIntelligenceProvider.getDomains();
  },
  async getUrls(): Promise<GeoUrlAnalyticsItem[]> {
    return aiSearchIntelligenceProvider.getUrls();
  },
  async getSources(): Promise<GeoSourceProfile[]> {
    return aiSearchIntelligenceProvider.getSources();
  },
  async getKeywords(): Promise<GeoKeywordAnalytics> {
    return aiSearchIntelligenceProvider.getKeywords();
  },
  async uploadKeywords(fileName: string, keywordsCount?: number): Promise<{ fileName: string; keywordsCount?: number; status: string }> {
    return aiSearchIntelligenceProvider.uploadKeywords(fileName, keywordsCount);
  },
  async getRecommendations(): Promise<GeoRecommendationItem[]> {
    return aiSearchIntelligenceProvider.getRecommendations();
  },
  async executeAction(actionType: string): Promise<GeoActionExecutionResult> {
    return aiSearchIntelligenceProvider.executeAction(actionType);
  },
  async getStatistics(): Promise<GeoPlatformStatistics> {
    return aiSearchIntelligenceProvider.getStatistics();
  },
};

export const businessExecutionService = {
  async getDashboard(): Promise<BusinessExecutionDashboardOverview> {
    return businessExecutionProvider.getDashboard();
  },
  async getOpportunities(orgId?: string): Promise<BusinessOpportunityItem[]> {
    return businessExecutionProvider.getOpportunities(orgId);
  },
  async getRootCauses(): Promise<RootCauseAnalysisItem[]> {
    return businessExecutionProvider.getRootCauses();
  },
  async getStrategies(orgId?: string): Promise<ExecutionStrategyItem[]> {
    return businessExecutionProvider.getStrategies(orgId);
  },
  async generateStrategy(input: GenerateStrategyInput): Promise<ExecutionStrategyItem> {
    return businessExecutionProvider.generateStrategy(input);
  },
  async getContent(): Promise<ContentExecutionItem[]> {
    return businessExecutionProvider.getContent();
  },
  async generateContent(input: GenerateContentInput): Promise<ContentExecutionItem> {
    return businessExecutionProvider.generateContent(input);
  },
  async getPublishing(): Promise<PublishingExecutionItem[]> {
    return businessExecutionProvider.getPublishing();
  },
  async publishContent(input: PublishContentInput): Promise<PublishingExecutionItem> {
    return businessExecutionProvider.publishContent(input);
  },
  async getWorkforce(): Promise<WorkforceExecutionStatus> {
    return businessExecutionProvider.getWorkforce();
  },
  async runExecution(input: RunExecutionInput): Promise<any> {
    return businessExecutionProvider.runExecution(input);
  },
  async getOptimization(): Promise<ClosedLoopOptimizationStatus> {
    return businessExecutionProvider.getOptimization();
  },
  async getHistory(): Promise<BusinessExecutionHistory> {
    return businessExecutionProvider.getHistory();
  },
  async getStatistics(): Promise<BusinessExecutionStatistics> {
    return businessExecutionProvider.getStatistics();
  },
};

export const customerIntelligenceService = {
  async getDashboard(orgId?: string): Promise<CustomerIntelligenceDashboardOverview> {
    return customerIntelligenceProvider.getDashboard(orgId);
  },
  async getTimeline(orgId?: string): Promise<CustomerTimelineItem[]> {
    return customerIntelligenceProvider.getTimeline(orgId);
  },
  async getMemory(orgId?: string): Promise<CustomerMemoryItem[]> {
    return customerIntelligenceProvider.getMemory(orgId);
  },
  async getHistory(orgId?: string): Promise<CustomerHistoryItem> {
    return customerIntelligenceProvider.getHistory(orgId);
  },
  async getKnowledge(orgId?: string): Promise<CustomerKnowledgeGraphResponse> {
    return customerIntelligenceProvider.getKnowledge(orgId);
  },
  async getGoals(orgId?: string): Promise<CustomerGoalsTelemetry> {
    return customerIntelligenceProvider.getGoals(orgId);
  },
  async getReports(orgId?: string): Promise<CustomerReportsTelemetry> {
    return customerIntelligenceProvider.getReports(orgId);
  },
  async getWarehouse(orgId?: string): Promise<CustomerWarehouseItem[]> {
    return customerIntelligenceProvider.getWarehouse(orgId);
  },
  async verifyPrivacy(orgId?: string): Promise<CustomerPrivacyVerification> {
    return customerIntelligenceProvider.verifyPrivacy(orgId);
  },
};

export const customerSuccessService = {
  async getDashboard(orgId?: string): Promise<CustomerSuccessDashboardOverview> {
    return customerSuccessProvider.getDashboard(orgId);
  },
  async getHealth(orgId?: string): Promise<CustomerHealthScoreData> {
    return customerSuccessProvider.getHealth(orgId);
  },
  async getJourney(orgId?: string): Promise<CustomerJourneyMilestoneItem[]> {
    return customerSuccessProvider.getJourney(orgId);
  },
  async getAdoption(orgId?: string): Promise<ProductAdoptionMetrics> {
    return customerSuccessProvider.getAdoption(orgId);
  },
  async getChurn(orgId?: string): Promise<CustomerChurnPredictionData> {
    return customerSuccessProvider.getChurn(orgId);
  },
  async getRenewal(orgId?: string): Promise<CustomerRenewalForecast> {
    return customerSuccessProvider.getRenewal(orgId);
  },
  async getExpansion(orgId?: string): Promise<CustomerExpansionOpportunity> {
    return customerSuccessProvider.getExpansion(orgId);
  },
  async getRecommendations(orgId?: string): Promise<CustomerSuccessPlanResponse> {
    return customerSuccessProvider.getRecommendations(orgId);
  },
  async getReports(): Promise<CustomerSuccessReportsData> {
    return customerSuccessProvider.getReports();
  },
  async getAcademy(): Promise<CustomerAcademyProgress> {
    return customerSuccessProvider.getAcademy();
  },
  async getReferrals(): Promise<CustomerAdvocacyStatus> {
    return customerSuccessProvider.getReferrals();
  },
};

export const industryCloudService = {
  async getDashboard(industry?: string): Promise<IndustryOverviewData> {
    return industryCloudProvider.getDashboard(industry);
  },
  async getBenchmarks(industry?: string): Promise<IndustryBenchmarkData> {
    return industryCloudProvider.getBenchmarks(industry);
  },
  async getReports(): Promise<IndustryReportsData> {
    return industryCloudProvider.getReports();
  },
  async getTrends(): Promise<IndustryTrendData> {
    return industryCloudProvider.getTrends();
  },
  async getLeaderboards(category?: string): Promise<IndustryLeaderboardResponse> {
    return industryCloudProvider.getLeaderboards(category);
  },
  async getPublicIndex(query?: string): Promise<IndustryPublicIndexData> {
    return industryCloudProvider.getPublicIndex(query);
  },
  async getAuthority(domain?: string): Promise<IndustryAuthorityData> {
    return industryCloudProvider.getAuthority(domain);
  },
  async getModels(): Promise<IndustryModelsPreference> {
    return industryCloudProvider.getModels();
  },
  async getPublications(): Promise<IndustryPublicationItem[]> {
    return industryCloudProvider.getPublications();
  },
  async getStatistics(): Promise<IndustryPlatformStatistics> {
    return industryCloudProvider.getStatistics();
  },
};

export const ecosystemService = {
  async getDashboard(): Promise<EcosystemDashboardOverview> {
    return ecosystemProvider.getDashboard();
  },
  async getAgencies(): Promise<AgencyProfileItem[]> {
    return ecosystemProvider.getAgencies();
  },
  async registerAgency(input: RegisterAgencyInput): Promise<AgencyProfileItem> {
    return ecosystemProvider.registerAgency(input);
  },
  async getPartners(): Promise<PartnerProfileItem[]> {
    return ecosystemProvider.getPartners();
  },
  async registerPartner(input: RegisterPartnerInput): Promise<PartnerProfileItem> {
    return ecosystemProvider.registerPartner(input);
  },
  async getReferrals(): Promise<EcosystemReferralItem[]> {
    return ecosystemProvider.getReferrals();
  },
  async createReferral(input: CreateReferralInput): Promise<EcosystemReferralItem> {
    return ecosystemProvider.createReferral(input);
  },
  async getAcademy(): Promise<AcademyCourseItem[]> {
    return ecosystemProvider.getAcademy();
  },
  async getCertifications(): Promise<ProfessionalCertificateItem[]> {
    return ecosystemProvider.getCertifications();
  },
  async getCommunity(): Promise<CommunityForumPostItem[]> {
    return ecosystemProvider.getCommunity();
  },
  async getEvents(): Promise<PlatformEventItem[]> {
    return ecosystemProvider.getEvents();
  },
  async getMarketplace(): Promise<PartnerListingItem[]> {
    return ecosystemProvider.getMarketplace();
  },
};

export const aiEvolutionService = {
  async getDashboard(): Promise<EvolutionDashboardData> {
    return aiEvolutionProvider.getDashboard();
  },
  async getModels(): Promise<EvolutionModelProfile[]> {
    return aiEvolutionProvider.getModels();
  },
  async getPrompts(): Promise<PromptEvolution[]> {
    return aiEvolutionProvider.getPrompts();
  },
  async getWorkflows(): Promise<WorkflowEvolution[]> {
    return aiEvolutionProvider.getWorkflows();
  },
  async getStrategies(): Promise<StrategyEvolution[]> {
    return aiEvolutionProvider.getStrategies();
  },
  async getQuality(): Promise<AIQualityOverview> {
    return aiEvolutionProvider.getQuality();
  },
  async getBenchmarks(): Promise<BenchmarkSnapshot[]> {
    return aiEvolutionProvider.getBenchmarks();
  },
  async getProviders(): Promise<AIProviderScorecard[]> {
    return aiEvolutionProvider.getProviders();
  },
  async getHistory(): Promise<EvolutionHistoryRecord[]> {
    return aiEvolutionProvider.getHistory();
  },
  async getStatistics(): Promise<EvolutionStatistics> {
    return aiEvolutionProvider.getStatistics();
  },
  async getOptimalRoute(taskType?: string): Promise<OptimalRouteRecommendation> {
    return aiEvolutionProvider.getOptimalRoute(taskType);
  },
};

export const innovationLabService = {
  async getDashboard(): Promise<InnovationDashboardData> {
    return innovationLabProvider.getDashboard();
  },
  async getExperiments(): Promise<InnovationExperimentItem[]> {
    return innovationLabProvider.getExperiments();
  },
  async createExperiment(input: CreateExperimentInput): Promise<InnovationExperimentItem> {
    return innovationLabProvider.createExperiment(input);
  },
  async getModels(): Promise<ExperimentalModelItem[]> {
    return innovationLabProvider.getModels();
  },
  async getEvaluations(): Promise<InnovationEvaluationItem[]> {
    return innovationLabProvider.getEvaluations();
  },
  async getPromotions(): Promise<InnovationPromotionItem[]> {
    return innovationLabProvider.getPromotions();
  },
  async getMultimodal(): Promise<MultimodalCapabilityData> {
    return innovationLabProvider.getMultimodal();
  },
  async getBrowser(): Promise<BrowserAutomationStatusData> {
    return innovationLabProvider.getBrowser();
  },
  async getVoice(): Promise<VoiceIntelligenceStatusData> {
    return innovationLabProvider.getVoice();
  },
  async getStatistics(): Promise<InnovationLabStatistics> {
    return innovationLabProvider.getStatistics();
  },
};

export const aiGovernanceService = {
  async getDashboard(): Promise<GovernanceDashboardData> {
    return aiGovernanceProvider.getDashboard();
  },
  async getPolicies(orgId?: string): Promise<GovernancePolicyItem[]> {
    return aiGovernanceProvider.getPolicies(orgId);
  },
  async createPolicy(input: CreatePolicyInput): Promise<GovernancePolicyItem> {
    return aiGovernanceProvider.createPolicy(input);
  },
  async getApprovals(orgId?: string): Promise<GovernanceApprovalItem[]> {
    return aiGovernanceProvider.getApprovals(orgId);
  },
  async approveWorkflow(input: ApproveWorkflowInput): Promise<GovernanceApprovalItem> {
    return aiGovernanceProvider.approveWorkflow(input);
  },
  async getRisk(): Promise<GovernanceRiskData> {
    return aiGovernanceProvider.getRisk();
  },
  async getCompliance(): Promise<GovernanceComplianceData> {
    return aiGovernanceProvider.getCompliance();
  },
  async getAudit(): Promise<GovernanceAuditItem[]> {
    return aiGovernanceProvider.getAudit();
  },
  async getTrust(): Promise<GovernanceTrustData> {
    return aiGovernanceProvider.getTrust();
  },
  async getResponsibleAi(): Promise<ResponsibleAiData> {
    return aiGovernanceProvider.getResponsibleAi();
  },
  async getExplainability(decisionId?: string): Promise<ExplainabilityData> {
    return aiGovernanceProvider.getExplainability(decisionId);
  },
  async getStatistics(): Promise<GovernanceStatistics> {
    return aiGovernanceProvider.getStatistics();
  },
};

export const appPlatformService = {
  async getDashboard(): Promise<AppPlatformDashboardData> {
    return appPlatformProvider.getDashboard();
  },
  async getApps(orgId?: string): Promise<PlatformAppItem[]> {
    return appPlatformProvider.getApps(orgId);
  },
  async createApp(input: CreateAppInput): Promise<PlatformAppItem> {
    return appPlatformProvider.createApp(input);
  },
  async getTemplates(): Promise<WorkflowTemplateItem[]> {
    return appPlatformProvider.getTemplates();
  },
  async getMarketplace(): Promise<MarketplaceListingItem[]> {
    return appPlatformProvider.getMarketplace();
  },
  async publishListing(input: PublishListingInput): Promise<MarketplaceListingItem> {
    return appPlatformProvider.publishListing(input);
  },
  async getExtensions(): Promise<PlatformExtensionItem[]> {
    return appPlatformProvider.getExtensions();
  },
  async getSDKs(): Promise<PlatformSDKItem[]> {
    return appPlatformProvider.getSDKs();
  },
  async getDevelopers(): Promise<PlatformDeveloperItem[]> {
    return appPlatformProvider.getDevelopers();
  },
  async getWorkflows(): Promise<PublishedWorkflowItem[]> {
    return appPlatformProvider.getWorkflows();
  },
  async publishWorkflow(input: PublishWorkflowInput): Promise<PublishedWorkflowItem> {
    return appPlatformProvider.publishWorkflow(input);
  },
  async getStatistics(): Promise<AppPlatformStatistics> {
    return appPlatformProvider.getStatistics();
  },
};

export const integrationHubService = {
  async getIntegrations(organizationId?: string): Promise<IntegrationItem[]> {
    return integrationHubProvider.getIntegrations(organizationId);
  },
  async connectProvider(input: ConnectProviderInput): Promise<{ integration: IntegrationItem; connection: any; provider: any }> {
    return integrationHubProvider.connectProvider(input);
  },
  async disconnectProvider(integrationId: string): Promise<IntegrationItem> {
    return integrationHubProvider.disconnectProvider(integrationId);
  },
  async getProviders(): Promise<IntegrationProviderItem[]> {
    return integrationHubProvider.getProviders();
  },
  async getStatus(organizationId?: string): Promise<IntegrationHubStatus> {
    return integrationHubProvider.getStatus(organizationId);
  },
  async syncIntegration(input: SyncIntegrationInput): Promise<SyncIntegrationResult> {
    return integrationHubProvider.syncIntegration(input);
  },
  async processWebhook(input: ProcessWebhookInput): Promise<WebhookEventItem> {
    return integrationHubProvider.processWebhook(input);
  },
  async publishCMSContent(input: PublishCMSContentInput): Promise<PublishCMSContentResult> {
    return integrationHubProvider.publishCMSContent(input);
  },
  async getHistory(): Promise<IntegrationHistoryItem[]> {
    return integrationHubProvider.getHistory();
  },
  async getMetrics(): Promise<IntegrationMetricItem[]> {
    return integrationHubProvider.getMetrics();
  },
};

export const developerPlatformService = {
  async createApp(input: CreateDeveloperAppInput): Promise<DeveloperAppItem> {
    return developerPlatformProvider.createApp(input);
  },
  async getApps(organizationId?: string): Promise<DeveloperAppItem[]> {
    return developerPlatformProvider.getApps(organizationId);
  },
  async createAPIKey(input: CreateDeveloperAPIKeyInput): Promise<CreateAPIKeyResult> {
    return developerPlatformProvider.createAPIKey(input);
  },
  async getAPIKeys(applicationId?: string): Promise<DeveloperAPIKeyItem[]> {
    return developerPlatformProvider.getAPIKeys(applicationId);
  },
  async generateOAuthToken(input: GenerateOAuthTokenInput): Promise<DeveloperOAuthTokenResult> {
    return developerPlatformProvider.generateOAuthToken(input);
  },
  async getWebhooks(applicationId?: string): Promise<DeveloperWebhookItem[]> {
    return developerPlatformProvider.getWebhooks(applicationId);
  },
  async createWebhook(input: CreateDeveloperWebhookInput): Promise<DeveloperWebhookItem> {
    return developerPlatformProvider.createWebhook(input);
  },
  async getLogs(applicationId?: string): Promise<DeveloperLogItem[]> {
    return developerPlatformProvider.getLogs(applicationId);
  },
  async getUsage(applicationId?: string): Promise<DeveloperUsageItem[]> {
    return developerPlatformProvider.getUsage(applicationId);
  },
  async getMarketplace(): Promise<DeveloperMarketplaceAppItem[]> {
    return developerPlatformProvider.getMarketplace();
  },
  async publishMarketplaceApp(input: PublishDeveloperAppInput): Promise<DeveloperMarketplaceAppItem> {
    return developerPlatformProvider.publishMarketplaceApp(input);
  },
  async getOverview(organizationId?: string): Promise<DeveloperPlatformOverview> {
    return developerPlatformProvider.getOverview(organizationId);
  },
};

export const keywordIntelligenceService = {
  async getKeywords(organizationId?: string): Promise<KeywordItem[]> {
    return keywordIntelligenceProvider.getKeywords(organizationId);
  },
  async createKeyword(input: CreateKeywordInput): Promise<KeywordItem> {
    return keywordIntelligenceProvider.createKeyword(input);
  },
  async importKeywords(input: ImportKeywordsInput) {
    return keywordIntelligenceProvider.importKeywords(input);
  },
  async getClusters(): Promise<KeywordClusterItem[]> {
    return keywordIntelligenceProvider.getClusters();
  },
  async generateClusters(organizationId: string): Promise<KeywordClusterItem[]> {
    return keywordIntelligenceProvider.generateClusters(organizationId);
  },
  async getOpportunities(organizationId?: string): Promise<KeywordOpportunityItem[]> {
    return keywordIntelligenceProvider.getOpportunities(organizationId);
  },
  async getTrends(): Promise<KeywordTrendItem[]> {
    return keywordIntelligenceProvider.getTrends();
  },
  async getSearchVolume(keyword?: string) {
    return keywordIntelligenceProvider.getSearchVolume(keyword);
  },
  async getKeywordById(id: string): Promise<KeywordItem | null> {
    return keywordIntelligenceProvider.getKeywordById(id);
  },
  async updateKeyword(id: string, data: Partial<KeywordItem>): Promise<KeywordItem> {
    return keywordIntelligenceProvider.updateKeyword(id, data);
  },
  async deleteKeyword(id: string): Promise<boolean> {
    return keywordIntelligenceProvider.deleteKeyword(id);
  },
  async getCampaigns(organizationId?: string): Promise<KeywordCampaignItem[]> {
    return keywordIntelligenceProvider.getCampaigns(organizationId);
  },
  async createCampaign(input: CreateCampaignInput): Promise<KeywordCampaignItem> {
    return keywordIntelligenceProvider.createCampaign(input);
  },
  async getCampaignById(id: string): Promise<KeywordCampaignItem | null> {
    return keywordIntelligenceProvider.getCampaignById(id);
  },
  async runCampaign(id: string): Promise<any> {
    return keywordIntelligenceProvider.runCampaign(id);
  },
  async getCampaignResults(id: string): Promise<KeywordCampaignResultItem[]> {
    return keywordIntelligenceProvider.getCampaignResults(id);
  },
  async getPromptLibrary(): Promise<PromptLibraryItem[]> {
    return keywordIntelligenceProvider.getPromptLibrary();
  },
  async generatePrompt(input: GeneratePromptInput): Promise<PromptLibraryItem> {
    return keywordIntelligenceProvider.generatePrompt(input);
  },
  async getPromptTemplates(): Promise<PromptTemplateItem[]> {
    return keywordIntelligenceProvider.getPromptTemplates();
  },
  async getOverview(organizationId?: string): Promise<KeywordIntelligenceOverview> {
    return keywordIntelligenceProvider.getOverview(organizationId);
  },
};

export const retrievalIntelligenceService = {
  // Retrieval Intelligence
  async getRetrievalOverview(): Promise<RetrievalOverviewData> {
    return retrievalIntelligenceProvider.getRetrievalOverview();
  },
  async getRetrievalHistory(): Promise<any> {
    return retrievalIntelligenceProvider.getRetrievalHistory();
  },
  async getRetrievalTimeline(): Promise<{ timeline: RetrievalTimelineItem[] }> {
    return retrievalIntelligenceProvider.getRetrievalTimeline();
  },
  async getRetrievalAnalytics(): Promise<RetrievalOverviewData> {
    return retrievalIntelligenceProvider.getRetrievalAnalytics();
  },
  async getCitationsOverview(): Promise<CitationsOverviewData> {
    return retrievalIntelligenceProvider.getCitationsOverview();
  },
  async getCitationsTimeline(): Promise<{ timeline: CitationsTimelineItem[] }> {
    return retrievalIntelligenceProvider.getCitationsTimeline();
  },
  async getCitationsInsights(): Promise<{ insights: string[] }> {
    return retrievalIntelligenceProvider.getCitationsInsights();
  },
  async getSources(limit?: number): Promise<SourceItem[]> {
    return retrievalIntelligenceProvider.getSources(limit);
  },
  async getSourceLeaderboard(): Promise<SourceLeaderboardItem[]> {
    return retrievalIntelligenceProvider.getSourceLeaderboard();
  },
  async getSourceById(id: string): Promise<SourceItem | null> {
    return retrievalIntelligenceProvider.getSourceById(id);
  },
  async getURLPerformance(url?: string): Promise<URLPerformanceItem[] | URLPerformanceItem> {
    return retrievalIntelligenceProvider.getURLPerformance(url);
  },
  async getDomainPerformance(domain?: string): Promise<DomainPerformanceItem[] | DomainPerformanceItem> {
    return retrievalIntelligenceProvider.getDomainPerformance(domain);
  },
  async getPromptPerformance(promptId?: string): Promise<PromptPerformanceItem[] | PromptPerformanceItem> {
    return retrievalIntelligenceProvider.getPromptPerformance(promptId);
  },
  async getModelComparison(): Promise<ModelComparisonItem[]> {
    return retrievalIntelligenceProvider.getModelComparison();
  },

  // Research Intelligence
  async runResearch(input: StartResearchInput): Promise<ResearchProjectItem> {
    return retrievalIntelligenceProvider.runResearch(input);
  },
  async getResearchProjects(organizationId?: string): Promise<ResearchProjectItem[]> {
    return retrievalIntelligenceProvider.getResearchProjects(organizationId);
  },
  async getResearchTopics(projectId?: string): Promise<ResearchTopicItem[]> {
    return retrievalIntelligenceProvider.getResearchTopics(projectId);
  },
  async getResearchTrends(): Promise<ResearchTrendItem[]> {
    return retrievalIntelligenceProvider.getResearchTrends();
  },
  async getResearchOpportunities(): Promise<ResearchOpportunityItem[]> {
    return retrievalIntelligenceProvider.getResearchOpportunities();
  },
  async getResearchThreats(): Promise<ResearchThreatItem[]> {
    return retrievalIntelligenceProvider.getResearchThreats();
  },
  async getResearchFindings(projectId?: string): Promise<ResearchFindingItem[]> {
    return retrievalIntelligenceProvider.getResearchFindings(projectId);
  },
  async getResearchReports(projectId?: string): Promise<ResearchReportItem[]> {
    return retrievalIntelligenceProvider.getResearchReports(projectId);
  },
  async getResearchBenchmarks(): Promise<ResearchBenchmarkItem[]> {
    return retrievalIntelligenceProvider.getResearchBenchmarks();
  },
  async getResearchHistory(): Promise<ResearchExecutionHistoryItem[]> {
    return retrievalIntelligenceProvider.getResearchHistory();
  },
};

export const globalIntelligenceService = {
  async getGlobalOverview(): Promise<GlobalIntelligenceWarehouseStats> {
    return globalIntelligenceProvider.getGlobalOverview();
  },
  async getWarehouseStats(): Promise<GlobalIntelligenceWarehouseStats> {
    return globalIntelligenceProvider.getWarehouseStats();
  },
  async getGlobalCitations(): Promise<GlobalCitationItem[]> {
    return globalIntelligenceProvider.getGlobalCitations();
  },
  async getGlobalDomains(): Promise<GlobalDomainProfile[] | GlobalDomainProfile> {
    return globalIntelligenceProvider.getGlobalDomains();
  },
  async getGlobalUrls(): Promise<GlobalUrlProfile[] | GlobalUrlProfile> {
    return globalIntelligenceProvider.getGlobalUrls();
  },
  async getGlobalModels(): Promise<GlobalModelBehaviorItem[]> {
    return globalIntelligenceProvider.getGlobalModels();
  },
  async getGlobalTrends(): Promise<GlobalTrendItem> {
    return globalIntelligenceProvider.getGlobalTrends();
  },
  async getGlobalResponses(): Promise<any> {
    return globalIntelligenceProvider.getGlobalResponses();
  },
  async getGlobalHistory(): Promise<any> {
    return globalIntelligenceProvider.getGlobalHistory();
  },
  async getGlobalSources(): Promise<any> {
    return globalIntelligenceProvider.getGlobalSources();
  },
  async searchGlobalWarehouse(query: string): Promise<any> {
    return globalIntelligenceProvider.searchGlobalWarehouse(query);
  },
  async replayGlobalResponse(id: string): Promise<any> {
    return globalIntelligenceProvider.replayGlobalResponse(id);
  },
  async getDashboard(): Promise<GlobalKnowledgeGraphOverview> {
    return globalIntelligenceProvider.getDashboard();
  },
  async getModelProfiles(): Promise<GlobalModelBehaviorItem[]> {
    return globalIntelligenceProvider.getModelProfiles();
  },
  async getTopics(): Promise<GlobalTopicItem[]> {
    return globalIntelligenceProvider.getTopics();
  },
  async getCitationEvolution(): Promise<any> {
    return globalIntelligenceProvider.getCitationEvolution();
  },
  async getSourceProfiles(): Promise<any> {
    return globalIntelligenceProvider.getSourceProfiles();
  },
  async getDomains(): Promise<any> {
    return globalIntelligenceProvider.getDomains();
  },
  async getKnowledgeGraph(): Promise<GlobalKnowledgeGraphOverview> {
    return globalIntelligenceProvider.getKnowledgeGraph();
  },
  async getTopicTrends(): Promise<GlobalTrendItem[]> {
    return globalIntelligenceProvider.getTopicTrends();
  },
  async getArchiveStats(): Promise<GlobalArchiveStats> {
    return globalIntelligenceProvider.getArchiveStats();
  },
  async getNetworkStatistics(): Promise<GlobalNetworkStatistics> {
    return globalIntelligenceProvider.getNetworkStatistics();
  },
  async getMultiRegionTelemetry(): Promise<MultiRegionLatencyItem[]> {
    return globalIntelligenceProvider.getMultiRegionTelemetry();
  },
};

export const aiOperatingSystemService = {
  async getDashboard(): Promise<AIOperatingSystemDashboardData> {
    return aiOperatingSystemProvider.getDashboard();
  },
  async getStatus(): Promise<AIOperatingSystemDashboardData> {
    return aiOperatingSystemProvider.getStatus();
  },
  async getGoals(): Promise<StrategicGoalItem[]> {
    return aiOperatingSystemProvider.getGoals();
  },
  async createGoal(input: CreateStrategicGoalInput): Promise<StrategicGoalItem> {
    return aiOperatingSystemProvider.createGoal(input);
  },
  async getPlans(): Promise<ExecutionPlanItem[]> {
    return aiOperatingSystemProvider.getPlans();
  },
  async generatePlan(input: GenerateExecutionPlanInput): Promise<ExecutionPlanItem> {
    return aiOperatingSystemProvider.generatePlan(input);
  },
  async getExecutions(): Promise<ExecutionTaskItem[]> {
    return aiOperatingSystemProvider.getExecutions();
  },
  async executeTask(input: ExecuteTaskInput): Promise<ExecutionTaskItem> {
    return aiOperatingSystemProvider.executeTask(input);
  },
  async getRecommendations(): Promise<OsRecommendationItem[]> {
    return aiOperatingSystemProvider.getRecommendations();
  },
  async getStrategies(topic?: string): Promise<OsStrategyItem> {
    return aiOperatingSystemProvider.getStrategies(topic);
  },
  async getDecisions(): Promise<OsDecisionItem[]> {
    return aiOperatingSystemProvider.getDecisions();
  },
  async getReflections(): Promise<OsReflectionItem[]> {
    return aiOperatingSystemProvider.getReflections();
  },
  async getAgents(): Promise<CoordinatedAgentItem[]> {
    return aiOperatingSystemProvider.getAgents();
  },
};
