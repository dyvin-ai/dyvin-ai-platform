import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Check, Plus, Download, Sparkles, Database, ArrowRight, ShieldCheck } from 'lucide-react';
import {
  OpenAiLogo,
  GoogleGeminiLogo,
  AnthropicLogo,
  PerplexityLogo,
  CopilotLogo,
  GrokLogo
} from './ModelLogos';
import { useTheme } from '../context/ThemeContext';

export const PeecFeatureBento: React.FC<{ onOpenAuth?: () => void }> = ({ onOpenAuth }) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const [selectedModels, setSelectedModels] = useState<string[]>(['chatgpt', 'google', 'claude', 'perplexity']);

  const toggleModel = (id: string) => {
    setSelectedModels((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  };

  const modelList = [
    { id: 'chatgpt', name: 'ChatGPT 4o', Logo: OpenAiLogo },
    { id: 'google', name: 'AI Overviews & Gemini', Logo: GoogleGeminiLogo },
    { id: 'claude', name: 'Claude 3.5 Sonnet', Logo: AnthropicLogo },
    { id: 'perplexity', name: 'Perplexity Pro', Logo: PerplexityLogo },
    { id: 'grok', name: 'Grok 2', Logo: GrokLogo },
    { id: 'copilot', name: 'Microsoft Copilot', Logo: CopilotLogo },
  ];

  return (
    <section id="feature-bento" className="max-w-7xl mx-auto px-4 sm:px-6 py-20 select-none">
      
      {/* 2x2 Bento Grid (Exact match to Peec AI Screenshot 4) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Card 1: Add Brands (Peec AI Screenshot 4 Match) */}
        <div className={`p-8 rounded-[28px] sm:rounded-[34px] border shadow-peec-card flex flex-col justify-between relative overflow-hidden ${
          isLight ? 'bg-white border-slate-200/80' : 'bg-[#0D1017] border-white/5'
        }`}>
          <div>
            <h3 className="font-display font-bold text-xl sm:text-2xl tracking-tight">
              Add Brands
            </h3>
            <p className={`mt-2 text-xs sm:text-sm font-sans leading-relaxed ${
              isLight ? 'text-slate-500' : 'text-white/60'
            }`}>
              See how you rank against the players that matter in your market.
            </p>
          </div>

          {/* Floating UI Widget for Brands (Screenshot 4 Match) */}
          <div className="py-8 flex flex-col items-center justify-center gap-3 relative">
            
            {/* Floating Card 1: Monday */}
            <div className={`w-full max-w-sm p-4 rounded-2xl border shadow-sm flex items-center justify-between transition-transform hover:-translate-y-0.5 ${
              isLight ? 'bg-slate-50/80 border-slate-200/80' : 'bg-white/[0.03] border-white/10'
            }`}>
              <div className="flex items-center gap-2.5">
                <span className="size-3 rounded-full bg-red-400" />
                <span className="font-bold text-xs">Atlas AI <span className="font-normal text-slate-400">+3</span></span>
              </div>
              <span className="px-3 py-1 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-black text-[11px] font-bold flex items-center gap-1 cursor-pointer">
                <Plus className="size-3" />
                Start Tracking
              </span>
            </div>

            {/* Floating Card 2: Pipedrive / Dyvin AI */}
            <div className={`w-full max-w-sm p-4 rounded-2xl border shadow-md flex items-center justify-between transition-transform hover:-translate-y-0.5 ${
              isLight ? 'bg-blue-50/80 border-blue-200/80' : 'bg-blue-950/30 border-blue-500/30'
            }`}>
              <div className="flex items-center gap-2.5">
                <span className="size-3 rounded-full bg-blue-500" />
                <span className="font-bold text-xs text-blue-600 dark:text-blue-400">Dyvin AI <span className="font-normal text-slate-400">+2</span></span>
              </div>
              <span className="px-3 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 text-[11px] font-bold flex items-center gap-1">
                <Check className="size-3" />
                Actively Tracking
              </span>
            </div>

          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Competitive Matrix</span>
            <button onClick={onOpenAuth} className="text-blue-500 font-bold hover:underline cursor-pointer">
              Add Your Competitors →
            </button>
          </div>
        </div>

        {/* Card 2: Choose AI Models (Peec AI Screenshot 4 Match) */}
        <div className={`p-8 rounded-[28px] sm:rounded-[34px] border shadow-peec-card flex flex-col justify-between relative overflow-hidden ${
          isLight ? 'bg-white border-slate-200/80' : 'bg-[#0D1017] border-white/5'
        }`}>
          <div>
            <h3 className="font-display font-bold text-xl sm:text-2xl tracking-tight">
              Choose AI Models
            </h3>
            <p className={`mt-2 text-xs sm:text-sm font-sans leading-relaxed ${
              isLight ? 'text-slate-500' : 'text-white/60'
            }`}>
              Track rankings across the models that drive the most traffic and visibility.
            </p>
          </div>

          {/* Interactive Checklist & Live Recent Chats (Screenshot 4 Match) */}
          <div className="py-6 grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
            
            {/* Left 6 Cols: Models Checklist */}
            <div className={`sm:col-span-6 p-4 rounded-2xl border ${
              isLight ? 'bg-slate-50/70 border-slate-200/70' : 'bg-white/[0.02] border-white/5'
            }`}>
              <div className="flex items-center justify-between pb-2 border-b border-slate-200/50 dark:border-white/5 mb-2 text-[10px] font-mono text-slate-400">
                <span>Models</span>
                <span>Daily ▾</span>
              </div>

              <div className="space-y-2 text-xs">
                {modelList.map((m) => {
                  const isChecked = selectedModels.includes(m.id);
                  return (
                    <div
                      key={m.id}
                      onClick={() => toggleModel(m.id)}
                      className="flex items-center justify-between cursor-pointer hover:opacity-80"
                    >
                      <div className="flex items-center gap-2">
                        <div className={`size-4 rounded flex items-center justify-center border transition-colors ${
                          isChecked ? 'bg-blue-500 border-blue-500 text-white' : 'border-slate-300 dark:border-white/20'
                        }`}>
                          {isChecked && <Check className="size-3 stroke-[3]" />}
                        </div>
                        <span className="text-[11px] font-medium">{m.name}</span>
                      </div>
                      <m.Logo className="size-3.5 opacity-60" />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right 6 Cols: Recent Chats Mini Feed */}
            <div className={`sm:col-span-6 p-4 rounded-2xl border space-y-2.5 ${
              isLight ? 'bg-slate-50/70 border-slate-200/70' : 'bg-white/[0.02] border-white/5'
            }`}>
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pb-1 border-b border-slate-200/50 dark:border-white/5">
                <span>Recent Chats</span>
                <span className="flex items-center gap-1 cursor-pointer hover:underline">
                  <Download className="size-2.5" />
                  Export
                </span>
              </div>

              <div className="p-2 rounded-xl bg-white dark:bg-[#121620] border border-slate-200/60 dark:border-white/5 text-[10px] space-y-1 shadow-2xs">
                <p className="font-medium text-slate-700 dark:text-white/90 line-clamp-1">
                  "What's the best platform for AI presence?"
                </p>
                <div className="flex items-center justify-between text-slate-400 font-mono">
                  <span className="text-blue-500 font-bold">#1 Position</span>
                  <span>1d ago</span>
                </div>
              </div>

              <div className="p-2 rounded-xl bg-white dark:bg-[#121620] border border-slate-200/60 dark:border-white/5 text-[10px] space-y-1 shadow-2xs">
                <p className="font-medium text-slate-700 dark:text-white/90 line-clamp-1">
                  "Which tools audit ChatGPT citations?"
                </p>
                <div className="flex items-center justify-between text-slate-400 font-mono">
                  <span className="text-emerald-500 font-bold">88% Coverage</span>
                  <span>2d ago</span>
                </div>
              </div>
            </div>

          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-xs font-mono text-slate-400">
            <span>6/6 AI Engines Tracked</span>
            <span className="text-emerald-500 font-bold">Live Telemetry</span>
          </div>
        </div>

        {/* Card 3: Find Key Sources */}
        <div className={`p-8 rounded-[28px] sm:rounded-[34px] border shadow-peec-card flex flex-col justify-between relative overflow-hidden ${
          isLight ? 'bg-white border-slate-200/80' : 'bg-[#0D1017] border-white/5'
        }`}>
          <div>
            <h3 className="font-display font-bold text-xl sm:text-2xl tracking-tight">
              Find Key Sources
            </h3>
            <p className={`mt-2 text-xs sm:text-sm font-sans leading-relaxed ${
              isLight ? 'text-slate-500' : 'text-white/60'
            }`}>
              Spot the citations and root domains shaping your brand's presence across AI answers.
            </p>
          </div>

          {/* Sources List Visual */}
          <div className="py-6 space-y-2">
            {[
              { domain: 'gartner.com', type: 'Analyst Research', auth: '95 Auth', share: '58%' },
              { domain: 'techcrunch.com', type: 'Editorial', auth: '94 Auth', share: '43%' },
              { domain: 'g2.com', type: 'Reviews', auth: '89 Auth', share: '39%' },
            ].map((s) => (
              <div
                key={s.domain}
                className={`p-3 rounded-xl border flex items-center justify-between text-xs ${
                  isLight ? 'bg-slate-50/70 border-slate-200/70' : 'bg-white/[0.02] border-white/5'
                }`}
              >
                <div>
                  <span className="font-semibold text-slate-800 dark:text-white block">{s.domain}</span>
                  <span className="text-[10px] text-slate-400">{s.type}</span>
                </div>
                <div className="text-right font-mono">
                  <span className="font-bold text-blue-500 block">{s.auth}</span>
                  <span className="text-[10px] text-slate-400">{s.share} share</span>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-xs font-mono text-slate-400">
            <span>148 Tracked Root Domains</span>
            <button onClick={onOpenAuth} className="text-blue-500 font-bold hover:underline cursor-pointer">
              Inspect Citation Graph →
            </button>
          </div>
        </div>

        {/* Card 4: Act on Insights */}
        <div className={`p-8 rounded-[28px] sm:rounded-[34px] border shadow-peec-card flex flex-col justify-between relative overflow-hidden ${
          isLight ? 'bg-white border-slate-200/80' : 'bg-[#0D1017] border-white/5'
        }`}>
          <div>
            <h3 className="font-display font-bold text-xl sm:text-2xl tracking-tight">
              Act on Insights
            </h3>
            <p className={`mt-2 text-xs sm:text-sm font-sans leading-relaxed ${
              isLight ? 'text-slate-500' : 'text-white/60'
            }`}>
              Use automated recommendations to capture high-value queries and close competitor gaps.
            </p>
          </div>

          {/* Action Directives Visual */}
          <div className="py-6 space-y-2.5 text-xs">
            <div className={`p-3.5 rounded-xl border ${
              isLight ? 'bg-emerald-50/60 border-emerald-200/80 text-emerald-900' : 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300'
            }`}>
              <div className="flex items-center gap-2 font-bold mb-1">
                <Sparkles className="size-3.5" />
                <span>Publish 2026 Enterprise Security Whitepaper</span>
              </div>
              <p className="text-[11px] opacity-80 font-sans">
                Projected +14% recommendation jump on SOC2 comparison queries.
              </p>
            </div>

            <div className={`p-3.5 rounded-xl border ${
              isLight ? 'bg-blue-50/60 border-blue-200/80 text-blue-900' : 'bg-blue-950/30 border-blue-500/30 text-blue-300'
            }`}>
              <div className="flex items-center gap-2 font-bold mb-1">
                <ShieldCheck className="size-3.5" />
                <span>Claim G2 & Capterra Alternative Listings</span>
              </div>
              <p className="text-[11px] opacity-80 font-sans">
                Fills the 4 missing citation nodes currently held by Atlas AI.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Automated Action Engine</span>
            <button onClick={onOpenAuth} className="text-blue-500 font-bold hover:underline cursor-pointer">
              Deploy Directives →
            </button>
          </div>
        </div>

      </div>

    </section>
  );
};
