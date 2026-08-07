import { get, post } from './client';
import type {
  AuthResponse,
  AuthTokens,
  LoginRequest,
  RegisterRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  VerifyEmailRequest,
  RefreshTokenRequest,
  AuthUser,
} from '@app-types/auth.types';

// ──────────────────────────────────────────────────────────────
// Auth API Service — maps exactly to backend auth.controller.ts
// ──────────────────────────────────────────────────────────────

/**
 * POST /auth/register
 * Creates a new user + personal workspace. Returns tokens immediately.
 */
export async function register(data: RegisterRequest): Promise<AuthResponse> {
  return post<AuthResponse>('/auth/register', data);
}

/**
 * POST /auth/login
 * Authenticates with email+password. Returns JWT pair.
 */
export async function login(data: LoginRequest): Promise<AuthResponse> {
  return post<AuthResponse>('/auth/login', data);
}

/**
 * POST /auth/logout
 * Revokes the provided refresh token. Requires Bearer.
 */
export async function logout(refreshToken: string): Promise<{ message: string }> {
  return post<{ message: string }>('/auth/logout', { refreshToken });
}

/**
 * POST /auth/refresh
 * Rotates the refresh token pair. No auth header needed.
 * Called automatically by the Axios interceptor.
 */
export async function refreshTokens(data: RefreshTokenRequest): Promise<AuthTokens> {
  return post<AuthTokens>('/auth/refresh', data);
}

/**
 * POST /auth/forgot-password
 * Sends reset instructions. Always returns success to prevent enumeration.
 */
export async function forgotPassword(data: ForgotPasswordRequest): Promise<{ message: string }> {
  return post<{ message: string }>('/auth/forgot-password', data);
}

/**
 * POST /auth/reset-password
 * Applies new password using reset token.
 */
export async function resetPassword(data: ResetPasswordRequest): Promise<{ message: string }> {
  return post<{ message: string }>('/auth/reset-password', data);
}

/**
 * POST /auth/verify-email
 * Marks email as verified using verification token.
 */
export async function verifyEmail(data: VerifyEmailRequest): Promise<{ message: string }> {
  return post<{ message: string }>('/auth/verify-email', data);
}

/**
 * GET /auth/me
 * Returns the current authenticated user with org memberships.
 */
export async function getMe(): Promise<AuthUser> {
  return get<AuthUser>('/auth/me');
}

