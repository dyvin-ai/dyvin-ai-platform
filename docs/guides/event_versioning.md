# Domain Event Schema Versioning Guide

## Versioning Rules
- **Non-Breaking Schema Changes (Additive)**: Adding optional fields retains `version: 1`.
- **Breaking Schema Changes**: Increment version to `version: 2`.
- **Upcaster Chain**: Automatic upcaster functions transform legacy `v1` events into `v2` payload structures before dispatching to subscribers.
