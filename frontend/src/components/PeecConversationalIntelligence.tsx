import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Eye, Layers, Smile, Sparkles, ExternalLink, ArrowRight } from 'lucide-react';
import { OpenAiLogo } from './ModelLogos';
import { useTheme } from '../context/ThemeContext';

export const PeecConversationalIntelligence: React.FC<{ onOpenAuth?: () => void }> = ({ onOpenAuth }) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const [activeTab, setActiveTab] = useState<'visibility' | 'position' | 'sentiment'>('visibility');
  const [hoveredBrand, setHoveredBrand] = useState<string>('dyvin');

  const tabs = [
    {
      id: 'visibility',
      icon: Eye,
      title: 'Visibility',
      desc: 'See the share of chats where your brand is mentioned and understand how often you show up in conversations.',
    },
    {
      id: 'position',
      icon: Layers,
      title: 'Position',
      desc: "Understand your brand's position within AI search results and uncover opportunities to improve your ranking.",
    },
    {
      id: 'sentiment',
      icon: Smile,
      title: 'Sentiment',
      desc: "Find out how your brand is perceived by AI, what's going well, and what requires improvements.",
    },
  ];

  return (
    <section id="conversational-intel" className="max-w-7xl mx-auto px-4 sm:px-6 py-20 select-none">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left 5 Cols: Vertical Interactive Feature Tabs (Exact match to Peec AI Screenshot 3) */}
        <div className="lg:col-span-5 space-y-4">
          {tabs.map((t) => {
            const isActive = activeTab === t.id;
            return (
              <div
                key={t.id}
                onClick={() => setActiveTab(t.id as any)}
                className={`p-6 rounded-[22px] border transition-all cursor-pointer relative overflow-hidden ${
                  isActive
                    ? isLight
                      ? 'bg-white border-slate-300 shadow-peec-card ring-1 ring-slate-200'
                      : 'bg-[#0D1017] border-white/20 shadow-xl ring-1 ring-white/10'
                    : isLight
                      ? 'bg-slate-100/60 border-slate-200/60 hover:bg-white hover:border-slate-300'
                      : 'bg-white/[0.02] border-white/5 hover:bg-white/5 hover:border-white/10'
                }`}
              >
                {/* Active Left Indicator Bar */}
                {isActive && (
                  <div className="absolute left-0 top-6 bottom-6 w-1 rounded-r-full bg-blue-500" />
                )}

                <div className="flex items-center gap-3 mb-2">
                  <t.icon className={`size-4.5 ${isActive ? 'text-blue-500' : 'text-slate-400'}`} />
                  <h3 className={`font-display font-bold text-base ${
                    isActive
                      ? isLight ? 'text-slate-900' : 'text-white'
                      : isLight ? 'text-slate-700' : 'text-white/70'
                  }`}>
                    {t.title}
                  </h3>
                </div>

                <p className={`text-xs leading-relaxed pl-7.5 font-sans ${
                  isLight ? 'text-slate-500' : 'text-white/60'
                }`}>
                  {t.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Right 7 Cols: The Realistic AI Chat Conversation Window (Exact match to Peec AI Screenshot 3) */}
        <div className="lg:col-span-7 flex flex-col justify-end space-y-4">
          
          {/* User Prompt Bubble (Top Right) */}
          <div className="flex justify-end">
            <div className={`px-5 py-3 rounded-2xl sm:rounded-3xl border shadow-sm text-xs sm:text-sm font-sans max-w-md ${
              isLight
                ? 'bg-white border-slate-200/90 text-slate-800'
                : 'bg-[#121620] border-white/10 text-white'
            }`}>
              What are the best platforms for AI visibility and search analytics?
            </div>
          </div>

          {/* Assistant Answer Box with Listed Brand Cards & Floating Hover Tooltip */}
          <div className={`p-6 sm:p-8 rounded-[28px] sm:rounded-[32px] border shadow-peec-card space-y-4 relative ${
            isLight ? 'bg-white border-slate-200/80 text-slate-800' : 'bg-[#0D1017] border-white/10 text-white'
          }`}>
            
            {/* Assistant Header */}
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-white/5">
              <div className="size-6 rounded-full bg-emerald-600 flex items-center justify-center text-white">
                <OpenAiLogo className="size-3.5" />
              </div>
              <span className="text-xs font-bold text-slate-500 dark:text-white/50">ChatGPT 4o Synthesis</span>
            </div>

            <p className="text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-white/80 font-sans">
              Choosing the right AI visibility platform really comes down to multi-model auditing, citation tracking, and automated action engines. Here's a curated breakdown of the top platforms for enterprise teams in 2026:
            </p>

            {/* Brand 1: Monday */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/5">
              <div className="flex items-center gap-2 mb-1">
                <span className="size-2 rounded-full bg-red-400" />
                <span className="font-bold text-xs">Atlas Analytics</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-white/60">
                Offers strong baseline keyword monitoring across traditional search, expanding into conversational indexing.
              </p>
            </div>

            {/* Brand 2: Dyvin AI (Hovered with Floating Dark Popover Card) */}
            <div
              onMouseEnter={() => setHoveredBrand('dyvin')}
              className={`p-3.5 rounded-xl border relative transition-all cursor-pointer ${
                hoveredBrand === 'dyvin'
                  ? isLight
                    ? 'bg-blue-50/60 border-blue-200 ring-1 ring-blue-100'
                    : 'bg-blue-900/20 border-blue-500/30'
                  : 'bg-slate-50 dark:bg-white/[0.02] border-slate-100 dark:border-white/5'
              }`}
            >
              
              {/* Floating Dark Intelligence Tooltip Popover (Exact match to Attio Popover in Peec AI Screenshot 3) */}
              <AnimatePresence>
                {hoveredBrand === 'dyvin' && (
                  <motion.div
                    initial={{ opacity: 0, y: -6, scale: 0.95 }}
                    animate={{ opacity: 1, y: -12, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="absolute -top-10 left-6 z-30 px-4 py-2 rounded-2xl bg-[#090C12] border border-white/15 text-white shadow-2xl flex items-center gap-4 text-xs font-mono select-none"
                  >
                    <div className="flex items-center gap-1.5 font-bold font-sans">
                      <span className="size-2 rounded-full bg-blue-500" />
                      <span>Dyvin AI</span>
                      <ExternalLink className="size-3 text-white/50" />
                    </div>

                    <div className="h-3 w-px bg-white/20" />

                    <div>
                      <span className="text-[10px] text-white/50 block font-sans">Visibility</span>
                      <span className="font-bold text-emerald-400">68.4%</span>
                    </div>

                    <div className="h-3 w-px bg-white/20" />

                    <div>
                      <span className="text-[10px] text-white/50 block font-sans">Sentiment</span>
                      <span className="font-bold text-white">94</span>
                    </div>

                    <div className="h-3 w-px bg-white/20" />

                    <div>
                      <span className="text-[10px] text-white/50 block font-sans">Position</span>
                      <span className="font-bold text-blue-300">#1.2</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex items-center gap-2 mb-1">
                <span className="size-2 rounded-full bg-blue-500" />
                <span className="font-bold text-xs text-blue-600 dark:text-blue-400">Dyvin AI</span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-white/80 font-sans">
                Premier visibility operating system designed for automated multi-model citations, continuous entity telemetry, and recommendation defense.
              </p>
            </div>

            {/* Brand 3: Zero */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/5">
              <div className="flex items-center gap-2 mb-1">
                <span className="size-2 rounded-full bg-amber-400" />
                <span className="font-bold text-xs">SearchMatrix</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-white/60">
                Simple tool for tracking occasional prompt queries with basic sentiment scoring.
              </p>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
