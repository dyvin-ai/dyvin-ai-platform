import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ShoppingBag,
  Search,
  Star,
  Download,
  Check,
  Plus,
  Sparkles,
  PackageCheck,
  Shield,
  Zap,
} from "lucide-react";
import type { MarketplaceListingItem } from "@/types";

interface MarketplaceExplorerCardProps {
  listings: MarketplaceListingItem[];
  isLoading?: boolean;
  onPublishListingClick: () => void;
}

export function MarketplaceExplorerCard({
  listings,
  isLoading = false,
  onPublishListingClick,
}: MarketplaceExplorerCardProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [installedMap, setInstalledMap] = useState<Record<string, boolean>>({});

  const categories = [
    "ALL",
    "AI_WORKFLOW_TEMPLATES",
    "INTELLIGENCE_MODULES",
    "MODEL_PLUGINS",
    "CRM_INTEGRATIONS",
    "SECURITY_POLICIES",
    "RETRIEVAL_CONNECTORS",
  ];

  const filteredListings = useMemo(() => {
    return listings.filter((item) => {
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "ALL" || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [listings, searchQuery, selectedCategory]);

  const toggleInstall = (id: string, title: string) => {
    setInstalledMap((prev) => {
      const nextState = !prev[id];
      if (nextState) {
        // Installed
      }
      return { ...prev, [id]: nextState };
    });
  };

  return (
    <Card className="border border-border/60 bg-card/60 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-purple-400" />
              Enterprise AI App Marketplace
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground mt-1">
              Curated enterprise AI extensions, prompt architectures, schema generators, and workflow templates.
            </CardDescription>
          </div>
          <Button onClick={onPublishListingClick} size="sm" className="gap-1.5 bg-purple-600 hover:bg-purple-700 text-white shrink-0">
            <Plus className="w-4 h-4" />
            <span>Publish New Listing</span>
          </Button>
        </div>

        {/* Search & Categories */}
        <div className="flex flex-col sm:flex-row gap-3 pt-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search marketplace listings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-background/50 border-border/70 text-sm"
            />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {categories.map((cat) => (
              <Button
                key={cat}
                variant={selectedCategory === cat ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(cat)}
                className={`text-xs px-2.5 py-1 h-8 ${
                  selectedCategory === cat ? "bg-purple-600 text-white" : "border-border/60 text-muted-foreground"
                }`}
              >
                {cat === "ALL" ? "All Categories" : cat.replace(/_/g, " ")}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="py-12 text-center text-muted-foreground animate-pulse">
            Loading marketplace offerings...
          </div>
        ) : filteredListings.length === 0 ? (
          <div className="py-12 text-center border border-dashed border-border/60 rounded-xl">
            <ShoppingBag className="w-10 h-10 mx-auto text-muted-foreground mb-2" />
            <p className="text-base font-medium text-foreground">No listings found</p>
            <p className="text-sm text-muted-foreground mt-1">
              {searchQuery ? "Try searching for a different keyword or category." : "Be the first to publish to the marketplace!"}
            </p>
            <Button onClick={onPublishListingClick} size="sm" className="mt-4 gap-1.5 bg-purple-600 hover:bg-purple-700 text-white">
              <Plus className="w-4 h-4" />
              <span>Publish Listing</span>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredListings.map((item) => {
              const isInstalled = !!installedMap[item.id];
              return (
                <Card
                  key={item.id}
                  className="border border-border/50 bg-background/40 hover:border-purple-500/40 hover:bg-card/70 transition-all flex flex-col justify-between"
                >
                  <CardContent className="p-5 space-y-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1">
                        <Badge variant="outline" className="text-[10px] tracking-wider uppercase border-purple-500/30 text-purple-400 bg-purple-500/10">
                          {item.category.replace(/_/g, " ")}
                        </Badge>
                        <h4 className="font-semibold text-foreground text-sm line-clamp-1">{item.title}</h4>
                      </div>
                      <div className="text-right shrink-0">
                        {item.price === 0 ? (
                          <Badge className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs">
                            Free
                          </Badge>
                        ) : (
                          <span className="font-bold text-foreground text-sm">${item.price.toFixed(2)}</span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
                      <div className="flex items-center gap-1 text-amber-400">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span className="font-medium text-foreground">{item.rating ? item.rating.toFixed(1) : "5.0"}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Download className="w-3.5 h-3.5" />
                        <span>{item.downloads.toLocaleString()} downloads</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-border/40">
                      <Button
                        size="sm"
                        variant={isInstalled ? "outline" : "default"}
                        onClick={() => toggleInstall(item.id, item.title)}
                        className={`w-full text-xs h-8 gap-1.5 ${
                          isInstalled
                            ? "border-emerald-500/40 text-emerald-400 bg-emerald-500/10"
                            : "bg-purple-600 hover:bg-purple-700 text-white"
                        }`}
                      >
                        {isInstalled ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Installed</span>
                          </>
                        ) : (
                          <>
                            <PackageCheck className="w-3.5 h-3.5" />
                            <span>Install & Activate</span>
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
