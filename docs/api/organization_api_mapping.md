# Organization API Mapping — Phase F3

## Controller Endpoint Mapping Table

| NestJS Controller | HTTP Method & Route | Frontend Service Method | Query / Headers / Body |
|-------------------|----------------------|-------------------------|------------------------|
| `OrganizationController` | `POST /api/v1/organizations` | `authApi.createOrg()` | Body: `CreateOrganizationDto` |
| `OrganizationController` | `GET /api/v1/organizations` | `authApi.getUserOrganizations()` | Authenticated User Token |
| `OrganizationController` | `GET /api/v1/organizations/:id` | `orgApi.getOrganizationDetails()` | Param: `orgId` |
| `OrganizationController` | `PATCH /api/v1/organizations/:id` | `orgApi.updateOrganization()` | Body: `UpdateOrganizationDto` |
| `OrganizationController` | `POST /api/v1/organizations/:id/invitations` | `orgApi.createInvitation()` | Body: `CreateInvitationDto` |
| `ProjectController` | `POST /api/v1/projects` | `projectApi.createProject()` | Header: `X-Organization-Id` |
| `ProjectController` | `GET /api/v1/projects` | `projectApi.getProjects()` | Header: `X-Organization-Id` |
| `ProjectController` | `GET /api/v1/projects/:id` | `projectApi.getProjectById()` | Header: `X-Organization-Id` |
| `ProjectController` | `PATCH /api/v1/projects/:id` | `projectApi.updateProject()` | Header: `X-Organization-Id` |
| `ProjectController` | `DELETE /api/v1/projects/:id` | `projectApi.deleteProject()` | Header: `X-Organization-Id` |
| `UserController` | `PATCH /api/v1/users/profile` | `userApi.updateProfile()` | Body: `UpdateProfileDto` |
| `RuntimeSecurityController` | `GET /api/v1/security/dashboard` | `securityApi.getDashboard()` | Authenticated User Token |
| `RuntimeSecurityController` | `GET /api/v1/security/sessions` | `securityApi.getSessionsSummary()` | Authenticated User Token |
| `NotificationController` | `GET /api/v1/notifications/preferences` | `notificationApi.getNotificationPreferences()` | Authenticated User Token |
| `FeatureFlagController` | `GET /api/v1/feature-flags` | `featureFlagApi.getFeatureFlags()` | Authenticated User Token |
