# Event Replay & Time Travel Service Guide

## Replay Execution API
```http
POST /api/v1/events/replay
Content-Type: application/json

{
  "eventId": "evt_9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d"
}
```
Replays historical domain event by fetching from `domain_event_store` and re-publishing to the event bus with original correlation IDs.
