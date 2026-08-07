import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Smartphone, AlertTriangle, Clock, ShieldCheck, RefreshCw } from 'lucide-react';
import { Button } from '@components/ui/Button';
import { cn } from '@lib/utils';

const OTP_LENGTH = 6;
const CODE_EXPIRY = 300; // 5 minutes in seconds

// ── OTP Input ────────────────────────────────────────────────
function OtpInput({
  value,
  onChange,
  disabled,
  error,
}: {
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
  error?: boolean;
}) {
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, char: string) => {
    const sanitized = char.replace(/\D/g, '').slice(-1);
    const chars = value.split('');
    chars[index] = sanitized;
    const next = chars.join('');
    onChange(next.padEnd(OTP_LENGTH, '').slice(0, OTP_LENGTH));
    if (sanitized && index < OTP_LENGTH - 1) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !value[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);
    onChange(pasted.padEnd(OTP_LENGTH, '').slice(0, OTP_LENGTH));
    const nextEmpty = pasted.length < OTP_LENGTH ? pasted.length : OTP_LENGTH - 1;
    inputs.current[nextEmpty]?.focus();
  };

  return (
    <div className="flex gap-2 justify-center" onPaste={handlePaste}>
      {Array.from({ length: OTP_LENGTH }).map((_, i) => (
        <input
          key={i}
          ref={(el) => (inputs.current[i] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[i] || ''}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          disabled={disabled}
          className={cn(
            'w-11 h-12 text-center text-lg font-semibold rounded-lg border bg-background text-foreground',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
            'transition-colors disabled:opacity-50',
            error ? 'border-danger' : 'border-input',
            value[i] && !error && 'border-primary bg-primary/5'
          )}
        />
      ))}
    </div>
  );
}

// ── Countdown timer ──────────────────────────────────────────
function useCountdown(initial: number) {
  const [seconds, setSeconds] = useState(initial);
  useEffect(() => {
    if (seconds <= 0) return;
    const t = setInterval(() => setSeconds((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [seconds]);
  return { seconds, reset: () => setSeconds(initial) };
}

export default function MFAPage() {
  const [otpValue, setOtpValue] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [trustDevice, setTrustDevice] = useState(false);
  const { seconds, reset } = useCountdown(CODE_EXPIRY);

  const isExpired = seconds <= 0;
  const isComplete = otpValue.replace(/\s/g, '').length === OTP_LENGTH;

  const handleVerify = async () => {
    if (!isComplete) return;
    setIsVerifying(true);
    setError(null);
    try {
      // MFA verification — integration point for backend MFA endpoint
      // For now showing the UI structure
      await new Promise((r) => setTimeout(r, 1500));
      // On real: call authApi.verifyMfa({ code: otpValue, trustDevice })
      setError('MFA backend integration pending. Code entered: ' + otpValue);
    } catch {
      setError('Invalid code. Please try again.');
      setOtpValue('');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = () => {
    reset();
    setOtpValue('');
    setError(null);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <Smartphone className="w-6 h-6 text-primary" />
        </div>
        <h1 className="text-heading-lg text-foreground mb-1">Two-factor authentication</h1>
        <p className="text-body-sm text-muted-foreground">
          Enter the 6-digit code from your authenticator app or sent to your phone.
        </p>
      </div>

      {/* Expiry warning */}
      {seconds > 0 && seconds < 60 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-2 p-3 rounded-lg border border-warning/30 bg-warning/5 text-warning text-sm"
        >
          <Clock className="w-4 h-4 flex-shrink-0" />
          <span>Code expires in {seconds} seconds</span>
        </motion.div>
      )}

      {isExpired && (
        <div className="flex items-center gap-2 p-3 rounded-lg border border-danger/30 bg-danger/5 text-danger text-sm">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <span>Code has expired. Please request a new one.</span>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 p-3 rounded-lg border border-danger/30 bg-danger/5 text-danger text-sm">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <OtpInput
        value={otpValue}
        onChange={setOtpValue}
        disabled={isVerifying || isExpired}
        error={!!error}
      />

      {/* Countdown ring */}
      {!isExpired && (
        <div className="text-center">
          <span className="text-xs text-muted-foreground">
            Code expires in{' '}
            <span className={cn('font-semibold tabular-nums', seconds < 60 ? 'text-warning' : 'text-foreground')}>
              {Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2, '0')}
            </span>
          </span>
        </div>
      )}

      {/* Trust device */}
      <div className="flex items-center gap-2.5">
        <input
          id="trust-device"
          type="checkbox"
          checked={trustDevice}
          onChange={(e) => setTrustDevice(e.target.checked)}
          className="w-4 h-4 rounded border-input accent-primary cursor-pointer"
        />
        <label htmlFor="trust-device" className="text-sm text-muted-foreground cursor-pointer select-none">
          Trust this device for 30 days
        </label>
      </div>

      <div className="space-y-3">
        <Button
          size="lg"
          className="w-full"
          onClick={handleVerify}
          disabled={!isComplete || isVerifying || isExpired}
          isLoading={isVerifying}
        >
          {isVerifying ? 'Verifying...' : 'Verify code'}
        </Button>

        <Button
          size="sm"
          variant="ghost"
          className="w-full"
          onClick={handleResend}
          disabled={!isExpired}
          leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
        >
          {isExpired ? 'Request new code' : `Resend code (${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')})`}
        </Button>
      </div>

      <div className="text-center space-y-1">
        <p className="text-xs text-muted-foreground">
          <ShieldCheck className="w-3 h-3 inline mr-1" />
          Lost access to your authenticator?{' '}
          <Link to="#" className="text-primary hover:underline">Use a backup code</Link>
        </p>
        <Link to="/auth/login" className="block text-xs text-muted-foreground hover:text-foreground">
          Back to sign in
        </Link>
      </div>
    </div>
  );
}
