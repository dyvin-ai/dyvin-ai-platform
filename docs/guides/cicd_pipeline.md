# GitHub Actions & ArgoCD GitOps CI/CD Pipeline

## 1. CI/CD Architecture Pipeline

1. **Lint & Test**: Run ESLint, Jest unit & integration test suites.
2. **Prisma & Build**: Generate Prisma client and compile NestJS production dist.
3. **Docker Build & Push**: Multi-stage build pushed to Amazon ECR (`123456789012.dkr.ecr.us-east-1.amazonaws.com/dyvin-backend`).
4. **ArgoCD Sync**: ArgoCD automatically synchronizes Kubernetes manifests in `infrastructure/k8s/` to EKS cluster with zero downtime rolling update.
