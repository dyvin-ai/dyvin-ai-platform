import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPlus, X, AlertTriangle } from 'lucide-react';
import { Button } from '@components/ui/Button';
import { Input } from '@components/ui/Input';
import { useCreateInvitation } from '@hooks/useOrganizations';
import { useOrgStore } from '@stores/orgStore';
import type { UserRole } from '@app-types/auth.types';
import type { ApiError } from '@services/api/client';

const schema = z.object({
  email: z.string().email('Valid email address required'),
  role: z.enum(['OWNER', 'ADMIN', 'MANAGER', 'MEMBER', 'VIEWER']),
});

type FormValues = z.infer<typeof schema>;

interface InviteMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function InviteMemberModal({ isOpen, onClose }: InviteMemberModalProps) {
  const { activeOrg } = useOrgStore();
  const orgId = activeOrg?.id ?? '';
  const { mutateAsync: sendInvite, isPending, error } = useCreateInvitation(orgId);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { role: 'MEMBER' },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      await sendInvite({ email: data.email, role: data.role as UserRole });
      reset();
      onClose();
    } catch (e) {
      // error handled by React Query state
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-modal flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-md bg-card border border-border rounded-2xl p-6 shadow-2xl space-y-5"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <UserPlus className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-heading-md text-foreground font-semibold">Invite Team Member</h2>
                <p className="text-body-xs text-muted-foreground">
                  Send an invitation link to join {activeOrg?.name ?? 'organization'}.
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground p-1 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-danger/10 border border-danger/20 text-danger text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>{(error as unknown as ApiError)?.message || 'Failed to send invitation'}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              placeholder="colleague@company.com"
              error={errors.email?.message}
              {...register('email')}
            />

            <div className="space-y-1.5">
              <label className="block text-label-md text-foreground">Role</label>
              <select
                {...register('role')}
                className="flex h-9 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="MEMBER">Member — Standard access</option>
                <option value="MANAGER">Manager — Manage projects and members</option>
                <option value="ADMIN">Admin — Full organization settings</option>
                <option value="VIEWER">Viewer — Read-only access</option>
              </select>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
                Cancel
              </Button>
              <Button type="submit" isLoading={isPending} disabled={isPending}>
                Send Invitation
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
