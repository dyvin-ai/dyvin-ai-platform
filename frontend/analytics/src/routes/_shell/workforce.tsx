import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useWorkspace } from "@/context/WorkspaceContext";
import {
  WorkforceOverviewCard,
  DigitalEmployeeGrid,
  HireEmployeeModal,
  DepartmentDistributionBar,
  TaskQueueTable,
  PerformanceAnalyticsPanel,
  ShiftSchedulingView,
} from "@/components/workforce";
import { workforceService } from "@/services";
import { Users2, RefreshCw, Plus, Sparkles, Building2, ListTodo, Award, CalendarClock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import type {
  AssignWorkforceTaskPayload,
  DigitalEmployee,
  HireDigitalEmployeePayload,
} from "@/types";

export const Route = createFileRoute("/_shell/workforce")({
  head: () => ({
    meta: [
      { title: "Dyvin AI | Enterprise Autonomous AI Workforce Platform" },
      {
        name: "description",
        content:
          "Autonomous AI Digital Employees, multi-department workforce orchestration, 24/7 continuous shifts, and SOP training playbooks.",
      },
      {
        property: "og:title",
        content: "Dyvin AI | Enterprise Autonomous AI Workforce Platform",
      },
      {
        property: "og:description",
        content:
          "Autonomous AI Digital Employees, multi-department workforce orchestration, 24/7 continuous shifts, and SOP training playbooks.",
      },
    ],
  }),
  component: WorkforcePlatformPage,
});

function WorkforcePlatformPage() {
  const queryClient = useQueryClient();
  const { activeOrganization, isDemo } = useWorkspace();
  const activeOrgId = activeOrganization?.id || (isDemo ? "org-default" : "org-default");

  const [hireModalOpen, setHireModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("employees");

  // 1. Workforce Overview Telemetry
  const {
    data: overview,
    isLoading: isLoadingOverview,
    refetch: refetchOverview,
    isFetching: isFetchingOverview,
  } = useQuery({
    queryKey: ["workforce-overview"],
    queryFn: () => workforceService.getDashboard(),
    staleTime: 30_000,
  });

  // 2. Digital Employees Roster
  const {
    data: employees = [],
    isLoading: isLoadingEmployees,
    refetch: refetchEmployees,
    isFetching: isFetchingEmployees,
  } = useQuery({
    queryKey: ["workforce-employees", activeOrgId],
    queryFn: () => workforceService.getEmployees(activeOrgId),
    staleTime: 30_000,
  });

  // 3. Departments Headcount
  const {
    data: departments = [],
    isLoading: isLoadingDepartments,
    refetch: refetchDepartments,
  } = useQuery({
    queryKey: ["workforce-departments"],
    queryFn: () => workforceService.getDepartments(),
    staleTime: 60_000,
  });

  // 4. Tasks Queue
  const {
    data: tasks = [],
    isLoading: isLoadingTasks,
    refetch: refetchTasks,
  } = useQuery({
    queryKey: ["workforce-tasks", activeOrgId],
    queryFn: () => workforceService.getTasks(activeOrgId),
    staleTime: 20_000,
  });

  // 5. Performance Telemetry
  const {
    data: performance,
    isLoading: isLoadingPerformance,
    refetch: refetchPerformance,
  } = useQuery({
    queryKey: ["workforce-performance"],
    queryFn: () => workforceService.getPerformance(),
    staleTime: 60_000,
  });

  // 6. Training Telemetry
  const {
    data: training,
    isLoading: isLoadingTraining,
    refetch: refetchTraining,
  } = useQuery({
    queryKey: ["workforce-training"],
    queryFn: () => workforceService.getTraining(),
    staleTime: 60_000,
  });

  // 7. Scheduling Telemetry
  const {
    data: schedules = [],
    isLoading: isLoadingSchedules,
    refetch: refetchSchedules,
  } = useQuery({
    queryKey: ["workforce-schedules"],
    queryFn: () => workforceService.getSchedules(),
    staleTime: 60_000,
  });

  // Mutations
  const hireMutation = useMutation({
    mutationFn: (payload: HireDigitalEmployeePayload) =>
      workforceService.hireEmployee(payload),
    onSuccess: (newEmployee) => {
      queryClient.invalidateQueries({ queryKey: ["workforce-employees"] });
      queryClient.invalidateQueries({ queryKey: ["workforce-overview"] });
      queryClient.invalidateQueries({ queryKey: ["workforce-departments"] });
      toast.success("AI Digital Employee Onboarded", {
        description: `Successfully deployed ${newEmployee.employeeName} to ${newEmployee.department}.`,
      });
    },
    onError: (err: any) => {
      toast.error("Failed to Deploy Employee", {
        description: err?.message || "An unexpected error occurred during onboarding.",
      });
    },
  });

  const assignTaskMutation = useMutation({
    mutationFn: (payload: AssignWorkforceTaskPayload) =>
      workforceService.assignTask(payload),
    onSuccess: (newTask) => {
      queryClient.invalidateQueries({ queryKey: ["workforce-tasks"] });
      queryClient.invalidateQueries({ queryKey: ["workforce-overview"] });
      toast.success("Workforce Task Dispatched", {
        description: `Task "${newTask.taskTitle}" added to the autonomous queue.`,
      });
    },
    onError: (err: any) => {
      toast.error("Task Dispatch Failed", {
        description: err?.message || "An error occurred while creating the task.",
      });
    },
  });

  const isRefreshing = isFetchingOverview || isFetchingEmployees;

  const handleRefreshAll = () => {
    refetchOverview();
    refetchEmployees();
    refetchDepartments();
    refetchTasks();
    refetchPerformance();
    refetchTraining();
    refetchSchedules();
    toast.info("Refreshed Workforce Telemetry", {
      description: "Retrieved latest employee status, shift logs, and priority tasks.",
    });
  };

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6 max-w-7xl mx-auto">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
              <Users2 className="size-6" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
                Autonomous AI Workforce Platform
                <Badge variant="secondary" className="text-xs bg-blue-500/10 text-blue-500 border-blue-500/20 font-normal">
                  Phase F17
                </Badge>
              </h1>
              <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
                Digital Employee management, continuous 24/7 shift operations, and autonomous multi-department delegation.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefreshAll}
            disabled={isRefreshing}
            className="text-xs gap-1.5 h-9"
          >
            <RefreshCw className={`size-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh Roster
          </Button>

          <Button
            size="sm"
            onClick={() => setHireModalOpen(true)}
            className="text-xs gap-1.5 h-9 shadow-sm"
          >
            <Plus className="size-3.5" />
            Hire Digital Employee
          </Button>
        </div>
      </div>

      {/* Workforce Executive KPI Overview */}
      <WorkforceOverviewCard overview={overview} isLoading={isLoadingOverview} />

      {/* Main Tabs Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="bg-surface-elevated/70 border border-border/60 p-1">
          <TabsTrigger value="employees" className="gap-1.5 text-xs">
            <Users2 className="size-3.5" />
            Digital Employees ({employees.length})
          </TabsTrigger>
          <TabsTrigger value="tasks" className="gap-1.5 text-xs">
            <ListTodo className="size-3.5" />
            Task Queue ({tasks.length})
          </TabsTrigger>
          <TabsTrigger value="departments" className="gap-1.5 text-xs">
            <Building2 className="size-3.5" />
            Departments & Headcount
          </TabsTrigger>
          <TabsTrigger value="performance" className="gap-1.5 text-xs">
            <Award className="size-3.5" />
            Performance & Training
          </TabsTrigger>
          <TabsTrigger value="scheduling" className="gap-1.5 text-xs">
            <CalendarClock className="size-3.5" />
            24/7 Shifts
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Digital Employees */}
        <TabsContent value="employees" className="space-y-4">
          <DigitalEmployeeGrid
            employees={employees}
            isLoading={isLoadingEmployees}
            onOpenHireModal={() => setHireModalOpen(true)}
            onAssignTask={() => setActiveTab("tasks")}
          />
        </TabsContent>

        {/* Tab 2: Task Queue */}
        <TabsContent value="tasks" className="space-y-4">
          <TaskQueueTable
            tasks={tasks}
            employees={employees}
            isLoading={isLoadingTasks}
            onAssignTask={async (payload) => {
              await assignTaskMutation.mutateAsync(payload);
            }}
            organizationId={activeOrgId}
          />
        </TabsContent>

        {/* Tab 3: Departments Distribution */}
        <TabsContent value="departments" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <DepartmentDistributionBar
                departments={departments}
                isLoading={isLoadingDepartments}
              />
            </div>
            <div>
              <div className="p-4 rounded-lg border border-border/60 bg-surface-elevated/40 space-y-3 text-xs">
                <div className="flex items-center gap-2 font-semibold text-foreground">
                  <Sparkles className="size-4 text-primary" />
                  Autonomous Department Coverage
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  Dyvin AI partitions autonomous work across specialized domains to ensure contextual accuracy and zero cross-department hallucinations.
                </p>
                <div className="pt-2 border-t border-border/40 space-y-1.5">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Active Domain Models:</span>
                    <span className="font-mono text-foreground font-semibold">11 Specialized</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Autonomous Handoffs:</span>
                    <span className="font-mono text-emerald-500 font-semibold">Enabled</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Cross-Verification Gate:</span>
                    <span className="font-mono text-foreground font-semibold">Active</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Tab 4: Performance & Training */}
        <TabsContent value="performance" className="space-y-4">
          <PerformanceAnalyticsPanel
            performance={performance}
            training={training}
            isLoading={isLoadingPerformance || isLoadingTraining}
          />
        </TabsContent>

        {/* Tab 5: 24/7 Continuous Shift Scheduling */}
        <TabsContent value="scheduling" className="space-y-4">
          <ShiftSchedulingView
            schedules={schedules}
            employees={employees}
            isLoading={isLoadingSchedules}
          />
        </TabsContent>
      </Tabs>

      {/* Hire Employee Modal */}
      <HireEmployeeModal
        open={hireModalOpen}
        onOpenChange={setHireModalOpen}
        onSubmit={async (payload) => {
          await hireMutation.mutateAsync(payload);
        }}
        organizationId={activeOrgId}
      />
    </div>
  );
}
