# Persistent Domain Event Store Implementation

- **Table**: `domain_event_store`
- **Fields**: `id`, `eventId`, `aggregate`, `aggregateId`, `eventType`, `version`, `payload`, `metadata`, `correlationId`, `causationId`, `createdAt`.
- **Purpose**: Immutable append-only ledger for all domain events across the platform.
