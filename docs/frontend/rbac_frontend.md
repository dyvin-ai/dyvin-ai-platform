# Role-Based Access Control (RBAC) — Phase F3

## Overview

Dyvin AI implements a strict 7-tier hierarchical role permission engine.

## Role Weight Hierarchy

| Role | Weight | Primary Purpose |
|------|--------|-----------------|
| SUPER_ADMIN | 100 | Full system control plane |
| OWNER | 90 | Organization owner & billing manager |
| ADMIN | 80 | Full org settings & security control |
| MANAGER | 60 | Team & workspace management |
| DEVELOPER | 50 | API integrations & code |
| MEMBER | 30 | Standard platform execution |
| VIEWER | 10 | Read-only analytics & reporting |

## Permission Checking API

Frontend components inspect permissions using `usePermissionStore`:
```typescript
const { canAccess } = usePermissionStore();
if (canAccess('ADMIN')) {
  // Render privileged UI controls
}
```
