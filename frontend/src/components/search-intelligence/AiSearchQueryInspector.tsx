import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@components/ui/Card';
import { Button } from '@components/ui/Button';
import { Input } from '@components/ui/Input';
import { Badge } from '@components/ui/Badge';
import { useAiSearchPrompts, useTrackPrompt } from '@hooks/useAiSearch';
import { Search, Sparkles, Cpu, CheckCircle2, Clock, BarChart2 } from 'lucide-react';
import type { AiSearchPromptItem } from '@app-types/ai-search.types';

interface AiSearchQueryInspectorProps {
  orgId: string;
}

export function AiSearchQueryInspector({ orgId }: AiSearchQueryInspectorProps) {
  const [promptText, setPromptText] = useState('');
  const [selectedModel, setSelectedModel] = useState('Perplexity Sonar');

  const { data: prompts = [], isLoading } = useAiSearchPrompts(orgId);
  const { mutateAsync: trackPrompt, isPending } = useTrackPrompt();

  const DEFAULT_PROMPTS: AiSearchPromptItem[] = [
    {
      id: 'pr-1',
      organizationId: orgId,
      promptText: 'What are the top enterprise AI automation platforms in 2026?',
      modelName: 'Perplexity AI',
      visibilityScore: 94,
      citationRank: 1,
      status: 'OPTIMIZED',
      executedAt: new Date().toISOString(),
    },
    {
      id: 'pr-2',
      organizationId: orgId,
      promptText: 'How to optimize brand GEO citation share on ChatGPT search?',
      modelName: 'ChatGPT Search (GPT-4o)',
      visibilityScore: 88,
      citationRank: 2,
      status: 'OPTIMIZED',
      executedAt: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: 'pr-3',
      organizationId: orgId,
      promptText: 'Best GEO visibility tools for B2B SaaS companies',
      modelName: 'Google Gemini 1.5 Pro',
      visibilityScore: 62,
      citationRank: 5,
      status: 'NEEDS_ATTENTION',
      executedAt: new Date(Date.now() - 7200000).toISOString(),
    },
  ];

  const displayPrompts = prompts.length > 0 ? prompts : DEFAULT_PROMPTS;

  const handleTrackPrompt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptText.trim()) return;
    await trackPrompt({
      organizationId: orgId,
      promptText,
      modelName: selectedModel,
    });
    setPromptText('');
  };

  return (
    <div className="space-y-6">
      {/* Search Bar Bar & Engine Selector */}
      <Card className="bg-card border border-border p-6 rounded-2xl shadow-sm">
        <form onSubmit={handleTrackPrompt} className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-3.5 text-muted-foreground" />
              <Input
                placeholder="Enter AI search query (e.g. 'What is the top AI search visibility software?')..."
                value={promptText}
                onChange={(e) => setPromptText(e.target.value)}
                className="pl-9 bg-background border-border"
              />
            </div>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl bg-background border border-border text-foreground focus:outline-none"
            >
              <option value="Perplexity Sonar">Perplexity Sonar</option>
              <option value="ChatGPT Search">ChatGPT Search (GPT-4o)</option>
              <option value="Google Gemini 1.5">Google Gemini 1.5 Pro</option>
              <option value="Claude 3.5 Sonnet">Claude 3.5 Sonnet</option>
            </select>
            <Button type="submit" isLoading={isPending} leftIcon={<Sparkles className="w-4 h-4" />}>
              Run AI Scan
            </Button>
          </div>
        </form>
      </Card>

      {/* Prompts Inspection List */}
      <Card className="bg-card border border-border rounded-2xl p-6 shadow-sm">
        <CardHeader className="p-0 mb-4 flex flex-row items-center justify-between">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <Cpu className="w-4 h-4 text-primary" /> Tracked AI Search Queries & Citation Rank
          </CardTitle>
          <Badge variant="outline">{displayPrompts.length} Tracked Queries</Badge>
        </CardHeader>

        <div className="space-y-3">
          {isLoading ? (
            <p className="text-center py-6 text-xs text-muted-foreground">Loading AI search prompt history...</p>
          ) : (
            displayPrompts.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-xl border border-border bg-muted/20 hover:border-primary/50 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-foreground text-sm">{item.promptText}</span>
                    <Badge variant={item.status === 'OPTIMIZED' ? 'default' : 'secondary'} size="sm">
                      {item.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 text-muted-foreground font-mono text-[11px]">
                    <span>Engine: {item.modelName}</span>
                    <span>•</span>
                    <span>Citation Rank: #{item.citationRank}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(item.executedAt).toLocaleTimeString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="text-muted-foreground block text-[10px] uppercase font-bold">Visibility Score</span>
                    <span className="text-base font-extrabold text-primary font-mono">{item.visibilityScore} / 100</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}
