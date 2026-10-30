import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package, Layers, Tag, DollarSign, ArrowUpRight } from "lucide-react";
import type { KnowledgeProduct, KnowledgeServiceItem } from "@/types";

interface ProductsServicesGridProps {
  products: KnowledgeProduct[];
  services: KnowledgeServiceItem[];
  isLoading?: boolean;
}

export function ProductsServicesGrid({
  products,
  services,
  isLoading,
}: ProductsServicesGridProps) {
  const [activeTab, setActiveTab] = useState<"ALL" | "PRODUCTS" | "SERVICES">("ALL");

  if (isLoading) {
    return (
      <Card className="border border-border/60 bg-surface-elevated/40">
        <CardContent className="p-8 text-center text-muted-foreground text-sm">
          Loading catalog items...
        </CardContent>
      </Card>
    );
  }

  const showProducts = activeTab === "ALL" || activeTab === "PRODUCTS";
  const showServices = activeTab === "ALL" || activeTab === "SERVICES";

  return (
    <div className="space-y-4">
      {/* Tab Switcher */}
      <div className="flex items-center justify-between bg-surface-elevated/30 p-3 rounded-lg border border-border/50">
        <div>
          <h4 className="text-sm font-semibold text-foreground">
            Extracted Catalog Offerings
          </h4>
          <p className="text-xs text-muted-foreground">
            Automated entity discovery of commercial products and enterprise service capabilities
          </p>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant={activeTab === "ALL" ? "default" : "outline"}
            size="sm"
            className="h-8 text-xs"
            onClick={() => setActiveTab("ALL")}
          >
            All Offerings ({products.length + services.length})
          </Button>
          <Button
            variant={activeTab === "PRODUCTS" ? "default" : "outline"}
            size="sm"
            className="h-8 text-xs"
            onClick={() => setActiveTab("PRODUCTS")}
          >
            Products ({products.length})
          </Button>
          <Button
            variant={activeTab === "SERVICES" ? "default" : "outline"}
            size="sm"
            className="h-8 text-xs"
            onClick={() => setActiveTab("SERVICES")}
          >
            Services ({services.length})
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Products Column */}
        {showProducts && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-indigo-400" />
              <h5 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Products ({products.length})
              </h5>
            </div>

            {products.length === 0 ? (
              <Card className="border border-dashed border-border/60 bg-surface/20">
                <CardContent className="p-6 text-center text-xs text-muted-foreground">
                  No products extracted.
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {products.map((prod) => (
                  <Card
                    key={prod.id}
                    className="border border-border/60 bg-surface-elevated/40 hover:bg-surface-elevated/60 transition-colors"
                  >
                    <CardContent className="p-4 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-0.5">
                          <h6 className="text-sm font-semibold text-foreground">
                            {prod.name}
                          </h6>
                          {prod.category && (
                            <Badge variant="outline" className="text-[10px] font-mono">
                              {prod.category}
                            </Badge>
                          )}
                        </div>
                        {prod.price && (
                          <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 text-xs font-mono font-semibold">
                            {prod.price}
                          </Badge>
                        )}
                      </div>

                      {prod.description && (
                        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                          {prod.description}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Services Column */}
        {showServices && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-cyan-400" />
              <h5 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Services ({services.length})
              </h5>
            </div>

            {services.length === 0 ? (
              <Card className="border border-dashed border-border/60 bg-surface/20">
                <CardContent className="p-6 text-center text-xs text-muted-foreground">
                  No services extracted.
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {services.map((serv) => (
                  <Card
                    key={serv.id}
                    className="border border-border/60 bg-surface-elevated/40 hover:bg-surface-elevated/60 transition-colors"
                  >
                    <CardContent className="p-4 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-0.5">
                          <h6 className="text-sm font-semibold text-foreground">
                            {serv.name}
                          </h6>
                          {serv.category && (
                            <Badge variant="outline" className="text-[10px] font-mono">
                              {serv.category}
                            </Badge>
                          )}
                        </div>
                        <Badge variant="secondary" className="text-[10px] font-mono">
                          ACTIVE SERVICE
                        </Badge>
                      </div>

                      {serv.description && (
                        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                          {serv.description}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
