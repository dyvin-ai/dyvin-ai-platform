# Intelligent Alerting & Alert Storm Suppression Guide

## Alert Routing & Escalation Channels

| Alert Severity | Trigger Condition | Notification Channels | Escalation SLA |
|---|---|---|---|
| **SEV-1 (Critical)** | System Availability `< 99.0%` or DB Primary Down | PagerDuty, Slack `#alerts-sev1`, SMS | 5 Minutes → VP Eng |
| **SEV-2 (High)** | API P99 Latency `> 300ms` or Provider Outage | PagerDuty, Opsgenie, Slack `#alerts-prod` | 15 Minutes → Lead SRE |
| **SEV-3 (Medium)** | Queue Depth `> 5,000` or Redis Memory `> 75%` | Slack `#alerts-ops`, MS Teams | 2 Hours → On-Call |
| **SEV-4 (Info)** | Weekly Backup Snapshot Completed | Email Digest, Slack `#ops-info` | N/A |
