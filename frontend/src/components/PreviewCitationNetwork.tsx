import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Link2, ArrowRight, ShieldCheck, Database, FileText, Globe, MessageSquare, Layers } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface PreviewCitationNetworkProps {
  onOpenAuth: () => void;
}

export const PreviewCitationNetwork: React.FC<PreviewCitationNetworkProps> = ({ onOpenAuth }) => {
  const [activeNode, setActiveNode] = useState<string>('tech');
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const sources = [
    {
      id: 'gartner',
      name: 'Analyst Research (Gartner)',
      authority: 92,
      mentions: 54,
      citations: 48,
      assoc: 22,
      impact: 'Drives 42% of enterprise shortlists in LLM answers.',
      icon: Database
    },
    {
      id: 'tech',
      name: 'Tech Publication (TechCrunch)',
      authority: 87,
      mentions: 42,
      citations: 31,
      assoc: 18,
      impact: 'Validates product innovation & technical capability claims.',
      icon: FileText
    },
    {
      id: 'g2',
      name: 'Software Reviews (G2 / Capterra)',
      authority: 79,
      mentions: 68,
      citations: 52,
      assoc: 34,
      impact: 'Establishes feature comparison matrix rankings in AI synthesis.',
      icon: Layers
    },
    {
      id: 'site',
      name: 'Official Docs (dyvin.ai)',
      authority: 74,
      mentions: 89,
      citations: 76,
      assoc: 0,
      impact: 'Primary ground truth source for pricing and technical specs.',
      icon: Globe
    },
    {
      id: 'reddit',
      name: 'Community (Reddit / Hacker News)',
      authority: 61,
      mentions: 36,
      citations: 19,
      assoc: 28,
      impact: 'Shapes sentiment, reliability scores, and informal feedback.',
      icon: MessageSquare
    },
  ];

  const currentSource = sources.find((s) => s.id === activeNode) || sources[0];

  return (
    <section className={`py-24 sm:py-32 border-b select-none transition-colors ${
      isLight ? 'bg-white border-slate-200/80 text-slate-900' : 'bg-[#060709] border-white/5 text-white'
    }`}>
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-14">
          <div className="inline-flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-blue-500 mb-4">
            <span className="size-1.5 rounded-full bg-blue-500" />
            <span>PREVIEW 03 — CITATION INTELLIGENCE</span>
          </div>

          <h2 className="text-3xl sm:text-5xl md:text-6xl font-black font-display tracking-tight uppercase leading-[0.98]">
            KNOW WHAT <br />
            <span className="text-blue-500">AI TRUSTS.</span>
          </h2>

          <p className={`mt-6 text-base sm:text-lg leading-[1.6] ${isLight ? 'text-slate-600' : 'text-white/70'}`}>
            AI answer engines do not count backlinks. They synthesize knowledge from authoritative consensus graphs. Dyvin maps the exact publications, directories, and research shaping your AI reputation.
          </p>
        </div>

        {/* Interactive Citation Graph Canvas */}
        <div className={`rounded-[28px] sm:rounded-[36px] border p-6 sm:p-10 shadow-peec-shell ${
          isLight ? 'bg-slate-50/60 border-slate-200/80' : 'bg-[#080A0D] border-white/10'
        }`}>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Col: Interactive Node Selector */}
            <div className="lg:col-span-6 space-y-3">
              <span className="text-[10px] font-mono font-bold uppercase text-slate-400 block mb-2">
                Select Source Node to Inspect Influence
              </span>

              {sources.map((src) => (
                <div
                  key={src.id}
                  onClick={() => setActiveNode(src.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                    activeNode === src.id
                      ? isLight ? 'bg-white border-blue-500 shadow-sm ring-2 ring-blue-500/10' : 'bg-[#121620] border-blue-500 shadow-lg ring-2 ring-blue-500/20'
                      : isLight ? 'bg-white/80 border-slate-200/80 hover:bg-white hover:border-slate-300' : 'bg-white/[0.02] border-white/5 hover:border-white/10'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`size-8 rounded-xl flex items-center justify-center ${
                      activeNode === src.id ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-white/70'
                    }`}>
                      <src.icon className="size-4" />
                    </div>
                    <div>
                      <span className={`text-xs font-bold block ${isLight ? 'text-slate-900' : 'text-white'}`}>{src.name}</span>
                      <span className="text-[11px] font-mono text-slate-500 dark:text-white/60">{src.citations} Verified Citations</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] font-mono text-slate-400 block">Authority</span>
                    <span className="font-mono text-sm font-bold text-blue-500 tnum">{src.authority} / 100</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Right Col: Deep Node Intelligence Inspector */}
            <div className={`lg:col-span-6 rounded-[24px] p-7 border shadow-sm flex flex-col justify-between h-full space-y-6 ${
              isLight ? 'bg-white border-slate-200' : 'bg-[#0D1017] border-white/10'
            }`}>
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-white/5">
                  <div className="flex items-center gap-2">
                    <Link2 className="size-4 text-blue-500" />
                    <span className="text-xs font-bold font-display">Source Influence Metrics</span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-600 font-bold bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-0.5 rounded-full">
                    Active Authority Node
                  </span>
                </div>

                <h3 className="text-lg font-bold mt-4 font-display">
                  {currentSource.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-white/60 mt-1 leading-relaxed font-sans">
                  {currentSource.impact}
                </p>

                {/* 4 Quantitative Breakdown Cells */}
                <div className="mt-6 grid grid-cols-2 gap-3 font-mono text-xs">
                  <div className={`p-3.5 rounded-2xl border ${
                    isLight ? 'bg-slate-50 border-slate-200/80' : 'bg-white/[0.02] border-white/5'
                  }`}>
                    <span className="text-[10px] text-slate-400 uppercase block">AI Influence Score</span>
                    <span className="text-xl font-bold text-blue-500 tnum">{currentSource.authority} / 100</span>
                  </div>

                  <div className={`p-3.5 rounded-2xl border ${
                    isLight ? 'bg-slate-50 border-slate-200/80' : 'bg-white/[0.02] border-white/5'
                  }`}>
                    <span className="text-[10px] text-slate-400 uppercase block">Mention Frequency</span>
                    <span className={`text-xl font-bold tnum ${isLight ? 'text-slate-900' : 'text-white'}`}>{currentSource.mentions} prompts</span>
                  </div>

                  <div className={`p-3.5 rounded-2xl border ${
                    isLight ? 'bg-slate-50 border-slate-200/80' : 'bg-white/[0.02] border-white/5'
                  }`}>
                    <span className="text-[10px] text-slate-400 uppercase block">Citation Frequency</span>
                    <span className={`text-xl font-bold tnum ${isLight ? 'text-slate-900' : 'text-white'}`}>{currentSource.citations} URLs</span>
                  </div>

                  <div className={`p-3.5 rounded-2xl border ${
                    isLight ? 'bg-slate-50 border-slate-200/80' : 'bg-white/[0.02] border-white/5'
                  }`}>
                    <span className="text-[10px] text-slate-400 uppercase block">Competitor Co-Citation</span>
                    <span className="text-xl font-bold text-amber-500 tnum">{currentSource.assoc}% overlap</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                <span className="text-xs font-mono text-slate-400">Citation Graph: 148 root domains</span>
                <button
                  onClick={onOpenAuth}
                  className="text-xs font-bold text-blue-500 hover:underline flex items-center gap-1 cursor-pointer uppercase tracking-wider"
                >
                  <span>Explore Network Graph</span>
                  <ArrowRight className="size-3.5" />
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
