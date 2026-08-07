# Monorepo & Backend Folder Structure Blueprint

```
dyvin-ai/
├── backend/
│   ├── src/
│   │   ├── common/             # Interceptors, Filters, Base Repositories
│   │   ├── core/               # Domain Event Bus, Outbox Engine
│   │   ├── database/           # Prisma Service & Migrations
│   │   ├── modules/            # 30+ Domain Business Modules
│   │   └── app.module.ts
│   ├── prisma/                 # schema.prisma (56 Models)
│   └── package.json
├── infrastructure/             # K8s, Helm, Terraform, ArgoCD
└── docs/                       # Architectural Specifications
```
