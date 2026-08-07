# Data Transfer Object (DTO) & Validation Catalog

## Strict Validation Standards
All DTOs utilize `class-validator` and `class-transformer` with `whitelist: true` and `forbidNonWhitelisted: true`.

- `CreateOrganizationDto`: `@IsString() @IsNotEmpty() name`, `@IsOptional() @IsUrl() website`.
- `PublishListingDto`: `@IsUUID() organizationId`, `@IsString() title`, `@IsEnum(ListingVisibility) visibility`.
- `ExecuteWorkflowDto`: `@IsUUID() workflowId`, `@IsObject() inputVariables`.
