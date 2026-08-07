import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@components/ui/Dialog';
import { Button } from '@components/ui/Button';
import { Input } from '@components/ui/Input';
import { useUploadKeywords } from '@hooks/useAiSearch';
import { UploadCloud, FileText } from 'lucide-react';

interface UploadKeywordsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UploadKeywordsModal({ isOpen, onClose }: UploadKeywordsModalProps) {
  const [fileName, setFileName] = useState('');
  const [keywordsCount, setKeywordsCount] = useState(500);

  const { mutateAsync: uploadKeywords, isPending } = useUploadKeywords();

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileName.trim()) return;

    await uploadKeywords({
      fileName,
      keywordsCount,
    });
    setFileName('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md bg-card border border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground">
            <UploadCloud className="w-5 h-5 text-primary" /> Bulk Upload Keywords 2.0 CSV
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleUpload} className="space-y-4 text-xs pt-2">
          <div className="space-y-1">
            <label className="text-muted-foreground font-semibold">CSV File Name</label>
            <Input
              placeholder="e.g. enterprise_ai_search_keywords_2026.csv"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              className="bg-background border-border"
            />
          </div>

          <div className="space-y-1">
            <label className="text-muted-foreground font-semibold">Estimated Keywords Count</label>
            <Input
              type="number"
              value={keywordsCount}
              onChange={(e) => setKeywordsCount(Number(e.target.value))}
              className="bg-background border-border"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isPending} leftIcon={<UploadCloud className="w-4 h-4" />}>
              Process CSV
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
