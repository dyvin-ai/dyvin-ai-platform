import React from 'react';
import { motion } from 'motion/react';
import { Search, Sparkles, ArrowRight, ArrowDown, Database, Cpu, Compass, Layers, GitMerge } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface PreviewResearchIntelligenceProps {
  onOpenAuth: () => void;
}

export const PreviewResearchIntelligence: React.FC<PreviewResearchIntelligenceProps> = ({ onOpenAuth }) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const steps = [
    { num: '01', title: 'Query Ingestion', desc: '1,284 enterprise buyer prompts categorized across 18 search clusters.', icon: Search },
    { num: '02', title: 'Multi-LLM Synthesis', desc: 'Continuous telemetry runs across ChatGPT 4o, Gemini, Claude, and Perplexity.', icon: Cpu },
    { num: '03', title: 'Entity Extraction', desc: 'Brand mentions, confidence ratings, and sentiment nuances mapped.', icon: Compass },
    { num: '04', title: 'Citation Attribution', desc: 'Every supporting URL, research paper, and review grid indexed.', icon: Database },
    { num: '05', title: 'Competitor Benchmark', desc: 'Head-to-head share of voice and recommendation positioning computed.', icon: Layers },
    { num: '06', title: 'Actionable Directive', desc: 'Clear strategic move generated to capture missing citation authority.', icon: Sparkles },
  ];

  return (
    <section className={`py-24 sm:py-32 border-b select-none transition-colors ${
      isLight ? 'bg-white border-slate-200/80 text-slate-900' : 'bg-[#060709] border-white/5 text-white'
    }`}>
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-14">
          <div className="inline-flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-blue-500 mb-4">
            <span className="size-1.5 rounded-full bg-blue-500" />
            <span>PREVIEW 05 — AI RESEARCH INTELLIGENCE</span>
          </div>

          <h2 className="text-3xl sm:text-5xl md:text-6xl font-black font-display tracking-tight uppercase leading-[0.98]">
            TURN AI SEARCH <br />
            <span className="text-blue-500">INTO INTELLIGENCE.</span>
          </h2>

          <p className={`mt-6 text-base sm:text-lg leading-[1.6] ${isLight ? 'text-slate-600' : 'text-white/70'}`}>
            Dyvin continuously ingests and decomposes generative AI search outputs, turning unstructured conversational answers into structured competitive intelligence.
          </p>
        </div>

        {/* Research Pipeline Flowing Canvas */}
        <div className={`rounded-[28px] sm:rounded-[36px] border p-6 sm:p-10 shadow-peec-shell ${
          isLight ? 'bg-slate-50/60 border-slate-200/80' : 'bg-[#080A0D] border-white/10'
        }`}>
          
          {/* Top Banner with Stats */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-8 border-b border-slate-200/60 dark:border-white/5 gap-4">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase text-slate-400 block">
                Research Pipeline Engine
              </span>
              <div className="text-2xl font-black font-display mt-0.5">
                1,284 Prompts Analyzed Daily
              </div>
            </div>

            <div className="flex flex-wrap gap-2 text-xs font-mono">
              <span className={`px-3 py-1 rounded-xl border ${isLight ? 'bg-white border-slate-200' : 'bg-white/5 border-white/10'}`}>● AI Visibility</span>
              <span className={`px-3 py-1 rounded-xl border ${isLight ? 'bg-white border-slate-200' : 'bg-white/5 border-white/10'}`}>● Brand Discovery</span>
              <span className={`px-3 py-1 rounded-xl border ${isLight ? 'bg-white border-slate-200' : 'bg-white/5 border-white/10'}`}>● Competitor Share</span>
            </div>
          </div>

          {/* Flowing 6-Stage Pipeline */}
          <div className="pt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {steps.map((st) => (
              <div
                key={st.num}
                className={`p-5 rounded-[22px] border transition-all flex flex-col justify-between shadow-xs group ${
                  isLight ? 'bg-white border-slate-200/80 hover:border-blue-300' : 'bg-[#0D1017] border-white/5 hover:border-blue-500/30'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-xs font-bold text-blue-500">{st.num}</span>
                    <div className={`size-8 rounded-xl flex items-center justify-center transition-colors ${
                      isLight ? 'bg-slate-50 border border-slate-200 text-slate-700 group-hover:bg-blue-600 group-hover:text-white' : 'bg-white/5 border border-white/10 text-white/80 group-hover:bg-blue-600'
                    }`}>
                      <st.icon className="size-4" />
                    </div>
                  </div>

                  <h3 className="font-display font-bold text-sm">{st.title}</h3>
                  <p className="mt-2 text-xs text-slate-500 dark:text-white/60 font-sans leading-relaxed">{st.desc}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span>Automated Pipeline</span>
                  <span className="text-emerald-500 font-bold">100% Live</span>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Action Ribbon */}
          <div className="mt-8 pt-6 border-t border-slate-200/60 dark:border-white/5 flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400">Enterprise AI Search Telemetry</span>
            <button
              onClick={onOpenAuth}
              className="font-bold text-blue-500 hover:underline flex items-center gap-1 cursor-pointer uppercase tracking-wider"
            >
              <span>View Prompt Stream In Action</span>
              <ArrowRight className="size-3.5" />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
};
