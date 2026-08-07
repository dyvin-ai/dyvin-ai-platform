import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, ArrowLeft, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Button } from '@components/ui/Button';
import { Input } from '@components/ui/Input';
import * as authApi from '@services/api/auth.api';
import type { ApiError } from '@services/api/client';

const schema = z.object({
  email: z.string().email('Enter a valid email address'),
});
type FormValues = z.infer<typeof schema>;

type PageState = 'idle' | 'success' | 'error';

export default function ForgotPasswordPage() {
  const [pageState, setPageState] = useState<PageState>('idle');
  const [submittedEmail, setSubmittedEmail] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    getValues,
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormValues) => {
    try {
      await authApi.forgotPassword({ email: data.email });
      setSubmittedEmail(data.email);
      setPageState('success');
    } catch (err: unknown) {
      // Backend always returns 200 to prevent enumeration
      // Only true network errors reach here
      const apiErr = err as ApiError;
      if (apiErr?.statusCode === 0) {
        setPageState('error');
      } else {
        // Treat any non-network error as success (security best practice)
        setSubmittedEmail(data.email);
        setPageState('success');
      }
    }
  };

  return (
    <AnimatePresence mode="wait">
      {pageState === 'success' ? (
        <motion.div
          key="success"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          className="space-y-6"
        >
          <div className="w-14 h-14 rounded-2xl bg-success/10 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-7 h-7 text-success" />
          </div>
          <div className="text-center space-y-2">
            <h1 className="text-heading-lg text-foreground">Check your inbox</h1>
            <p className="text-body-sm text-muted-foreground">
              If an account exists for{' '}
              <span className="text-foreground font-medium">{submittedEmail}</span>,
              we've sent password reset instructions.
            </p>
          </div>
          <div className="p-4 rounded-xl border border-border bg-muted/30 space-y-3">
            <p className="text-sm text-muted-foreground text-center">Didn't receive it?</p>
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => {
                authApi.forgotPassword({ email: submittedEmail }).catch(() => {});
              }}
            >
              Resend email
            </Button>
          </div>
          <div className="text-center">
            <Link to="/auth/login" className="text-sm text-primary hover:underline inline-flex items-center gap-1.5">
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to sign in
            </Link>
          </div>
        </motion.div>
      ) : (
        <motion.div
          key="form"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          className="space-y-6"
        >
          <div>
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
              <Mail className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-heading-lg text-foreground mb-1">Reset your password</h1>
            <p className="text-body-sm text-muted-foreground">
              Enter your email address and we'll send you a secure link to reset your password.
            </p>
          </div>

          {pageState === 'error' && (
            <div className="flex items-center gap-2.5 p-3 rounded-lg border border-danger/30 bg-danger/5 text-danger text-sm">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>Network error. Please check your connection and try again.</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Email address"
              type="email"
              id="forgot-email"
              autoComplete="email"
              placeholder="you@company.com"
              error={errors.email?.message}
              disabled={isSubmitting}
              {...register('email')}
            />

            <Button
              type="submit"
              size="lg"
              className="w-full"
              isLoading={isSubmitting}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Sending...' : 'Send reset link'}
            </Button>
          </form>

          <div className="text-center">
            <Link to="/auth/login" className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5">
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to sign in
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}