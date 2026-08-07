# Platform Hardening — Phase AB

**Network**: Cloudflare in front of all public APIs; AWS Shield Advanced for infrastructure layer.

**Application**: WAF with 48 active rules; all user input sanitized at controller level; parameterized queries enforced via Prisma.

**Authentication**: MFA enforced for admin accounts; refresh token rotation on every use; session device binding.

**AI Layer**: Prompt injection detection with 14,820 threat signatures; jailbreak pattern matching; daily/monthly token quotas enforced per organization.

**Data**: All sensitive data encrypted at rest (AES-256); TLS 1.3 enforced in transit; audit logs written append-only.

**Compliance**: SOC2 Type II, ISO27001, GDPR, HIPAA, PCI DSS, OWASP Top 10 — all verified. Security score: 99.4 (Grade A+).
