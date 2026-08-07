# Runtime Root Cause Analysis — Phase S1

## Technical Root Cause Analysis

1. **OAuth Endpoints (404/500)**:
   - Frontend `OAuthButtons.tsx` triggered redirects to `/api/v1/auth/oauth/${provider}` (Google, GitHub, Microsoft).
   - Backend `AuthController` lacked endpoint definitions for `@Get('oauth/:provider')` and `@Get('oauth/:provider/callback')`.
   - Resolution: Added OAuth initiation and callback handlers with `handleOAuthLogin` in `AuthService`.

2. **Registration Pipe & DTO Validation**:
   - `ValidationPipe` with `forbidNonWhitelisted: true` rejects unexpected properties.
   - Resolution: Verified `RegisterDto` property mappings (`email`, `password`, `firstName`, `lastName`).
