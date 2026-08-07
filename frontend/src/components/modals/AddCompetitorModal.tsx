import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@components/ui/Dialog';
import { Button } from '@components/ui/Button';
import { Input } from '@components/ui/Input';
import { useCreateCompetitor } from '@hooks/useCompetitorIntelligence';
import { Users, Globe } from 'lucide-react';

interface AddCompetitorModalProps {
  isOpen: boolean;
  onClose: () => void;
  orgId: string;
}

export function AddCompetitorModal({ isOpen, onClose, orgId }: AddCompetitorModalProps) {
  const [competitorName, setCompetitorName] = useState('');
  const [domain, setDomain] = useState('');
  const [industry, setIndustry] = useState('Technology');

  const { mutateAsync: createCompetitor, isPending } = useCreateCompetitor();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!competitorName.trim() || !domain.trim()) return;

    await createCompetitor({
      organizationId: orgId,
      competitorName,
      domain,
      industry,
    });

    setCompetitorName('');
    setDomain('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md bg-card border border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground">
            <Users className="w-5 h-5 text-primary" /> Track New Competitor Domain
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs pt-2">
          <div className="space-y-1">
            <label className="text-muted-foreground font-semibold">Competitor Name</label>
            <Input
              placeholder="e.g. Linear.app"
              value={competitorName}
              onChange={(e) => setCompetitorName(e.target.value)}
              className="bg-background border-border"
            />
          </div>

          <div className="space-y-1">
            <label className="text-muted-foreground font-semibold">Apex Domain</label>
            <Input
              placeholder="e.g. linear.app"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              className="bg-background border-border"
            />
          </div>

          <div className="space-y-1">
            <label className="text-muted-foreground font-semibold">Industry Vertical</label>
            <select
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground focus:outline-none text-xs"
            >
              <option value="Technology">Technology & SaaS</option>
              <option value="Finance">Fintech & Banking</option>
              <option value="Healthcare">Healthcare & Biotech</option>
              <option value="E-Commerce">E-Commerce & Retail</option>
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isPending} leftIcon={<Globe className="w-4 h-4" />}>
              Start Tracking
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
