import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { CalendarClock, Shield, Activity, User } from "lucide-react";
import type { WorkforceScheduleItem, DigitalEmployee } from "@/types";

interface ShiftSchedulingViewProps {
  schedules: WorkforceScheduleItem[];
  employees: DigitalEmployee[];
  isLoading?: boolean;
}

export function ShiftSchedulingView({
  schedules,
  employees,
  isLoading,
}: ShiftSchedulingViewProps) {
  if (isLoading) {
    return (
      <Card className="border border-border/60 bg-surface-elevated/40">
        <CardHeader className="p-4 pb-2">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-3 w-64 mt-1" />
        </CardHeader>
        <CardContent className="p-4 pt-2 space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  const getEmployeeName = (empId?: string) => {
    if (!empId) return "Unassigned Worker";
    const found = employees.find((e) => e.id === empId);
    return found ? found.employeeName : empId;
  };

  return (
    <Card className="border border-border/60 bg-surface-elevated/40">
      <CardHeader className="p-4 pb-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-blue-500/10 text-blue-500">
              <CalendarClock className="size-4" />
            </div>
            <div>
              <CardTitle className="text-sm font-semibold text-foreground">
                24/7 Autonomous Shift Scheduling
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Continuous round-the-clock shift assignments and availability coverage
              </CardDescription>
            </div>
          </div>
          <Badge variant="outline" className="border-blue-500/40 bg-blue-500/10 text-blue-500 text-xs gap-1 w-fit">
            <Shield className="size-3" /> 100% Uptime Rota
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-4 pt-2">
        {schedules.length === 0 ? (
          <div className="text-center py-6 text-xs text-muted-foreground">
            No active shift schedules registered. Digital employees are operating in on-demand mode.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {schedules.map((sched) => (
              <div
                key={sched.id}
                className="p-3 rounded-lg border border-border/50 bg-surface-subtle/50 flex flex-col justify-between gap-2"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <User className="size-4 text-primary" />
                    <div>
                      <div className="text-xs font-semibold text-foreground">
                        {getEmployeeName(sched.employeeId)}
                      </div>
                      <div className="text-[11px] text-muted-foreground font-mono">
                        {sched.shiftName === "24_7_CONTINUOUS" ? "24/7 Continuous Shift" : sched.shiftName}
                      </div>
                    </div>
                  </div>
                  <Badge variant="outline" className="border-emerald-500/40 bg-emerald-500/10 text-emerald-500 text-[10px] gap-1">
                    <Activity className="size-2.5" /> {sched.status}
                  </Badge>
                </div>

                <div className="text-[10px] text-muted-foreground flex justify-between items-center pt-2 border-t border-border/40">
                  <span>Coverage: Global POPs</span>
                  <span className="font-mono">Active</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
