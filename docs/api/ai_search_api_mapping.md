# AI Search & Governance API Mapping Reference

| Service / Hook | HTTP Method | Endpoint | Backend Controller |
|---|---|---|---|
| `aiSearchApi.getDashboard` | `GET` | `/api/v1/ai-search/dashboard` | `AiSearchIntelligenceController.getDashboard` |
| `aiSearchApi.getPrompts` | `GET` | `/api/v1/ai-search/prompts` | `AiSearchIntelligenceController.getPrompts` |
| `aiSearchApi.trackPrompt` | `POST` | `/api/v1/ai-search/prompts` | `AiSearchIntelligenceController.trackPrompt` |
| `aiSearchApi.getModels` | `GET` | `/api/v1/ai-search/models` | `AiSearchIntelligenceController.getModels` |
| `aiSearchApi.getRecommendations` | `GET` | `/api/v1/ai-search/recommendations` | `AiSearchIntelligenceController.getRecommendations` |
| `governanceApi.getDashboard` | `GET` | `/api/v1/governance/dashboard` | `AiGovernanceController.getDashboard` |
| `governanceApi.getPolicies` | `GET` | `/api/v1/governance/policies` | `AiGovernanceController.getPolicies` |
| `governanceApi.createPolicy` | `POST` | `/api/v1/governance/policies` | `AiGovernanceController.createPolicy` |
| `knowledgeApi.getEntities` | `GET` | `/projects/:id/entities` | `KnowledgeController.getEntities` |
