# Security Center — Phase F3

## Overview

Integrates real-time telemetry from NestJS Runtime Security and session control plane.

## Endpoints Consumed

- `GET /api/v1/security/dashboard` → Executive security telemetry
- `GET /api/v1/security/sessions` → Active session count & rotation statistics
- `GET /api/v1/security/devices` → Trusted device fingerprinting statistics
- `GET /api/v1/security/audit` → Security audit logs
- `POST /api/v1/security/revoke-session` → Session revocation
