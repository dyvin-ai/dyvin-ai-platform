import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Globe, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface ContactAuditSectionProps {
  onOpenAuth: (domain?: string) => void;
}

export const ContactAuditSection: React.FC<ContactAuditSectionProps> = ({ onOpenAuth }) => {
  const [domain, setDomain] = useState('');
  const [email, setEmail] = useState('');
  const [competitor, setCompetitor] = useState('');
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onOpenAuth(domain.trim() || undefined);
  };

  return (
    <section className={`py-24 sm:py-32 border-b select-none transition-colors ${
      isLight ? 'bg-slate-50/60 border-slate-200/80 text-slate-900' : 'bg-[#060709] border-white/5 text-white'
    }`}>
      <div className="max-w-4xl mx-auto px-6">
        
        {/* Container */}
        <div className={`p-8 sm:p-14 rounded-[32px] sm:rounded-[40px] border shadow-peec-shell ${
          isLight ? 'bg-white border-slate-200/90' : 'bg-[#080A0D] border-white/10'
        }`}>
          <div className="text-center max-w-xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-wider text-blue-500 mb-3">
              <Sparkles className="size-3.5" />
              <span>COMPREHENSIVE AUDIT INTAKE</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-black font-display uppercase tracking-tight">
              LET'S SEE WHAT <br />
              <span className="text-blue-500">AI SEES.</span>
            </h2>

            <p className={`mt-3 text-xs sm:text-sm font-sans ${isLight ? 'text-slate-500' : 'text-white/60'}`}>
              Input your brand domain to generate a complete multi-model visibility benchmark report.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 max-w-lg mx-auto">
            <div>
              <label className="block text-[11px] font-mono font-bold uppercase text-slate-400 mb-1">
                Your Brand Domain *
              </label>
              <div className="relative">
                <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="company.com"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border text-xs font-mono focus:outline-none transition-all ${
                    isLight
                      ? 'bg-slate-50 border-slate-200 focus:border-blue-500 focus:bg-white text-slate-900 placeholder:text-slate-400'
                      : 'bg-white/5 border-white/10 focus:border-blue-500 focus:bg-white/10 text-white placeholder:text-white/30'
                  }`}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-mono font-bold uppercase text-slate-400 mb-1">
                  Work Email *
                </label>
                <input
                  type="email"
                  required
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border text-xs font-mono focus:outline-none transition-all ${
                    isLight
                      ? 'bg-slate-50 border-slate-200 focus:border-blue-500 focus:bg-white text-slate-900 placeholder:text-slate-400'
                      : 'bg-white/5 border-white/10 focus:border-blue-500 focus:bg-white/10 text-white placeholder:text-white/30'
                  }`}
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono font-bold uppercase text-slate-400 mb-1">
                  Primary Competitor
                </label>
                <input
                  type="text"
                  placeholder="competitor.com"
                  value={competitor}
                  onChange={(e) => setCompetitor(e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border text-xs font-mono focus:outline-none transition-all ${
                    isLight
                      ? 'bg-slate-50 border-slate-200 focus:border-blue-500 focus:bg-white text-slate-900 placeholder:text-slate-400'
                      : 'bg-white/5 border-white/10 focus:border-blue-500 focus:bg-white/10 text-white placeholder:text-white/30'
                  }`}
                />
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className={`w-full py-4 rounded-xl font-bold text-xs uppercase tracking-wider font-mono text-center flex items-center justify-center gap-2 cursor-pointer shadow-md transition-transform active:scale-95 ${
                  isLight ? 'bg-slate-900 text-white hover:bg-slate-800' : 'bg-white text-black hover:bg-white/90'
                }`}
              >
                <span>Run Instant AI Visibility Audit</span>
                <ArrowRight className="size-4" />
              </button>
            </div>

            <div className="flex items-center justify-center gap-4 text-[10px] font-mono text-slate-400 pt-2">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="size-3 text-emerald-500" />
                No credit card required
              </span>
              <span>•</span>
              <span>Instant evaluation</span>
            </div>
          </form>
        </div>

      </div>
    </section>
  );
};
