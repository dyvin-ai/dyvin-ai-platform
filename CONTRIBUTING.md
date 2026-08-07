# Contributing to Dyvin AI

Thank you for contributing to Dyvin AI. As an enterprise-grade platform, we maintain strict quality standards, clean monorepo architecture, and secure CI/CD validation.

---

## 🌲 Branch Strategy

- **`main`**: Production-ready branch. Never commit directly to `main`.
- **`develop`**: Integration branch for new features and releases.
- **Feature Branches**: Named `feature/feature-name` or `bugfix/issue-name`.

---

## 💬 Commit Format

We follow the Conventional Commits specification:

- `feat(scope): add workspace switcher dropdown`
- `fix(scope): resolve null pointer exception in auth service`
- `docs(scope): update API reference guide`
- `test(scope): add unit tests for rate limiting`
- `chore(scope): upgrade dependencies`

---

## 🛠️ Pull Request Requirements

1. **Self-Review**: Perform a self-review of your changes prior to submission.
2. **TypeScript**: Clean compilation with 0 compiler errors (`tsc`).
3. **Linting**: 0 ESLint errors or warnings.
4. **Testing**: All unit and integration tests must pass.
5. **PR Description**: Detail the change, issue addressed, and validation steps.

---

## 📝 Coding Standards

- **Formatting**: Governed by Prettier and `.editorconfig`.
- **Imports**: Clean path aliases (e.g. `@stores/*`, `@components/*`, `@app-types/*`).
- **Security**: Never log credentials or commit secrets. Use placeholders in examples.
