# Dyvin AI Global Error Code Catalog

| Error Code | HTTP Status | Description |
|---|---|---|
| `BAD_REQUEST` | 400 | Invalid payload or missing required parameters |
| `UNAUTHORIZED` | 401 | Missing or expired JWT token |
| `FORBIDDEN` | 403 | Insufficient RBAC/ABAC permissions for tenant resource |
| `NOT_FOUND` | 404 | Requested entity does not exist |
| `CONFLICT` | 409 | Resource uniqueness constraint violation |
| `UNPROCESSABLE_ENTITY` | 422 | DTO validation schema failure |
| `TOO_MANY_REQUESTS` | 429 | Rate limit exceeded |
| `INTERNAL_SERVER_ERROR` | 500 | Unhandled internal exception |
| `SERVICE_UNAVAILABLE` | 503 | Third-party integration circuit breaker open |
