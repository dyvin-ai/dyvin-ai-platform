import React from 'react';
import { Card, CardHeader, CardTitle } from '@components/ui/Card';
import { Button } from '@components/ui/Button';
import { Badge } from '@components/ui/Badge';
import { useExecutionPlan } from '@hooks/useRecommendationPlatform';
import { ListOrdered, CheckCircle2, Clock, Play } from 'lucide-react';
import type { StrategyExecutionPlanItem } from '@app-types/recommendation-platform.types';

export function StrategyExecutionRoadmap() {
  const { data: planItems = [], isLoading } = useExecutionPlan('strategy-default');

  const DEFAULT_PLAN: StrategyExecutionPlanItem[] = [
    {
      stepIndex: 1,
      title: 'Inject Schema.org Organization & SoftwareApplication JSON-LD',
      actionType: 'SCHEMA_UPDATE',
      estimatedDuration: '15 mins',
      isCompleted: true,
    },
    {
      stepIndex: 2,
      title: 'Publish Product Knowledge Entity Graph to Wikipedia & Wikidata',
      actionType: 'KNOWLEDGE_GRAPH',
      estimatedDuration: '45 mins',
      isCompleted: false,
    },
    {
      stepIndex: 3,
      title: 'Trigger Automated GEO Keyword Rescan across Perplexity & ChatGPT',
      actionType: 'RESCAN_REASONING',
      estimatedDuration: '10 mins',
      isCompleted: false,
    },
  ];

  const displayPlan = planItems.length > 0 ? planItems : DEFAULT_PLAN;

  return (
    <Card className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4">
      <CardHeader className="p-0 flex flex-row items-center justify-between">
        <CardTitle className="text-base font-bold flex items-center gap-2">
          <ListOrdered className="w-5 h-5 text-primary" /> Step-by-Step Strategy Execution Roadmap
        </CardTitle>

        <Badge variant="outline" className="font-mono">
          3 Execution Steps
        </Badge>
      </CardHeader>

      <div className="space-y-3 pt-2 text-xs">
        {isLoading ? (
          <p className="text-center py-6 text-muted-foreground">Loading execution roadmap...</p>
        ) : (
          displayPlan.map((step) => (
            <div
              key={step.stepIndex}
              className="p-4 rounded-xl border border-border bg-muted/20 hover:border-primary/50 transition-all flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs font-mono ${
                    step.isCompleted
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-primary/20 text-primary border border-primary/30'
                  }`}
                >
                  {step.stepIndex}
                </div>

                <div>
                  <h4 className="font-bold text-foreground text-sm flex items-center gap-2">
                    {step.title}
                  </h4>
                  <span className="text-muted-foreground text-[11px] font-mono">
                    Type: {step.actionType} • Est. Time: {step.estimatedDuration}
                  </span>
                </div>
              </div>

              <div>
                {step.isCompleted ? (
                  <Badge variant="default" className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                    <CheckCircle2 className="w-3 h-3 mr-1" /> Verified
                  </Badge>
                ) : (
                  <Button size="sm" leftIcon={<Play className="w-3.5 h-3.5" />}>
                    Execute Step
                  </Button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}
