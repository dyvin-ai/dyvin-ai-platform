import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SectionEyebrow } from './primitives';
import {
  Sparkles,
  ArrowRight,
  ArrowUpRight,
  ShieldCheck,
  TrendingUp,
  Activity,
  Layers,
  HelpCircle,
  X,
  Sliders,
  CheckCircle2,
  Info
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

interface AiIntelligenceOverviewProps {
  onOpenAuth?: () => void;
}

export const AiIntelligenceOverview: React.FC<AiIntelligenceOverviewProps> = ({ onOpenAuth }) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const [activeModelId, setActiveModelId] = useState<string | null>(null);
  const [showMethodologyTooltip, setShowMethodologyTooltip] = useState(false);

  // Close modal on Escape key for full accessibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && activeModelId) {
        setActiveModelId(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeModelId]);

  const models = [
    {
      id: 'perplexity',
      name: 'Perplexity Pro',
      provider: 'Perplexity AI',
      visibility: '74.8%',
      position: '#1.1',
      citations: '960',
      sentiment: '94 / 100',
      signal: 'Raw Visibility Leader',
      signalStyle: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20 font-semibold',
      Logo: PerplexityLogo,
      strategicNote: 'Perplexity leads in raw answer inclusion due to live changelog and documentation crawling.',
      opportunity: 'Automate weekly release syndication to preserve #1 citation rank.'
    },
    {
      id: 'chatgpt',
      name: 'ChatGPT 4o',
      provider: 'OpenAI Enterprise',
      visibility: '72.4%',
      position: '#1.2',
      citations: '1,420',
      sentiment: '89 / 100',
      signal: 'Strongest Organic Presence',
      signalStyle: 'text-brand bg-brand/10 border-brand/20 font-semibold',
      Logo: OpenAiLogo,
      strategicNote: 'ChatGPT holds the highest commercial evaluation presence across 261 buyer evaluation prompts.',
      opportunity: 'Publish updated enterprise compliance benchmarks to overtake Atlas AI in comparison queries.'
    },
    {
      id: 'claude',
      name: 'Claude 3.5 Sonnet',
      provider: 'Anthropic Enterprise',
      visibility: '70.8%',
      position: '#1.5',
      citations: '1,180',
      sentiment: '92 / 100',
      signal: 'Strong Technical Presence',
      signalStyle: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20 font-semibold',
      Logo: AnthropicLogo,
      strategicNote: 'High technical authority driven by official developer documentation and API specs.',
      opportunity: 'Refresh technical whitepapers every 30 days to reinforce architectural dominance.'
    },
    {
      id: 'gemini',
      name: 'Gemini 1.5 Pro',
      provider: 'Google AI',
      visibility: '69.1%',
      position: '#1.7',
      citations: '840',
      sentiment: '84 / 100',
      signal: 'Largest Citation Opportunity',
      signalStyle: 'text-amber-500 bg-amber-500/10 border-amber-500/20 font-bold',
      Logo: GoogleGeminiLogo,
      strategicNote: 'Gemini represents the largest citation opportunity in this benchmark due to uncached partner directories.',
      opportunity: 'Deploy structured schema across Google-indexed software directories to close the citation deficit.'
    },
    {
      id: 'copilot',
      name: 'Microsoft Copilot',
      provider: 'Microsoft Enterprise',
      visibility: '62.3%',
      position: '#2.4',
      citations: '620',
      sentiment: '79 / 100',
      signal: 'Developing Enterprise Signal',
      signalStyle: 'text-cyan-500 bg-cyan-500/10 border-cyan-500/20',
      Logo: CopilotLogo,
      strategicNote: 'Cites technical documentation and review aggregators in enterprise buyer queries.',
      opportunity: 'Expand presence across Microsoft Partner and enterprise review catalogs.'
    },
    {
      id: 'grok',
      name: 'xAI Grok 2',
      provider: 'xAI Real-Time',
      visibility: '48.9%',
      position: '#3.1',
      citations: '380',
      sentiment: '76 / 100',
      signal: 'Emerging Real-Time Queries',
      signalStyle: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
      Logo: GrokLogo,
      strategicNote: 'Emerging real-time conversational search volume with rising synthesis influence.',
      opportunity: 'Establish direct technical discourse in authoritative developer forums.'
    }
  ];

  const currentModalModel = models.find((m) => m.id === activeModelId);

  return (
    <section id="model-matrix" className={`py-14 md:py-20 border-b select-none transition-colors relative z-10 ${
      isLight ? 'bg-slate-50/70 border-slate-200/80 text-slate-900' : 'bg-[#000000] border-white/[0.08] text-white'
    }`}>
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-10">
          <SectionEyebrow label="CROSS-MODEL INTELLIGENCE" tag="One Unified View" />

          <h2 className={`mt-4 text-3xl sm:text-4xl md:text-5xl font-semibold font-display tracking-tight leading-[1.08] ${
            isLight ? 'text-slate-900' : 'text-white'
          }`}>
            One view across <br className="hidden sm:inline" />
            <span className={isLight ? 'text-slate-500' : 'text-white/60'}>
              every AI engine.
            </span>
          </h2>

          <p className={`mt-3 text-base md:text-lg leading-[1.65] font-normal ${
            isLight ? 'text-slate-600' : 'text-white/70'
          }`}>
            Compare how each major AI system represents your brand, then identify where visibility, position, citations, and sentiment create the biggest opportunities.
          </p>
        </div>

        {/* Primary Showpiece: Single Unified Executive Instrument */}
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
              <Layers className="size-3.5 text-brand" />
              <span className="font-semibold uppercase tracking-wider text-brand">Cross-Model Synthesis Matrix</span>
              <span className="text-slate-300 dark:text-white/20">•</span>
              <span className="text-[11px] hidden sm:inline">Normalized Multi-Engine Telemetry</span>
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
            
            {/* Zone 1: Executive Interpretation Takeaway Banner */}
            <div className={`p-5 sm:p-6 rounded-2xl border ${
              isLight ? 'bg-slate-50/70 border-slate-200' : 'bg-[#0a0d13] border-white/[0.06]'
            }`}>
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 dark:border-white/[0.05] text-xs font-mono">
                <div className="flex items-center gap-2">
                  <Sparkles className="size-3.5 text-brand" />
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    EXECUTIVE TAKEAWAY
                  </span>
                </div>
                <button
                  onClick={() => setShowMethodologyTooltip(!showMethodologyTooltip)}
                  className="text-[11px] text-brand hover:underline flex items-center gap-1 cursor-pointer font-mono"
                >
                  <Info className="size-3" />
                  <span>Methodology</span>
                </button>
              </div>

              {/* Methodology Tooltip */}
              <AnimatePresence>
                {showMethodologyTooltip && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    className={`p-3 rounded-xl border text-[11px] font-mono leading-relaxed mb-3 ${
                      isLight ? 'bg-slate-900 text-white border-slate-800' : 'bg-[#0f141c] text-white border-white/20'
                    }`}
                  >
                    <strong>Cross-Model Normalization:</strong> Dyvin evaluates identical buyer prompt sets across 6 frontier LLMs to derive normalized visibility, average rank position, cited volume, and affirmative sentiment.
                  </motion.div>
                )}
              </AnimatePresence>

              <p className={`text-xs sm:text-sm font-sans leading-relaxed ${isLight ? 'text-slate-800' : 'text-white/90'}`}>
                Perplexity currently shows the highest sample visibility (74.8%), while ChatGPT maintains strong organic presence (72.4%). Gemini represents the clearest citation opportunity (69.1%).
              </p>

              {/* 3 Executive Strategic Signals Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 pt-3 border-t border-slate-100 dark:border-white/[0.05] font-mono text-xs">
                
                <div className={`p-3 rounded-xl border ${
                  isLight ? 'bg-white border-slate-200/80' : 'bg-black/40 border-white/[0.05]'
                }`}>
                  <span className="text-[10px] text-slate-400 uppercase block">RAW VISIBILITY LEADER</span>
                  <div className="flex items-baseline justify-between mt-1">
                    <span className="font-sans font-bold text-slate-900 dark:text-white">Perplexity Pro</span>
                    <span className="font-bold text-emerald-500">74.8%</span>
                  </div>
                </div>

                <div className={`p-3 rounded-xl border ${
                  isLight ? 'bg-white border-slate-200/80' : 'bg-black/40 border-white/[0.05]'
                }`}>
                  <span className="text-[10px] text-slate-400 uppercase block">ORGANIC VISIBILITY SIGNAL</span>
                  <div className="flex items-baseline justify-between mt-1">
                    <span className="font-sans font-bold text-slate-900 dark:text-white">ChatGPT 4o</span>
                    <span className="font-bold text-brand">72.4%</span>
                  </div>
                </div>

                <div className={`p-3 rounded-xl border ${
                  isLight ? 'bg-white border-slate-200/80' : 'bg-black/40 border-white/[0.05]'
                }`}>
                  <span className="text-[10px] text-slate-400 uppercase block">LARGEST CITATION OPPORTUNITY</span>
                  <div className="flex items-baseline justify-between mt-1">
                    <span className="font-sans font-bold text-slate-900 dark:text-white">Gemini 1.5 Pro</span>
                    <span className="font-bold text-amber-500">69.1%</span>
                  </div>
                </div>

              </div>
            </div>

            {/* Zone 2: The Cross-Model Matrix Table */}
            <div className={`rounded-2xl border overflow-hidden ${
              isLight ? 'border-slate-200 shadow-xs' : 'border-white/[0.06]'
            }`}>
              <div className="w-full overflow-x-auto custom-scrollbar">
                <table className="w-full min-w-[700px] border-collapse text-xs">
                  <caption className="sr-only">Cross-model visibility and telemetry matrix</caption>
                  <thead>
                    <tr className={`border-b text-left font-mono text-[10px] uppercase tracking-[0.12em] ${
                      isLight ? 'bg-slate-50 border-slate-200 text-slate-500' : 'bg-[#0a0d13] border-white/[0.06] text-white/40'
                    }`}>
                      <th scope="col" className="py-3.5 pl-6 pr-3 font-semibold">AI Model</th>
                      <th scope="col" className="px-3 py-3.5 text-right font-semibold">Visibility</th>
                      <th scope="col" className="px-3 py-3.5 text-right font-semibold">Avg. Position</th>
                      <th scope="col" className="px-3 py-3.5 text-right font-semibold">Citations</th>
                      <th scope="col" className="px-3 py-3.5 text-right font-semibold">Sentiment</th>
                      <th scope="col" className="px-3 py-3.5 pr-6 text-right font-semibold">Signal</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y font-mono ${isLight ? 'divide-slate-100 bg-white' : 'divide-white/[0.04] bg-black/20'}`}>
                    {models.map((m) => (
                      <tr
                        key={m.id}
                        onClick={() => setActiveModelId(m.id)}
                        className={`transition-colors cursor-pointer ${
                          m.id === 'chatgpt' || m.id === 'perplexity'
                            ? isLight ? 'bg-blue-50/30 hover:bg-blue-50/60' : 'bg-brand/[0.02] hover:bg-brand/[0.05]'
                            : isLight ? 'hover:bg-slate-50' : 'hover:bg-white/[0.02]'
                        }`}
                      >
                        <th scope="row" className="py-4 pl-6 pr-3 text-left font-normal">
                          <span className="flex items-center gap-3">
                            <m.Logo className="size-4 shrink-0" />
                            <div>
                              <span className={`font-sans font-bold text-xs block ${isLight ? 'text-slate-900' : 'text-white'}`}>
                                {m.name}
                              </span>
                              <span className="font-mono text-[10px] text-slate-400 block">{m.provider}</span>
                            </div>
                          </span>
                        </th>
                        <td className={`px-3 py-4 text-right font-bold text-sm tnum ${
                          m.id === 'perplexity' || m.id === 'chatgpt' ? 'text-brand' : isLight ? 'text-slate-900' : 'text-white'
                        }`}>
                          {m.visibility}
                        </td>
                        <td className={`px-3 py-4 text-right font-semibold tnum ${isLight ? 'text-slate-800' : 'text-white/90'}`}>
                          {m.position}
                        </td>
                        <td className={`px-3 py-4 text-right tnum ${isLight ? 'text-slate-500' : 'text-white/60'}`}>
                          {m.citations}
                        </td>
                        <td className="px-3 py-4 text-right">
                          <span className="text-emerald-500 font-semibold">{m.sentiment}</span>
                        </td>
                        <td className="px-3 py-4 pr-6 text-right text-[10px]">
                          <span className={`px-2 py-0.5 rounded border inline-flex items-center gap-1 ${m.signalStyle}`}>
                            <span>{m.signal}</span>
                            <ArrowUpRight className="size-2.5 opacity-60" />
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Zone 3: Strategic Interpretation & Prescriptive Action Strip */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
              
              {/* Left 7 Cols: What This Means */}
              <div className="md:col-span-7 space-y-1 text-xs">
                <span className="font-mono text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                  WHAT THIS MEANS
                </span>
                <p className={`font-sans leading-relaxed ${isLight ? 'text-slate-700' : 'text-white/80'}`}>
                  Dyvin performs strongly across the leading conversational engines, but citation depth remains the clearest opportunity for improving visibility in Gemini.
                </p>
              </div>

              {/* Right 5 Cols: Prescriptive Recommended Action */}
              <div className="md:col-span-5 flex justify-start md:justify-end">
                <button
                  onClick={onOpenAuth}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-xs font-mono font-bold text-blue-500 hover:text-blue-600 dark:hover:text-blue-400 p-3 rounded-xl border border-blue-200 dark:border-blue-500/30 bg-blue-50/50 dark:bg-blue-950/20 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-all cursor-pointer shadow-xs"
                >
                  <span>Prioritize Gemini citation gaps →</span>
                </button>
              </div>

            </div>

          </div>

          {/* Bottom Narrative Transition Strip */}
          <div className={`px-6 py-4 border-t flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono ${
            isLight ? 'bg-slate-100/70 border-slate-200 text-slate-600' : 'bg-[#0c0f14] border-white/[0.06] text-white/70'
          }`}>
            <span>One intelligence layer unifying multi-model synthesis into actionable category outcomes.</span>
            <button
              onClick={onOpenAuth}
              className={`font-semibold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs transition-all shrink-0 ${
                isLight
                  ? 'bg-slate-900 text-white hover:bg-slate-800'
                  : 'bg-white text-black hover:bg-white/90'
              }`}
            >
              <span>Explore cross-model workspace</span>
              <ArrowRight className="size-3.5" />
            </button>
          </div>

        </div>

      </div>

      {/* Accessible Model Detail Diagnostic Inspector Modal */}
      <AnimatePresence>
        {activeModelId && currentModalModel && (
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
                    <currentModalModel.Logo className="size-4.5 text-slate-900 dark:text-white" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold font-display leading-tight">{currentModalModel.name}</h3>
                    <span className="font-mono text-[10px] text-slate-400">{currentModalModel.provider}</span>
                  </div>
                </div>
                <button
                  onClick={() => setActiveModelId(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/10 transition-colors cursor-pointer"
                  aria-label="Close model drilldown"
                >
                  <X className="size-4" />
                </button>
              </div>

              {/* Model Telemetry */}
              <div className="grid grid-cols-3 gap-3 font-mono text-xs mb-4">
                <div className={`p-3 rounded-xl border ${
                  isLight ? 'bg-slate-50 border-slate-200' : 'bg-black/40 border-white/[0.06]'
                }`}>
                  <span className="text-[10px] uppercase text-slate-400 block">Visibility</span>
                  <span className="font-bold text-base text-brand mt-0.5 block">{currentModalModel.visibility}</span>
                </div>
                <div className={`p-3 rounded-xl border ${
                  isLight ? 'bg-slate-50 border-slate-200' : 'bg-black/40 border-white/[0.06]'
                }`}>
                  <span className="text-[10px] uppercase text-slate-400 block">Avg Position</span>
                  <span className="font-bold text-base mt-0.5 block">{currentModalModel.position}</span>
                </div>
                <div className={`p-3 rounded-xl border ${
                  isLight ? 'bg-slate-50 border-slate-200' : 'bg-black/40 border-white/[0.06]'
                }`}>
                  <span className="text-[10px] uppercase text-slate-400 block">Sentiment</span>
                  <span className="font-bold text-base text-emerald-500 mt-0.5 block">{currentModalModel.sentiment}</span>
                </div>
              </div>

              {/* Strategic Insights */}
              <div className="space-y-3 text-xs">
                <div className={`p-3.5 rounded-xl border ${
                  isLight ? 'bg-white border-slate-200' : 'bg-white/[0.02] border-white/[0.06]'
                }`}>
                  <span className="font-mono text-[10px] uppercase font-bold text-brand block mb-1">
                    STRATEGIC INTERPRETATION
                  </span>
                  <p className={`font-sans leading-relaxed ${isLight ? 'text-slate-700' : 'text-white/80'}`}>
                    {currentModalModel.strategicNote}
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
                  onClick={() => { setActiveModelId(null); onOpenAuth?.(); }}
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
