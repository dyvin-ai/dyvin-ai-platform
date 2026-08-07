import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Eye, EyeOff, AlertTriangle, Check } from 'lucide-react';
import { Button } from '@components/ui/Button';
import { Input } from '@components/ui/Input';
import { OAuthButtons, AuthDivider } from '@components/auth/OAuthButtons';
import { PasswordStrengthMeter } from '@components/auth/PasswordStrengthMeter';
import { useAuth } from '@hooks/useAuth';
import { cn } from '@lib/utils';
import type { ApiError } from '@services/api/client';

// ── Schema ────────────────────────────────────────────────────
const registerSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(50),
  lastName: z.string().min(1, 'Last name is required').max(50),
  email: z.string().email('Enter a valid work email'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain an uppercase letter')
    .regex(/[a-z]/, 'Must contain a lowercase letter')
    .regex(/\d/, 'Must contain a number'),
  confirmPassword: z.string(),
  terms: z.literal(true, { errorMap: () => ({ message: 'You must accept the terms' }) }),
  newsletter: z.boolean().optional(),
}).refine((d) => d.password === d.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

type AccountType = 'individual' | 'business' | 'agency' | 'partner' | 'enterprise';

const ACCOUNT_TYPES: { value: AccountType; label: string; description: string }[] = [
  { value: 'individual', label: 'Individual', description: 'Personal use' },
  { value: 'business', label: 'Business', description: 'Company account' },
  { value: 'agency', label: 'Agency', description: 'Client services' },
  { value: 'enterprise', label: 'Enterprise', description: 'Large organizations' },
];

export default function RegisterPage() {
  const { register: registerUser, isLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [accountType, setAccountType] = useState<AccountType>('individual');
  const [watchedPassword, setWatchedPassword] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { newsletter: false, terms: true as true },
  });

  // Watch password for strength meter
  const password = watch('password', '');
  React.useEffect(() => {
    setWatchedPassword(password);
  }, [password]);

  const onSubmit = async (data: RegisterFormValues) => {
    setServerError(null);
    try {
      await registerUser({
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
      });
    } catch (err: unknown) {
      const apiErr = err as ApiError;
      if (apiErr?.statusCode === 409) {
        setServerError('An account with this email already exists. Try signing in instead.');
      } else {
        setServerError(apiErr?.message || 'Registration failed. Please try again.');
      }
    }
  };

  const busy = isLoading || isSubmitting;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-heading-lg text-foreground mb-1">Create your account</h1>
        <p className="text-body-sm text-muted-foreground">
          Already have an account?{' '}
          <Link to="/auth/login" className="text-primary hover:underline font-medium">
            Sign in
          </Link>
        </p>
      </div>

      {/* Account type selector */}
      <div className="grid grid-cols-4 gap-1.5">
        {ACCOUNT_TYPES.map((t) => (
          <button
            key={t.value}
            type="button"
            onClick={() => setAccountType(t.value)}
            className={cn(
              'p-2.5 rounded-lg border text-center transition-all duration-150 text-left',
              accountType === t.value
                ? 'border-primary bg-primary/5 text-primary'
                : 'border-border bg-transparent text-muted-foreground hover:bg-muted'
            )}
          >
            <div className="text-xs font-semibold truncate">{t.label}</div>
            <div className="text-[10px] text-muted-foreground truncate">{t.description}</div>
          </button>
        ))}
      </div>

      {/* OAuth */}
      <OAuthButtons mode="register" disabled={busy} />
      <AuthDivider />

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
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

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="First name"
            id="reg-firstName"
            autoComplete="given-name"
            placeholder="Alex"
            error={errors.firstName?.message}
            disabled={busy}
            {...register('firstName')}
          />
          <Input
            label="Last name"
            id="reg-lastName"
            autoComplete="family-name"
            placeholder="Morgan"
            error={errors.lastName?.message}
            disabled={busy}
            {...register('lastName')}
          />
        </div>

        <Input
          label="Work email"
          type="email"
          id="reg-email"
          autoComplete="email"
          placeholder="you@company.com"
          error={errors.email?.message}
          disabled={busy}
          {...register('email')}
        />

        {/* Password */}
        <div className="space-y-1.5">
          <label htmlFor="reg-password" className="block text-label-md text-foreground">
            Password <span className="text-danger">*</span>
          </label>
          <div className="relative">
            <input
              id="reg-password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder="Create a strong password"
              disabled={busy}
              className={cn(
                'flex h-9 w-full rounded-lg border border-input bg-background px-3 py-2 pr-10 text-sm text-foreground placeholder:text-muted-foreground',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 transition-colors',
                errors.password && 'border-danger focus-visible:ring-danger'
              )}
              {...register('password')}
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1 rounded"
            >
              {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            </button>
          </div>
          {errors.password && (
            <p className="text-body-xs text-danger">{errors.password.message}</p>
          )}
          <PasswordStrengthMeter password={watchedPassword} />
        </div>

        {/* Confirm password */}
        <div className="space-y-1.5">
          <label htmlFor="reg-confirm" className="block text-label-md text-foreground">
            Confirm password <span className="text-danger">*</span>
          </label>
          <div className="relative">
            <input
              id="reg-confirm"
              type={showConfirm ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder="Repeat your password"
              disabled={busy}
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

        {/* Terms */}
        <div className="space-y-2">
          <div className="flex items-start gap-2.5">
            <input
              id="terms"
              type="checkbox"
              className="mt-0.5 w-4 h-4 rounded border-input accent-primary cursor-pointer flex-shrink-0"
              {...register('terms')}
            />
            <label htmlFor="terms" className="text-xs text-muted-foreground leading-relaxed cursor-pointer">
              I agree to the{' '}
              <a href="#" className="text-primary underline hover:no-underline">Terms of Service</a>
              {' '}and{' '}
              <a href="#" className="text-primary underline hover:no-underline">Privacy Policy</a>
            </label>
          </div>
          {errors.terms && (
            <p className="text-body-xs text-danger">{errors.terms.message}</p>
          )}

          <div className="flex items-center gap-2.5">
            <input
              id="newsletter"
              type="checkbox"
              className="w-4 h-4 rounded border-input accent-primary cursor-pointer"
              {...register('newsletter')}
            />
            <label htmlFor="newsletter" className="text-xs text-muted-foreground cursor-pointer">
              Send me product updates and announcements
            </label>
          </div>
        </div>

        <Button
          type="submit"
          size="lg"
          className="w-full"
          isLoading={busy}
          disabled={busy}
        >
          {busy ? 'Creating account...' : 'Create account'}
        </Button>
      </form>
    </div>
  );
}