# Phase F13 Autonomous Ops API Mapping Reference

| Service / Hook | Method | Path | Controller |
|---|---|---|---|
| `autonomousOpsApi.getHealth` | `GET` | `/api/v1/ops/health` | `SREOperationsController.getHealth` |
| `autonomousOpsApi.getIncidents` | `GET` | `/api/v1/ops/incidents` | `SREOperationsController.getIncidents` |
| `autonomousOpsApi.getCapacity` | `GET` | `/api/v1/ops/capacity` | `SREOperationsController.getCapacity` |
| `autonomousOpsApi.getCosts` | `GET` | `/api/v1/ops/costs` | `SREOperationsController.getCosts` |
| `autonomousOpsApi.getPerformance` | `GET` | `/api/v1/ops/performance` | `SREOperationsController.getPerformance` |
