# Dyvin AI Domain Event Catalog

| Domain Category | Event Type | Description | Primary Publisher |
|---|---|---|---|
| **Organization & Core** | `OrganizationCreated` | Organization onboarded | `OrganizationService` |
| **Organization & Core** | `OrganizationUpdated` | Organization settings updated | `OrganizationService` |
| **Organization & Core** | `WorkspaceCreated` | Workspace created | `WorkspaceService` |
| **Project & Website** | `ProjectCreated` | Project initialized | `ProjectService` |
| **Project & Website** | `WebsiteAdded` | Domain registered for crawling | `ScanService` |
| **Crawler & Knowledge** | `CrawlerStarted` | Web crawler job started | `CrawlerService` |
| **Crawler & Knowledge** | `KnowledgeExtracted` | Knowledge graph entity extracted | `KnowledgeService` |
| **AI Search & Citation** | `CitationDetected` | LLM search citation detected | `CitationIntelligenceService` |
| **Visibility Analytics** | `VisibilityScoreUpdated` | AI Visibility score recalculated | `VisibilityAnalyticsService` |
| **Competitor & Keyword** | `CompetitorUpdated` | Competitor LLM presence updated | `CompetitorIntelligenceService` |
| **Strategy & Action** | `RecommendationGenerated` | ROI recommendation created | `StrategyEngineService` |
| **Strategy & Action** | `ActionExecuted` | Playbook action executed | `ActionEngineService` |
| **Workflow Studio** | `WorkflowStarted` | Visual DAG workflow triggered | `WorkflowOrchestratorService` |
| **Marketplace & Skills** | `MarketplaceInstalled` | AI Agent installed | `AgentMarketplaceService` |
| **Security & Operations** | `SecurityIncidentDetected` | Security threat detected | `ThreatSecurityService` |
