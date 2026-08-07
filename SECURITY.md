# Security Policy

We take security and vulnerabilities seriously at Dyvin AI. We appreciate your efforts to report security issues responsibly.

---

## 🔒 Reporting a Vulnerability

Please do not report security vulnerabilities through public GitHub issues. Instead, report them privately by emailing the repository owner at `singam-naresh@example.com` (or the configured email).

We will acknowledge receipt within 24 hours and provide an update on remediation progress.

---

## 🛡️ Secret Management & Environment Security

- **Secrets Guard**: Do not check secrets, passwords, database credentials, API keys, or private keys into the repository.
- **Environment Variables**: Populate all environment configuration options in local `.env` files. Share configuration formats using `.env.example` with dummy values.
- **Runtime Security**: Dyvin AI incorporates automated brute-force protection, device fingerprinting, session rotation, and IP reputation checks to safeguard enterprise identity.
