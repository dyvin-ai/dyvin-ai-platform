import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPlus, Trash2, ArrowRight, AlertTriangle, Plus } from 'lucide-react';
import { Button } from '@components/ui/Button';
import { Input } from '@components/ui/Input';
import { Badge } from '@components/ui/Badge';
import { useOrgStore } from '@stores/orgStore';
import { useCreateInvitation } from '@hooks/useOrganizations';
import type { UserRole } from '@app-types/auth.types';

const ROLES: { value: UserRole; label: string; description: string }[] = [
  { value: 'ADMIN', label: 'Admin', description: 'Full access except billing' },
  { value: 'MANAGER', label: 'Manager', description: 'Manage projects and members' },
  { value: 'MEMBER', label: 'Member', description: 'Standard platform access' },
  { value: 'VIEWER', label: 'Viewer', description: 'Read-only access' },
  { value: 'DEVELOPER', label: 'Developer', description: 'API access + code' },
];

interface Invite {
  email: string;
  role: UserRole;
}

export default function InviteTeamPage() {
  const navigate = useNavigate();
  const { activeOrg } = useOrgStore();
  const { mutateAsync: sendInvitation } = useCreateInvitation(activeOrg?.id ?? '');

  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('MEMBER');
  const [invites, setInvites] = useState<Invite[]>([]);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const validateEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

  const addInvite = () => {
    if (!validateEmail(email)) {
      setEmailError('Enter a valid email address');
      return;
    }
    if (invites.some((i) => i.email === email)) {
      setEmailError('This email has already been added');
      return;
    }
    setInvites((prev) => [...prev, { email, role }]);
    setEmail('');
    setEmailError(null);
  };

  const removeInvite = (e: string) => setInvites((prev) => prev.filter((i) => i.email !== e));

  const handleSend = async () => {
    if (!activeOrg?.id || invites.length === 0) {
      navigate('/onboarding/success', { replace: true });
      return;
    }
    setIsSending(true);
    setServerError(null);
    try {
      await Promise.all(invites.map((inv) => sendInvitation({ email: inv.email, role: inv.role })));
      navigate('/onboarding/success', { replace: true });
    } catch {
      setServerError('Some invitations failed to send. You can try again from Settings.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-lg">
        {/* Progress */}
        <div className="flex items-center gap-2 mb-8">
          {[1, 2, 3].map((step, i) => (
            <React.Fragment key={step}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                i < 2 ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'
              }`}>
                {i === 0 ? '✓' : step}
              </div>
              {i < 2 && <div className={`flex-1 h-0.5 ${i === 0 ? 'bg-primary' : 'bg-border'}`} />}
            </React.Fragment>
          ))}
        </div>
        <div className="flex gap-8 mb-1 text-xs">
          <span className="text-success font-medium">Create org</span>
          <span className="text-primary font-medium">Invite team</span>
          <span className="text-muted-foreground">Get started</span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 space-y-6"
        >
          <div>
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
              <UserPlus className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-heading-xl text-foreground mb-1">Invite your team</h1>
            <p className="text-body-md text-muted-foreground">
              Add teammates to{' '}
              <span className="text-foreground font-medium">{activeOrg?.name ?? 'your organization'}</span>.
              You can always invite more later.
            </p>
          </div>

          {serverError && (
            <div className="flex items-center gap-2.5 p-3 rounded-lg border border-warning/30 bg-warning/5 text-warning text-sm">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>{serverError}</span>
            </div>
          )}

          {/* Input row */}
          <div className="space-y-3">
            <div className="flex gap-2">
              <div className="flex-1">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setEmailError(null); }}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addInvite())}
                  placeholder="colleague@company.com"
                  className="flex h-9 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors"
                />
              </div>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="h-9 rounded-lg border border-input bg-background px-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {ROLES.map((r) => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </select>
              <Button size="icon" onClick={addInvite} type="button">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            {emailError && <p className="text-body-xs text-danger">{emailError}</p>}
          </div>

          {/* Invite list */}
          <AnimatePresence>
            {invites.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="space-y-2"
              >
                {invites.map((inv) => (
                  <motion.div
                    key={inv.email}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 8 }}
                    className="flex items-center justify-between px-3 py-2 rounded-lg border border-border bg-muted/30"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
                        {inv.email[0].toUpperCase()}
                      </div>
                      <span className="text-sm text-foreground">{inv.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" size="sm">{inv.role}</Badge>
                      <button
                        onClick={() => removeInvite(inv.email)}
                        className="text-muted-foreground hover:text-danger transition-colors p-1 rounded"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex gap-3">
            <Button
              variant="outline"
              size="lg"
              className="flex-1"
              onClick={() => navigate('/onboarding/success', { replace: true })}
            >
              Skip for now
            </Button>
            <Button
              size="lg"
              className="flex-1"
              isLoading={isSending}
              disabled={isSending}
              onClick={handleSend}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              {invites.length > 0 ? `Send ${invites.length} invite${invites.length > 1 ? 's' : ''}` : 'Continue'}
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

