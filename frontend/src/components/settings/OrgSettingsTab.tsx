import React, { useState } from 'react';
import { useOrgStore } from '@stores/orgStore';
import { useUpdateOrganization } from '@hooks/useOrganizations';
import { Button } from '@components/ui/Button';
import { Input } from '@components/ui/Input';
import { Building2, Save, Upload, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

export function OrgSettingsTab() {
  const { activeOrg, updateOrganization: updateStoreOrg } = useOrgStore();
  const orgId = activeOrg?.id ?? '';
  const { mutateAsync: updateOrg, isPending } = useUpdateOrganization(orgId);

  const [name, setName] = useState(activeOrg?.name ?? '');
  const [logoUrl, setLogoUrl] = useState(activeOrg?.logoUrl ?? '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orgId) return;
    try {
      const updated = await updateOrg({ name, logoUrl });
      updateStoreOrg(orgId, updated);
      setSavedSuccess(true);
      toast.success('Organization profile updated');
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch {
      toast.error('Failed to update organization');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div>
          <h2 className="text-heading-md font-bold text-foreground">Organization Profile</h2>
          <p className="text-body-xs text-muted-foreground">
            Manage your organization identity, branding, and metadata.
          </p>
        </div>
        {savedSuccess && (
          <span className="text-xs text-success flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Saved
          </span>
        )}
      </div>

      <form onSubmit={handleSave} className="max-w-xl space-y-4">
        <Input
          label="Organization Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Acme AI Corporation"
          required
        />

        <Input
          label="Logo URL"
          value={logoUrl}
          onChange={(e) => setLogoUrl(e.target.value)}
          placeholder="https://cdn.example.com/logo.png"
          leftIcon={<Upload className="w-4 h-4" />}
        />

        <div className="p-4 rounded-xl border border-border bg-muted/20 space-y-2">
          <div className="text-xs font-semibold text-foreground flex items-center gap-2">
            <Building2 className="w-4 h-4 text-primary" /> Organization Metadata
          </div>
          <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground pt-1">
            <div>
              <span className="font-medium text-foreground block">Org ID:</span>
              <code className="text-[11px] bg-muted px-1.5 py-0.5 rounded font-mono">{activeOrg?.id ?? 'N/A'}</code>
            </div>
            <div>
              <span className="font-medium text-foreground block">Slug:</span>
              <span className="text-foreground">{activeOrg?.slug ?? 'N/A'}</span>
            </div>
          </div>
        </div>

        <Button type="submit" isLoading={isPending} disabled={isPending} leftIcon={<Save className="w-4 h-4" />}>
          Save Organization Settings
        </Button>
      </form>
    </div>
  );
}
