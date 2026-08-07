# SRE Zero-Downtime Deployment & Rollback Runbook

## 1. Zero-Downtime Deployment
Deployments execute rolling updates with `maxSurge: 1` and `maxUnavailable: 0` to guarantee uninterrupted traffic.

## 2. Emergency Automated Rollback
```bash
# Rollback Kubernetes deployment to previous revision
kubectl rollout undo deployment/dyvin-backend-api -n dyvin-prod

# Check rollout status
kubectl rollout status deployment/dyvin-backend-api -n dyvin-prod
```
