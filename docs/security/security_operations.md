# Security Operations (SecOps) Playbook — Phase AB

**On-call escalation**: `GET /api/v1/security/dashboard` → review risk level → if >MEDIUM open `/incidents` → triage by severity.

**Daily**: Review rate-limit events, blocked IPs, failed logins, and new device registrations.

**Weekly**: Review WAF rule effectiveness, update threat intelligence feed, verify compliance certification status.

**Monthly**: Run full failure simulation suite, review and rotate API keys, run technical debt scanner.

**On CRITICAL incident**: Activate emergency circuit breaker → auto-ban attacker IPs → notify security team via all channels → create post-mortem within 24h.
