# External Services & Webhook Security Guide

## 1. Webhook Signature Validation

| Service | Signature Header | Verification Algorithm | Replay Window |
|---|---|---|---|
| **Stripe** | `Stripe-Signature` | HMAC-SHA256 timestamp signature | 300 seconds |
| **Razorpay** | `X-Razorpay-Signature` | HMAC-SHA256 secret verification | 300 seconds |
| **Slack** | `X-Slack-Signature` | HMAC-SHA256 version v0 | 300 seconds |
| **GitHub** | `X-Hub-Signature-256` | HMAC-SHA256 payload signature | 300 seconds |
| **WordPress** | `X-Dyvin-CMS-Signature` | HMAC-SHA256 secret verification | 300 seconds |

---

## 2. Circuit Breaker & Failover Policy
- **Failure Threshold**: 3 consecutive HTTP 5xx or timeout errors within 60 seconds.
- **Half-Open Reset**: 30 seconds after circuit trip.
- **Failover Routing**: Automatic fallback to secondary provider (e.g., OpenAI → Claude → Gemini).
