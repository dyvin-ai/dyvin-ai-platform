import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ListTodo,
  Plus,
  Clock,
  CheckCircle2,
  AlertCircle,
  User,
  Loader2,
  Calendar,
} from "lucide-react";
import type { WorkforceTask, DigitalEmployee, AssignWorkforceTaskPayload } from "@/types";

interface TaskQueueTableProps {
  tasks: WorkforceTask[];
  employees: DigitalEmployee[];
  isLoading?: boolean;
  onAssignTask: (payload: AssignWorkforceTaskPayload) => Promise<void>;
  organizationId: string;
}

export function TaskQueueTable({
  tasks,
  employees,
  isLoading,
  onAssignTask,
  organizationId,
}: TaskQueueTableProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  const [assignedToId, setAssignedToId] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getStatusBadge = (status: string) => {
    switch (status?.toUpperCase()) {
      case "COMPLETED":
        return (
          <Badge variant="outline" className="border-emerald-500/40 bg-emerald-500/10 text-emerald-500 text-xs gap-1">
            <CheckCircle2 className="size-3" /> Completed
          </Badge>
        );
      case "IN_PROGRESS":
        return (
          <Badge variant="outline" className="border-blue-500/40 bg-blue-500/10 text-blue-500 text-xs gap-1">
            <Clock className="size-3" /> In Progress
          </Badge>
        );
      case "PENDING":
        return (
          <Badge variant="outline" className="border-amber-500/40 bg-amber-500/10 text-amber-500 text-xs gap-1">
            <Clock className="size-3" /> Pending
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="border-muted bg-muted/20 text-muted-foreground text-xs gap-1">
            <AlertCircle className="size-3" /> {status}
          </Badge>
        );
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) {
      setError("Please specify a task title.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      await onAssignTask({
        organizationId,
        taskTitle: taskTitle.trim(),
        assignedToId: assignedToId || undefined,
      });
      setTaskTitle("");
      setAssignedToId("");
      setModalOpen(false);
    } catch (err: any) {
      setError(err?.message || "Failed to create task.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getEmployeeName = (empId?: string | null) => {
    if (!empId) return "Unassigned (Auto-Queue)";
    const found = employees.find((e) => e.id === empId);
    return found ? found.employeeName : empId;
  };

  if (isLoading) {
    return (
      <Card className="border border-border/60 bg-surface-elevated/40">
        <CardHeader className="p-4 pb-2">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-3 w-64 mt-1" />
        </CardHeader>
        <CardContent className="p-4 pt-2 space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="border border-border/60 bg-surface-elevated/40">
        <CardHeader className="p-4 pb-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-md bg-amber-500/10 text-amber-500">
                <ListTodo className="size-4" />
              </div>
              <div>
                <CardTitle className="text-sm font-semibold text-foreground">
                  Autonomous Workforce Task Queue
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground">
                  Prioritized execution queue across AI Digital Employees
                </CardDescription>
              </div>
            </div>

            <Button
              size="sm"
              onClick={() => setModalOpen(true)}
              className="gap-1.5 text-xs h-8"
            >
              <Plus className="size-3.5" />
              Queue New Task
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-4 pt-2">
          {tasks.length === 0 ? (
            <div className="text-center py-8 text-xs text-muted-foreground">
              No tasks currently queued. Dispatch a priority task to your digital workers.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-border/60 text-muted-foreground uppercase text-[10px] tracking-wider">
                    <th className="py-2.5 px-3 font-medium">Task Title</th>
                    <th className="py-2.5 px-3 font-medium">Assigned Worker</th>
                    <th className="py-2.5 px-3 font-medium">Status</th>
                    <th className="py-2.5 px-3 font-medium text-right">Queued</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {tasks.map((task) => (
                    <tr key={task.id} className="hover:bg-surface-elevated/60 transition-colors">
                      <td className="py-3 px-3 font-medium text-foreground max-w-xs truncate">
                        {task.taskTitle}
                      </td>
                      <td className="py-3 px-3 text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <User className="size-3 text-primary" />
                          <span className="font-mono text-[11px] text-foreground/90">
                            {getEmployeeName(task.assignedToId)}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-3">{getStatusBadge(task.status)}</td>
                      <td className="py-3 px-3 text-right text-muted-foreground font-mono text-[11px]">
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="size-3" />
                          {task.createdAt ? new Date(task.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Just now"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Task Creation Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-[460px] bg-surface-elevated border border-border">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold text-foreground">
              Assign Autonomous Workforce Task
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Add a strategic task to the execution queue and delegate to an AI digital employee.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateTask} className="space-y-4 py-2">
            {error && (
              <div className="p-2.5 rounded-md bg-destructive/10 border border-destructive/20 text-destructive text-xs">
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="task-title" className="text-xs font-medium text-foreground">
                Task Description & Goal
              </Label>
              <Input
                id="task-title"
                placeholder="e.g. Audit Brand Accuracy across Perplexity & Copilot"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                disabled={isSubmitting}
                className="text-sm bg-surface-subtle"
                autoFocus
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="assignee" className="text-xs font-medium text-foreground">
                Assign To (Optional)
              </Label>
              <select
                id="assignee"
                value={assignedToId}
                onChange={(e) => setAssignedToId(e.target.value)}
                disabled={isSubmitting}
                className="w-full h-9 px-3 bg-surface-subtle border border-border text-xs rounded-md text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="">Auto-Assign (Based on availability & department)</option>
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.employeeName} ({emp.role} - {emp.availability})
                  </option>
                ))}
              </select>
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setModalOpen(false)}
                disabled={isSubmitting}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={isSubmitting || !taskTitle.trim()}
                className="text-xs gap-1.5"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="size-3.5 animate-spin" />
                    Enqueuing...
                  </>
                ) : (
                  <>
                    <Plus className="size-3.5" />
                    Dispatch Task
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
