import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SectionEyebrow } from './primitives';
import {
  Link2,
  Users,
  ArrowRight,
  ArrowUpRight,
  Sparkles,
  HelpCircle,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
  AlertTriangle,
  Layers,
  X,
  Target,
  Sliders,
  Info
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface FeaturesSectionProps {
  onOpenAuth: () => void;
}

export const FeaturesSection: React.FC<FeaturesSectionProps> = ({ onOpenAuth }) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const [activeInspector, setActiveInspector] = useState<{ type: 'source' | 'competitor' | 'action'; id: string } | null>(null);
  const [showAuthorityTooltip, setShowAuthorityTooltip] = useState(false);

  // Close modal on Escape key for full accessibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && activeInspector) {
        setActiveInspector(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeInspector]);

  const sources = [
    {
      domain: 'gartner.com',
      auth: 95,
      impact: '261 enterprise queries',
      status: 'Citation Gap',
      statusStyle: 'text-red-500 bg-red-500/10 border-red-500/20',
      category: 'Research / Analyst Reports',
      detail: 'Frequently cited in enterprise buyer comparison answers, but currently uncited for your brand.',
      action: 'Submit verified capability benchmarks to analyst review grids.'
    },
    {
      domain: 'techcrunch.com',
      auth: 94,
      impact: '12.4% of tracked mentions',
      status: 'Active Citation',
      statusStyle: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
      category: 'Industry Publication',
      detail: 'Regularly cited for real-time latency and technical product architecture.',
      action: 'Maintain automated changelog syndication to preserve tier-1 press authority.'
    },
    {
      domain: 'g2.com',
      auth: 89,
      impact: '42 buyer answers',
      status: 'Active Citation',
      statusStyle: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
      category: 'Software Review Platform',
      detail: 'Key evaluation source for commercial buyer shortlists in conversational search.',
      action: 'Expand customer verified review presence on comparison category grids.'
    },
    {
      domain: 'reddit.com',
      auth: 74,
      impact: '+11.8% in AI synthesis',
      status: 'Rising Influence',
      statusStyle: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
      category: 'Community Discussions',
      detail: 'Developer community threads synthesized by Perplexity and Grok for real-world feedback.',
      action: 'Address latency and API objection narratives in technical forums.'
    }
  ];

  const attackSurface = [
    {
      id: 'citations',
      label: 'Citation Advantage',
      gap: '−8 sources',
      severity: 'HIGH IMPACT',
      severityStyle: 'text-red-500 bg-red-500/10 border-red-500/20',
      cause: 'More high-authority citations in enterprise buyer queries.',
      action: 'Build authority coverage in enterprise review publications and analyst briefs.'
    },
    {
      id: 'prompts',
      label: 'Prompt Advantage',
      gap: '−14 queries',
      severity: 'MEDIUM IMPACT',
      severityStyle: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
      cause: 'Stronger presence across head-to-head comparison prompts.',
      action: 'Target comparison queries with side-by-side technical evaluation assets.'
    },
    {
      id: 'recommendations',
      label: 'Recommendation Advantage',
      gap: '−2.7 pts',
      severity: 'HIGH IMPACT',
      severityStyle: 'text-red-500 bg-red-500/10 border-red-500/20',
      cause: 'Higher synthesis frequency across multi-model buyer recommendations.',
      action: 'Close citation gaps on high-influence software review and analyst portals.'
    }
  ];

  const opportunities = [
    {
      id: '01',
      title: 'Close Citation Gap',
      impact: 'HIGH IMPACT',
      impactStyle: 'text-red-500 bg-red-500/10 border-red-500/20',
      why: 'Gartner appears in 261 tracked enterprise answers but rarely references your brand.',
      action: 'Increase presence across high-authority enterprise review and analyst sources (G2 & Gartner).'
    },
    {
      id: '02',
      title: 'Strengthen Comparison-Query Coverage',
      impact: 'HIGH IMPACT',
      impactStyle: 'text-red-500 bg-red-500/10 border-red-500/20',
      why: 'Atlas AI commands 14 head-to-head comparison evaluation queries across ChatGPT and Claude.',
      action: 'Publish side-by-side technical comparison assets and transparent feature matrices.'
    },
    {
      id: '03',
      title: 'Increase Authority in Category Publications',
      impact: 'MEDIUM IMPACT',
      impactStyle: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
      why: '3 editorial publications drive 48% of total competitor authority citations in zero-click answers.',
      action: 'Target tier-1 technology press with verified enterprise case studies and customer metrics.'
    },
    {
      id: '04',
      title: 'Improve Recommendation Sentiment',
      impact: 'MEDIUM IMPACT',
      impactStyle: 'text-cyan-500 bg-cyan-500/10 border-cyan-500/20',
      why: 'Mixed sentiment detected across developer community threads regarding older API documentation.',
      action: 'Clarify developer documentation and publish verified latency performance benchmarks.'
    }
  ];

  return (
    <section id="features" className={`py-14 md:py-20 border-b select-none transition-colors relative z-10 ${
      isLight ? 'bg-white border-slate-200/80 text-slate-900' : 'bg-[#000000] border-white/[0.08] text-white'
    }`}>
      <div className="max-w-6xl mx-auto px-6 space-y-16">
        
        {/* Section Master Header */}
        <div className="max-w-3xl">
          <SectionEyebrow label="CITATION & COMPETITIVE INTELLIGENCE" tag="From Evidence to Action" />

          <h2 className={`mt-4 text-3xl sm:text-4xl md:text-5xl font-semibold font-display tracking-tight leading-[1.08] ${
            isLight ? 'text-slate-900' : 'text-white'
          }`}>
            Know why AI chooses <br className="hidden sm:inline" />
            <span className={isLight ? 'text-slate-500' : 'text-white/60'}>
              your competitors.
            </span>
          </h2>

          <p className={`mt-3 text-base md:text-lg leading-[1.65] font-normal ${
            isLight ? 'text-slate-600' : 'text-white/70'
          }`}>
            See the sources, prompts, and recommendation patterns influencing AI — then turn the gaps into prioritized actions.
          </p>
        </div>

        {/* ========================================================================= */}
        {/* LAYER 01: CITATION INTELLIGENCE (Source Authority Index) */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left 5 Cols: Narrative & Source Taxonomies */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-2 font-mono text-[10px] uppercase font-bold text-brand tracking-wider">
              <Link2 className="size-3.5" />
              <span>01 — CITATION INTELLIGENCE</span>
            </div>

            <h3 className={`text-2xl sm:text-3xl font-bold font-display tracking-tight ${
              isLight ? 'text-slate-900' : 'text-white'
            }`}>
              Know what AI is citing.
            </h3>

            <p className={`text-xs sm:text-sm leading-relaxed font-sans ${isLight ? 'text-slate-600' : 'text-white/70'}`}>
              AI recommendations are influenced by the sources surrounding your category. Dyvin maps those sources so you can see where authority is helping — and where citation gaps are costing visibility.
            </p>

            <ul className={`space-y-2 pt-2 text-xs font-sans ${isLight ? 'text-slate-700' : 'text-white/80'}`}>
              <li className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-blue-500 shrink-0" />
                <span><strong>Industry publications:</strong> TechCrunch, VentureBeat & editorial press</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-cyan-400 shrink-0" />
                <span><strong>Technical documentation:</strong> API specs, GitHub & release changelogs</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-emerald-400 shrink-0" />
                <span><strong>Review platforms:</strong> G2, Capterra & TrustRadius buyer grids</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-indigo-400 shrink-0" />
                <span><strong>Research reports:</strong> Gartner, Forrester & analyst guides</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-purple-400 shrink-0" />
                <span><strong>Community sources:</strong> Reddit discussions & developer forums</span>
              </li>
            </ul>
          </div>

          {/* Right 7 Cols: Source Authority Index Surface */}
          <div className="lg:col-span-7">
            <div className={`rounded-3xl border p-6 sm:p-7 shadow-2xl transition-all relative ${
              isLight
                ? 'bg-[#FBFBFC] border-slate-200 shadow-slate-200/50'
                : 'bg-[#080a0d] border-white/[0.09] shadow-black/80'
            }`}>
              {/* Header Bar */}
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100 dark:border-white/[0.06]">
                <div className="flex items-center gap-2">
                  <span className={`font-semibold text-xs font-mono uppercase tracking-wider ${isLight ? 'text-slate-900' : 'text-white'}`}>
                    Source Authority Index
                  </span>
                  <button
                    onClick={() => setShowAuthorityTooltip(!showAuthorityTooltip)}
                    onMouseEnter={() => setShowAuthorityTooltip(true)}
                    onMouseLeave={() => setShowAuthorityTooltip(false)}
                    className="text-slate-400 hover:text-slate-200 cursor-pointer"
                    aria-label="Authority Index methodology"
                  >
                    <HelpCircle className="size-3" />
                  </button>
                </div>
                <span className={`text-[10px] font-mono uppercase font-bold tracking-wider px-2 py-0.5 rounded border ${
                  isLight ? 'bg-slate-100 border-slate-200 text-slate-600' : 'bg-white/5 border-white/10 text-white/40'
                }`}>
                  SAMPLE BENCHMARK
                </span>
              </div>

              {/* Methodology Tooltip */}
              <AnimatePresence>
                {showAuthorityTooltip && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    className={`p-3 rounded-xl border text-[11px] font-mono leading-relaxed mb-3 ${
                      isLight ? 'bg-slate-900 text-white border-slate-800' : 'bg-[#0f141c] text-white border-white/20'
                    }`}
                  >
                    <strong>Dyvin Source Authority Index:</strong> Normalized measurement (0–100) weighting source relevance, citation frequency, and category influence across generative engines.
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Source Rows */}
              <div className="space-y-2.5 font-mono text-xs">
                {sources.map((s) => (
                  <div
                    key={s.domain}
                    onClick={() => setActiveInspector({ type: 'source', id: s.domain })}
                    className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 transition-all cursor-pointer ${
                      isLight
                        ? 'bg-white border-slate-200 hover:border-slate-300'
                        : 'bg-[#0a0d13] border-white/[0.06] hover:border-white/15'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Link2 className="size-3.5 text-slate-400" />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>{s.domain}</span>
                          <span className={`text-[9px] px-2 py-0.2 rounded border font-semibold ${s.statusStyle}`}>
                            {s.status}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400 block mt-0.5">{s.impact}</span>
                      </div>
                    </div>

                    <div className="text-right shrink-0 flex items-center gap-3">
                      <div>
                        <span className="text-[9px] text-slate-400 uppercase block">Authority</span>
                        <span className={`font-bold text-sm tnum ${isLight ? 'text-slate-900' : 'text-white'}`}>{s.auth}</span>
                      </div>
                      <ArrowUpRight className="size-3 text-slate-400" />
                    </div>
                  </div>
                ))}
              </div>

              {/* WHY THIS MATTERS Bridge */}
              <div className={`p-4 rounded-2xl border space-y-2 mt-4 ${
                isLight
                  ? 'bg-blue-50/70 border-blue-200 text-blue-950 shadow-xs'
                  : 'bg-blue-950/20 border-blue-500/25 text-blue-200 shadow-xs'
              }`}>
                <div className="flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-wider text-blue-500">
                  <Sparkles className="size-3" />
                  <span>WHY THIS MATTERS</span>
                </div>
                <p className="text-xs leading-relaxed font-sans">
                  Your competitors receive citations from <strong>4 high-authority sources</strong> that rarely reference your brand. That citation imbalance directly influences how generative engines represent your category.
                </p>
                <button
                  onClick={onOpenAuth}
                  className="font-mono text-xs font-bold text-blue-500 hover:underline flex items-center gap-1 cursor-pointer pt-1"
                >
                  <span>Close 4 high-value source gaps →</span>
                </button>
              </div>

            </div>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* LAYER 02: COMPETITIVE INTELLIGENCE & ATTACK SURFACE */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left 7 Cols: Competitive Attack Surface Instrument */}
          <div className="lg:col-span-7 order-2 lg:order-1">
            <div className={`rounded-3xl border p-6 sm:p-7 shadow-2xl transition-all relative ${
              isLight
                ? 'bg-[#FBFBFC] border-slate-200 shadow-slate-200/50'
                : 'bg-[#080a0d] border-white/[0.09] shadow-black/80'
            }`}>
              
              {/* Header Bar */}
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100 dark:border-white/[0.06]">
                <div className="flex items-center gap-2 font-mono text-xs font-semibold">
                  <Users className="size-3.5 text-brand" />
                  <span className="uppercase tracking-wider">Head-to-Head Recommendation Share</span>
                </div>
                <span className="font-mono text-[10px] text-amber-500 font-bold bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded">
                  −2.7 pts Gap
                </span>
              </div>

              {/* Head-to-Head Visual Bar Representation */}
              <div className="space-y-3 font-mono text-xs mb-5">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-bold text-brand">Dyvin AI (Your Brand)</span>
                    <span className="font-bold">24.1% Share</span>
                  </div>
                  <div className={`w-full h-2 rounded-full overflow-hidden ${isLight ? 'bg-slate-100' : 'bg-white/10'}`}>
                    <div className="h-full bg-brand rounded-full" style={{ width: '24.1%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400">Atlas AI (Market Leader)</span>
                    <span className="font-bold text-slate-700 dark:text-white">26.8% Share</span>
                  </div>
                  <div className={`w-full h-2 rounded-full overflow-hidden ${isLight ? 'bg-slate-100' : 'bg-white/10'}`}>
                    <div className="h-full bg-slate-400 dark:bg-white/40 rounded-full" style={{ width: '26.8%' }} />
                  </div>
                </div>
              </div>

              {/* 3-Pillar Competitive Attack Surface Breakdown */}
              <div className="space-y-2.5">
                <span className="font-mono text-[10px] uppercase font-bold text-slate-400 tracking-wider block px-1">
                  COMPETITOR ATTACK SURFACE (3 ROOT CAUSES)
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono">
                  {attackSurface.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => setActiveInspector({ type: 'competitor', id: item.id })}
                      className={`p-3.5 rounded-2xl border flex flex-col justify-between transition-all cursor-pointer ${
                        isLight
                          ? 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
                          : 'bg-[#0a0d13] border-white/[0.06] hover:border-white/15'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 dark:border-white/[0.05]">
                          <span className="text-[10px] text-slate-400 font-bold">{item.label}</span>
                          <span className={`text-[9px] px-1.5 py-0.2 rounded border font-bold ${item.severityStyle}`}>
                            {item.severity.split(' ')[0]}
                          </span>
                        </div>
                        <div className="font-bold text-base text-brand mt-0.5">{item.gap}</div>
                        <p className={`text-[11px] font-sans mt-1.5 leading-tight ${isLight ? 'text-slate-600' : 'text-white/60'}`}>
                          {item.cause}
                        </p>
                      </div>

                      <div className="mt-3 pt-2 border-t border-slate-100 dark:border-white/[0.05] text-[10px] text-blue-500 font-bold flex items-center justify-between">
                        <span>Action</span>
                        <ArrowRight className="size-2.5" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* Right 5 Cols: Narrative */}
          <div className="lg:col-span-5 space-y-4 order-1 lg:order-2">
            <div className="flex items-center gap-2 font-mono text-[10px] uppercase font-bold text-brand tracking-wider">
              <Users className="size-3.5" />
              <span>02 — COMPETITIVE INTELLIGENCE</span>
            </div>

            <h3 className={`text-2xl sm:text-3xl font-bold font-display tracking-tight ${
              isLight ? 'text-slate-900' : 'text-white'
            }`}>
              See who AI puts beside you.
            </h3>

            <p className={`text-xs sm:text-sm leading-relaxed font-sans ${isLight ? 'text-slate-600' : 'text-white/70'}`}>
              Compare recommendation share, source coverage, and competitive presence to understand where another brand is winning.
            </p>

            <div className="pt-2">
              <button
                onClick={onOpenAuth}
                className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-brand hover:underline cursor-pointer"
              >
                <span>Analyze competitor attack surface →</span>
              </button>
            </div>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* LAYER 03: DECISION INTELLIGENCE (Prioritized Action Engine) */}
        {/* ========================================================================= */}
        <div className={`rounded-3xl border p-6 sm:p-8 shadow-2xl transition-all relative overflow-hidden ${
          isLight
            ? 'bg-[#FBFBFC] border-slate-200 shadow-slate-200/50 text-slate-900'
            : 'bg-[#080a0d] border-white/[0.09] shadow-black/80 text-white'
        }`}>
          
          <div className="max-w-3xl mb-6">
            <div className="flex items-center gap-2 font-mono text-[10px] uppercase font-bold text-brand tracking-wider mb-1">
              <Target className="size-3.5" />
              <span>03 — DECISION INTELLIGENCE</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-bold font-display tracking-tight">
              What should you do next?
            </h3>

            <p className={`mt-2 text-xs sm:text-sm leading-relaxed ${isLight ? 'text-slate-600' : 'text-white/70'}`}>
              Turn visibility and competitive gaps into prioritized strategic moves for your team.
            </p>
          </div>

          {/* 4 Prioritized Action Opportunities Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {opportunities.map((opp) => (
              <div
                key={opp.id}
                onClick={() => setActiveInspector({ type: 'action', id: opp.id })}
                className={`p-5 rounded-2xl border flex flex-col justify-between transition-all cursor-pointer ${
                  isLight
                    ? 'bg-white border-slate-200/90 hover:border-slate-300 shadow-xs'
                    : 'bg-[#0a0d13] border-white/[0.06] hover:border-white/15'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-slate-100 dark:border-white/[0.05] text-xs font-mono">
                    <span className="font-bold text-slate-400">Opportunity {opp.id}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded border font-bold ${opp.impactStyle}`}>
                      {opp.impact}
                    </span>
                  </div>

                  <h4 className="font-display font-bold text-sm text-slate-900 dark:text-white">
                    {opp.title}
                  </h4>

                  <p className={`text-xs mt-1.5 leading-relaxed font-sans ${isLight ? 'text-slate-600' : 'text-white/60'}`}>
                    {opp.why}
                  </p>

                  <div className={`mt-3 p-3 rounded-xl border text-xs ${
                    isLight ? 'bg-slate-50 border-slate-200 text-slate-800' : 'bg-white/[0.02] border-white/[0.04] text-white/80'
                  }`}>
                    <span className="font-bold text-[10px] uppercase font-mono block text-brand mb-0.5">Recommended Move</span>
                    <span className="text-[11px] font-sans">{opp.action}</span>
                  </div>
                </div>

                <div className="mt-4 pt-2 border-t border-slate-100 dark:border-white/[0.05] flex items-center justify-between text-[11px] font-mono">
                  <span className="text-slate-400">Decision Intelligence</span>
                  <span className="text-brand font-bold flex items-center gap-1">
                    <span>Inspect</span>
                    <ArrowRight className="size-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Dominant Bottom Recommendation Banner */}
          <div className={`mt-6 p-5 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-4 ${
            isLight
              ? 'bg-blue-50/70 border-blue-200 text-blue-950 shadow-xs'
              : 'bg-blue-950/20 border-blue-500/25 text-blue-200 shadow-xs'
          }`}>
            <div className="flex items-center gap-3">
              <div className="size-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500 shrink-0">
                <Sparkles className="size-4.5" />
              </div>
              <div>
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-blue-500 block">
                  NEXT STRATEGIC MOVE
                </span>
                <p className="text-xs sm:text-sm font-sans font-medium leading-relaxed mt-0.5">
                  Close 4 high-value source gaps across enterprise review and analyst grids to overtake Atlas AI.
                </p>
                <span className="font-mono text-[11px] text-blue-500 font-bold block mt-1">
                  Modeled Opportunity: +4–8 pts potential visibility
                </span>
              </div>
            </div>

            <button
              onClick={onOpenAuth}
              className="px-5 py-2.5 rounded-xl font-mono text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 shadow-xs shrink-0 cursor-pointer transition-all"
            >
              <span>View prioritized action plan →</span>
            </button>
          </div>

        </div>

      </div>

      {/* Accessible Interactive Diagnostic Inspector Modal */}
      <AnimatePresence>
        {activeInspector && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className={`w-full max-w-lg rounded-3xl border p-6 sm:p-7 shadow-2xl transition-colors ${
                isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-[#0D1017] border-white/15 text-white'
              }`}
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-white/10 mb-5">
                <div className="flex items-center gap-2 font-mono text-xs">
                  <span className="text-brand font-bold uppercase tracking-wider">
                    {activeInspector.type.toUpperCase()} INSPECTOR
                  </span>
                  <span className="text-slate-400">•</span>
                  <span className="text-slate-400">SAMPLE BENCHMARK</span>
                </div>
                <button
                  onClick={() => setActiveInspector(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/10 transition-colors cursor-pointer"
                  aria-label="Close inspector"
                >
                  <X className="size-4" />
                </button>
              </div>

              {activeInspector.type === 'source' && (
                <div className="space-y-4 text-xs">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold font-mono">{activeInspector.id}</h3>
                    <span className="font-mono text-xs px-2 py-0.5 rounded border text-red-500 bg-red-500/10 border-red-500/20 font-bold">
                      Authority 95/100
                    </span>
                  </div>
                  <p className={`font-sans leading-relaxed ${isLight ? 'text-slate-600' : 'text-white/70'}`}>
                    High-authority enterprise review and analyst portal. Tracked in 261 buyer comparison answers across frontier generative engines.
                  </p>
                  <div className="p-3 rounded-xl border font-mono text-[11px] bg-blue-500/5 border-blue-500/20 text-blue-500 font-medium">
                    <strong>Recommended Move:</strong> Strengthen category presence through relevant analyst briefing syndication.
                  </div>
                </div>
              )}

              {activeInspector.type === 'competitor' && (
                <div className="space-y-4 text-xs">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold font-display">Atlas AI Competitive Gap</h3>
                    <span className="font-mono text-xs text-amber-500 font-bold bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded">
                      −2.7 pts Gap
                    </span>
                  </div>
                  <p className={`font-sans leading-relaxed ${isLight ? 'text-slate-600' : 'text-white/70'}`}>
                    Atlas AI leads with 26.8% Recommendation Share (vs your 24.1%) driven by 4 additional review listings on G2 and Gartner.
                  </p>
                  <div className="p-3 rounded-xl border font-mono text-[11px] bg-blue-500/5 border-blue-500/20 text-blue-500 font-medium">
                    <strong>Recommended Counter-Move:</strong> Close high-value source gaps across analyst and review publications.
                  </div>
                </div>
              )}

              {activeInspector.type === 'action' && (
                <div className="space-y-4 text-xs">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold font-display">Decision Engine Action</h3>
                    <span className="font-mono text-xs text-cyan-400 font-bold bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded">
                      MODELED ESTIMATE
                    </span>
                  </div>
                  <p className={`font-sans leading-relaxed ${isLight ? 'text-slate-600' : 'text-white/70'}`}>
                    Closing prioritized citation deficits converts underrepresented comparison prompts into active recommendation share.
                  </p>
                  <div className="p-3 rounded-xl border font-mono text-[11px] bg-emerald-500/5 border-emerald-500/20 text-emerald-500 font-medium">
                    <strong>Modeled Opportunity:</strong> +4–8 pts potential visibility gain following source coverage updates.
                  </div>
                </div>
              )}

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-white/10 flex items-center justify-between">
                <span className="text-[10px] font-mono text-slate-400">Sample Intelligence Inspector</span>
                <button
                  onClick={() => { setActiveInspector(null); onOpenAuth(); }}
                  className="px-4 py-2 rounded-xl bg-brand text-white font-semibold text-xs hover:bg-brand/90 transition-all cursor-pointer shadow-sm"
                >
                  Execute in Workspace →
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
};
