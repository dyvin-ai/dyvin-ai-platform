# Phase F12 Executive Intelligence API Mapping Reference

| Service / Hook | Method | Path | Controller |
|---|---|---|---|
| `executivePlatformApi.getOverview` | `GET` | `/api/v1/intelligence/global` | `GlobalIntelligenceController.getGlobalOverview` |
| `executivePlatformApi.getExplainabilityNodes` | `GET` | `/api/v1/intelligence/global/sources` | `GlobalIntelligenceController.getSources` |
| `executivePlatformApi.getCommandCenterTelemetry` | `GET` | `/api/v1/admin/health` | `AdminPlatformController.getHealth` |
| `executivePlatformApi.getStrategicDecisions` | `GET` | `/api/v1/intelligence/global/trends` | `GlobalIntelligenceController.getTrends` |
