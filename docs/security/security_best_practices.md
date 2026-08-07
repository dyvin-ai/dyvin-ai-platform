# Security Best Practices — Phase AB

1. **Defense in Depth**: Rate limiting → WAF → Risk Scoring → Auth → Business Logic.
2. **Zero Trust**: Every request is scored regardless of authenticated state.
3. **Least Privilege**: API keys scoped to minimal permissions; workforce agents operate in sandboxed contexts.
4. **Immutable Audit Trail**: All security events written append-only with no update capability.
5. **Adaptive Protection**: Rate limits and CAPTCHA triggers auto-adjust to threat level.
6. **OWASP Top 10**: All 10 vulnerability classes actively mitigated at WAF layer.
7. **Compliance**: SOC2 Type II, ISO27001, GDPR, HIPAA, PCI DSS controls fully mapped.
