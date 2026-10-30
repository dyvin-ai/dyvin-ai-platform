import React from 'react';
import { motion } from 'motion/react';
import { ChevronDown, ArrowRight, Activity, TrendingUp, Sparkles, HelpCircle } from 'lucide-react';
import { headlineGradientStyle, headlineGradientStyleLight } from './primitives';
import { useTheme } from '../context/ThemeContext';

interface HeroSectionProps {
  onOpenAuth: () => void;
  onExplore: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenAuth, onExplore }) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  return (
    <section className="relative pt-14 md:pt-24 pb-14 text-center flex flex-col items-center px-6 max-w-6xl mx-auto z-10 select-none">
      
      {/* 01. Category Eyebrow Badge */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.05 }}
        className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[11px] font-mono font-medium uppercase tracking-[0.16em] mb-6 transition-colors backdrop-blur-2xl ${
          isLight
            ? 'border border-slate-200 bg-white/90 text-slate-700 shadow-xs'
            : 'border border-white/10 bg-[#0C0C10]/80 text-white/80'
        }`}
      >
        <span className="size-1.5 rounded-full bg-blue-500 animate-pulse" />
        <span>AI PRESENCE INTELLIGENCE</span>
      </motion.div>

      {/* 02. Dominant Headline: Clean, Authoritative, High-Contrast */}
      <motion.h1
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        className="text-4xl sm:text-6xl md:text-7xl lg:text-[76px] font-bold tracking-[-0.03em] leading-[1.04] max-w-4xl mx-auto font-display"
      >
        <span className={`block ${isLight ? 'text-slate-900' : 'text-white'}`}>
          Know how AI sees
        </span>
        <span
          className="block pb-1"
          style={isLight ? headlineGradientStyleLight : headlineGradientStyle}
        >
          your brand.
        </span>
      </motion.h1>

      {/* 03. Supporting Product Statement */}
      <motion.p
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.3 }}
        className={`mt-5 max-w-2xl text-base sm:text-lg md:text-[18px] leading-[1.65] font-normal transition-colors mx-auto ${
          isLight ? 'text-slate-600' : 'text-white/70'
        }`}
      >
        Measure how often ChatGPT, Gemini, Claude, Perplexity, and other AI systems recommend your brand — and understand why competitors appear instead.
      </motion.p>

      {/* 04. Primary & Secondary CTA Action Pair */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.45 }}
        className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full sm:w-auto"
      >
        <button
          onClick={onOpenAuth}
          className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl font-semibold text-sm px-7 py-3.5 active:scale-[0.985] transition-all cursor-pointer shadow-lg group ${
            isLight
              ? 'bg-slate-900 text-white hover:bg-slate-800 shadow-slate-900/10'
              : 'bg-white text-black hover:bg-white/90 shadow-white/5'
          }`}
        >
          <span>Analyze your brand</span>
          <ArrowRight className="size-4 stroke-[2.2] group-hover:translate-x-0.5 transition-transform" />
        </button>

        <button
          onClick={onExplore}
          className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl font-medium text-sm px-6 py-3.5 active:scale-[0.985] transition-all cursor-pointer backdrop-blur-xl ${
            isLight
              ? 'border border-slate-300 bg-white text-slate-800 hover:bg-slate-50'
              : 'border border-white/12 bg-white/[0.04] text-white/90 hover:bg-white/[0.08]'
          }`}
        >
          <span>See how it works</span>
          <ArrowRight className="size-4 stroke-[2] opacity-70" />
        </button>
      </motion.div>

      {/* ========================================================================= */}
      {/* 05. HERO PRODUCT VISUALIZATION: AI RECOMMENDATION INTELLIGENCE PANEL       */}
      {/* ========================================================================= */}
      <motion.div
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.75, delay: 0.6 }}
        className="w-full mt-12 text-left"
      >
        <div className={`rounded-3xl border p-5 sm:p-7 shadow-2xl transition-all relative overflow-hidden ${
          isLight
            ? 'bg-white border-slate-200 shadow-slate-200/60'
            : 'bg-[#07090d] border-white/[0.09] shadow-black/90'
        }`}>
          
          {/* Top Panel Context Header Strip */}
          <div className={`flex flex-wrap items-center justify-between gap-3 pb-4 border-b mb-6 text-xs font-mono ${
            isLight ? 'border-slate-100 text-slate-500' : 'border-white/[0.06] text-white/50'
          }`}>
            <div className="flex items-center gap-2.5">
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-semibold uppercase tracking-wider text-brand font-display text-xs">
                AI Recommendation Intelligence
              </span>
              <span className="text-slate-300 dark:text-white/20">•</span>
              <span className="text-[11px]">540 Evaluation Queries</span>
              <span className="text-slate-300 dark:text-white/20 hidden sm:inline">•</span>
              <span className="text-[11px] text-slate-400 hidden sm:inline">6 Frontier Engines Audited</span>
            </div>

            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-0.5 rounded border text-[10px] uppercase font-bold tracking-wider ${
                isLight ? 'bg-slate-100 border-slate-200 text-slate-600' : 'bg-white/5 border-white/10 text-white/40'
              }`}>
                SAMPLE BENCHMARK
              </span>
            </div>
          </div>

          {/* 3 Core Analytical Telemetry Zones */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            
            {/* Zone 1: Primary KPI (AI Visibility) */}
            <div className={`p-5 rounded-2xl border flex flex-col justify-between transition-colors ${
              isLight ? 'bg-slate-50/70 border-slate-200/80' : 'bg-[#0a0d13] border-white/[0.06]'
            }`}>
              <div>
                <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-1.5">
                  <span className="font-semibold tracking-wider uppercase text-[10px]">AI VISIBILITY SCORE</span>
                  <span className="text-cyan-500 font-semibold font-mono text-[11px] bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                    +8.7 pts · 30d
                  </span>
                </div>
                <div className={`text-4xl sm:text-5xl font-bold font-mono tracking-tight tnum mt-1 ${
                  isLight ? 'text-slate-900' : 'text-white'
                }`}>
                  68.4%
                </div>
              </div>
              <p className={`text-xs mt-3 leading-relaxed ${isLight ? 'text-slate-500' : 'text-white/60'}`}>
                Actively recommended across 6 frontier AI engines in primary solution prompts.
              </p>
            </div>

            {/* Zone 2: Recommendation Share vs Competitor */}
            <div className={`p-5 rounded-2xl border flex flex-col justify-between transition-colors ${
              isLight ? 'bg-slate-50/70 border-slate-200/80' : 'bg-[#0a0d13] border-white/[0.06]'
            }`}>
              <div>
                <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-1.5">
                  <span className="font-semibold tracking-wider uppercase text-[10px]">RECOMMENDATION SHARE</span>
                  <span className="text-amber-500 font-semibold font-mono text-[11px] bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                    −2.7 pts Gap
                  </span>
                </div>
                <div className="flex items-baseline gap-3 mt-1">
                  <span className={`text-4xl sm:text-5xl font-bold font-mono tracking-tight tnum ${
                    isLight ? 'text-slate-900' : 'text-white'
                  }`}>
                    24.1%
                  </span>
                  <span className={`text-xs font-mono ${isLight ? 'text-slate-500' : 'text-white/40'}`}>
                    vs Atlas AI (26.8%)
                  </span>
                </div>
              </div>
              <p className={`text-xs mt-3 leading-relaxed ${isLight ? 'text-slate-500' : 'text-white/60'}`}>
                Competitor holds lead in multi-model head-to-head evaluation prompts.
              </p>
            </div>

            {/* Zone 3: Top Citation Gap */}
            <div className={`p-5 rounded-2xl border flex flex-col justify-between transition-colors ${
              isLight ? 'bg-slate-50/70 border-slate-200/80' : 'bg-[#0a0d13] border-white/[0.06]'
            }`}>
              <div>
                <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-1.5">
                  <span className="font-semibold tracking-wider uppercase text-[10px]">TOP CITATION GAP</span>
                  <span className="text-red-500 font-semibold font-mono text-[11px] bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">
                    Auth 95
                  </span>
                </div>
                <div className={`text-2xl sm:text-3xl font-bold font-mono truncate mt-1 ${
                  isLight ? 'text-slate-900' : 'text-white'
                }`}>
                  gartner.com
                </div>
              </div>
              <p className={`text-xs mt-3 leading-relaxed ${isLight ? 'text-slate-500' : 'text-white/60'}`}>
                Not currently referencing your brand across 261 tracked enterprise buyer answers.
              </p>
            </div>

          </div>

          {/* Integrated WHY Summary Telemetry Strip */}
          <div className={`p-3.5 sm:p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono ${
            isLight ? 'bg-slate-100/70 border-slate-200 text-slate-700' : 'bg-white/[0.02] border-white/[0.05] text-white/80'
          }`}>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
              <span className="text-slate-400 font-bold uppercase text-[10px] tracking-wider">WHY SUMMARY:</span>
              <div className="flex items-center gap-1.5">
                <span className="text-slate-400">Visibility:</span>
                <span className="font-bold text-brand">68.4%</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-slate-400">Share of Voice:</span>
                <span className="font-bold text-cyan-400">24.1%</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-slate-400">Avg Position:</span>
                <span className="font-bold text-emerald-400">#1.4</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-slate-400">Citations:</span>
                <span className="font-bold text-indigo-400">5,033</span>
              </div>
            </div>

            <button
              onClick={onOpenAuth}
              className="text-brand font-semibold hover:underline flex items-center gap-1 cursor-pointer shrink-0 self-start sm:self-auto text-xs"
            >
              <span>Explore workspace breakdown</span>
              <ArrowRight className="size-3" />
            </button>
          </div>

        </div>
      </motion.div>

      {/* Scroll to Explore Cue */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        onClick={onExplore}
        className={`mt-10 flex flex-col items-center gap-1.5 text-xs tracking-widest uppercase cursor-pointer transition-colors ${
          isLight ? 'text-slate-400 hover:text-slate-800' : 'text-white/40 hover:text-white/80'
        }`}
      >
        <span className="font-mono text-[10px]">EXPLORE THE PLATFORM</span>
        <ChevronDown className="size-4 animate-bounce text-blue-500 stroke-[2]" />
      </motion.div>

    </section>
  );
};
