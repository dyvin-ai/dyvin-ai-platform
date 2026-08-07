import React, { useState } from 'react';
import { useWorkspaces, useDeleteWorkspace } from '@hooks/useWorkspaces';
import { useWorkspaceStore } from '@stores/workspaceStore';
import { Button } from '@components/ui/Button';
import { Badge } from '@components/ui/Badge';
import { CreateWorkspaceModal } from '@components/modals/CreateWorkspaceModal';
import { FolderKanban, Plus, Trash2, Globe, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

export function WorkspaceSettingsTab() {
  const { data: workspaces = [], isLoading } = useWorkspaces();
  const { activeWorkspace, setActiveWorkspace } = useWorkspaceStore();
  const { mutateAsync: deleteWorkspace } = useDeleteWorkspace();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete workspace "${name}"?`)) return;
    setDeletingId(id);
    try {
      await deleteWorkspace(id);
      toast.success(`Workspace "${name}" deleted`);
    } catch {
      toast.error('Failed to delete workspace');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div>
          <h2 className="text-heading-md font-bold text-foreground">Workspace Platform</h2>
          <p className="text-body-xs text-muted-foreground">
            Manage projects, websites, visibility, and workspace settings.
          </p>
        </div>
        <Button size="sm" onClick={() => setIsModalOpen(true)} leftIcon={<Plus className="w-3.5 h-3.5" />}>
          New Workspace
        </Button>
      </div>

      {isLoading ? (
        <div className="p-8 text-center text-sm text-muted-foreground">Loading workspaces...</div>
      ) : workspaces.length === 0 ? (
        <div className="p-8 border border-dashed border-border rounded-2xl text-center space-y-3">
          <FolderKanban className="w-8 h-8 text-muted-foreground mx-auto" />
          <p className="text-sm text-muted-foreground">No workspaces found in this organization.</p>
          <Button size="sm" onClick={() => setIsModalOpen(true)}>Create First Workspace</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {workspaces.map((ws) => {
            const isActive = ws.id === activeWorkspace?.id;
            return (
              <div
                key={ws.id}
                className={`p-4 rounded-xl border transition-all ${
                  isActive
                    ? 'border-primary bg-primary/5 ring-1 ring-primary/30'
                    : 'border-border bg-card hover:bg-muted/30'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-primary" />
                      <h3 className="text-sm font-semibold text-foreground">{ws.name}</h3>
                      {isActive && <Badge variant="default" size="sm">Active</Badge>}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {ws.description || 'No description provided.'}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(ws.id, ws.name)}
                    disabled={deletingId === ws.id}
                    className="text-muted-foreground hover:text-danger p-1 rounded transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Globe className="w-3 h-3 text-muted-foreground" /> {ws.primaryDomain}
                  </span>
                  {!isActive && (
                    <button
                      onClick={() => setActiveWorkspace(ws)}
                      className="text-primary hover:underline font-medium"
                    >
                      Switch to workspace
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <CreateWorkspaceModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
