# Automated SRE Runbook Catalog

## 1. Runbook: High API P99 Latency (`RUNBOOK-01`)
- **Possible Cause**: Database connection pool exhaustion or unindexed query lock contention.
- **Diagnostics**: Run `GET /api/v1/ops/performance` and check PostgreSQL locks.
- **Mitigation**: Scale API pods via `kubectl scale deployment/dyvin-backend-api --replicas=10 -n dyvin-prod`.

## 2. Runbook: AI Provider Rate Limit Failover (`RUNBOOK-02`)
- **Possible Cause**: Upstream OpenAI 429 quota exhaustion.
- **Diagnostics**: Inspect `GET /api/v1/ops/dependencies`.
- **Mitigation**: Circuit breaker automatically routes traffic to Anthropic Claude router.
