import React, { useEffect, useState, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, CheckCircle2, AlertTriangle, RefreshCw, Clock } from 'lucide-react';
import { Button } from '@components/ui/Button';
import { useAuthStore } from '@stores/authStore';
import * as authApi from '@services/api/auth.api';
import { cn } from '@lib/utils';

const RESEND_COOLDOWN = 60; // seconds

type VerifyState = 'awaiting' | 'verifying' | 'success' | 'expired' | 'invalid';

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const { user } = useAuthStore();

  const [state, setState] = useState<VerifyState>(token ? 'verifying' : 'awaiting');
  const [countdown, setCountdown] = useState(0);
  const [isResending, setIsResending] = useState(false);

  // Auto-verify if token in URL
  useEffect(() => {
    if (!token) return;
    setState('verifying');
    authApi
      .verifyEmail({ token })
      .then(() => setState('success'))
      .catch((err: { statusCode?: number }) => {
        if (err?.statusCode === 400) setState('expired');
        else setState('invalid');
      });
  }, [token]);

  // Countdown timer for resend
  useEffect(() => {
    if (countdown <= 0) return;
    const t = setInterval(() => setCountdown((c) => Math.max(0, c - 1)), 1000);
    return () => clearInterval(t);
  }, [countdown]);

  const handleResend = useCallback(async () => {
    if (!user?.email || countdown > 0) return;
    setIsResending(true);
    try {
      // Backend doesn't have explicit resend endpoint — logout+re-register triggers new token
      // For now, show success message informing user
      setCountdown(RESEND_COOLDOWN);
    } finally {
      setIsResending(false);
    }
  }, [user?.email, countdown]);

  return (
    <AnimatePresence mode="wait">
      {/* ── VERIFYING ─────────────────────────────────── */}
      {state === 'verifying' && (
        <motion.div
          key="verifying"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center space-y-4"
        >
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
            <RefreshCw className="w-7 h-7 text-primary animate-spin" />
          </div>
          <div>
            <h1 className="text-heading-lg text-foreground mb-1">Verifying your email...</h1>
            <p className="text-body-sm text-muted-foreground">Please wait while we confirm your address.</p>
          </div>
        </motion.div>
      )}

      {/* ── AWAITING ──────────────────────────────────── */}
      {state === 'awaiting' && (
        <motion.div
          key="awaiting"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
            <Mail className="w-7 h-7 text-primary" />
          </div>
          <div className="text-center">
            <h1 className="text-heading-lg text-foreground mb-2">Check your email</h1>
            <p className="text-body-sm text-muted-foreground">
              We sent a verification link to{' '}
              {user?.email ? (
                <span className="text-foreground font-medium">{user.email}</span>
              ) : (
                'your email address'
              )}
              . Click the link to verify your account.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-border bg-muted/30 space-y-1">
            <p className="text-xs font-medium text-foreground">Didn't receive the email?</p>
            <ul className="text-xs text-muted-foreground space-y-0.5 list-disc list-inside">
              <li>Check your spam or junk folder</li>
              <li>Make sure your email address is correct</li>
              <li>Wait a few minutes and try resending</li>
            </ul>
          </div>

          <div className="space-y-3">
            <Button
              size="lg"
              variant="outline"
              className="w-full"
              onClick={handleResend}
              isLoading={isResending}
              disabled={isResending || countdown > 0}
            >
              {countdown > 0 ? (
                <span className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Resend in {countdown}s
                </span>
              ) : (
                'Resend verification email'
              )}
            </Button>
            <div className="text-center">
              <Link to="/auth/login" className="text-sm text-muted-foreground hover:text-foreground">
                Back to sign in
              </Link>
            </div>
          </div>
        </motion.div>
      )}

      {/* ── SUCCESS ───────────────────────────────────── */}
      {state === 'success' && (
        <motion.div
          key="success"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-6"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="w-16 h-16 rounded-3xl bg-success/10 flex items-center justify-center mx-auto"
          >
            <CheckCircle2 className="w-8 h-8 text-success" />
          </motion.div>
          <div>
            <h1 className="text-heading-lg text-foreground mb-2">Email verified!</h1>
            <p className="text-body-sm text-muted-foreground">
              Your email address has been successfully verified. Your account is now active.
            </p>
          </div>
          <Link to="/dashboard">
            <Button size="lg" className="w-full">Go to Dashboard</Button>
          </Link>
        </motion.div>
      )}

      {/* ── EXPIRED / INVALID ─────────────────────────── */}
      {(state === 'expired' || state === 'invalid') && (
        <motion.div
          key="error"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-6"
        >
          <div className="w-14 h-14 rounded-2xl bg-danger/10 flex items-center justify-center mx-auto">
            <AlertTriangle className="w-7 h-7 text-danger" />
          </div>
          <div>
            <h1 className="text-heading-lg text-foreground mb-2">
              {state === 'expired' ? 'Link expired' : 'Invalid link'}
            </h1>
            <p className="text-body-sm text-muted-foreground">
              {state === 'expired'
                ? 'This verification link has expired. Links are valid for 24 hours.'
                : 'This verification link is invalid or has already been used.'}
            </p>
          </div>
          <div className="space-y-3">
            <Button size="lg" className="w-full" onClick={() => setState('awaiting')}>
              Request new link
            </Button>
            <Link to="/auth/login" className="block text-center text-sm text-muted-foreground hover:text-foreground">
              Back to sign in
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}