# WAF Architecture & Rule Engine — Phase AB

48 active WAF rules protecting against: SQL Injection, XSS, Command Injection, SSRF, LFI, RFI, Header abuse, JSON abuse, GraphQL abuse, File upload abuse, Path traversal. 482 attacks blocked in the last 30 days. Rules run at the API Gateway layer before requests reach business logic. Custom rule syntax supports regex patterns, IP allowlists, and rate-based triggers.
