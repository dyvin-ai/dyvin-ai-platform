import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SectionEyebrow } from './primitives';
import {
  ShieldCheck,
  TrendingUp,
  SearchCheck,
  RadioTower,
  ArrowRight,
  ArrowUpRight,
  Sparkles,
  Layers,
  Activity,
  CheckCircle2,
  Sliders,
  Target
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface LogoCloudProps {
  onOpenAuth?: () => void;
}

export const LogoCloud: React.FC<LogoCloudProps> = ({ onOpenAuth }) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const [activeAudienceIndex, setActiveAudienceIndex] = useState(0);

  const audiences = [
    {
      id: 'marketing',
      num: '01',
      role: 'Marketing & Brand Leaders',
      shortRole: 'Marketing & Brand',
      objective: 'Protect category visibility across generative search.',
      explanation: 'See where AI systems recommend your brand, where competitors displace you, and which signals are shaping category perception.',
      icon: ShieldCheck,
      actionLabel: 'Protect brand visibility',
      signals: [
        { label: 'AI VISIBILITY', value: '68.4%', change: '+8.7 pts · 30d' },
        { label: 'RECOMMENDATION SHARE', value: '24.1%', change: '−2.7 pts vs Atlas AI' },
        { label: 'SENTIMENT', value: '89 / 100', change: 'Positive synthesis' },
        { label: 'COMPETITIVE POSITION', value: '#2', change: 'Category recommendation' }
      ],
      evidence: 'Atlas AI currently appears ahead in 26.8% of category recommendations due to stronger analyst citations.',
      action: 'Close 4 high-value source gaps across enterprise review and analyst grids.',
      bars: [
        { label: 'Brand Visibility', pct: 68 },
        { label: 'Recommendation Share', pct: 24 },
        { label: 'Positive Sentiment', pct: 89 }
      ]
    },
    {
      id: 'growth',
      num: '02',
      role: 'Growth & Demand Teams',
      shortRole: 'Growth & Demand',
      objective: 'Capture emerging AI-driven discovery demand.',
      explanation: 'Identify the buyer questions where your category is being evaluated and discover where competitors are winning recommendations before prospects reach your site.',
      icon: TrendingUp,
      actionLabel: 'Find demand opportunities',
      signals: [
        { label: 'PROMPT COVERAGE', value: '74%', change: '540 queries tracked' },
        { label: 'SHARE OF VOICE', value: '24.1%', change: 'Leading in 130 queries' },
        { label: 'HIGH-INTENT GAPS', value: '14 queries', change: 'Head-to-head deficit' },
        { label: 'MODELED GAIN', value: '+4–8 pts', change: 'High-intent search' }
      ],
      evidence: '14 high-value comparison evaluation prompts fail to synthesize your brand in generative answers.',
      action: 'Publish side-by-side technical evaluation matrices and transparent comparison assets.',
      bars: [
        { label: 'Query Coverage', pct: 74 },
        { label: 'Share of Voice', pct: 24 },
        { label: 'Modeled Opportunity', pct: 62 }
      ]
    },
    {
      id: 'search',
      num: '03',
      role: 'Search & GEO Strategists',
      shortRole: 'Search & GEO',
      objective: 'Build the evidence AI uses to recommend your brand.',
      explanation: 'Understand which publications, review platforms, technical sources, and communities influence AI answers — then prioritize the gaps that matter.',
      icon: SearchCheck,
      actionLabel: 'Close citation gaps',
      signals: [
        { label: 'TRACKED CITATIONS', value: '5,033', change: '148 root domains' },
        { label: 'SOURCE INFLUENCE', value: '94 / 100', change: 'TechCrunch authority' },
        { label: 'CITATION GAPS', value: '4 sources', change: 'Gartner & G2 deficit' },
        { label: 'MODEL BREADTH', value: '6 Engines', change: 'Multi-model coverage' }
      ],
      evidence: 'Gartner appears in 261 tracked enterprise answers but currently contains 0 verified citations for your brand.',
      action: 'Deploy structured schema and submit updated capability benchmarks to analyst review portals.',
      bars: [
        { label: 'Citations Tracked', pct: 82 },
        { label: 'Source Authority', pct: 94 },
        { label: 'Model Breadth', pct: 100 }
      ]
    },
    {
      id: 'pr',
      num: '04',
      role: 'Communications & PR',
      shortRole: 'Comms & PR',
      objective: 'Shape the sources and narratives surrounding your brand.',
      explanation: 'See which external sources shape AI’s understanding of your company and identify where stronger authoritative references can change the narrative.',
      icon: RadioTower,
      actionLabel: 'Audit source influence',
      signals: [
        { label: 'NET SENTIMENT', value: '89 / 100', change: 'Affirmative synthesis' },
        { label: 'CORE NARRATIVE', value: 'Fast SLA', change: 'Latency & uptime cited' },
        { label: 'SOURCE GAP', value: 'Gartner (95)', change: 'Unreferenced in 261 ans' },
        { label: 'ACTIVE MENTIONS', value: '1,420', change: 'ChatGPT 4o answers' }
      ],
      evidence: 'Generative models heavily synthesize tier-1 technology press and community developer forums for brand reputation.',
      action: 'Target tier-1 technology press with verified enterprise case studies and customer metrics.',
      bars: [
        { label: 'Net Sentiment', pct: 89 },
        { label: 'Tier-1 Coverage', pct: 76 },
        { label: 'Community Signals', pct: 64 }
      ]
    }
  ];

  const current = audiences[activeAudienceIndex];

  return (
    <section id="audiences" className={`py-14 md:py-20 border-b select-none transition-colors relative z-10 ${
      isLight ? 'bg-white border-slate-200/80 text-slate-900' : 'bg-[#000000] border-white/[0.08] text-white'
    }`}>
      <div className="max-w-6xl mx-auto px-6 space-y-12">
        
        {/* Section Header */}
        <div className="max-w-3xl">
          <SectionEyebrow label="WHO USES DYVIN" tag="Built for teams navigating AI-driven discovery" />

          <h2 className={`mt-4 text-3xl sm:text-4xl md:text-5xl font-semibold font-display tracking-tight leading-[1.08] ${
            isLight ? 'text-slate-900' : 'text-white'
          }`}>
            One intelligence layer for every team <br className="hidden sm:inline" />
            <span className={isLight ? 'text-slate-500' : 'text-white/60'}>
              shaping how AI sees your brand.
            </span>
          </h2>

          <p className={`mt-3 text-base md:text-lg leading-[1.65] font-normal ${
            isLight ? 'text-slate-600' : 'text-white/70'
          }`}>
            Dyvin connects the teams responsible for visibility, demand, search, and reputation around one shared view of how generative AI represents your brand.
          </p>
        </div>

        {/* Asymmetric Editorial Architecture (Left ~35% Selector, Right ~65% Active Intelligence Panel) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left 4-5 Columns: Audience Selector Index */}
          <div className="lg:col-span-4 space-y-3" role="tablist" aria-label="Target Enterprise Audiences">
            <span className="font-mono text-[10px] uppercase font-bold text-slate-400 tracking-wider block px-1 mb-2">
              SELECT ENTERPRISE TEAM
            </span>

            {audiences.map((aud, index) => {
              const isSelected = activeAudienceIndex === index;
              const IconComp = aud.icon;

              return (
                <button
                  key={aud.id}
                  role="tab"
                  id={`tab-${aud.id}`}
                  aria-selected={isSelected}
                  aria-controls={`panel-${aud.id}`}
                  onClick={() => setActiveAudienceIndex(index)}
                  className={`w-full p-4 rounded-2xl border text-left transition-all flex items-center justify-between gap-3 cursor-pointer ${
                    isSelected
                      ? isLight
                        ? 'bg-slate-50 border-slate-300 shadow-sm'
                        : 'bg-[#0a0d13] border-white/20 shadow-lg'
                      : isLight
                        ? 'bg-white border-slate-200/80 hover:bg-slate-50/60 hover:border-slate-300'
                        : 'bg-black/30 border-white/[0.05] hover:bg-white/[0.02] hover:border-white/10'
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className={`size-9 rounded-xl border flex items-center justify-center shrink-0 transition-colors ${
                      isSelected
                        ? 'bg-brand text-white border-brand'
                        : isLight
                          ? 'bg-slate-100 text-slate-600 border-slate-200'
                          : 'bg-white/5 text-white/60 border-white/10'
                    }`}>
                      <IconComp className="size-4.5" />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] font-bold text-slate-400">{aud.num}</span>
                        <span className={`font-display font-bold text-xs truncate ${
                          isSelected
                            ? isLight ? 'text-slate-900' : 'text-white'
                            : isLight ? 'text-slate-700' : 'text-white/70'
                        }`}>
                          {aud.role}
                        </span>
                      </div>
                      <span className={`text-[11px] font-sans truncate block mt-0.5 ${
                        isSelected
                          ? isLight ? 'text-slate-600 font-medium' : 'text-white/70'
                          : isLight ? 'text-slate-400' : 'text-white/40'
                      }`}>
                        {aud.objective}
                      </span>
                    </div>
                  </div>

                  <ArrowRight className={`size-3.5 shrink-0 transition-transform ${
                    isSelected
                      ? 'text-brand translate-x-0.5'
                      : 'text-slate-300 dark:text-white/20'
                  }`} />
                </button>
              );
            })}
          </div>

          {/* Right 7-8 Columns: Active Audience Intelligence Panel */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                role="tabpanel"
                id={`panel-${current.id}`}
                aria-labelledby={`tab-${current.id}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className={`rounded-3xl border p-6 sm:p-8 shadow-2xl transition-all relative overflow-hidden ${
                  isLight
                    ? 'bg-[#FBFBFC] border-slate-200 shadow-slate-200/50 text-slate-900'
                    : 'bg-[#080a0d] border-white/[0.09] shadow-black/80 text-white'
                }`}
              >
                {/* Header Strip */}
                <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-100 dark:border-white/[0.06]">
                  <div className="flex items-center gap-2 font-mono text-xs">
                    <span className="font-bold text-brand uppercase tracking-wider">{current.num} — {current.shortRole}</span>
                    <span className="text-slate-300 dark:text-white/20">•</span>
                    <span className="text-slate-400 hidden sm:inline">AI Presence Signals</span>
                  </div>
                  <span className={`text-[10px] font-mono uppercase font-bold tracking-wider px-2 py-0.5 rounded border ${
                    isLight ? 'bg-slate-100 border-slate-200 text-slate-600' : 'bg-white/5 border-white/10 text-white/40'
                  }`}>
                    SAMPLE BENCHMARK
                  </span>
                </div>

                {/* Primary Objective & Explanation */}
                <div className="space-y-2 mb-6">
                  <h3 className="text-xl sm:text-2xl font-bold font-display tracking-tight text-slate-900 dark:text-white">
                    {current.objective}
                  </h3>
                  <p className={`text-xs sm:text-sm font-sans leading-relaxed ${isLight ? 'text-slate-600' : 'text-white/70'}`}>
                    {current.explanation}
                  </p>
                </div>

                {/* 4 Compact Intelligence Signals */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs mb-6">
                  {current.signals.map((sig) => (
                    <div
                      key={sig.label}
                      className={`p-3.5 rounded-2xl border ${
                        isLight ? 'bg-white border-slate-200/80' : 'bg-[#0a0d13] border-white/[0.05]'
                      }`}
                    >
                      <span className="text-[9px] text-slate-400 uppercase font-bold tracking-wider block truncate">
                        {sig.label}
                      </span>
                      <div className="text-base sm:text-lg font-bold text-brand mt-1 tnum">
                        {sig.value}
                      </div>
                      <span className={`text-[10px] block mt-0.5 truncate ${isLight ? 'text-slate-500' : 'text-white/50'}`}>
                        {sig.change}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Micro-Visualization: Horizontal Presence Telemetry */}
                <div className={`p-4 rounded-2xl border space-y-2.5 mb-6 font-mono text-xs ${
                  isLight ? 'bg-white border-slate-200/80' : 'bg-[#0a0d13] border-white/[0.05]'
                }`}>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                    TELEMETRY READOUT
                  </span>
                  <div className="space-y-2">
                    {current.bars.map((bar) => (
                      <div key={bar.label} className="space-y-1">
                        <div className="flex justify-between text-[11px]">
                          <span className={isLight ? 'text-slate-700 font-medium' : 'text-white/80'}>{bar.label}</span>
                          <span className="font-bold text-brand">{bar.pct}%</span>
                        </div>
                        <div className={`w-full h-1.5 rounded-full overflow-hidden ${isLight ? 'bg-slate-100' : 'bg-white/10'}`}>
                          <div className="h-full bg-brand rounded-full" style={{ width: `${bar.pct}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Evidence → Action Strip */}
                <div className={`p-5 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-4 ${
                  isLight
                    ? 'bg-blue-50/70 border-blue-200 text-blue-950 shadow-xs'
                    : 'bg-blue-950/20 border-blue-500/25 text-blue-200 shadow-xs'
                }`}>
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-wider text-blue-500">
                      <Sparkles className="size-3" />
                      <span>DIAGNOSTIC EVIDENCE & ACTION</span>
                    </div>
                    <p className="font-sans leading-relaxed">
                      <strong>Observed:</strong> {current.evidence}
                    </p>
                    <p className="font-sans text-blue-600 dark:text-blue-300 font-medium">
                      <strong>Recommended Move:</strong> {current.action}
                    </p>
                  </div>

                  <button
                    onClick={onOpenAuth}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl font-mono text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 shadow-xs shrink-0 cursor-pointer transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>{current.actionLabel}</span>
                    <ArrowRight className="size-3.5" />
                  </button>
                </div>

              </motion.div>
            </AnimatePresence>
          </div>

        </div>

      </div>
    </section>
  );
};
