import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Eye, EyeOff, AlertTriangle, Clock, ShieldAlert, LogIn } from 'lucide-react';
import { Button } from '@components/ui/Button';
import { Input } from '@components/ui/Input';
import { OAuthButtons, AuthDivider } from '@components/auth/OAuthButtons';
import { useAuth } from '@hooks/useAuth';
import { cn } from '@lib/utils';
import type { ApiError } from '@services/api/client';

// ── Schema ────────────────────────────────────────────────────
const loginSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional(),
});
type LoginFormValues = z.infer<typeof loginSchema>;

// ── Session reason messages ──────────────────────────────────
const SESSION_MESSAGES: Record<string, { icon: React.ElementType; message: string; color: string }> = {
  idle: {
    icon: Clock,
    message: 'Your session expired due to inactivity.',
    color: 'text-warning border-warning/30 bg-warning/5',
  },
  logout: {
    icon: LogIn,
    message: 'You have been signed out.',
    color: 'text-muted-foreground border-border bg-muted/30',
  },
  unauthorized: {
    icon: ShieldAlert,
    message: 'Your session has expired. Please sign in again.',
    color: 'text-danger border-danger/30 bg-danger/5',
  },
};

export default function LoginPage() {
  const { login, isLoading } = useAuth();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [rateLimitMsg, setRateLimitMsg] = useState<string | null>(null);

  // Session reason from URL (e.g. ?reason=idle)
  const reason = new URLSearchParams(location.search).get('reason');
  const sessionMsg = reason ? SESSION_MESSAGES[reason] : null;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { rememberMe: false },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setServerError(null);
    setIsRateLimited(false);
    try {
      await login({ email: data.email, password: data.password }, data.rememberMe);
    } catch (err: unknown) {
      const apiErr = err as ApiError;
      if (apiErr?.statusCode === 429) {
        setIsRateLimited(true);
        setRateLimitMsg('Too many login attempts. Please wait a moment before trying again.');
      } else if (apiErr?.statusCode === 423) {
        setServerError('Your account has been temporarily locked due to multiple failed attempts. Check your email for unlock instructions.');
      } else if (apiErr?.statusCode === 401) {
        setServerError('Invalid email or password. Please check your credentials and try again.');
      } else {
        setServerError(apiErr?.message || 'Something went wrong. Please try again.');
      }
    }
  };

  const busy = isLoading || isSubmitting;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-heading-lg text-foreground mb-1">Welcome back</h1>
        <p className="text-body-sm text-muted-foreground">
          Don't have an account?{' '}
          <Link to="/auth/register" className="text-primary hover:underline font-medium">
            Sign up free
          </Link>
        </p>
      </div>

      {/* Session expired notification */}
      {sessionMsg && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            'flex items-start gap-3 p-3 rounded-lg border text-sm',
            sessionMsg.color
          )}
        >
          <sessionMsg.icon className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>{sessionMsg.message}</span>
        </motion.div>
      )}

      {/* OAuth */}
      <OAuthButtons mode="login" disabled={busy} />
      <AuthDivider />

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {/* Server error */}
        {serverError && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-2.5 p-3 rounded-lg border border-danger/30 bg-danger/5 text-danger text-sm"
          >
            <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{serverError}</span>
          </motion.div>
        )}

        {/* Rate limit */}
        {isRateLimited && rateLimitMsg && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-2.5 p-3 rounded-lg border border-warning/30 bg-warning/5 text-warning text-sm"
          >
            <Clock className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{rateLimitMsg}</span>
          </motion.div>
        )}

        <Input
          label="Email"
          type="email"
          id="login-email"
          autoComplete="email"
          placeholder="you@company.com"
          error={errors.email?.message}
          disabled={busy}
          {...register('email')}
        />

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="login-password" className="block text-label-md text-foreground">
              Password
            </label>
            <Link
              to="/auth/forgot-password"
              className="text-xs text-primary hover:underline font-medium"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder="••••••••"
              disabled={busy}
              className={cn(
                'flex h-9 w-full rounded-lg border border-input bg-background px-3 py-2 pr-10 text-sm text-foreground placeholder:text-muted-foreground',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                'disabled:cursor-not-allowed disabled:opacity-50 transition-colors',
                errors.password && 'border-danger focus-visible:ring-danger'
              )}
              {...register('password')}
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1 rounded"
            >
              {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            </button>
          </div>
          {errors.password && (
            <p className="text-body-xs text-danger">{errors.password.message}</p>
          )}
        </div>

        {/* Remember me */}
        <div className="flex items-center gap-2.5">
          <input
            id="remember-me"
            type="checkbox"
            className="w-4 h-4 rounded border-input accent-primary cursor-pointer"
            {...register('rememberMe')}
          />
          <label htmlFor="remember-me" className="text-sm text-muted-foreground cursor-pointer select-none">
            Remember me for 7 days
          </label>
        </div>

        <Button
          type="submit"
          size="lg"
          className="w-full"
          isLoading={busy}
          disabled={busy || isRateLimited}
        >
          {busy ? 'Signing in...' : 'Sign in'}
        </Button>
      </form>

      {/* Footer */}
      <p className="text-center text-[11px] text-muted-foreground/70">
        By signing in you agree to our{' '}
        <a href="#" className="underline hover:text-foreground">Terms of Service</a>
        {' '}and{' '}
        <a href="#" className="underline hover:text-foreground">Privacy Policy</a>.
      </p>
    </div>
  );
}