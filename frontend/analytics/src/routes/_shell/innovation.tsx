import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  InnovationDashboardOverviewCard,
  ExperimentDirectoryCard,
  ExperimentalModelRegistryCard,
  EvaluationGatePromotionCard,
  MultimodalAgentTestingCard,
  CreateExperimentModal,
} from "@/components/innovation";
import { innovationLabService } from "@/services";
import {
  FlaskConical,
  Sparkles,
  Cpu,
  ShieldCheck,
  RefreshCw,
  Plus,
  Layers,
  Eye,
  Radio,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import type { CreateExperimentInput } from "@/types";

export const Route = createFileRoute("/_shell/innovation")({
  head: () => ({
    meta: [
      { title: "Dyvin AI | AI Innovation Lab & Experimentation Sandbox" },
      {
        name: "description",
        content:
          "Enterprise AI Innovation Lab & Experimentation Sandbox: Air-gapped model testing, bleeding-edge previews, prompt tournaments, and evaluation gates.",
      },
      {
        property: "og:title",
        content: "Dyvin AI | AI Innovation Lab & Experimentation Sandbox",
      },
      {
        property: "og:description",
        content:
          "Enterprise AI Innovation Lab & Experimentation Sandbox: Air-gapped model testing, bleeding-edge previews, prompt tournaments, and evaluation gates.",
      },
    ],
  }),
  component: InnovationLabPage,
});

function InnovationLabPage() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("overview");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. Dashboard Overview
  const {
    data: overview,
    isLoading: isLoadingOverview,
    refetch: refetchOverview,
    isFetching: isFetchingOverview,
  } = useQuery({
    queryKey: ["innovation-dashboard"],
    queryFn: () => innovationLabService.getDashboard(),
    staleTime: 30_000,
  });

  // 2. Experiments
  const {
    data: experiments = [],
    isLoading: isLoadingExperiments,
    refetch: refetchExperiments,
  } = useQuery({
    queryKey: ["innovation-experiments"],
    queryFn: () => innovationLabService.getExperiments(),
    staleTime: 30_000,
  });

  // 3. Models
  const {
    data: models = [],
    isLoading: isLoadingModels,
    refetch: refetchModels,
  } = useQuery({
    queryKey: ["innovation-models"],
    queryFn: () => innovationLabService.getModels(),
    staleTime: 30_000,
  });

  // 4. Evaluations
  const {
    data: evaluations = [],
    isLoading: isLoadingEvaluations,
    refetch: refetchEvaluations,
  } = useQuery({
    queryKey: ["innovation-evaluations"],
    queryFn: () => innovationLabService.getEvaluations(),
    staleTime: 30_000,
  });

  // 5. Promotions
  const {
    data: promotions = [],
    isLoading: isLoadingPromotions,
    refetch: refetchPromotions,
  } = useQuery({
    queryKey: ["innovation-promotions"],
    queryFn: () => innovationLabService.getPromotions(),
    staleTime: 30_000,
  });

  // 6. Multimodal
  const {
    data: multimodal,
    isLoading: isLoadingMultimodal,
    refetch: refetchMultimodal,
  } = useQuery({
    queryKey: ["innovation-multimodal"],
    queryFn: () => innovationLabService.getMultimodal(),
    staleTime: 30_000,
  });

  // 7. Browser
  const {
    data: browser,
    isLoading: isLoadingBrowser,
    refetch: refetchBrowser,
  } = useQuery({
    queryKey: ["innovation-browser"],
    queryFn: () => innovationLabService.getBrowser(),
    staleTime: 30_000,
  });

  // 8. Voice
  const {
    data: voice,
    isLoading: isLoadingVoice,
    refetch: refetchVoice,
  } = useQuery({
    queryKey: ["innovation-voice"],
    queryFn: () => innovationLabService.getVoice(),
    staleTime: 30_000,
  });

  // 9. Statistics
  const {
    data: statistics,
    isLoading: isLoadingStatistics,
    refetch: refetchStatistics,
  } = useQuery({
    queryKey: ["innovation-statistics"],
    queryFn: () => innovationLabService.getStatistics(),
    staleTime: 30_000,
  });

  const handleRefreshAll = async () => {
    toast.info("Synchronizing Innovation Lab telemetry...");
    await Promise.all([
      refetchOverview(),
      refetchExperiments(),
      refetchModels(),
      refetchEvaluations(),
      refetchPromotions(),
      refetchMultimodal(),
      refetchBrowser(),
      refetchVoice(),
      refetchStatistics(),
    ]);
    toast.success("Sandbox state updated");
  };

  const handleCreateExperiment = async (input: CreateExperimentInput) => {
    setIsSubmitting(true);
    try {
      await innovationLabService.createExperiment(input);
      toast.success(`Sandboxed experiment "${input.title}" registered`);
      await refetchExperiments();
      await refetchOverview();
    } catch {
      toast.error("Failed to register sandboxed experiment");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/60 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <FlaskConical className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
                AI Innovation Lab & Experimentation Sandbox
                <Badge variant="outline" className="border-primary/40 text-primary bg-primary/10 text-xs">
                  Phase F27
                </Badge>
              </h1>
            </div>
          </div>
          <p className="text-xs md:text-sm text-foreground-muted mt-1">
            Air-gapped research sandbox for testing bleeding-edge foundation models, running multimodal evaluations, and managing promotion gates
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefreshAll}
            disabled={isFetchingOverview}
            className="h-9 gap-1.5 text-xs border-border/80 hover:bg-surface-elevated"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isFetchingOverview ? "animate-spin text-primary" : "text-foreground-muted"}`} />
            Sync Sandbox
          </Button>

          <Button
            size="sm"
            onClick={() => setIsCreateModalOpen(true)}
            className="h-9 gap-1.5 text-xs bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="h-3.5 w-3.5" />
            New Experiment
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-surface-elevated border border-border/60 p-1 rounded-xl h-auto flex flex-wrap gap-1">
          <TabsTrigger
            value="overview"
            className="gap-2 text-xs py-2 px-3 data-[state=active]:bg-surface-card data-[state=active]:text-foreground rounded-lg"
          >
            <Sparkles className="h-3.5 w-3.5 text-purple-400" />
            Sandbox Overview
          </TabsTrigger>

          <TabsTrigger
            value="experiments"
            className="gap-2 text-xs py-2 px-3 data-[state=active]:bg-surface-card data-[state=active]:text-foreground rounded-lg"
          >
            <FlaskConical className="h-3.5 w-3.5 text-primary" />
            Experiments ({experiments.length})
          </TabsTrigger>

          <TabsTrigger
            value="models"
            className="gap-2 text-xs py-2 px-3 data-[state=active]:bg-surface-card data-[state=active]:text-foreground rounded-lg"
          >
            <Cpu className="h-3.5 w-3.5 text-blue-400" />
            Preview Models ({models.length})
          </TabsTrigger>

          <TabsTrigger
            value="evaluations"
            className="gap-2 text-xs py-2 px-3 data-[state=active]:bg-surface-card data-[state=active]:text-foreground rounded-lg"
          >
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            Gates & Promotions ({evaluations.length})
          </TabsTrigger>

          <TabsTrigger
            value="multimodal"
            className="gap-2 text-xs py-2 px-3 data-[state=active]:bg-surface-card data-[state=active]:text-foreground rounded-lg"
          >
            <Eye className="h-3.5 w-3.5 text-amber-400" />
            Multimodal & Agents
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: OVERVIEW */}
        <TabsContent value="overview" className="space-y-6">
          <InnovationDashboardOverviewCard
            overview={overview}
            statistics={statistics}
            onNavigateTab={setActiveTab}
            onOpenCreateModal={() => setIsCreateModalOpen(true)}
            isLoading={isLoadingOverview}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ExperimentDirectoryCard
              experiments={experiments.slice(0, 4)}
              onOpenCreateModal={() => setIsCreateModalOpen(true)}
              isLoading={isLoadingExperiments}
            />

            <EvaluationGatePromotionCard
              evaluations={evaluations}
              promotions={promotions}
              isLoading={isLoadingEvaluations || isLoadingPromotions}
            />
          </div>
        </TabsContent>

        {/* TAB 2: EXPERIMENTS */}
        <TabsContent value="experiments">
          <ExperimentDirectoryCard
            experiments={experiments}
            onOpenCreateModal={() => setIsCreateModalOpen(true)}
            isLoading={isLoadingExperiments}
          />
        </TabsContent>

        {/* TAB 3: MODELS */}
        <TabsContent value="models">
          <ExperimentalModelRegistryCard
            models={models}
            isLoading={isLoadingModels}
          />
        </TabsContent>

        {/* TAB 4: EVALUATIONS & PROMOTIONS */}
        <TabsContent value="evaluations">
          <EvaluationGatePromotionCard
            evaluations={evaluations}
            promotions={promotions}
            isLoading={isLoadingEvaluations || isLoadingPromotions}
          />
        </TabsContent>

        {/* TAB 5: MULTIMODAL & AGENTS */}
        <TabsContent value="multimodal">
          <MultimodalAgentTestingCard
            multimodal={multimodal}
            browser={browser}
            voice={voice}
            isLoading={isLoadingMultimodal || isLoadingBrowser || isLoadingVoice}
          />
        </TabsContent>
      </Tabs>

      {/* Modal Dialog */}
      <CreateExperimentModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateExperiment}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
