# Repository Infrastructure Audit Report

## Executive Summary

Audit of repository paths and monorepo structure across Dockerfiles, docker-compose, GitHub Actions workflows, pnpm-workspace.yaml, and package manifests.

## Outdated Path Mappings Discovered & Migrated

| Outdated Reference | Location | Actual Repository Path | Action Taken |
|---|---|---|---|
| `COPY apps/api/package.json` | `Dockerfile` (root) | `COPY backend/package.json` | Migrated `Dockerfile` to `backend/` |
| `pnpm --filter @dyvin-ai/api` | `Dockerfile` (root) | `pnpm --filter @dyvin-ai/backend` | Updated filter flags |
| `apps/api/dist/src/main.js` | `Dockerfile` (root) | `backend/dist/main.js` | Corrected entry point path |
| `-f backend/Dockerfile` | `.github/workflows/deploy.yml` | `-f Dockerfile` | Updated Docker build command |
