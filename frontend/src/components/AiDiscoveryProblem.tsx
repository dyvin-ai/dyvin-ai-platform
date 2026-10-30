import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Sparkles, ShieldAlert, ArrowDown, HelpCircle } from 'lucide-react';
import { SectionEyebrow } from './primitives';
import { useTheme } from '../context/ThemeContext';

interface AiDiscoveryProblemProps {
  onOpenAuth: () => void;
}

export const AiDiscoveryProblem: React.FC<AiDiscoveryProblemProps> = ({ onOpenAuth }) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const [activeQuery, setActiveQuery] = useState<'q1' | 'q2'>('q1');

  const queryData = {
    q1: {
      prompt: 'Which enterprise platforms accurately monitor AI search presence and answer engine optimization?',
      results: [
        {
          rank: '01',
          name: 'Atlas AI',
          role: 'Competitor Leader',
          roleStyle: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
          metric: '78% recommendation frequency',
          note: 'Commands top rank due to 4 recent Gartner and analyst briefs.'
        },
        {
          rank: '02',
          name: 'Dyvin AI',
          role: 'Your Brand (#2 Position)',
          roleStyle: 'text-blue-500 bg-blue-500/10 border-blue-500/20 font-bold',
          metric: '68.4% visibility · −2.7 pts Gap',
          note: 'High technical authority on GitHub & TechCrunch, but missing analyst review grid.'
        },
        {
          rank: '03',
          name: 'SearchMatrix',
          role: 'Legacy Alternative',
          roleStyle: 'text-slate-400 bg-white/5 border-white/10',
          metric: '34% recommendation frequency',
          note: 'Traditional SEO platform retrofit with low conversational synthesis weight.'
        }
      ]
    },
    q2: {
      prompt: 'What are the best alternatives for auditing multi-model generative visibility and citations?',
      results: [
        {
          rank: '01',
          name: 'Atlas AI',
          role: 'Competitor Leader',
          roleStyle: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
          metric: '82% recommendation frequency',
          note: 'Cited heavily across enterprise software directories and buyer comparison grids.'
        },
        {
          rank: '02',
          name: 'Dyvin AI',
          role: 'Your Brand (#2 Position)',
          roleStyle: 'text-blue-500 bg-blue-500/10 border-blue-500/20 font-bold',
          metric: '68.4% visibility · −2.7 pts Gap',
          note: 'Strongest real-time latency score, but uncited on G2 enterprise comparison grid.'
        },
        {
          rank: '03',
          name: 'CloudRank',
          role: 'Alternative',
          roleStyle: 'text-slate-400 bg-white/5 border-white/10',
          metric: '41% recommendation frequency',
          note: 'Standard search indexer without citation graph tracing.'
        }
      ]
    }
  };

  const current = queryData[activeQuery];

  const problemPoints = [
    {
      id: '01',
      title: 'Invisible Recommendations',
      desc: 'AI answers are synthesized in real-time and never appear in traditional search analytics or rank trackers.'
    },
    {
      id: '02',
      title: 'Competitive Displacement',
      desc: 'A competitor can win the recommendation in conversational answers before a buyer ever visits your website.'
    },
    {
      id: '03',
      title: 'Evidence-Driven Synthesis',
      desc: 'AI recommendations are shaped by the authority of sources, citations, and review grids surrounding your category.'
    }
  ];

  return (
    <section className={`py-14 md:py-20 border-b select-none transition-colors relative z-10 ${
      isLight ? 'bg-slate-50/70 border-slate-200/80 text-slate-900' : 'bg-[#000000] border-white/[0.08] text-white'
    }`}>
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Section Editorial Header */}
        <div className="max-w-3xl mb-10">
          <SectionEyebrow label="DISCOVERY INTELLIGENCE" tag="The New Discovery Layer" />

          <h2 className={`mt-4 text-3xl sm:text-4xl md:text-5xl font-semibold font-display tracking-tight leading-[1.08] ${
            isLight ? 'text-slate-900' : 'text-white'
          }`}>
            AI is already shaping how buyers <br className="hidden sm:inline" />
            <span className={isLight ? 'text-slate-500' : 'text-white/60'}>
              discover your category.
            </span>
          </h2>

          <p className={`mt-3 text-base md:text-lg leading-[1.65] font-normal ${
            isLight ? 'text-slate-600' : 'text-white/70'
          }`}>
            Buyers are asking ChatGPT, Claude, Gemini, Perplexity, and other AI systems which vendors to consider. If your brand isn't appearing in those answers, you may be losing discovery before a buyer ever reaches your website.
          </p>
        </div>

        {/* Two-Column Discovery Intelligence Canvas */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          
          {/* Left Column: 3 Strategic Problem Axioms + Bridge Call to Action */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            
            <div className="space-y-4">
              {problemPoints.map((point) => (
                <div
                  key={point.id}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                    isLight
                      ? 'bg-white border-slate-200/90 shadow-xs hover:border-slate-300'
                      : 'bg-[#080a0d] border-white/[0.07] hover:border-white/15 shadow-xs'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="font-mono text-xs font-bold text-brand">{point.id}</span>
                    <span className="text-slate-300 dark:text-white/20">•</span>
                    <h3 className={`font-display font-semibold text-sm ${isLight ? 'text-slate-900' : 'text-white'}`}>
                      {point.title}
                    </h3>
                  </div>
                  <p className={`text-xs leading-relaxed font-sans ${isLight ? 'text-slate-600' : 'text-white/70'}`}>
                    {point.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* Dyvin Strategic Bridge Action Card */}
            <div className={`p-5 rounded-2xl border flex flex-col justify-between gap-4 ${
              isLight
                ? 'bg-gradient-to-b from-white to-slate-100/80 border-slate-200 shadow-xs'
                : 'bg-gradient-to-b from-[#0c0f16] to-[#080a0d] border-white/[0.1] shadow-xs'
            }`}>
              <div className="flex items-start gap-3">
                <div className="size-8 rounded-xl bg-brand/10 border border-brand/20 flex items-center justify-center text-brand shrink-0 mt-0.5">
                  <Sparkles className="size-4" />
                </div>
                <div>
                  <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-brand block">
                    THE DYVIN ADVANTAGE
                  </span>
                  <p className={`text-xs mt-1 leading-relaxed ${isLight ? 'text-slate-700' : 'text-white/80'}`}>
                    Dyvin reverse-engineers the synthesis layer to reveal which citations, prompts, and sources determine AI recommendations.
                  </p>
                </div>
              </div>

              <button
                onClick={onOpenAuth}
                className="w-full inline-flex items-center justify-center gap-2 text-xs font-semibold px-4 py-3 rounded-xl bg-brand text-white hover:bg-brand/90 transition-all cursor-pointer shadow-md"
              >
                <span>See your brand's recommendation diagnosis</span>
                <ArrowRight className="size-3.5" />
              </button>
            </div>

          </div>

          {/* Right Column: The Discovery Flow Visual (Analytical Instrument) */}
          <div className="lg:col-span-7">
            <div className={`rounded-3xl border p-6 sm:p-7 h-full flex flex-col justify-between shadow-2xl transition-colors ${
              isLight
                ? 'bg-white border-slate-200 shadow-slate-200/50'
                : 'bg-[#080a0d] border-white/[0.09] shadow-black/80'
            }`}>
              
              {/* Header Bar */}
              <div>
                <div className={`flex flex-wrap items-center justify-between gap-3 pb-4 border-b mb-5 text-xs font-mono ${
                  isLight ? 'border-slate-100 text-slate-500' : 'border-white/[0.06] text-white/50'
                }`}>
                  <div className="flex items-center gap-2">
                    <span className="size-2 rounded-full bg-blue-500" />
                    <span className="font-semibold uppercase tracking-wider text-brand">Discovery Flow Synthesis</span>
                  </div>

                  {/* Query Toggle Controls */}
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setActiveQuery('q1')}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition-all cursor-pointer ${
                        activeQuery === 'q1'
                          ? isLight ? 'bg-slate-900 text-white font-bold' : 'bg-white text-black font-bold'
                          : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      Prompt 01
                    </button>
                    <button
                      onClick={() => setActiveQuery('q2')}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition-all cursor-pointer ${
                        activeQuery === 'q2'
                          ? isLight ? 'bg-slate-900 text-white font-bold' : 'bg-white text-black font-bold'
                          : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      Prompt 02
                    </button>
                  </div>
                </div>

                {/* Node 1: Buyer Query */}
                <div className={`p-4 rounded-2xl border font-mono text-xs mb-3 ${
                  isLight ? 'bg-slate-50 border-slate-200 text-slate-800' : 'bg-[#0a0d13] border-white/[0.06] text-white/80'
                }`}>
                  <div className="flex items-center justify-between text-[10px] uppercase font-bold text-slate-400 mb-1">
                    <span>1. BUYER QUERY</span>
                    <span className="text-blue-500 font-mono">High-Intent Evaluation</span>
                  </div>
                  <p className="font-sans text-xs leading-relaxed font-medium">
                    "{current.prompt}"
                  </p>
                </div>

                {/* Node 2: Synthesis Engine Node Indicator */}
                <div className="flex items-center justify-center my-2">
                  <div className={`px-3 py-1 rounded-full border text-[10px] font-mono flex items-center gap-2 ${
                    isLight ? 'bg-slate-100 border-slate-200 text-slate-600' : 'bg-white/[0.03] border-white/10 text-white/60'
                  }`}>
                    <span>Multi-Model Synthesis:</span>
                    <span className="text-brand font-semibold">ChatGPT · Claude · Gemini · Perplexity</span>
                    <ArrowDown className="size-3 text-blue-500" />
                  </div>
                </div>

                {/* Node 3: Synthesized Recommendation Set */}
                <div className="space-y-2.5 mt-3">
                  <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-slate-400 px-1">
                    <span>2. SYNTHESIZED RECOMMENDATION SET</span>
                    <span className="text-amber-500 font-semibold font-mono">Displacement Detected</span>
                  </div>

                  {current.results.map((res) => (
                    <div
                      key={res.rank}
                      className={`p-3.5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${
                        res.name.includes('Dyvin')
                          ? isLight
                            ? 'bg-blue-50/70 border-blue-200 shadow-xs'
                            : 'bg-blue-950/20 border-blue-500/25 shadow-xs'
                          : isLight
                            ? 'bg-slate-50/60 border-slate-200'
                            : 'bg-[#0a0d13] border-white/[0.06]'
                      }`}
                    >
                      <div className="flex items-start sm:items-center gap-3">
                        <span className="font-mono font-bold text-xs text-slate-400">{res.rank}</span>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className={`font-semibold text-xs ${isLight ? 'text-slate-900' : 'text-white'}`}>
                              {res.name}
                            </span>
                            <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${res.roleStyle}`}>
                              {res.role}
                            </span>
                          </div>
                          <p className={`text-[11px] mt-0.5 ${isLight ? 'text-slate-500' : 'text-white/60'}`}>
                            {res.note}
                          </p>
                        </div>
                      </div>

                      <div className="sm:text-right shrink-0 font-mono text-[11px] text-slate-500 dark:text-white/60">
                        {res.metric}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Node 4: Integrated Dyvin Benchmark Telemetry Strip */}
              <div className={`mt-5 pt-4 border-t flex flex-wrap items-center justify-between gap-3 text-xs font-mono ${
                isLight ? 'border-slate-100 text-slate-600' : 'border-white/[0.06] text-white/70'
              }`}>
                <div className="flex items-center gap-4">
                  <span className="text-[10px] uppercase font-bold text-slate-400">DYVIN TELEMETRY:</span>
                  <div className="flex items-center gap-1">
                    <span className="text-slate-400">Visibility:</span>
                    <span className="font-bold text-brand">68.4%</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-slate-400">SoV:</span>
                    <span className="font-bold text-cyan-400">24.1%</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-slate-400">Gap:</span>
                    <span className="font-bold text-amber-500">−2.7 pts</span>
                  </div>
                </div>

                <span className={`px-2 py-0.5 rounded border text-[10px] uppercase font-bold tracking-wider ${
                  isLight ? 'bg-slate-100 border-slate-200 text-slate-500' : 'bg-white/5 border-white/10 text-white/40'
                }`}>
                  SAMPLE BENCHMARK
                </span>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
