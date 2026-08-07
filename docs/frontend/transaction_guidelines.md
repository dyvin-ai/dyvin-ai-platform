# Transactional Outbox & Database Transaction Guidelines

- All multi-write operations utilize Prisma `$transaction` blocks.
- Domain event emissions use `EventOutboxService` within the same transaction context to prevent dual-write issues.
