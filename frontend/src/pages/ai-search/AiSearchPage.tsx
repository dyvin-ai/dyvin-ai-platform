import React, { useState } from 'react';
import { useOrgStore } from '@stores/orgStore';
import { useWorkspaceStore } from '@stores/workspaceStore';
import { useAiSearchDashboard } from '@hooks/useAiSearch';
import { AiSearchQueryInspector } from '@components/search-intelligence/AiSearchQueryInspector';
import { ModelGeoComparisonMatrix } from '@components/search-intelligence/ModelGeoComparisonMatrix';
import { KnowledgeGraphExplorer } from '@components/search-intelligence/KnowledgeGraphExplorer';
import { GeoVisibilityHeatmap } from '@components/search-intelligence/GeoVisibilityHeatmap';
import { GovernancePolicyManager } from '@components/search-intelligence/GovernancePolicyManager';
import { UploadKeywordsModal } from '@components/modals/UploadKeywordsModal';
import { Card } from '@components/ui/Card';
import { Button } from '@components/ui/Button';
import { Badge } from '@components/ui/Badge';
import { PageLoader } from '@components/feedback/PageLoader';
import {
  Search,
  Layers,
  Network,
  Globe,
  ShieldCheck,
  UploadCloud,
} from 'lucide-react';

export default function AiSearchPage() {
  const { activeOrg } = useOrgStore();
  const { activeWorkspace } = useWorkspaceStore();
  const orgId = activeOrg?.id || 'org-default';
  const projectId = activeWorkspace?.id || 'proj-default';

  const [activeTab, setActiveTab] = useState<'INSPECTOR' | 'MODELS' | 'KNOWLEDGE' | 'GEO' | 'GOVERNANCE'>('INSPECTOR');
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  const { data: dashboard, isLoading } = useAiSearchDashboard();

  if (isLoading) {
    return <PageLoader message="Loading AI Search Intelligence & GEO Analytics Platform..." />;
  }

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">AI Search Intelligence Platform</h1>
            <Badge variant="default" size="sm">Phase F6 Enterprise</Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Real-time GEO citation share, Perplexity/ChatGPT rank tracking, Knowledge Graph entity extraction & AI governance.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" onClick={() => setIsUploadOpen(true)} leftIcon={<UploadCloud className="w-4 h-4" />}>
            Upload Keywords 2.0
          </Button>
        </div>
      </div>

      {/* Overview Stat Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="bg-card border border-border p-5 rounded-2xl shadow-sm">
          <span className="text-muted-foreground text-xs font-bold uppercase block">Overall GEO Score</span>
          <span className="text-3xl font-extrabold text-primary font-mono mt-1 block">
            {dashboard?.overallVisibilityScore || 92} / 100
          </span>
          <span className="text-[11px] text-emerald-400 font-semibold block mt-1">+5.4% vs last week</span>
        </Card>

        <Card className="bg-card border border-border p-5 rounded-2xl shadow-sm">
          <span className="text-muted-foreground text-xs font-bold uppercase block font-mono">Tracked Queries</span>
          <span className="text-3xl font-extrabold text-foreground font-mono mt-1 block">
            {dashboard?.totalTrackedPrompts || 14200}
          </span>
          <span className="text-[11px] text-muted-foreground block mt-1">Active AI Prompts</span>
        </Card>

        <Card className="bg-card border border-border p-5 rounded-2xl shadow-sm">
          <span className="text-muted-foreground text-xs font-bold uppercase block">Perplexity Share</span>
          <span className="text-3xl font-extrabold text-indigo-400 font-mono mt-1 block">
            {dashboard?.aiEngineShare?.perplexity || 42}%
          </span>
          <span className="text-[11px] text-muted-foreground block mt-1">Rank #1 Citation Share</span>
        </Card>

        <Card className="bg-card border border-border p-5 rounded-2xl shadow-sm">
          <span className="text-muted-foreground text-xs font-bold uppercase block">ChatGPT Share</span>
          <span className="text-3xl font-extrabold text-emerald-400 font-mono mt-1 block">
            {dashboard?.aiEngineShare?.chatgpt || 35}%
          </span>
          <span className="text-[11px] text-muted-foreground block mt-1">Direct Brand Mentions</span>
        </Card>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-border pb-3 overflow-x-auto text-xs">
        <button
          onClick={() => setActiveTab('INSPECTOR')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all ${
            activeTab === 'INSPECTOR'
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted/30'
          }`}
        >
          <Search className="w-4 h-4" /> AI Query Inspector
        </button>

        <button
          onClick={() => setActiveTab('MODELS')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all ${
            activeTab === 'MODELS'
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted/30'
          }`}
        >
          <Layers className="w-4 h-4" /> AI Models Matrix
        </button>

        <button
          onClick={() => setActiveTab('KNOWLEDGE')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all ${
            activeTab === 'KNOWLEDGE'
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted/30'
          }`}
        >
          <Network className="w-4 h-4" /> Knowledge Graph
        </button>

        <button
          onClick={() => setActiveTab('GEO')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all ${
            activeTab === 'GEO'
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted/30'
          }`}
        >
          <Globe className="w-4 h-4" /> Multi-Region GEO Heatmap
        </button>

        <button
          onClick={() => setActiveTab('GOVERNANCE')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all ${
            activeTab === 'GOVERNANCE'
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted/30'
          }`}
        >
          <ShieldCheck className="w-4 h-4" /> AI Governance & Compliance
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === 'INSPECTOR' && <AiSearchQueryInspector orgId={orgId} />}
      {activeTab === 'MODELS' && <ModelGeoComparisonMatrix />}
      {activeTab === 'KNOWLEDGE' && <KnowledgeGraphExplorer projectId={projectId} />}
      {activeTab === 'GEO' && <GeoVisibilityHeatmap />}
      {activeTab === 'GOVERNANCE' && <GovernancePolicyManager orgId={orgId} />}

      {/* Upload Keywords Modal */}
      <UploadKeywordsModal isOpen={isUploadOpen} onClose={() => setIsUploadOpen(false)} />
    </div>
  );
}