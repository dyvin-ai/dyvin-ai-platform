import React, { useState, useEffect, useRef, useCallback } from 'react';
import { authService, DEMO_CREDENTIALS } from '../lib/auth';
import { DyvinLogo } from '../LandingPage';

/* =========================================================================
   DYVIN AI — AUTHENTICATION EXPERIENCE
   Rebuilt to match the landing page visual identity.
   Design system: Fraunces / Inter / JetBrains Mono — obsidian × warm white
   ========================================================================= */

/* ── Inline icon factory (matches LandingPage.tsx pattern) ─────────────── */
type IP = { size?: number; style?: React.CSSProperties };
const SvgI = (d: string, vb = '0 0 24 24') =>
  ({ size = 16, style }: IP) => (
    <svg width={size} height={size} viewBox={vb} fill="none"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
      style={{ flexShrink: 0, display: 'block', ...style }}
      aria-hidden>
      <g dangerouslySetInnerHTML={{ __html: d }} />
    </svg>
  );

const A = {
  Arrow:  SvgI('<path d="M5 12h14M12 5l7 7-7 7"/>'),
  Mail:   SvgI('<rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 7l10 7 10-7"/>'),
  Lock:   SvgI('<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>'),
  Globe:  SvgI('<circle cx="12" cy="12" r="10"/><path d="M12 2C12 2 8 7 8 12s4 10 4 10M12 2c0 0 4 5 4 10s-4 10-4 10M2 12h20"/>'),
  Eye:    SvgI('<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/>'),
  EyeOff: SvgI('<path d="M17.9 17.9A10 10 0 0 1 2 12s3.6-7 10-7a10 10 0 0 1 5.7 1.8M12 5v0M3 3l18 18"/><circle cx="12" cy="12" r="3"/>'),
  Check:  SvgI('<polyline points="20 6 9 17 4 12"/>'),
  Person: SvgI('<circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>'),
  Spark:  SvgI('<path d="M12 2 14.4 9.6 22 12 14.4 14.4 12 22 9.6 14.4 2 12 9.6 9.6 12 2Z"/>'),
  Google: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden style={{ display: 'block', flexShrink: 0 }}>
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  ),
};

/* ── Methodology steps — directly from the Dyvin product thesis ───────── */
const STEPS = [
  { n: '01', label: 'Audit',     copy: 'Establish your AI visibility baseline across engines.' },
  { n: '02', label: 'Benchmark', copy: 'Map competitor visibility across every relevant query.' },
  { n: '03', label: 'Diagnose',  copy: 'Understand the signals that drive or suppress your brand.' },
  { n: '04', label: 'Act',       copy: 'Connect intelligence to content and citation opportunities.' },
  { n: '05', label: 'Verify',    copy: 'Measure whether changes improved your visibility score.' },
];

/* ── Validation helpers ───────────────────────────────────────────────── */
function validateEmail(v: string) {
  if (!v.trim()) return 'Enter your email address.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())) return 'Enter a valid email address.';
  return '';
}
function validatePassword(v: string) {
  if (!v) return 'Enter your password.';
  if (v.length < 6) return 'Password must be at least 6 characters.';
  return '';
}
function validateDomain(v: string) {
  if (!v.trim()) return ''; // optional
  if (!/\.[a-z]{2,}$/i.test(v.trim())) return 'Enter a valid domain (e.g. yourbrand.com)';
  return '';
}

/* ── Types ────────────────────────────────────────────────────────────── */
interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialDomain?: string;
  initialMode?: 'signup' | 'login' | 'forgot';
  onSuccess?: (targetUrl?: string) => void;
}

type Mode = 'signup' | 'login' | 'forgot';
type Status = 'idle' | 'loading' | 'success' | 'error';

/* =========================================================================
   COMPONENT
   ========================================================================= */
