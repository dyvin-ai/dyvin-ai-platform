import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Building,
  ShieldCheck,
  Search,
  ExternalLink,
  Plus,
  Users,
  Award,
  Crown,
  Sparkles,
} from "lucide-react";
import type { AgencyProfileItem, RegisterAgencyInput } from "@/types";

interface CertifiedAgencyDirectoryCardProps {
  agencies?: AgencyProfileItem[] | null;
  onRegisterAgency: (input: RegisterAgencyInput) => Promise<void>;
  isRegistering?: boolean;
  isOpenModal: boolean;
  onCloseModal: () => void;
  isLoading?: boolean;
}

export function CertifiedAgencyDirectoryCard({
  agencies,
  onRegisterAgency,
  isRegistering,
  isOpenModal,
  onCloseModal,
  isLoading,
}: CertifiedAgencyDirectoryCardProps) {
  const [filterText, setFilterText] = useState("");
  const [tierFilter, setTierFilter] = useState("ALL");

  // Registration Form State
  const [agencyName, setAgencyName] = useState("");
  const [tier, setTier] = useState("GOLD");

  if (isLoading) {
    return (
      <Card className="border border-border/60 bg-surface-elevated/40">
        <CardContent className="p-6 space-y-4">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-10 w-full" />
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const list = agencies || [];
  const filtered = list.filter((ag) => {
    const matchesText = ag.agencyName.toLowerCase().includes(filterText.toLowerCase());
    const matchesTier = tierFilter === "ALL" || ag.tier.toUpperCase() === tierFilter.toUpperCase();
    return matchesText && matchesTier;
  });

  const getTierBadge = (t: string) => {
    switch (t.toUpperCase()) {
      case "PLATINUM":
        return (
          <Badge className="bg-purple-500/10 text-purple-400 border border-purple-500/20 text-xs font-semibold">
            <Crown className="w-3 h-3 mr-1 text-purple-400" />
            PLATINUM
          </Badge>
        );
      case "GOLD":
        return (
          <Badge className="bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-semibold">
            <Award className="w-3 h-3 mr-1 text-amber-400" />
            GOLD
          </Badge>
        );
      default:
        return (
          <Badge className="bg-slate-500/10 text-slate-300 border border-slate-500/20 text-xs font-semibold">
            SILVER
          </Badge>
        );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agencyName.trim()) return;
    await onRegisterAgency({ agencyName: agencyName.trim(), tier });
    setAgencyName("");
    onCloseModal();
  };

  return (
    <Card className="border border-border/60 bg-surface-elevated/40">
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Building className="w-5 h-5 text-primary" />
            <div>
              <CardTitle className="text-base font-semibold">
                Certified AI Agency Directory
              </CardTitle>
              <CardDescription className="text-xs">
                Accredited agency partners verified to deliver Generative Engine Optimization, audit, and prompt recovery programs.
              </CardDescription>
            </div>
          </div>
          <Button
            onClick={() => {
              setAgencyName("");
              setTier("GOLD");
              // Modal control managed by parent or local
            }}
            size="sm"
            className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold h-8 shrink-0 gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            Register Agency
          </Button>
        </div>

        {/* Filter bar */}
        <div className="mt-3 flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              placeholder="Search agencies by name..."
              className="pl-9 bg-background/50 border-border/60 text-xs h-9"
            />
          </div>
          <div className="flex gap-1.5 shrink-0">
            {["ALL", "PLATINUM", "GOLD", "SILVER"].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setTierFilter(lvl)}
                className={`px-2.5 py-1 text-xs rounded-md font-medium transition-all ${
                  tierFilter === lvl
                    ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                    : "bg-surface-elevated text-muted-foreground hover:bg-surface-elevated/80 border border-border/40"
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-border/60 text-muted-foreground text-xs uppercase tracking-wider">
                <th className="py-2.5 px-3">Agency Name</th>
                <th className="py-2.5 px-3 w-32">Partnership Tier</th>
                <th className="py-2.5 px-3 w-28 text-center">Status</th>
                <th className="py-2.5 px-3 w-32 text-right">Active Clients</th>
                <th className="py-2.5 px-3 w-28 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-xs text-muted-foreground">
                    No certified agencies match the selected search or tier filter.
                  </td>
                </tr>
              ) : (
                filtered.map((ag) => (
                  <tr
                    key={ag.id}
                    className="hover:bg-surface-elevated/80 transition-colors group"
                  >
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-md bg-primary/10 border border-primary/20 text-primary">
                          <Building className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <div className="font-semibold text-foreground text-sm">{ag.agencyName}</div>
                          <div className="text-[11px] text-muted-foreground">
                            Enrolled: {new Date(ag.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      {getTierBadge(ag.tier)}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] px-1.5 py-0 font-semibold">
                        <ShieldCheck className="w-3 h-3 mr-1" />
                        VERIFIED
                      </Badge>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="font-mono font-bold text-foreground text-sm">
                        {ag.clientCount} accounts
                      </div>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <Button size="sm" variant="ghost" className="h-7 text-xs gap-1 hover:text-primary">
                        <ExternalLink className="w-3.5 h-3.5" />
                        Connect
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </CardContent>

      {/* Registration Dialog */}
      <Dialog open={isOpenModal} onOpenChange={(open) => !open && onCloseModal()}>
        <DialogContent className="sm:max-w-[440px] bg-surface border-border">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold flex items-center gap-2">
              <Building className="w-4 h-4 text-primary" />
              Register Certified Agency Profile
            </DialogTitle>
            <DialogDescription className="text-xs">
              Apply to list your agency in the official Dyvin AI partner catalog and receive client referrals.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Agency Name</label>
              <Input
                value={agencyName}
                onChange={(e) => setAgencyName(e.target.value)}
                placeholder="e.g. Apex AI Strategy Partners"
                required
                className="bg-background/60 border-border/60 text-xs h-9"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Program Tier</label>
              <div className="grid grid-cols-3 gap-2">
                {["PLATINUM", "GOLD", "SILVER"].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTier(t)}
                    className={`py-2 px-3 rounded-lg border text-xs font-semibold transition-all ${
                      tier === t
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border/60 bg-surface-elevated text-muted-foreground hover:bg-surface-elevated/80"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={onCloseModal}
                className="border-border/60 text-xs h-8"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isRegistering || !agencyName.trim()}
                className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold h-8"
              >
                {isRegistering ? "Registering..." : "Submit Registration"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
