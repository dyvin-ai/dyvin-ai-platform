# Internal Developer Workflow & Onboarding Guidelines

1. Clone repository & install dependencies (`pnpm install`).
2. Run local Prisma generation (`npx pnpm --filter @dyvin-ai/backend prisma:generate`).
3. Run local dev server (`npx pnpm --filter @dyvin-ai/backend start:dev`).
4. Execute unit test suite before opening Pull Request (`npx pnpm --filter @dyvin-ai/backend test`).
