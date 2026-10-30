import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Users, ArrowRight, TrendingUp, AlertTriangle, CheckCircle2, ArrowUpRight } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface PreviewCompetitorIntelligenceProps {
  onOpenAuth: () => void;
}

export const PreviewCompetitorIntelligence: React.FC<PreviewCompetitorIntelligenceProps> = ({ onOpenAuth }) => {
  const [selectedCompetitor, setSelectedCompetitor] = useState<'atlas' | 'searchmat'>('atlas');
  const { theme } = useTheme();
  const isLight = theme === 'light';

  return (
    <section className={`py-24 sm:py-32 border-b select-none transition-colors ${
      isLight ? 'bg-slate-50/60 border-slate-200/80 text-slate-900' : 'bg-[#060709] border-white/5 text-white'
    }`}>
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-14">
          <div className="inline-flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-blue-500 mb-4">
            <span className="size-1.5 rounded-full bg-blue-500" />
            <span>PREVIEW 04 — COMPETITOR INTELLIGENCE</span>
          </div>

          <h2 className="text-3xl sm:text-5xl md:text-6xl font-black font-display tracking-tight uppercase leading-[0.98]">
            SEE WHY AI <br />
            <span className="text-blue-500">PICKS THEM INSTEAD.</span>
          </h2>

          <p className={`mt-6 text-base sm:text-lg leading-[1.6] ${isLight ? 'text-slate-600' : 'text-white/70'}`}>
            Understand why competitors win top recommendation positions in zero-click evaluation queries. Dyvin delivers Bloomberg-style comparative intelligence on why models choose alternative solutions.
          </p>
        </div>

        {/* Bloomberg-Style Competitor Intelligence Grid */}
        <div className={`rounded-[28px] sm:rounded-[36px] border p-6 sm:p-10 shadow-peec-shell ${
          isLight ? 'bg-white border-slate-200/90' : 'bg-[#080A0D] border-white/10'
        }`}>
          
          {/* Top Recommendation Share Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-8 border-b border-slate-100 dark:border-white/5">
            
            {/* Dyvin AI */}
            <div className={`p-5 rounded-2xl border-2 relative ${
              isLight ? 'bg-blue-50/70 border-blue-500' : 'bg-blue-950/20 border-blue-500'
            }`}>
              <span className="text-[10px] font-mono font-bold uppercase text-blue-500 block mb-1">
                Your Brand (Dyvin AI)
              </span>
              <div className="flex items-baseline gap-2">
                <span className={`text-4xl font-black font-display tnum ${isLight ? 'text-slate-900' : 'text-white'}`}>42%</span>
                <span className="text-xs font-mono text-slate-400">Share of Voice</span>
              </div>
              <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-500 font-bold mt-2">
                <ArrowUpRight className="size-3" />
                +6.4% gain this quarter
              </span>
            </div>

            {/* Competitor A */}
            <div
              onClick={() => setSelectedCompetitor('atlas')}
              className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                selectedCompetitor === 'atlas'
                  ? isLight ? 'bg-slate-50 border-slate-900 shadow-xs' : 'bg-white/5 border-white shadow-xs'
                  : isLight ? 'bg-white border-slate-200 hover:border-slate-300' : 'bg-white/[0.02] border-white/5 hover:border-white/10'
              }`}
            >
              <span className="text-[10px] font-mono font-bold uppercase text-slate-400 block mb-1">
                Competitor A (Atlas AI)
              </span>
              <div className="flex items-baseline gap-2">
                <span className={`text-4xl font-black font-display tnum ${isLight ? 'text-slate-800' : 'text-white/80'}`}>35%</span>
                <span className="text-xs font-mono text-slate-400">Share of Voice</span>
              </div>
              <span className="text-[11px] font-mono text-slate-400 mt-2 block">
                Strong in enterprise Gartner queries
              </span>
            </div>

            {/* Competitor B */}
            <div
              onClick={() => setSelectedCompetitor('searchmat')}
              className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                selectedCompetitor === 'searchmat'
                  ? isLight ? 'bg-slate-50 border-slate-900 shadow-xs' : 'bg-white/5 border-white shadow-xs'
                  : isLight ? 'bg-white border-slate-200 hover:border-slate-300' : 'bg-white/[0.02] border-white/5 hover:border-white/10'
              }`}
            >
              <span className="text-[10px] font-mono font-bold uppercase text-slate-400 block mb-1">
                Competitor B (SearchMatrix)
              </span>
              <div className="flex items-baseline gap-2">
                <span className={`text-4xl font-black font-display tnum ${isLight ? 'text-slate-800' : 'text-white/80'}`}>23%</span>
                <span className="text-xs font-mono text-slate-400">Share of Voice</span>
              </div>
              <span className="text-[11px] font-mono text-slate-400 mt-2 block">
                Legacy SEO provider transition
              </span>
            </div>

          </div>

          {/* Detailed Recommendation Gap Analysis */}
          <div className="pt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-display font-bold text-lg">
                  Recommendation Gap: {selectedCompetitor === 'atlas' ? 'Atlas AI' : 'SearchMatrix'}
                </h3>
                <span className="px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400 text-xs font-mono font-bold">
                  -18% Gap in Enterprise Tier
                </span>
              </div>

              <p className={`text-xs sm:text-sm leading-relaxed font-sans ${isLight ? 'text-slate-600' : 'text-white/70'}`}>
                Why models choose {selectedCompetitor === 'atlas' ? 'Atlas AI' : 'SearchMatrix'} when buyers ask for compliance-heavy alternatives:
              </p>

              {/* 4 Gap Factor Bars */}
              <div className="space-y-3 font-mono text-xs">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-slate-400">1. Authority Consensus</span>
                    <span className="font-bold text-amber-500">Atlas leads (+14 pts)</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-slate-100 dark:bg-white/10 overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full w-[78%]" />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-slate-400">2. Citation Coverage Depth</span>
                    <span className="font-bold text-blue-500">Dyvin leads (+22 pts)</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-slate-100 dark:bg-white/10 overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full w-[88%]" />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-slate-400">3. Entity Schema Clarity</span>
                    <span className="font-bold text-emerald-500">Equal (94% Parity)</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-slate-100 dark:bg-white/10 overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full w-[94%]" />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-slate-400">4. Feature Comparison Presence</span>
                    <span className="font-bold text-amber-500">Atlas leads (+8 review grids)</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-slate-100 dark:bg-white/10 overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full w-[65%]" />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Box: Actionable Counter-Measure Strategy */}
            <div className={`lg:col-span-6 rounded-[24px] p-6 border space-y-4 ${
              isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#0D1017] border-white/5'
            }`}>
              <span className="text-[10px] font-mono font-bold uppercase text-blue-500 block">
                Dyvin Strategic Counter-Measure
              </span>

              <h4 className="font-display font-bold text-base">
                Publish Enterprise SLA Comparison Grid to G2 & Gartner
              </h4>

              <p className={`text-xs leading-relaxed font-sans ${isLight ? 'text-slate-600' : 'text-white/70'}`}>
                Closing the 4 review citation gaps will flip 64 commercial enterprise queries directly to Dyvin AI recommendations.
              </p>

              <div className="pt-2 flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-emerald-500">+12% Projected SoV Jump</span>
                <button
                  onClick={onOpenAuth}
                  className="text-xs font-bold text-blue-500 hover:underline flex items-center gap-1 cursor-pointer uppercase tracking-wider"
                >
                  <span>Audit Competitor Attack Surface</span>
                  <ArrowRight className="size-3.5" />
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
