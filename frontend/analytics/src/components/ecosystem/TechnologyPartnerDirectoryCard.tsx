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
  Layers,
  CheckCircle2,
  Search,
  ExternalLink,
  Plus,
  Cpu,
  Workflow,
  Sparkles,
  Link2,
} from "lucide-react";
import type { PartnerProfileItem, RegisterPartnerInput } from "@/types";

interface TechnologyPartnerDirectoryCardProps {
  partners?: PartnerProfileItem[] | null;
  onRegisterPartner: (input: RegisterPartnerInput) => Promise<void>;
  isRegistering?: boolean;
  isOpenModal: boolean;
  onCloseModal: () => void;
  isLoading?: boolean;
}

export function TechnologyPartnerDirectoryCard({
  partners,
  onRegisterPartner,
  isRegistering,
  isOpenModal,
  onCloseModal,
  isLoading,
}: TechnologyPartnerDirectoryCardProps) {
  const [filterText, setFilterText] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");

  // Registration Form State
  const [companyName, setCompanyName] = useState("");
  const [partnerType, setPartnerType] = useState("TECHNOLOGY");

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

  const list = partners || [];
  const filtered = list.filter((p) => {
    const matchesText = p.companyName.toLowerCase().includes(filterText.toLowerCase());
    const matchesType = typeFilter === "ALL" || p.partnerType.toUpperCase() === typeFilter.toUpperCase();
    return matchesText && matchesType;
  });

  const getPartnerTypeBadge = (type: string) => {
    switch (type.toUpperCase()) {
      case "TECHNOLOGY":
        return (
          <Badge className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs font-semibold">
            <Cpu className="w-3 h-3 mr-1 text-cyan-400" />
            TECHNOLOGY
          </Badge>
        );
      case "CONSULTING":
        return (
          <Badge className="bg-purple-500/10 text-purple-400 border border-purple-500/20 text-xs font-semibold">
            <Workflow className="w-3 h-3 mr-1 text-purple-400" />
            CONSULTING
          </Badge>
        );
      default:
        return (
          <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold">
            <Link2 className="w-3 h-3 mr-1 text-emerald-400" />
            {type}
          </Badge>
        );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim()) return;
    await onRegisterPartner({ companyName: companyName.trim(), partnerType });
    setCompanyName("");
    onCloseModal();
  };

  return (
    <Card className="border border-border/60 bg-surface-elevated/40">
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-cyan-400" />
            <div>
              <CardTitle className="text-base font-semibold">
                Technology & Consulting Partner Directory
              </CardTitle>
              <CardDescription className="text-xs">
                Verified software vendors, vector database providers, and systems integration partners across the Dyvin AI mesh.
              </CardDescription>
            </div>
          </div>
          <Button
            onClick={() => {
              setCompanyName("");
              setPartnerType("TECHNOLOGY");
            }}
            size="sm"
            className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold h-8 shrink-0 gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            Apply as Partner
          </Button>
        </div>

        {/* Filter Bar */}
        <div className="mt-3 flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              placeholder="Search partner companies..."
              className="pl-9 bg-background/50 border-border/60 text-xs h-9"
            />
          </div>
          <div className="flex gap-1.5 shrink-0">
            {["ALL", "TECHNOLOGY", "CONSULTING", "INTEGRATION"].map((cat) => (
              <button
                key={cat}
                onClick={() => setTypeFilter(cat)}
                className={`px-2.5 py-1 text-xs rounded-md font-medium transition-all ${
                  typeFilter === cat
                    ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                    : "bg-surface-elevated text-muted-foreground hover:bg-surface-elevated/80 border border-border/40"
                }`}
              >
                {cat}
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
                <th className="py-2.5 px-3">Company Name</th>
                <th className="py-2.5 px-3 w-36">Partner Program</th>
                <th className="py-2.5 px-3 w-28 text-center">Status</th>
                <th className="py-2.5 px-3 w-32 text-center">Integration</th>
                <th className="py-2.5 px-3 w-28 text-center">Documentation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-xs text-muted-foreground">
                    No technology partners match the selected filter.
                  </td>
                </tr>
              ) : (
                filtered.map((p) => (
                  <tr
                    key={p.id}
                    className="hover:bg-surface-elevated/80 transition-colors group"
                  >
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-md bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                          <Cpu className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <div className="font-semibold text-foreground text-sm">{p.companyName}</div>
                          <div className="text-[11px] text-muted-foreground">
                            Connected: {new Date(p.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      {getPartnerTypeBadge(p.partnerType)}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] px-1.5 py-0 font-semibold">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        {p.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <Badge variant="outline" className="border-border/60 text-muted-foreground text-[10px]">
                        API & Webhook
                      </Badge>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <Button size="sm" variant="ghost" className="h-7 text-xs gap-1 hover:text-primary">
                        <ExternalLink className="w-3.5 h-3.5" />
                        Docs
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
              <Layers className="w-4 h-4 text-cyan-400" />
              Apply for Technology Partner Program
            </DialogTitle>
            <DialogDescription className="text-xs">
              Connect your developer tool, vector database, or enterprise software stack to Dyvin AI.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Company Name</label>
              <Input
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="e.g. VectorScale Infrastructure Corp"
                required
                className="bg-background/60 border-border/60 text-xs h-9"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Partner Classification</label>
              <div className="grid grid-cols-3 gap-2">
                {["TECHNOLOGY", "CONSULTING", "INTEGRATION"].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setPartnerType(cat)}
                    className={`py-2 px-3 rounded-lg border text-xs font-semibold transition-all ${
                      partnerType === cat
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border/60 bg-surface-elevated text-muted-foreground hover:bg-surface-elevated/80"
                    }`}
                  >
                    {cat}
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
                disabled={isRegistering || !companyName.trim()}
                className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold h-8"
              >
                {isRegistering ? "Submitting..." : "Submit Partner Application"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
