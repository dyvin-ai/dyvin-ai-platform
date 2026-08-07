import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Role } from '@prisma/client';
import {
  generateRandomToken,
  hashPassword,
  hashToken,
  verifyPassword,
} from '../../common/utils/password.util';
import { generateSlug } from '../../common/utils/slug.util';
import { PrismaService } from '../../database/prisma.service';
import { AuditService } from '../audit/audit.service';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RegisterDto } from './dto/register.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    isEmailVerified: boolean;
  };
  tokens: AuthTokens;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly auditService: AuditService,
  ) {}

  async register(
    dto: RegisterDto,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<AuthResponse> {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase().trim() },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists.');
    }

    const passwordHash = await hashPassword(dto.password);
    const normalizedEmail = dto.email.toLowerCase().trim();

    // Create user and default workspace in single transaction
    const { user, organization } = await this.prisma.$transaction(
      async (tx) => {
        const newUser = await tx.user.create({
          data: {
            email: normalizedEmail,
            passwordHash,
            firstName: dto.firstName,
            lastName: dto.lastName,
          },
        });

        // Create initial personal organization
        const orgName = `${dto.firstName}'s Workspace`;
        let slug = generateSlug(orgName);
        const existingSlug = await tx.organization.findUnique({
          where: { slug },
        });
        if (existingSlug) {
          slug = `${slug}-${newUser.id.substring(0, 6)}`;
        }

        const newOrg = await tx.organization.create({
          data: {
            name: orgName,
            slug,
          },
        });

        // Assign user as OWNER
        await tx.organizationMember.create({
          data: {
            organizationId: newOrg.id,
            userId: newUser.id,
            role: Role.OWNER,
          },
        });

        return { user: newUser, organization: newOrg };
      },
    );

    // Create email verification token
    const rawVerificationToken = generateRandomToken();
    await this.prisma.emailVerificationToken.create({
      data: {
        userId: user.id,
        tokenHash: hashToken(rawVerificationToken),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      },
    });

    // Generate Tokens
    const tokens = await this.generateTokens(user.id, user.email, ipAddress, userAgent);

    // Audit logs
    await this.auditService.logAction({
      userId: user.id,
      organizationId: organization.id,
      action: 'REGISTER',
      ipAddress,
      userAgent,
      metadata: { email: user.email },
    });

    await this.auditService.logAction({
      userId: user.id,
      organizationId: organization.id,
      action: 'ORGANIZATION_CREATE',
      ipAddress,
      userAgent,
      metadata: { name: organization.name, slug: organization.slug },
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        isEmailVerified: user.isEmailVerified,
      },
      tokens,
    };
  }

  async login(
    dto: LoginDto,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<AuthResponse> {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase().trim() },
    });

    if (!user || user.deletedAt) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    if (user.status !== 'ACTIVE') {
      throw new UnauthorizedException('Account has been suspended.');
    }

    const isPasswordValid = await verifyPassword(dto.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    const tokens = await this.generateTokens(user.id, user.email, ipAddress, userAgent);

    await this.auditService.logAction({
      userId: user.id,
      action: 'LOGIN',
      ipAddress,
      userAgent,
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        isEmailVerified: user.isEmailVerified,
      },
      tokens,
    };
  }

  async logout(
    userId: string,
    refreshToken?: string,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<void> {
    if (refreshToken) {
      const hashed = hashToken(refreshToken);
      await this.prisma.refreshToken.updateMany({
        where: { userId, tokenHash: hashed, isRevoked: false },
        data: { isRevoked: true },
      });
    } else {
      // Revoke all active refresh tokens for user
      await this.prisma.refreshToken.updateMany({
        where: { userId, isRevoked: false },
        data: { isRevoked: true },
      });
    }

    await this.auditService.logAction({
      userId,
      action: 'LOGOUT',
      ipAddress,
      userAgent,
    });
  }

  async refreshToken(
    dto: RefreshTokenDto,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<AuthTokens> {
    const hashed = hashToken(dto.refreshToken);

    const tokenRecord = await this.prisma.refreshToken.findUnique({
      where: { tokenHash: hashed },
      include: { user: true },
    });

    if (!tokenRecord || !tokenRecord.user || tokenRecord.user.deletedAt) {
      throw new UnauthorizedException('Invalid refresh token.');
    }

    // Token reuse detection
    if (tokenRecord.isRevoked) {
      this.logger.warn(
        `Refresh token reuse detected for user [${tokenRecord.userId}]. Revoking all active tokens.`,
      );
      await this.prisma.refreshToken.updateMany({
        where: { userId: tokenRecord.userId },
        data: { isRevoked: true },
      });
      throw new UnauthorizedException('Security alert: Refresh token reuse detected.');
    }

    if (new Date() > tokenRecord.expiresAt) {
      throw new UnauthorizedException('Refresh token has expired.');
    }

    // Generate new token pair
    const newTokens = await this.generateTokens(
      tokenRecord.userId,
      tokenRecord.user.email,
      ipAddress,
      userAgent,
    );

    // Mark current token as revoked and replaced
    await this.prisma.refreshToken.update({
      where: { id: tokenRecord.id },
      data: {
        isRevoked: true,
      },
    });

    return newTokens;
  }

  async forgotPassword(
    dto: ForgotPasswordDto,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<{ message: string }> {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase().trim() },
    });

    if (user && !user.deletedAt && user.status === 'ACTIVE') {
      const rawToken = generateRandomToken();
      await this.prisma.passwordResetToken.create({
        data: {
          userId: user.id,
          tokenHash: hashToken(rawToken),
          expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
        },
      });

      this.logger.log(`Password reset token generated for [${user.email}]`);
    }

    return {
      message:
        'If an account with that email exists, password reset instructions have been dispatched.',
    };
  }

  async resetPassword(
    dto: ResetPasswordDto,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<{ message: string }> {
    const hashed = hashToken(dto.token);

    const tokenRecord = await this.prisma.passwordResetToken.findUnique({
      where: { tokenHash: hashed },
      include: { user: true },
    });

    if (
      !tokenRecord ||
      tokenRecord.isUsed ||
      new Date() > tokenRecord.expiresAt ||
      !tokenRecord.user ||
      tokenRecord.user.deletedAt
    ) {
      throw new BadRequestException('Invalid or expired password reset token.');
    }

    const newPasswordHash = await hashPassword(dto.newPassword);

    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: tokenRecord.userId },
        data: { passwordHash: newPasswordHash },
      }),
      this.prisma.passwordResetToken.update({
        where: { id: tokenRecord.id },
        data: { isUsed: true },
      }),
      // Revoke all active sessions on password change
      this.prisma.refreshToken.updateMany({
        where: { userId: tokenRecord.userId, isRevoked: false },
        data: { isRevoked: true },
      }),
    ]);

    await this.auditService.logAction({
      userId: tokenRecord.userId,
      action: 'PASSWORD_RESET',
      ipAddress,
      userAgent,
    });

    return { message: 'Password has been successfully updated.' };
  }

  async verifyEmail(dto: VerifyEmailDto): Promise<{ message: string }> {
    const hashed = hashToken(dto.token);

    const tokenRecord = await this.prisma.emailVerificationToken.findUnique({
      where: { tokenHash: hashed },
    });

    if (!tokenRecord || tokenRecord.isUsed || new Date() > tokenRecord.expiresAt) {
      throw new BadRequestException('Invalid or expired email verification token.');
    }

    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: tokenRecord.userId },
        data: { isEmailVerified: true },
      }),
      this.prisma.emailVerificationToken.update({
        where: { id: tokenRecord.id },
        data: { isUsed: true },
      }),
    ]);

    return { message: 'Email successfully verified.' };
  }

  async getMe(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        isEmailVerified: true,
        avatarUrl: true,
        status: true,
        createdAt: true,
        memberships: {
          select: {
            role: true,
            organization: {
              select: {
                id: true,
                name: true,
                slug: true,
                logoUrl: true,
              },
            },
          },
        },
      },
    });

    if (!user || user.status !== 'ACTIVE') {
      throw new UnauthorizedException('User not found or suspended.');
    }

    return user;
  }

  private async generateTokens(
    userId: string,
    email: string,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<AuthTokens> {
    const payload = { sub: userId, email };

    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: '15m',
    });

    const rawRefreshToken = generateRandomToken();
    const hashedRefreshToken = hashToken(rawRefreshToken);

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    await this.prisma.refreshToken.create({
      data: {
        userId,
        tokenHash: hashedRefreshToken,
        expiresAt,
        ipAddress: ipAddress || null,
        userAgent: userAgent || null,
      },
    });

    return {
      accessToken,
      refreshToken: rawRefreshToken,
      expiresIn: 900, // 15 minutes in seconds
    };
  }
}
