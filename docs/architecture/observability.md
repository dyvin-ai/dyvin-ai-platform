# Observability Architecture

## System Subsystem Architecture

The Observability platform collects real-time telemetry from application services, BullMQ queues, database queries, and third-party AI provider APIs.

## Key Capabilities

1. **Prometheus Scraping**: `/metrics` exposes counter, gauge, and histogram text formats.
2. **SLA/SLO Budgeting**: Real-time error budget tracking to prevent unwanted deployments.
3. **Automated Incident Logging**: Records MTTR and root-cause summaries.
