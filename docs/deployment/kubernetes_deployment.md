# Kubernetes Deployment & Pod Security Guide

## 1. Kubernetes Manifest Architecture

The Kubernetes deployment for Dyvin AI is located in `infrastructure/k8s/deployment.yaml` and contains:
- **Namespace**: `dyvin-prod` with NetworkPolicies denying unauthorized ingress.
- **Deployments**: `dyvin-backend-api` (3 to 20 replicas, CPU/Memory HPA).
- **SecurityContext**: Non-root execution (`uid: 1001`, `gid: 1001`), read-only root filesystem.
- **Probes**:
  - `readinessProbe`: `httpGet` `/api/v1/health` (10s delay, 5s period).
  - `livenessProbe`: `httpGet` `/api/v1/health` (15s delay, 10s period).

---

## 2. Horizontal Pod Autoscaling (HPA) Policy

```yaml
spec:
  minReplicas: 3
  maxReplicas: 20
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          averageUtilization: 70
```
