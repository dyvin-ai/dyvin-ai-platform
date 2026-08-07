export interface DomainEventMetadata {
  eventId: string;
  eventType: string;
  aggregate: string;
  aggregateId: string;
  version: number;
  correlationId: string;
  causationId?: string;
  timestamp: Date;
  tenantId?: string;
}

export interface DomainEvent<T = any> {
  metadata: DomainEventMetadata;
  payload: T;
}

export type KnownEventType =
  | 'OrganizationCreated'
  | 'OrganizationUpdated'
  | 'OrganizationDeleted'
  | 'WorkspaceCreated'
  | 'ProjectCreated'
  | 'ProjectDeleted'
  | 'WebsiteAdded'
  | 'WebsiteRemoved'
  | 'CrawlerStarted'
  | 'CrawlerFinished'
  | 'KnowledgeExtracted'
  | 'PromptExecuted'
  | 'PromptFailed'
  | 'CitationDetected'
  | 'CitationLost'
  | 'RetrievalCompleted'
  | 'VisibilityScoreUpdated'
  | 'CompetitorUpdated'
  | 'KeywordImported'
  | 'KeywordClustered'
  | 'CampaignStarted'
  | 'CampaignCompleted'
  | 'ResearchCompleted'
  | 'RecommendationGenerated'
  | 'ActionCreated'
  | 'ActionApproved'
  | 'ActionExecuted'
  | 'WorkflowStarted'
  | 'WorkflowCompleted'
  | 'NotificationSent'
  | 'ReportGenerated'
  | 'BillingSucceeded'
  | 'BillingFailed'
  | 'QuotaExceeded'
  | 'FeatureFlagChanged'
  | 'APIKeyCreated'
  | 'MarketplaceInstalled'
  | 'MarketplacePublished'
  | 'DeveloperAppCreated'
  | 'IntegrationConnected'
  | 'IntegrationDisconnected'
  | 'SecurityIncidentDetected'
  | 'BackupCompleted'
  | 'RestoreCompleted';
