# Production Integrations & Configuration Guide

## 1. Environment Variable Profile Keys

```env
# AI Providers
OPENAI_API_KEY=sk-proj-live-...
ANTHROPIC_API_KEY=sk-ant-api03-...
GEMINI_API_KEY=AIzaSy...
PERPLEXITY_API_KEY=pplx-...

# Payments & Webhooks
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
RAZORPAY_KEY_ID=rzp_live_...
RAZORPAY_KEY_SECRET=...

# Email Providers
AWS_SES_REGION=us-east-1
POSTMARK_SERVER_TOKEN=...
RESEND_API_KEY=re_...

# Storage & CDN
AWS_S3_BUCKET=dyvin-prod-storage
CLOUDFLARE_R2_BUCKET=dyvin-prod-cache

# Vector DB & Search
PINECONE_API_KEY=...
PINECONE_ENVIRONMENT=us-east-1-aws
OPENSEARCH_NODE_URL=https://search-cluster.dyvin.ai

# Secrets & Telemetry
AWS_SECRETS_MANAGER_REGION=us-east-1
VAULT_ADDR=https://vault.dyvin.ai:8200
OTEL_EXPORTER_OTLP_ENDPOINT=https://otel.dyvin.ai:4318
```

---

## 2. Health & Latency Observability
All provider integrations expose status via `/api/v1/integrations/status` and `/api/v1/infrastructure`.
