# Database Infrastructure & Validation Report

## Database Topology

- **Database Engine**: PostgreSQL 16 Alpine containerized via `docker-compose.yml`.
- **ORM Client**: Prisma Client v6.19.3.
- **Connection URL**: `postgresql://dyvin:dyvin_secret_password@postgres:5432/dyvin_db?schema=public`.
- **Entities Verified**: `User`, `Organization`, `OrganizationMember`, `RefreshToken`, `PasswordResetToken`, `EmailVerificationToken`, `AuditLog`.
