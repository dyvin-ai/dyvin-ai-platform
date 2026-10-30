import {
  ApiActionPlansProvider,
  ApiAgentsProvider,
  ApiAnalyticsProvider,
  ApiAuthProvider,
  ApiBillingProvider,
  ApiBrandIntelligenceProvider,
  ApiCompetitorsProvider,
  ApiDecisionsProvider,
  ApiInsightsProvider,
  ApiNotificationsProvider,
  ApiPromptsProvider,
  ApiReportsProvider,
  ApiScanProvider,
  ApiSourcesProvider,
  ApiStrategyProvider,
  ApiUnderstandingProvider,
  ApiConsistencyProvider,
  ApiRemediationProvider,
  ApiExecutiveProvider,
  ApiAutonomousOpsProvider,
  ApiPlatformAdminProvider,
  ApiObservabilityProvider,
  ApiWorkforceProvider,
  ApiKnowledgeGraphProvider,
  ApiVectorIntelligenceProvider,
  ApiAiSearchIntelligenceProvider,
  ApiBusinessExecutionProvider,
  ApiCustomerIntelligenceProvider,
  ApiCustomerSuccessProvider,
  ApiIndustryCloudProvider,
  ApiEcosystemProvider,
  ApiAiEvolutionProvider,
  ApiInnovationLabProvider,
  ApiAiGovernanceProvider,
  ApiAppPlatformProvider,
  ApiIntegrationHubProvider,
  ApiDeveloperPlatformProvider,
  ApiKeywordIntelligenceProvider,
  ApiRetrievalIntelligenceProvider,
  ApiGlobalIntelligenceProvider,
  ApiAIOperatingSystemProvider,
  ApiWorkspaceProvider,
} from "./apiProvider";
import {
  MockActionPlansProvider,
  MockAgentsProvider,
  MockAnalyticsProvider,
  MockAuthProvider,
  MockBillingProvider,
  MockBrandIntelligenceProvider,
  MockCompetitorsProvider,
  MockDecisionsProvider,
  MockInsightsProvider,
  MockNotificationsProvider,
  MockPromptsProvider,
  MockReportsProvider,
  MockScanProvider,
  MockSourcesProvider,
  MockStrategyProvider,
  MockUnderstandingProvider,
  MockConsistencyProvider,
  MockRemediationProvider,
  MockExecutiveProvider,
  MockAutonomousOpsProvider,
  MockPlatformAdminProvider,
  MockObservabilityProvider,
  MockWorkforceProvider,
  MockKnowledgeGraphProvider,
  MockVectorIntelligenceProvider,
  MockAiSearchIntelligenceProvider,
  MockBusinessExecutionProvider,
  MockCustomerIntelligenceProvider,
  MockCustomerSuccessProvider,
  MockIndustryCloudProvider,
  MockEcosystemProvider,
  MockAiEvolutionProvider,
  MockInnovationLabProvider,
  MockAiGovernanceProvider,
  MockAppPlatformProvider,
  MockIntegrationHubProvider,
  MockDeveloperPlatformProvider,
  MockKeywordIntelligenceProvider,
  MockRetrievalIntelligenceProvider,
  MockGlobalIntelligenceProvider,
  MockAIOperatingSystemProvider,
  MockWorkspaceProvider,
} from "./mockProvider";

const dataMode = (import.meta.env["VITE_DATA_MODE"] as string) || "mock";
const isApi = dataMode === "api";

