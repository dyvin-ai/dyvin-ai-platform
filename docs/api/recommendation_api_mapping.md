# Phase F8 Recommendation Intelligence API Mapping

| Service / Hook | Method | Path | Controller |
|---|---|---|---|
| `recommendationPlatformApi.getRecommendations` | `GET` | `/api/v1/recommendations` | `RecommendationController.getRecommendations` |
| `recommendationPlatformApi.getEvidence` | `GET` | `/api/v1/strategy/evidence` | `StrategyIntelligenceController.getEvidence` |
| `recommendationPlatformApi.getRootCauses` | `GET` | `/api/v1/strategy/root-causes` | `StrategyIntelligenceController.getRootCauses` |
| `recommendationPlatformApi.getImpactROI` | `GET` | `/api/v1/strategy/impact` | `StrategyIntelligenceController.getImpact` |
| `recommendationPlatformApi.getExecutionPlan` | `GET` | `/api/v1/strategy/execution-plan` | `StrategyIntelligenceController.getExecutionPlan` |
| `recommendationPlatformApi.getForecast` | `GET` | `/api/v1/strategy/forecast` | `StrategyIntelligenceController.getForecast` |
