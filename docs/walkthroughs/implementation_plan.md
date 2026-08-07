# Phase F2 — Implementation Plan
## Enterprise Authentication, Identity & Onboarding Platform

### Backend API Mapping (Verified)

| Screen | Method | Endpoint | Key Fields |
|--------|--------|----------|------------|
| Register | POST | `/api/v1/auth/register` | `email, password, firstName, lastName` |
| Login | POST | `/api/v1/auth/login` | `email, password` |
| Logout | POST | `/api/v1/auth/logout` | `refreshToken` (Bearer required) |
| Refresh | POST | `/api/v1/auth/refresh` | `refreshToken` |
| Forgot PW | POST | `/api/v1/auth/forgot-password` | `email` |
| Reset PW | POST | `/api/v1/auth/reset-password` | `token, newPassword` |
| Verify Email | POST | `/api/v1/auth/verify-email` | `token` |
| Me | GET | `/api/v1/auth/me` | Bearer token |
| Create Org | POST | `/api/v1/organizations` | `name, logoUrl?` |
| List Orgs | GET | `/api/v1/organizations` | Bearer token |
| Get Org | GET | `/api/v1/organizations/:id` | Bearer token |
| Invite | POST | `/api/v1/organizations/:id/invitations` | `email, role` |
| Accept Invite | POST | `/api/v1/organizations/invitations/accept` | `token` |

### Response shapes
- Login/Register → `{ user: {id, email, firstName, lastName, isEmailVerified}, tokens: {accessToken, refreshToken, expiresIn} }`
- getMe → `{ id, email, firstName, lastName, isEmailVerified, avatarUrl, status, createdAt, memberships[] }`

### Implementation Layers

1. **Types** — `src/types/auth.types.ts`, `src/types/org.types.ts`
2. **API Services** — `src/services/api/auth.api.ts`, `src/services/api/org.api.ts`
3. **Enhanced Stores** — authStore, orgStore, sessionStore, permissionStore
4. **Hooks** — `useAuth`, `useOrganizations`, `usePermissions`
5. **Auth Pages** — LoginPage, RegisterPage, ForgotPasswordPage, ResetPasswordPage, VerifyEmailPage, MFAPage, AccountLockedPage
6. **Onboarding Pages** — CreateOrgPage, InviteTeamPage, OnboardingSuccessPage
7. **Welcome/Landing Page** 
8. **Shared Components** — PasswordStrengthMeter, SecurityBadge, OAuthButtons

### Files to Create

```
src/types/auth.types.ts
src/types/org.types.ts
src/services/api/auth.api.ts
src/services/api/org.api.ts
src/stores/authStore.ts         (enhanced)
src/stores/orgStore.ts          (enhanced)
src/stores/sessionStore.ts
src/stores/permissionStore.ts
src/hooks/useAuth.ts
src/hooks/useOrganizations.ts
src/hooks/usePermissions.ts
src/components/auth/PasswordStrengthMeter.tsx
src/components/auth/OAuthButtons.tsx
src/components/auth/SecurityBadge.tsx
src/pages/auth/LoginPage.tsx         (full)
src/pages/auth/RegisterPage.tsx      (full)
src/pages/auth/ForgotPasswordPage.tsx (full)
src/pages/auth/ResetPasswordPage.tsx  (full)
src/pages/auth/VerifyEmailPage.tsx    (full)
src/pages/auth/MFAPage.tsx
src/pages/auth/AccountLockedPage.tsx
src/pages/welcome/WelcomePage.tsx
src/pages/onboarding/CreateOrgPage.tsx
src/pages/onboarding/InviteTeamPage.tsx
src/pages/onboarding/OnboardingSuccessPage.tsx
```