export const analyticsProvider = isApi ? new ApiAnalyticsProvider() : new MockAnalyticsProvider();
export const brandIntelligenceProvider = isApi ? new ApiBrandIntelligenceProvider() : new MockBrandIntelligenceProvider();
export const promptsProvider = isApi ? new ApiPromptsProvider() : new MockPromptsProvider();
export const competitorsProvider = isApi ? new ApiCompetitorsProvider() : new MockCompetitorsProvider();
export const sourcesProvider = isApi ? new ApiSourcesProvider() : new MockSourcesProvider();
export const insightsProvider = isApi ? new ApiInsightsProvider() : new MockInsightsProvider();
export const strategyProvider = isApi ? new ApiStrategyProvider() : new MockStrategyProvider();
export const decisionsProvider = isApi ? new ApiDecisionsProvider() : new MockDecisionsProvider();
export const actionPlansProvider = isApi ? new ApiActionPlansProvider() : new MockActionPlansProvider();
export const agentsProvider = isApi ? new ApiAgentsProvider() : new MockAgentsProvider();
export const reportsProvider = isApi ? new ApiReportsProvider() : new MockReportsProvider();
export const scanProvider = isApi ? new ApiScanProvider() : new MockScanProvider();
export const notificationsProvider = isApi ? new ApiNotificationsProvider() : new MockNotificationsProvider();
export const workspaceProvider = isApi ? new ApiWorkspaceProvider() : new MockWorkspaceProvider();
export const authProvider = isApi ? new ApiAuthProvider() : new MockAuthProvider();
export const billingProvider = isApi ? new ApiBillingProvider() : new MockBillingProvider();
export const understandingProvider = isApi ? new ApiUnderstandingProvider() : new MockUnderstandingProvider();
export const consistencyProvider = isApi ? new ApiConsistencyProvider() : new MockConsistencyProvider();
export const remediationProvider = isApi ? new ApiRemediationProvider() : new MockRemediationProvider();
export const executiveProvider = isApi ? new ApiExecutiveProvider() : new MockExecutiveProvider();
export const autonomousOpsProvider = isApi ? new ApiAutonomousOpsProvider() : new MockAutonomousOpsProvider();
export const platformAdminProvider = isApi ? new ApiPlatformAdminProvider() : new MockPlatformAdminProvider();
export const observabilityProvider = isApi ? new ApiObservabilityProvider() : new MockObservabilityProvider();
export const workforceProvider = isApi ? new ApiWorkforceProvider() : new MockWorkforceProvider();
export const knowledgeGraphProvider = isApi ? new ApiKnowledgeGraphProvider() : new MockKnowledgeGraphProvider();
export const vectorIntelligenceProvider = isApi ? new ApiVectorIntelligenceProvider() : new MockVectorIntelligenceProvider();
export const aiSearchIntelligenceProvider = isApi ? new ApiAiSearchIntelligenceProvider() : new MockAiSearchIntelligenceProvider();
export const businessExecutionProvider = isApi ? new ApiBusinessExecutionProvider() : new MockBusinessExecutionProvider();
export const customerIntelligenceProvider = isApi ? new ApiCustomerIntelligenceProvider() : new MockCustomerIntelligenceProvider();
export const customerSuccessProvider = isApi ? new ApiCustomerSuccessProvider() : new MockCustomerSuccessProvider();
export const industryCloudProvider = isApi ? new ApiIndustryCloudProvider() : new MockIndustryCloudProvider();
export const ecosystemProvider = isApi ? new ApiEcosystemProvider() : new MockEcosystemProvider();
export const aiEvolutionProvider = isApi ? new ApiAiEvolutionProvider() : new MockAiEvolutionProvider();
export const innovationLabProvider = isApi ? new ApiInnovationLabProvider() : new MockInnovationLabProvider();
export const aiGovernanceProvider = isApi ? new ApiAiGovernanceProvider() : new MockAiGovernanceProvider();
export const appPlatformProvider = isApi ? new ApiAppPlatformProvider() : new MockAppPlatformProvider();
export const integrationHubProvider = isApi ? new ApiIntegrationHubProvider() : new MockIntegrationHubProvider();
export const developerPlatformProvider = isApi ? new ApiDeveloperPlatformProvider() : new MockDeveloperPlatformProvider();
export const keywordIntelligenceProvider = isApi ? new ApiKeywordIntelligenceProvider() : new MockKeywordIntelligenceProvider();
export const retrievalIntelligenceProvider = isApi ? new ApiRetrievalIntelligenceProvider() : new MockRetrievalIntelligenceProvider();
export const globalIntelligenceProvider = isApi ? new ApiGlobalIntelligenceProvider() : new MockGlobalIntelligenceProvider();
export const aiOperatingSystemProvider = isApi ? new ApiAIOperatingSystemProvider() : new MockAIOperatingSystemProvider();












