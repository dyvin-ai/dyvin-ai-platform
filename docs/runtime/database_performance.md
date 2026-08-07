# Aurora PostgreSQL Database Benchmarking Report

## Database Performance Metrics
- **Active Connections**: 1,200 pool limit (PgBouncer connection pooler).
- **Index Scan Efficiency**: `99.8%` index usage across all foreign key joins.
- **Slow Query Log**: `0 queries > 100ms` under 100,000 RPS read load.
- **Table Partitioning**: Range partitioning enabled on `AIVisibilityMetric` and `SecurityEvent` by month.
