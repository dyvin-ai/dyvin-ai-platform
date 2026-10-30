import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Building2, Users } from "lucide-react";
import type { WorkforceDepartment } from "@/types";

interface DepartmentDistributionBarProps {
  departments: WorkforceDepartment[];
  isLoading?: boolean;
}

export function DepartmentDistributionBar({ departments, isLoading }: DepartmentDistributionBarProps) {
  if (isLoading) {
    return (
      <Card className="border border-border/60 bg-surface-elevated/40">
        <CardHeader className="p-4 pb-2">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-3 w-64 mt-1" />
        </CardHeader>
        <CardContent className="p-4 pt-2 space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-1">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-12" />
              </div>
              <Skeleton className="h-2 w-full" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  const totalHeadcount = departments.reduce((acc, d) => acc + (d.headcount || 0), 0) || 1;

  return (
    <Card className="border border-border/60 bg-surface-elevated/40">
      <CardHeader className="p-4 pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-indigo-500/10 text-indigo-500">
              <Building2 className="size-4" />
            </div>
            <div>
              <CardTitle className="text-sm font-semibold text-foreground">
                Workforce Department Distribution
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Headcount allocation across autonomous business departments
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground font-mono">
            <Users className="size-3.5" />
            <span>{totalHeadcount} Total Assigned</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 pt-3 space-y-4">
        {departments.length === 0 ? (
          <div className="text-center py-6 text-xs text-muted-foreground">
            No department headcounts registered yet.
          </div>
        ) : (
          departments.map((dept) => {
            const pct = Math.round(((dept.headcount || 0) / totalHeadcount) * 100);
            return (
              <div key={dept.departmentName} className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-medium text-foreground">{dept.departmentName}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground font-mono">{dept.headcount} workers</span>
                    <span className="font-bold text-foreground text-[11px] w-8 text-right">{pct}%</span>
                  </div>
                </div>
                <Progress value={pct} className="h-2 bg-surface-subtle" />
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
