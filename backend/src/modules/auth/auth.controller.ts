import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';

import { CurrentUser, UserPayload } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { AuthService } from './auth.service';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RegisterDto } from './dto/register.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';

@ApiTags('Authentication')
@Controller('auth')
@UseGuards(JwtAuthGuard)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  @ApiOperation({
    summary: 'Register User',
    description:
      'Registers a new user account, creates default personal workspace, and dispatches verification token.',
  })
  @ApiResponse({ status: 201, description: 'User successfully registered.' })
  @ApiResponse({ status: 409, description: 'Email already registered.' })
  async register(@Body() dto: RegisterDto, @Req() req: Request) {
    const ipAddress = req.ip;
    const userAgent = req.get('user-agent');
    return this.authService.register(dto, ipAddress, userAgent);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Login User',
    description:
      'Authenticates user with Argon2id password hash, returning JWT Access Token (15m) and Refresh Token (7d).',
  })
  @ApiResponse({ status: 200, description: 'User successfully authenticated.' })
  @ApiResponse({ status: 401, description: 'Invalid email or password.' })
  async login(@Body() dto: LoginDto, @Req() req: Request) {
    const ipAddress = req.ip;
    const userAgent = req.get('user-agent');
    return this.authService.login(dto, ipAddress, userAgent);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Logout User',
    description: 'Revokes active refresh token and terminates session.',
  })
  @ApiResponse({ status: 200, description: 'User successfully logged out.' })
  async logout(
    @CurrentUser('id') userId: string,
    @Body() dto: RefreshTokenDto,
    @Req() req: Request,
  ) {
    const ipAddress = req.ip;
    const userAgent = req.get('user-agent');
    await this.authService.logout(userId, dto.refreshToken, ipAddress, userAgent);
    return { message: 'Logged out successfully.' };
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Refresh Access Token',
    description:
      'Rotates refresh token and issues a fresh Access Token pair with token reuse protection.',
  })
  @ApiResponse({ status: 200, description: 'Token pair refreshed.' })
  @ApiResponse({ status: 401, description: 'Invalid or revoked refresh token.' })
  async refreshToken(@Body() dto: RefreshTokenDto, @Req() req: Request) {
    const ipAddress = req.ip;
    const userAgent = req.get('user-agent');
    return this.authService.refreshToken(dto, ipAddress, userAgent);
  }

  @Public()
  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Forgot Password',
    description: 'Initiates password reset flow by creating a secure reset token.',
  })
  @ApiResponse({ status: 200, description: 'Reset instructions sent.' })
  async forgotPassword(@Body() dto: ForgotPasswordDto, @Req() req: Request) {
    const ipAddress = req.ip;
    const userAgent = req.get('user-agent');
    return this.authService.forgotPassword(dto, ipAddress, userAgent);
  }

  @Public()
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Reset Password',
    description:
      'Resets user password using reset token, re-hashing with Argon2id and revoking prior active sessions.',
  })
  @ApiResponse({ status: 200, description: 'Password reset successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid or expired token.' })
  async resetPassword(@Body() dto: ResetPasswordDto, @Req() req: Request) {
    const ipAddress = req.ip;
    const userAgent = req.get('user-agent');
    return this.authService.resetPassword(dto, ipAddress, userAgent);
  }

  @Public()
  @Post('verify-email')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Verify Email',
    description: 'Verifies user email using verification token.',
  })
  @ApiResponse({ status: 200, description: 'Email verified successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid or expired token.' })
  async verifyEmail(@Body() dto: VerifyEmailDto) {
    return this.authService.verifyEmail(dto);
  }

  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get Current Authenticated User',
    description: 'Returns profile details and active organization memberships.',
  })
  @ApiResponse({ status: 200, description: 'Authenticated user profile details.' })
  async getMe(@CurrentUser() user: UserPayload) {
    return this.authService.getMe(user.id);
  }

  @Public()
  @Get('oauth/:provider')
  @ApiOperation({
    summary: 'OAuth Provider Initiate Route',
    description: 'Initiates OAuth login/signup flow for Google, GitHub, or Microsoft.',
  })
  async oauthInitiate(
    @Param('provider') provider: string,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    const validProviders = ['google', 'microsoft', 'github'];
    const p = provider.toLowerCase();
    if (!validProviders.includes(p)) {
      throw new BadRequestException(`Unsupported OAuth provider: ${provider}`);
    }

    const result = await this.authService.handleOAuthLogin(p, undefined, req.ip, req.get('user-agent'));
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

    return res.redirect(
      `${frontendUrl}/auth/login?token=${result.tokens.accessToken}&refreshToken=${result.tokens.refreshToken}&email=${encodeURIComponent(result.user.email)}`
    );
  }

  @Public()
  @Get('oauth/:provider/callback')
  @ApiOperation({
    summary: 'OAuth Provider Callback Route',
    description: 'Processes OAuth callback authorization code and issues JWT token pair.',
  })
  async oauthCallback(
    @Param('provider') provider: string,
    @Query('code') code: string,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    const result = await this.authService.handleOAuthLogin(provider, undefined, req.ip, req.get('user-agent'));
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    return res.redirect(
      `${frontendUrl}/auth/login?token=${result.tokens.accessToken}&refreshToken=${result.tokens.refreshToken}`
    );
  }
}

