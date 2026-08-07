# API Pagination Specification Guide

## 1. Offset Pagination
`GET /api/v1/citations?page=2&limit=20`

## 2. Cursor Pagination
`GET /api/v1/events/history?cursor=evt_9b1deb4d&limit=50`
Returns `nextCursor` and `previousCursor` in response `pagination` metadata.
