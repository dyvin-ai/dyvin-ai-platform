# API Response Envelope Schema Catalog

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "properties": {
    "success": { "type": "boolean" },
    "data": { "type": ["object", "array", "null"] },
    "meta": { "type": ["object", "null"] },
    "pagination": { "type": ["object", "null"] },
    "error": { "type": ["object", "null"] },
    "timestamp": { "type": "string", "format": "date-time" },
    "correlationId": { "type": "string" }
  },
  "required": ["success", "data", "error", "timestamp", "correlationId"]
}
```
