import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldX, Clock, AlertTriangle, HeadphonesIcon } from 'lucide-react';
import { Button } from '@components/ui/Button';

const UNLOCK_COUNTDOWN = 15 * 60; // 15 minutes

function useCountdown(initial: number) {
  const [seconds, setSeconds] = useState(initial);
  useEffect(() => {
    if (seconds <= 0) return;
    const t = setInterval(() => setSeconds((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [seconds]);
  return seconds;
}

export default function AccountLockedPage() {
  const seconds = useCountdown(UNLOCK_COUNTDOWN);
  const isUnlocked = seconds <= 0;
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="w-16 h-16 rounded-3xl bg-danger/10 flex items-center justify-center mx-auto mb-4"
        >
          <ShieldX className="w-8 h-8 text-danger" />
        </motion.div>
        <h1 className="text-heading-lg text-foreground mb-2">Account temporarily locked</h1>
        <p className="text-body-sm text-muted-foreground">
          Your account has been locked due to multiple failed login attempts to protect your security.
        </p>
      </div>

      {/* Countdown */}
      {!isUnlocked ? (
        <div className="p-5 rounded-xl border border-border bg-muted/30 text-center space-y-2">
          <Clock className="w-6 h-6 text-muted-foreground mx-auto" />
          <p className="text-sm text-muted-foreground">Account unlocks in</p>
          <p className="text-3xl font-bold tabular-nums text-foreground">
            {String(minutes).padStart(2, '0')}:{String(secs).padStart(2, '0')}
          </p>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl border border-success/30 bg-success/5 text-center"
        >
          <p className="text-success font-medium">Your account has been unlocked. You may try again.</p>
        </motion.div>
      )}

      {/* Security information */}
      <div className="p-4 rounded-xl border border-border bg-muted/20 space-y-3">
        <div className="flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-warning flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="text-sm font-medium text-foreground">Why was my account locked?</p>
            <p className="text-xs text-muted-foreground">
              We detected multiple consecutive failed login attempts. This is an automatic security measure to protect your account from unauthorized access.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {isUnlocked && (
          <Link to="/auth/login">
            <Button size="lg" className="w-full">Try signing in again</Button>
          </Link>
        )}

        <Link to="/auth/forgot-password">
          <Button variant="outline" size="lg" className="w-full">
            Reset my password
          </Button>
        </Link>

        <a href="mailto:security@dyvin.ai" className="block">
          <Button variant="ghost" size="sm" className="w-full" leftIcon={<HeadphonesIcon className="w-3.5 h-3.5" />}>
            Contact support
          </Button>
        </a>
      </div>
    </div>
  );
}
