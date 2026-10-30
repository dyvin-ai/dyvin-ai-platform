import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  FileText,
  GraduationCap,
  Award,
  CheckCircle2,
  Clock,
  Circle,
  Share2,
  Sparkles,
  Calendar,
} from "lucide-react";
import type {
  CustomerSuccessPlanResponse,
  CustomerSuccessReportsData,
  CustomerAcademyProgress,
  CustomerAdvocacyStatus,
} from "@/types";

interface SuccessActionPlanConsoleProps {
  plan?: CustomerSuccessPlanResponse | null;
  reports?: CustomerSuccessReportsData | null;
  academy?: CustomerAcademyProgress | null;
  referrals?: CustomerAdvocacyStatus | null;
  isLoading?: boolean;
}

export function SuccessActionPlanConsole({
  plan,
  reports,
  academy,
  referrals,
  isLoading,
}: SuccessActionPlanConsoleProps) {
  if (isLoading) {
    return (
      <Card className="border border-border/60 bg-surface-elevated/40">
        <CardContent className="p-6 space-y-4">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </CardContent>
      </Card>
    );
  }

  const planTitle = plan?.planTitle ?? "30-Day Strategic Onboarding & Expansion Plan";
  const tasks = plan?.milestoneTasks ?? [
    { day: 7, task: "Connect Primary Web Domains & Run First Crawl", status: "COMPLETED" },
    { day: 14, task: "Configure Visual Workflow DAG for Citation Alerts", status: "IN_PROGRESS" },
    { day: 30, task: "Deploy AI Agent from Marketplace", status: "PENDING" },
  ];
  const qbrTitle = reports?.latestQBRReport?.title ?? "Q3 Executive Customer Success Summary";
  const qbrStatus = reports?.latestQBRReport?.status ?? "AVAILABLE";
  const coursesCompleted = academy?.coursesCompleted ?? 4;
  const certifications = academy?.certificationsEarned ?? ["Dyvin AI Certified Administrator"];
  const advocacyTier = referrals?.advocacyTier ?? "GOLD_CHAMPION";
  const activeReferrals = referrals?.activeReferralsCount ?? 2;

  const getTaskStatusIcon = (status: string) => {
    switch (status.toUpperCase()) {
      case "COMPLETED":
        return <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />;
      case "IN_PROGRESS":
        return <Clock className="w-4 h-4 text-amber-400 shrink-0 animate-pulse" />;
      default:
        return <Circle className="w-4 h-4 text-muted-foreground shrink-0" />;
    }
  };

  const getTaskStatusBadge = (status: string) => {
    switch (status.toUpperCase()) {
      case "COMPLETED":
        return <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px]">COMPLETED</Badge>;
      case "IN_PROGRESS":
        return <Badge className="bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px]">IN PROGRESS</Badge>;
      default:
        return <Badge variant="outline" className="text-[10px] text-muted-foreground border-border/60">PENDING</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* 30-Day Plan Action Card */}
      <Card className="border border-border/60 bg-surface-elevated/40 shadow-xs">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Calendar className="w-4 h-4 text-purple-400" />
                {planTitle}
              </CardTitle>
              <CardDescription className="text-xs mt-0.5">
                Target milestones and critical integration deadlines for account maturity.
              </CardDescription>
            </div>
            <Badge variant="outline" className="text-xs border-purple-500/30 text-purple-400 font-mono">
              30-DAY HORIZON
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {tasks.map((task, i) => (
              <div
                key={i}
                className="p-3 rounded-xl border border-border/60 bg-surface-elevated/60 flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  {getTaskStatusIcon(task.status)}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-semibold text-muted-foreground">
                        Day {task.day}:
                      </span>
                      <span className="text-xs font-medium text-foreground">
                        {task.task}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  {getTaskStatusBadge(task.status)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 3 Sub-consoles: Reports, Academy, Advocacy */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Sub-console 1: QBR Reports */}
        <Card className="border border-border/60 bg-surface-elevated/50 shadow-xs">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-400" />
              Executive QBR Report
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="p-3 rounded-lg border border-border/60 bg-surface-elevated/60 space-y-1">
              <div className="text-xs font-semibold text-foreground truncate">
                {qbrTitle}
              </div>
              <div className="flex items-center justify-between pt-1">
                <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px]">
                  {qbrStatus}
                </Badge>
                <span className="text-[10px] text-muted-foreground">PDF / JSON</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sub-console 2: Academy Certification */}
        <Card className="border border-border/60 bg-surface-elevated/50 shadow-xs">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-emerald-400" />
              Dyvin Academy Training
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="p-3 rounded-lg border border-border/60 bg-surface-elevated/60 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Courses Completed</span>
                <span className="font-mono font-bold text-foreground">{coursesCompleted}</span>
              </div>
              <div className="pt-1">
                <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 text-[10px] truncate max-w-full">
                  <Award className="w-3 h-3 mr-1 shrink-0" />
                  {certifications[0]}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sub-console 3: Customer Advocacy */}
        <Card className="border border-border/60 bg-surface-elevated/50 shadow-xs">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold flex items-center gap-2">
              <Share2 className="w-4 h-4 text-purple-400" />
              Customer Advocacy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="p-3 rounded-lg border border-border/60 bg-surface-elevated/60 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Advocacy Tier</span>
                <Badge className="bg-purple-500/10 text-purple-400 border border-purple-500/20 text-[10px] font-mono">
                  {advocacyTier}
                </Badge>
              </div>
              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-muted-foreground">Active Referrals</span>
                <span className="font-mono font-bold text-foreground">{activeReferrals} Organizations</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
