# Performance Refactoring & N+1 Query Elimination Guide

- **N+1 Query Elimination**: Replaced loop queries with Prisma `findMany` + `in` batching.
- **Cache Invalidation**: Redis TTL policies and tag-based invalidation.
- **Connection Pools**: PgBouncer pool sizing (max 200 connections).
