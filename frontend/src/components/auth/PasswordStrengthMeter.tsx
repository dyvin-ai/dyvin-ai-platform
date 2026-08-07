import React, { useMemo } from 'react';
import { cn } from '@lib/utils';

interface PasswordStrengthProps {
  password: string;
  className?: string;
}

interface StrengthLevel {
  score: number;       // 0–4
  label: string;
  color: string;
  bgColor: string;
}

function calculateStrength(password: string): StrengthLevel {
  if (!password) return { score: 0, label: '', color: '', bgColor: 'bg-border' };

  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) score++;

  const clampedScore = Math.min(4, Math.floor(score / 1.25));

  const levels: Omit<StrengthLevel, 'score'>[] = [
    { label: '', color: '', bgColor: 'bg-border' },
    { label: 'Weak', color: 'text-danger', bgColor: 'bg-danger' },
    { label: 'Fair', color: 'text-warning', bgColor: 'bg-warning' },
    { label: 'Good', color: 'text-info', bgColor: 'bg-info' },
    { label: 'Strong', color: 'text-success', bgColor: 'bg-success' },
  ];

  return { score: clampedScore, ...levels[clampedScore] };
}

const REQUIREMENTS = [
  { label: 'At least 8 characters', test: (p: string) => p.length >= 8 },
  { label: 'Uppercase letter', test: (p: string) => /[A-Z]/.test(p) },
  { label: 'Lowercase letter', test: (p: string) => /[a-z]/.test(p) },
  { label: 'Number', test: (p: string) => /\d/.test(p) },
  { label: 'Special character', test: (p: string) => /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(p) },
];

export function PasswordStrengthMeter({ password, className }: PasswordStrengthProps) {
  const strength = useMemo(() => calculateStrength(password), [password]);

  if (!password) return null;

  return (
    <div className={cn('space-y-2', className)}>
      {/* Bar */}
      <div className="flex gap-1">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className={cn(
              'h-1 flex-1 rounded-full transition-all duration-300',
              i < strength.score ? strength.bgColor : 'bg-border'
            )}
          />
        ))}
      </div>
      {/* Label + requirements */}
      {strength.label && (
        <div className="flex items-center justify-between">
          <span className={cn('text-xs font-medium', strength.color)}>
            {strength.label}
          </span>
        </div>
      )}
      <div className="grid grid-cols-2 gap-x-4 gap-y-1">
        {REQUIREMENTS.map((req) => {
          const met = password ? req.test(password) : false;
          return (
            <div key={req.label} className="flex items-center gap-1.5">
              <div
                className={cn(
                  'w-1.5 h-1.5 rounded-full flex-shrink-0 transition-colors duration-200',
                  met ? 'bg-success' : 'bg-border'
                )}
              />
              <span className={cn('text-[10px]', met ? 'text-success' : 'text-muted-foreground')}>
                {req.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
