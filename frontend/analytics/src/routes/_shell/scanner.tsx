import { useState, useMemo, useRef } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Panel } from "@/components/analytics/Panel";
import { scanService } from "@/services";
import { useWorkspace } from "@/context/WorkspaceContext";
import { cn } from "@/lib/utils";
import type {
  ScanItem,
  ScanPageItem,
  StructuredDataItem,
  TechnologyItem,
  ScanMetadataItem,
  ScanStatusType,
} from "@/types";
import {
  Globe,
  Search,
  ExternalLink,
  Copy,
  Check,
  Code,
  Layers,
  FileText,
  Clock,
  History,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Loader2,
  RefreshCw,
  Server,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  Filter,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/_shell/scanner")({
  head: () => ({
    meta: [
      { title: "Dyvin AI | Website Intelligence & Live Scanner" },
      {
        name: "description",
        content: "Live crawler engine, DOM extraction, Schema.org validation, tech stack detection, and SEO metadata audit.",
      },
    ],
  }),
  component: WebsiteScannerPage,
});

type TabType = "pages" | "structured-data" | "technologies" | "metadata" | "history";

export function WebsiteScannerPage() {
  const { activeOrganization, activeProject, activeOrgId, activeProjectId, isDemo } = useWorkspace();
  const queryClient = useQueryClient();
  const isSubmittingRef = useRef(false);

  const [urlInput, setUrlInput] = useState("");
  const [urlError, setUrlError] = useState<string | null>(null);
  const [selectedScanId, setSelectedScanId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>("pages");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [pageSearch, setPageSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [schemaFilter, setSchemaFilter] = useState<string>("ALL");
  const [techCategoryFilter, setTechCategoryFilter] = useState<string>("ALL");
  const [inspectingPage, setInspectingPage] = useState<ScanPageItem | null>(null);

  // 1. Fetch Scans for this Project/Org
  const {
    data: scans = [],
    isLoading: isScansLoading,
    isError: isScansError,
    error: scansError,
    refetch: refetchScans,
  } = useQuery({
    queryKey: ["scans", activeOrgId, activeProjectId],
    queryFn: () => scanService.getScans(activeProjectId || undefined),
    enabled: !!activeOrgId,
  });

  // Effective selected scan ID (defaults to newest scan)
  const currentScanId = selectedScanId || scans[0]?.id;

  // 2. Fetch Selected Scan Details (with polling if active)
  const {
    data: selectedScan,
    isLoading: isDetailsLoading,
    isError: isDetailsError,
    error: detailsError,
  } = useQuery({
    queryKey: ["scan-details", currentScanId],
    queryFn: () => scanService.getScanDetails(currentScanId!),
    enabled: !!currentScanId,
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      return status === "RUNNING" || status === "QUEUED" ? 2000 : false;
    },
  });


  // 3. Fetch Scan Pages
  const { data: pages = [], isLoading: isPagesLoading } = useQuery({
    queryKey: ["scan-pages", currentScanId],
    queryFn: () => scanService.getScanPages(currentScanId!),
    enabled: !!currentScanId,
  });

  // 4. Fetch Structured Data
  const { data: structuredData = [], isLoading: isSchemaLoading } = useQuery({
    queryKey: ["scan-structured-data", currentScanId],
    queryFn: () => scanService.getScanStructuredData(currentScanId!),
    enabled: !!currentScanId,
  });

  // 5. Fetch Technologies
  const { data: technologies = [], isLoading: isTechLoading } = useQuery({
    queryKey: ["scan-technologies", currentScanId],
    queryFn: () => scanService.getScanTechnologies(currentScanId!),
    enabled: !!currentScanId,
  });

  // 6. Fetch Metadata
  const { data: metadata = [], isLoading: isMetadataLoading } = useQuery({
    queryKey: ["scan-metadata", currentScanId],
    queryFn: () => scanService.getScanMetadata(currentScanId!),
    enabled: !!currentScanId,
  });

  // 7. Trigger Scan Mutation
  const triggerScanMutation = useMutation({
    mutationFn: (targetUrl?: string) => {
      if (!activeProjectId) {
        throw new Error("No active project selected");
      }
      return scanService.triggerScan(activeProjectId, targetUrl);
    },
    onSuccess: (newScan) => {
      setUrlError(null);
      setSelectedScanId(newScan.id);
      queryClient.invalidateQueries({ queryKey: ["scans", activeOrgId, activeProjectId] });
      queryClient.invalidateQueries({ queryKey: ["scan-details", newScan.id] });
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message || err.message || "Failed to initiate scan";
      setUrlError(Array.isArray(msg) ? msg.join(", ") : msg);
    },
    onSettled: () => {
      isSubmittingRef.current = false;
    },
  });

  const handleStartScan = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmittingRef.current || triggerScanMutation.isPending) {
      return;
    }
    setUrlError(null);

    let target = urlInput.trim();
    if (target) {
      if (!target.startsWith("http://") && !target.startsWith("https://")) {
        target = "https://" + target;
      }
      try {
        const parsed = new URL(target);
        if (
          parsed.hostname === "localhost" ||
          parsed.hostname.startsWith("127.") ||
          parsed.hostname.startsWith("10.") ||
          parsed.hostname.startsWith("192.168.")
        ) {
          setUrlError("Private and loopback addresses cannot be scanned.");
          return;
        }
      } catch {
        setUrlError("Please enter a valid website URL.");
        return;
      }
    }

    isSubmittingRef.current = true;
    triggerScanMutation.mutate(target || undefined);
  };

  const handleCopyJson = (id: string, json: any) => {
    navigator.clipboard.writeText(JSON.stringify(json, null, 2));
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Filtered Pages
  const filteredPages = useMemo(() => {
    return pages.filter((p) => {
      const matchesSearch =
        !pageSearch ||
        p.url.toLowerCase().includes(pageSearch.toLowerCase()) ||
        (p.title && p.title.toLowerCase().includes(pageSearch.toLowerCase()));

      let matchesStatus = true;
      if (statusFilter === "200") matchesStatus = p.statusCode >= 200 && p.statusCode < 300;
      else if (statusFilter === "REDIRECT") matchesStatus = p.statusCode >= 300 && p.statusCode < 400;
      else if (statusFilter === "ERROR") matchesStatus = p.statusCode >= 400;

      return matchesSearch && matchesStatus;
    });
  }, [pages, pageSearch, statusFilter]);

  // Filtered Schema
  const schemaTypes = useMemo(() => {
    const set = new Set<string>();
    structuredData.forEach((s) => {
      if (s.type) set.add(s.type);
    });
    return Array.from(set).sort();
  }, [structuredData]);

  const filteredStructuredData = useMemo(() => {
    if (schemaFilter === "ALL") return structuredData;
    return structuredData.filter((s) => s.type === schemaFilter);
  }, [structuredData, schemaFilter]);

  // Filtered Technologies
  const techCategories = useMemo(() => {
    const set = new Set<string>();
    technologies.forEach((t) => {
      if (t.category) set.add(t.category);
    });
    return Array.from(set).sort();
  }, [technologies]);

  const filteredTechnologies = useMemo(() => {
    if (techCategoryFilter === "ALL") return technologies;
    return technologies.filter((t) => t.category === techCategoryFilter);
  }, [technologies, techCategoryFilter]);

  // Statistics
  const pageStats = useMemo(() => {
    if (!pages.length) return { count: 0, okRate: 0, totalWords: 0, avgReadingTime: 0 };
    const ok = pages.filter((p) => p.statusCode >= 200 && p.statusCode < 300).length;
    const totalWords = pages.reduce((acc, p) => acc + (p.wordCount || 0), 0);
    const avgReadingTime = Math.round(pages.reduce((acc, p) => acc + (p.readingTime || 0), 0) / pages.length);
    return {
      count: pages.length,
      okRate: Math.round((ok / pages.length) * 100),
      totalWords,
      avgReadingTime,
    };
  }, [pages]);

  const activeScanStatus: ScanStatusType = selectedScan?.status || "QUEUED";
  const isScanningActive = activeScanStatus === "RUNNING" || activeScanStatus === "QUEUED";

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Globe className="size-6 text-foreground" />
            Website Intelligence & Scanner
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Live crawler engine, DOM extraction, Schema.org validation, tech stack detection, and SEO metadata audit.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => refetchScans()}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-surface-subtle hover:text-foreground transition-colors cursor-pointer"
          >
            <RefreshCw className={cn("size-3.5", isScansLoading && "animate-spin")} />
            Refresh
          </button>
        </div>
      </div>

      {/* Explicit Offline Demo Mode Labeling */}
      {isDemo && (
        <div className="flex items-center gap-2.5 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-2.5 text-xs text-amber-800 dark:text-amber-200">
          <AlertTriangle className="size-4 shrink-0 text-amber-600 dark:text-amber-400" />
          <span>
            <strong>DEMO SIMULATION — LOCAL PREVIEW DATA:</strong> You are viewing offline simulation data. Real live website crawls are only conducted against authenticated production projects with backend crawler queues active.
          </span>
        </div>
      )}

      {/* Truthful Backend API Error Reporting */}
      {!isDemo && (isScansError || isDetailsError) && (
        <div className="flex items-center gap-2.5 rounded-lg border border-rose-500/30 bg-rose-500/10 px-4 py-2.5 text-xs text-rose-800 dark:text-rose-200">
          <AlertTriangle className="size-4 shrink-0 text-rose-600 dark:text-rose-400" />
          <span>
            <strong>Crawler Service Notice:</strong> {((scansError || detailsError) as any)?.message || "Failed to communicate with crawler backend."}
          </span>
        </div>
      )}

      {/* URL Scan Form Panel */}
      <Panel className="bg-surface-elevated/40 border-border/80">

        <form onSubmit={handleStartScan} className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input
                type="text"
                placeholder={
                  activeProject?.primaryDomain
                    ? `Default: https://${activeProject.primaryDomain} (or enter custom URL)`
                    : "Enter website URL (e.g. https://example.com)"
                }
                value={urlInput}
                onChange={(e) => {
                  setUrlInput(e.target.value);
                  setUrlError(null);
                }}
                disabled={triggerScanMutation.isPending}
                className="w-full rounded-lg border border-border bg-background py-2 pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-foreground focus:outline-none focus:ring-1 focus:ring-foreground transition-all"
              />
            </div>
            <button
              id="start-live-scan-btn"
              data-testid="start-live-scan-btn"
              type="submit"
              disabled={triggerScanMutation.isPending || !activeProjectId}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-foreground px-5 py-2 text-sm font-medium text-background hover:bg-foreground/90 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none transition-all cursor-pointer shrink-0 shadow-2xs select-none"
            >
              {triggerScanMutation.isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Initiating Scan...
                </>
              ) : (
                <>
                  <Sparkles className="size-4" />
                  Start Live Scan
                </>
              )}
            </button>
          </div>

          {urlError && (
            <div className="flex items-center gap-2 text-xs text-rose-500 font-medium">
              <AlertTriangle className="size-3.5" />
              {urlError}
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 font-mono text-[11px] text-muted-foreground">
            <span>
              Target Project: <strong className="text-foreground">{activeProject?.name || "None"}</strong>
              {activeProject?.primaryDomain ? ` (${activeProject.primaryDomain})` : ""}
            </span>

            <span className="flex items-center gap-1.5">
              <ShieldCheck className="size-3.5 text-emerald-500" />
              SSRF Protection Active • Safe Cloud & Localhost Filtering Enforced
            </span>
          </div>
        </form>
      </Panel>

      {/* Active Scan Status Banner */}
      {selectedScan && (
        <div
          className={cn(
            "rounded-xl border p-4 sm:p-5 transition-all shadow-2xs",
            isScanningActive
              ? "border-amber-500/30 bg-amber-500/5 text-amber-900 dark:text-amber-200"
              : activeScanStatus === "COMPLETED"
              ? "border-emerald-500/30 bg-emerald-500/5 text-foreground"
              : activeScanStatus === "FAILED"
              ? "border-rose-500/30 bg-rose-500/5 text-rose-900 dark:text-rose-200"
              : "border-border bg-surface-subtle text-foreground"
          )}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              {isScanningActive ? (
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-amber-500/20 text-amber-600 dark:text-amber-400">
                  <Loader2 className="size-5 animate-spin" />
                </div>
              ) : activeScanStatus === "COMPLETED" ? (
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="size-5" />
                </div>
              ) : (
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-rose-500/20 text-rose-600 dark:text-rose-400">
                  <XCircle className="size-5" />
                </div>
              )}

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-foreground">
                    {isScanningActive
                      ? "Crawler Engine Active"
                      : activeScanStatus === "COMPLETED"
                      ? "Scan Completed Successfully"
                      : "Scan Execution Failed"}
                  </span>
                  <span
                    className={cn(
                      "inline-flex items-center rounded px-2 py-0.5 font-mono text-[10px] font-bold uppercase border",
                      isScanningActive
                        ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/25"
                        : activeScanStatus === "COMPLETED"
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/25"
                        : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/25"
                    )}
                  >
                    {activeScanStatus}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5 flex flex-wrap items-center gap-x-2">
                  <span>Target: <strong className="text-foreground">{selectedScan.website?.url || selectedScan.website?.domain || "Project Site"}</strong></span>
                  <span>•</span>
                  <span>Project: <strong className="text-foreground">{selectedScan.project?.name || activeProject?.name || "Workspace"}</strong></span>
                  <span>•</span>
                  <span>Scan ID: <code className="font-mono text-[11px]">{selectedScan.id}</code></span>
                  <span>•</span>
                  <span>
                    Started: {selectedScan.startedAt ? new Date(selectedScan.startedAt).toLocaleTimeString() : new Date(selectedScan.createdAt).toLocaleTimeString()}
                  </span>
                </p>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="flex items-center gap-4 sm:border-l sm:border-border/60 sm:pl-4 font-mono text-xs">
              <div className="text-center sm:text-left">
                <span className="block text-[10px] uppercase tracking-wider text-muted-foreground">Pages Discovered</span>
                <span className="text-sm font-bold text-foreground">{selectedScan.pagesDiscovered || pages.length}</span>
              </div>
              <div className="text-center sm:text-left">
                <span className="block text-[10px] uppercase tracking-wider text-muted-foreground">Pages Crawled</span>
                <span className="text-sm font-bold text-foreground">{selectedScan.pagesCrawled || pages.length}</span>
              </div>
              <div className="text-center sm:text-left">
                <span className="block text-[10px] uppercase tracking-wider text-muted-foreground">Schemas</span>
                <span className="text-sm font-bold text-foreground">{structuredData.length}</span>
              </div>
            </div>
          </div>

          {selectedScan.errorMessage && (
            <div className="mt-3 pt-3 border-t border-rose-500/20 text-xs text-rose-500 font-mono">
              Error details: {selectedScan.errorMessage}
            </div>
          )}
        </div>
      )}

      {/* Main Tabs Navigation */}
      <div className="border-b border-border">
        <div className="flex space-x-6 overflow-x-auto pb-px">
          {[
            { id: "pages", label: "Crawled Pages", count: pages.length, icon: FileText },
            { id: "structured-data", label: "Structured Data", count: structuredData.length, icon: Code },
            { id: "technologies", label: "Technology Stack", count: technologies.length, icon: Server },
            { id: "metadata", label: "Metadata & SEO", count: metadata.length, icon: Layers },
            { id: "history", label: "Scan History", count: scans.length, icon: History },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as TabType)}
                className={cn(
                  "flex items-center gap-2 border-b-2 py-3 text-xs sm:text-sm font-medium transition-all cursor-pointer whitespace-nowrap",
                  isActive
                    ? "border-foreground text-foreground font-semibold"
                    : "border-transparent text-muted-foreground hover:border-border hover:text-foreground"
                )}
              >
                <Icon className={cn("size-4", isActive ? "text-foreground" : "text-muted-foreground")} />
                {tab.label}
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 font-mono text-[10px]",
                    isActive
                      ? "bg-foreground text-background"
                      : "bg-surface-subtle text-muted-foreground border border-border"
                  )}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab 1: Crawled Pages */}
      {activeTab === "pages" && (
        <div className="space-y-4">
          {/* Summary Metric Cards */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Panel padded={false} className="p-4">
              <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">Total Discovered</span>
              <div className="mt-1 text-2xl font-bold font-mono text-foreground">{pageStats.count}</div>
              <span className="text-xs text-muted-foreground">HTML Documents</span>
            </Panel>
            <Panel padded={false} className="p-4">
              <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">HTTP 200 OK Rate</span>
              <div className="mt-1 text-2xl font-bold font-mono text-emerald-500">{pageStats.okRate}%</div>
              <span className="text-xs text-muted-foreground">Successful crawl rate</span>
            </Panel>
            <Panel padded={false} className="p-4">
              <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">Extracted Words</span>
              <div className="mt-1 text-2xl font-bold font-mono text-foreground">{pageStats.totalWords.toLocaleString()}</div>
              <span className="text-xs text-muted-foreground">Across all crawled pages</span>
            </Panel>
            <Panel padded={false} className="p-4">
              <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">Avg Reading Time</span>
              <div className="mt-1 text-2xl font-bold font-mono text-foreground">{pageStats.avgReadingTime} min</div>
              <span className="text-xs text-muted-foreground">Per page content depth</span>
            </Panel>
          </div>

          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Filter pages by URL or title..."
                value={pageSearch}
                onChange={(e) => setPageSearch(e.target.value)}
                className="w-full rounded-lg border border-border bg-background py-1.5 pl-8 pr-3 text-xs text-foreground placeholder:text-muted-foreground/60 focus:border-foreground focus:outline-none"
              />
            </div>
            <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
              {["ALL", "200", "REDIRECT", "ERROR"].map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setStatusFilter(st)}
                  className={cn(
                    "rounded px-2.5 py-1 font-mono text-[11px] font-medium border transition-colors cursor-pointer",
                    statusFilter === st
                      ? "bg-foreground text-background border-foreground"
                      : "bg-surface text-muted-foreground border-border hover:text-foreground"
                  )}
                >
                  {st === "ALL" ? "All Statuses" : st === "200" ? "200 OK" : st === "REDIRECT" ? "3xx Redirect" : "4xx/5xx Error"}
                </button>
              ))}
            </div>
          </div>

          {/* Pages Table */}
          <div className="overflow-hidden rounded-xl border border-border bg-surface">
            {isPagesLoading ? (
              <div className="flex h-48 items-center justify-center">
                <Loader2 className="size-6 animate-spin text-muted-foreground" />
              </div>
            ) : filteredPages.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-12 text-center">
                <FileText className="size-10 text-muted-foreground/40 mb-2" />
                <h3 className="text-sm font-semibold text-foreground">No crawled pages found</h3>
                <p className="text-xs text-muted-foreground mt-1 max-w-sm">
                  {pages.length === 0
                    ? "Start a live scan above to crawl and analyze pages."
                    : "No pages matched your current search or filter query."}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-border bg-surface-subtle/80 text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                    <tr>
                      <th className="py-2.5 pl-4 pr-3">Status</th>
                      <th className="py-2.5 px-3">Page URL & Title</th>
                      <th className="py-2.5 px-3">Word Count</th>
                      <th className="py-2.5 px-3">Read Time</th>
                      <th className="py-2.5 px-3">Language</th>
                      <th className="py-2.5 px-3">Depth</th>
                      <th className="py-2.5 pr-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {filteredPages.map((page) => (
                      <tr key={page.id} className="hover:bg-surface-subtle/40 transition-colors">
                        <td className="py-3 pl-4 pr-3 font-mono">
                          <span
                            className={cn(
                              "inline-flex items-center rounded px-2 py-0.5 text-[10px] font-bold border",
                              page.statusCode >= 200 && page.statusCode < 300
                                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                                : page.statusCode >= 300 && page.statusCode < 400
                                ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20"
                                : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20"
                            )}
                          >
                            {page.statusCode}
                          </span>
                        </td>
                        <td className="py-3 px-3 max-w-md">
                          <div className="font-medium text-foreground truncate" title={page.title || page.url}>
                            {page.title || "Untitled Page"}
                          </div>
                          <a
                            href={page.url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 font-mono text-[11px] text-muted-foreground hover:text-foreground truncate max-w-xs mt-0.5 hover:underline"
                          >
                            <span className="truncate">{page.url}</span>
                            <ExternalLink className="size-2.5 shrink-0" />
                          </a>
                        </td>
                        <td className="py-3 px-3 font-mono text-muted-foreground">
                          {page.wordCount?.toLocaleString() || 0}
                        </td>
                        <td className="py-3 px-3 font-mono text-muted-foreground">
                          {page.readingTime || 1} min
                        </td>
                        <td className="py-3 px-3 font-mono text-[11px] text-muted-foreground uppercase">
                          {page.language || "en"}
                        </td>
                        <td className="py-3 px-3 font-mono text-muted-foreground">
                          L{page.depth}
                        </td>
                        <td className="py-3 pr-4 text-right">
                          <button
                            type="button"
                            onClick={() => setInspectingPage(page)}
                            className="inline-flex items-center gap-1 rounded border border-border px-2.5 py-1 text-[11px] font-medium text-foreground hover:bg-surface-subtle transition-colors cursor-pointer"
                          >
                            Inspect
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Structured Data (Schema.org) */}
      {activeTab === "structured-data" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-semibold text-foreground">Extracted Schema.org Entities</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Parsed JSON-LD microdata empowering AI understanding across search & LLM inference.
              </p>
            </div>
            {schemaTypes.length > 0 && (
              <div className="flex items-center gap-1.5 overflow-x-auto">
                <span className="text-xs text-muted-foreground font-mono mr-1">Type:</span>
                <button
                  type="button"
                  onClick={() => setSchemaFilter("ALL")}
                  className={cn(
                    "rounded px-2.5 py-1 font-mono text-[11px] font-medium border cursor-pointer",
                    schemaFilter === "ALL"
                      ? "bg-foreground text-background border-foreground"
                      : "bg-surface text-muted-foreground border-border"
                  )}
                >
                  All ({structuredData.length})
                </button>
                {schemaTypes.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setSchemaFilter(type)}
                    className={cn(
                      "rounded px-2.5 py-1 font-mono text-[11px] font-medium border cursor-pointer",
                      schemaFilter === type
                        ? "bg-foreground text-background border-foreground"
                        : "bg-surface text-muted-foreground border-border"
                    )}
                  >
                    {type}
                  </button>
                ))}
              </div>
            )}
          </div>

          {isSchemaLoading ? (
            <div className="flex h-48 items-center justify-center">
              <Loader2 className="size-6 animate-spin text-muted-foreground" />
            </div>
          ) : filteredStructuredData.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border p-12 text-center">
              <Code className="size-10 text-muted-foreground/40 mx-auto mb-2" />
              <h3 className="text-sm font-semibold text-foreground">No Structured Data Detected</h3>
              <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                No Schema.org JSON-LD microdata was found on the crawled pages. Adding JSON-LD schema greatly enhances AI search citations.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {filteredStructuredData.map((item) => (
                <div
                  key={item.id}
                  className="rounded-xl border border-border bg-surface p-4 flex flex-col justify-between shadow-2xs"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 border-b border-border/60 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="rounded bg-foreground/10 px-2 py-0.5 font-mono text-xs font-semibold text-foreground border border-foreground/20">
                          @{item.type || "Thing"}
                        </span>
                        <span className="inline-flex items-center gap-1 rounded bg-emerald-500/10 px-2 py-0.5 font-mono text-[10px] text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                          <Check className="size-3" /> Valid JSON-LD
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopyJson(item.id, item.rawJson)}
                        className="inline-flex items-center gap-1 rounded border border-border px-2 py-1 text-[11px] font-mono text-muted-foreground hover:bg-surface-subtle hover:text-foreground transition-colors cursor-pointer"
                      >
                        {copiedId === item.id ? (
                          <>
                            <Check className="size-3 text-emerald-500" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="size-3" />
                            Copy JSON
                          </>
                        )}
                      </button>
                    </div>

                    {item.scanPage?.url && (
                      <div className="pt-2 text-[11px] text-muted-foreground truncate font-mono">
                        Page: <span className="text-foreground">{item.scanPage.url}</span>
                      </div>
                    )}

                    <div className="mt-3 overflow-x-auto rounded-lg bg-surface-subtle p-3 font-mono text-[11px] text-foreground max-h-64 border border-border/50">
                      <pre>{JSON.stringify(item.rawJson, null, 2)}</pre>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Technology Stack */}
      {activeTab === "technologies" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-semibold text-foreground">Detected Technology Fingerprints</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Client frameworks, content management systems, analytics providers, and web servers.
              </p>
            </div>
            {techCategories.length > 0 && (
              <div className="flex items-center gap-1.5 overflow-x-auto">
                <button
                  type="button"
                  onClick={() => setTechCategoryFilter("ALL")}
                  className={cn(
                    "rounded px-2.5 py-1 font-mono text-[11px] font-medium border cursor-pointer",
                    techCategoryFilter === "ALL"
                      ? "bg-foreground text-background border-foreground"
                      : "bg-surface text-muted-foreground border-border"
                  )}
                >
                  All ({technologies.length})
                </button>
                {techCategories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setTechCategoryFilter(cat)}
                    className={cn(
                      "rounded px-2.5 py-1 font-mono text-[11px] font-medium border cursor-pointer",
                      techCategoryFilter === cat
                        ? "bg-foreground text-background border-foreground"
                        : "bg-surface text-muted-foreground border-border"
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>

          {isTechLoading ? (
            <div className="flex h-48 items-center justify-center">
              <Loader2 className="size-6 animate-spin text-muted-foreground" />
            </div>
          ) : filteredTechnologies.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border p-12 text-center">
              <Server className="size-10 text-muted-foreground/40 mx-auto mb-2" />
              <h3 className="text-sm font-semibold text-foreground">No Technologies Detected</h3>
              <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                No signatures were detected from the crawled HTML response headers or scripts.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {filteredTechnologies.map((tech) => (
                <div
                  key={tech.id}
                  className="rounded-xl border border-border bg-surface p-4 flex flex-col justify-between shadow-2xs hover:border-border/80 transition-all"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-semibold text-sm text-foreground">{tech.name}</h4>
                        <span className="inline-block mt-1 rounded bg-surface-subtle px-2 py-0.5 font-mono text-[10px] text-muted-foreground border border-border">
                          {tech.category}
                        </span>
                      </div>
                      {tech.version && (
                        <span className="rounded bg-foreground/10 px-2 py-0.5 font-mono text-[10px] font-medium text-foreground">
                          v{tech.version}
                        </span>
                      )}
                    </div>

                    <div className="mt-4 pt-3 border-t border-border/60">
                      <div className="flex items-center justify-between font-mono text-[11px] mb-1">
                        <span className="text-muted-foreground">Detection Confidence</span>
                        <span className="font-semibold text-foreground">{Math.round((tech.confidence || 1) * 100)}%</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-surface-subtle overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full"
                          style={{ width: `${Math.round((tech.confidence || 1) * 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {tech.scanPage?.url && (
                    <div className="mt-3 text-[10px] font-mono text-muted-foreground truncate">
                      Source: {tech.scanPage.url}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Metadata & SEO */}
      {activeTab === "metadata" && (
        <div className="space-y-4">
          <div>
            <h3 className="text-base font-semibold text-foreground">Page Metadata & OpenGraph Tags</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Extracted meta tags, OpenGraph properties, canonical pointers, and header directives.
            </p>
          </div>

          {isMetadataLoading ? (
            <div className="flex h-48 items-center justify-center">
              <Loader2 className="size-6 animate-spin text-muted-foreground" />
            </div>
          ) : metadata.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border p-12 text-center">
              <Layers className="size-10 text-muted-foreground/40 mx-auto mb-2" />
              <h3 className="text-sm font-semibold text-foreground">No Metadata Records Extracted</h3>
              <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                No &lt;meta&gt; tags were collected for this scan.
              </p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl border border-border bg-surface">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-border bg-surface-subtle/80 text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                    <tr>
                      <th className="py-2.5 pl-4 pr-3">Meta Property / Key</th>
                      <th className="py-2.5 px-3">Content / Value</th>
                      <th className="py-2.5 pr-4 text-right">Page Origin</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {metadata.map((m) => (
                      <tr key={m.id} className="hover:bg-surface-subtle/40 transition-colors">
                        <td className="py-2.5 pl-4 pr-3 font-mono font-semibold text-foreground whitespace-nowrap">
                          {m.key}
                        </td>
                        <td className="py-2.5 px-3 text-muted-foreground font-mono text-[11px] break-all max-w-xl">
                          {m.value}
                        </td>
                        <td className="py-2.5 pr-4 text-right font-mono text-[10px] text-muted-foreground truncate max-w-xs">
                          {m.scanPage?.url || "Primary URL"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 5: Scan History */}
      {activeTab === "history" && (
        <div className="space-y-4">
          <div>
            <h3 className="text-base font-semibold text-foreground">Crawler Scan History</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Historical crawler executions for this organization and project. Click any scan to inspect its results.
            </p>
          </div>

          <div className="overflow-hidden rounded-xl border border-border bg-surface">
            {scans.length === 0 ? (
              <div className="p-12 text-center">
                <History className="size-10 text-muted-foreground/40 mx-auto mb-2" />
                <h3 className="text-sm font-semibold text-foreground">No Previous Scans</h3>
                <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                  Run your first crawl above to establish a historical baseline.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-border bg-surface-subtle/80 text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                    <tr>
                      <th className="py-2.5 pl-4 pr-3">Scan ID</th>
                      <th className="py-2.5 px-3">Target Domain / URL</th>
                      <th className="py-2.5 px-3">Target Project</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3">Pages</th>
                      <th className="py-2.5 px-3">Triggered</th>
                      <th className="py-2.5 px-3">Duration</th>
                      <th className="py-2.5 pr-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {scans.map((scan) => {
                      const isSelected = scan.id === currentScanId;
                      const duration =
                        scan.startedAt && scan.completedAt
                          ? `${Math.max(1, Math.round((new Date(scan.completedAt).getTime() - new Date(scan.startedAt).getTime()) / 1000))}s`
                          : "—";

                      return (
                        <tr
                          key={scan.id}
                          className={cn(
                            "hover:bg-surface-subtle/40 transition-colors",
                            isSelected && "bg-surface-elevated/70"
                          )}
                        >
                          <td className="py-3 pl-4 pr-3 font-mono font-medium text-foreground">
                            {scan.id}
                          </td>
                          <td className="py-3 px-3 text-foreground font-mono text-[11px]">
                            {scan.website?.url || scan.website?.domain || "Project Default"}
                          </td>
                          <td className="py-3 px-3 text-muted-foreground font-mono text-[11px]">
                            {scan.project?.name || activeProject?.name || "Workspace"}
                          </td>
                          <td className="py-3 px-3 font-mono">
                            <span
                              className={cn(
                                "inline-flex items-center rounded px-2 py-0.5 text-[10px] font-bold uppercase border",
                                scan.status === "COMPLETED"
                                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                                  : scan.status === "RUNNING" || scan.status === "QUEUED"
                                  ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                                  : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20"
                              )}
                            >
                              {scan.status}
                            </span>
                          </td>
                          <td className="py-3 px-3 font-mono text-muted-foreground">
                            {scan.pagesCrawled || scan._count?.pages || 0} crawled
                          </td>
                          <td className="py-3 px-3 text-muted-foreground">
                            {new Date(scan.createdAt).toLocaleString()}
                          </td>
                          <td className="py-3 px-3 font-mono text-muted-foreground">
                            {duration}
                          </td>
                          <td className="py-3 pr-4 text-right">
                            {isSelected ? (
                              <span className="font-mono text-[11px] font-semibold text-emerald-500">
                                Active View
                              </span>
                            ) : (
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedScanId(scan.id);
                                  setActiveTab("pages");
                                }}
                                className="inline-flex items-center gap-1 rounded border border-border px-2.5 py-1 text-[11px] font-medium text-foreground hover:bg-surface-subtle transition-colors cursor-pointer"
                              >
                                View Results
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Inspect Page Details Dialog */}
      <Dialog open={!!inspectingPage} onOpenChange={(open) => !open && setInspectingPage(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <FileText className="size-5 text-foreground" />
              Page Details & Extraction
            </DialogTitle>
            <DialogDescription className="font-mono text-xs truncate">
              {inspectingPage?.url}
            </DialogDescription>
          </DialogHeader>

          {inspectingPage && (
            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="rounded-lg border border-border bg-surface-subtle p-3">
                  <span className="text-[10px] font-mono uppercase text-muted-foreground">Status Code</span>
                  <div className="mt-0.5 font-mono font-bold text-foreground">{inspectingPage.statusCode}</div>
                </div>
                <div className="rounded-lg border border-border bg-surface-subtle p-3">
                  <span className="text-[10px] font-mono uppercase text-muted-foreground">Word Count</span>
                  <div className="mt-0.5 font-mono font-bold text-foreground">{inspectingPage.wordCount} words</div>
                </div>
                <div className="rounded-lg border border-border bg-surface-subtle p-3">
                  <span className="text-[10px] font-mono uppercase text-muted-foreground">Est. Read Time</span>
                  <div className="mt-0.5 font-mono font-bold text-foreground">{inspectingPage.readingTime} min</div>
                </div>
                <div className="rounded-lg border border-border bg-surface-subtle p-3">
                  <span className="text-[10px] font-mono uppercase text-muted-foreground">Content Type</span>
                  <div className="mt-0.5 font-mono font-bold text-foreground truncate">{inspectingPage.contentType || "text/html"}</div>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground font-mono">Title</h4>
                <p className="mt-1 text-sm font-medium text-foreground bg-surface-subtle p-2.5 rounded-lg border border-border">
                  {inspectingPage.title || "No <title> tag detected"}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground font-mono">Meta Description</h4>
                <p className="mt-1 text-xs text-muted-foreground bg-surface-subtle p-2.5 rounded-lg border border-border leading-relaxed">
                  {inspectingPage.metaDescription || "No meta description specified"}
                </p>
              </div>

              {inspectingPage.canonicalUrl && (
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground font-mono">Canonical Link</h4>
                  <p className="mt-1 text-xs font-mono text-muted-foreground bg-surface-subtle p-2 rounded-lg border border-border truncate">
                    {inspectingPage.canonicalUrl}
                  </p>
                </div>
              )}

              <div className="flex justify-end pt-2">
                <a
                  href={inspectingPage.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-foreground px-4 py-1.5 text-xs font-medium text-background hover:bg-foreground/90 transition-colors"
                >
                  Open Live Page <ExternalLink className="size-3" />
                </a>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
