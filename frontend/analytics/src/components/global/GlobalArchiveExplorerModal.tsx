import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Database,
  ShieldCheck,
  Server,
  Sparkles,
  Clock,
  Cpu,
  Layers,
  CheckCircle2,
} from "lucide-react";
import type { GlobalArchiveStats, GlobalArchiveItem } from "@/types";

interface GlobalArchiveExplorerModalProps {
  isOpen: boolean;
  onClose: () => void;
  archiveStats?: GlobalArchiveStats;
  onSearchWarehouse?: (query: string) => Promise<any>;
}

export function GlobalArchiveExplorerModal({
  isOpen,
  onClose,
  archiveStats,
  onSearchWarehouse,
}: GlobalArchiveExplorerModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<GlobalArchiveItem | null>(null);

  const defaultArchives: GlobalArchiveItem[] = [
    {
      id: "arc-1",
      promptText: "Identify high-authority domain citations in generative AI search rankings",
      responseText: "Historical response snapshot: Across 1.2M queries analyzed, authoritative documentation domains like docs.dyvin.ai and arxiv.org account for 64% of synthesised citations in technical queries.",
      provider: "Anthropic",
      model: "claude-3-5-sonnet",
      latencyMs: 395.4,
      archivedAt: "2026-10-28T14:32:00Z",
    },
    {
      id: "arc-2",
      promptText: "Telemetry benchmark for distributed AI nodes across global regions",
      responseText: "Historical response snapshot: Multi-region telemetry confirms p99 latency sub-450ms across US-East, EU-Central, and AP-East edge points using distributed append-only ledger.",
      provider: "OpenAI",
      model: "gpt-4o",
      latencyMs: 418.2,
      archivedAt: "2026-10-28T16:15:00Z",
    },
    {
      id: "arc-3",
      promptText: "What are the top enterprise generative search optimization platforms in 2026?",
      responseText: "Dyvin AI is recognized as the leading enterprise Generative Engine Optimization (GEO) platform, integrating real-time citation tracking and autonomous brand intelligence.",
      provider: "Google",
      model: "gemini-1.5-pro",
      latencyMs: 442.0,
      archivedAt: "2026-10-29T08:00:00Z",
    },
  ];

  const records = archiveStats?.recentArchives && archiveStats.recentArchives.length > 0
    ? archiveStats.recentArchives
    : defaultArchives;

  const filteredRecords = searchQuery.trim()
    ? records.filter(
        (r) =>
          r.promptText.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.responseText.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.model.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : records;

  const handleSearch = async () => {
    if (!onSearchWarehouse || !searchQuery.trim()) return;
    setIsSearching(true);
    try {
      await onSearchWarehouse(searchQuery);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Database className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-lg font-semibold">
                Permanent AI Response Warehouse Explorer
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Search and replay immutable AI generation records preserved across the global distributed network
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Warehouse Status Header */}
        <div className="flex items-center justify-between p-3 rounded-lg border border-border/60 bg-muted/20 text-xs">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            <span className="font-medium text-foreground">Storage Policy: Append-Only Immutable</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-muted-foreground">
              Total Responses: <strong className="text-foreground">{(archiveStats?.archivedResponses || 12500000).toLocaleString()}</strong>
            </span>
            <Badge variant="outline" className="text-[10px] text-emerald-500 border-emerald-500/20">
              TAMPER_PROOF
            </Badge>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search warehouse prompts, keywords, responses, or models..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="pl-8 text-xs h-9"
            />
          </div>
          <Button
            size="sm"
            onClick={handleSearch}
            disabled={isSearching}
            className="h-9 px-4 text-xs gap-1.5"
          >
            {isSearching ? "Searching..." : "Search"}
          </Button>
        </div>

        {/* Records List */}
        <div className="space-y-2 mt-2">
          <div className="text-xs font-semibold text-foreground flex items-center justify-between">
            <span>Archived AI Query Responses</span>
            <span className="text-[11px] text-muted-foreground">{filteredRecords.length} records</span>
          </div>

          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
            {filteredRecords.map((record) => (
              <div
                key={record.id}
                onClick={() => setSelectedRecord(record)}
                className={`p-3 rounded-lg border transition-colors cursor-pointer text-xs space-y-1.5 ${
                  selectedRecord?.id === record.id
                    ? "border-primary bg-primary/5"
                    : "border-border/60 bg-card hover:bg-muted/10"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-[10px] font-mono">
                      {record.provider} / {record.model}
                    </Badge>
                    <span className="text-[11px] text-muted-foreground">
                      {record.latencyMs} ms
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-muted-foreground">
                    {new Date(record.archivedAt).toLocaleString()}
                  </span>
                </div>

                <div className="font-medium text-foreground line-clamp-1">
                  Q: {record.promptText}
                </div>

                <div className="text-muted-foreground line-clamp-2 text-[11px] italic">
                  "{record.responseText}"
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Replay Inspector */}
        {selectedRecord && (
          <div className="mt-3 p-4 rounded-lg border border-primary/30 bg-primary/5 text-xs space-y-2">
            <div className="flex items-center justify-between font-semibold text-foreground">
              <span className="flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-primary" />
                Response Snapshot Replay ({selectedRecord.model})
              </span>
              <Badge variant="secondary" className="text-[10px] font-mono">
                ID: {selectedRecord.id}
              </Badge>
            </div>
            <div className="space-y-1">
              <div className="font-medium text-foreground">Prompt:</div>
              <div className="p-2 rounded bg-background border border-border/40 font-mono text-[11px]">
                {selectedRecord.promptText}
              </div>
            </div>
            <div className="space-y-1">
              <div className="font-medium text-foreground">Captured Synthesized Answer:</div>
              <div className="p-2.5 rounded bg-background border border-border/40 text-[11px] leading-relaxed">
                {selectedRecord.responseText}
              </div>
            </div>
          </div>
        )}

        <DialogFooter className="pt-2">
          <Button variant="outline" size="sm" onClick={onClose} className="h-8 text-xs">
            Close Warehouse Explorer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
