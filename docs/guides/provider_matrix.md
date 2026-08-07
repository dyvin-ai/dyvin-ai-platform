# Dyvin AI Production Provider Matrix

| Category | Provider | API Version / Protocol | Health Endpoint | Circuit Breaker | Failover Strategy |
|---|---|---|---|---|---|
| **AI Provider** | OpenAI | `gpt-4o`, `gpt-4o-mini` | `/v1/models` | **CLOSED** | Automatic Fallback to Anthropic Claude |
| **AI Provider** | Anthropic Claude | `claude-3-5-sonnet` | `/v1/messages` | **CLOSED** | Automatic Fallback to Google Gemini |
| **AI Provider** | Google Gemini | `gemini-1.5-pro` | `/v1beta/models` | **CLOSED** | Automatic Fallback to Perplexity |
| **AI Provider** | Perplexity AI | `sonar-pro` | `/chat/completions` | **CLOSED** | Automatic Fallback to OpenAI |
| **Payments** | Stripe | `2024-06-20 REST` | `/v1/balance` | **CLOSED** | Razorpay Secondary Gateway |
| **Payments** | Razorpay | `v1 REST` | `/v1/payments` | **CLOSED** | Stripe Primary Gateway |
| **Email** | AWS SES | `v2 AWS SDK` | `/v2/email/account` | **CLOSED** | Fallback to Postmark / Resend |
| **Email** | Postmark | `v1 REST` | `/server` | **CLOSED** | Fallback to AWS SES |
| **Email** | Resend | `v1 REST` | `/emails` | **CLOSED** | Fallback to Postmark |
| **Notifications** | Slack | `Slack WebAPI` | `/api/auth.test` | **CLOSED** | Retry Queue with Exponential Backoff |
| **Notifications** | MS Teams | `Graph API v1.0` | `/v1.0/me` | **CLOSED** | Retry Queue with Exponential Backoff |
| **Notifications** | Discord | `Discord API v10` | `/api/v10/users/@me`| **CLOSED** | Retry Queue with Exponential Backoff |
| **CMS** | WordPress | `wp-json/wp/v2` | `/wp-json` | **CLOSED** | Async BullMQ Retry Queue |
| **CMS** | Webflow | `v2 REST` | `/v2/sites` | **CLOSED** | Async BullMQ Retry Queue |
| **CMS** | Shopify | `GraphQL 2024-07` | `/admin/api/graphql`| **CLOSED** | Async BullMQ Retry Queue |
| **Storage** | AWS S3 | `s3-v2 AWS SDK` | `/` | **CLOSED** | Multi-Region Bucket Replication |
| **Storage** | Cloudflare R2 | `S3-compatible API` | `/` | **CLOSED** | Multi-Cloud Failover to AWS S3 |
| **Search** | OpenSearch | `v2.11 Cluster API` | `/_cluster/health` | **CLOSED** | Multi-Node Replica Group |
| **Vector DB** | Pinecone | `v3 gRPC/REST` | `/describe_index_stats`| **CLOSED** | Hybrid Vector Search with pgvector |
| **Vector DB** | pgvector | `v0.5 PostgreSQL` | `SELECT 1` | **CLOSED** | Native Primary PostgreSQL Database |
| **Secrets** | AWS Secrets Manager | `AWS SDK v2` | `/` | **CLOSED** | HashiCorp Vault Secondary |
| **Secrets** | HashiCorp Vault | `v1.15 KV v2` | `/v1/sys/health` | **CLOSED** | AWS Secrets Manager Primary |
