# Billing & Subscription Architecture

## Overview

The billing subsystem supports Free, Starter, Growth, Professional, and Enterprise plan tiers via Stripe, Razorpay, and Mock payment providers.

## Endpoints

| Endpoint | Method | Auth | Description |
|---|---|---|---|
| `/billing/plans` | GET | Public | List available plans |
| `/billing/subscription` | GET | JWT | Get org subscription |
| `/billing/subscribe` | POST | OWNER/ADMIN | Subscribe to plan |
| `/billing/cancel` | POST | OWNER/ADMIN | Cancel subscription |
| `/billing/resume` | POST | OWNER/ADMIN | Resume cancelled subscription |
| `/billing/change-plan` | POST | OWNER/ADMIN | Upgrade/downgrade plan |
| `/billing/usage` | GET | JWT | Get quota & usage metrics |
| `/billing/invoices` | GET | JWT | Get invoices |
| `/billing/payments` | GET | JWT | Get payment history |
| `/billing/webhooks` | POST | Public | Inbound payment webhooks |
