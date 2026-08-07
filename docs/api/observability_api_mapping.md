# Phase F15 Observability API Mapping Reference

| Service / Hook | Method | Path | Controller |
|---|---|---|---|
| `observabilityPlatformApi.getHealth` | `GET` | `/api/v1/ops/health` | `SREOperationsController.getHealth` |
| `observabilityPlatformApi.getStatus` | `GET` | `/api/v1/ops/status` | `SREOperationsController.getStatus` |
| `observabilityPlatformApi.getSlo` | `GET` | `/api/v1/ops/slo` | `SREOperationsController.getSLO` |
| `observabilityPlatformApi.getSla` | `GET` | `/api/v1/ops/sla` | `SREOperationsController.getSLA` |
| `observabilityPlatformApi.getAlerts` | `GET` | `/api/v1/ops/alerts` | `SREOperationsController.getAlerts` |
| `observabilityPlatformApi.getIncidents` | `GET` | `/api/v1/ops/incidents` | `SREOperationsController.getIncidents` |
| `observabilityPlatformApi.getCapacity` | `GET` | `/api/v1/ops/capacity` | `SREOperationsController.getCapacity` |
| `observabilityPlatformApi.getCosts` | `GET` | `/api/v1/ops/costs` | `SREOperationsController.getCosts` |
| `observabilityPlatformApi.getPerformance` | `GET` | `/api/v1/ops/performance` | `SREOperationsController.getPerformance` |
| `observabilityPlatformApi.getDependencies` | `GET` | `/api/v1/ops/dependencies` | `SREOperationsController.getDependencies` |
| `observabilityPlatformApi.getPrometheusMetricsText` | `GET` | `/metrics` | `MetricsController.getMetrics` |
