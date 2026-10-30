import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, Search, Plus, Sparkles, Briefcase, Calendar, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import type { DigitalEmployee } from "@/types";

interface DigitalEmployeeGridProps {
  employees: DigitalEmployee[];
  isLoading?: boolean;
  onOpenHireModal: () => void;
  onAssignTask?: (employee: DigitalEmployee) => void;
}

export function DigitalEmployeeGrid({
  employees,
  isLoading,
  onOpenHireModal,
  onAssignTask,
}: DigitalEmployeeGridProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDept, setSelectedDept] = useState<string>("ALL");

  const departments = useMemo(() => {
    const set = new Set<string>();
    employees.forEach((e) => {
      if (e.department) set.add(e.department);
    });
    return ["ALL", ...Array.from(set)];
  }, [employees]);

  const filteredEmployees = useMemo(() => {
    return employees.filter((e) => {
      const matchSearch =
        e.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (e.department && e.department.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchDept = selectedDept === "ALL" || e.department === selectedDept;

      return matchSearch && matchDept;
    });
  }, [employees, searchQuery, selectedDept]);

  const getStatusBadge = (status: string) => {
    switch (status?.toUpperCase()) {
      case "AVAILABLE":
        return (
          <Badge variant="outline" className="border-emerald-500/40 bg-emerald-500/10 text-emerald-500 text-xs gap-1">
            <CheckCircle2 className="size-3" /> Available
          </Badge>
        );
      case "BUSY":
        return (
          <Badge variant="outline" className="border-amber-500/40 bg-amber-500/10 text-amber-500 text-xs gap-1">
            <Clock className="size-3" /> Busy
          </Badge>
        );
      case "TRAINING":
        return (
          <Badge variant="outline" className="border-blue-500/40 bg-blue-500/10 text-blue-500 text-xs gap-1">
            <Sparkles className="size-3" /> Training
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="border-muted bg-muted/20 text-muted-foreground text-xs gap-1">
            <AlertCircle className="size-3" /> {status || "Offline"}
          </Badge>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-9 w-64" />
          <Skeleton className="h-9 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="border border-border/60 bg-surface-elevated/40">
              <CardContent className="p-5 space-y-4">
                <div className="flex justify-between items-start">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <Skeleton className="h-5 w-20" />
                </div>
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-8 w-full mt-4" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header and Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
        <div className="flex flex-1 items-center gap-2 max-w-md w-full">
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
            <Input
              placeholder="Search digital employees by name, role or dept..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 bg-surface-elevated/50 text-sm"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {departments.length > 2 && (
            <select
              aria-label="Filter by department"
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="h-9 px-3 py-1 bg-surface-elevated/80 border border-border text-xs rounded-md text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            >
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept === "ALL" ? "All Departments" : dept}
                </option>
              ))}
            </select>
          )}

          <Button onClick={onOpenHireModal} className="gap-1.5 text-xs h-9">
            <Plus className="size-3.5" />
            Hire Digital Employee
          </Button>
        </div>
      </div>

      {/* Grid or Empty State */}
      {filteredEmployees.length === 0 ? (
        <Card className="border-dashed border-2 border-border/80 bg-surface-subtle/30 text-center py-12">
          <CardContent className="space-y-4 max-w-md mx-auto">
            <div className="size-12 rounded-full bg-primary/10 text-primary mx-auto flex items-center justify-center">
              <Users className="size-6" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-foreground">No Digital Employees Found</h3>
              <p className="text-xs text-muted-foreground mt-1">
                {searchQuery || selectedDept !== "ALL"
                  ? "No autonomous workers match your search filters. Try clearing filters or deploy a new employee."
                  : "No AI digital workers deployed yet in this organization. Onboard specialized autonomous employees to automate marketing, SEO, and operations."}
              </p>
            </div>
            <Button onClick={onOpenHireModal} className="gap-1.5 text-xs mx-auto">
              <Plus className="size-3.5" /> Deploy First AI Employee
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEmployees.map((emp) => {
            const initials = emp.employeeName
              .split(" ")
              .map((w) => w[0])
              .join("")
              .slice(0, 2)
              .toUpperCase();

            return (
              <Card
                key={emp.id}
                className="border border-border/60 bg-surface-elevated/40 hover:border-border transition-all flex flex-col justify-between"
              >
                <CardHeader className="p-4 pb-2">
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-full bg-primary/10 border border-primary/20 text-primary font-bold text-xs flex items-center justify-center">
                        {initials}
                      </div>
                      <div>
                        <CardTitle className="text-sm font-semibold text-foreground leading-tight">
                          {emp.employeeName}
                        </CardTitle>
                        <CardDescription className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                          <Briefcase className="size-3" /> {emp.role}
                        </CardDescription>
                      </div>
                    </div>
                    {getStatusBadge(emp.availability)}
                  </div>
                </CardHeader>

                <CardContent className="p-4 pt-2 space-y-3">
                  <div className="flex items-center justify-between text-xs pt-2 border-t border-border/40">
                    <span className="text-muted-foreground">Department:</span>
                    <Badge variant="secondary" className="text-[11px] font-normal">
                      {emp.department || "General"}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Calendar className="size-3" /> Deployed:
                    </span>
                    <span className="text-foreground/80 font-mono text-[11px]">
                      {emp.createdAt ? new Date(emp.createdAt).toLocaleDateString() : "Just now"}
                    </span>
                  </div>

                  {onAssignTask && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onAssignTask(emp)}
                      className="w-full text-xs h-8 mt-2 border-border/80 hover:bg-surface-elevated"
                    >
                      Assign Priority Task
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
