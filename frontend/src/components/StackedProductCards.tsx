import React, { useState } from 'react';
import { motion } from 'motion/react';
import { MessageSquare, Link2, Users, Sparkles, ArrowRight } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface StackedProductCardsProps {
  onOpenAuth: () => void;
}

export const StackedProductCards: React.FC<StackedProductCardsProps> = ({ onOpenAuth }) => {
  const [activeCard, setActiveCard] = useState<number>(0);
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const cards = [
    {
      num: '01',
      title: 'AI Answer Synthesis',
      tagline: 'How AI responds to your brand in buyer queries.',
      desc: 'Capture full conversational transcripts and recommendation rankings across ChatGPT, Claude, Gemini, and Perplexity.',
      stat: '98% Multi-Model Accuracy',
      icon: MessageSquare,
    },
    {
      num: '02',
      title: 'Citation Intelligence Graph',
      tagline: 'Which sources and publications influence AI.',
      desc: 'Trace the 148 root domains and analyst reports LLMs use to construct factual summaries about your company.',
      stat: '342 Citations Tracked',
      icon: Link2,
    },
    {
      num: '03',
      title: 'Competitor Share of Voice',
      tagline: 'Why competitors win recommendations.',
      desc: 'Compute real-time recommendation share and identify the exact citation deficits causing competitors to outrank you.',
      stat: '12 Competitors Indexed',
      icon: Users,
    },
    {
      num: '04',
      title: 'Dyvin Action Engine',
      tagline: 'Turn visibility signals into automated actions.',
      desc: 'Closed-loop workflows generate optimized content specs and case studies to capture high-authority review positions.',
      stat: '+18.7% Visibility Velocity',
      icon: Sparkles,
    },
  ];

  return (
    <section className={`py-24 sm:py-32 border-b select-none transition-colors ${
      isLight ? 'bg-white border-slate-200/80 text-slate-900' : 'bg-[#060709] border-white/5 text-white'
    }`}>
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-14">
          <div className="inline-flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-blue-500 mb-4">
            <span className="size-1.5 rounded-full bg-blue-500" />
            <span>THE VISIBILITY OPERATING SYSTEM</span>
          </div>

          <h2 className="text-3xl sm:text-5xl md:text-6xl font-black font-display tracking-tight uppercase leading-[0.98]">
            FOUR PILLARS OF <br />
            <span className="text-blue-500">AI PRESENCE INFRASTRUCTURE.</span>
          </h2>
        </div>

        {/* Stacked Interactive Cards Deck */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {cards.map((c, i) => (
            <div
              key={c.num}
              onClick={() => { setActiveCard(i); onOpenAuth(); }}
              className={`p-7 rounded-[28px] border transition-all cursor-pointer flex flex-col justify-between shadow-peec-card group ${
                activeCard === i
                  ? isLight
                    ? 'bg-white border-blue-500 ring-2 ring-blue-500/10'
                    : 'bg-[#0D1017] border-blue-500 ring-2 ring-blue-500/20'
                  : isLight
                    ? 'bg-slate-50/70 border-slate-200 hover:bg-white hover:border-slate-300'
                    : 'bg-white/[0.02] border-white/5 hover:bg-white/5 hover:border-white/10'
              }`}
            >
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-white/5 mb-6">
                  <span className="font-mono text-xs font-bold text-blue-500">PILLAR {c.num}</span>
                  <div className={`size-8 rounded-xl flex items-center justify-center transition-colors ${
                    isLight ? 'bg-slate-100 text-slate-700 group-hover:bg-blue-600 group-hover:text-white' : 'bg-white/5 text-white/80 group-hover:bg-blue-600'
                  }`}>
                    <c.icon className="size-4" />
                  </div>
                </div>

                <h3 className="font-display font-black text-lg leading-snug">
                  {c.title}
                </h3>
                <p className="text-xs font-semibold text-blue-500 mt-1 font-sans">
                  {c.tagline}
                </p>
                <p className="mt-4 text-xs text-slate-500 dark:text-white/60 leading-relaxed font-sans">
                  {c.desc}
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                <span className="font-mono text-[11px] font-bold">{c.stat}</span>
                <ArrowRight className="size-3.5 text-blue-500 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
