# BullMQ Queue Monitoring & Observability Specification

## Real-time Metrics

- **Active Queues**: Monitored via `SREOperationsController` (`/api/v1/ops/performance`).
- **Worker Health**: 100% operational status registry check.
- **Latency Monitoring**: Auto-refreshing 5s interval for streaming queue stats.
