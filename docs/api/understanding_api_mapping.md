# Phase F9 AI Understanding & Trust API Mapping

| Service / Hook | Method | Path | Backend Controller |
|---|---|---|---|
| `understandingPlatformApi.getHistory` | `GET` | `/api/v1/intelligence/history` | `IntelligenceController.getHistory` |
| `understandingPlatformApi.getResponses` | `GET` | `/api/v1/intelligence/responses` | `IntelligenceController.getResponses` |
| `understandingPlatformApi.getCitations` | `GET` | `/api/v1/intelligence/citations` | `IntelligenceController.getCitations` |
| `understandingPlatformApi.getModels` | `GET` | `/api/v1/intelligence/models` | `IntelligenceController.getModels` |
| `understandingPlatformApi.getWarehouseStats` | `GET` | `/api/v1/intelligence/warehouse` | `IntelligenceController.getWarehouseStats` |
| `understandingPlatformApi.replayResponse` | `GET` | `/api/v1/intelligence/replay` | `IntelligenceController.replayResponse` |
| `useVerificationList` | `GET` | `/verifications` | `VerificationController.getVerifications` |
| `useVerificationMetrics` | `GET` | `/verifications/:id/metrics` | `VerificationController.getMetrics` |
