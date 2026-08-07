# Phase F14 Platform Admin API Mapping Reference

| Service / Hook | Method | Path | Controller |
|---|---|---|---|
| `platformAdminApi.getPlans` | `GET` | `/billing/plans` | `BillingController.getPlans` |
| `platformAdminApi.getSubscription` | `GET` | `/billing/subscription` | `BillingController.getSubscription` |
| `platformAdminApi.getUsage` | `GET` | `/billing/usage` | `BillingController.getUsage` |
| `platformAdminApi.getInvoices` | `GET` | `/billing/invoices` | `BillingController.getInvoices` |
| `platformAdminApi.getTenants` | `GET` | `/api/v1/admin/tenants` | `AdminPlatformController.getTenants` |
| `platformAdminApi.getSupportTickets` | `GET` | `/api/v1/admin/support` | `AdminPlatformController.getSupportTickets` |
| `platformAdminApi.getAuditLogs` | `GET` | `/api/v1/admin/audit` | `AdminPlatformController.getAuditLogs` |
| `platformAdminApi.getAdminHealth` | `GET` | `/api/v1/admin/health` | `AdminPlatformController.getHealth` |
| `platformAdminApi.getAdminUsage` | `GET` | `/api/v1/admin/usage` | `AdminPlatformController.getUsage` |
| `platformAdminApi.getLicenses` | `GET` | `/api/v1/admin/licenses` | `AdminPlatformController.getLicenses` |
| `platformAdminApi.getFeatureFlags` | `GET` | `/feature-flags` | `FeatureFlagController.getFlags` |
