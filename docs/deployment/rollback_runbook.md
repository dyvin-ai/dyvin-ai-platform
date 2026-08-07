# Production Emergency Rollback Runbook

```bash
# Emergency rollback to previous stable tag
kubectl rollout undo deployment/dyvin-backend-api -n dyvin-prod

# Sync ArgoCD to previous commit
argocd app sync dyvin-prod-gitops --revision v0.9.9
```
