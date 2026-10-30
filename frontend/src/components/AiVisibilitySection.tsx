import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SectionEyebrow } from './primitives';
import {
  Eye,
  TrendingUp,
  Hash,
  MessageSquare,
  ArrowUpRight,
  Sparkles,
  HelpCircle,
  X,
  CheckCircle2,
  ShieldCheck,
  Activity,
  Layers,
  ArrowRight,
  Info
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface AiVisibilitySectionProps {
  onOpenAuth?: () => void;
}

export const AiVisibilitySection: React.FC<AiVisibilitySectionProps> = ({ onOpenAuth }) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);
  const [activeMetricDetail, setActiveMetricDetail] = useState<string | null>(null);
  const [showGapsDrawer, setShowGapsDrawer] = useState(false);

  // Close modal on Escape key for full accessibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showGapsDrawer) {
        setShowGapsDrawer(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showGapsDrawer]);

  const trendData = [
    { day: 'Day 1', score: 59.7, x: 20, y: 76 },
    { day: 'Day 5', score: 60.8, x: 75, y: 68 },
    { day: 'Day 10', score: 62.1, x: 130, y: 58 },
    { day: 'Day 15', score: 63.4, x: 185, y: 48 },
    { day: 'Day 20', score: 65.2, x: 240, y: 36 },
    { day: 'Day 25', score: 66.9, x: 295, y: 24 },
    { day: 'Day 30', score: 68.4, x: 350, y: 12 },
  ];

  const queryClusters = [
    { name: 'Enterprise Evaluation', queries: 162, score: 72, state: 'Strong Coverage', stateStyle: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20' },
    { name: 'Category Discovery', queries: 148, score: 68, state: 'Strong Coverage', stateStyle: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20' },
    { name: 'Comparison & Alternatives', queries: 124, score: 54, state: 'Gap Detected', stateStyle: 'text-amber-500 bg-amber-500/10 border-amber-500/20' },
    { name: 'Implementation & Architecture', queries: 106, score: 81, state: 'Category Leader', stateStyle: 'text-cyan-500 bg-cyan-500/10 border-cyan-500/20' }
  ];

  const gapsData = [
    {
      cluster: 'Enterprise Comparison Prompts',
      yourVis: '54%',
      compVis: '71%',
      competitor: 'Atlas AI',
      gap: '−17 pts',
      priority: 'HIGH',
      rootCause: 'Atlas AI appears across 4 additional review and analyst sources in head-to-head buyer queries.',
      action: 'Close missing enterprise review-grid citation gap across G2 and Gartner.'
    },
    {
      cluster: 'AI Search Monitoring Evaluation',
      yourVis: '61%',
      compVis: '74%',
      competitor: 'Atlas AI',
      gap: '−13 pts',
      priority: 'HIGH',
      rootCause: 'Uncited in 2 analyst market guides evaluating generative discovery tools.',
      action: 'Publish verified multi-model accuracy benchmarks and comparison whitepapers.'
    },
    {
      cluster: 'Answer Engine Tooling Alternatives',
      yourVis: '52%',
      compVis: '66%',
      competitor: 'CloudRank',
      gap: '−14 pts',
      priority: 'MEDIUM',
      rootCause: 'Competitor leverages indexed partner directory schema on Google Cloud.',
      action: 'Deploy structured capability schema to capture alternative discovery queries.'
    }
  ];

  return (
    <section id="ai-visibility" className={`py-14 md:py-20 border-b relative z-10 select-none transition-colors ${
      isLight ? 'bg-white border-slate-200/80 text-slate-900' : 'bg-[#000000] border-white/[0.08] text-white'
    }`}>
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Editorial Section Header */}
        <div className="max-w-3xl mb-10">
          <SectionEyebrow label="VISIBILITY INTELLIGENCE" tag="The Core Benchmark" />
          
          <h2 className={`mt-4 text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight leading-[1.08] font-display ${
            isLight ? 'text-slate-900' : 'text-white'
          }`}>
            Know how visible your brand <br className="hidden sm:inline" />
            <span className={isLight ? 'text-slate-500' : 'text-white/60'}>
              is to AI.
            </span>
          </h2>
          
          <p className={`mt-3 text-base md:text-lg leading-[1.65] font-normal ${
            isLight ? 'text-slate-600' : 'text-white/70'
          }`}>
            Dyvin evaluates the buyer questions that matter to your category across leading AI engines, then measures how often your brand appears, where it ranks, and how competitors compare.
          </p>
        </div>

        {/* Primary Showpiece: Unified Visibility Measurement Instrument */}
        <div className={`rounded-3xl border shadow-2xl transition-all relative overflow-hidden ${
          isLight
            ? 'bg-[#FBFBFC] border-slate-200 shadow-slate-200/50 text-slate-900'
            : 'bg-[#080a0d] border-white/[0.09] shadow-black/80 text-white'
        }`}>
          
          {/* Top Status & Context Header */}
          <div className={`px-6 py-4 border-b flex flex-wrap items-center justify-between gap-3 text-xs font-mono ${
            isLight ? 'bg-slate-100/70 border-slate-200 text-slate-600' : 'bg-[#0c0f14] border-white/[0.06] text-white/60'
          }`}>
            <div className="flex items-center gap-2">
              <Eye className="size-3.5 text-brand" />
              <span className="font-semibold uppercase tracking-wider text-brand">Dyvin AI Visibility Framework</span>
              <span className="text-slate-300 dark:text-white/20">•</span>
              <span className="text-[11px] hidden sm:inline">540 Evaluation Queries Across 6 Frontier Engines</span>
            </div>

            <span className={`px-2 py-0.5 rounded border text-[10px] uppercase font-bold tracking-wider ${
              isLight ? 'bg-slate-200/70 border-slate-300 text-slate-600' : 'bg-white/5 border-white/10 text-white/40'
            }`}>
              SAMPLE BENCHMARK
            </span>
          </div>

          {/* Core Measurement Canvas Grid */}
          <div className="p-6 sm:p-8 space-y-6">
            
            {/* Zone 1: The Dominant KPI Hero + 30-Day Trajectory Graph */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              
              {/* Dominant KPI Card (Level 1 Visual Anchor) */}
              <div className={`lg:col-span-5 p-6 sm:p-7 rounded-2xl border flex flex-col justify-between ${
                isLight ? 'bg-white border-slate-200/90 shadow-xs' : 'bg-[#0a0d13] border-white/[0.06] shadow-xs'
              }`}>
                <div>
                  <div className="flex items-center justify-between text-[10px] font-mono uppercase text-slate-400 font-bold mb-2">
                    <span>PRIMARY BENCHMARK</span>
                    <span className="text-emerald-500 font-semibold">30-DAY ACTIVE SCAN</span>
                  </div>

                  <span className={`text-xs font-mono uppercase tracking-wider block ${isLight ? 'text-slate-500' : 'text-white/50'}`}>
                    AI Visibility Score
                  </span>

                  <div className="flex items-baseline justify-between mt-2">
                    <span className="text-5xl sm:text-6xl font-bold font-mono tracking-tight text-brand tnum">
                      68.4%
                    </span>
                    <span className="inline-flex items-center gap-1 font-mono text-xs font-semibold text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-3 py-1 rounded-full">
                      <ArrowUpRight className="size-3.5" />
                      <span>+8.7 pts · 30d</span>
                    </span>
                  </div>

                  {/* Scope Metadata */}
                  <div className="mt-4 flex flex-wrap items-center gap-3 text-[11px] font-mono text-slate-400 pt-3 border-t border-slate-100 dark:border-white/[0.05]">
                    <span>540 evaluation queries</span>
                    <span>•</span>
                    <span>6 AI engines</span>
                    <span>•</span>
                    <span className="text-brand font-semibold">Top Quartile</span>
                  </div>

                  {/* Methodology Explanation */}
                  <p className={`mt-3 text-xs leading-relaxed font-sans ${isLight ? 'text-slate-600' : 'text-white/70'}`}>
                    Dyvin's AI Visibility Score measures the percentage of tracked buyer queries where your brand is recommended or cited across monitored AI systems.
                  </p>
                </div>

                <div className={`mt-5 pt-3 border-t flex items-center justify-between text-xs font-mono ${
                  isLight ? 'border-slate-100 text-slate-500' : 'border-white/[0.05] text-white/50'
                }`}>
                  <span>Baseline: 59.7%</span>
                  <span className="text-cyan-400 font-semibold">Current: 68.4%</span>
                </div>
              </div>

              {/* 30-Day Trajectory Precision Graph */}
              <div className={`lg:col-span-7 p-6 sm:p-7 rounded-2xl border flex flex-col justify-between ${
                isLight ? 'bg-white border-slate-200/90 shadow-xs' : 'bg-[#0a0d13] border-white/[0.06] shadow-xs'
              }`}>
                <div>
                  <div className="flex items-center justify-between text-xs font-mono pb-2 border-b border-slate-100 dark:border-white/[0.05] mb-4">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="size-3.5 text-cyan-400" />
                      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                        30-DAY AI VISIBILITY PROGRESSION
                      </span>
                    </div>
                    <span className="text-brand font-semibold font-mono text-[11px]">
                      {hoveredPoint !== null ? `${trendData[hoveredPoint].day}: ${trendData[hoveredPoint].score}% Visibility` : '59.7% → 68.4% (+8.7 pts)'}
                    </span>
                  </div>

                  {/* Accessible Precision SVG Chart */}
                  <div className="relative w-full h-36">
                    <svg
                      viewBox="0 0 370 90"
                      className="w-full h-full overflow-visible"
                      role="img"
                      aria-label="Sample 30-day AI visibility trend increasing from 59.7 percent to 68.4 percent"
                    >
                      <defs>
                        <linearGradient id="visSvgGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.28" />
                          <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>

                      {/* Understated Horizontal Guidelines */}
                      <line x1="20" y1="76" x2="350" y2="76" stroke={isLight ? '#E2E8F0' : 'rgba(255,255,255,0.06)'} strokeWidth="1" strokeDasharray="3 3" />
                      <line x1="20" y1="48" x2="350" y2="48" stroke={isLight ? '#E2E8F0' : 'rgba(255,255,255,0.06)'} strokeWidth="1" strokeDasharray="3 3" />
                      <line x1="20" y1="12" x2="350" y2="12" stroke={isLight ? '#E2E8F0' : 'rgba(255,255,255,0.06)'} strokeWidth="1" strokeDasharray="3 3" />

                      {/* Area Fill Under Curve */}
                      <path
                        d="M 20 76 L 75 68 L 130 58 L 185 48 L 240 36 L 295 24 L 350 12 L 350 76 L 20 76 Z"
                        fill="url(#visSvgGradient)"
                      />

                      {/* High-Precision Stroke */}
                      <path
                        d="M 20 76 L 75 68 L 130 58 L 185 48 L 240 36 L 295 24 L 350 12"
                        stroke="#0ea5e9"
                        strokeWidth="2.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        fill="none"
                      />

                      {/* Plotted Interactive Points */}
                      {trendData.map((pt, idx) => (
                        <g
                          key={pt.day}
                          onMouseEnter={() => setHoveredPoint(idx)}
                          onMouseLeave={() => setHoveredPoint(null)}
                          className="cursor-pointer"
                        >
                          <circle
                            cx={pt.x}
                            cy={pt.y}
                            r={hoveredPoint === idx ? 5.5 : (idx === trendData.length - 1 ? 4 : 2.5)}
                            fill={idx === trendData.length - 1 ? '#0ea5e9' : (isLight ? '#0F172A' : '#FFFFFF')}
                            stroke="#0ea5e9"
                            strokeWidth={hoveredPoint === idx ? 2 : 1}
                            className="transition-all"
                          />
                        </g>
                      ))}
                    </svg>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-2 border-t border-slate-100 dark:border-white/[0.05]">
                  <span>Day 1 (59.7%)</span>
                  <span>Day 10 (62.1%)</span>
                  <span>Day 20 (65.2%)</span>
                  <span className="text-brand font-bold">Day 30 (68.4%)</span>
                </div>
              </div>

            </div>

            {/* Zone 2: Subordinated Secondary Metrics (3 Columns) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              
              {/* Secondary 1: Share of Voice */}
              <div className={`p-4 rounded-2xl border transition-all ${
                isLight ? 'bg-white border-slate-200/90' : 'bg-[#0a0d13] border-white/[0.06]'
              }`}>
                <div className="flex items-center justify-between text-[10px] font-mono uppercase text-slate-400">
                  <span>SHARE OF VOICE</span>
                  <span className="text-amber-500 font-semibold">−2.7 pts Gap</span>
                </div>
                <div className={`text-2xl font-bold font-mono tracking-tight mt-1 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  24.1%
                </div>
                <p className={`mt-1.5 text-[11px] leading-snug ${isLight ? 'text-slate-500' : 'text-white/60'}`}>
                  Percentage of category recommendations attributed to your brand vs Atlas AI (26.8%).
                </p>
              </div>

              {/* Secondary 2: Average Position */}
              <div className={`p-4 rounded-2xl border transition-all ${
                isLight ? 'bg-white border-slate-200/90' : 'bg-[#0a0d13] border-white/[0.06]'
              }`}>
                <div className="flex items-center justify-between text-[10px] font-mono uppercase text-slate-400">
                  <span>AVG POSITION</span>
                  <span className="text-emerald-500 font-semibold">+0.4 Rank Jump</span>
                </div>
                <div className={`text-2xl font-bold font-mono tracking-tight mt-1 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  #1.4
                </div>
                <p className={`mt-1.5 text-[11px] leading-snug ${isLight ? 'text-slate-500' : 'text-white/60'}`}>
                  Average position when AI systems produce ordered vendor recommendations.
                </p>
              </div>

              {/* Secondary 3: Tracked Mentions */}
              <div className={`p-4 rounded-2xl border transition-all ${
                isLight ? 'bg-white border-slate-200/90' : 'bg-[#0a0d13] border-white/[0.06]'
              }`}>
                <div className="flex items-center justify-between text-[10px] font-mono uppercase text-slate-400">
                  <span>TRACKED MENTIONS</span>
                  <span className="text-cyan-400 font-semibold">148 Domains</span>
                </div>
                <div className={`text-2xl font-bold font-mono tracking-tight mt-1 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  5,033
                </div>
                <p className={`mt-1.5 text-[11px] leading-snug ${isLight ? 'text-slate-500' : 'text-white/60'}`}>
                  Observed brand references and citations across evaluated answers and source publications.
                </p>
              </div>

              {/* Secondary 4: Sentiment */}
              <div className={`p-4 rounded-2xl border transition-all ${
                isLight ? 'bg-white border-slate-200/90' : 'bg-[#0a0d13] border-white/[0.06]'
              }`}>
                <div className="flex items-center justify-between text-[10px] font-mono uppercase text-slate-400">
                  <span>NET SENTIMENT</span>
                  <span className="text-emerald-500 font-semibold">Positive</span>
                </div>
                <div className={`text-2xl font-bold font-mono tracking-tight mt-1 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  89 / 100
                </div>
                <p className={`mt-1.5 text-[11px] leading-snug ${isLight ? 'text-slate-500' : 'text-white/60'}`}>
                  How positively AI models characterize your product architecture and capabilities.
                </p>
              </div>

            </div>

            {/* Zone 3: Visibility By Query Cluster & Gap Detection */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
              
              {/* Left 7 Cols: Query Cluster Breakdown */}
              <div className={`lg:col-span-7 p-5 sm:p-6 rounded-2xl border ${
                isLight ? 'bg-white border-slate-200/90' : 'bg-[#0a0d13] border-white/[0.06]'
              }`}>
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100 dark:border-white/[0.05] text-xs font-mono">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    VISIBILITY BY BUYER QUERY CLUSTER (540 QUERIES)
                  </span>
                  <span className="text-slate-400">INCLUSION RATE</span>
                </div>

                <div className="space-y-3 font-mono text-xs">
                  {queryClusters.map((c) => (
                    <div key={c.name} className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-sans font-medium text-xs text-slate-800 dark:text-white/90">
                          {c.name} ({c.queries} queries)
                        </span>
                        <div className="flex items-center gap-2">
                          <span className={`text-[9px] px-1.5 py-0.2 rounded border font-bold ${c.stateStyle}`}>
                            {c.state}
                          </span>
                          <span className="font-bold text-slate-800 dark:text-white">{c.score}%</span>
                        </div>
                      </div>
                      {/* Progress Bar */}
                      <div className={`w-full h-1.5 rounded-full overflow-hidden ${
                        isLight ? 'bg-slate-100' : 'bg-white/5'
                      }`}>
                        <div
                          className={`h-full rounded-full ${
                            c.score >= 70 ? 'bg-brand' : c.score >= 60 ? 'bg-cyan-400' : 'bg-amber-500'
                          }`}
                          style={{ width: `${c.score}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right 5 Cols: Prescriptive Gap Alert Card */}
              <div className={`lg:col-span-5 p-5 sm:p-6 rounded-2xl border flex flex-col justify-between gap-4 ${
                isLight
                  ? 'bg-blue-50/70 border-blue-200 text-blue-950 shadow-xs'
                  : 'bg-blue-950/20 border-blue-500/25 text-blue-200 shadow-xs'
              }`}>
                <div>
                  <div className="flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-wider text-blue-500 mb-2">
                    <Sparkles className="size-3.5" />
                    <span>VISIBILITY GAP DETECTED</span>
                  </div>

                  <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">
                    3 High-Value Query Clusters Underrepresented
                  </h3>

                  <p className="mt-2 text-xs font-sans font-medium leading-relaxed">
                    Comparison-oriented buyer queries reveal an addressable −17 pts deficit against Atlas AI, caused by missing analyst directory citations.
                  </p>

                  <div className="mt-4 pt-3 border-t border-blue-200/60 dark:border-blue-500/20 font-mono text-xs text-blue-500 font-bold">
                    <span>Potential Modeled Gain: +7.4 pts</span>
                  </div>
                </div>

                <button
                  onClick={() => setShowGapsDrawer(true)}
                  className="w-full inline-flex items-center justify-center gap-2 font-mono text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 py-2.5 rounded-xl shadow-xs transition-all cursor-pointer"
                >
                  <span>View visibility gaps</span>
                  <ArrowUpRight className="size-3.5" />
                </button>
              </div>

            </div>

          </div>

          {/* Bottom Narrative Transition Bar */}
          <div className={`px-6 py-4 border-t flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono ${
            isLight ? 'bg-slate-100/70 border-slate-200 text-slate-600' : 'bg-[#0c0f14] border-white/[0.06] text-white/70'
          }`}>
            <span>Your visibility score is evaluated across multiple frontier AI engines in real-time.</span>
            <button
              onClick={onOpenAuth}
              className={`font-semibold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs transition-all shrink-0 ${
                isLight
                  ? 'bg-slate-900 text-white hover:bg-slate-800'
                  : 'bg-white text-black hover:bg-white/90'
              }`}
            >
              <span>Audit your category visibility</span>
              <ArrowRight className="size-3.5" />
            </button>
          </div>

        </div>

      </div>

      {/* Focused Diagnostic Visibility Gaps Modal / Drawer */}
      <AnimatePresence>
        {showGapsDrawer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className={`w-full max-w-2xl rounded-3xl border p-6 sm:p-7 shadow-2xl transition-colors ${
                isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-[#0D1017] border-white/15 text-white'
              }`}
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-white/10 mb-5">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-blue-500">
                      DIAGNOSTIC INSPECTOR
                    </span>
                    <span className="text-slate-400">•</span>
                    <span className="text-xs font-mono text-slate-400">3 Priority Query Clusters</span>
                  </div>
                  <h3 className="text-lg font-bold font-display mt-0.5">High-Value Visibility Gaps</h3>
                </div>
                <button
                  onClick={() => setShowGapsDrawer(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/10 transition-colors cursor-pointer"
                  aria-label="Close visibility gaps drawer"
                >
                  <X className="size-4" />
                </button>
              </div>

              <div className="space-y-3 max-h-[60vh] overflow-y-auto custom-scrollbar pr-1">
                {gapsData.map((g) => (
                  <div
                    key={g.cluster}
                    className={`p-4 rounded-2xl border space-y-2.5 ${
                      isLight ? 'bg-slate-50 border-slate-200' : 'bg-black/40 border-white/[0.08]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs font-sans">{g.cluster}</span>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded border font-bold ${
                        g.priority === 'HIGH' ? 'text-red-500 bg-red-500/10 border-red-500/20' : 'text-amber-500 bg-amber-500/10 border-amber-500/20'
                      }`}>
                        {g.priority} PRIORITY
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 font-mono text-xs pt-1">
                      <div>
                        <span className="text-[10px] text-slate-400 block">Your Visibility</span>
                        <span className="font-bold text-slate-800 dark:text-white">{g.yourVis}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">{g.competitor}</span>
                        <span className="font-bold text-amber-500">{g.compVis}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">Gap</span>
                        <span className="font-bold text-red-500">{g.gap}</span>
                      </div>
                    </div>

                    <div className={`p-2.5 rounded-xl border text-xs space-y-1 ${
                      isLight ? 'bg-white border-slate-200 text-slate-700' : 'bg-white/[0.03] border-white/5 text-white/80'
                    }`}>
                      <div className="flex items-start gap-1.5">
                        <span className="font-mono font-bold text-[10px] uppercase text-slate-400 shrink-0 mt-0.5">Root Cause:</span>
                        <span className="text-[11px] font-sans">{g.rootCause}</span>
                      </div>
                      <div className="flex items-start gap-1.5 pt-1 border-t border-slate-100 dark:border-white/5">
                        <span className="font-mono font-bold text-[10px] uppercase text-brand shrink-0 mt-0.5">Action:</span>
                        <span className="text-[11px] font-sans font-medium text-brand">{g.action}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-white/10 flex items-center justify-between">
                <span className="text-xs font-mono text-slate-400">Total Modeled Gain: +7.4 pts</span>
                <button
                  onClick={() => { setShowGapsDrawer(false); onOpenAuth?.(); }}
                  className="px-4 py-2 rounded-xl bg-brand text-white font-semibold text-xs hover:bg-brand/90 transition-all cursor-pointer shadow-sm"
                >
                  Close Citation Gaps in Workspace →
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
};
