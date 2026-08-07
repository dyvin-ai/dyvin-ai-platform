import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { FolderPlus, X, AlertTriangle } from 'lucide-react';
import { Button } from '@components/ui/Button';
import { Input } from '@components/ui/Input';
import { useCreateWorkspace } from '@hooks/useWorkspaces';
import type { ApiError } from '@services/api/client';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  primaryDomain: z.string().min(3, 'Domain is required (e.g. acme.com)'),
  description: z.string().optional(),
  industry: z.string().optional(),
  country: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface CreateWorkspaceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateWorkspaceModal({ isOpen, onClose }: CreateWorkspaceModalProps) {
  const { mutateAsync: createWorkspace, isPending, error } = useCreateWorkspace();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormValues) => {
    try {
      await createWorkspace(data);
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
                <FolderPlus className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-heading-md text-foreground font-semibold">New Workspace</h2>
                <p className="text-body-xs text-muted-foreground">Create a business project workspace.</p>
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
              <span>{(error as unknown as ApiError)?.message || 'Failed to create workspace'}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Workspace Name"
              placeholder="e.g. Global Marketing Launch"
              error={errors.name?.message}
              {...register('name')}
            />

            <Input
              label="Primary Website Domain"
              placeholder="e.g. acme.com"
              error={errors.primaryDomain?.message}
              {...register('primaryDomain')}
            />

            <Input
              label="Description (optional)"
              placeholder="e.g. Q3 AI Strategy Campaign"
              {...register('description')}
            />

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Industry"
                placeholder="e.g. Technology"
                {...register('industry')}
              />
              <Input
                label="Country"
                placeholder="e.g. US"
                {...register('country')}
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
                Cancel
              </Button>
              <Button type="submit" isLoading={isPending} disabled={isPending}>
                Create Workspace
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
