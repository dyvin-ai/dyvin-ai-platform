import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ShoppingBag,
  Star,
  Search,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import type { PartnerListingItem } from "@/types";

interface PartnerMarketplaceDirectoryCardProps {
  listings?: PartnerListingItem[] | null;
  onBookListing?: (listing: PartnerListingItem) => void;
  isLoading?: boolean;
}

export function PartnerMarketplaceDirectoryCard({
  listings,
  onBookListing,
  isLoading,
}: PartnerMarketplaceDirectoryCardProps) {
  const [filterText, setFilterText] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="border border-border/60 bg-surface-elevated/40">
            <CardContent className="p-5 space-y-3">
              <Skeleton className="h-5 w-36" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-8 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const list = listings || [
    { title: "Enterprise GEO Implementation Package", agency: "Acme Digital Agency", rating: 5.0, category: "IMPLEMENTATION" },
    { title: "Full-Stack Knowledge Graph Ingestion Audit", agency: "Vanguard Search Labs", rating: 4.9, category: "AUDIT" },
    { title: "Multi-Model Citation Optimization Retainer", agency: "Apex Consulting", rating: 4.8, category: "OPTIMIZATION" },
  ];

  const filtered = list.filter((item) => {
    const matchesText = item.title.toLowerCase().includes(filterText.toLowerCase()) ||
                        (item.agency && item.agency.toLowerCase().includes(filterText.toLowerCase()));
    const matchesCat = categoryFilter === "ALL" || (item.category && item.category.toUpperCase() === categoryFilter.toUpperCase());
    return matchesText && matchesCat;
  });

  return (
    <div className="space-y-6">
      {/* Header and Filter Controls */}
      <Card className="border border-border/60 bg-surface-elevated/40">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-amber-400" />
              <div>
                <CardTitle className="text-base font-semibold">
                  Certified Partner Services Marketplace
                </CardTitle>
                <CardDescription className="text-xs">
                  Turnkey consulting packages, technical implementation retainers, and AI audit solutions delivered by certified agency partners.
                </CardDescription>
              </div>
            </div>
          </div>

          {/* Search & Category Filter */}
          <div className="mt-3 flex flex-col sm:flex-row gap-2.5">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
                placeholder="Search packages e.g. Implementation, Audit, Retainer..."
                className="pl-9 bg-background/50 border-border/60 text-xs h-9"
              />
            </div>
            <div className="flex gap-1.5 shrink-0">
              {["ALL", "IMPLEMENTATION", "AUDIT", "OPTIMIZATION"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-2.5 py-1 text-xs rounded-md font-medium transition-all ${
                    categoryFilter === cat
                      ? "bg-amber-500 text-slate-950 font-semibold shadow-xs"
                      : "bg-surface-elevated text-muted-foreground hover:bg-surface-elevated/80 border border-border/40"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Product Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.length === 0 ? (
          <div className="col-span-full py-12 text-center text-xs text-muted-foreground bg-surface-elevated/20 rounded-xl border border-border/40">
            No marketplace packages found matching your criteria.
          </div>
        ) : (
          filtered.map((item, idx) => (
            <Card
              key={idx}
              className="border border-border/60 bg-surface-elevated/50 hover:bg-surface-elevated hover:border-border transition-all flex flex-col justify-between"
            >
              <CardContent className="p-5 space-y-4">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Badge className="bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] px-1.5 py-0 font-semibold">
                      {item.category || "IMPLEMENTATION"}
                    </Badge>
                    <div className="flex items-center gap-1 text-amber-400 text-xs font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{item.rating?.toFixed(1) ?? "5.0"}</span>
                    </div>
                  </div>
                  <h3 className="font-semibold text-foreground text-sm leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs text-muted-foreground flex items-center gap-1.5 pt-0.5">
                    <span>Delivered by:</span>
                    <strong className="text-foreground font-medium">{item.agency || "Certified Partner Agency"}</strong>
                  </p>
                </div>

                <div className="text-xs text-muted-foreground space-y-1.5 border-t border-border/40 pt-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Cross-model prompt audit & visibility baseline</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Knowledge Graph schema & vector indexing</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Weekly executive briefing & SRE support</span>
                  </div>
                </div>

                <div className="pt-2">
                  <Button
                    onClick={() => onBookListing?.(item)}
                    size="sm"
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold h-8 gap-1.5"
                  >
                    <span>Request Proposal</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
