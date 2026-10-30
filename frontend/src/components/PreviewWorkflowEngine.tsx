import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, ArrowRight, Play, CheckCircle2, FileEdit, Send, Check, BarChart2 } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface PreviewWorkflowEngineProps {
  onOpenAuth: () => void;
}

export const PreviewWorkflowEngine: React.FC<PreviewWorkflowEngineProps> = ({ onOpenAuth }) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const workflowNodes = [
    { step: '01', title: 'Visibility Drop Alert', desc: 'System detects a 4-point dip in enterprise compliance queries.', status: 'Triggered', icon: Play },
    { step: '02', title: 'Citation Gap Analysis', desc: 'Identifies missing citation on Gartner 2026 Grid.', status: 'Synthesized', icon: BarChart2 },
    { step: '03', title: 'Content Recommendation', desc: 'Generates optimized technical whitepaper spec.', status: 'Generated', icon: FileEdit },
    { step: '04', title: 'Executive Approval', desc: 'Marketing team reviews directive in 1-click.', status: 'Approved', icon: CheckCircle2 },
    { step: '05', title: 'Syndication & Publish', desc: 'Updated case study published to authoritative hubs.', status: 'Published', icon: Send },
    { step: '06', title: 'Automated Re-measurement', desc: 'Telemetry confirms +8.4% visibility recovery.', status: 'Verified', icon: Sparkles },
  ];

  return (
    <section id="workflow-engine" className={`py-24 sm:py-32 border-b select-none transition-colors ${
      isLight ? 'bg-slate-50/60 border-slate-200/80 text-slate-900' : 'bg-[#060709] border-white/5 text-white'
    }`}>
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-14">
          <div className="inline-flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-blue-500 mb-4">
            <span className="size-1.5 rounded-full bg-blue-500" />
            <span>PREVIEW 06 — ACTION / WORKFLOW ENGINE</span>
          </div>

          <h2 className="text-3xl sm:text-5xl md:text-6xl font-black font-display tracking-tight uppercase leading-[0.98]">
            DON'T JUST MEASURE IT. <br />
            <span className="text-blue-500">IMPROVE IT.</span>
          </h2>

          <p className={`mt-6 text-base sm:text-lg leading-[1.6] ${isLight ? 'text-slate-600' : 'text-white/70'}`}>
            Most software stops at showing graphs. Dyvin includes an autonomous Action Engine that transforms visibility gaps into concrete, executable workflow pipelines.
          </p>
        </div>

        {/* Visual Workflow Canvas */}
        <div className={`rounded-[28px] sm:rounded-[36px] border p-6 sm:p-10 shadow-peec-shell ${
          isLight ? 'bg-white border-slate-200/90' : 'bg-[#080A0D] border-white/10'
        }`}>
          
          <div className="flex items-center justify-between pb-6 border-b border-slate-100 dark:border-white/5">
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-emerald-500" />
              <span className="font-display font-bold text-sm">Automated Optimization Loop</span>
            </div>
            <span className="font-mono text-xs text-blue-500 font-bold">Continuous Telemetry Active</span>
          </div>

          {/* Connected Workflow Step Canvas */}
          <div className="pt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workflowNodes.map((node) => (
              <div
                key={node.step}
                className={`p-5 rounded-2xl border transition-all flex flex-col justify-between shadow-xs group ${
                  isLight ? 'bg-slate-50/70 border-slate-200/80 hover:bg-white hover:border-blue-300' : 'bg-[#0D1017] border-white/5 hover:border-blue-500/30'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-xs font-bold text-slate-400">Step {node.step}</span>
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-lg border ${
                      isLight ? 'bg-white text-blue-600 border-slate-200' : 'bg-white/5 text-blue-400 border-white/10'
                    }`}>
                      {node.status}
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-sm flex items-center gap-2">
                    <node.icon className="size-4 text-blue-500" />
                    <span>{node.title}</span>
                  </h3>

                  <p className="mt-2 text-xs text-slate-500 dark:text-white/60 font-sans leading-relaxed">
                    {node.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-white/5 flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span>Directive Pipeline</span>
                  <Check className="size-3.5 text-emerald-500 font-bold" />
                </div>
              </div>
            ))}
          </div>

          {/* Workflow Summary Banner */}
          <div className={`mt-8 p-4 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs ${
            isLight ? 'bg-blue-50/70 border-blue-200 text-blue-950' : 'bg-blue-950/20 border-blue-500/20 text-blue-200'
          }`}>
            <span className="font-medium font-sans">
              Average closed citation loop: <strong className="text-blue-600 dark:text-blue-400 font-bold">4.2 days from alert to AI ranking recovery</strong>
            </span>
            <button
              onClick={onOpenAuth}
              className="font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer uppercase tracking-wider font-mono text-[11px]"
            >
              <span>Deploy Action Engine</span>
              <ArrowRight className="size-3.5" />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
};
