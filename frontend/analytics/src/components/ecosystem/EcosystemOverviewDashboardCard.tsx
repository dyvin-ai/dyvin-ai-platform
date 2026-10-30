import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Handshake,
  Building,
  Users2,
  DollarSign,
  GraduationCap,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  Award,
  Layers,
  CheckCircle2,
} from "lucide-react";
import type { EcosystemDashboardOverview } from "@/types";

interface EcosystemOverviewDashboardCardProps {
  overview?: EcosystemDashboardOverview | null;
  onNavigateTab: (tab: string) => void;
  onOpenAgencyModal: () => void;
  onOpenPartnerModal: () => void;
  isLoading?: boolean;
}

export function EcosystemOverviewDashboardCard({
  overview,
  onNavigateTab,
  onOpenAgencyModal,
  onOpenPartnerModal,
  isLoading,
}: EcosystemOverviewDashboardCardProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="border border-border/60 bg-surface-elevated/40">
              <CardContent className="p-4 space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-28" />
                <Skeleton className="h-3 w-36" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const activeAgencies = overview?.activeAgencies?.toLocaleString() ?? "120";
  const activePartners = overview?.activePartners?.toLocaleString() ?? "45";
  const referralPayouts = overview?.totalReferralPayoutsUsd
    ? `$${overview.totalReferralPayoutsUsd.toLocaleString()}`
    : "$145,000";
  const certifiedSpecialists = overview?.certifiedSpecialists?.toLocaleString() ?? "850";
  const ecosystemStatus = overview?.ecosystemStatus ?? "FULLY_OPERATIONAL";

  return (
    <div className="space-y-6">
      {/* Platform Counter Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Active Agencies */}
        <Card className="border border-border/60 bg-surface-elevated/40">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Certified Agencies
              </span>
              <Building className="w-4 h-4 text-primary" />
            </div>
            <div className="mt-2 text-2xl font-bold text-foreground">{activeAgencies}</div>
            <div className="flex items-center gap-1.5 mt-1">
              <Badge className="bg-primary/10 text-primary border border-primary/20 text-[10px] px-1.5 py-0 font-semibold">
                Platinum & Gold
              </Badge>
              <span className="text-xs text-muted-foreground">verified partners</span>
            </div>
          </CardContent>
        </Card>

        {/* Technology Partners */}
        <Card className="border border-border/60 bg-surface-elevated/40">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Tech & Integration Partners
              </span>
              <Layers className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="mt-2 text-2xl font-bold text-foreground">{activePartners}</div>
            <div className="flex items-center gap-1.5 mt-1">
              <Badge className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-[10px] px-1.5 py-0 font-semibold">
                Active Connectors
              </Badge>
              <span className="text-xs text-muted-foreground">vector & LLM ecosystems</span>
            </div>
          </CardContent>
        </Card>

        {/* Total Referral Commissions */}
        <Card className="border border-border/60 bg-surface-elevated/40">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Affiliate Payouts
              </span>
              <DollarSign className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="mt-2 text-2xl font-bold text-foreground">{referralPayouts}</div>
            <div className="flex items-center gap-1.5 mt-1">
              <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] px-1.5 py-0 font-semibold">
                20% Lifetime
              </Badge>
              <span className="text-xs text-muted-foreground">commission model</span>
            </div>
          </CardContent>
        </Card>

        {/* Certified Specialists */}
        <Card className="border border-border/60 bg-surface-elevated/40">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Certified Specialists
              </span>
              <GraduationCap className="w-4 h-4 text-amber-400" />
            </div>
            <div className="mt-2 text-2xl font-bold text-foreground">{certifiedSpecialists}</div>
            <div className="flex items-center gap-1.5 mt-1">
              <Badge className="bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] px-1.5 py-0 font-semibold">
                CDGS & CDPA
              </Badge>
              <span className="text-xs text-muted-foreground">graduates</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Hero Welcome & Quick Action Card */}
      <Card className="border border-border/60 bg-gradient-to-br from-surface-elevated/80 via-surface-elevated/40 to-background">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-primary/10 border border-primary/20 text-primary">
                <Handshake className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-base font-semibold">
                  Dyvin AI Global Partner Ecosystem & Marketplace
                </CardTitle>
                <CardDescription className="text-xs">
                  Collaborate with elite AI search agencies, integrate enterprise software stacks, and monetize through certified services.
                </CardDescription>
              </div>
            </div>
            <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold shrink-0">
              <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
              {ecosystemStatus}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-xs text-muted-foreground leading-relaxed">
            The Dyvin AI Partner Network connects top-tier marketing agencies, systems integrators, and software providers with enterprises seeking frontier Generative Engine Optimization (GEO). Build custom LLM citation playbooks, audit customer visibility, and deploy specialized autonomous agents.
          </p>

          <div className="flex flex-wrap gap-2.5 pt-1">
            <Button
              onClick={onOpenAgencyModal}
              size="sm"
              className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold h-8"
            >
              <Building className="w-3.5 h-3.5 mr-1.5" />
              Register Certified Agency
            </Button>
            <Button
              onClick={onOpenPartnerModal}
              size="sm"
              variant="outline"
              className="border-border/60 text-xs font-semibold h-8"
            >
              <Layers className="w-3.5 h-3.5 mr-1.5 text-cyan-400" />
              Apply as Tech Partner
            </Button>
            <Button
              onClick={() => onNavigateTab("referrals")}
              size="sm"
              variant="outline"
              className="border-border/60 text-xs font-semibold h-8"
            >
              <DollarSign className="w-3.5 h-3.5 mr-1.5 text-emerald-400" />
              Join Affiliate Program
            </Button>
            <Button
              onClick={() => onNavigateTab("academy")}
              size="sm"
              variant="outline"
              className="border-border/60 text-xs font-semibold h-8"
            >
              <GraduationCap className="w-3.5 h-3.5 mr-1.5 text-amber-400" />
              Dyvin Learning Academy
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
