import React, { useState, useEffect } from 'react';
import { useOrgStore } from '@stores/orgStore';
import { useWorkflowStore } from '@stores/workflowStore';
import {
  useWorkflows,
  useWorkflowDetail,
  useCreateWorkflow,
  useRunWorkflow,
  usePauseWorkflow,
  useResumeWorkflow,
} from '@hooks/useWorkflows';
import { WorkflowHeader } from '@components/workflow/WorkflowHeader';
import { WorkflowNodePalette } from '@components/workflow/WorkflowNodePalette';
import { WorkflowCanvas } from '@components/workflow/WorkflowCanvas';
import { WorkflowNodeInspector } from '@components/workflow/WorkflowNodeInspector';
import { WorkflowExecutionConsole } from '@components/workflow/WorkflowExecutionConsole';
import { WorkflowTemplatesModal } from '@components/modals/WorkflowTemplatesModal';
import { PageLoader } from '@components/feedback/PageLoader';
import { Button } from '@components/ui/Button';
import { WorkflowNodeType, WorkflowExecutionMode } from '@app-types/workflow.types';
import { Plus, Layout } from 'lucide-react';

export default function WorkflowStudioPage() {
  const { activeOrg } = useOrgStore();
  const orgId = activeOrg?.id || 'org-default';

  const { activeWorkflow, setActiveWorkflow, addNode } = useWorkflowStore();
  const [isTemplatesOpen, setIsTemplatesOpen] = useState(false);

  const { data: workflows = [], isLoading } = useWorkflows(orgId);
  const { mutateAsync: createWorkflow, isPending: isCreating } = useCreateWorkflow();
  const { mutateAsync: runWorkflow, isPending: isRunning } = useRunWorkflow();
  const { mutateAsync: pauseWorkflow } = usePauseWorkflow();
  const { mutateAsync: resumeWorkflow } = useResumeWorkflow();

  // Load first workflow or set default active workflow
  useEffect(() => {
    if (workflows.length > 0 && !activeWorkflow) {
      setActiveWorkflow(workflows[0]);
    } else if (workflows.length === 0 && !activeWorkflow) {
      setActiveWorkflow({
        id: 'wf-demo-1',
        organizationId: orgId,
        name: 'AI Search & Citation Scan Workflow',
        description: 'Automated AI search visibility scan and schema markup generator',
        status: 'DRAFT' as any,
        mode: WorkflowExecutionMode.SEQUENTIAL,
        nodes: [
          { id: 'n-1', label: 'Website Added Trigger', nodeType: WorkflowNodeType.TRIGGER, positionX: 100, positionY: 150 },
          { id: 'n-2', label: 'Run AI Search Scan', nodeType: WorkflowNodeType.SEARCH, positionX: 350, positionY: 150 },
          { id: 'n-3', label: 'Generate Schema Markup', nodeType: WorkflowNodeType.GENERATION, positionX: 600, positionY: 150 },
          { id: 'n-4', label: 'Verify Compliance', nodeType: WorkflowNodeType.VERIFICATION, positionX: 850, positionY: 150 },
        ],
        edges: [
          { id: 'e-1', sourceNodeId: 'n-1', targetNodeId: 'n-2' },
          { id: 'e-2', sourceNodeId: 'n-2', targetNodeId: 'n-3' },
          { id: 'e-3', sourceNodeId: 'n-3', targetNodeId: 'n-4' },
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
  }, [workflows, activeWorkflow, orgId, setActiveWorkflow]);

  const handleCreateNewWorkflow = async () => {
    const newWf = await createWorkflow({
      organizationId: orgId,
      name: `New AI Automation Workflow ${workflows.length + 1}`,
      description: 'Visual AI orchestration workflow',
      mode: WorkflowExecutionMode.SEQUENTIAL,
    });
    setActiveWorkflow(newWf);
  };

  const handleRun = async () => {
    if (activeWorkflow?.id) {
      await runWorkflow(activeWorkflow.id);
    }
  };

  const handlePause = async () => {
    if (activeWorkflow?.id) {
      await pauseWorkflow(activeWorkflow.id);
    }
  };

  const handleSave = () => {
    // Canvas state is automatically tracked in Zustand
  };

  if (isLoading) {
    return <PageLoader message="Loading Enterprise Workflow Studio..." />;
  }

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col -m-6 overflow-hidden">
      {/* Studio Toolbar */}
      <WorkflowHeader
        workflow={activeWorkflow}
        onRun={handleRun}
        onPause={handlePause}
        onSave={handleSave}
        onOpenTemplates={() => setIsTemplatesOpen(true)}
        isRunning={isRunning}
      />

      {/* Main Studio Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Node Palette */}
        <WorkflowNodePalette />

        {/* Center Visual Canvas */}
        <WorkflowCanvas />

        {/* Right Node Inspector Drawer */}
        <WorkflowNodeInspector />
      </div>

      {/* Resizable Bottom Execution Console & BullMQ Monitor */}
      <WorkflowExecutionConsole workflowId={activeWorkflow?.id} />

      {/* Templates Modal */}
      <WorkflowTemplatesModal
        isOpen={isTemplatesOpen}
        onClose={() => setIsTemplatesOpen(false)}
        onSelectTemplate={(tmpl) => {
          if (activeWorkflow) {
            setActiveWorkflow({
              ...activeWorkflow,
              name: tmpl.title,
              description: tmpl.description,
            });
          }
        }}
      />
    </div>
  );
}