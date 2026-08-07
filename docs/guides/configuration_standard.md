# Configuration System & Environment Variable Validation Guide

All environment variables and feature flags are strictly validated at bootstrap using `@nestjs/config` and `Joi`/`class-validator` schemas.
