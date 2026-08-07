import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';
import { Button } from '@components/ui/Button';
import { PasswordStrengthMeter } from '@components/auth/PasswordStrengthMeter';
import * as authApi from '@services/api/auth.api';
import { cn } from '@lib/utils';
import type { ApiError } from '@services/api/client';

const schema = z.object({
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain uppercase')
    .regex(/[a-z]/, 'Must contain lowercase')
    .regex(/\d/, 'Must contain a number'),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});
type FormValues = z.infer<typeof schema>;

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') ?? '';
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const password = watch('password', '');

  const onSubmit = async (data: FormValues) => {
    if (!token) {
      setServerError('Invalid reset link. Please request a new one.');
      return;
    }
    setServerError(null);
    try {
      await authApi.resetPassword({ token, newPassword: data.password });
      setSuccess(true);
    } catch (err: unknown) {
      const apiErr = err as ApiError;
      if (apiErr?.statusCode === 400) {
        setServerError('This reset link is invalid or has expired. Please request a new one.');
      } else {
        setServerError(apiErr?.message || 'Something went wrong. Please try again.');
      }
    }
  };

  if (!token) {
    return (
      <div className="space-y-6 text-center">
        <div className="w-14 h-14 rounded-2xl bg-danger/10 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-7 h-7 text-danger" />
        </div>
        <div>
          <h1 className="text-heading-lg text-foreground mb-2">Invalid reset link</h1>
          <p className="text-body-sm text-muted-foreground">
            This password reset link is missing or malformed.
          </p>
        </div>
        <Link to="/auth/forgot-password">
          <Button size="lg" className="w-full">Request new link</Button>
        </Link>
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      {success ? (
        <motion.div
          key="success"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-6 text-center"
        >
          <div className="w-16 h-16 rounded-3xl bg-success/10 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8 text-success" />
          </div>
          <div>
            <h1 className="text-heading-lg text-foreground mb-2">Password updated!</h1>
            <p className="text-body-sm text-muted-foreground">
              Your password has been changed. All existing sessions have been invalidated for security.
            </p>
          </div>
          <Link to="/auth/login">
            <Button size="lg" className="w-full">Sign in with new password</Button>
          </Link>
        </motion.div>
      ) : (
        <motion.div
          key="form"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div>
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-heading-lg text-foreground mb-1">Set new password</h1>
            <p className="text-body-sm text-muted-foreground">
              Choose a strong password. All active sessions will be signed out.
            </p>
          </div>

          {serverError && (
            <div className="flex items-start gap-2.5 p-3 rounded-lg border border-danger/30 bg-danger/5 text-danger text-sm">
              <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <div>
                <span>{serverError}</span>
                {serverError.includes('expired') && (
                  <Link to="/auth/forgot-password" className="block mt-1 underline">
                    Request a new reset link
                  </Link>
                )}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="new-password" className="block text-label-md text-foreground">
                New password <span className="text-danger">*</span>
              </label>
              <div className="relative">
                <input
                  id="new-password"
                  type={showNew ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder="Create a strong password"
                  disabled={isSubmitting}
                  className={cn(
                    'flex h-9 w-full rounded-lg border border-input bg-background px-3 py-2 pr-10 text-sm text-foreground placeholder:text-muted-foreground',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 transition-colors',
                    errors.password && 'border-danger focus-visible:ring-danger'
                  )}
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowNew((s) => !s)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1 rounded"
                >
                  {showNew ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
              {errors.password && <p className="text-body-xs text-danger">{errors.password.message}</p>}
              <PasswordStrengthMeter password={password} />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="confirm-password" className="block text-label-md text-foreground">
                Confirm password <span className="text-danger">*</span>
              </label>
              <div className="relative">
                <input
                  id="confirm-password"
                  type={showConfirm ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder="Repeat your new password"
                  disabled={isSubmitting}
                  className={cn(
                    'flex h-9 w-full rounded-lg border border-input bg-background px-3 py-2 pr-10 text-sm text-foreground placeholder:text-muted-foreground',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 transition-colors',
                    errors.confirmPassword && 'border-danger focus-visible:ring-danger'
                  )}
                  {...register('confirmPassword')}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((s) => !s)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1 rounded"
                >
                  {showConfirm ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-body-xs text-danger">{errors.confirmPassword.message}</p>
              )}
            </div>

            <Button type="submit" size="lg" className="w-full" isLoading={isSubmitting} disabled={isSubmitting}>
              {isSubmitting ? 'Updating...' : 'Update password'}
            </Button>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}