# Public API Governance & Security Overview

- **Authentication**: JWT Bearer Tokens (`Authorization: Bearer <TOKEN>`) or Developer API Keys (`x-api-key: dyv_live_...`).
- **Throttling**: 100 requests per minute per IP / API key (burst limit 150 req).
- **Tenant Context**: Scope automatically resolved from API key organization mapping.
