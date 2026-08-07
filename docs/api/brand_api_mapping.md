# Phase F7 Brand & Competitor API Mapping Reference

| Service / Hook | HTTP Method | Route Path | Backend Controller |
|---|---|---|---|
| `brandApi.getOverview` | `GET` | `/api/v1/visibility` | `VisibilityAnalyticsController.getOverview` |
| `brandApi.getScore` | `GET` | `/api/v1/visibility/score` | `VisibilityAnalyticsController.getScore` |
| `brandApi.getHistory` | `GET` | `/api/v1/visibility/history` | `VisibilityAnalyticsController.getHistory` |
| `brandApi.getCitations` | `GET` | `/api/v1/citations` | `CitationController.getCitations` |
| `brandApi.getTopDomains` | `GET` | `/api/v1/citations/domains` | `CitationController.getTopDomains` |
| `competitorApi.getCompetitors` | `GET` | `/api/v1/competitors` | `CompetitorController.getCompetitors` |
| `competitorApi.createCompetitor` | `POST` | `/api/v1/competitors` | `CompetitorController.createCompetitor` |
| `recommendationApi.getRecommendations` | `GET` | `/api/v1/recommendations` | `RecommendationController.getRecommendations` |
