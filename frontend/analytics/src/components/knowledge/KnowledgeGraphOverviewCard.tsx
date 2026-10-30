import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Network,
  Share2,
  FileCheck2,
  ShieldCheck,
  Package,
  Layers,
  Building,
  Mail,
  MapPin,
  Calendar,
} from "lucide-react";
import type { KnowledgeGraphSummary } from "@/types";

interface KnowledgeGraphOverviewCardProps {
  summary?: KnowledgeGraphSummary | null;
  isLoading?: boolean;
}

export function KnowledgeGraphOverviewCard({
  summary,
  isLoading,
}: KnowledgeGraphOverviewCardProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="border border-border/60 bg-surface-elevated/40">
              <CardContent className="p-4 space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-3 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!summary) {
    return null;
  }

  const kpis = [
    {
      label: "Canonical Entities",
      value: summary._count?.entities ?? summary.entityCount ?? 0,
      subtext: "Distinct verified entities",
      icon: Network,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      label: "Graph Relationships",
      value: summary._count?.relationships ?? 0,
      subtext: "Directed semantic edges",
      icon: Share2,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      label: "Extracted Facts",
      value: summary._count?.facts ?? summary.factCount ?? 0,
      subtext: "Provenance-backed statements",
      icon: FileCheck2,
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
    },
    {
      label: "Graph Confidence",
      value: `${summary.confidenceScore ?? 100}%`,
      subtext: "F1 validation score",
      icon: ShieldCheck,
      color: "text-indigo-500",
      bgColor: "bg-indigo-500/10",
    },
    {
      label: "Discovered Products",
      value: summary._count?.products ?? 0,
      subtext: "Extracted catalog items",
      icon: Package,
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
    },
    {
      label: "Verified Services",
      value: summary._count?.services ?? 0,
      subtext: "Business offerings",
      icon: Layers,
      color: "text-cyan-500",
      bgColor: "bg-cyan-500/10",
    },
  ];

  const primaryBrand = summary.brandProfiles?.[0];
  const primaryLocation = summary.locations?.[0];
  const primaryContact = summary.contacts?.[0];

  return (
    <div className="space-y-4">
      {/* Brand & Metadata Overview Banner */}
      <Card className="border border-border/60 bg-gradient-to-r from-surface-elevated/80 via-surface/60 to-surface-elevated/40 backdrop-blur-sm">
        <CardContent className="p-5">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h3 className="text-lg font-semibold tracking-tight text-foreground">
                  {summary.name || "Enterprise Knowledge Graph"}
                </h3>
                <Badge variant="outline" className="text-xs font-mono bg-blue-500/10 text-blue-400 border-blue-500/30">
                  v{summary.version || 1}.0
                </Badge>
                {primaryBrand?.legalName && (
                  <Badge variant="secondary" className="text-xs">
                    {primaryBrand.legalName}
                  </Badge>
                )}
              </div>
              {primaryBrand?.tagline && (
                <p className="text-sm text-muted-foreground line-clamp-1">
                  {primaryBrand.tagline}
                </p>
              )}
            </div>

            <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
              {primaryLocation?.city && (
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-muted-foreground/70" />
                  <span>
                    {primaryLocation.city}
                    {primaryLocation.country ? `, ${primaryLocation.country}` : ""}
                  </span>
                </div>
              )}
              {primaryContact?.email && (
                <div className="flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-muted-foreground/70" />
                  <span>{primaryContact.email}</span>
                </div>
              )}
              <div className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-muted-foreground/70" />
                <span>
                  Updated {new Date(summary.updatedAt || summary.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* KPI Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <Card
              key={kpi.label}
              className="border border-border/60 bg-surface-elevated/40 hover:bg-surface-elevated/60 transition-colors"
            >
              <CardContent className="p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground">
                    {kpi.label}
                  </span>
                  <div className={`p-1.5 rounded-md ${kpi.bgColor}`}>
                    <Icon className={`h-4 w-4 ${kpi.color}`} />
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold tracking-tight text-foreground">
                    {kpi.value}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {kpi.subtext}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
