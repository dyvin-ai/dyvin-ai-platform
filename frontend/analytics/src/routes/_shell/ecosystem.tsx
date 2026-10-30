import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  EcosystemOverviewDashboardCard,
  CertifiedAgencyDirectoryCard,
  TechnologyPartnerDirectoryCard,
  PartnerMarketplaceDirectoryCard,
  ReferralCommissionConsole,
  AcademyCertificationConsole,
} from "@/components/ecosystem";
import { ecosystemService } from "@/services";
import {
  Handshake,
  Building,
  Layers,
  ShoppingBag,
  DollarSign,
  GraduationCap,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import type { RegisterAgencyInput, RegisterPartnerInput, CreateReferralInput, PartnerListingItem } from "@/types";

export const Route = createFileRoute("/_shell/ecosystem")({
  head: () => ({
    meta: [
      { title: "Dyvin AI | Enterprise Partner Ecosystem & Marketplace" },
      {
        name: "description",
        content:
          "Enterprise Partner Ecosystem & Marketplace: Certified Agency Network, Technology Integrations, Professional Certifications & Affiliate Programs.",
      },
      {
        property: "og:title",
        content: "Dyvin AI | Enterprise Partner Ecosystem & Marketplace",
      },
      {
        property: "og:description",
        content:
          "Enterprise Partner Ecosystem & Marketplace: Certified Agency Network, Technology Integrations, Professional Certifications & Affiliate Programs.",
      },
    ],
  }),
  component: PartnerEcosystemPage,
});

function PartnerEcosystemPage() {
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState("overview");
  const [isAgencyModalOpen, setIsAgencyModalOpen] = useState(false);
  const [isPartnerModalOpen, setIsPartnerModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. Dashboard Overview
  const {
    data: overview,
    isLoading: isLoadingOverview,
    refetch: refetchOverview,
    isFetching: isFetchingOverview,
  } = useQuery({
    queryKey: ["ecosystem-dashboard"],
    queryFn: () => ecosystemService.getDashboard(),
    staleTime: 30_000,
  });

  // 2. Agencies
  const {
    data: agencies,
    isLoading: isLoadingAgencies,
    refetch: refetchAgencies,
  } = useQuery({
    queryKey: ["ecosystem-agencies"],
    queryFn: () => ecosystemService.getAgencies(),
    staleTime: 30_000,
  });

  // 3. Partners
  const {
    data: partners,
    isLoading: isLoadingPartners,
    refetch: refetchPartners,
  } = useQuery({
    queryKey: ["ecosystem-partners"],
    queryFn: () => ecosystemService.getPartners(),
    staleTime: 30_000,
  });

  // 4. Marketplace
  const {
    data: marketplace,
    isLoading: isLoadingMarketplace,
    refetch: refetchMarketplace,
  } = useQuery({
    queryKey: ["ecosystem-marketplace"],
    queryFn: () => ecosystemService.getMarketplace(),
    staleTime: 60_000,
  });

  // 5. Referrals
  const {
    data: referrals,
    isLoading: isLoadingReferrals,
    refetch: refetchReferrals,
  } = useQuery({
    queryKey: ["ecosystem-referrals"],
    queryFn: () => ecosystemService.getReferrals(),
    staleTime: 30_000,
  });

  // 6. Academy & Certifications
  const { data: courses, refetch: refetchCourses } = useQuery({
    queryKey: ["ecosystem-academy"],
    queryFn: () => ecosystemService.getAcademy(),
    staleTime: 60_000,
  });

  const { data: certifications, refetch: refetchCertifications } = useQuery({
    queryKey: ["ecosystem-certifications"],
    queryFn: () => ecosystemService.getCertifications(),
    staleTime: 60_000,
  });

  const { data: communityPosts, refetch: refetchCommunity } = useQuery({
    queryKey: ["ecosystem-community"],
    queryFn: () => ecosystemService.getCommunity(),
    staleTime: 60_000,
  });

  const { data: events, refetch: refetchEvents } = useQuery({
    queryKey: ["ecosystem-events"],
    queryFn: () => ecosystemService.getEvents(),
    staleTime: 60_000,
  });

  const handleRefreshAll = async () => {
    try {
      await Promise.all([
        refetchOverview(),
        refetchAgencies(),
        refetchPartners(),
        refetchMarketplace(),
        refetchReferrals(),
        refetchCourses(),
        refetchCertifications(),
        refetchCommunity(),
        refetchEvents(),
      ]);
      toast.success("Partner Ecosystem metrics refreshed successfully");
    } catch {
      toast.error("Failed to refresh ecosystem data");
    }
  };

  const handleRegisterAgency = async (input: RegisterAgencyInput) => {
    try {
      setIsSubmitting(true);
      await ecosystemService.registerAgency(input);
      await queryClient.invalidateQueries({ queryKey: ["ecosystem-agencies"] });
      await queryClient.invalidateQueries({ queryKey: ["ecosystem-dashboard"] });
      toast.success(`Agency '${input.agencyName}' registered successfully!`);
    } catch (err: any) {
      toast.error(`Registration failed: ${err.message || "Unknown error"}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegisterPartner = async (input: RegisterPartnerInput) => {
    try {
      setIsSubmitting(true);
      await ecosystemService.registerPartner(input);
      await queryClient.invalidateQueries({ queryKey: ["ecosystem-partners"] });
      await queryClient.invalidateQueries({ queryKey: ["ecosystem-dashboard"] });
      toast.success(`Partner '${input.companyName}' application submitted!`);
    } catch (err: any) {
      toast.error(`Application failed: ${err.message || "Unknown error"}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateReferral = async (input: CreateReferralInput) => {
    try {
      setIsSubmitting(true);
      await ecosystemService.createReferral(input);
      await queryClient.invalidateQueries({ queryKey: ["ecosystem-referrals"] });
      toast.success(`Referral code '${input.refCode}' created successfully!`);
    } catch (err: any) {
      toast.error(`Referral creation failed: ${err.message || "Unknown error"}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBookListing = (listing: PartnerListingItem) => {
    toast.success(`Proposal requested for '${listing.title}'. The agency will contact you shortly.`);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/60 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-primary/10 border border-primary/20 text-primary">
              <Handshake className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl md:text-2xl font-bold tracking-tight text-foreground font-display">
                  Partner Ecosystem & Marketplace
                </h1>
                <Badge className="bg-primary/15 text-primary border-primary/30 text-xs">
                  Phase F25
                </Badge>
              </div>
              <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
                Certified agency network, technology integrations, affiliate commissions, and professional certifications.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefreshAll}
            disabled={isFetchingOverview}
            className="border-border/60 text-xs gap-1.5 h-8 font-medium"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isFetchingOverview ? "animate-spin" : ""}`} />
            Refresh Ecosystem
          </Button>
        </div>
      </div>

      {/* Main Feature Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-surface-elevated/80 border border-border/60 p-1 rounded-xl flex flex-wrap gap-1">
          <TabsTrigger
            value="overview"
            className="text-xs font-semibold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-1.5 rounded-lg"
          >
            <Handshake className="w-3.5 h-3.5" />
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="agencies"
            className="text-xs font-semibold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-1.5 rounded-lg"
          >
            <Building className="w-3.5 h-3.5" />
            Certified Agencies
          </TabsTrigger>
          <TabsTrigger
            value="partners"
            className="text-xs font-semibold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-1.5 rounded-lg"
          >
            <Layers className="w-3.5 h-3.5" />
            Tech Partners
          </TabsTrigger>
          <TabsTrigger
            value="marketplace"
            className="text-xs font-semibold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-1.5 rounded-lg"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            Services Marketplace
          </TabsTrigger>
          <TabsTrigger
            value="referrals"
            className="text-xs font-semibold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-1.5 rounded-lg"
          >
            <DollarSign className="w-3.5 h-3.5" />
            Affiliate Referrals
          </TabsTrigger>
          <TabsTrigger
            value="academy"
            className="text-xs font-semibold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-1.5 rounded-lg"
          >
            <GraduationCap className="w-3.5 h-3.5" />
            Academy & Certifications
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Overview */}
        <TabsContent value="overview" className="space-y-6">
          <EcosystemOverviewDashboardCard
            overview={overview}
            onNavigateTab={setActiveTab}
            onOpenAgencyModal={() => {
              setActiveTab("agencies");
              setIsAgencyModalOpen(true);
            }}
            onOpenPartnerModal={() => {
              setActiveTab("partners");
              setIsPartnerModalOpen(true);
            }}
            isLoading={isLoadingOverview}
          />
        </TabsContent>

        {/* Tab 2: Certified Agencies */}
        <TabsContent value="agencies" className="space-y-6">
          <CertifiedAgencyDirectoryCard
            agencies={agencies}
            onRegisterAgency={handleRegisterAgency}
            isRegistering={isSubmitting}
            isOpenModal={isAgencyModalOpen}
            onCloseModal={() => setIsAgencyModalOpen(false)}
            isLoading={isLoadingAgencies}
          />
        </TabsContent>

        {/* Tab 3: Tech Partners */}
        <TabsContent value="partners" className="space-y-6">
          <TechnologyPartnerDirectoryCard
            partners={partners}
            onRegisterPartner={handleRegisterPartner}
            isRegistering={isSubmitting}
            isOpenModal={isPartnerModalOpen}
            onCloseModal={() => setIsPartnerModalOpen(false)}
            isLoading={isLoadingPartners}
          />
        </TabsContent>

        {/* Tab 4: Services Marketplace */}
        <TabsContent value="marketplace" className="space-y-6">
          <PartnerMarketplaceDirectoryCard
            listings={marketplace}
            onBookListing={handleBookListing}
            isLoading={isLoadingMarketplace}
          />
        </TabsContent>

        {/* Tab 5: Affiliate Referrals */}
        <TabsContent value="referrals" className="space-y-6">
          <ReferralCommissionConsole
            referrals={referrals}
            onCreateReferral={handleCreateReferral}
            isCreating={isSubmitting}
            isLoading={isLoadingReferrals}
          />
        </TabsContent>

        {/* Tab 6: Academy & Certifications */}
        <TabsContent value="academy" className="space-y-6">
          <AcademyCertificationConsole
            courses={courses}
            certifications={certifications}
            communityPosts={communityPosts}
            events={events}
            isLoading={isLoadingOverview}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
