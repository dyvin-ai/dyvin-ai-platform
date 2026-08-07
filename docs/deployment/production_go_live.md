# Production Go-Live Execution Plan

- **T-24h**: Execute final backup snapshot of production PostgreSQL & Redis.
- **T-2h**: Set Cloudflare WAF maintenance banner for non-API endpoints.
- **T-0h**: Trigger ArgoCD GitOps sync for release tag `v1.0.0-rc1`.
- **T+30m**: Verify SRE Grafana dashboard metrics & health endpoints (`/api/v1/health`).
