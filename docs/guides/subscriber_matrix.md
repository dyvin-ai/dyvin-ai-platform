# Dyvin AI Event Subscriber Routing Matrix

| Event Type | Subscribed Module | Handler Action |
|---|---|---|
| `CitationDetected` | `VisibilityAnalyticsModule` | Recalculate AI Visibility Score |
| `CompetitorUpdated` | `ResearchIntelligenceModule` | Trigger competitive research scan |
| `VisibilityScoreUpdated` | `WorkflowStudioModule` | Trigger automated recovery DAG workflow |
| `ActionExecuted` | `NotificationModule` | Dispatch Slack & Email alert digest |
| `ResearchCompleted` | `ReportModule` | Generate executive PDF report |
| `SecurityIncidentDetected` | `AdminPlatformModule` | Log security audit & alert SRE on-call |
