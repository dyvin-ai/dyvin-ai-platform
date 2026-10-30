import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Eye, ArrowUpRight, TrendingUp, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface PreviewAiVisibilityProps {
  onOpenAuth: () => void;
}

export const PreviewAiVisibility: React.FC<PreviewAiVisibilityProps> = ({ onOpenAuth }) => {
  const [hoveredDimension, setHoveredDimension] = useState<string | null>(null);
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const dimensions = [
    { key: 'disc', name: 'Discoverability', score: 94, benchmark: '99th Percentile', desc: 'How readily AI models recall your brand without direct prompt guidance.' },
    { key: 'und', name: 'Understanding', score: 81, benchmark: 'Top 5% in SaaS', desc: 'Accuracy of capabilities, pricing tiers, and target markets synthesized.' },
    { key: 'auth', name: 'Authority', score: 76, benchmark: 'High Tier', desc: 'Weighted citation credibility across editorial, analyst, and technical sources.' },
    { key: 'cit', name: 'Citation Coverage', score: 88, benchmark: 'Top 10%', desc: 'Percentage of category queries where your URL/domain is directly cited.' },
    { key: 'rec', name: 'Recommendation', score: 68, benchmark: 'Opportunity Gap', desc: 'Frequency of top-3 placement in direct alternative and recommendation answers.' },
  ];

  return (
    <section id="preview-visibility" className={`py-24 sm:py-32 border-b select-none transition-colors ${
      isLight ? 'bg-white border-slate-200/80 text-slate-900' : 'bg-[#060709] border-white/5 text-white'
    }`}>
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-14">
          <div className="inline-flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-blue-500 mb-4">
            <span className="size-1.5 rounded-full bg-blue-500" />
            <span>PREVIEW 01 — AI VISIBILITY</span>
          </div>

          <h2 className="text-3xl sm:text-5xl md:text-6xl font-black font-display tracking-tight uppercase leading-[0.98]">
            SEE HOW AI <br />
            <span className="text-blue-500">SEES YOUR BRAND.</span>
          </h2>

          <p className={`mt-6 text-base sm:text-lg leading-[1.6] ${isLight ? 'text-slate-600' : 'text-white/70'}`}>
            Every day, generative models synthesize millions of buyer queries. Dyvin transforms these zero-click answers into five measurable visibility pillars.
          </p>
        </div>

        {/* The Giant Interactive AI Visibility Product Canvas */}
        <div className={`rounded-[28px] sm:rounded-[36px] border p-6 sm:p-10 shadow-peec-shell ${
          isLight ? 'bg-slate-50/60 border-slate-200/80' : 'bg-[#080A0D] border-white/10'
        }`}>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Col: Big Score Card */}
            <div className={`lg:col-span-5 rounded-[24px] p-7 sm:p-8 border shadow-sm flex flex-col justify-between ${
              isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-[#0D1017] border-white/10 text-white'
            }`}>
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-white/5 mb-6">
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400">
                    Primary Benchmark
                  </span>
                  <div className="size-8 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
                    <Eye className="size-4" />
                  </div>
                </div>

                <span className="text-xs font-mono uppercase font-bold text-slate-400 block">
                  AI Visibility Score
                </span>
                
                <div className="mt-2 flex items-baseline gap-3">
                  <span className={`text-6xl sm:text-7xl font-black font-display tracking-tight tnum ${
                    isLight ? 'text-slate-900' : 'text-white'
                  }`}>
                    86.4
                  </span>
                  <span className="text-sm font-mono text-slate-400 font-medium">/ 100</span>
                </div>

                <div className="mt-3 inline-flex items-center gap-1.5 font-mono text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/40 px-3 py-1 rounded-full">
                  <ArrowUpRight className="size-3.5" />
                  <span>+18.7% this month</span>
                </div>

                <p className={`mt-6 text-xs sm:text-sm leading-relaxed font-sans ${
                  isLight ? 'text-slate-600' : 'text-white/70'
                }`}>
                  Represents your aggregate probability of appearing as a verified recommendation when prospective buyers ask conversational AI for solutions in your sector.
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-xs font-mono text-slate-400">
                <span>Domain Telemetry</span>
                <span className={`font-bold ${isLight ? 'text-slate-800' : 'text-white'}`}>Top 5% in Category</span>
              </div>
            </div>

            {/* Right Col: 5 Dimension Bars */}
            <div className="lg:col-span-7 space-y-3.5">
              {dimensions.map((d) => (
                <div
                  key={d.key}
                  onMouseEnter={() => setHoveredDimension(d.name)}
                  onMouseLeave={() => setHoveredDimension(null)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    hoveredDimension === d.name
                      ? isLight ? 'bg-white border-blue-500 shadow-sm scale-[1.01]' : 'bg-[#121620] border-blue-500 shadow-lg scale-[1.01]'
                      : isLight ? 'bg-white/80 border-slate-200/80 hover:border-slate-300' : 'bg-white/[0.02] border-white/5 hover:border-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>{d.name}</span>
                      <span className="text-[10px] font-mono text-slate-400 bg-slate-100 dark:bg-white/5 px-2 py-0.5 rounded-md">
                        {d.benchmark}
                      </span>
                    </div>
                    <span className={`font-mono text-xs font-bold tnum ${isLight ? 'text-slate-900' : 'text-white'}`}>{d.score} / 100</span>
                  </div>

                  <div className="h-2 rounded-full bg-slate-100 dark:bg-white/10 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-blue-500 transition-all duration-500"
                      style={{ width: `${d.score}%` }}
                    />
                  </div>

                  <p className="text-[11px] text-slate-500 dark:text-white/60 mt-2 line-clamp-1 font-sans">{d.desc}</p>
                </div>
              ))}
            </div>

          </div>

          {/* Bottom Interactive Trigger */}
          <div className="mt-8 pt-6 border-t border-slate-200/70 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-500 dark:text-white/60">
            <span>Continuous telemetry active across 1,284 buyer prompts.</span>
            <button
              onClick={onOpenAuth}
              className="inline-flex items-center gap-1.5 font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
            >
              <span>Explore Visibility Engine</span>
              <ArrowRight className="size-3.5" />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
};
