# Security Runbook — Phase AB

## Brute Force Attack Response
1. Verify: `GET /api/v1/security/threats` — confirm BRUTE_FORCE threat type.
2. Lock affected account: `POST /api/v1/security/unlock-account` (after investigation).
3. Ban attacker IP: `POST /api/v1/security/ban-ip`.
4. Review audit log: `GET /api/v1/security/audit`.

## Credential Stuffing Response
1. Auto-mitigated (risk score >85 triggers instant IP ban).
2. Review: `GET /api/v1/security/blocked`.
3. Activate CAPTCHA for affected endpoints via `RuntimeRateLimitConfig`.

## DDoS Response
1. Cloudflare challenge mode auto-activates at 50,000 RPS burst.
2. Emergency throttle via adaptive rate limiter.
3. Review: `GET /api/v1/security/risk`.

## AI Abuse Response
1. Emergency circuit breaker auto-activates for provider exhaustion.
2. Review: `GET /api/v1/security/threats` filtered by AI_ABUSE.
3. Suspend organization: revoke all API keys and sessions.
