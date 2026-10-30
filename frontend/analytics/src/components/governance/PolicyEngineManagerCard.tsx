import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Scale,
  Search,
  Plus,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Filter,
  Eye,
} from "lucide-react";
import type { GovernancePolicyItem } from "@/types";

interface PolicyEngineManagerCardProps {
  policies: GovernancePolicyItem[];
  isLoading?: boolean;
  onCreateClick: () => void;
}

export function PolicyEngineManagerCard({
  policies,
  isLoading = false,
  onCreateClick,
}: PolicyEngineManagerCardProps) {
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState<string>("ALL");

  const filtered = policies.filter((p) => {
    const matchesSearch =
      p.policyName.toLowerCase().includes(search.toLowerCase()) ||
      p.policyType.toLowerCase().includes(search.toLowerCase()) ||
      p.id.toLowerCase().includes(search.toLowerCase());
    const matchesType =
      selectedType === "ALL" || p.policyType === selectedType;
    return matchesSearch && matchesType;
  });

  const getPolicyTypeBadge = (type: string) => {
    switch (type) {
      case "DATA_PRIVACY":
        return <Badge variant="outline" className="border-blue-500/40 text-blue-400 bg-blue-500/10">Privacy Shield</Badge>;
      case "SAFETY_AND_ACCURACY":
        return <Badge variant="outline" className="border-amber-500/40 text-amber-400 bg-amber-500/10">Safety & Grounding</Badge>;
      case "WORKFLOW_GOVERNANCE":
        return <Badge variant="outline" className="border-purple-500/40 text-purple-400 bg-purple-500/10">Workflow Approval</Badge>;
      case "RESPONSIBLE_AI":
        return <Badge variant="outline" className="border-teal-500/40 text-teal-400 bg-teal-500/10">Responsible AI</Badge>;
      case "SECURITY_AND_COMPLIANCE":
      default:
        return <Badge variant="outline" className="border-emerald-500/40 text-emerald-400 bg-emerald-500/10">Security & Compliance</Badge>;
    }
  };

  return (
    <Card className="border border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Scale className="w-5 h-5 text-primary" />
              <CardTitle className="text-lg font-bold">
                AI Policy Engine & Boundary Guardrails
              </CardTitle>
            </div>
            <CardDescription className="text-sm text-muted-foreground mt-1">
              Active organization-level policy controls enforced deterministically across model inferences, agentic workflows, and external citations.
            </CardDescription>
          </div>
          <Button onClick={onCreateClick} size="sm" className="gap-2 shadow-sm">
            <Plus className="w-4 h-4" />
            <span>Create Policy</span>
          </Button>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="flex flex-col sm:flex-row items-center gap-3 mt-4 pt-4 border-t border-border/40">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search policies by name, type, or ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-background/50 h-9 text-xs"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full pb-1 sm:pb-0">
            {["ALL", "DATA_PRIVACY", "SAFETY_AND_ACCURACY", "WORKFLOW_GOVERNANCE", "RESPONSIBLE_AI", "SECURITY_AND_COMPLIANCE"].map(
              (type) => (
                <Button
                  key={type}
                  variant={selectedType === type ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedType(type)}
                  className="h-8 text-xs whitespace-nowrap"
                >
                  {type === "ALL" ? "All Policies" : type.replace(/_/g, " ")}
                </Button>
              )
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6 pt-0">
        {isLoading ? (
          <div className="py-12 text-center text-sm text-muted-foreground animate-pulse">
            Loading governance policies...
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-12 text-center text-sm text-muted-foreground border border-dashed rounded-xl border-border/60">
            No policies matching current criteria.
          </div>
        ) : (
          <div className="divide-y divide-border/40 rounded-xl border border-border/50 overflow-hidden bg-background/30">
            {filtered.map((policy) => (
              <div
                key={policy.id}
                className="p-4 hover:bg-card/40 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-semibold text-sm text-foreground">
                      {policy.policyName}
                    </h4>
                    {getPolicyTypeBadge(policy.policyType)}
                    <Badge variant="outline" className="border-emerald-500/40 text-emerald-400 bg-emerald-500/10 flex items-center gap-1 text-[11px]">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{policy.isEnforced ? "ENFORCED" : "INACTIVE"}</span>
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="font-mono text-[11px] text-muted-foreground/80">ID: {policy.id}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Lock className="w-3 h-3 text-muted-foreground/70" />
                      Org: {policy.organizationId}
                    </span>
                    <span>•</span>
                    <span>Created: {new Date(policy.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end md:self-center">
                  <Badge variant="secondary" className="text-xs bg-muted/50 font-normal">
                    Deterministic Backend Enforced
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
