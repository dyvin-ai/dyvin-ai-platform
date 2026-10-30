import type {
  ActionPlanId,
  ActionPlanItem,
  AgentDefinition,
  AgentRunResult,
  AgentTask,
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
  OverviewSummary,
  PaginatedResponse,
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
  OverviewResponse,
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
  HallucinationRecord,
  MissingKnowledgeGapItem,
  ModelConsistencyMetric,
  StatementConflictItem,
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

export interface IAppPlatformProvider {
  getDashboard(): Promise<AppPlatformDashboardData>;
  getApps(orgId?: string): Promise<PlatformAppItem[]>;
  createApp(input: CreateAppInput): Promise<PlatformAppItem>;
  getTemplates(): Promise<WorkflowTemplateItem[]>;
  getMarketplace(): Promise<MarketplaceListingItem[]>;
  publishListing(input: PublishListingInput): Promise<MarketplaceListingItem>;
  getExtensions(): Promise<PlatformExtensionItem[]>;
  getSDKs(): Promise<PlatformSDKItem[]>;
  getDevelopers(): Promise<PlatformDeveloperItem[]>;
  getWorkflows(): Promise<PublishedWorkflowItem[]>;
  publishWorkflow(input: PublishWorkflowInput): Promise<PublishedWorkflowItem>;
  getStatistics(): Promise<AppPlatformStatistics>;
}

export interface IIntegrationHubProvider {
  getIntegrations(organizationId?: string): Promise<IntegrationItem[]>;
  connectProvider(input: ConnectProviderInput): Promise<{ integration: IntegrationItem; connection: any; provider: any }>;
  disconnectProvider(integrationId: string): Promise<IntegrationItem>;
  getProviders(): Promise<IntegrationProviderItem[]>;
  getStatus(organizationId?: string): Promise<IntegrationHubStatus>;
  syncIntegration(input: SyncIntegrationInput): Promise<SyncIntegrationResult>;
  processWebhook(input: ProcessWebhookInput): Promise<WebhookEventItem>;
  publishCMSContent(input: PublishCMSContentInput): Promise<PublishCMSContentResult>;
  getHistory(): Promise<IntegrationHistoryItem[]>;
  getMetrics(): Promise<IntegrationMetricItem[]>;
}

export interface IDeveloperPlatformProvider {
  createApp(input: CreateDeveloperAppInput): Promise<DeveloperAppItem>;
  getApps(organizationId?: string): Promise<DeveloperAppItem[]>;
  createAPIKey(input: CreateDeveloperAPIKeyInput): Promise<CreateAPIKeyResult>;
  getAPIKeys(applicationId?: string): Promise<DeveloperAPIKeyItem[]>;
  generateOAuthToken(input: GenerateOAuthTokenInput): Promise<DeveloperOAuthTokenResult>;
  getWebhooks(applicationId?: string): Promise<DeveloperWebhookItem[]>;
  createWebhook(input: CreateDeveloperWebhookInput): Promise<DeveloperWebhookItem>;
  getLogs(applicationId?: string): Promise<DeveloperLogItem[]>;
  getUsage(applicationId?: string): Promise<DeveloperUsageItem[]>;
  getMarketplace(): Promise<DeveloperMarketplaceAppItem[]>;
  publishMarketplaceApp(input: PublishDeveloperAppInput): Promise<DeveloperMarketplaceAppItem>;
  getOverview(organizationId?: string): Promise<DeveloperPlatformOverview>;
}

export interface IKeywordIntelligenceProvider {
  getKeywords(organizationId?: string): Promise<KeywordItem[]>;
  createKeyword(input: CreateKeywordInput): Promise<KeywordItem>;
  importKeywords(input: ImportKeywordsInput): Promise<{ importId: string; totalRows: number; importedCount: number; invalidCount: number; keywords: KeywordItem[] }>;
  getClusters(): Promise<KeywordClusterItem[]>;
  generateClusters(organizationId: string): Promise<KeywordClusterItem[]>;
  getOpportunities(organizationId?: string): Promise<KeywordOpportunityItem[]>;
  getTrends(): Promise<KeywordTrendItem[]>;
  getSearchVolume(keyword?: string): Promise<KeywordSearchVolumeItem[] | KeywordSearchVolumeItem>;
  getKeywordById(id: string): Promise<KeywordItem | null>;
  updateKeyword(id: string, data: Partial<KeywordItem>): Promise<KeywordItem>;
  deleteKeyword(id: string): Promise<boolean>;
  getCampaigns(organizationId?: string): Promise<KeywordCampaignItem[]>;
  createCampaign(input: CreateCampaignInput): Promise<KeywordCampaignItem>;
  getCampaignById(id: string): Promise<KeywordCampaignItem | null>;
  runCampaign(id: string): Promise<any>;
  getCampaignResults(id: string): Promise<KeywordCampaignResultItem[]>;
  getPromptLibrary(): Promise<PromptLibraryItem[]>;
  generatePrompt(input: GeneratePromptInput): Promise<PromptLibraryItem>;
  getPromptTemplates(): Promise<PromptTemplateItem[]>;
  getOverview(organizationId?: string): Promise<KeywordIntelligenceOverview>;
}

export interface IRetrievalIntelligenceProvider {
  // Retrieval Intelligence
  getRetrievalOverview(): Promise<RetrievalOverviewData>;
  getRetrievalHistory(): Promise<any>;
  getRetrievalTimeline(): Promise<{ timeline: RetrievalTimelineItem[] }>;
  getRetrievalAnalytics(): Promise<RetrievalOverviewData>;
  getCitationsOverview(): Promise<CitationsOverviewData>;
  getCitationsTimeline(): Promise<{ timeline: CitationsTimelineItem[] }>;
  getCitationsInsights(): Promise<{ insights: string[] }>;
  getSources(limit?: number): Promise<SourceItem[]>;
  getSourceLeaderboard(): Promise<SourceLeaderboardItem[]>;
  getSourceById(id: string): Promise<SourceItem | null>;
  getURLPerformance(url?: string): Promise<URLPerformanceItem[] | URLPerformanceItem>;
  getDomainPerformance(domain?: string): Promise<DomainPerformanceItem[] | DomainPerformanceItem>;
  getPromptPerformance(promptId?: string): Promise<PromptPerformanceItem[] | PromptPerformanceItem>;
  getModelComparison(): Promise<ModelComparisonItem[]>;

  // Research Intelligence
  runResearch(input: StartResearchInput): Promise<ResearchProjectItem>;
  getResearchProjects(organizationId?: string): Promise<ResearchProjectItem[]>;
  getResearchTopics(projectId?: string): Promise<ResearchTopicItem[]>;
  getResearchTrends(): Promise<ResearchTrendItem[]>;
  getResearchOpportunities(): Promise<ResearchOpportunityItem[]>;
  getResearchThreats(): Promise<ResearchThreatItem[]>;
  getResearchFindings(projectId?: string): Promise<ResearchFindingItem[]>;
  getResearchReports(projectId?: string): Promise<ResearchReportItem[]>;
  getResearchBenchmarks(): Promise<ResearchBenchmarkItem[]>;
  getResearchHistory(): Promise<ResearchExecutionHistoryItem[]>;
}

export interface IGlobalIntelligenceProvider {
  // Global Warehouse Telemetry (global-intelligence.controller.ts)
  getGlobalOverview(): Promise<GlobalIntelligenceWarehouseStats>;
  getWarehouseStats(): Promise<GlobalIntelligenceWarehouseStats>;
  getGlobalCitations(): Promise<GlobalCitationItem[]>;
  getGlobalDomains(): Promise<GlobalDomainProfile[] | GlobalDomainProfile>;
  getGlobalUrls(): Promise<GlobalUrlProfile[] | GlobalUrlProfile>;
  getGlobalModels(): Promise<GlobalModelBehaviorItem[]>;
  getGlobalTrends(): Promise<GlobalTrendItem>;
  getGlobalResponses(): Promise<any>;
  getGlobalHistory(): Promise<any>;
  getGlobalSources(): Promise<any>;
  searchGlobalWarehouse(query: string): Promise<any>;
  replayGlobalResponse(id: string): Promise<any>;

  // Global Intelligence Layer (global-intelligence-layer.controller.ts)
  getDashboard(): Promise<GlobalKnowledgeGraphOverview>;
  getModelProfiles(): Promise<GlobalModelBehaviorItem[]>;
  getTopics(): Promise<GlobalTopicItem[]>;
  getCitationEvolution(): Promise<any>;
  getSourceProfiles(): Promise<any>;
  getDomains(): Promise<any>;
  getKnowledgeGraph(): Promise<GlobalKnowledgeGraphOverview>;
  getTopicTrends(): Promise<GlobalTrendItem[]>;
  getArchiveStats(): Promise<GlobalArchiveStats>;
  getNetworkStatistics(): Promise<GlobalNetworkStatistics>;
  getMultiRegionTelemetry(): Promise<MultiRegionLatencyItem[]>;
}

export interface IAIOperatingSystemProvider {
  getDashboard(): Promise<AIOperatingSystemDashboardData>;
  getStatus(): Promise<AIOperatingSystemDashboardData>;
  getGoals(): Promise<StrategicGoalItem[]>;
  createGoal(input: CreateStrategicGoalInput): Promise<StrategicGoalItem>;
  getPlans(): Promise<ExecutionPlanItem[]>;
  generatePlan(input: GenerateExecutionPlanInput): Promise<ExecutionPlanItem>;
  getExecutions(): Promise<ExecutionTaskItem[]>;
  executeTask(input: ExecuteTaskInput): Promise<ExecutionTaskItem>;
  getRecommendations(): Promise<OsRecommendationItem[]>;
  getStrategies(topic?: string): Promise<OsStrategyItem>;
  getDecisions(): Promise<OsDecisionItem[]>;
  getReflections(): Promise<OsReflectionItem[]>;
  getAgents(): Promise<CoordinatedAgentItem[]>;
}

export interface IAiGovernanceProvider {
  getDashboard(): Promise<GovernanceDashboardData>;
  getPolicies(orgId?: string): Promise<GovernancePolicyItem[]>;
  createPolicy(input: CreatePolicyInput): Promise<GovernancePolicyItem>;
  getApprovals(orgId?: string): Promise<GovernanceApprovalItem[]>;
  approveWorkflow(input: ApproveWorkflowInput): Promise<GovernanceApprovalItem>;
  getRisk(): Promise<GovernanceRiskData>;
  getCompliance(): Promise<GovernanceComplianceData>;
  getAudit(): Promise<GovernanceAuditItem[]>;
  getTrust(): Promise<GovernanceTrustData>;
  getResponsibleAi(): Promise<ResponsibleAiData>;
  getExplainability(decisionId?: string): Promise<ExplainabilityData>;
  getStatistics(): Promise<GovernanceStatistics>;
}

export interface IInnovationLabProvider {
  getDashboard(): Promise<InnovationDashboardData>;
  getExperiments(): Promise<InnovationExperimentItem[]>;
  createExperiment(input: CreateExperimentInput): Promise<InnovationExperimentItem>;
  getModels(): Promise<ExperimentalModelItem[]>;
  getEvaluations(): Promise<InnovationEvaluationItem[]>;
  getPromotions(): Promise<InnovationPromotionItem[]>;
  getMultimodal(): Promise<MultimodalCapabilityData>;
  getBrowser(): Promise<BrowserAutomationStatusData>;
  getVoice(): Promise<VoiceIntelligenceStatusData>;
  getStatistics(): Promise<InnovationLabStatistics>;
}

export interface IAiEvolutionProvider {
  getDashboard(): Promise<EvolutionDashboardData>;
  getModels(): Promise<EvolutionModelProfile[]>;
  getPrompts(): Promise<PromptEvolution[]>;
  getWorkflows(): Promise<WorkflowEvolution[]>;
  getStrategies(): Promise<StrategyEvolution[]>;
  getQuality(): Promise<AIQualityOverview>;
  getBenchmarks(): Promise<BenchmarkSnapshot[]>;
  getProviders(): Promise<AIProviderScorecard[]>;
  getHistory(): Promise<EvolutionHistoryRecord[]>;
  getStatistics(): Promise<EvolutionStatistics>;
  getOptimalRoute(taskType?: string): Promise<OptimalRouteRecommendation>;
}

export interface IEcosystemProvider {
  getDashboard(): Promise<EcosystemDashboardOverview>;
  getAgencies(): Promise<AgencyProfileItem[]>;
  registerAgency(input: RegisterAgencyInput): Promise<AgencyProfileItem>;
  getPartners(): Promise<PartnerProfileItem[]>;
  registerPartner(input: RegisterPartnerInput): Promise<PartnerProfileItem>;
  getReferrals(): Promise<EcosystemReferralItem[]>;
  createReferral(input: CreateReferralInput): Promise<EcosystemReferralItem>;
  getAcademy(): Promise<AcademyCourseItem[]>;
  getCertifications(): Promise<ProfessionalCertificateItem[]>;
  getCommunity(): Promise<CommunityForumPostItem[]>;
  getEvents(): Promise<PlatformEventItem[]>;
  getMarketplace(): Promise<PartnerListingItem[]>;
}

export interface IIndustryCloudProvider {
  getDashboard(industry?: string): Promise<IndustryOverviewData>;
  getBenchmarks(industry?: string): Promise<IndustryBenchmarkData>;
  getReports(): Promise<IndustryReportsData>;
  getTrends(): Promise<IndustryTrendData>;
  getLeaderboards(category?: string): Promise<IndustryLeaderboardResponse>;
  getPublicIndex(query?: string): Promise<IndustryPublicIndexData>;
  getAuthority(domain?: string): Promise<IndustryAuthorityData>;
  getModels(): Promise<IndustryModelsPreference>;
  getPublications(): Promise<IndustryPublicationItem[]>;
  getStatistics(): Promise<IndustryPlatformStatistics>;
}

export interface ICustomerSuccessProvider {
  getDashboard(orgId?: string): Promise<CustomerSuccessDashboardOverview>;
  getHealth(orgId?: string): Promise<CustomerHealthScoreData>;
  getJourney(orgId?: string): Promise<CustomerJourneyMilestoneItem[]>;
  getAdoption(orgId?: string): Promise<ProductAdoptionMetrics>;
  getChurn(orgId?: string): Promise<CustomerChurnPredictionData>;
  getRenewal(orgId?: string): Promise<CustomerRenewalForecast>;
  getExpansion(orgId?: string): Promise<CustomerExpansionOpportunity>;
  getRecommendations(orgId?: string): Promise<CustomerSuccessPlanResponse>;
  getReports(): Promise<CustomerSuccessReportsData>;
  getAcademy(): Promise<CustomerAcademyProgress>;
  getReferrals(): Promise<CustomerAdvocacyStatus>;
}

export interface ICustomerIntelligenceProvider {
  getDashboard(orgId?: string): Promise<CustomerIntelligenceDashboardOverview>;
  getTimeline(orgId?: string): Promise<CustomerTimelineItem[]>;
  getMemory(orgId?: string): Promise<CustomerMemoryItem[]>;
  getHistory(orgId?: string): Promise<CustomerHistoryItem>;
  getKnowledge(orgId?: string): Promise<CustomerKnowledgeGraphResponse>;
  getGoals(orgId?: string): Promise<CustomerGoalsTelemetry>;
  getReports(orgId?: string): Promise<CustomerReportsTelemetry>;
  getWarehouse(orgId?: string): Promise<CustomerWarehouseItem[]>;
  verifyPrivacy(orgId?: string): Promise<CustomerPrivacyVerification>;
}


export interface IBusinessExecutionProvider {
  getDashboard(): Promise<BusinessExecutionDashboardOverview>;
  getOpportunities(orgId?: string): Promise<BusinessOpportunityItem[]>;
  getRootCauses(): Promise<RootCauseAnalysisItem[]>;
  getStrategies(orgId?: string): Promise<ExecutionStrategyItem[]>;
  generateStrategy(input: GenerateStrategyInput): Promise<ExecutionStrategyItem>;
  getContent(): Promise<ContentExecutionItem[]>;
  generateContent(input: GenerateContentInput): Promise<ContentExecutionItem>;
  getPublishing(): Promise<PublishingExecutionItem[]>;
  publishContent(input: PublishContentInput): Promise<PublishingExecutionItem>;
  getWorkforce(): Promise<WorkforceExecutionStatus>;
  runExecution(input: RunExecutionInput): Promise<any>;
  getOptimization(): Promise<ClosedLoopOptimizationStatus>;
  getHistory(): Promise<BusinessExecutionHistory>;
  getStatistics(): Promise<BusinessExecutionStatistics>;
}


export interface IAiSearchIntelligenceProvider {
  getDashboard(): Promise<GeoDashboardOverview>;
  getVisibility(orgId?: string): Promise<GeoVisibilityTrends>;
  getCitations(): Promise<GeoCitationOverview>;
  getRetrieval(): Promise<GeoRetrievalAnalytics>;
  getModels(): Promise<GeoModelComparisonItem[]>;
  getCompetitors(): Promise<GeoCompetitorBenchmarkItem[]>;
  getDomains(): Promise<GeoDomainAnalyticsItem[]>;
  getUrls(): Promise<GeoUrlAnalyticsItem[]>;
  getSources(): Promise<GeoSourceProfile[]>;
  getKeywords(): Promise<GeoKeywordAnalytics>;
  uploadKeywords(fileName: string, keywordsCount?: number): Promise<{ fileName: string; keywordsCount?: number; status: string }>;
  getRecommendations(): Promise<GeoRecommendationItem[]>;
  executeAction(actionType: string): Promise<GeoActionExecutionResult>;
  getStatistics(): Promise<GeoPlatformStatistics>;
}

export interface IVectorIntelligenceProvider {
  getMetrics(): Promise<VectorEngineMetrics>;
  getProviders(): Promise<VectorEmbeddingProviderInfo[]>;
  getIndexes(): Promise<VectorIndexConfig[]>;
  getCollections(organizationId?: string): Promise<VectorCollectionItem[]>;
  search(query: string, organizationId?: string, topK?: number): Promise<VectorSearchResponse>;
  getSimilarity(textA: string, textB: string): Promise<VectorSimilarityResponse>;
  generateEmbedding(text: string, provider?: EmbeddingProvider): Promise<VectorEmbeddingResponse>;
}

export interface IKnowledgeGraphProvider {
  getKnowledgeGraph(projectId: string): Promise<KnowledgeGraphSummary | null>;
  getEntities(projectId: string): Promise<KnowledgeEntity[]>;
  getRelationships(projectId: string): Promise<KnowledgeRelationship[]>;
  getFacts(projectId: string): Promise<KnowledgeFact[]>;
  getProducts(projectId: string): Promise<KnowledgeProduct[]>;
  getServices(projectId: string): Promise<KnowledgeServiceItem[]>;
}

export interface IWorkforceProvider {
  getDashboard(): Promise<WorkforceOverviewTelemetry>;
  getEmployees(orgId?: string): Promise<DigitalEmployee[]>;
  hireEmployee(payload: HireDigitalEmployeePayload): Promise<DigitalEmployee>;
  getDepartments(): Promise<WorkforceDepartment[]>;
  getTasks(orgId?: string): Promise<WorkforceTask[]>;
  assignTask(payload: AssignWorkforceTaskPayload): Promise<WorkforceTask>;
  getPerformance(): Promise<WorkforcePerformanceTelemetry>;
  getTraining(): Promise<WorkforceTrainingTelemetry>;
  getSchedules(): Promise<WorkforceScheduleItem[]>;
  getStatistics(): Promise<WorkforceStatisticsTelemetry>;
}

export interface IPlatformAdminProvider {
  getTenants(): Promise<TenantAdminItem[]>;
  overrideQuota(payload: TenantQuotaOverridePayload): Promise<any>;
  getSupportTickets(tenantId?: string): Promise<SupportTicketItem[]>;
  createSupportTicket(payload: CreateSupportTicketPayload): Promise<any>;
  getAuditLogs(): Promise<AdminAuditLogItem[]>;
  startImpersonation(payload: { targetTenantId: string; reason: string }): Promise<any>;
  getFeatureFlags(): Promise<FeatureFlagItem[]>;
  createFeatureFlag(payload: CreateFeatureFlagPayload): Promise<any>;
  updateFeatureFlag(id: string, payload: UpdateFeatureFlagPayload): Promise<any>;
}

export interface IObservabilityProvider {
  getPrometheusMetricsText(): Promise<string>;
  getDependencies(): Promise<DependencyTelemetryItem[]>;
  getPerformance(): Promise<any>;
  getTraces(): Promise<DistributedTraceWaterfall[]>;
  getTelemetrySummary(): Promise<ObservabilityTelemetrySummary>;
}

export interface IAutonomousOpsProvider {
  getOverview(): Promise<AutonomousOpsOverview>;
  getHealth(): Promise<OpsComponentHealth[]>;
  getIncidents(): Promise<SreIncidentItem[]>;
  getCapacity(): Promise<CapacityForecastMetric[]>;
  getCosts(): Promise<any>;
  getPerformance(): Promise<any>;
}

export interface IExecutiveProvider {
  getOverview(): Promise<UnifiedBrandScoreSummary>;
  getExplainabilityNodes(): Promise<ExplainabilityDecisionNode[]>;
  getCommandCenterTelemetry(): Promise<GlobalCommandCenterTelemetry>;
  getStrategicDecisions(): Promise<ExecutiveStrategicDecision[]>;
}

export interface IRemediationProvider {
  getPlaybooks(): Promise<RemediationPlaybookItem[]>;
  getActions(organizationId?: string): Promise<RemediationActionItem[]>;
  createAction(input: {
    organizationId: string;
    title: string;
    description?: string;
    type: string;
    priority?: string;
    triggerType?: string;
    payloadJson?: Record<string, any>;
  }): Promise<RemediationActionItem>;
  runAction(actionId: string): Promise<RemediationActionItem>;
  getArtifacts(actionId?: string): Promise<RemediationArtifactItem[]>;
  getStats(organizationId?: string): Promise<RemediationStats>;
}

export interface IConsistencyProvider {
  getModels(): Promise<ModelConsistencyMetric[]>;
  getCompetitors(): Promise<CompetitorBenchmarkItem[]>;
  getThreats(): Promise<ResearchThreatItem[]>;
  getAccuracy(projectId?: string): Promise<BrandAccuracyData>;
  getStatistics(): Promise<ConsistencyPlatformStats>;
}

export interface IUnderstandingProvider {
  getWarehouseStats(): Promise<WarehouseStats>;
  getModels(): Promise<CrossModelStats>;
  getHistory(take?: number): Promise<AiResponseLedgerItem[]>;
  replayResponse(responseId: string): Promise<any>;
  getAccuracy(projectId?: string): Promise<BrandAccuracyData>;
  getUnderstanding(projectId?: string): Promise<BrandUnderstandingData>;
}

export interface IScanProvider {
  getScans(projectId?: string): Promise<ScanItem[]>;
  getScanDetails(scanId: string): Promise<ScanItem>;
  getScanPages(scanId: string): Promise<ScanPageItem[]>;
  getScanMetadata(scanId: string): Promise<ScanMetadataItem[]>;
  getScanStructuredData(scanId: string): Promise<StructuredDataItem[]>;
  getScanTechnologies(scanId: string): Promise<TechnologyItem[]>;
  triggerScan(projectId: string, url?: string): Promise<ScanItem>;
}

export interface IBrandIntelligenceProvider {
  getBrandIntelligence(projectId?: string): Promise<BrandIntelligenceResponse>;
  getBrandProfile(projectId?: string): Promise<BrandProfileData>;
  getBrandUnderstanding(projectId?: string): Promise<BrandUnderstandingData>;
  getBrandAccuracy(projectId?: string): Promise<BrandAccuracyData>;
  getBrandPresence(projectId?: string): Promise<BrandPresenceData>;
  getCompetitiveGaps(projectId?: string): Promise<CompetitiveGapItem[]>;
}

export interface IAnalyticsProvider {
  getSummary(): Promise<OverviewSummary>;
  getVisibilitySeries(period?: string): Promise<VisibilityPoint[]>;
  getModelPerformance(): Promise<ModelPerformance[]>;
  getScanStatus(): Promise<ScanStatus>;
  triggerScan(): Promise<ScanStatus>;
  getBaselineState(projectId?: string): Promise<VisibilityBaselineState>;
  triggerBaselineScan(projectId?: string): Promise<VisibilityBaselineState>;
  getOverview(projectId?: string): Promise<OverviewResponse>;
}

export interface IPromptsProvider {
  list(filter?: FilterParams): Promise<PromptPerformance[]>;
  get(id: string): Promise<PromptPerformance | undefined>;
  getClusters(): Promise<PromptCluster[]>;
  executePrompt(promptId: string, providerCode?: string): Promise<any>;
}

export interface ICompetitorsProvider {
  list(): Promise<CompetitorRow[]>;
  get(id: string): Promise<CompetitorRow | undefined>;
  runComparison(competitorId: string, brandScore?: number): Promise<any>;
}

export interface ISourcesProvider {
  list(filter?: FilterParams): Promise<CitationSource[]>;
  get(id: string): Promise<CitationSource | undefined>;
}

export interface IInsightsProvider {
  list(projectId?: string): Promise<Insight[]>;
  get(id: string): Promise<Insight | undefined>;
  updateStatus(id: string, status: Insight["status"]): Promise<Insight | undefined>;
}

export interface IStrategyProvider {
  getOverview(projectId?: string): Promise<StrategyOverview>;
  updateActionStatus(actionId: string, status: StrategyAction["status"]): Promise<any>;
}

export interface IDecisionsProvider {
  list(): Promise<DecisionItem[]>;
  get(id: string): Promise<DecisionItem | undefined>;
  getOutcomes(): Promise<RecommendationOutcome[]>;
}

export interface IActionPlansProvider {
  list(): Promise<ActionPlanItem[]>;
  get(id: ActionPlanId): Promise<ActionPlanItem | undefined>;
  create(plan: Omit<ActionPlanItem, "id" | "createdAt" | "updatedAt">): Promise<ActionPlanItem>;
  updateStatus(id: ActionPlanId, status: ActionPlanItem["status"]): Promise<ActionPlanItem | undefined>;
  delete(id: ActionPlanId): Promise<boolean>;
}

export interface IAgentsProvider {
  list(projectId?: string): Promise<AgentDefinition[]>;
  get(id: string, projectId?: string): Promise<AgentDefinition | undefined>;
  triggerRun(agentId: string, projectId?: string): Promise<AgentRunResult>;
  updateStatus(agentId: string, update: { enabled?: boolean; status?: "ACTIVE" | "PAUSED" }, projectId?: string): Promise<AgentDefinition>;
  getRuns(agentId: string, projectId?: string): Promise<AgentRunResult[]>;
}

export interface IReportsProvider {
  list(projectId?: string): Promise<ReportItem[]>;
  get(id: string): Promise<ReportItem | undefined>;
  generate(payload: GenerateReportPayload): Promise<ReportItem>;
  export(reportId: string, format: ExportFormat): Promise<ExportJobItem>;
  getExports(reportId: string): Promise<ExportJobItem[]>;
  delete(reportId: string): Promise<boolean>;
  getDownloadUrl(reportId: string, exportId: string): string;
  downloadExport(reportId: string, exportId: string, format?: ExportFormat, fallbackName?: string): Promise<{ filename: string; blob: Blob }>;
  exportAndDownload(reportId: string, format: ExportFormat, fallbackName?: string): Promise<ExportJobItem>;
}

export interface INotificationsProvider {
  list(): Promise<NotificationItem[]>;
  markAsRead(id?: string): Promise<boolean>;
  delete(id: string): Promise<boolean>;
  clearAll(): Promise<boolean>;
}

export interface IWorkspaceProvider {
  getWorkspace(): Promise<Workspace>;
  updateWorkspace(data: Partial<Workspace>): Promise<Workspace>;
  getTeamMembers(): Promise<User[]>;
}

export interface IAuthProvider {
  getCurrentUser(): Promise<User | null>;
  login(email: string): Promise<User>;
  logout(): Promise<void>;
  getSessionToken(): string | null;
}

export interface IBillingProvider {
  getPlans(): Promise<SubscriptionPlan[]>;
  getSubscription(organizationId?: string): Promise<SubscriptionState>;
  getUsage(organizationId?: string): Promise<UsageMetric[]>;
  getInvoices(organizationId?: string): Promise<InvoiceItem[]>;
}

