import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  UserCheck,
  ShieldCheck,
  FileCheck2,
  ArrowRight,
} from "lucide-react";
import type { GovernanceApprovalItem } from "@/types";

interface ApprovalWorkflowQueueCardProps {
  approvals: GovernanceApprovalItem[];
  isLoading?: boolean;
  onApprove: (workflowName: string, approverRole: string) => Promise<void>;
}

export function ApprovalWorkflowQueueCard({
  approvals,
  isLoading = false,
  onApprove,
}: ApprovalWorkflowQueueCardProps) {
  const [filter, setFilter] = useState<string>("ALL");
  const [approvingId, setApprovingId] = useState<string | null>(null);

  const filtered = approvals.filter((a) => {
    if (filter === "ALL") return true;
    return a.status === filter;
  });

  const handleApprove = async (item: GovernanceApprovalItem) => {
    try {
      setApprovingId(item.id);
      await onApprove(item.workflowName, item.approverRole);
    } finally {
      setApprovingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "APPROVED":
        return (
          <Badge variant="outline" className="border-emerald-500/40 text-emerald-400 bg-emerald-500/10 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>APPROVED</span>
          </Badge>
        );
      case "PENDING":
        return (
          <Badge variant="outline" className="border-amber-500/40 text-amber-400 bg-amber-500/10 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>PENDING REVIEW</span>
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="border-muted text-muted-foreground">
            {status}
          </Badge>
        );
    }
  };

  return (
    <Card className="border border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <FileCheck2 className="w-5 h-5 text-primary" />
              <CardTitle className="text-lg font-bold">
                Governance Approval Queue & Dual Sign-Off
              </CardTitle>
            </div>
            <CardDescription className="text-sm text-muted-foreground mt-1">
              High-impact AI actions, dataset exports, and automated campaign releases require authenticated multi-role authorizations.
            </CardDescription>
          </div>

          <div className="flex items-center gap-2">
            {["ALL", "PENDING", "APPROVED"].map((status) => (
              <Button
                key={status}
                variant={filter === status ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter(status)}
                className="h-8 text-xs"
              >
                {status === "ALL" ? "All Queue" : status}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6 pt-0">
        {isLoading ? (
          <div className="py-12 text-center text-sm text-muted-foreground animate-pulse">
            Loading approval queue...
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-12 text-center text-sm text-muted-foreground border border-dashed rounded-xl border-border/60">
            No workflows matching current filter.
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-xl border border-border/50 bg-background/30 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-border transition-colors"
              >
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h4 className="font-semibold text-sm text-foreground">
                      {item.workflowName}
                    </h4>
                    {getStatusBadge(item.status)}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                    <span className="flex items-center gap-1 font-medium text-foreground/80">
                      <UserCheck className="w-3.5 h-3.5 text-primary" />
                      Role: {item.approverRole.replace(/_/g, " ")}
                    </span>
                    <span>•</span>
                    <span className="font-mono text-[11px] text-muted-foreground/80">ID: {item.id}</span>
                    <span>•</span>
                    <span>Timestamp: {new Date(item.approvedAt).toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end md:self-center">
                  {item.status === "PENDING" ? (
                    <Button
                      size="sm"
                      onClick={() => handleApprove(item)}
                      disabled={approvingId === item.id}
                      className="gap-1.5 text-xs bg-emerald-600 hover:bg-emerald-500 text-white"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{approvingId === item.id ? "Approving..." : "Sign & Authorize"}</span>
                    </Button>
                  ) : (
                    <Badge variant="outline" className="border-border text-muted-foreground text-xs py-1 px-2.5">
                      Audit Trail Locked
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
