# Domain Event Schema & Envelope Contracts

## Standard Event Envelope Specification

```json
{
  "metadata": {
    "eventId": "evt_9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
    "eventType": "CitationDetected",
    "aggregate": "Citation",
    "aggregateId": "cite_10023",
    "version": 1,
    "correlationId": "corr_8f9a2b1c",
    "causationId": "caus_3e4f5a6b",
    "timestamp": "2026-08-03T18:40:00.000Z",
    "tenantId": "org_enterprise_01"
  },
  "payload": {
    "queryText": "best ai search engine",
    "searchEngine": "PERPLEXITY",
    "citationRank": 1,
    "url": "https://dyvin.ai/features"
  }
}
```
