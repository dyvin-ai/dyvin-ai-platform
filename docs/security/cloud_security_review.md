# Cloud Infrastructure Security & Hardening Review

- **Network Isolation**: EKS Pods execute in private subnets with strict NetworkPolicies.
- **WAF & Edge Defense**: Cloudflare Enterprise WAF blocks OWASP top attacks and rate limits bad actors.
- **KMS Secret Encryption**: All AWS Secrets Manager values encrypted via customer-managed KMS key.
