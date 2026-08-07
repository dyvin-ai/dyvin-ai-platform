import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@components/ui/Dialog';
import { Button } from '@components/ui/Button';
import { Badge } from '@components/ui/Badge';
import { useWorkflowTemplates } from '@hooks/useWorkflows';
import { LayoutGrid, Sparkles, Copy } from 'lucide-react';
import type { WorkflowTemplateItem } from '@app-types/workflow.types';

interface WorkflowTemplatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (template: WorkflowTemplateItem) => void;
}

export function WorkflowTemplatesModal({
  isOpen,
  onClose,
  onSelectTemplate,
}: WorkflowTemplatesModalProps) {
  const { data: templates = [], isLoading } = useWorkflowTemplates();

  const DEFAULT_TEMPLATES: WorkflowTemplateItem[] = [
    {
      id: 'tmpl-ai-search-audit',
      title: 'Automated AI Search & GEO Visibility Audit',
      category: 'AI Intelligence',
      description: 'Scans Perplexity, ChatGPT, Gemini, and Claude for brand mentions, calculates weighted score, and generates auto-fix JSON-LD.',
      nodesCount: 5,
      recommendedFor: 'Enterprise Marketing & SEO',
      configData: {},
    },
    {
      id: 'tmpl-schema-auto-fix',
      title: 'Automatic Schema Markup & CMS Sync',
      category: 'Automation',
      description: 'Detects broken or missing schema markup on websites and auto-publishes updated JSON-LD to Webflow/WordPress via API.',
      nodesCount: 4,
      recommendedFor: 'Content Operations',
      configData: {},
    },
    {
      id: 'tmpl-slack-alert-pipeline',
      title: 'Real-time AI Visibility Anomaly Alert Pipeline',
      category: 'Monitoring',
      description: 'Monitors daily visibility score snapshots and triggers Slack/Teams notifications if visibility drops below 70.',
      nodesCount: 3,
      recommendedFor: 'DevOps & Growth',
      configData: {},
    },
  ];

  const displayTemplates = templates.length > 0 ? templates : DEFAULT_TEMPLATES;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl bg-card border border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground">
            <LayoutGrid className="w-5 h-5 text-primary" /> Reusable Workflow Template Catalog
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 text-xs max-h-[60vh] overflow-y-auto p-1">
          {isLoading ? (
            <p className="text-center py-6 text-muted-foreground">Loading templates catalog...</p>
          ) : (
            displayTemplates.map((tmpl) => (
              <div
                key={tmpl.id}
                className="p-4 rounded-xl border border-border bg-muted/20 hover:border-primary/50 transition-all space-y-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="default" size="sm">
                      {tmpl.category}
                    </Badge>
                    <h4 className="font-bold text-foreground text-sm">{tmpl.title}</h4>
                  </div>
                  <p className="text-muted-foreground">{tmpl.description}</p>
                  <span className="text-[11px] text-muted-foreground block font-mono">
                    Recommended for: {tmpl.recommendedFor} • {tmpl.nodesCount} Nodes
                  </span>
                </div>

                <Button
                  size="sm"
                  onClick={() => {
                    onSelectTemplate(tmpl);
                    onClose();
                  }}
                  leftIcon={<Copy className="w-3.5 h-3.5" />}
                >
                  Use Template
                </Button>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
