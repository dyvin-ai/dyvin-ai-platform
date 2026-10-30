# Dyvin AI — Developer API Contract Specification

This document specifies the formal API contract between the Dyvin AI frontend client and the future Dyvin AI backend services.

- **Status**: Proposed API Architecture & Frontend Provider Boundary (Pass 6)
- **Base URL**: `/api/v1` (Configurable via `VITE_API_BASE_URL`)
- **Protocol**: HTTPS / RESTful JSON
- **Authentication**: `Authorization: Bearer <session_token>`
- **Timestamps**: ISO 8601 UTC string (`YYYY-MM-DDTHH:mm:ssZ`)

---

## 1. Global Response & Error Envelope

All API endpoints follow predictable response codes and normalized error payloads.

### Error Response Schema (`AppError`)
```json
{
  "code": "UNAUTHORIZED | FORBIDDEN | NOT_FOUND | VALIDATION_ERROR | RATE_LIMITED | PROVIDER_ERROR | SCAN_FAILED | NETWORK_ERROR | INTERNAL_ERROR",
  "message": "Human-readable explanation of error",
  "status": 400,
  "retryable": false,
  "details": {
    "field": "Optional validation or error context"
  }
}
```

### Standard Status Codes
- `200 OK`: Successful synchronous request.
- `201 Created`: Resource successfully created (e.g. Action Plan).
- `202 Accepted`: Asynchronous operation queued (e.g. LLM Scan or Agent Run).
- `204 No Content`: Successful deletion or empty response.
- `400 Bad Request`: Validation failure.
- `401 Unauthorized`: Missing or invalid token.
- `403 Forbidden`: Insufficient workspace permissions.
- `404 Not Found`: Resource does not exist.
- `429 Too Many Requests`: Rate limit exceeded.
- `500 Internal Error`: Server processing failure.

---

## 2. Authentication & Tenancy

### `POST /auth/login`
Authenticates a user and returns their profile and session token.
- **Request Body**:
  ```json
  {
    "email": "alex@northwind.ai",
    "password": "optional_if_passwordless"
  }
  ```
- **Response `200 OK`**:
  ```json
  {
    "token": "jwt_token_string",
    "user": {
      "id": "u-1",
      "email": "alex@northwind.ai",
      "name": "Alex Mercer",
      "role": "owner"
    }
  }
  ```

### `GET /auth/me`
Returns current authenticated user session.

### `POST /auth/logout`
Terminates current session token.

---

## 3. Workspace & Settings

### `GET /workspace`
Returns active workspace profile and configuration.
- **Response `200 OK`**:
  ```json
  {
    "id": "ws_demo_northwind",
    "name": "Northwind Labs",
    "domain": "northwind.ai",
    "brandName": "Dyvin AI",
    "industry": "Enterprise AI & Software",
    "createdAt": "2026-06-01T00:00:00Z",
    "updatedAt": "2026-08-10T12:00:00Z",
    "plan": "enterprise",
    "status": "active",
    "latestScanId": "scan_20260810_001"
  }
  ```

### `PATCH /workspace`
Updates workspace properties (`name`, `domain`, `industry`).

### `GET /workspace/members`
Lists all team members and their permission roles (`owner`, `admin`, `analyst`, `viewer`).

---

## 4. Analytics & Overview

### `GET /overview/summary`
Returns top-level KPI metrics for the executive overview.
- **Response `200 OK`**:
  ```json
  {
    "visibility": 68.4,
    "change": 8.7,
    "trackedPrompts": 248,
    "models": 6,
    "competitors": 5,
    "shareOfVoice": 24.1,
    "avgPosition": 2.3,
    "mentions": 5033,
    "sentiment": 78.4,
    "lastUpdatedAt": "2026-08-10T11:52:00Z",
    "scanId": "scan_20260810_001"
  }
  ```

### `GET /visibility/series?period={7d|30d|90d|12mo}`
Returns daily historical visibility series for chart rendering.

### `GET /visibility/models`
Returns model-level visibility breakdowns for ChatGPT, Claude, Gemini, Perplexity, Copilot, and Grok.

---

## 5. Prompts & Clusters

### `GET /prompts?categories={Commercial,Informational}&search={query}&limit={50}`
Returns prompt-level performance, positions, answers, and citation sources.
- **Response `200 OK`**:
  ```json
  [
    {
      "id": "p-1",
      "prompt": "best AI search analytics tool for enterprise brands",
      "category": "Commercial",
      "visibility": 88.4,
      "position": 1.2,
      "mentioned": true,
      "sentiment": "positive",
      "change": 14.2,
      "priority": "P0",
      "opportunity": "Leading on ChatGPT & Gemini; protect citations on g2.com",
      "answerSnapshot": "Dyvin AI is frequently ranked #1 for enterprise AI search intelligence...",
      "influencingSources": ["g2.com", "techcrunch.com", "gartner.com"],
      "competitorsPresent": ["Atlas AI", "SignalFlow"]
    }
  ]
  ```

