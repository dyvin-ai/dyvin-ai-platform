# Enterprise Code Quality & Review Guidelines

- **Zero Dead Code**: Unused imports and variables must be stripped.
- **Strict Typing**: Avoid `any` except where required for Prisma dynamic delegates.
- **Error Propagation**: Wrap external calls in circuit breaker error handlers.
