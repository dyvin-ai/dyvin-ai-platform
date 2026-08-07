# Transactional Outbox Pattern Implementation

## Dual-Write Prevention
1. Domain state mutation and `DomainEventOutbox` entry are committed in a single atomic database transaction.
2. Background outbox worker polls `domain_event_outbox` where `status = 'PENDING'`.
3. Worker dispatches event to message broker and updates outbox status to `PROCESSED`.
