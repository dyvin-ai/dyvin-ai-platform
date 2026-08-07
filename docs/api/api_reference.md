# Dyvin AI Enterprise API Reference (OpenAPI 3.1)

## 1. Global API Standards

- **Base URL**: `https://api.dyvin.ai/api/v1`
- **Authentication**: `Bearer <JWT_TOKEN>` or `x-api-key: dyv_live_...`
- **Response Format**: `application/json` wrapped in standardized envelope.

```json
{
  "success": true,
  "data": { ... },
  "meta": { "processingTimeMs": 12 },
  "pagination": { "page": 1, "limit": 20, "total": 150 },
  "error": null,
  "timestamp": "2026-08-03T18:46:00.000Z",
  "correlationId": "corr_9b1deb4d"
}
```