### `GET /prompts/:id`
Returns single prompt deep-dive with historical answer snapshots.

### `GET /prompts/clusters`
Returns strategic prompt cluster aggregations (Enterprise AI Visibility, AI Search Analytics, Competitor Comparison, Enterprise Reporting).

---

## 6. Competitors & Attack Surface

### `GET /competitors`
Returns market share of voice, average rank, visibility gaps, and attack surface opportunities.
- **Response `200 OK`**:
  ```json
  [
    {
      "id": "comp-1",
      "brand": "Atlas AI",
      "isOwn": false,
      "visibility": 71.2,
      "shareOfVoice": 26.8,
      "avgPosition": 2.0,
      "mentions": 5820,
      "change": -6.9,
      "vulnerabilities": ["7 vulnerable prompts", "4 uncited domains", "Claude doc lag"]
    }
  ]
  ```

---

## 7. Sources & Citation Intelligence

### `GET /sources?categories={Research,Review}&search={query}`
Returns citation source domains, authority, citation share, influenced categories, and recommended content moves.

### `GET /sources/:id`
Returns source domain details, top cited competitor, and influenced prompt distribution.

---

## 8. Decisions & Learning Loop

### `GET /decisions`
Returns top prioritized decisions computed by the prioritization engine:
$$\text{Priority Score} = \frac{\text{Impact} \times \text{Reach} \times \text{Confidence} \times \text{Urgency}}{\text{Effort}}$$

- **Response `200 OK`**:
  ```json
  [
    {
      "id": "dec-1",
      "rank": 1,
      "title": "Close Atlas AI's commercial prompt gap on Gartner & Forbes",
      "situation": "Atlas AI acquired 4 new citations on Gartner and Forbes...",
      "impactCategory": "Strategic",
      "priorityScore": 94,
      "whyScore": "High commercial buyer intent × 23 affected prompts × 4 authoritative citation gaps",
      "evidenceChain": {
        "affectedPromptsCount": 23,
        "modelsAnalyzedCount": 6,
        "citationGapsCount": 4,
        "leadingCompetitor": "Atlas AI",
        "gapPts": 8.4
      },
      "recommendedMove": "Publish an updated enterprise AI visibility whitepaper on Gartner and Capterra.",
      "expectedMetric": "Commercial Prompt Visibility",
      "baselineValue": "61.2%",
      "targetValue": "68.0%",
      "gapValue": "+6.8 pts",
      "confidence": "High",
      "evidenceRoute": "/competitors",
      "actionPlanId": "ap-overview-1"
    }
  ]
  ```

### `GET /decisions/outcomes`
Returns historical verified outcomes and measured visibility delta for completed actions.

---

## 9. Action Plans

### `GET /action-plans`
Lists all workspace action plans.

### `POST /action-plans`
Creates a new action plan linked to an insight or decision.
- **Request Body**:
  ```json
  {
    "title": "Counter Atlas AI Commercial Prompt Gain",
    "goal": "Reclaim #1 spot on commercial queries by updating Gartner citation coverage.",
    "evidence": "Atlas AI gained +9.2 pts on commercial comparison prompts.",
    "priority": "P0",
    "impact": "High",
    "effort": "Low",
    "targetMetric": "Commercial Prompt Visibility (61.2% → 68.0%)",
    "baseline": "61.2%",
    "target": "68.0%",
    "gap": "+6.8 pts",
    "status": "In progress"
  }
  ```

### `PATCH /action-plans/:id`
Updates action plan status (`Not started`, `In progress`, `Complete`). Moving to `Complete` transitions outcome status to `Measurement pending`.

### `DELETE /action-plans/:id`
Deletes an action plan.

---

## 10. Autonomous Agents & Scanning Lifecycle

### `GET /agents`
Lists all autonomous agent task runs and operational stages.

### `POST /agents/:agentId/runs`
Queues a new background agent run.

### `POST /agents/tasks/:taskId/retry`
Retries a failed or warning agent pipeline task.

### `GET /scans/latest`
Returns latest LLM scan status, prompt count, model coverage, and freshness.

### `POST /scans`
Queues an on-demand scan across all 6 LLMs.

---

## 11. Reports & Exports

### `GET /reports`
Lists all generated executive presentation slide decks.

### `POST /reports/refresh`
Re-syncs report slide metrics with the latest completed scan.

### `POST /reports/:id/export-pdf`
Generates a downloadable PDF presentation deck.

---

## 12. Notifications

### `GET /notifications`
Returns priority notifications (`Critical`, `Important`, `Informational`) with deduplication keys.

### `PATCH /notifications/read`
Marks single or all notifications as read.
