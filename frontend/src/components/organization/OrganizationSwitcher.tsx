import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2,
  FolderKanban,
  Check,
  ChevronsUpDown,
  Plus,
  Search,
  Sparkles,
} from 'lucide-react';
import { useOrgStore } from '@stores/orgStore';
import { useWorkspaceStore } from '@stores/workspaceStore';
import { useWorkspaces } from '@hooks/useWorkspaces';
import { cn } from '@lib/utils';

interface OrganizationSwitcherProps {
  onOpenCreateOrg?: () => void;
  onOpenCreateWorkspace?: () => void;
}

export function OrganizationSwitcher({
  onOpenCreateOrg,
  onOpenCreateWorkspace,
}: OrganizationSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { organizations, activeOrg, setActiveOrg } = useOrgStore();
  const { workspaces, activeWorkspace, setActiveWorkspace } = useWorkspaceStore();

  // Load workspaces for active org
  useWorkspaces();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredOrgs = organizations.filter((org) =>
    org.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredWorkspaces = workspaces.filter((ws) =>
    ws.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={cn(
          'flex items-center gap-2.5 px-3 py-1.5 rounded-xl border border-border/60 bg-muted/30 hover:bg-muted/60 transition-all text-left group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
        )}
      >
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-500 to-primary flex items-center justify-center text-white text-xs font-bold shadow-sm flex-shrink-0">
          {activeOrg?.name?.[0]?.toUpperCase() ?? 'D'}
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-xs font-bold text-foreground truncate max-w-[130px]">
            {activeOrg?.name ?? 'Select Org'}
          </span>
          <span className="text-[10px] text-muted-foreground truncate max-w-[130px]">
            {activeWorkspace?.name ? `⚡ ${activeWorkspace.name}` : 'Default Workspace'}
          </span>
        </div>
        <ChevronsUpDown className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground transition-colors ml-1 flex-shrink-0" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 top-full mt-2 w-72 rounded-2xl border border-border bg-popover/95 backdrop-blur-md shadow-2xl p-2 z-50 overflow-hidden"
          >
            {/* Search Bar */}
            <div className="relative mb-2 px-1">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search orgs or workspaces..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-muted/40 border border-border/50 rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            {/* Organizations Section */}
            <div className="space-y-1 mb-3">
              <div className="flex items-center justify-between px-2 py-1">
                <span className="text-[10px] font-bold tracking-wider uppercase text-muted-foreground flex items-center gap-1">
                  <Building2 className="w-3 h-3" /> Organizations ({organizations.length})
                </span>
                {onOpenCreateOrg && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsOpen(false);
                      onOpenCreateOrg();
                    }}
                    className="text-[10px] font-medium text-primary hover:underline flex items-center gap-0.5"
                  >
                    <Plus className="w-2.5 h-2.5" /> New
                  </button>
                )}
              </div>
              {filteredOrgs.map((org) => {
                const isSelected = org.id === activeOrg?.id;
                return (
                  <button
                    key={org.id}
                    type="button"
                    onClick={() => {
                      setActiveOrg(org);
                      setIsOpen(false);
                    }}
                    className={cn(
                      'w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors',
                      isSelected
                        ? 'bg-primary/10 text-primary font-semibold'
                        : 'text-foreground hover:bg-muted/50'
                    )}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-5 h-5 rounded bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary flex-shrink-0">
                        {org.name[0]?.toUpperCase()}
                      </div>
                      <span className="truncate">{org.name}</span>
                    </div>
                    {isSelected && <Check className="w-3.5 h-3.5 text-primary flex-shrink-0" />}
                  </button>
                );
              })}
            </div>

            {/* Workspaces Section */}
            <div className="space-y-1 pt-2 border-t border-border">
              <div className="flex items-center justify-between px-2 py-1">
                <span className="text-[10px] font-bold tracking-wider uppercase text-muted-foreground flex items-center gap-1">
                  <FolderKanban className="w-3 h-3" /> Workspaces ({workspaces.length})
                </span>
                {onOpenCreateWorkspace && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsOpen(false);
                      onOpenCreateWorkspace();
                    }}
                    className="text-[10px] font-medium text-primary hover:underline flex items-center gap-0.5"
                  >
                    <Plus className="w-2.5 h-2.5" /> New
                  </button>
                )}
              </div>
              {filteredWorkspaces.length === 0 ? (
                <div className="px-2.5 py-2 text-center text-xs text-muted-foreground italic">
                  No workspaces found
                </div>
              ) : (
                filteredWorkspaces.map((ws) => {
                  const isSelected = ws.id === activeWorkspace?.id;
                  return (
                    <button
                      key={ws.id}
                      type="button"
                      onClick={() => {
                        setActiveWorkspace(ws);
                        setIsOpen(false);
                      }}
                      className={cn(
                        'w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors',
                        isSelected
                          ? 'bg-primary/10 text-primary font-semibold'
                          : 'text-foreground hover:bg-muted/50'
                      )}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <Sparkles className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                        <span className="truncate">{ws.name}</span>
                      </div>
                      {isSelected && <Check className="w-3.5 h-3.5 text-primary flex-shrink-0" />}
                    </button>
                  );
                })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
