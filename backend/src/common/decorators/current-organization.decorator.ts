import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentOrganization = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string | null => {
    const request = ctx.switchToHttp().getRequest();
    const orgIdHeader = request.headers['x-organization-id'];
    const orgIdQuery = request.query['organizationId'];

    return (
      (typeof orgIdHeader === 'string' ? orgIdHeader : null) ||
      (typeof orgIdQuery === 'string' ? orgIdQuery : null) ||
      request.organizationId ||
      null
    );
  },
);
