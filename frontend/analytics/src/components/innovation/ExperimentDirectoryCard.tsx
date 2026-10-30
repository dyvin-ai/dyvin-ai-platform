import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  FlaskConical,
  Search,
  Plus,
  Play,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Sparkles,
  Users,
  Shield,
  Layers,
} from "lucide-react";
import type { InnovationExperimentItem } from "@/types";

interface ExperimentDirectoryCardProps {
  experiments: InnovationExperimentItem[];
  onOpenCreateModal: () => void;
  isLoading?: boolean;
}

export function ExperimentDirectoryCard({
  experiments,
  onOpenCreateModal,
  isLoading,
}: ExperimentDirectoryCardProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [simulatingExperimentId, setSimulatingExperimentId] = useState<string | null>(null);

  const statuses = ["ALL", "SANDBOX_TESTING", "EVALUATING", "READY_FOR_STAGING"];

  const filteredExperiments = experiments.filter((e) => {
    const matchesStatus = statusFilter === "ALL" || e.status === statusFilter;
    const matchesSearch =
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.owner.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleSimulateRun = (id: string) => {
    setSimulatingExperimentId(id);
    setTimeout(() => {
      setSimulatingExperimentId(null);
    }, 1200);
  };

  const getRiskBadge = (risk: string) => {
    switch (risk?.toUpperCase()) {
      case "HIGH":
        return <Badge variant="outline" className="border-red-500/30 text-red-400 bg-red-500/10 text-[10px]">High Risk</Badge>;
      case "MEDIUM":
        return <Badge variant="outline" className="border-amber-500/30 text-amber-400 bg-amber-500/10 text-[10px]">Medium Risk</Badge>;
      case "LOW":
      default:
        return <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 bg-emerald-500/10 text-[10px]">Low Risk</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "READY_FOR_STAGING":
        return <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs">Ready for Staging</Badge>;
      case "EVALUATING":
        return <Badge variant="secondary" className="bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs">Evaluating</Badge>;
      case "SANDBOX_TESTING":
      default:
        return <Badge variant="secondary" className="bg-primary/10 text-primary border border-primary/20 text-xs">Sandbox Testing</Badge>;
    }
  };

  if (isLoading) {
    return (
      <Card className="border border-border/60 bg-surface-elevated/40">
        <CardContent className="p-6 space-y-4">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-32 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-border/60 bg-surface-card shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <FlaskConical className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg font-semibold text-foreground">
                Sandboxed AI Experiment Registry
              </CardTitle>
            </div>
            <CardDescription className="text-xs text-foreground-muted mt-1">
              Active research experiments, risk boundaries, owner attributions, and lifecycle milestones
            </CardDescription>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-border/80 text-foreground-muted bg-surface-elevated text-xs font-mono">
              {filteredExperiments.length} of {experiments.length} Experiments
            </Badge>
            <Button
              size="sm"
              onClick={onOpenCreateModal}
              className="gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90 text-xs h-8"
            >
              <Plus className="h-3.5 w-3.5" />
              New Experiment
            </Button>
          </div>
        </div>

        {/* Filter and Search */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-4">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-foreground-muted" />
            <Input
              placeholder="Search experiments or team..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9 text-xs bg-surface-elevated/50 border-border/60"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
            {statuses.map((st) => (
              <Button
                key={st}
                size="sm"
                variant={statusFilter === st ? "default" : "outline"}
                onClick={() => setStatusFilter(st)}
                className={`h-8 text-xs px-2.5 rounded-md ${
                  statusFilter === st
                    ? "bg-primary text-primary-foreground font-semibold"
                    : "border-border/60 hover:bg-surface-elevated text-foreground-muted"
                }`}
              >
                {st === "ALL" ? "ALL" : st.replace(/_/g, " ")}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {filteredExperiments.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-border/60 rounded-lg">
            <FlaskConical className="h-8 w-8 text-foreground-muted mx-auto mb-2 opacity-50" />
            <p className="text-sm font-medium text-foreground">No experiments found</p>
            <p className="text-xs text-foreground-muted mt-1">
              Try adjusting your search criteria or register a new experiment.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredExperiments.map((exp) => {
              const isSimulating = simulatingExperimentId === exp.id;
              const formattedDate = exp.createdAt
                ? new Date(exp.createdAt).toLocaleDateString()
                : "Active";

              return (
                <div
                  key={exp.id || exp.title}
                  className="p-4 rounded-lg border border-border/60 bg-surface-elevated/40 hover:border-primary/40 transition-colors flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        {getStatusBadge(exp.status)}
                        {getRiskBadge(exp.riskLevel)}
                      </div>
                      <span className="text-[11px] text-foreground-muted font-mono">
                        {formattedDate}
                      </span>
                    </div>

                    <h4 className="font-semibold text-sm text-foreground leading-snug">
                      {exp.title}
                    </h4>

                    <div className="flex items-center gap-1.5 text-xs text-foreground-muted">
                      <Users className="h-3.5 w-3.5 text-foreground-muted" />
                      <span>{exp.owner}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-border/40">
                    <span className="text-[11px] text-foreground-muted flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                      Sandbox Air-Gapped
                    </span>

                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleSimulateRun(exp.id)}
                      disabled={isSimulating}
                      className="h-7 text-xs px-2.5 gap-1.5 text-primary hover:text-primary hover:bg-primary/10"
                    >
                      {isSimulating ? (
                        <>
                          <Sparkles className="h-3 w-3 animate-spin" />
                          Simulating Run...
                        </>
                      ) : (
                        <>
                          <Play className="h-3 w-3" />
                          Simulate Run
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
