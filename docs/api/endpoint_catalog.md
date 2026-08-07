# Dyvin AI Complete REST Endpoint Catalog

| Method | Endpoint | Description | Auth Scope | Rate Limit |
|---|---|---|---|---|
| `POST` | `/api/v1/auth/register` | Register new user account | Public | 10 req/min |
| `POST` | `/api/v1/auth/login` | Authenticate & obtain JWT | Public | 10 req/min |
| `GET` | `/api/v1/ai-search/queries` | List AI search query audits | `search:read` | 100 req/min |
| `POST` | `/api/v1/ai-search/queries` | Trigger LLM search query | `search:write` | 50 req/min |
| `GET` | `/api/v1/citations` | Query detected LLM citations | `citation:read` | 100 req/min |
| `GET` | `/api/v1/visibility/score` | Get AI Visibility Score | `visibility:read` | 200 req/min |
| `GET` | `/api/v1/competitors` | List competitor profiles | `competitor:read` | 100 req/min |
| `GET` | `/api/v1/strategy/plans` | List strategy & decision plans | `strategy:read` | 100 req/min |
| `POST` | `/api/v1/action-engine/execute` | Execute action engine playbook | `action:write` | 30 req/min |
| `GET` | `/api/v1/workflows` | List visual workflows | `workflow:read` | 100 req/min |
| `POST` | `/api/v1/marketplace/publish` | Publish agent to Marketplace | `marketplace:write`| 20 req/min |
| `GET` | `/api/v1/developer/keys` | List API keys | `admin:write` | 50 req/min |
| `GET` | `/api/v1/events/history` | Query domain event store | `events:read` | 100 req/min |
