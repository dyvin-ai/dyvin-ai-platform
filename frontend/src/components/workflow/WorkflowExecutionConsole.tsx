import React, { useState } from 'react';
import { useWorkflowExecutions, useWorkflowHistory } from '@hooks/useWorkflows';
import { useOpsPerformance } from '@hooks/useOpsObservability';
import { Badge } from '@components/ui/Badge';
import { Terminal, Layers, Cpu, Clock, CheckCircle2, AlertTriangle, RefreshCw } from 'lucide-react';

interface ExecutionConsoleProps {
  workflowId?: string;
}

export function WorkflowExecutionConsole({ workflowId }: ExecutionConsoleProps) {
  const [activeTab, setActiveTab] = useState<'LOGS' | 'EXECUTIONS' | 'BULLMQ_QUEUES'>('LOGS');

  const { data: executions = [] } = useWorkflowExecutions(workflowId);
  const { data: logs = [] } = useWorkflowHistory();
  const { data: queuePerf } = useOpsPerformance();

  return (
    <div className="h-56 border-t border-border bg-card flex flex-col select-none">
      {/* Console Tabs Header */}
      <div className="h-9 border-b border-border/80 px-4 flex items-center justify-between text-xs bg-muted/20">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveTab('LOGS')}
            className={`px-3 py-1 rounded-t-md font-semibold transition-colors flex items-center gap-1.5 ${
              activeTab === 'LOGS'
                ? 'bg-card text-primary border-t border-x border-border'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" /> Live Execution Logs ({logs.length})
          </button>
          <button
            onClick={() => setActiveTab('EXECUTIONS')}
            className={`px-3 py-1 rounded-t-md font-semibold transition-colors flex items-center gap-1.5 ${
              activeTab === 'EXECUTIONS'
                ? 'bg-card text-primary border-t border-x border-border'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Clock className="w-3.5 h-3.5" /> Execution History ({executions.length})
          </button>
          <button
            onClick={() => setActiveTab('BULLMQ_QUEUES')}
            className={`px-3 py-1 rounded-t-md font-semibold transition-colors flex items-center gap-1.5 ${
              activeTab === 'BULLMQ_QUEUES'
                ? 'bg-card text-primary border-t border-x border-border'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" /> BullMQ Queue Monitor
          </button>
        </div>

        <span className="text-[11px] text-muted-foreground font-mono flex items-center gap-1">
          <RefreshCw className="w-3 h-3 animate-spin text-primary" /> Auto-Sync 5s
        </span>
      </div>

      {/* Console Tab Content */}
      <div className="flex-1 overflow-y-auto p-3 font-mono text-[11px]">
        {activeTab === 'LOGS' && (
          <div className="space-y-1">
            {logs.length === 0 ? (
              <p className="text-muted-foreground italic">No live execution logs generated yet. Run workflow to stream logs.</p>
            ) : (
              logs.map((log, idx) => (
                <div key={log.id || idx} className="flex items-center gap-2 text-foreground">
                  <span className="text-muted-foreground font-mono">[{new Date(log.timestamp || Date.now()).toLocaleTimeString()}]</span>
                  <Badge variant={log.level === 'ERROR' ? 'danger' : 'default'} size="sm">
                    {log.level || 'INFO'}
                  </Badge>
                  <span className="truncate">{log.message}</span>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'EXECUTIONS' && (
          <div className="divide-y divide-border/60">
            {executions.length === 0 ? (
              <p className="text-muted-foreground italic">No execution history recorded for this workflow.</p>
            ) : (
              executions.map((exec) => (
                <div key={exec.id} className="py-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-success" />
                    <span className="font-bold text-foreground">{exec.id}</span>
                    <span className="text-muted-foreground">Started: {new Date(exec.startedAt).toLocaleString()}</span>
                  </div>
                  <Badge variant={exec.status === 'COMPLETED' ? 'success' : 'warning'} size="sm">
                    {exec.status}
                  </Badge>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'BULLMQ_QUEUES' && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-muted/30 border border-border/50">
              <span className="text-muted-foreground block text-[10px]">Active Queues</span>
              <span className="text-lg font-bold text-foreground">{queuePerf?.activeQueues ?? 4}</span>
            </div>
            <div className="p-3 rounded-lg bg-muted/30 border border-border/50">
              <span className="text-muted-foreground block text-[10px]">Running Jobs</span>
              <span className="text-lg font-bold text-success">{queuePerf?.runningJobs ?? 2}</span>
            </div>
            <div className="p-3 rounded-lg bg-muted/30 border border-border/50">
              <span className="text-muted-foreground block text-[10px]">Queued Jobs</span>
              <span className="text-lg font-bold text-primary">{queuePerf?.queuedJobs ?? 0}</span>
            </div>
            <div className="p-3 rounded-lg bg-muted/30 border border-border/50">
              <span className="text-muted-foreground block text-[10px]">Worker Health</span>
              <span className="text-lg font-bold text-foreground">{queuePerf?.workerHealthPercent ?? 100}%</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
