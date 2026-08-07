# Notification Preferences — Phase F3

## Overview

Manages user notification rules across 7 categories (Analysis, Recommendation, Verification, Monitoring, Billing, Collaboration, System) and multiple channels (In-App, Email, Slack, SMS).

## Endpoints

- `GET /api/v1/notifications/preferences` → Retrieve per-category rules
- `PATCH /api/v1/notifications/preferences` → Update notification toggle
- `GET /api/v1/activity` → Retrieve team activity feed
