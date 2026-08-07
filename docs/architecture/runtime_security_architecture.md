# Enterprise Runtime Security Architecture — Phase AB

## Overview
The Dyvin AI Platform Enterprise Runtime Security Layer (`backend/src/modules/runtime-security/`) is a production-hardened security platform providing real-time attack detection, adaptive rate limiting, brute-force protection, device intelligence, session security, AI abuse prevention, WAF, DDoS mitigation, threat intelligence, automated incident response, and an Executive Security Dashboard.

## Module Structure
```
backend/src/modules/runtime-security/
├── services/
│   ├── runtime-security.service.ts        # Real-time threat scoring & adaptive protection
│   ├── rate-limiting.service.ts           # Multi-dimensional distributed rate limiting
│   ├── brute-force.service.ts             # Login brute-force & credential stuffing defense
│   ├── registration-abuse.service.ts      # Bot registration & disposable email prevention
│   ├── device-fingerprinting.service.ts   # Browser/OS/device fingerprinting
│   ├── session-security.service.ts        # JWT replay & session hijacking protection
│   ├── account-takeover.service.ts        # ATO detection, impossible travel, velocity anomalies
│   ├── ai-abuse-protection.service.ts     # Prompt injection, jailbreak, token quota protection
│   ├── api-abuse-protection.service.ts    # API scraping, enumeration, replay detection
│   ├── ip-reputation.service.ts           # IP reputation engine, TOR/VPN/GeoIP intelligence
│   ├── waf-rule.service.ts                # Web Application Firewall rules engine
│   ├── ddos-protection.service.ts         # DDoS burst detection, Cloudflare/AWS Shield
│   ├── security-incident.service.ts       # Automated incident management & response
│   ├── threat-intelligence.service.ts     # Threat signatures, MITRE ATT&CK mappings
│   ├── security-dashboard.service.ts      # Executive Security Dashboard telemetry
│   └── security-audit.service.ts          # Immutable security audit log
├── runtime-security.controller.ts         # 16 REST endpoints under /api/v1/security/*
├── runtime-security.module.ts             # NestJS module registration
└── runtime-security.service.spec.ts       # 5 unit test suites — PASSED
```

## Prisma Models
| Model | Table | Purpose |
|---|---|---|
| `RuntimeSecurityThreatRecord` | `runtime_security_threat_records` | Detected threats log |
| `RuntimeRateLimitConfig` | `runtime_rate_limit_configs` | Rate limit rules |
| `RuntimeBruteForceAttempt` | `runtime_brute_force_attempts` | Failed login tracking |
| `RuntimeRegistrationAbuseLog` | `runtime_registration_abuse_logs` | Registration abuse events |
| `RuntimeDeviceFingerprintRecord` | `runtime_device_fingerprint_records` | Device intelligence |
| `RuntimeSessionSecurityLog` | `runtime_session_security_logs` | Session security events |
| `RuntimeAccountTakeoverAlert` | `runtime_account_takeover_alerts` | ATO anomaly alerts |
| `RuntimeAiAbuseLog` | `runtime_ai_abuse_logs` | AI abuse detection |
| `RuntimeApiAbuseLog` | `runtime_api_abuse_logs` | API abuse detection |
| `RuntimeIpReputationRecord` | `runtime_ip_reputation_records` | IP reputation intelligence |
| `RuntimeWafRuleRecord` | `runtime_waf_rule_records` | WAF rules |
| `RuntimeDdosMitigationLog` | `runtime_ddos_mitigation_logs` | DDoS mitigation events |
| `RuntimeSecurityIncidentRecord` | `runtime_security_incident_records` | Security incidents |
| `RuntimeThreatIntelligencePattern` | `runtime_threat_intelligence_patterns` | Threat signatures |
| `RuntimeSecurityAuditLogRecord` | `runtime_security_audit_log_records` | Immutable audit log |

## REST API Endpoints

| Method | Path | Description |
|---|---|---|
| GET | `/api/v1/security/dashboard` | Executive Security Dashboard |
| GET | `/api/v1/security/threats` | Detected threat list |
| GET | `/api/v1/security/incidents` | Security incidents |
| GET | `/api/v1/security/risk` | Platform risk score |
| GET | `/api/v1/security/blocked` | Blocked IPs & requests |
| GET | `/api/v1/security/rate-limits` | Rate limit events |
| GET | `/api/v1/security/sessions` | Active session security |
| GET | `/api/v1/security/devices` | Device fingerprint stats |
| GET | `/api/v1/security/ip-reputation` | IP reputation summary |
| GET | `/api/v1/security/audit` | Immutable security audit log |
| GET | `/api/v1/security/statistics` | Overall security statistics |
| POST | `/api/v1/security/unlock-account` | Unlock locked account |
| POST | `/api/v1/security/ban-ip` | Permanently ban IP |
| POST | `/api/v1/security/unban-ip` | Unban IP |
| POST | `/api/v1/security/revoke-session` | Revoke active session |
| POST | `/api/v1/security/resolve-incident` | Resolve security incident |
