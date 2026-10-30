import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Plus, Sparkles, UserCheck } from "lucide-react";
import type { HireDigitalEmployeePayload } from "@/types";

interface HireEmployeeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (payload: HireDigitalEmployeePayload) => Promise<void>;
  organizationId: string;
}

const DEFAULT_DEPARTMENTS = [
  "GEO & Search Visibility",
  "Content & Technical Docs",
  "Customer Success & Support",
  "Engineering & DevOps",
  "Brand Protection & Trust",
  "Autonomous Operations",
];

const PRESET_ROLES = [
  "Lead GEO Optimization Specialist",
  "Autonomous Citation Architect",
  "Technical Documentation Synthesizer",
  "Enterprise SRE & Infrastructure Sentinel",
  "Brand Trust & Hallucination Auditor",
  "Semantic Difference Analyst",
];

export function HireEmployeeModal({
  open,
  onOpenChange,
  onSubmit,
  organizationId,
}: HireEmployeeModalProps) {
  const [name, setName] = useState("");
  const [role, setRole] = useState(PRESET_ROLES[0] || "");
  const [department, setDepartment] = useState(DEFAULT_DEPARTMENTS[0] || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Please specify a name for the digital employee.");
      return;
    }
    if (!role.trim()) {
      setError("Please specify a role or specialization.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      await onSubmit({
        organizationId,
        employeeName: name.trim(),
        role: role.trim(),
        department: department.trim(),
      });
      setName("");
      onOpenChange(false);
    } catch (err: any) {
      setError(err?.message || "Failed to onboard digital employee. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] bg-surface-elevated border border-border">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <Sparkles className="size-5" />
            </div>
            <div>
              <DialogTitle className="text-base font-semibold text-foreground">
                Hire & Onboard AI Digital Worker
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Deploy a specialized autonomous agent with tailored domain playbooks and 24/7 SLA execution.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {error && (
            <div className="p-2.5 rounded-md bg-destructive/10 border border-destructive/20 text-destructive text-xs">
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="emp-name" className="text-xs font-medium text-foreground">
              Employee Name
            </Label>
            <Input
              id="emp-name"
              placeholder="e.g. Seline Vance"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isSubmitting}
              className="text-sm bg-surface-subtle"
              autoFocus
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="emp-role" className="text-xs font-medium text-foreground">
                Role & Specialization
              </Label>
              <span className="text-[11px] text-muted-foreground">Preset or Custom</span>
            </div>
            <Input
              id="emp-role"
              placeholder="e.g. Lead GEO Optimization Specialist"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              disabled={isSubmitting}
              className="text-sm bg-surface-subtle"
            />
            {/* Quick role chips */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {PRESET_ROLES.slice(0, 3).map((r) => (
                <button
                  type="button"
                  key={r}
                  onClick={() => setRole(r)}
                  className="text-[10px] px-2 py-0.5 rounded-full border border-border/80 bg-surface-subtle hover:bg-surface-elevated text-muted-foreground hover:text-foreground transition-all"
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="emp-dept" className="text-xs font-medium text-foreground">
              Department
            </Label>
            <select
              id="emp-dept"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              disabled={isSubmitting}
              className="w-full h-9 px-3 bg-surface-subtle border border-border text-xs rounded-md text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            >
              {DEFAULT_DEPARTMENTS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isSubmitting || !name.trim()}
              className="text-xs gap-1.5"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  Onboarding Worker...
                </>
              ) : (
                <>
                  <UserCheck className="size-3.5" />
                  Deploy Digital Employee
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
