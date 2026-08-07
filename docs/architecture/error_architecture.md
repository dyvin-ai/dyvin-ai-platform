# Enterprise Unified Error Architecture Specification

Global exception handling via `ApiExceptionFilter` maps all exceptions into a standardized JSON response:
```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "BAD_REQUEST",
    "message": "Validation failed",
    "details": [...],
    "correlationId": "corr_9b1deb4d",
    "timestamp": "2026-08-04T07:15:00.000Z",
    "documentationLink": "https://docs.dyvin.ai/errors#bad_request"
  }
}
```
