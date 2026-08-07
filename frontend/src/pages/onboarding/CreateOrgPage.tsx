import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Building2, Upload, AlertTriangle, ArrowRight } from 'lucide-react';
import { Button } from '@components/ui/Button';
import { Input } from '@components/ui/Input';
import { useCreateOrganization } from '@hooks/useOrganizations';
import type { ApiError } from '@services/api/client';

const schema = z.object({
  name: z
    .string()
    .min(2, 'Organization name must be at least 2 characters')
    .max(100, 'Name is too long'),
  logoUrl: z.string().url('Enter a valid URL').optional().or(z.literal('')),
});
type FormValues = z.infer<typeof schema>;

const INDUSTRY_OPTIONS = [
  'Technology', 'Healthcare', 'Finance', 'Education', 'Retail',
  'Manufacturing', 'Consulting', 'Media', 'Legal', 'Real Estate', 'Other',
];

const COMPANY_SIZE_OPTIONS = [
  '1-10', '11-50', '51-200', '201-500', '501-1000', '1000+',
];

export default function CreateOrgPage() {
  const navigate = useNavigate();
  const { mutateAsync: createOrg } = useCreateOrganization();
  const [serverError, setServerError] = useState<string | null>(null);
  const [industry, setIndustry] = useState('');
  const [companySize, setCompanySize] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormValues) => {
    setServerError(null);
    try {
      await createOrg({
        name: data.name,
        logoUrl: data.logoUrl || undefined,
      });
      navigate('/onboarding/invite', { replace: true });
    } catch (err: unknown) {
      const apiErr = err as ApiError;
      setServerError(apiErr?.message || 'Failed to create organization.');
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
                i === 0 ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'
              }`}>
                {step}
              </div>
              {i < 2 && <div className="flex-1 h-0.5 bg-border" />}
            </React.Fragment>
          ))}
        </div>
        <div className="flex gap-8 mb-1 text-xs text-muted-foreground">
          <span className="text-primary font-medium">Create org</span>
          <span>Invite team</span>
          <span>Get started</span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 space-y-6"
        >
          <div>
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
              <Building2 className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-heading-xl text-foreground mb-1">Create your organization</h1>
            <p className="text-body-md text-muted-foreground">
              Set up your team workspace. You can always update these settings later.
            </p>
          </div>

          {serverError && (
            <div className="flex items-center gap-2.5 p-3 rounded-lg border border-danger/30 bg-danger/5 text-danger text-sm">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>{serverError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Input
              label="Organization name"
              id="org-name"
              placeholder="Acme AI Corp"
              error={errors.name?.message}
              hint="This will be your workspace identity on the platform."
              disabled={isSubmitting}
              required
              {...register('name')}
            />

            <Input
              label="Logo URL (optional)"
              id="org-logo"
              type="url"
              placeholder="https://cdn.example.com/logo.png"
              error={errors.logoUrl?.message}
              hint="Use a publicly accessible URL (min 64×64px)"
              disabled={isSubmitting}
              leftIcon={<Upload className="w-4 h-4" />}
              {...register('logoUrl')}
            />

            {/* Industry - UI only for now */}
            <div className="space-y-1.5">
              <label className="block text-label-md text-foreground">Industry</label>
              <div className="flex flex-wrap gap-2">
                {INDUSTRY_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setIndustry(opt)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                      industry === opt
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border bg-transparent text-muted-foreground hover:bg-muted'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* Company size - UI only */}
            <div className="space-y-1.5">
              <label className="block text-label-md text-foreground">Company size</label>
              <div className="grid grid-cols-3 gap-2">
                {COMPANY_SIZE_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setCompanySize(opt)}
                    className={`p-2 rounded-lg text-center text-sm border transition-all ${
                      companySize === opt
                        ? 'border-primary bg-primary/10 text-primary font-medium'
                        : 'border-border bg-transparent text-muted-foreground hover:bg-muted'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full"
              isLoading={isSubmitting}
              disabled={isSubmitting}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              {isSubmitting ? 'Creating...' : 'Create organization'}
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
