# Repository Pattern & Data Access Guidelines

- All Prisma database queries route through `BaseRepository` abstractions.
- Direct database calls inside controllers are strictly prohibited.
- Generic pagination, soft deletes, and optimistic locking are handled centrally in `BaseRepository`.
