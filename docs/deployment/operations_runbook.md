# SRE Production Operations Runbook

## 1. Daily Operations Checklist
- Check Grafana Dashboard for p99 latency (`< 150ms`).
- Verify BullMQ Queue latency & Dead Letter Queue count (`0`).
- Audit Redis memory usage (`< 65%`).
- Confirm PostgreSQL replica lag (`< 500ms`).

## 2. Emergency Operations Commands
```bash
# View live API logs
kubectl logs -f -l app=dyvin-backend-api -n dyvin-prod --tail=100

# Scale pods manually
kubectl scale deployment/dyvin-backend-api --replicas=10 -n dyvin-prod
```
