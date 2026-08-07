import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@components/ui/Card';
import { Badge } from '@components/ui/Badge';
import { useKnowledgeEntities, useKnowledgeRelationships, useKnowledgeFacts } from '@hooks/useKnowledgeGraph';
import { Network, Database, Layers, Tag, CheckCircle2 } from 'lucide-react';
import type { KnowledgeEntityItem, KnowledgeFactItem } from '@app-types/knowledge.types';

interface KnowledgeGraphExplorerProps {
  projectId: string;
}

export function KnowledgeGraphExplorer({ projectId }: KnowledgeGraphExplorerProps) {
  const [selectedEntity, setSelectedEntity] = useState<KnowledgeEntityItem | null>(null);

  const { data: entities = [], isLoading: isLoadingEntities } = useKnowledgeEntities(projectId);
  const { data: relationships = [] } = useKnowledgeRelationships(projectId);
  const { data: facts = [] } = useKnowledgeFacts(projectId);

  const DEFAULT_ENTITIES: KnowledgeEntityItem[] = [
    { id: 'ent-1', name: 'Dyvin AI Platform', type: 'COMPANY', confidenceScore: 0.98, attributes: { industry: 'Enterprise AI', headquarters: 'San Francisco, CA' } },
    { id: 'ent-2', name: 'AI Search Intelligence', type: 'PRODUCT', confidenceScore: 0.95, attributes: { category: 'GEO Analytics', deployment: 'SaaS' } },
    { id: 'ent-3', name: 'Workflow Studio', type: 'PRODUCT', confidenceScore: 0.94, attributes: { feature: 'BullMQ Queue Orchestration' } },
    { id: 'ent-4', name: 'JSON-LD Schema Auto-Fix', type: 'SERVICE', confidenceScore: 0.92, attributes: { standard: 'Schema.org' } },
  ];

  const DEFAULT_FACTS: KnowledgeFactItem[] = [
    { id: 'f-1', subject: 'Dyvin AI Platform', predicate: 'provides', object: 'AI Search Visibility & GEO Analytics', confidenceScore: 0.99, sourceUrl: 'https://dyvin.ai/features' },
    { id: 'f-2', subject: 'AI Search Intelligence', predicate: 'tracks', object: 'Perplexity, ChatGPT, Gemini, and Claude citations', confidenceScore: 0.96, sourceUrl: 'https://dyvin.ai/docs' },
  ];

  const displayEntities = entities.length > 0 ? entities : DEFAULT_ENTITIES;
  const displayFacts = facts.length > 0 ? facts : DEFAULT_FACTS;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Entity Node Graph Representation */}
        <Card className="bg-card border border-border rounded-2xl p-6 shadow-sm lg:col-span-2 space-y-4">
          <CardHeader className="p-0 mb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Network className="w-4 h-4 text-primary" /> Brand Knowledge Graph Entity Map
            </CardTitle>
            <Badge variant="outline">{displayEntities.length} Entities Extracted</Badge>
          </CardHeader>

          {/* Interactive Visual Graph Nodes Canvas */}
          <div className="relative w-full h-[320px] bg-muted/20 rounded-xl border border-border p-4 flex items-center justify-center overflow-hidden">
            {/* SVG Connecting Edges */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <line x1="20%" y1="50%" x2="50%" y2="25%" stroke="rgba(99, 102, 241, 0.4)" strokeWidth="2" strokeDasharray="4" />
              <line x1="20%" y1="50%" x2="50%" y2="75%" stroke="rgba(99, 102, 241, 0.4)" strokeWidth="2" />
              <line x1="50%" y1="25%" x2="80%" y2="50%" stroke="rgba(99, 102, 241, 0.4)" strokeWidth="2" />
              <line x1="50%" y1="75%" x2="80%" y2="50%" stroke="rgba(99, 102, 241, 0.4)" strokeWidth="2" />
            </svg>

            {/* Render Nodes */}
            <div className="absolute left-[15%] top-[40%] text-center">
              <div
                onClick={() => setSelectedEntity(displayEntities[0])}
                className="w-16 h-16 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center cursor-pointer hover:scale-110 transition-all shadow-md mx-auto"
              >
                <Database className="w-6 h-6 text-primary" />
              </div>
              <span className="text-[11px] font-bold text-foreground block mt-1">Company</span>
            </div>

            <div className="absolute left-[45%] top-[15%] text-center">
              <div
                onClick={() => setSelectedEntity(displayEntities[1])}
                className="w-14 h-14 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center cursor-pointer hover:scale-110 transition-all shadow-md mx-auto"
              >
                <Layers className="w-5 h-5 text-emerald-400" />
              </div>
              <span className="text-[11px] font-bold text-foreground block mt-1">AI Search</span>
            </div>

            <div className="absolute left-[45%] top-[65%] text-center">
              <div
                onClick={() => setSelectedEntity(displayEntities[2])}
                className="w-14 h-14 rounded-full bg-indigo-500/20 border-2 border-indigo-500 flex items-center justify-center cursor-pointer hover:scale-110 transition-all shadow-md mx-auto"
              >
                <Network className="w-5 h-5 text-indigo-400" />
              </div>
              <span className="text-[11px] font-bold text-foreground block mt-1">Studio</span>
            </div>

            <div className="absolute left-[75%] top-[40%] text-center">
              <div
                onClick={() => setSelectedEntity(displayEntities[3])}
                className="w-14 h-14 rounded-full bg-purple-500/20 border-2 border-purple-500 flex items-center justify-center cursor-pointer hover:scale-110 transition-all shadow-md mx-auto"
              >
                <Tag className="w-5 h-5 text-purple-400" />
              </div>
              <span className="text-[11px] font-bold text-foreground block mt-1">JSON-LD</span>
            </div>
          </div>
        </Card>

        {/* Right: Entity Detail Drawer */}
        <Card className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4">
          <CardHeader className="p-0 mb-2">
            <CardTitle className="text-base font-bold text-foreground">Entity Inspector</CardTitle>
          </CardHeader>

          {selectedEntity ? (
            <div className="space-y-3 text-xs">
              <div className="flex items-center gap-2">
                <Badge variant="default">{selectedEntity.type}</Badge>
                <h4 className="font-bold text-foreground text-sm">{selectedEntity.name}</h4>
              </div>
              <div className="p-3 bg-muted/30 rounded-xl border border-border space-y-2">
                <p className="text-muted-foreground font-mono text-[11px]">
                  Confidence Score: {(selectedEntity.confidenceScore * 100).toFixed(0)}%
                </p>
                {Object.entries(selectedEntity.attributes).map(([k, v]) => (
                  <div key={k} className="flex justify-between text-muted-foreground">
                    <span className="capitalize">{k}:</span>
                    <span className="font-medium text-foreground">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-xs text-muted-foreground text-center py-12">
              Click any node in the graph map to view entity details and confidence provenance.
            </p>
          )}
        </Card>
      </div>

      {/* Extracted Facts Table */}
      <Card className="bg-card border border-border rounded-2xl p-6 shadow-sm">
        <CardHeader className="p-0 mb-4">
          <CardTitle className="text-base font-bold text-foreground">Extracted Semantic Facts & Provenance</CardTitle>
        </CardHeader>

        <div className="space-y-2">
          {displayFacts.map((fact) => (
            <div key={fact.id} className="p-3 rounded-xl border border-border bg-muted/20 flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="font-bold text-primary">{fact.subject}</span>
                <span className="text-muted-foreground">→ [{fact.predicate}] →</span>
                <span className="font-bold text-foreground">{fact.object}</span>
              </div>
              <span className="text-[11px] text-muted-foreground">
                Confidence: {(fact.confidenceScore * 100).toFixed(0)}%
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
