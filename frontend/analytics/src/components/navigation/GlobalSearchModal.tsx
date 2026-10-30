import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Search } from "lucide-react";
import {
  promptsService,
  competitorsService,
  sourcesService,
  insightsService,
  agentsService,
} from "@/services";

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPrompt?: (id: string) => void;
  onSelectCompetitor?: (id: string) => void;
  onSelectSource?: (id: string) => void;
}

export function GlobalSearchModal({
  isOpen,
  onClose,
  onSelectPrompt,
  onSelectCompetitor,
  onSelectSource,
}: GlobalSearchModalProps) {
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) onClose();
      } else if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || typeof document === "undefined") return null;

  const allPrompts = promptsService.list() || [];
  const allCompetitors = competitorsService.list() || [];
  const allSources = sourcesService.list() || [];
  const allInsights = insightsService.list() || [];
  const allAgents = agentsService.list() || [];

  const matchedPrompts = query
    ? allPrompts.filter((p) => p.prompt.toLowerCase().includes(query.toLowerCase()))
    : allPrompts.slice(0, 3);

  const matchedCompetitors = query
    ? allCompetitors.filter((c) => c.brand.toLowerCase().includes(query.toLowerCase()))
    : allCompetitors.slice(0, 2);

  const matchedSources = query
    ? allSources.filter((s) => s.domain.toLowerCase().includes(query.toLowerCase()))
    : allSources.slice(0, 3);

  const matchedInsights = query
    ? allInsights.filter((i) => i.title.toLowerCase().includes(query.toLowerCase()))
    : allInsights.slice(0, 2);

  const matchedAgents = query
    ? allAgents.filter((a) => a.agent.toLowerCase().includes(query.toLowerCase()) || a.subject.toLowerCase().includes(query.toLowerCase()))
    : allAgents.slice(0, 2);

  const totalMatches = matchedPrompts.length + matchedCompetitors.length + matchedSources.length + matchedInsights.length + matchedAgents.length;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center pt-20 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Global Search"
    >
      <div className="relative w-full max-w-xl bg-surface border border-border rounded-xl shadow-2xl overflow-hidden flex flex-col mx-4">
        {/* Input */}
        <div className="flex items-center border-b border-border px-4 py-3">
          <Search className="size-4 text-muted-foreground mr-2.5 shrink-0" aria-hidden />
          <input
            type="text"
            placeholder="Search prompts, competitors, sources, insights, action plans, agents..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
          <kbd className="hidden sm:inline-block rounded bg-surface-subtle border border-border px-2 py-0.5 text-[10px] font-mono text-muted-foreground">
            ESC
          </kbd>
        </div>

        {/* Results Body */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
          {query && totalMatches === 0 ? (
            <div className="py-8 text-center space-y-2">
              <p className="text-sm font-semibold text-foreground">No matching intelligence found</p>
              <p className="text-xs text-muted-foreground max-w-xs mx-auto leading-relaxed">
                Try searching for specific prompt queries, competitor brands (Atlas AI), citation domains (gartner.com), or agent tasks.
              </p>
            </div>
          ) : (
            <>
              {/* Prompts Section */}
              {matchedPrompts.length > 0 && (
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Prompts</span>
                  <div className="mt-1.5 space-y-1">
                    {matchedPrompts.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => {
                          if (onSelectPrompt) onSelectPrompt(p.id);
                          onClose();
                        }}
                        className="w-full text-left rounded-md p-2 text-xs hover:bg-surface-subtle transition-colors flex items-center justify-between cursor-pointer"
                      >
                        <span className="truncate font-medium text-foreground">{p.prompt}</span>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-[11px] font-mono text-muted-foreground">Rank #{p.position}</span>
                          <span className="rounded bg-surface-subtle border border-border px-2 py-0.5 text-[10px] font-mono text-muted-foreground">
                            {p.category}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Competitors Section */}
              {matchedCompetitors.length > 0 && (
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Competitors</span>
                  <div className="mt-1.5 space-y-1">
                    {matchedCompetitors.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => {
                          if (onSelectCompetitor) onSelectCompetitor(c.id);
                          onClose();
                        }}
                        className="w-full text-left rounded-md p-2 text-xs hover:bg-surface-subtle transition-colors flex items-center justify-between cursor-pointer"
                      >
                        <span className="font-semibold text-foreground">{c.brand}</span>
                        <span className="text-muted-foreground font-mono text-[11px]">Visibility: {c.visibility}%</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Sources Section */}
              {matchedSources.length > 0 && (
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Sources</span>
                  <div className="mt-1.5 space-y-1">
                    {matchedSources.map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => {
                          if (onSelectSource) onSelectSource(s.id);
                          onClose();
                        }}
                        className="w-full text-left rounded-md p-2 text-xs hover:bg-surface-subtle transition-colors flex items-center justify-between cursor-pointer"
                      >
                        <span className="font-mono text-foreground">{s.domain}</span>
                        <span className="text-muted-foreground font-mono text-[11px]">{s.citations} citations</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Insights Section */}
              {matchedInsights.length > 0 && (
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Insights</span>
                  <div className="mt-1.5 space-y-1">
                    {matchedInsights.map((i) => (
                      <div key={i.id} className="rounded-md p-2 text-xs hover:bg-surface-subtle transition-colors">
                        <p className="font-medium text-foreground">{i.title}</p>
                        <p className="text-[11px] text-muted-foreground truncate">{i.why}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Agent Tasks Section */}
              {matchedAgents.length > 0 && (
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Autonomous Agents</span>
                  <div className="mt-1.5 space-y-1">
                    {matchedAgents.map((a) => (
                      <div key={a.id} className="rounded-md p-2 text-xs hover:bg-surface-subtle transition-colors flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-foreground">{a.agent}</p>
                          <p className="text-[11px] text-muted-foreground">{a.subject}</p>
                        </div>
                        <span className="rounded bg-surface-subtle border border-border px-2 py-0.5 text-[10px] font-mono text-muted-foreground">
                          {a.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-border bg-surface-subtle px-4 py-2 flex items-center justify-between text-[11px] text-muted-foreground font-mono">
          <span>Dyvin AI Intelligence Graph Search</span>
          <span>Press ESC to exit</span>
        </div>
      </div>
    </div>,
    document.body
  );
}
