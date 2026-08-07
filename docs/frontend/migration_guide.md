# Production Database & Platform Migration Guide (v1.0.0)

## Migration Execution Sequence
```bash
# 1. Apply Prisma Database Migrations
npx pnpm --filter @dyvin-ai/backend prisma:generate

# 2. Deploy Helm Release
helm upgrade --install dyvin-backend ./infrastructure/helm --namespace dyvin-prod

# 3. Verify ArgoCD GitOps Sync
argocd app sync dyvin-prod-gitops
```