export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen, onClose, initialDomain = '', initialMode = 'signup', onSuccess,
}) => {
  /* ── State ── */
  const [mode, setMode]             = useState<Mode>(initialMode);
  const [email, setEmail]           = useState('');
  const [password, setPassword]     = useState('');
  const [domain, setDomain]         = useState(initialDomain);
  const [showPw, setShowPw]         = useState(false);
  const [status, setStatus]         = useState<Status>('idle');
  const [globalError, setGlobalError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [forgotSent, setForgotSent] = useState(false);

  const emailRef   = useRef<HTMLInputElement>(null);
  const formRef    = useRef<HTMLFormElement>(null);
  const isDemoMode = authService.isDemoModeEnabled();

  /* ── Sync with props ── */
  useEffect(() => { setMode(initialMode); }, [initialMode]);
  useEffect(() => { if (initialDomain) setDomain(initialDomain); }, [initialDomain]);

  /* ── Reset on mode change ── */
  const switchMode = useCallback((next: Mode) => {
    setMode(next);
    setGlobalError('');
    setFieldErrors({});
    setStatus('idle');
    setForgotSent(false);
    setTimeout(() => emailRef.current?.focus(), 60);
  }, []);

  /* ── Tab title ── */
  useEffect(() => {
    if (!isOpen) return;
    const titles: Record<Mode, string> = {
      signup: 'Dyvin AI — Create Account',
      login:  'Dyvin AI — Log In',
      forgot: 'Dyvin AI — Reset Password',
    };
    const prev = document.title;
    document.title = titles[mode];
    return () => { document.title = prev; };
  }, [isOpen, mode]);

  /* ── Keyboard ── */
  useEffect(() => {
    if (!isOpen) return;
    const fn = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [isOpen, onClose]);

  /* ── Auto-focus ── */
  useEffect(() => {
    if (isOpen) setTimeout(() => emailRef.current?.focus(), 200);
  }, [isOpen]);

  /* ── Body scroll lock ── */
  useEffect(() => {
    if (isOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = prev; };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  /* ── Handlers ── */
  const fillDemo = () => {
    setEmail(DEMO_CREDENTIALS.email);
    setPassword(DEMO_CREDENTIALS.password);
    setGlobalError('');
    setFieldErrors({});
  };

  const handleDemoLogin = () => {
    setStatus('loading');
    setGlobalError('');
    authService.loginAsDemo();
    setTimeout(() => {
      setStatus('success');
      setTimeout(() => { onClose(); onSuccess?.('/overview'); }, 300);
    }, 700);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGlobalError('');

    /* ── Field validation ── */
    const errors: Record<string, string> = {};
    const emailErr = validateEmail(email);
    if (emailErr) errors.email = emailErr;

    if (mode !== 'forgot') {
      const pwErr = validatePassword(password);
      if (pwErr) errors.password = pwErr;
    }

    if (mode === 'signup') {
      const domainErr = validateDomain(domain);
      if (domainErr) errors.domain = domainErr;
    }

    if (Object.keys(errors).length) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});

    if (mode === 'forgot') {
      setStatus('loading');
      try {
        await authService.forgotPassword(email.trim());
      } catch {
        // Silently proceed to prevent email enumeration
      }
      setStatus('idle');
      setForgotSent(true);
      return;
    }

    setStatus('loading');

    /* ── Demo shortcut ── */
    if (email.trim().toLowerCase() === DEMO_CREDENTIALS.email.toLowerCase()) {
      authService.loginAsDemo();
      setTimeout(() => { setStatus('success'); setTimeout(() => { onClose(); onSuccess?.('/overview'); }, 300); }, 700);
      return;
    }

    /* ── Real API authentication with backend ── */
    try {
      if (mode === 'signup') {
        await authService.registerWithCredentials(email.trim(), password, domain.trim() || undefined);
      } else {
        await authService.loginWithCredentials(email.trim(), password);
      }
      setStatus('success');
      setTimeout(() => {
        onClose();
        onSuccess?.('/overview');
      }, 300);
    } catch (err) {
      setStatus('error');
      const msg = err instanceof Error ? err.message : 'Authentication failed. Please try again.';
      setGlobalError(msg);
    }
  };

  /* ── Shared token colors ── */
  const C = {
    bg:       '#000000',
    surface:  '#0b0b0b',
    card:     '#111111',
    border:   'rgba(240,239,237,0.07)',
    border2:  'rgba(240,239,237,0.12)',
    border3:  'rgba(240,239,237,0.20)',
    fg:       '#f0efed',
    fg2:      'rgba(240,239,237,0.65)',
    fg3:      'rgba(240,239,237,0.40)',
    fg4:      'rgba(240,239,237,0.22)',
    error:    'rgba(255,100,80,0.90)',
    errorBg:  'rgba(255,80,60,0.08)',
    errorBrd: 'rgba(255,80,60,0.18)',
    success:  'rgba(100,220,130,0.85)',
    successBg:'rgba(80,200,110,0.08)',
    successBrd:'rgba(80,200,110,0.18)',
  };

  /* ── Reusable styles ── */
  const fontMono: React.CSSProperties = { fontFamily: "'JetBrains Mono', 'SF Mono', monospace" };
  const fontSerif: React.CSSProperties = { fontFamily: "'Fraunces', Georgia, serif" };
  const fontSans: React.CSSProperties = { fontFamily: "Inter, -apple-system, sans-serif" };

  const labelStyle: React.CSSProperties = {
    ...fontMono, display: 'block',
    fontSize: 9.5, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase',
    color: C.fg3, marginBottom: 6,
  };

  const inputBaseStyle: React.CSSProperties = {
    ...fontSans, width: '100%', padding: '12px 14px 12px 40px',
    background: 'rgba(240,239,237,0.035)', border: `1px solid ${C.border2}`,
    borderRadius: 10, fontSize: 14, color: C.fg,
    outline: 'none', transition: 'border-color 0.18s, background 0.18s',
    boxSizing: 'border-box',
  };

  const inputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.borderColor = C.border3;
    e.currentTarget.style.background  = 'rgba(240,239,237,0.055)';
  };
  const inputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.borderColor = C.border2;
    e.currentTarget.style.background  = 'rgba(240,239,237,0.035)';
  };

  const errorInputStyle: React.CSSProperties = { borderColor: C.errorBrd };

  /* ── Loading spinner (CSS-only) ── */
  const Spinner = () => (
    <span style={{
      display: 'inline-block', width: 14, height: 14,
      border: `2px solid rgba(10,10,10,0.20)`,
      borderTopColor: '#0a0a0a',
      borderRadius: '50%',
      animation: 'auth-spin 0.7s linear infinite',
      flexShrink: 0,
    }} aria-hidden />
  );

  const isLoading = status === 'loading';

  /* ── Derived headline ── */
  const headline = mode === 'signup'
    ? <><em>Create</em><br />your workspace.</>
    : mode === 'login'
    ? <><em>Welcome</em><br />back.</>
    : <>Reset your<br />password.</>;

  const subline = mode === 'signup'
    ? 'Start measuring how AI discovers and recommends your brand.'
    : mode === 'login'
    ? 'Continue to your AI visibility workspace.'
    : 'Enter your email and we\'ll send reset instructions.';

  /* ── Primary button text ── */
  const btnText = isLoading
    ? (mode === 'signup' ? 'Creating account…' : mode === 'login' ? 'Signing in…' : 'Sending link…')
    : mode === 'signup' ? 'Create account'
    : mode === 'login'  ? 'Sign in'
    : 'Send reset link';

  return (
    <>
      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* FULLSCREEN OVERLAY                                              */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <div
        style={{
          position: 'fixed', inset: 0, zIndex: 500,
          display: 'flex', flexDirection: 'row',
          ...fontSans,
        }}
        role="dialog"
        aria-modal="true"
        aria-label={mode === 'signup' ? 'Create account' : mode === 'login' ? 'Log in' : 'Reset password'}
      >

        {/* ═══════════════════════════════════════════════════════════════
            LEFT PANEL — Brand / Product Context
            Hidden on mobile, shown ≥900px
            ═══════════════════════════════════════════════════════════ */}
        <div
          className="auth-left"
          style={{
            background: C.bg,
            display: 'flex', flexDirection: 'column',
            justifyContent: 'space-between',
            padding: 'clamp(32px, 4vw, 60px)',
            position: 'relative', overflow: 'hidden',
            borderRight: `1px solid ${C.border}`,
          }}
        >
          {/* Radial ambient glow */}
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            background: 'radial-gradient(ellipse 80% 60% at 25% 45%, rgba(240,239,237,0.032) 0%, transparent 72%)',
          }} />
          {/* Dot grid */}
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            backgroundImage: 'radial-gradient(circle, rgba(240,239,237,0.25) 1px, transparent 1px)',
            backgroundSize: '38px 38px', opacity: 0.12,
          }} />

          {/* ── Top: Logo ── */}
          <div style={{ position: 'relative', zIndex: 2 }}>
            <button
              onClick={onClose}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 10,
                background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                color: C.fg,
              }}
              aria-label="Return to Dyvin AI"
            >
              <DyvinLogo size={30} fill={C.fg} />
              <span style={{ ...fontSans, fontSize: 15, fontWeight: 700, color: C.fg, letterSpacing: '-0.01em' }}>
                Dyvin AI
              </span>
            </button>
          </div>

          {/* ── Middle: Headline + Methodology ── */}
          <div style={{ position: 'relative', zIndex: 2, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingTop: 40, paddingBottom: 40 }}>
            {/* Eyebrow */}
            <div style={{
              ...fontMono, fontSize: 9.5, fontWeight: 700, letterSpacing: '0.14em',
              textTransform: 'uppercase', color: C.fg3, marginBottom: 20,
            }}>
              AI Visibility Intelligence
            </div>

            {/* Headline */}
            <h2 style={{
              ...fontSerif, fontSize: 'clamp(36px, 3.4vw, 56px)',
              fontWeight: 800, letterSpacing: '-0.035em', lineHeight: 1.05,
              color: C.fg, margin: '0 0 18px',
            }}>
              Make AI<br />Recommend<br />Your Brand.
            </h2>

            {/* Supporting copy */}
            <p style={{
              ...fontSans, fontSize: 14, lineHeight: 1.72, color: C.fg2,
              maxWidth: 340, margin: '0 0 44px',
            }}>
              Understand how AI discovers, describes, and recommends your brand across the models your buyers use.
            </p>

            {/* Methodology chain */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {STEPS.map((step, i) => (
                <div key={step.n} style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                  {/* Connector line */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                    <div style={{
                      width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                      border: `1px solid ${C.border2}`,
                      background: 'rgba(240,239,237,0.04)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      ...fontMono, fontSize: 8.5, fontWeight: 700, color: C.fg3,
                      letterSpacing: '0.05em',
                    }}>
                      {step.n}
                    </div>
                    {i < STEPS.length - 1 && (
                      <div style={{ width: 1, height: 20, background: C.border, flexShrink: 0 }} />
                    )}
                  </div>
                  <div style={{ paddingBottom: i < STEPS.length - 1 ? 0 : 0, paddingTop: 4 }}>
                    <div style={{
                      ...fontMono, fontSize: 10, fontWeight: 700, letterSpacing: '0.08em',
                      textTransform: 'uppercase', color: C.fg2, marginBottom: 2,
                    }}>
                      {step.label}
                    </div>
                    <div style={{
                      ...fontSans, fontSize: 12.5, lineHeight: 1.55,
                      color: C.fg3, marginBottom: i < STEPS.length - 1 ? 16 : 0,
                    }}>
                      {step.copy}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Bottom: founder note, kept minimal ── */}
          <div style={{ position: 'relative', zIndex: 2 }}>
            <div style={{
              padding: '14px 18px',
              background: 'rgba(240,239,237,0.03)',
              border: `1px solid ${C.border}`,
              borderRadius: 10,
            }}>
              <p style={{
                ...fontSans, fontSize: 12, lineHeight: 1.65,
                color: C.fg3, margin: 0, fontStyle: 'italic',
              }}>
                "Visibility tells you what happened. Citations explain why. Dyvin connects both."
              </p>
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════
            RIGHT PANEL — Authentication
            ═══════════════════════════════════════════════════════════ */}
        <div
          className="auth-right"
          style={{
            flex: '1 1 0',
            background: C.surface,
            display: 'flex', flexDirection: 'column',
            position: 'relative', overflow: 'hidden',
          }}
        >
          {/* Subtle top-right glow */}
          <div style={{
            position: 'absolute', top: -100, right: -100, width: 400, height: 400,
            borderRadius: '50%', pointerEvents: 'none',
            background: 'radial-gradient(circle, rgba(240,239,237,0.025) 0%, transparent 70%)',
          }} />

          {/* ── Top bar ── */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '20px 32px',
            borderBottom: `1px solid ${C.border}`,
            position: 'relative', zIndex: 2, flexShrink: 0,
          }}>
            {/* Mobile-only logo */}
            <button
              onClick={onClose}
              className="auth-mobile-logo"
              style={{
                display: 'none', alignItems: 'center', gap: 8,
                background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                color: C.fg,
              }}
              aria-label="Return to Dyvin AI"
            >
              <DyvinLogo size={24} fill={C.fg} />
              <span style={{ ...fontSans, fontSize: 14, fontWeight: 700, color: C.fg }}>Dyvin AI</span>
            </button>

            {/* Log in / Sign up segmented control */}
            <div style={{
              display: 'inline-flex', alignItems: 'center',
              background: 'rgba(240,239,237,0.04)',
              border: `1px solid ${C.border}`,
              borderRadius: 999, padding: 3,
            }}
              role="tablist"
              aria-label="Switch between log in and sign up"
            >
              {(['login', 'signup'] as const).map(m => (
                <button
                  key={m}
                  onClick={() => switchMode(m)}
                  role="tab"
                  aria-selected={mode === m}
                  style={{
                    ...fontMono, padding: '7px 20px', borderRadius: 999,
                    border: 'none', cursor: 'pointer',
                    fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
                    background: mode === m ? 'rgba(240,239,237,0.10)' : 'transparent',
                    color: mode === m ? C.fg : C.fg3,
                    transition: 'all 0.18s',
                    position: 'relative',
                  }}
                >
                  {m === 'login' ? 'Log in' : 'Sign up'}
                  {mode === m && (
                    <span style={{
                      position: 'absolute', bottom: -1, left: '50%', transform: 'translateX(-50%)',
                      width: 24, height: 1.5, background: C.fg,
                      borderRadius: 999, display: 'block',
                    }} />
                  )}
                </button>
              ))}
            </div>

            {/* Close button */}
            <button
              onClick={onClose}
              style={{
                width: 36, height: 36, borderRadius: '50%',
                background: 'rgba(240,239,237,0.05)',
                border: `1px solid ${C.border}`,
                color: C.fg3, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'background 0.15s, color 0.15s',
                flexShrink: 0,
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.background = 'rgba(240,239,237,0.10)';
                (e.currentTarget as HTMLButtonElement).style.color = C.fg;
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.background = 'rgba(240,239,237,0.05)';
                (e.currentTarget as HTMLButtonElement).style.color = C.fg3;
              }}
              aria-label="Close"
            >
              {/* X icon */}
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden>
                <line x1="2" y1="2" x2="11" y2="11"/><line x1="11" y1="2" x2="2" y2="11"/>
              </svg>
            </button>
          </div>

          {/* ── Scrollable form area ── */}
          <div style={{
            flex: 1, overflowY: 'auto',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '40px 32px',
            position: 'relative', zIndex: 2,
          }}>
            <div style={{ width: '100%', maxWidth: 400 }}>

              {/* ── Headline ── */}
              <h1 style={{
                ...fontSerif,
                fontSize: 'clamp(34px, 4.5vw, 48px)',
                fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.08,
                color: C.fg, margin: '0 0 10px',
              }}>
                {headline}
              </h1>
              <p style={{
                ...fontSans, fontSize: 14, lineHeight: 1.65, color: C.fg2,
                margin: '0 0 32px',
              }}>
                {subline}
              </p>

              {/* ── Demo card (dev mode only) ── */}
              {isDemoMode && mode !== 'forgot' && (
                <div style={{
                  marginBottom: 24, padding: '10px 14px',
                  background: 'rgba(60,130,255,0.08)',
                  border: '1px solid rgba(60,130,255,0.20)',
                  borderRadius: 10,
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <A.Spark size={12} style={{ color: 'rgba(100,180,255,0.80)' }} />
                    <span style={{
                      ...fontMono, fontSize: 10, color: 'rgba(120,190,255,0.80)',
                      letterSpacing: '0.04em',
                    }}>
                      Demo: {DEMO_CREDENTIALS.email} / {DEMO_CREDENTIALS.password}
                    </span>
                  </div>
                  <button
                    onClick={fillDemo}
                    style={{
                      ...fontMono, fontSize: 9.5, fontWeight: 700, letterSpacing: '0.08em',
                      textTransform: 'uppercase', color: 'rgba(120,190,255,0.80)',
                      background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                      textDecoration: 'underline', flexShrink: 0,
                    }}
                  >
                    Auto-fill
                  </button>
                </div>
              )}

              {/* ── Global error ── */}
              {globalError && (
                <div style={{
                  marginBottom: 18, padding: '11px 14px',
                  background: C.errorBg, border: `1px solid ${C.errorBrd}`,
                  borderRadius: 10, display: 'flex', alignItems: 'center', gap: 8,
                  ...fontSans, fontSize: 13, color: C.error,
                }} role="alert">
                  {globalError}
                </div>
              )}

              {/* ── Forgot sent confirmation ── */}
              {forgotSent && (
                <div style={{
                  marginBottom: 18, padding: '11px 14px',
                  background: C.successBg, border: `1px solid ${C.successBrd}`,
                  borderRadius: 10, display: 'flex', alignItems: 'center', gap: 8,
                  ...fontSans, fontSize: 13, color: C.success,
                }} role="status">
                  <A.Check size={14} style={{ color: C.success, flexShrink: 0 }} />
                  <span>Reset link sent — check your inbox.</span>
                </div>
              )}

              {/* ═══════ FORM ════════ */}
              <form ref={formRef} onSubmit={handleSubmit} noValidate>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

                  {/* Brand domain — signup only */}
                  {mode === 'signup' && (
                    <div>
                      <label htmlFor="auth-domain" style={labelStyle}>Brand domain <span style={{ ...fontMono, fontSize: 9, color: C.fg4 }}>(optional)</span></label>
                      <div style={{ position: 'relative' }}>
                        <span style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: C.fg3, display: 'flex' }}>
                          <A.Globe size={14} />
                        </span>
                        <input
                          id="auth-domain"
                          type="text"
                          value={domain}
                          onChange={e => { setDomain(e.target.value); setFieldErrors(p => ({ ...p, domain: '' })); }}
                          placeholder="yourbrand.com"
                          style={{ ...inputBaseStyle, ...(fieldErrors.domain ? errorInputStyle : {}) }}
                          onFocus={inputFocus}
                          onBlur={inputBlur}
                          autoComplete="url"
                        />
                      </div>
                      {fieldErrors.domain && <FieldError msg={fieldErrors.domain} id="err-domain" />}
                    </div>
                  )}

                  {/* Email */}
                  <div>
                    <label htmlFor="auth-email" style={labelStyle}>Email address</label>
                    <div style={{ position: 'relative' }}>
                      <span style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: C.fg3, display: 'flex' }}>
                        <A.Mail size={14} />
                      </span>
                      <input
                        id="auth-email"
                        ref={emailRef}
                        type="email"
                        value={email}
                        onChange={e => { setEmail(e.target.value); setFieldErrors(p => ({ ...p, email: '' })); }}
                        placeholder="name@company.com"
                        required
                        style={{ ...inputBaseStyle, ...(fieldErrors.email ? errorInputStyle : {}) }}
                        onFocus={inputFocus}
                        onBlur={inputBlur}
                        autoComplete={mode === 'signup' ? 'email' : 'username'}
                        aria-describedby={fieldErrors.email ? 'err-email' : undefined}
                        aria-invalid={!!fieldErrors.email}
                      />
                    </div>
                    {fieldErrors.email && <FieldError msg={fieldErrors.email} id="err-email" />}
                  </div>

                  {/* Password — login + signup only */}
                  {mode !== 'forgot' && (
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                        <label htmlFor="auth-password" style={{ ...labelStyle, marginBottom: 0 }}>Password</label>
                        {mode === 'login' && (
                          <button
                            type="button"
                            onClick={() => switchMode('forgot')}
                            style={{
                              ...fontMono, fontSize: 9.5, fontWeight: 700, letterSpacing: '0.08em',
                              textTransform: 'uppercase', color: C.fg3, background: 'none',
                              border: 'none', cursor: 'pointer', padding: 0, textDecoration: 'underline',
                              transition: 'color 0.15s',
                            }}
                            onMouseEnter={e => (e.currentTarget.style.color = C.fg2)}
                            onMouseLeave={e => (e.currentTarget.style.color = C.fg3)}
                          >
                            Forgot?
                          </button>
                        )}
                      </div>
                      <div style={{ position: 'relative' }}>
                        <span style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: C.fg3, display: 'flex' }}>
                          <A.Lock size={14} />
                        </span>
                        <input
                          id="auth-password"
                          type={showPw ? 'text' : 'password'}
                          value={password}
                          onChange={e => { setPassword(e.target.value); setFieldErrors(p => ({ ...p, password: '' })); }}
                          placeholder="••••••••"
                          required
                          style={{ ...inputBaseStyle, paddingRight: 44, ...(fieldErrors.password ? errorInputStyle : {}) }}
                          onFocus={inputFocus}
                          onBlur={inputBlur}
                          autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                          aria-describedby={fieldErrors.password ? 'err-password' : undefined}
                          aria-invalid={!!fieldErrors.password}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPw(p => !p)}
                          style={{
                            position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                            background: 'none', border: 'none', cursor: 'pointer', padding: 3,
                            color: C.fg3, display: 'flex', alignItems: 'center',
                            transition: 'color 0.15s',
                          }}
                          onMouseEnter={e => (e.currentTarget.style.color = C.fg2)}
                          onMouseLeave={e => (e.currentTarget.style.color = C.fg3)}
                          aria-label={showPw ? 'Hide password' : 'Show password'}
                          aria-pressed={showPw}
                        >
                          {showPw ? <A.EyeOff size={14} /> : <A.Eye size={14} />}
                        </button>
                      </div>
                      {fieldErrors.password && <FieldError msg={fieldErrors.password} id="err-password" />}
                      {mode === 'signup' && !fieldErrors.password && (
                        <p style={{ ...fontSans, fontSize: 11.5, color: C.fg4, marginTop: 6, lineHeight: 1.5 }}>
                          Minimum 6 characters.
                        </p>
                      )}
                    </div>
                  )}

                  {/* ── PRIMARY CTA ── */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    style={{
                      marginTop: 4, width: '100%',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                      padding: '14px 24px', borderRadius: 10, border: 'none',
                      cursor: isLoading ? 'default' : 'pointer',
                      ...fontMono, fontSize: 11, fontWeight: 700, letterSpacing: '0.10em', textTransform: 'uppercase',
                      background: isLoading ? 'rgba(240,239,237,0.55)' : C.fg,
                      color: '#0a0a0a',
                      transition: 'background 0.18s, box-shadow 0.18s',
                      boxShadow: isLoading ? 'none' : '0 4px 24px rgba(240,239,237,0.10)',
                    }}
                    onMouseEnter={e => { if (!isLoading) (e.currentTarget as HTMLButtonElement).style.background = '#ffffff'; }}
                    onMouseLeave={e => { if (!isLoading) (e.currentTarget as HTMLButtonElement).style.background = C.fg; }}
                  >
                    {isLoading ? <Spinner /> : null}
                    <span>{btnText}</span>
                    {!isLoading && mode !== 'forgot' && <A.Arrow size={13} />}
                  </button>

                  {/* ── Demo workspace button — secondary ── */}
                  {isDemoMode && mode !== 'forgot' && (
                    <button
                      type="button"
                      onClick={handleDemoLogin}
                      disabled={isLoading}
                      style={{
                        width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                        padding: '13px 24px', borderRadius: 10,
                        border: '1px solid rgba(60,130,255,0.22)',
                        background: 'rgba(60,130,255,0.07)',
                        cursor: isLoading ? 'default' : 'pointer',
                        ...fontMono, fontSize: 10.5, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
                        color: 'rgba(120,180,255,0.80)',
                        transition: 'all 0.18s',
                      }}
                      onMouseEnter={e => { if (!isLoading) { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(60,130,255,0.14)'; } }}
                      onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(60,130,255,0.07)'; }}
                    >
                      <A.Spark size={12} />
                      <span>Demo workspace</span>
                    </button>
                  )}

                  {/* Divider */}
                  {mode !== 'forgot' && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14, margin: '2px 0' }}>
                      <div style={{ flex: 1, height: 1, background: C.border }} />
                      <span style={{ ...fontMono, fontSize: 9, letterSpacing: '0.10em', textTransform: 'uppercase', color: C.fg4 }}>
                        or
                      </span>
                      <div style={{ flex: 1, height: 1, background: C.border }} />
                    </div>
                  )}

                  {/* Google — mock only, clearly labeled */}
                  {mode !== 'forgot' && (
                    <button
                      type="button"
                      onClick={() => {
                        setStatus('loading');
                        authService.loginAsDemo();
                        setTimeout(() => { setStatus('success'); setTimeout(() => { onClose(); onSuccess?.('/overview'); }, 300); }, 900);
                      }}
                      disabled={isLoading}
                      style={{
                        width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                        padding: '13px 24px', borderRadius: 10, cursor: isLoading ? 'default' : 'pointer',
                        border: `1px solid ${C.border2}`,
                        background: 'rgba(240,239,237,0.04)',
                        ...fontSans, fontSize: 13.5, fontWeight: 500, color: C.fg2,
                        transition: 'all 0.18s',
                      }}
                      onMouseEnter={e => { if (!isLoading) { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(240,239,237,0.08)'; (e.currentTarget as HTMLButtonElement).style.borderColor = C.border3; } }}
                      onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(240,239,237,0.04)'; (e.currentTarget as HTMLButtonElement).style.borderColor = C.border2; }}
                    >
                      <A.Google />
                      <span>Continue with Google</span>
                    </button>
                  )}

                  {/* Mode footer switch */}
                  <p style={{
                    ...fontSans, fontSize: 13, color: C.fg3, textAlign: 'center', margin: '4px 0 0',
                  }}>
                    {mode === 'signup' ? (
                      <>Already have an account?{' '}
                        <SwitchBtn onClick={() => switchMode('login')}>Log in</SwitchBtn>
                      </>
                    ) : mode === 'login' ? (
                      <>New to Dyvin?{' '}
                        <SwitchBtn onClick={() => switchMode('signup')}>Create an account</SwitchBtn>
                      </>
                    ) : (
                      <><SwitchBtn onClick={() => switchMode('login')}>← Back to log in</SwitchBtn></>
                    )}
                  </p>
                </div>
              </form>

              {/* Mobile methodology — shown only on mobile ── */}
              <div className="auth-mobile-method" style={{ display: 'none', marginTop: 40 }}>
                <div style={{ height: 1, background: C.border, marginBottom: 28 }} />
                <div style={{ ...fontMono, fontSize: 9.5, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: C.fg3, marginBottom: 16 }}>
                  The Dyvin Method
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  {STEPS.map((s, i) => (
                    <React.Fragment key={s.n}>
                      <span style={{ ...fontMono, fontSize: 9.5, color: C.fg2, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                        {s.label}
                      </span>
                      {i < STEPS.length - 1 && (
                        <span style={{ color: C.fg4, fontSize: 11 }}>→</span>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── Legal footer ── */}
          <div style={{
            padding: '14px 32px',
            borderTop: `1px solid ${C.border}`,
            position: 'relative', zIndex: 2, flexShrink: 0,
          }}>
            <p style={{
              ...fontSans, fontSize: 11.5, color: C.fg4, textAlign: 'center', lineHeight: 1.6, margin: 0,
            }}>
              By continuing, you accept our{' '}
              <a href="#privacy" style={{ color: C.fg3, textDecoration: 'underline' }} onClick={e => e.preventDefault()}>
                Privacy Policy
              </a>{' '}and{' '}
              <a href="#terms" style={{ color: C.fg3, textDecoration: 'underline' }} onClick={e => e.preventDefault()}>
                Terms of Service
              </a>.
            </p>
          </div>
        </div>
      </div>

      {/* ── CSS ── */}
      <style>{`
        @keyframes auth-spin {
          to { transform: rotate(360deg); }
        }

        /* Two-column layout — left panel appears ≥900px */
        .auth-left {
          display: none;
          width: 0;
          flex: 0 0 0;
        }
        .auth-right {
          flex: 1 1 auto;
          min-width: 0;
        }
        @media (min-width: 900px) {
          .auth-left {
            display: flex;
            flex: 0 0 min(500px, 44%);
            width: min(500px, 44%);
          }
          .auth-right {
            flex: 1 1 0;
          }
        }
        @media (min-width: 1200px) {
          .auth-left {
            flex: 0 0 min(560px, 42%);
            width: min(560px, 42%);
          }
        }

        /* Mobile-only elements */
        @media (max-width: 899px) {
          .auth-mobile-logo { display: flex !important; }
          .auth-mobile-method { display: block !important; }
        }

        /* Input focus-visible ring */
        .auth-right input:focus-visible {
          outline: 2px solid rgba(240,239,237,0.22);
          outline-offset: 0;
        }

        /* Button focus-visible */
        .auth-right button:focus-visible,
        .auth-left button:focus-visible {
          outline: 2px solid rgba(240,239,237,0.42);
          outline-offset: 2px;
          border-radius: 10px;
        }

        /* Smooth mode transition */
        .auth-right form {
          animation: auth-fadein 0.22s ease;
        }
        @keyframes auth-fadein {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* Reduce motion */
        @media (prefers-reduced-motion: reduce) {
          .auth-right form { animation: none; }
          * { transition-duration: 0.01ms !important; }
        }
      `}</style>
    </>
  );
};

/* ── Small reusable subcomponents ─────────────────────────────────────── */
function FieldError({ msg, id }: { msg: string; id: string }) {
  return (
    <p id={id} role="alert" style={{
      fontFamily: "Inter, -apple-system, sans-serif",
      fontSize: 11.5, color: 'rgba(255,100,80,0.90)',
      marginTop: 5, lineHeight: 1.4,
    }}>
      {msg}
    </p>
  );
}

function SwitchBtn({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        fontFamily: "Inter, -apple-system, sans-serif",
        fontSize: 13, fontWeight: 600, background: 'none', border: 'none',
        cursor: 'pointer', padding: 0, color: 'rgba(240,239,237,0.65)',
        textDecoration: 'underline', transition: 'color 0.15s',
      }}
      onMouseEnter={e => (e.currentTarget.style.color = '#f0efed')}
      onMouseLeave={e => (e.currentTarget.style.color = 'rgba(240,239,237,0.65)')}
    >
      {children}
    </button>
  );
}
