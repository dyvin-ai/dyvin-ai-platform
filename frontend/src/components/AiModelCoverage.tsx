import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SectionEyebrow } from './primitives';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Activity,
  Cpu,
  Layers,
  ArrowUpRight,
  X,
  CheckCircle2,
  AlertTriangle,
  Info,
  Sliders
} from 'lucide-react';
import {
  OpenAiLogo,
  AnthropicLogo,
  GoogleGeminiLogo,
  PerplexityLogo,
  CopilotLogo,
  GrokLogo
} from './ModelLogos';
import { useTheme } from '../context/ThemeContext';

interface AiModelCoverageProps {
  onOpenAuth?: () => void;
}

export const AiModelCoverage: React.FC<AiModelCoverageProps> = ({ onOpenAuth }) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const [activeModelModal, setActiveModelModal] = useState<string | null>(null);

  // Close modal on Escape key for full accessibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && activeModelModal) {
        setActiveModelModal(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeModelModal]);

  const models = [
    {
      id: 'perplexity',
      name: 'Perplexity Pro',
      provider: 'Perplexity AI',
      visibility: 74.8,
      avgPos: '#1.1',
      sentiment: '94 / 100',
      status: 'Top Performance',
      statusStyle: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
      signal: 'Strong',
      logo: PerplexityLogo,
      keyAdvantage: 'Direct synthesis of real-time release notes & TechCrunch technical benchmarks',
      opportunity: 'Maintain automated changelog syndication to preserve #1 citation rank'
    },
    {
      id: 'chatgpt',
      name: 'ChatGPT 4o',
      provider: 'OpenAI Enterprise',
      visibility: 72.4,
      avgPos: '#1.2',
      sentiment: '89 / 100',
      status: 'Strong Organic Visibility',
      statusStyle: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
      signal: 'Strong',
      logo: OpenAiLogo,
      keyAdvantage: 'High recommendation frequency across 261 buyer evaluation prompts',
      opportunity: 'Publish updated enterprise compliance benchmarks to overtake Atlas AI in comparison queries'
    },
    {
      id: 'claude',
      name: 'Claude 3.5 Sonnet',
      provider: 'Anthropic Enterprise',
      visibility: 70.8,
      avgPos: '#1.5',
      sentiment: '92 / 100',
      status: 'Strong Technical Presence',
      statusStyle: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
      signal: 'Strong',
      logo: AnthropicLogo,
      keyAdvantage: 'API architecture and developer documentation cited in 94% of technical queries',
      opportunity: 'Refresh technical whitepapers every 30 days to reinforce architectural dominance'
    },
    {
      id: 'gemini',
      name: 'Gemini 1.5 Pro',
      provider: 'Google AI',
      visibility: 69.1,
      avgPos: '#1.7',
      sentiment: '84 / 100',
      status: 'Largest Citation Opportunity',
      statusStyle: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
      signal: 'Opportunity',
      logo: GoogleGeminiLogo,
      keyAdvantage: 'Cited for multi-model accuracy in 540 buyer queries',
      opportunity: 'Deploy structured schema across Google-indexed partner directories to close the citation deficit'
    },
    {
      id: 'copilot',
      name: 'Microsoft Copilot',
      provider: 'Microsoft Enterprise',
      visibility: 62.3,
      avgPos: '#2.4',
      sentiment: '79 / 100',
      status: 'Developing Enterprise Signal',
      statusStyle: 'text-cyan-500 bg-cyan-500/10 border-cyan-500/20',
      signal: 'Developing',
      logo: CopilotLogo,
      keyAdvantage: 'Cites technical documentation and review aggregators in enterprise buyer queries',
      opportunity: 'Expand presence across Microsoft Partner and enterprise review catalogs'
    },
    {
      id: 'grok',
      name: 'xAI Grok 2',
      provider: 'xAI Real-Time',
      visibility: 48.9,
      avgPos: '#3.1',
      sentiment: '76 / 100',
      status: 'Emerging Real-Time Queries',
      statusStyle: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
      signal: 'Opportunity',
      logo: GrokLogo,
      keyAdvantage: 'Real-time social sentiment and conversational technical discussions',
      opportunity: 'Establish direct technical discourse in authoritative developer forums'
    }
  ];

  const currentModalModel = models.find((m) => m.id === activeModelModal);

  return (
    <section id="model-coverage" className={`py-14 md:py-20 border-b select-none transition-colors relative z-10 ${
      isLight ? 'bg-slate-50/70 border-slate-200/80 text-slate-900' : 'bg-[#000000] border-white/[0.08] text-white'
    }`}>
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Editorial Section Header */}
        <div className="max-w-3xl mb-10">
          <SectionEyebrow label="MODEL ECOSYSTEM" tag="6 AI Engines" />

          <h2 className={`mt-4 text-3xl sm:text-4xl md:text-5xl font-semibold font-display tracking-tight leading-[1.08] ${
            isLight ? 'text-slate-900' : 'text-white'
          }`}>
            One view across the AI engines <br className="hidden sm:inline" />
            <span className={isLight ? 'text-slate-500' : 'text-white/60'}>
              shaping discovery.
            </span>
          </h2>

          <p className={`mt-3 text-base md:text-lg leading-[1.65] font-normal ${
            isLight ? 'text-slate-600' : 'text-white/70'
          }`}>
            Track how your brand appears across the major generative systems buyers use to discover, compare, and evaluate products.
          </p>
        </div>

        {/* Primary Showpiece: Single Unified Model Ecosystem Command Surface */}
        <div className={`rounded-3xl border shadow-2xl transition-all relative overflow-hidden ${
          isLight
            ? 'bg-white border-slate-200 shadow-slate-200/50 text-slate-900'
            : 'bg-[#080a0d] border-white/[0.09] shadow-black/80 text-white'
        }`}>
          
          {/* Top Context & Status Strip */}
          <div className={`px-6 py-4 border-b flex flex-wrap items-center justify-between gap-3 text-xs font-mono ${
            isLight ? 'bg-slate-100/70 border-slate-200 text-slate-600' : 'bg-[#0c0f14] border-white/[0.06] text-white/60'
          }`}>
            <div className="flex items-center gap-2">
              <Cpu className="size-3.5 text-brand" />
              <span className="font-semibold uppercase tracking-wider text-brand">Model Ecosystem Normalization</span>
              <span className="text-slate-300 dark:text-white/20">•</span>
              <span className="text-[11px] hidden sm:inline">6 Frontier Engines Evaluated</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-[11px] text-slate-400">68.4% Overall Benchmark</span>
              <span className="text-slate-300 dark:text-white/20">•</span>
              <span className={`px-2 py-0.5 rounded border text-[10px] uppercase font-bold tracking-wider ${
                isLight ? 'bg-slate-200/70 border-slate-300 text-slate-600' : 'bg-white/5 border-white/10 text-white/40'
              }`}>
                SAMPLE BENCHMARK
              </span>
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            
            {/* Zone 1: Executive Strategic Insight Banner */}
            <div className={`p-5 sm:p-6 rounded-2xl border ${
              isLight ? 'bg-slate-50/70 border-slate-200' : 'bg-[#0a0d13] border-white/[0.06]'
            }`}>
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100 dark:border-white/[0.05] text-xs font-mono">
                <div className="flex items-center gap-2">
                  <Sparkles className="size-3.5 text-brand" />
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    EXECUTIVE STRATEGIC INSIGHT
                  </span>
                </div>
                <span className="text-brand font-semibold text-[11px]">Where Dyvin is strongest — and where the opportunity is</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Left: Strongest Organic Visibility */}
                <div className={`p-4 rounded-xl border flex items-start gap-3 ${
                  isLight ? 'bg-white border-slate-200/90' : 'bg-black/40 border-white/[0.05]'
                }`}>
                  <div className="size-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 mt-0.5">
                    <OpenAiLogo className="size-4 text-emerald-500" />
                  </div>
                  <div>
                    <span className="font-mono text-[10px] font-bold uppercase text-emerald-500 tracking-wider block">
                      STRONGEST ORGANIC VISIBILITY
                    </span>
                    <div className="flex items-baseline gap-2 mt-0.5">
                      <span className="font-display font-bold text-sm text-slate-900 dark:text-white">ChatGPT 4o</span>
                      <span className="font-mono text-xs font-bold text-brand">72.4% Visibility</span>
                    </div>
                    <p className={`text-xs mt-1 leading-relaxed ${isLight ? 'text-slate-600' : 'text-white/60'}`}>
                      High organic recommendation frequency and top sentiment across 261 buyer evaluation prompts.
                    </p>
                  </div>
                </div>

                {/* Right: Largest Citation Opportunity */}
                <div className={`p-4 rounded-xl border flex items-start gap-3 ${
                  isLight ? 'bg-white border-slate-200/90' : 'bg-black/40 border-white/[0.05]'
                }`}>
                  <div className="size-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0 mt-0.5">
                    <GoogleGeminiLogo className="size-4 text-amber-500" />
                  </div>
                  <div>
                    <span className="font-mono text-[10px] font-bold uppercase text-amber-500 tracking-wider block">
                      LARGEST CITATION OPPORTUNITY
                    </span>
                    <div className="flex items-baseline gap-2 mt-0.5">
                      <span className="font-display font-bold text-sm text-slate-900 dark:text-white">Gemini 1.5 Pro</span>
                      <span className="font-mono text-xs font-bold text-amber-500">69.1% Visibility</span>
                    </div>
                    <p className={`text-xs mt-1 leading-relaxed ${isLight ? 'text-slate-600' : 'text-white/60'}`}>
                      Gemini represents the largest citation opportunity in this sample benchmark due to uncached partner directory citations.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Zone 2: Comparative Telemetry Matrix (6 Frontier Engines) */}
            <div className={`rounded-2xl border overflow-hidden ${
              isLight ? 'border-slate-200' : 'border-white/[0.06]'
            }`}>
              <div className={`px-5 py-3 border-b flex items-center justify-between text-[10px] font-mono uppercase font-bold text-slate-400 ${
                isLight ? 'bg-slate-100/60' : 'bg-[#0a0d13]'
              }`}>
                <span>AI ENGINE & ENVIRONMENT</span>
                <div className="flex items-center gap-8">
                  <span className="hidden sm:inline">AVG POSITION</span>
                  <span className="hidden md:inline">SIGNAL</span>
                  <span>VISIBILITY</span>
                  <span className="w-6" />
                </div>
              </div>

              <div className={`divide-y font-mono text-xs ${
                isLight ? 'divide-slate-100 bg-white' : 'divide-white/[0.04] bg-black/20'
              }`}>
                {models.map((m) => (
                  <div
                    key={m.id}
                    onClick={() => setActiveModelModal(m.id)}
                    className={`px-5 py-4 flex items-center justify-between gap-4 transition-all cursor-pointer ${
                      isLight ? 'hover:bg-slate-50' : 'hover:bg-white/[0.03]'
                    }`}
                  >
                    {/* Model Mark & Identity */}
                    <div className="flex items-center gap-3.5 min-w-[180px]">
                      <div className="size-8 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center shrink-0">
                        <m.logo className="size-4 text-slate-800 dark:text-white" />
                      </div>
                      <div>
                        <div className="font-sans font-bold text-xs text-slate-900 dark:text-white">
                          {m.name}
                        </div>
                        <span className="text-[10px] text-slate-400 block">{m.provider}</span>
                      </div>
                    </div>

                    {/* Progress Track & Numeric Telemetry */}
                    <div className="flex items-center gap-6 sm:gap-8 shrink-0">
                      <span className="hidden sm:inline text-slate-500 dark:text-white/60 font-semibold">{m.avgPos}</span>
                      
                      <span className={`hidden md:inline text-[10px] px-2 py-0.5 rounded border font-semibold ${m.statusStyle}`}>
                        {m.signal}
                      </span>

                      {/* Bar Visualization + Percentage */}
                      <div className="flex items-center gap-3 w-32 sm:w-40">
                        <div className={`flex-1 h-1.5 rounded-full overflow-hidden ${
                          isLight ? 'bg-slate-100' : 'bg-white/10'
                        }`}>
                          <div
                            className={`h-full rounded-full ${
                              m.visibility >= 72 ? 'bg-brand' : m.visibility >= 65 ? 'bg-cyan-400' : 'bg-amber-500'
                            }`}
                            style={{ width: `${m.visibility}%` }}
                          />
                        </div>
                        <span className="font-bold text-xs text-slate-900 dark:text-white shrink-0 w-11 text-right">
                          {m.visibility}%
                        </span>
                      </div>

                      <ArrowUpRight className="size-3.5 text-slate-400 shrink-0" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Zone 3: Model-Specific Action Opportunity Strip */}
            <div className={`p-4 sm:p-5 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-4 ${
              isLight
                ? 'bg-blue-50/70 border-blue-200 text-blue-950 shadow-xs'
                : 'bg-blue-950/20 border-blue-500/25 text-blue-200 shadow-xs'
            }`}>
              <div className="flex items-center gap-3">
                <div className="size-8 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500 shrink-0">
                  <Sliders className="size-4" />
                </div>
                <div>
                  <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-blue-500 block">
                    MODEL OPPORTUNITY
                  </span>
                  <p className="text-xs font-sans font-medium leading-relaxed mt-0.5">
                    Prioritize Gemini citation coverage and comparison-query visibility to close the −2.7 pts competitive deficit.
                  </p>
                </div>
              </div>

              <button
                onClick={onOpenAuth}
                className="font-mono text-xs font-bold text-blue-500 hover:underline flex items-center gap-1 shrink-0 cursor-pointer"
              >
                <span>View model-specific opportunities →</span>
              </button>
            </div>

          </div>

          {/* Bottom Narrative Transition Strip */}
          <div className={`px-6 py-4 border-t flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono ${
            isLight ? 'bg-slate-100/70 border-slate-200 text-slate-600' : 'bg-[#0c0f14] border-white/[0.06] text-white/70'
          }`}>
            <span>Dyvin normalizes fragmented AI environments into one continuous intelligence layer.</span>
            <button
              onClick={onOpenAuth}
              className={`font-semibold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs transition-all shrink-0 ${
                isLight
                  ? 'bg-slate-900 text-white hover:bg-slate-800'
                  : 'bg-white text-black hover:bg-white/90'
              }`}
            >
              <span>Audit all 6 engines</span>
              <ArrowRight className="size-3.5" />
            </button>
          </div>

        </div>

      </div>

      {/* Accessible Model Detail Diagnostic Drawer */}
      <AnimatePresence>
        {activeModelModal && currentModalModel && (
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
                <div className="flex items-center gap-3">
                  <div className="size-9 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center">
                    <currentModalModel.logo className="size-4.5 text-slate-900 dark:text-white" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold font-display leading-tight">{currentModalModel.name}</h3>
                    <span className="font-mono text-[10px] text-slate-400">{currentModalModel.provider}</span>
                  </div>
                </div>
                <button
                  onClick={() => setActiveModelModal(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/10 transition-colors cursor-pointer"
                  aria-label="Close model drilldown"
                >
                  <X className="size-4" />
                </button>
              </div>

              {/* Model Specific Telemetry Strip */}
              <div className="grid grid-cols-3 gap-3 font-mono text-xs mb-4">
                <div className={`p-3 rounded-xl border ${
                  isLight ? 'bg-slate-50 border-slate-200' : 'bg-black/40 border-white/[0.06]'
                }`}>
                  <span className="text-[10px] uppercase text-slate-400 block">Visibility</span>
                  <span className="font-bold text-base text-brand mt-0.5 block">{currentModalModel.visibility}%</span>
                </div>
                <div className={`p-3 rounded-xl border ${
                  isLight ? 'bg-slate-50 border-slate-200' : 'bg-black/40 border-white/[0.06]'
                }`}>
                  <span className="text-[10px] uppercase text-slate-400 block">Avg Position</span>
                  <span className="font-bold text-base mt-0.5 block">{currentModalModel.avgPos}</span>
                </div>
                <div className={`p-3 rounded-xl border ${
                  isLight ? 'bg-slate-50 border-slate-200' : 'bg-black/40 border-white/[0.06]'
                }`}>
                  <span className="text-[10px] uppercase text-slate-400 block">Sentiment</span>
                  <span className="font-bold text-base text-emerald-500 mt-0.5 block">{currentModalModel.sentiment}</span>
                </div>
              </div>

              {/* Key Diagnostic Insights */}
              <div className="space-y-3 text-xs">
                <div className={`p-3.5 rounded-xl border ${
                  isLight ? 'bg-white border-slate-200' : 'bg-white/[0.02] border-white/[0.06]'
                }`}>
                  <span className="font-mono text-[10px] uppercase font-bold text-brand block mb-1">
                    PRIMARY CITATION ADVANTAGE
                  </span>
                  <p className={`font-sans leading-relaxed ${isLight ? 'text-slate-700' : 'text-white/80'}`}>
                    {currentModalModel.keyAdvantage}
                  </p>
                </div>

                <div className={`p-3.5 rounded-xl border ${
                  isLight ? 'bg-white border-slate-200' : 'bg-white/[0.02] border-white/[0.06]'
                }`}>
                  <span className="font-mono text-[10px] uppercase font-bold text-blue-500 block mb-1">
                    RECOMMENDED STRATEGIC MOVE
                  </span>
                  <p className={`font-sans leading-relaxed ${isLight ? 'text-slate-700' : 'text-white/80'}`}>
                    {currentModalModel.opportunity}
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-white/10 flex items-center justify-between">
                <span className="text-[10px] font-mono text-slate-400">Sample Model Audit</span>
                <button
                  onClick={() => { setActiveModelModal(null); onOpenAuth?.(); }}
                  className="px-4 py-2 rounded-xl bg-brand text-white font-semibold text-xs hover:bg-brand/90 transition-all cursor-pointer shadow-sm"
                >
                  Inspect in Workspace →
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
};
