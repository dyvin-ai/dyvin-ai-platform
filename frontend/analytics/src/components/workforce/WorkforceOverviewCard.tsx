import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Users2, Building2, ListTodo, TrendingUp, Clock, DollarSign } from "lucide-react";
import type { WorkforceOverviewTelemetry } from "@/types";

interface WorkforceOverviewCardProps {
  overview?: WorkforceOverviewTelemetry | null;
  isLoading?: boolean;
}

export function WorkforceOverviewCard({ overview, isLoading }: WorkforceOverviewCardProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="border border-border/60 bg-surface-elevated/40">
            <CardContent className="p-4 space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-3 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const kpis = [
    {
      label: "Digital Employees",
      value: overview?.activeDigitalEmployeesCount ?? 0,
      subtext: "Active across org",
      icon: Users2,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      label: "Departments",
      value: overview?.departmentsCount ?? 0,
      subtext: "Covered business units",
      icon: Building2,
      color: "text-indigo-500",
      bgColor: "bg-indigo-500/10",
    },
    {
      label: "Tasks in Queue",
      value: overview?.tasksInQueueCount ?? 0,
      subtext: "Autonomous priority backlog",
      icon: ListTodo,
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
    },
    {
      label: "Productivity Score",
      value: `${overview?.overallProductivityScore ?? 0}%`,
      subtext: "Execution velocity index",
      icon: TrendingUp,
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
    },
    {
      label: "Hours Saved",
      value: `${(overview?.monthlyHoursSaved ?? 0).toLocaleString()} hrs`,
      subtext: "Monthly automated effort",
      icon: Clock,
      color: "text-violet-500",
      bgColor: "bg-violet-500/10",
    },
    {
      label: "Cost Savings",
      value: `$${(overview?.monthlyCostSavedUsd ?? 0).toLocaleString()}`,
      subtext: "Monthly operational savings",
      icon: DollarSign,
      color: "text-cyan-500",
      bgColor: "bg-cyan-500/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
      {kpis.map((kpi, idx) => {
        const Icon = kpi.icon;
        return (
          <Card key={idx} className="border border-border/60 bg-surface-elevated/40 hover:border-border transition-all">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{kpi.label}</span>
                <div className={`p-1.5 rounded-md ${kpi.bgColor}`}>
                  <Icon className={`size-4 ${kpi.color}`} />
                </div>
              </div>
              <div className="mt-2 text-2xl font-bold tracking-tight text-foreground">{kpi.value}</div>
              <p className="mt-1 text-xs text-muted-foreground truncate">{kpi.subtext}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
