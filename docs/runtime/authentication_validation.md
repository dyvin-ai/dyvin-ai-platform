# Authentication Validation Report — Real Backend & OAuth

## End-to-End Authentication Validation

1. **User Registration (`POST /api/v1/auth/register`)**: Inserts `User` record into PostgreSQL database with Argon2id password hash, initializes personal `Organization` workspace, creates `OrganizationMember` with `Role.OWNER`, dispatches `EmailVerificationToken`, and records audit logs.
2. **User Login (`POST /api/v1/auth/login`)**: Verifies password against database hash, issues 15-minute JWT Access Token & 7-day Refresh Token.
3. **Token Rotation (`POST /api/v1/auth/refresh`)**: Validates refresh token record in PostgreSQL with reuse protection.
4. **OAuth Endpoints (`GET /api/v1/auth/oauth/:provider` & `GET /api/v1/auth/oauth/:provider/callback`)**: Google, GitHub, Microsoft OAuth flow.
