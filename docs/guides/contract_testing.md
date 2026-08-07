# Consumer Contract & Schema Testing Guide

Automated contract tests verify:
1. Every REST response conforms strictly to `StandardApiResponse` envelope schema.
2. OpenAPI 3.1 JSON schema generated matches live NestJS controller endpoints.
3. No field type mutations occur between SDK releases.
