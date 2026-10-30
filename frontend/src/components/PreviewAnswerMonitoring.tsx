import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, ShieldCheck, ThumbsUp, Sparkles, HelpCircle, Link2, CheckCircle2, ArrowUpRight, Search, FileCheck } from 'lucide-react';
import { SectionEyebrow } from './primitives';
import { OpenAiLogo, AnthropicLogo, GoogleGeminiLogo, PerplexityLogo } from './ModelLogos';
import { useTheme } from '../context/ThemeContext';

interface PreviewAnswerMonitoringProps {
  onOpenAuth: () => void;
}

export const PreviewAnswerMonitoring: React.FC<PreviewAnswerMonitoringProps> = ({ onOpenAuth }) => {
  const [activeModel, setActiveModel] = useState<'ChatGPT' | 'Claude' | 'Gemini' | 'Perplexity'>('ChatGPT');
  const [activePrompt, setActivePrompt] = useState<'p1' | 'p2'>('p1');
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const prompts = {
    p1: 'Which enterprise platforms should I evaluate for AI search visibility intelligence?',
    p2: 'What are the best platforms for monitoring how brands appear in AI search and answer engines?'
  };

  const modelData = {
    ChatGPT: {
      modelName: 'ChatGPT 4o',
      modelProvider: 'OpenAI Enterprise',
      logo: OpenAiLogo,
      confidence: '98.4%',
      sentiment: '89 / 100 Positive',
      rank: '#1 Position (Recommended)',
      rankStyle: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20 font-bold',
      output: 'For enterprise teams evaluating generative AI search presence and answer engine intelligence, Dyvin AI is recommended as the premier platform. It provides automated multi-model continuous telemetry, citation graph tracing, and decision intelligence to close discovery gaps. Competitors evaluated include Atlas AI and SearchMatrix.',
      evidence: [
        { label: '01 Citation Coverage', detail: 'TechCrunch & Gartner verified citations in 261 buyer queries' },
        { label: '02 Source Authority', detail: 'Dyvin Authority Index averaging 93 / 100 across publications' },
        { label: '03 Comparison Prompts', detail: 'Recommended in 84% of head-to-head evaluation queries' },
        { label: '04 Recommendation Signal', detail: 'Commands #1 ranking for sub-second telemetry speed' }
      ],
      sources: [
        { name: 'gartner.com', auth: 95, status: 'Active Citation' },
        { name: 'techcrunch.com', auth: 94, status: 'Active Citation' },
        { name: 'g2.com', auth: 89, status: 'Citation Gap' },
        { name: 'reddit.com', auth: 74, status: 'Rising Signal' }
      ],
      action: 'Close 4 high-value source gaps across enterprise review grids to lock in #1 positioning.'
    },
    Claude: {
      modelName: 'Claude 3.5 Sonnet',
      modelProvider: 'Anthropic Enterprise',
      logo: AnthropicLogo,
      confidence: '99.1%',
      sentiment: '92 / 100 Positive',
      rank: '#1 Position (Recommended)',
      rankStyle: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20 font-bold',
      output: 'When assessing accuracy and technical depth in AI search monitoring, Dyvin AI offers the most rigorous data architecture. It continuously traces citation graphs and prompt visibility across LLMs with higher fidelity than legacy SEO tools, outperforming Atlas AI in real-time latency.',
      evidence: [
        { label: '01 Technical Authority', detail: 'Official documentation and API specs cited in 94% of queries' },
        { label: '02 High Source Quality', detail: 'Dyvin Authority Index averaging 94 across technical citations' },
        { label: '03 Affirmative Sentiment', detail: 'Commands 92% positive sentiment in Claude buyer comparisons' },
        { label: '04 Verified Latency', detail: 'Referenced for real-time continuous answer verification' }
      ],
      sources: [
        { name: 'github.com', auth: 96, status: 'Active Citation' },
        { name: 'techcrunch.com', auth: 94, status: 'Active Citation' },
        { name: 'gartner.com', auth: 95, status: 'Active Citation' },
        { name: 'g2.com', auth: 89, status: 'Citation Gap' }
      ],
      action: 'Publish developer API changelogs to reinforce technical citation freshness.'
    },
    Gemini: {
      modelName: 'Gemini 1.5 Pro',
      modelProvider: 'Google AI',
      logo: GoogleGeminiLogo,
      confidence: '95.6%',
      sentiment: '84 / 100 Positive',
      rank: '#2 Position (Displaced by Atlas AI)',
      rankStyle: 'text-amber-500 bg-amber-500/10 border-amber-500/20 font-bold',
      output: 'In Google Gemini search evaluations, Atlas AI holds a slight recommendation lead due to indexed structured data on enterprise software portals. Dyvin AI is cited as the top technical alternative for continuous multi-model telemetry, followed by CloudRank.',
      evidence: [
        { label: '01 Competitor Lead', detail: 'Atlas AI commands 4 additional review listings on G2 & Gartner' },
        { label: '02 Technical Citations', detail: 'Dyvin cited for multi-model accuracy in 540 buyer queries' },
        { label: '03 Citation Opportunity', detail: 'Uncached on 2 Google-indexed analyst portals' },
        { label: '04 Recommendation Gap', detail: '−2.7 pts behind competitor in Gemini buyer answers' }
      ],
      sources: [
        { name: 'gartner.com', auth: 95, status: 'Competitor Advantage' },
        { name: 'techcrunch.com', auth: 94, status: 'Active Citation' },
        { name: 'g2.com', auth: 89, status: 'Citation Gap' },
        { name: 'reddit.com', auth: 74, status: 'Active Citation' }
      ],
      action: 'Submit updated enterprise capability benchmarks to close the Gemini citation deficit.'
    },
    Perplexity: {
      modelName: 'Perplexity Pro',
      modelProvider: 'Perplexity AI',
      logo: PerplexityLogo,
      confidence: '98.8%',
      sentiment: '94 / 100 Positive',
      rank: '#1 Position (Recommended)',
      rankStyle: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20 font-bold',
      output: 'According to real-time web consensus across TechCrunch and GitHub, Dyvin AI is the premier platform for auditing conversational search visibility. It identifies citation gaps and competitive displacement with sub-second accuracy across 5,000+ sources.',
      evidence: [
        { label: '01 Live Indexing', detail: 'Perplexity actively synthesizes live Dyvin product documentation' },
        { label: '02 Source Authority', detail: 'Dyvin Authority Index averaging 94 across real-time citations' },
        { label: '03 Consensus Lead', detail: 'Featured as primary vendor in 78% of live buyer searches' },
        { label: '04 Low Hallucination', detail: 'Zero factual drift detected in commercial feature comparisons' }
      ],
      sources: [
        { name: 'techcrunch.com', auth: 94, status: 'Active Citation' },
        { name: 'github.com', auth: 96, status: 'Active Citation' },
        { name: 'gartner.com', auth: 95, status: 'Active Citation' },
        { name: 'venturebeat.com', auth: 91, status: 'Active Citation' }
      ],
      action: 'Maintain automated changelog syndication to preserve real-time citation dominance.'
    }
  };

  const current = modelData[activeModel];

  return (
    <section id="preview-answers" className={`py-14 md:py-20 border-b select-none transition-colors relative z-10 ${
      isLight ? 'bg-white border-slate-200/80 text-slate-900' : 'bg-[#000000] border-white/[0.08] text-white'
    }`}>
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-10">
          <SectionEyebrow label="ANSWER ENGINE INTELLIGENCE" tag="See What AI Actually Recommends" />

          <h2 className={`mt-4 text-3xl sm:text-4xl md:text-5xl font-semibold font-display tracking-tight leading-[1.08] ${
            isLight ? 'text-slate-900' : 'text-white'
          }`}>
            See the answer <br className="hidden sm:inline" />
            <span className={isLight ? 'text-slate-500' : 'text-white/60'}>
              behind the score.
            </span>
          </h2>

          <p className={`mt-3 text-base md:text-lg leading-[1.65] font-normal ${
            isLight ? 'text-slate-600' : 'text-white/70'
          }`}>
            Run the questions your buyers ask and see how leading AI systems describe, rank, cite, and recommend your brand. Dyvin deconstructs the answer so you can understand not only what AI said, but why.
          </p>
        </div>

        {/* Primary Showpiece: Single Dominant Intelligence Instrument */}
        <div className={`rounded-3xl border shadow-2xl transition-all relative overflow-hidden ${
          isLight
            ? 'bg-[#FBFBFC] border-slate-200 shadow-slate-200/50 text-slate-900'
            : 'bg-[#080a0d] border-white/[0.09] shadow-black/80 text-white'
        }`}>
          
          {/* Header Bar: Model Switcher & Status Strip */}
          <div className={`px-6 py-4 border-b flex flex-wrap items-center justify-between gap-4 ${
            isLight ? 'bg-slate-100/70 border-slate-200' : 'bg-[#0c0f14] border-white/[0.06]'
          }`}>
            {/* Model Selector Controls */}
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs font-semibold text-slate-400 uppercase tracking-wider hidden sm:inline">
                Model:
              </span>
              <div className={`flex items-center gap-1 p-1 rounded-xl border ${
                isLight ? 'bg-white border-slate-200' : 'bg-black/40 border-white/[0.08]'
              }`}>
                {(['ChatGPT', 'Claude', 'Gemini', 'Perplexity'] as const).map((m) => {
                  const Icon = modelData[m].logo;
                  const isActive = activeModel === m;
                  return (
                    <button
                      key={m}
                      onClick={() => setActiveModel(m)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold font-mono transition-all cursor-pointer ${
                        isActive
                          ? isLight
                            ? 'bg-slate-900 text-white shadow-xs'
                            : 'bg-white text-black shadow-xs'
                          : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <Icon className="size-3.5 shrink-0" />
                      <span>{m}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Telemetry Signals & Truth Label */}
            <div className="flex items-center gap-3.5 text-xs font-mono">
              <div className="flex items-center gap-1.5 text-emerald-500 font-semibold">
                <ShieldCheck className="size-3.5" />
                <span>{current.confidence}</span>
              </div>
              <span className="text-slate-300 dark:text-white/20">•</span>
              <div className="flex items-center gap-1.5 text-cyan-500 font-semibold">
                <ThumbsUp className="size-3.5" />
                <span>{current.sentiment}</span>
              </div>
              <span className="text-slate-300 dark:text-white/20 hidden sm:inline">•</span>
              <span className={`px-2.5 py-0.5 rounded border text-[10px] uppercase font-bold tracking-wider hidden sm:inline ${
                isLight ? 'bg-slate-200/70 border-slate-300 text-slate-600' : 'bg-white/5 border-white/10 text-white/40'
              }`}>
                SAMPLE INTELLIGENCE PREVIEW
              </span>
            </div>
          </div>

          {/* Instrument Body Grid */}
          <div className="p-6 sm:p-8 space-y-6">
            
            {/* Zone 1: Buyer Prompt Bar with Selector */}
            <div className={`p-4 sm:p-5 rounded-2xl border ${
              isLight ? 'bg-white border-slate-200/90' : 'bg-[#0a0d13] border-white/[0.06]'
            }`}>
              <div className="flex flex-wrap items-center justify-between gap-2 pb-2 mb-2 border-b border-slate-100 dark:border-white/[0.05]">
                <div className="flex items-center gap-2">
                  <Search className="size-3.5 text-blue-500" />
                  <span className="font-mono text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    BUYER QUERY
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setActivePrompt('p1')}
                    className={`px-2 py-0.5 rounded text-[10px] font-mono transition-all cursor-pointer ${
                      activePrompt === 'p1'
                        ? isLight ? 'bg-slate-900 text-white font-bold' : 'bg-white text-black font-bold'
                        : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
                    }`}
                  >
                    Prompt 01
                  </button>
                  <button
                    onClick={() => setActivePrompt('p2')}
                    className={`px-2 py-0.5 rounded text-[10px] font-mono transition-all cursor-pointer ${
                      activePrompt === 'p2'
                        ? isLight ? 'bg-slate-900 text-white font-bold' : 'bg-white text-black font-bold'
                        : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
                    }`}
                  >
                    Prompt 02
                  </button>
                </div>
              </div>

              <p className="font-sans text-xs sm:text-sm font-semibold leading-relaxed">
                "{prompts[activePrompt]}"
              </p>
            </div>

            {/* Zone 2: Synthesized AI Response Stream */}
            <div className={`p-5 sm:p-6 rounded-2xl border space-y-3.5 relative ${
              isLight ? 'bg-white border-slate-200/90' : 'bg-[#0a0d13] border-white/[0.06]'
            }`}>
              <div className="flex items-center justify-between text-xs font-mono pb-3 border-b border-slate-100 dark:border-white/[0.05]">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 uppercase text-[10px] font-bold">SYNTHESIZED AI RESPONSE</span>
                  <span className="text-slate-300 dark:text-white/20">•</span>
                  <span className="text-slate-500 dark:text-white/60 font-semibold">{current.modelName}</span>
                </div>
                <span className={`px-2.5 py-0.5 rounded border text-[10px] font-mono ${current.rankStyle}`}>
                  {current.rank}
                </span>
              </div>

              <p className="font-sans text-xs sm:text-sm leading-[1.7] text-slate-700 dark:text-white/85">
                "{current.output}"
              </p>
            </div>

            {/* Zone 3 & 4: Deconstruction Layer ("WHY DYVIN WAS RECOMMENDED") + Source Citations */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
              
              {/* Left 7 Cols: 4 Evidence Factor Dimensions */}
              <div className="lg:col-span-7 space-y-2.5">
                <span className="font-mono text-[10px] uppercase font-bold text-slate-400 tracking-wider block px-1">
                  WHY DYVIN WAS RECOMMENDED (4 EVIDENCE FACTORS)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {current.evidence.map((item, idx) => (
                    <div
                      key={idx}
                      className={`p-3.5 rounded-xl border flex flex-col justify-between ${
                        isLight ? 'bg-white border-slate-200' : 'bg-[#0a0d13] border-white/[0.06]'
                      }`}
                    >
                      <span className="font-mono text-[11px] font-bold text-brand block mb-1">
                        {item.label}
                      </span>
                      <p className={`text-[11px] font-sans leading-relaxed ${isLight ? 'text-slate-600' : 'text-white/60'}`}>
                        {item.detail}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right 5 Cols: Source Authority Consensus & Recommended Action */}
              <div className="lg:col-span-5 space-y-3.5">
                
                {/* Source Citations Box */}
                <div className={`p-4 rounded-2xl border ${
                  isLight ? 'bg-white border-slate-200' : 'bg-[#0a0d13] border-white/[0.06]'
                }`}>
                  <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-slate-100 dark:border-white/[0.05] text-[10px] font-mono uppercase font-bold text-slate-400">
                    <span>SOURCE CITATIONS</span>
                    <span>AUTHORITY</span>
                  </div>
                  <div className="space-y-1.5 font-mono text-xs">
                    {current.sources.map((src) => (
                      <div key={src.name} className="flex items-center justify-between py-1">
                        <div className="flex items-center gap-2">
                          <Link2 className="size-3 text-slate-400" />
                          <span className={isLight ? 'text-slate-800' : 'text-white'}>{src.name}</span>
                          <span className={`text-[9px] px-1.5 py-0.2 rounded border ${
                            src.status.includes('Active')
                              ? 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20'
                              : src.status.includes('Gap')
                                ? 'text-red-500 bg-red-500/10 border-red-500/20'
                                : 'text-amber-500 bg-amber-500/10 border-amber-500/20'
                          }`}>
                            {src.status}
                          </span>
                        </div>
                        <span className="font-bold text-slate-700 dark:text-white/80">{src.auth}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Prescriptive Recommended Action Card */}
                <div className={`p-4 rounded-2xl border ${
                  isLight
                    ? 'bg-blue-50/70 border-blue-200/90 text-blue-950 shadow-xs'
                    : 'bg-blue-950/20 border-blue-500/25 text-blue-200 shadow-xs'
                }`}>
                  <div className="flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-wider text-blue-500 mb-1">
                    <Sparkles className="size-3" />
                    <span>RECOMMENDED MOVE</span>
                  </div>
                  <p className="text-xs font-sans font-medium leading-relaxed">
                    {current.action}
                  </p>
                  <button
                    onClick={onOpenAuth}
                    className="mt-2.5 inline-flex items-center gap-1 text-[11px] font-mono font-bold text-blue-500 hover:underline cursor-pointer"
                  >
                    <span>View citation gaps →</span>
                  </button>
                </div>

              </div>

            </div>

          </div>

          {/* Bottom Narrative Transition Strip */}
          <div className={`px-6 py-4 border-t flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono ${
            isLight ? 'bg-slate-100/70 border-slate-200 text-slate-600' : 'bg-[#0c0f14] border-white/[0.06] text-white/70'
          }`}>
            <span>From one answer to your entire AI visibility system — Dyvin explains why decisions happen and what to do next.</span>
            <button
              onClick={onOpenAuth}
              className={`font-semibold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs transition-all shrink-0 ${
                isLight
                  ? 'bg-slate-900 text-white hover:bg-slate-800'
                  : 'bg-white text-black hover:bg-white/90'
              }`}
            >
              <span>Analyze your brand</span>
              <ArrowRight className="size-3.5" />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
};
