import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Search,
  LayoutDashboard,
  MessageSquare,
  Link2,
  Cpu,
  GitCompare,
  TrendingUp,
  ArrowUpRight,
  ShieldCheck,
  Activity,
  X,
  Info,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sliders,
  ExternalLink
} from 'lucide-react';
import { SectionEyebrow } from './primitives';
import {
  OpenAiLogo,
  AnthropicLogo,
  GoogleGeminiLogo,
  PerplexityLogo,
  CopilotLogo,
  GrokLogo
} from './ModelLogos';
import { useTheme } from '../context/ThemeContext';

interface AiDashboardMockupProps {
  onOpenAuth: () => void;
}

type TabType = 'overview' | 'prompts' | 'sources' | 'models' | 'competitors';

export const AiDashboardMockup: React.FC<AiDashboardMockupProps> = ({ onOpenAuth }) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [activeDrilldown, setActiveDrilldown] = useState<string | null>(null);
  const [hoveredDay, setHoveredDay] = useState<{ day: string; score: number } | null>(null);
  const [selectedPromptIndex, setSelectedPromptIndex] = useState(0);

  // Close modal on Escape key for full accessibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && activeDrilldown) {
        setActiveDrilldown(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeDrilldown]);

  // Restrained 3D Perspective Tilt for Desktop
  const containerRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || window.matchMedia('(prefers-reduced-motion: reduce)').matches || window.innerWidth < 1024) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: x * 1.5, y: y * -1.5 });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  // 30-Day Benchmark Trajectory Data
  const trajectoryPoints = [
    { day: 'Day 1', score: 59.7 },
    { day: 'Day 5', score: 60.8 },
    { day: 'Day 10', score: 62.1 },
    { day: 'Day 15', score: 63.4 },
    { day: 'Day 20', score: 65.2 },
    { day: 'Day 25', score: 66.9 },
    { day: 'Day 30', score: 68.4 }
  ];

  // Model Telemetry Matrix (6 Frontier Engines)
  const models = [
    { name: 'ChatGPT 4o', provider: 'OpenAI', visibility: '72.4%', status: 'Active', Logo: OpenAiLogo },
    { name: 'Claude 3.5', provider: 'Anthropic', visibility: '70.8%', status: 'Active', Logo: AnthropicLogo },
    { name: 'Gemini 1.5', provider: 'Google', visibility: '69.1%', status: 'Opportunity', Logo: GoogleGeminiLogo },
    { name: 'Perplexity', provider: 'Perplexity', visibility: '74.8%', status: 'Active', Logo: PerplexityLogo },
    { name: 'Copilot', provider: 'Microsoft', visibility: '62.3%', status: 'Active', Logo: CopilotLogo },
    { name: 'Grok 2', provider: 'xAI', visibility: '48.9%', status: 'Opportunity', Logo: GrokLogo }
  ];

  // Prompt Intelligence Sample Rows
  const promptList = [
    {
      prompt: 'Which enterprise platforms should I evaluate for AI search visibility?',
      position: '#2',
      visibility: '68.4%',
      sentiment: '89 / 100',
      trend: '↑ +4.2%',
      displacedBy: 'Atlas AI (#1)'
    },
    {
      prompt: 'What are the best platforms for monitoring AI search and answer engines?',
      position: '#2',
      visibility: '64.2%',
      sentiment: '86 / 100',
      trend: '↑ +3.1%',
      displacedBy: 'Atlas AI (#1)'
    },
    {
      prompt: 'Which tools help enterprise brands improve conversational AI recommendations?',
      position: '#1',
      visibility: '78.1%',
      sentiment: '94 / 100',
      trend: '↑ +6.8%',
      displacedBy: 'None (Market Leader)'
    }
  ];

  // Source Authority Index Rows
  const sourceList = [
    { domain: 'gartner.com', auth: 95, status: 'Citation Gap', statusStyle: 'text-red-500 bg-red-500/10 border-red-500/20' },
    { domain: 'techcrunch.com', auth: 94, status: 'Active Citation', statusStyle: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20' },
    { domain: 'g2.com', auth: 89, status: 'Active Citation', statusStyle: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20' },
    { domain: 'reddit.com', auth: 74, status: 'Rising Influence', statusStyle: 'text-amber-500 bg-amber-500/10 border-amber-500/20' }
  ];

  return (
    <section id="dashboard-mockup" className={`py-14 md:py-20 border-b select-none transition-colors relative z-10 ${
      isLight ? 'bg-slate-50/70 border-slate-200/80 text-slate-900' : 'bg-[#000000] border-white/[0.08] text-white'
    }`}>
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Editorial Section Header */}
        <div className="max-w-3xl mb-10">
          <SectionEyebrow label="AI PRESENCE COMMAND CENTER" tag="The Workspace" />

          <h2 className={`mt-4 text-3xl sm:text-4xl md:text-5xl font-semibold font-display tracking-tight leading-[1.08] ${
            isLight ? 'text-slate-900' : 'text-white'
          }`}>
            See your entire AI presence <br className="hidden sm:inline" />
            <span className={isLight ? 'text-slate-500' : 'text-white/60'}>
              in one workspace.
            </span>
          </h2>

          <p className={`mt-3 text-base md:text-lg leading-[1.65] font-normal ${
            isLight ? 'text-slate-600' : 'text-white/70'
          }`}>
            Monitor the prompts, models, sources, competitors, and recommendations shaping how AI represents your brand across frontier generative systems.
          </p>
        </div>

        {/* Primary Product Showpiece: Single Unified Enterprise Workspace Shell */}
        <div
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="perspective-1200"
        >
          <motion.div
            style={{
              transform: `rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`,
              transition: 'transform 0.15s ease-out'
            }}
            className={`rounded-3xl border shadow-2xl transition-all relative overflow-hidden ${
              isLight
                ? 'bg-white border-slate-200 shadow-slate-200/50 text-slate-900'
                : 'bg-[#080a0d] border-white/[0.09] shadow-black/90 text-white'
            }`}
          >
            
            {/* Top Application Window Chrome */}
            <div className={`px-5 py-3 border-b flex flex-wrap items-center justify-between gap-3 text-xs font-mono ${
              isLight ? 'bg-slate-100/80 border-slate-200 text-slate-600' : 'bg-[#0c0f14] border-white/[0.06] text-white/60'
            }`}>
              {/* Traffic Light Dots + Breadcrumbs */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5" aria-hidden="true">
                  <div className="size-2.5 rounded-full bg-[#FF5F57]/80" />
                  <div className="size-2.5 rounded-full bg-[#FEBC2E]/80" />
                  <div className="size-2.5 rounded-full bg-[#28C840]/80" />
                </div>
                <div className="flex items-center gap-1 text-[11px] text-slate-400">
                  <span className="font-semibold text-brand">dyvin.ai</span>
                  <span>/</span>
                  <span className={isLight ? 'text-slate-700' : 'text-white/80'}>workspace</span>
                  <span>/</span>
                  <span className="text-slate-400">enterprise-presence</span>
                </div>
              </div>

              {/* Status Indicator & Truth Badge */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 text-emerald-500 font-semibold text-[11px]">
                  <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>540 EVALUATION QUERIES</span>
                </div>
                <span className="text-slate-300 dark:text-white/20">•</span>
                <span className={`px-2 py-0.5 rounded border text-[10px] uppercase font-bold tracking-wider ${
                  isLight ? 'bg-slate-200/70 border-slate-300 text-slate-600' : 'bg-white/5 border-white/10 text-white/40'
                }`}>
                  SAMPLE WORKSPACE
                </span>
              </div>
            </div>

            {/* Workspace Inner Navigation Bar */}
            <div className={`px-6 py-2.5 border-b flex flex-wrap items-center justify-between gap-3 text-xs font-mono ${
              isLight ? 'bg-slate-50/50 border-slate-200' : 'bg-[#0a0d13] border-white/[0.05]'
            }`}>
              <div className="flex items-center gap-1 sm:gap-2">
                {[
                  { id: 'overview', label: 'Overview', Icon: LayoutDashboard },
                  { id: 'prompts', label: 'Prompts', Icon: MessageSquare },
                  { id: 'sources', label: 'Sources', Icon: Link2 },
                  { id: 'models', label: 'Models', Icon: Cpu },
                  { id: 'competitors', label: 'Competitors', Icon: GitCompare }
                ].map((tab) => {
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as TabType)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        isActive
                          ? isLight
                            ? 'bg-slate-900 text-white shadow-xs'
                            : 'bg-white text-black shadow-xs'
                          : isLight
                            ? 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                            : 'text-white/60 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <tab.Icon className="size-3.5" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="hidden md:flex items-center gap-2 text-[11px] text-slate-400">
                <ShieldCheck className="size-3.5 text-brand" />
                <span>6 Frontier AI Engines Monitored</span>
              </div>
            </div>

            {/* Primary KPI Strip (Clickable Drilldowns) */}
            <div className={`px-6 py-5 border-b grid grid-cols-2 md:grid-cols-4 gap-4 transition-colors ${
              isLight ? 'bg-white border-slate-200/90' : 'bg-[#080a0d] border-white/[0.06]'
            }`}>
              
              {/* KPI 1: AI Visibility (Level 1 Dominant Anchor) */}
              <div
                onClick={() => setActiveDrilldown(activeDrilldown === 'visibility' ? null : 'visibility')}
                className={`p-3 rounded-2xl border transition-all cursor-pointer group ${
                  activeDrilldown === 'visibility'
                    ? isLight ? 'border-brand bg-brand/5 shadow-xs' : 'border-brand bg-brand/10 shadow-xs'
                    : isLight ? 'border-slate-200/80 hover:border-slate-300 bg-slate-50/50' : 'border-white/[0.06] hover:border-white/15 bg-[#0a0d13]'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] font-mono uppercase text-slate-400 font-bold">
                  <span>AI VISIBILITY</span>
                  <Info className="size-3 text-brand opacity-60 group-hover:opacity-100" />
                </div>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="font-mono text-2xl sm:text-3xl font-bold tracking-tight text-brand">
                    68.4%
                  </span>
                  <span className="font-mono text-xs text-cyan-400 font-semibold">+8.7 pts · 30d</span>
                </div>
              </div>

              {/* KPI 2: Share of Voice */}
              <div
                onClick={() => setActiveDrilldown(activeDrilldown === 'sov' ? null : 'sov')}
                className={`p-3 rounded-2xl border transition-all cursor-pointer group ${
                  activeDrilldown === 'sov'
                    ? isLight ? 'border-brand bg-brand/5 shadow-xs' : 'border-brand bg-brand/10 shadow-xs'
                    : isLight ? 'border-slate-200/80 hover:border-slate-300 bg-slate-50/50' : 'border-white/[0.06] hover:border-white/15 bg-[#0a0d13]'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] font-mono uppercase text-slate-400 font-bold">
                  <span>SHARE OF VOICE</span>
                  <Info className="size-3 text-brand opacity-60 group-hover:opacity-100" />
                </div>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className={`font-mono text-xl sm:text-2xl font-bold ${isLight ? 'text-slate-800' : 'text-white/90'}`}>
                    24.1%
                  </span>
                  <span className="font-mono text-xs text-amber-500 font-semibold">−2.7 pts Gap</span>
                </div>
              </div>

              {/* KPI 3: Average Position */}
              <div
                onClick={() => setActiveDrilldown(activeDrilldown === 'position' ? null : 'position')}
                className={`p-3 rounded-2xl border transition-all cursor-pointer group ${
                  activeDrilldown === 'position'
                    ? isLight ? 'border-brand bg-brand/5 shadow-xs' : 'border-brand bg-brand/10 shadow-xs'
                    : isLight ? 'border-slate-200/80 hover:border-slate-300 bg-slate-50/50' : 'border-white/[0.06] hover:border-white/15 bg-[#0a0d13]'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] font-mono uppercase text-slate-400 font-bold">
                  <span>AVG POSITION</span>
                  <Info className="size-3 text-brand opacity-60 group-hover:opacity-100" />
                </div>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className={`font-mono text-xl sm:text-2xl font-bold ${isLight ? 'text-slate-800' : 'text-white/90'}`}>
                    #1.4
                  </span>
                  <span className="font-mono text-xs text-emerald-500 font-semibold">Top Quartile</span>
                </div>
              </div>

              {/* KPI 4: Tracked Citations */}
              <div
                onClick={() => setActiveDrilldown(activeDrilldown === 'citations' ? null : 'citations')}
                className={`p-3 rounded-2xl border transition-all cursor-pointer group ${
                  activeDrilldown === 'citations'
                    ? isLight ? 'border-brand bg-brand/5 shadow-xs' : 'border-brand bg-brand/10 shadow-xs'
                    : isLight ? 'border-slate-200/80 hover:border-slate-300 bg-slate-50/50' : 'border-white/[0.06] hover:border-white/15 bg-[#0a0d13]'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] font-mono uppercase text-slate-400 font-bold">
                  <span>CITATIONS</span>
                  <Info className="size-3 text-brand opacity-60 group-hover:opacity-100" />
                </div>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className={`font-mono text-xl sm:text-2xl font-bold ${isLight ? 'text-slate-800' : 'text-white/90'}`}>
                    5,033
                  </span>
                  <span className="font-mono text-xs text-slate-400">148 domains</span>
                </div>
              </div>

            </div>

            {/* Drilldown Contextual Drawer */}
            <AnimatePresence>
              {activeDrilldown && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className={`px-6 py-4 border-b flex items-start justify-between gap-4 transition-colors ${
                    isLight ? 'bg-slate-900 text-white' : 'bg-[#0f141c] text-white border-white/15'
                  }`}
                >
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center gap-2 font-mono text-[10px] text-cyan-400 uppercase font-bold">
                      <span>DRILLDOWN TELEMETRY</span>
                      <span>•</span>
                      <span>
                        {activeDrilldown === 'visibility' && 'AI Visibility 30d Trajectory & Synthesis Weight'}
                        {activeDrilldown === 'sov' && 'Competitive Share of Voice vs Atlas AI (26.8%)'}
                        {activeDrilldown === 'position' && 'Average Ranking in Multi-Model Consensus Answers'}
                        {activeDrilldown === 'citations' && 'Source Citation Taxonomy across 5,033 Verified References'}
                      </span>
                    </div>
                    <p className="text-white/80 leading-relaxed font-sans text-xs">
                      {activeDrilldown === 'visibility' && 'Dyvin continuously benchmarks prompt inclusion rates across 540 high-intent enterprise evaluation prompts with sub-second answer verification.'}
                      {activeDrilldown === 'sov' && 'Your brand commands 24.1% Share of Voice across 12 category competitors. Closing 4 missing review grid citations closes the −2.7 pts gap.'}
                      {activeDrilldown === 'position' && 'Dyvin maintains an average #1.4 recommendation ranking across ChatGPT 4o, Claude 3.5 Sonnet, and Perplexity Pro.'}
                      {activeDrilldown === 'citations' && '5,033 citations analyzed across technical docs, software review platforms, and analyst reports with a Dyvin Authority Index average of 93/100.'}
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveDrilldown(null)}
                    className="p-1 rounded text-white/50 hover:text-white cursor-pointer"
                    aria-label="Close drilldown"
                  >
                    <X className="size-4" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Main Analytical Grid */}
            <div className="p-6 sm:p-7 space-y-6">
              
              {/* Zone 1: 30-Day Visibility Trajectory Graph */}
              <div className={`p-5 rounded-2xl border ${
                isLight ? 'bg-slate-50/50 border-slate-200' : 'bg-[#0a0d13] border-white/[0.06]'
              }`}>
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-100 dark:border-white/[0.05] text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="size-3.5 text-cyan-400" />
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                      30-DAY AI VISIBILITY TRAJECTORY
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-[11px]">
                    <span className="text-slate-400">Baseline: 59.7%</span>
                    <span>→</span>
                    <span className="text-brand font-bold">Current: 68.4% (+8.7 pts)</span>
                  </div>
                </div>

                {/* SVG Line Chart */}
                <div className="h-32 w-full relative flex items-end">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 700 120" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    {/* Area Fill */}
                    <path
                      d="M 0,110 L 0,85 L 116,78 L 233,68 L 350,58 L 466,42 L 583,28 L 700,12 L 700,110 Z"
                      fill="url(#areaGradient)"
                    />
                    {/* Telemetry Line */}
                    <path
                      d="M 0,85 L 116,78 L 233,68 L 350,58 L 466,42 L 583,28 L 700,12"
                      fill="none"
                      stroke="#0ea5e9"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                    {/* Data Points */}
                    {trajectoryPoints.map((pt, idx) => {
                      const x = (idx / (trajectoryPoints.length - 1)) * 700;
                      const y = 85 - (idx * 12.2);
                      return (
                        <circle
                          key={pt.day}
                          cx={x}
                          cy={y}
                          r="4"
                          className="fill-cyan-400 stroke-black dark:stroke-white/20 stroke-2 cursor-pointer hover:r-6 transition-all"
                          onMouseEnter={() => setHoveredDay({ day: pt.day, score: pt.score })}
                          onMouseLeave={() => setHoveredDay(null)}
                        />
                      );
                    })}
                  </svg>

                  {hoveredDay && (
                    <div className="absolute top-2 right-4 px-2.5 py-1 rounded border text-[11px] font-mono bg-slate-900 text-white shadow-lg">
                      {hoveredDay.day}: <span className="font-bold text-cyan-400">{hoveredDay.score}% Visibility</span>
                    </div>
                  )}
                </div>

                <div className="flex justify-between text-[10px] font-mono text-slate-400 pt-2 border-t border-slate-100 dark:border-white/[0.05] mt-2">
                  <span>Day 1 (59.7%)</span>
                  <span>Day 10 (62.1%)</span>
                  <span>Day 20 (65.2%)</span>
                  <span className="text-brand font-bold">Day 30 (68.4%)</span>
                </div>
              </div>

              {/* Zone 2: Two-Column Analytical Deep Dive */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
                
                {/* Left 7 Cols: Prompt Intelligence & Decision Engine */}
                <div className="lg:col-span-7 space-y-4">
                  
                  {/* Top Buyer Prompts Feed */}
                  <div className={`p-5 rounded-2xl border ${
                    isLight ? 'bg-slate-50/50 border-slate-200' : 'bg-[#0a0d13] border-white/[0.06]'
                  }`}>
                    <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-100 dark:border-white/[0.05] text-[10px] font-mono uppercase font-bold text-slate-400">
                      <span>TOP BUYER EVALUATION PROMPTS</span>
                      <span>RANK & TREND</span>
                    </div>

                    <div className="space-y-2.5 font-mono text-xs">
                      {promptList.map((p, idx) => (
                        <div
                          key={idx}
                          onClick={() => setSelectedPromptIndex(idx)}
                          className={`p-3 rounded-xl border transition-all cursor-pointer ${
                            selectedPromptIndex === idx
                              ? isLight ? 'bg-white border-slate-300 shadow-xs' : 'bg-white/10 border-white/20'
                              : isLight ? 'bg-white/60 border-slate-200/60 hover:bg-white' : 'bg-white/[0.02] border-white/[0.04] hover:bg-white/[0.05]'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="font-sans font-medium text-xs text-slate-800 dark:text-white/90">
                              "{p.prompt}"
                            </span>
                            <span className="font-bold text-brand shrink-0">{p.position}</span>
                          </div>
                          <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2 pt-1.5 border-t border-slate-100 dark:border-white/[0.05]">
                            <span>Vis: <strong className="text-slate-700 dark:text-white">{p.visibility}</strong></span>
                            <span>Sentiment: <strong className="text-emerald-500">{p.sentiment}</strong></span>
                            <span className="text-cyan-400">{p.trend}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Decision Engine: Next Best Action */}
                  <div className={`p-4 sm:p-5 rounded-2xl border flex flex-col justify-between gap-3 ${
                    isLight
                      ? 'bg-blue-50/70 border-blue-200 text-blue-950 shadow-xs'
                      : 'bg-blue-950/20 border-blue-500/25 text-blue-200 shadow-xs'
                  }`}>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Sparkles className="size-4 text-blue-500 shrink-0" />
                        <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-blue-500">
                          DECISION ENGINE: NEXT STRATEGIC MOVE
                        </span>
                      </div>
                      <span className="px-2 py-0.5 rounded border text-[9px] font-mono font-bold uppercase bg-blue-500/10 border-blue-500/20 text-blue-400">
                        IMPACT: HIGH
                      </span>
                    </div>

                    <p className="text-xs font-sans font-medium leading-relaxed">
                      "Close 4 high-value source gaps across enterprise review and analyst grids to overtake Atlas AI in head-to-head evaluation queries."
                    </p>

                    <button
                      onClick={onOpenAuth}
                      className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-blue-500 hover:underline cursor-pointer pt-1"
                    >
                      <span>View prioritized action plan →</span>
                    </button>
                  </div>

                </div>

                {/* Right 5 Cols: Source Authority & Model Telemetry Matrix */}
                <div className="lg:col-span-5 space-y-4">
                  
                  {/* Source Authority Index */}
                  <div className={`p-5 rounded-2xl border ${
                    isLight ? 'bg-slate-50/50 border-slate-200' : 'bg-[#0a0d13] border-white/[0.06]'
                  }`}>
                    <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-slate-100 dark:border-white/[0.05] text-[10px] font-mono uppercase font-bold text-slate-400">
                      <span>SOURCE AUTHORITY INDEX</span>
                      <span>AUTHORITY</span>
                    </div>

                    <div className="space-y-2 font-mono text-xs">
                      {sourceList.map((s) => (
                        <div key={s.domain} className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-white/[0.03] last:border-0">
                          <div className="flex items-center gap-2">
                            <Link2 className="size-3 text-slate-400" />
                            <span className={isLight ? 'text-slate-800 font-medium' : 'text-white'}>{s.domain}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`text-[9px] px-1.5 py-0.2 rounded border ${s.statusStyle}`}>
                              {s.status}
                            </span>
                            <span className="font-bold text-slate-700 dark:text-white/80">{s.auth}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 6 Frontier Models Telemetry */}
                  <div className={`p-5 rounded-2xl border ${
                    isLight ? 'bg-slate-50/50 border-slate-200' : 'bg-[#0a0d13] border-white/[0.06]'
                  }`}>
                    <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-slate-100 dark:border-white/[0.05] text-[10px] font-mono uppercase font-bold text-slate-400">
                      <span>FRONTIER MODEL TELEMETRY</span>
                      <span>VISIBILITY</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 font-mono text-xs">
                      {models.map((m) => (
                        <div
                          key={m.name}
                          className={`p-2.5 rounded-xl border flex items-center justify-between ${
                            isLight ? 'bg-white border-slate-200/80' : 'bg-black/40 border-white/[0.06]'
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <m.Logo className="size-3.5 shrink-0" />
                            <span className="text-[11px] font-sans font-medium truncate">{m.name}</span>
                          </div>
                          <span className="font-bold text-[11px] text-brand shrink-0">{m.visibility}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Competitive Position Summary */}
                  <div className={`p-4 rounded-2xl border font-mono text-xs ${
                    isLight ? 'bg-white border-slate-200' : 'bg-[#0a0d13] border-white/[0.06]'
                  }`}>
                    <div className="flex items-center justify-between text-[10px] uppercase font-bold text-slate-400 mb-1.5">
                      <span>COMPETITIVE POSITION</span>
                      <span className="text-amber-500 font-bold">−2.7 pts Gap</span>
                    </div>
                    <div className="flex items-center justify-between py-1">
                      <span className="font-sans font-semibold text-brand">Dyvin AI (Your Brand)</span>
                      <span className="font-bold">24.1% Share</span>
                    </div>
                    <div className="flex items-center justify-between py-1 text-slate-400">
                      <span className="font-sans">Atlas AI (Market Leader)</span>
                      <span className="font-bold">26.8% Share</span>
                    </div>
                  </div>

                </div>

              </div>

            </div>

            {/* Bottom Command Center Action Bar */}
            <div className={`px-6 py-4 border-t flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono ${
              isLight ? 'bg-slate-100/70 border-slate-200 text-slate-600' : 'bg-[#0c0f14] border-white/[0.06] text-white/70'
            }`}>
              <span>One workspace connecting prompts, models, citations, competitors, and decision actions.</span>
              <button
                onClick={onOpenAuth}
                className={`font-semibold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs transition-all shrink-0 ${
                  isLight
                    ? 'bg-slate-900 text-white hover:bg-slate-800'
                    : 'bg-white text-black hover:bg-white/90'
                }`}
              >
                <span>Launch full workspace</span>
                <ArrowRight className="size-3.5" />
              </button>
            </div>

          </motion.div>
        </div>

      </div>
    </section>
  );
};
