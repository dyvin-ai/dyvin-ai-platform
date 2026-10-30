import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  DollarSign,
  Share2,
  Copy,
  Check,
  TrendingUp,
  CreditCard,
  Plus,
  Clock,
  CheckCircle2,
} from "lucide-react";
import type { EcosystemReferralItem, CreateReferralInput } from "@/types";

interface ReferralCommissionConsoleProps {
  referrals?: EcosystemReferralItem[] | null;
  onCreateReferral: (input: CreateReferralInput) => Promise<void>;
  isCreating?: boolean;
  isLoading?: boolean;
}

export function ReferralCommissionConsole({
  referrals,
  onCreateReferral,
  isCreating,
  isLoading,
}: ReferralCommissionConsoleProps) {
  const [newRefCode, setNewRefCode] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (isLoading) {
    return (
      <Card className="border border-border/60 bg-surface-elevated/40">
        <CardContent className="p-6 space-y-4">
          <Skeleton className="h-6 w-48" />
          <div className="grid grid-cols-3 gap-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
          <Skeleton className="h-40 w-full" />
        </CardContent>
      </Card>
    );
  }

  const list = referrals || [];
  const totalCommission = list.reduce((acc, r) => acc + (r.commissionUsd || 0), 0);
  const paidCommission = list.filter((r) => r.status === "PAID").reduce((acc, r) => acc + (r.commissionUsd || 0), 0);
  const pendingCommission = list.filter((r) => r.status === "PENDING").reduce((acc, r) => acc + (r.commissionUsd || 0), 0);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = newRefCode.trim().toUpperCase() || `REF-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    await onCreateReferral({ referrerId: "user-alex", refCode: code });
    setNewRefCode("");
  };

  const handleCopy = (code: string) => {
    const link = `https://dyvin.ai/invite?ref=${code}`;
    navigator.clipboard.writeText(link);
    setCopiedId(code);
    toast.success(`Referral link copied: ${link}`);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Commission Metric Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border border-border/60 bg-surface-elevated/40">
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-xs font-medium text-muted-foreground uppercase">
              <span>Total Accrued</span>
              <DollarSign className="w-4 h-4 text-primary" />
            </div>
            <div className="text-2xl font-bold text-foreground mt-2">
              ${totalCommission.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              Lifetime gross affiliate earnings
            </p>
          </CardContent>
        </Card>

        <Card className="border border-border/60 bg-surface-elevated/40">
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-xs font-medium text-muted-foreground uppercase">
              <span>Paid Out</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold text-foreground mt-2">
              ${paidCommission.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              Disbursed to verified corporate account
            </p>
          </CardContent>
        </Card>

        <Card className="border border-border/60 bg-surface-elevated/40">
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-xs font-medium text-muted-foreground uppercase">
              <span>Pending Clearance</span>
              <Clock className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-bold text-foreground mt-2">
              ${pendingCommission.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              Processing on 30-day net terms
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Generator & Tracking Table */}
      <Card className="border border-border/60 bg-surface-elevated/40">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Share2 className="w-5 h-5 text-emerald-400" />
              <div>
                <CardTitle className="text-base font-semibold">
                  Affiliate Referral Links & Tracking
                </CardTitle>
                <CardDescription className="text-xs">
                  Generate unique referral links to earn 20% recurring commission on all referred enterprise subscriptions.
                </CardDescription>
              </div>
            </div>
          </div>

          {/* Generator Form */}
          <form onSubmit={handleCreate} className="mt-3 flex flex-col sm:flex-row gap-2.5">
            <div className="relative flex-1">
              <Input
                value={newRefCode}
                onChange={(e) => setNewRefCode(e.target.value)}
                placeholder="Enter custom referral code (e.g. ENTERPRISE-2026)..."
                className="bg-background/50 border-border/60 text-xs h-9 font-mono"
              />
            </div>
            <Button
              type="submit"
              disabled={isCreating}
              size="sm"
              className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold h-9 shrink-0 gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              {isCreating ? "Creating..." : "Generate Referral Link"}
            </Button>
          </form>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-border/60 text-muted-foreground text-xs uppercase tracking-wider">
                  <th className="py-2.5 px-3">Referral Code</th>
                  <th className="py-2.5 px-3 w-36 text-right">Commission Earned</th>
                  <th className="py-2.5 px-3 w-28 text-center">Payout Status</th>
                  <th className="py-2.5 px-3 w-36 text-center">Created</th>
                  <th className="py-2.5 px-3 w-28 text-center">Copy Link</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {list.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-xs text-muted-foreground">
                      No referral codes created yet. Generate one above to begin earning.
                    </td>
                  </tr>
                ) : (
                  list.map((ref) => (
                    <tr
                      key={ref.id}
                      className="hover:bg-surface-elevated/80 transition-colors group"
                    >
                      <td className="py-3 px-3">
                        <div className="font-mono font-bold text-foreground text-xs">
                          {ref.refCode}
                        </div>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="font-mono font-bold text-foreground text-sm">
                          ${ref.commissionUsd?.toLocaleString("en-US", { minimumFractionDigits: 2 }) ?? "0.00"}
                        </div>
                      </td>
                      <td className="py-3 px-3 text-center">
                        {ref.status === "PAID" ? (
                          <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] px-1.5 py-0 font-semibold">
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            PAID
                          </Badge>
                        ) : (
                          <Badge className="bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] px-1.5 py-0 font-semibold">
                            <Clock className="w-3 h-3 mr-1" />
                            PENDING
                          </Badge>
                        )}
                      </td>
                      <td className="py-3 px-3 text-center text-xs text-muted-foreground">
                        {new Date(ref.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <Button
                          onClick={() => handleCopy(ref.refCode)}
                          size="sm"
                          variant="outline"
                          className="h-7 text-xs gap-1 border-border/60 hover:text-primary"
                        >
                          {copiedId === ref.refCode ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-400" />
                              <span className="text-emerald-400">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copy</span>
                            </>
                          )}
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
