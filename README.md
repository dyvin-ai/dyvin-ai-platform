# Dyvin AI — Enterprise AI Strategy Intelligence & Decision Platform

[![Backend CI](https://github.com/singam-naresh/dyvin-ai/actions/workflows/backend.yml/badge.svg)](https://github.com/singam-naresh/dyvin-ai/actions/workflows/backend.yml)
[![Frontend CI](https://github.com/singam-naresh/dyvin-ai/actions/workflows/frontend.yml/badge.svg)](https://github.com/singam-naresh/dyvin-ai/actions/workflows/frontend.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

Dyvin AI is an enterprise-grade SaaS platform offering continuous search visibility intelligence, competitive gap analysis, and AI-driven strategy recommendations. It tracks domain mentions and authority levels across search systems to guide business optimization cycles.

---

## 🏗️ System Architecture

```mermaid
graph TD
    User([Enterprise User]) -->|React SPA| FE[Frontend - React 18 / Vite]
    FE -->|REST API + Headers| BE[Backend - NestJS API]
    BE -->|Prisma Client| DB[(PostgreSQL)]
    BE -->|Job Queues| Queue[BullMQ / Redis]
    BE -->|External APIs| AI[AI Providers: OpenAI, Claude, Gemini]
```

---

## 🗄️ Monorepo Structure

The repository is structured as a pnpm monorepo workspace for clean separation of concerns and rapid package dependency resolution.

```
dyvin-ai/
├── backend/          # NestJS API, Prisma ORM, BullMQ Queues, Redis
├── frontend/         # React 18, TypeScript, Vite, Tailwind CSS, Zustand, React Query
├── shared/           # Reusable TypeScript typings, schemas, and utilities
├── docs/             # Organized Architecture & Walkthrough Documentation
├── docker/           # Development & Production Docker configurations
└── .github/          # CI/CD Workflows, issue/PR templates
```

---

## 🛠️ Tech Stack

### Backend
- **Framework**: NestJS (TypeScript)
- **Database**: PostgreSQL with Prisma ORM
- **Caches & Queues**: Redis & BullMQ
- **Validation**: `class-validator` & `zod`

### Frontend
- **Framework**: React 18 with TypeScript & Vite
- **Styling**: Tailwind CSS & Framer Motion
- **State Management**: Zustand & React Query (TanStack Query)
- **Routing & Guards**: React Router with hierarchical RBAC guards

---

## 🚀 Setup & Local Development

### Prerequisites
- Node.js (v20+)
- pnpm (v9+)
- Docker & Docker Compose (optional)

### 1. Environment Configuration
Copy environment files for both apps:
```bash
# Root
cp .env.example .env

# Backend
cp backend/.env.example backend/.env
```

### 2. Dependency Installation
Install dependencies across the monorepo:
```bash
pnpm install
```

### 3. Database Migration
Spawn database via Docker Compose and run Prisma migrations:
```bash
# Start Docker services (Postgres, Redis)
docker compose up -d

# Run migrations & generate Prisma client
pnpm --filter @dyvin-ai/backend prisma migrate dev
pnpm --filter @dyvin-ai/backend prisma generate
```

### 4. Running the Platform
Run all services in development mode:
```bash
# Run both frontend & backend concurrently
pnpm dev
```

---

## 🧪 Testing

Run test suites across the monorepo:
```bash
# Run all tests
pnpm test
```

---

## 🛡️ Security

We implement continuous runtime security scanning, credential leak detection, and role-based access checks. See our [SECURITY.md](SECURITY.md) and [docs/security/](docs/security/) guides for details.

---

## 🌲 Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) before opening pull requests.

---

## 📄 License

Distributed under the MIT License. See [LICENSE](LICENSE) for more information.
