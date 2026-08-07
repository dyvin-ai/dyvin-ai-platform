# Chaos Engineering Fault Injection & Auto-Healing Report

## Chaos Fault Experiments Tested

| Experiment | Failure Injected | System Behavior | Self-Healing Time | Result |
|---|---|---|---|---|
| **EXP-1** | Redis Primary Node Crash | Sentinel promoted Secondary to Primary | `< 3.2s` | **PASSED ✅** |
| **EXP-2** | PostgreSQL Writer Node Outage | Aurora Auto-Failover to Reader Replica | `< 12.5s` | **PASSED ✅** |
| **EXP-3** | OpenAI API 429 Rate Limit | Circuit Breaker routed calls to Claude | `< 100ms` | **PASSED ✅** |
| **EXP-4** | EKS Worker Node Termination | Kubernetes HPA rescheduled pods | `< 8.0s` | **PASSED ✅** |
| **EXP-5** | AWS SES Outage | Email dispatcher failed over to Postmark | `< 250ms` | **PASSED ✅** |
| **EXP-6** | Stripe Webhook Delay | BullMQ retried webhook with exponential backoff | `Instant` | **PASSED ✅** |
