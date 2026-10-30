import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, ArrowRight, Eye, Link2, Users, Cpu, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface LiveProductDemoProps {
  onOpenAuth: () => void;
}

export const LiveProductDemo: React.FC<LiveProductDemoProps> = ({ onOpenAuth }) => {
  const [selectedBrand, setSelectedBrand] = useState('Acme Enterprise');
  const [domainInput, setDomainInput] = useState('acme.com');
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const sources = [
    { rank: 1, name: 'Industry Publication (techcrunch.com)', auth: 94, citations: 142 },
    { rank: 2, name: 'Software Review Grid (g2.com)', auth: 89, citations: 114 },
    { rank: 3, name: 'Analyst Research (gartner.com)', auth: 95, citations: 261 },
    { rank: 4, name: 'Official Documentation (acme.com)', auth: 84, citations: 88 },
    { rank: 5, name: 'Developer Discussion (github.com)', auth: 91, citations: 72 },
  ];

  return (
    <section className={`py-24 sm:py-32 border-b select-none transition-colors ${
      isLight ? 'bg-slate-50/60 border-slate-200/80 text-slate-900' : 'bg-[#060709] border-white/5 text-white'
    }`}>
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-14">
          <div className="inline-flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-blue-500 mb-4">
            <span className="size-1.5 rounded-full bg-blue-500" />
            <span>LIVE INTERACTIVE ENVIRONMENT</span>
          </div>

          <h2 className="text-3xl sm:text-5xl md:text-6xl font-black font-display tracking-tight uppercase leading-[0.98]">
            THE LIVE DYVIN <br />
            <span className="text-blue-500">VISIBILITY DASHBOARD.</span>
          </h2>

          <p className={`mt-6 text-base sm:text-lg leading-[1.6] ${isLight ? 'text-slate-600' : 'text-white/70'}`}>
            Test how Dyvin computes real-time visibility scores, tracks LLM prompt coverage, and audits source influence in a simulated live workspace.
          </p>
        </div>

        {/* The Live Interactive Dashboard Container */}
        <div className={`rounded-[28px] sm:rounded-[36px] border p-6 sm:p-10 shadow-peec-shell ${
          isLight ? 'bg-white border-slate-200/90' : 'bg-[#080A0D] border-white/10'
        }`}>
          
          {/* Top Interactive Brand Switcher Bar */}
          <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 ${
            isLight ? 'bg-slate-50 border-slate-200' : 'bg-white/[0.02] border-white/5'
          }`}>
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono font-bold text-slate-400 uppercase">Simulated Workspace:</span>
              <div className="flex gap-2">
                {['Acme Enterprise', 'Vanguard AI', 'CloudScale'].map((b) => (
                  <button
                    key={b}
                    onClick={() => {
                      setSelectedBrand(b);
                      setDomainInput(`${b.toLowerCase().replace(' ', '')}.io`);
                    }}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      selectedBrand === b
                        ? isLight ? 'bg-slate-900 text-white shadow-xs' : 'bg-white text-black shadow-xs'
                        : isLight ? 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300' : 'bg-white/5 text-white/70 border border-white/10'
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-slate-400">Domain:</span>
              <span className={`font-mono text-xs font-bold px-2.5 py-1 rounded-lg border ${
                isLight ? 'text-blue-600 bg-white border-slate-200' : 'text-blue-400 bg-white/5 border-white/10'
              }`}>
                {domainInput}
              </span>
            </div>
          </div>

          {/* 4 Quantitative Score Counters */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pb-8 border-b border-slate-100 dark:border-white/5 font-mono">
            <div className={`p-4 rounded-2xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-white/[0.02] border-white/5'}`}>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">AI Visibility</span>
              <div className={`text-3xl font-black mt-1 tnum ${isLight ? 'text-slate-900' : 'text-white'}`}>86.4</div>
              <span className="text-[11px] text-emerald-500 font-bold">+18.7% 30d</span>
            </div>

            <div className={`p-4 rounded-2xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-white/[0.02] border-white/5'}`}>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Prompts Monitored</span>
              <div className={`text-3xl font-black mt-1 tnum ${isLight ? 'text-slate-900' : 'text-white'}`}>1,284</div>
              <span className="text-[11px] text-slate-400">18 query clusters</span>
            </div>

            <div className={`p-4 rounded-2xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-white/[0.02] border-white/5'}`}>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Tracked Citations</span>
              <div className={`text-3xl font-black mt-1 tnum ${isLight ? 'text-slate-900' : 'text-white'}`}>342</div>
              <span className="text-[11px] text-slate-400">148 root domains</span>
            </div>

            <div className={`p-4 rounded-2xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-white/[0.02] border-white/5'}`}>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Active AI Engines</span>
              <div className="text-3xl font-black text-blue-500 mt-1 tnum">4 / 4</div>
              <span className="text-[11px] text-emerald-500 font-bold">100% Synced</span>
            </div>
          </div>

          {/* Middle: Simulated Trend Graph & Top Sources Table */}
          <div className="pt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Col: Trend Visual Mock */}
            <div className="lg:col-span-6 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-display font-bold text-sm">30-Day Visibility Velocity</h4>
                <span className="text-xs font-mono text-emerald-600 font-bold bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-0.5 rounded-full">
                  ↑ Bullish Momentum
                </span>
              </div>

              <div className={`p-5 rounded-2xl border h-48 flex flex-col justify-between ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#0D1017] border-white/5'
              }`}>
                <div className="flex justify-between text-[10px] font-mono text-slate-400">
                  <span>90.0</span>
                  <span>Target: 95.0</span>
                </div>

                <div className="flex-1 flex items-end gap-2 pt-4">
                  {[45, 52, 58, 64, 61, 72, 78, 82, 86].map((val, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                      <div
                        className="w-full bg-blue-500 rounded-t-md hover:bg-blue-600 transition-all cursor-pointer"
                        style={{ height: `${val}%` }}
                      />
                    </div>
                  ))}
                </div>

                <div className="flex justify-between text-[10px] font-mono text-slate-400 pt-2 border-t border-slate-200/60 dark:border-white/5">
                  <span>Week 1</span>
                  <span>Week 2</span>
                  <span>Week 3</span>
                  <span>Current (86.4)</span>
                </div>
              </div>
            </div>

            {/* Right Col: Top AI Sources Table */}
            <div className="lg:col-span-6 space-y-4">
              <h4 className="font-display font-bold text-sm">Top Authority Sources Driving Visibility</h4>
              <div className="space-y-2">
                {sources.map((s) => (
                  <div
                    key={s.rank}
                    className={`p-2.5 rounded-xl border flex items-center justify-between gap-3 text-xs ${
                      isLight ? 'border-slate-200/80 bg-slate-50/50' : 'border-white/5 bg-white/[0.02]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <span className="font-mono font-bold text-blue-500 text-[11px]">{s.rank}.</span>
                      <span className="font-sans font-semibold truncate">{s.name}</span>
                    </div>
                    <div className="flex items-center gap-3 font-mono shrink-0">
                      <span className="text-[11px] text-slate-400">Auth: {s.auth}</span>
                      <span className={`text-xs font-bold tnum ${isLight ? 'text-slate-900' : 'text-white'}`}>{s.citations} URLs</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Bottom Action Ribbon */}
          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs font-mono text-slate-400">Full audit suite available for your domain.</span>
            <button
              onClick={onOpenAuth}
              className={`inline-flex items-center gap-2 rounded-xl text-xs font-bold uppercase tracking-wider px-5 py-3 shadow-xs active:scale-95 transition-all cursor-pointer font-mono ${
                isLight ? 'bg-slate-900 text-white' : 'bg-white text-black'
              }`}
            >
              <span>Audit Real Domain →</span>
            </button>
          </div>

        </div>

      </div>
    </section>
  );
};
