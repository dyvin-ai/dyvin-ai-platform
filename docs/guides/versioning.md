# API Versioning & Deprecation Policy Guide

## Versioning Strategy
- **URL Versioning**: All active production endpoints use `/api/v1/` prefix.
- **Deprecation Header**: Deprecated endpoints return `Sunset: Wed, 01 Sep 2027 00:00:00 GMT` header.
- **Backwards Compatibility Guarantee**: No existing `/api/v1/*` endpoint parameters will be removed or altered in breaking ways.
