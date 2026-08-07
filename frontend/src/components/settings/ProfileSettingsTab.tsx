import React, { useState } from 'react';
import { useAuthStore } from '@stores/authStore';
import { updateProfile } from '@services/api/user.api';
import { Button } from '@components/ui/Button';
import { Input } from '@components/ui/Input';
import { User, Save, Upload, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

export function ProfileSettingsTab() {
  const { user, setUser } = useAuthStore();

  const [firstName, setFirstName] = useState(user?.firstName ?? '');
  const [lastName, setLastName] = useState(user?.lastName ?? '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl ?? '');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const updated = await updateProfile({
        firstName,
        lastName,
        avatarUrl: avatarUrl || undefined,
      });
      if (user) {
        setUser({ ...user, ...updated });
      }
      toast.success('Profile updated successfully');
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-border pb-4">
        <h2 className="text-heading-md font-bold text-foreground">Profile Center</h2>
        <p className="text-body-xs text-muted-foreground">
          Manage your personal details, avatar, and account profile.
        </p>
      </div>

      <form onSubmit={handleSave} className="max-w-xl space-y-4">
        <div className="flex items-center gap-4 p-4 rounded-xl border border-border bg-muted/20">
          <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xl overflow-hidden border border-primary/30">
            {avatarUrl ? (
              <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              firstName[0]?.toUpperCase() ?? 'U'
            )}
          </div>
          <div>
            <div className="text-sm font-semibold text-foreground">{user?.email}</div>
            <div className="text-xs text-muted-foreground">Personal Account</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
          <Input
            label="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>

        <Input
          label="Avatar Image URL"
          value={avatarUrl}
          onChange={(e) => setAvatarUrl(e.target.value)}
          placeholder="https://cdn.example.com/avatar.jpg"
          leftIcon={<Upload className="w-4 h-4" />}
        />

        <Button type="submit" isLoading={isSaving} disabled={isSaving} leftIcon={<Save className="w-4 h-4" />}>
          Save Profile
        </Button>
      </form>
    </div>
  );
}
