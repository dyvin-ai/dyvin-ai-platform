# Workspace Platform — Phase F3

## Overview

Workspaces (mapped to `projects` in the Dyvin AI backend) represent isolated business units, domains, AI search campaigns, and team scopes within an Organization.

## Key Features

- **Workspace Listing & Switcher**: Instant switching between active business projects using `useWorkspaceStore`.
- **Project CRUD**: Create, edit attributes, update scan settings, and soft-delete.
- **Domain & Website Association**: Primary domain configuration and sub-domain attachments (`POST /api/v1/projects/:id/websites`).
- **Workspace Settings**: Scan frequency (DAILY, WEEKLY, MONTHLY), language, and AI provider toggles.
