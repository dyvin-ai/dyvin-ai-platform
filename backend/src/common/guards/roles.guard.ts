import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';
import { ROLES_KEY } from '../decorators/roles.decorator';

const ROLE_HIERARCHY: Record<Role, number> = {
  [Role.OWNER]: 50,
  [Role.ADMIN]: 40,
  [Role.MANAGER]: 30,
  [Role.MEMBER]: 20,
  [Role.VIEWER]: 10,
};

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.id) {
      throw new ForbiddenException('User is unauthenticated');
    }

    const orgId =
      request.headers['x-organization-id'] ||
      request.query['organizationId'] ||
      request.params['organizationId'];

    if (!orgId || typeof orgId !== 'string') {
      throw new ForbiddenException(
        'Organization context required (header: X-Organization-Id)',
      );
    }

    const membership = await this.prisma.organizationMember.findUnique({
      where: {
        organizationId_userId: {
          organizationId: orgId,
          userId: user.id,
        },
      },
      select: { role: true },
    });

    if (!membership) {
      throw new ForbiddenException(
        'User is not a member of the specified organization',
      );
    }

    const userRoleWeight = ROLE_HIERARCHY[membership.role];
    const isAllowed = requiredRoles.some(
      (role) => userRoleWeight >= ROLE_HIERARCHY[role],
    );

    if (!isAllowed) {
      throw new ForbiddenException(
        `Insufficient privileges for this organization action. Required: [${requiredRoles.join(
          ', ',
        )}]`,
      );
    }

    return true;
  }
}
