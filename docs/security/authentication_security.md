# Authentication Security & Brute Force Protection — Phase AB

Progressive lockout after 3 failed attempts: 30s delay → 2min delay → 15min lock → admin alert. Credential stuffing detection via velocity analysis (>10 attempts/IP/min triggers auto-ban). CAPTCHA triggered at risk score >60. Supports Cloudflare Turnstile, Google reCAPTCHA Enterprise, hCaptcha, and invisible adaptive CAPTCHA.
