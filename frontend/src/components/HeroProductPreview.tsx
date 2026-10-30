import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Activity,
  ArrowUpRight,
  Sparkles,
  Search,
  Eye,
  Link2,
  TrendingUp,
  Award,
  Layers,
  ArrowRight
} from 'lucide-react';
import {
  OpenAiLogo,
  GoogleGeminiLogo,
  AnthropicLogo,
  PerplexityLogo
} from './ModelLogos';
import { useTheme } from '../context/ThemeContext';

interface HeroProductPreviewProps {
  onOpenAuth: () => void;
}

export const HeroProductPreview: React.FC<HeroProductPreviewProps> = ({ onOpenAuth }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'models' | 'breakdown'>('overview');
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const dimensions = [
    { label: 'Discoverability', score: 94, delta: '+6.2%', color: 'bg-blue-600' },
    { label: 'Understanding', score: 81, delta: '+4.1%', color: 'bg-indigo-600' },
    { label: 'Authority', score: 76, delta: '+9.4%', color: 'bg-cyan-500' },
    { label: 'Citation Coverage', score: 88, delta: '+12.0%', color: 'bg-emerald-500' },
    { label: 'Recommendation', score: 68, delta: '+18.7%', color: 'bg-blue-500' },
  ];

  const models = [
    { name: 'ChatGPT 4o', score: 91, share: '38.4%', citations: 142, Logo: OpenAiLogo },
    { name: 'Gemini 1.5 Pro', score: 84, share: '26.1%', citations: 98, Logo: GoogleGeminiLogo },
    { name: 'Claude 3.5 Sonnet', score: 77, share: '19.8%', citations: 84, Logo: AnthropicLogo },
    { name: 'Perplexity Pro', score: 88, share: '15.7%', citations: 116, Logo: PerplexityLogo },
  ];

  return (
    <section id="hero-preview" className="max-w-6xl mx-auto px-6 pt-4 pb-20 select-none relative">
      
      {/* Floating Badges Around the Main Frame */}
      <div className="hidden lg:block">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className={`absolute -left-4 top-24 z-20 border rounded-2xl p-4 shadow-peec-card flex items-center gap-3.5 ${
            isLight ? 'bg-white border-slate-200/80 text-slate-900' : 'bg-[#0D1017] border-white/10 text-white'
          }`}
        >
          <div className="size-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 flex items-center justify-center text-emerald-600">
            <ArrowUpRight className="size-4" />
          </div>
          <div>
            <span className="text-[10px] font-mono font-bold uppercase text-slate-400 block">30d Growth</span>
            <span className="text-xs font-bold">+12 Verified Mentions</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className={`absolute -right-4 top-36 z-20 border rounded-2xl p-4 shadow-peec-card flex items-center gap-3.5 ${
            isLight ? 'bg-white border-slate-200/80 text-slate-900' : 'bg-[#0D1017] border-white/10 text-white'
          }`}
        >
          <div className="size-9 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200/60 flex items-center justify-center text-blue-600">
            <Link2 className="size-4" />
          </div>
          <div>
            <span className="text-[10px] font-mono font-bold uppercase text-slate-400 block">Authority Index</span>
            <span className="text-xs font-bold">+8 High-Impact Citations</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className={`absolute left-12 -bottom-6 z-20 border rounded-2xl p-4 shadow-peec-card flex items-center gap-3.5 ${
            isLight ? 'bg-white border-slate-200/80 text-slate-900' : 'bg-[#0D1017] border-white/10 text-white'
          }`}
        >
          <div className="size-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200/60 flex items-center justify-center text-indigo-600">
            <Sparkles className="size-4" />
          </div>
          <div>
            <span className="text-[10px] font-mono font-bold uppercase text-slate-400 block">Synthesis Alert</span>
            <span className="text-xs font-bold">+4 Recommended Prompts</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className={`absolute right-12 -bottom-6 z-20 border rounded-2xl p-4 shadow-peec-card flex items-center gap-3.5 ${
            isLight ? 'bg-white border-slate-200/80 text-slate-900' : 'bg-[#0D1017] border-white/10 text-white'
          }`}
        >
          <div className="size-9 rounded-xl bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-200/60 flex items-center justify-center text-cyan-600">
            <TrendingUp className="size-4" />
          </div>
          <div>
            <span className="text-[10px] font-mono font-bold uppercase text-slate-400 block">Competitive Gap</span>
            <span className="text-xs font-bold">-2 Competitor Leads</span>
          </div>
        </motion.div>
      </div>

      {/* Main Elevated Product Frame */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, delay: 0.2 }}
        className={`rounded-[28px] sm:rounded-[36px] border shadow-peec-shell overflow-hidden relative transition-all ${
          isLight ? 'bg-white border-slate-200/90' : 'bg-[#080A0D] border-white/[0.08]'
        }`}
      >
        
        {/* Hardware-Quality Top Window Chrome */}
        <div className={`h-12 px-6 border-b flex items-center justify-between ${
          isLight ? 'bg-slate-50/90 border-slate-200/80' : 'bg-[#0B0E14] border-white/5'
        }`}>
          <div className="flex items-center gap-2">
            <span className="size-2.5 rounded-full bg-[#FF5F57] inline-block border border-black/10" />
            <span className="size-2.5 rounded-full bg-[#FEBC2E] inline-block border border-black/10" />
            <span className="size-2.5 rounded-full bg-[#28C840] inline-block border border-black/10" />
          </div>

          <div className="flex items-center gap-2 font-mono text-xs text-slate-400 font-semibold">
            <span className={isLight ? 'text-slate-800' : 'text-white'}>dyvin.ai</span>
            <span>/</span>
            <span className="text-blue-500">live-intelligence</span>
          </div>

          <div className="flex items-center gap-2 font-mono text-[11px] font-bold text-emerald-600">
            <span className="size-2 rounded-full bg-emerald-500 animate-ping" />
            <span>LIVE ●</span>
          </div>
        </div>

        {/* Interior Product Layout */}
        <div className="p-6 sm:p-8">
          
          {/* Top Metric Header Row */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pb-8 border-b border-slate-100 dark:border-white/5 items-center">
            
            {/* Big Dominant Hero Score */}
            <div className={`md:col-span-5 rounded-2xl p-6 border ${
              isLight ? 'bg-slate-50/70 border-slate-200/80' : 'bg-[#0D1017] border-white/5'
            }`}>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono uppercase font-bold tracking-widest text-slate-400">
                  AI Visibility Score
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-mono font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200/50">
                  <ArrowUpRight className="size-3" />
                  +18.7%
                </span>
              </div>

              <div className="mt-3 flex items-baseline gap-3">
                <span className={`text-5xl sm:text-6xl font-black font-display tracking-tight tnum ${
                  isLight ? 'text-slate-900' : 'text-white'
                }`}>
                  86.4
                </span>
                <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                  / 100 Index
                </span>
              </div>

              <p className="mt-3 text-xs text-slate-500 dark:text-white/60 font-sans leading-relaxed">
                Aggregated cross-model discoverability, citation authority, and recommendation frequency.
              </p>
            </div>

            {/* Quick Action Navigation Tabs */}
            <div className="md:col-span-7 flex flex-col justify-between h-full space-y-4">
              <div className="flex items-center gap-2 bg-slate-100 dark:bg-white/5 p-1 rounded-xl w-fit border border-slate-200/60 dark:border-white/5">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'overview'
                      ? isLight ? 'bg-white text-slate-900 shadow-xs' : 'bg-white/10 text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
                  }`}
                >
                  5 Dimensions
                </button>
                <button
                  onClick={() => setActiveTab('models')}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'models'
                      ? isLight ? 'bg-white text-slate-900 shadow-xs' : 'bg-white/10 text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
                  }`}
                >
                  Model Matrix
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
                <div className={`p-3 rounded-xl border ${
                  isLight ? 'bg-slate-50/70 border-slate-200/60' : 'bg-white/[0.02] border-white/5'
                }`}>
                  <span className="text-[10px] text-slate-400 uppercase block">Prompts</span>
                  <span className={`text-lg font-bold tnum ${isLight ? 'text-slate-900' : 'text-white'}`}>1,284</span>
                </div>
                <div className={`p-3 rounded-xl border ${
                  isLight ? 'bg-slate-50/70 border-slate-200/60' : 'bg-white/[0.02] border-white/5'
                }`}>
                  <span className="text-[10px] text-slate-400 uppercase block">Citations</span>
                  <span className={`text-lg font-bold tnum ${isLight ? 'text-slate-900' : 'text-white'}`}>342</span>
                </div>
                <div className={`p-3 rounded-xl border ${
                  isLight ? 'bg-slate-50/70 border-slate-200/60' : 'bg-white/[0.02] border-white/5'
                }`}>
                  <span className="text-[10px] text-slate-400 uppercase block">Competitors</span>
                  <span className={`text-lg font-bold tnum ${isLight ? 'text-slate-900' : 'text-white'}`}>12</span>
                </div>
                <div className={`p-3 rounded-xl border ${
                  isLight ? 'bg-slate-50/70 border-slate-200/60' : 'bg-white/[0.02] border-white/5'
                }`}>
                  <span className="text-[10px] text-slate-400 uppercase block">AI Engines</span>
                  <span className="text-lg font-bold text-blue-500 tnum">6 / 6</span>
                </div>
              </div>
            </div>

          </div>

          {/* Dynamic Content View Area */}
          <div className="pt-6">
            {activeTab === 'overview' ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-2">
                  <span>Core Visibility Dimensions</span>
                  <span>Benchmark Status</span>
                </div>

                <div className="space-y-3">
                  {dimensions.map((dim) => (
                    <div
                      key={dim.label}
                      className={`p-3.5 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                        isLight
                          ? 'bg-slate-50/50 border-slate-200/70 hover:bg-white hover:border-slate-300'
                          : 'bg-white/[0.02] border-white/5 hover:bg-white/5 hover:border-white/10'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-[180px]">
                        <span className={`text-xs font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>{dim.label}</span>
                        <span className="text-[11px] font-mono text-emerald-600 font-semibold">{dim.delta}</span>
                      </div>

                      {/* Progress Bar Meter */}
                      <div className="flex-1 flex items-center gap-3">
                        <div className="flex-1 h-2 rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${dim.color} transition-all duration-700`}
                            style={{ width: `${dim.score}%` }}
                          />
                        </div>
                        <span className={`font-mono text-xs font-bold min-w-[36px] text-right tnum ${
                          isLight ? 'text-slate-900' : 'text-white'
                        }`}>
                          {dim.score}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {models.map((mod) => (
                  <div
                    key={mod.name}
                    className={`p-4 rounded-xl border transition-all flex flex-col justify-between shadow-xs ${
                      isLight
                        ? 'bg-slate-50/50 border-slate-200/80 hover:bg-white hover:border-blue-300'
                        : 'bg-white/[0.02] border-white/5 hover:bg-white/5 hover:border-white/10'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <mod.Logo className="size-4.5" />
                        <span className="text-[10px] font-mono font-bold bg-white dark:bg-white/10 px-2 py-0.5 rounded border border-slate-200 dark:border-white/10 text-slate-700 dark:text-white/80">
                          {mod.share} SoV
                        </span>
                      </div>
                      <span className={`text-xs font-bold block ${isLight ? 'text-slate-900' : 'text-white'}`}>{mod.name}</span>
                      <div className="mt-2 text-2xl font-black font-display text-blue-500 tnum">
                        {mod.score} <span className="text-[11px] font-mono font-normal text-slate-400">/100</span>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-white/5 flex items-center justify-between text-[11px] font-mono text-slate-400">
                      <span>Citations</span>
                      <span className={`font-bold tnum ${isLight ? 'text-slate-800' : 'text-white'}`}>{mod.citations}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Bottom Call to Action Ribbon */}
          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-white/60 font-medium">
              <Sparkles className="size-4 text-blue-500" />
              <span>Real-time synthesis across enterprise evaluation queries.</span>
            </div>

            <button
              onClick={onOpenAuth}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline uppercase tracking-wider cursor-pointer"
            >
              <span>Analyze Your Complete Domain</span>
              <ArrowRight className="size-3.5" />
            </button>
          </div>

        </div>

      </motion.div>
    </section>
  );
};
