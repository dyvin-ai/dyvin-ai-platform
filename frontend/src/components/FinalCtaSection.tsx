import React from 'react';
import { motion } from 'motion/react';
import { SectionEyebrow } from './primitives';
import { ArrowRight, Sparkles, CheckCircle2, ShieldCheck, Activity } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface FinalCtaSectionProps {
  onOpenAuth?: (domain?: string, mode?: 'signup' | 'login' | 'forgot') => void;
}

export const FinalCtaSection: React.FC<FinalCtaSectionProps> = ({ onOpenAuth }) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  return (
    <section id="final-cta" className={`py-16 md:py-24 border-b select-none transition-colors relative z-10 ${
      isLight ? 'bg-white border-slate-200/80 text-slate-900' : 'bg-[#000000] border-white/[0.08] text-white'
    }`}>
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Dominant Apple-Glass Final Conversion Surface */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className={`relative overflow-hidden rounded-3xl p-8 sm:p-12 md:p-16 text-center border shadow-2xl transition-all ${
            isLight
              ? 'bg-[#FBFBFC] border-slate-200 shadow-slate-200/50'
              : 'bg-[#080a0d] border-white/[0.09] shadow-black/80'
          }`}
        >
          {/* Subtle Ambient Radial Illumination */}
          <div
            className={`absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] pointer-events-none transition-opacity ${
              isLight ? 'opacity-15' : 'opacity-20'
            }`}
            style={{
              background: 'radial-gradient(ellipse at 50% 0%, rgba(37,99,235,0.4), transparent 70%)'
            }}
          />

          <div className="relative z-10 max-w-3xl mx-auto space-y-6">
            
            {/* Restrained Eyebrow */}
            <div className="flex justify-center">
              <SectionEyebrow label="READY TO SEE YOUR AI PRESENCE?" tag="Final Analysis" />
            </div>

            {/* Commanding Final Headline */}
            <h2 className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight leading-[1.06] font-display ${
              isLight ? 'text-slate-900' : 'text-white'
            }`}>
              AI is already shaping how buyers discover your category. <br className="hidden sm:inline" />
              <span className={isLight ? 'text-slate-500' : 'text-white/60'}>
                Make sure your brand is the one AI recommends.
              </span>
            </h2>

            {/* Concise Supporting Copy */}
            <p className={`max-w-xl mx-auto text-sm sm:text-base leading-[1.65] font-normal ${
              isLight ? 'text-slate-600' : 'text-white/70'
            }`}>
              Audit your presence across major generative engines, identify citation gaps, and understand where competitors are winning.
            </p>

            {/* CTA Button Progression */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              <button
                onClick={() => onOpenAuth?.(undefined, 'signup')}
                className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl font-semibold text-sm px-8 py-4 shadow-md active:scale-[0.985] transition-all cursor-pointer group ${
                  isLight
                    ? 'bg-slate-900 text-white hover:bg-slate-800'
                    : 'bg-white text-black hover:bg-white/90 shadow-white/10'
                }`}
              >
                <span>Analyze your brand</span>
                <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => onOpenAuth?.(undefined, 'login')}
                className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl text-sm font-medium px-6 py-4 active:scale-[0.985] transition-all cursor-pointer ${
                  isLight
                    ? 'border border-slate-300 bg-white text-slate-800 hover:bg-slate-50'
                    : 'border border-white/15 text-white hover:bg-white/[0.06]'
                }`}
              >
                <span>Log in</span>
                <ArrowRight className="size-3.5 opacity-60" />
              </button>
            </div>

            {/* Three-Pillar Intelligence Confirmation Strip */}
            <div className="pt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono max-w-2xl mx-auto">
              <div className={`p-3 rounded-xl border flex items-center justify-center gap-2 ${
                isLight ? 'bg-white border-slate-200 text-slate-700' : 'bg-black/40 border-white/[0.05] text-white/80'
              }`}>
                <CheckCircle2 className="size-3.5 text-brand" />
                <span><strong>AI Visibility:</strong> Measured</span>
              </div>

              <div className={`p-3 rounded-xl border flex items-center justify-center gap-2 ${
                isLight ? 'bg-white border-slate-200 text-slate-700' : 'bg-black/40 border-white/[0.05] text-white/80'
              }`}>
                <CheckCircle2 className="size-3.5 text-brand" />
                <span><strong>Citation Gaps:</strong> Diagnosed</span>
              </div>

              <div className={`p-3 rounded-xl border flex items-center justify-center gap-2 ${
                isLight ? 'bg-white border-slate-200 text-slate-700' : 'bg-black/40 border-white/[0.05] text-white/80'
              }`}>
                <CheckCircle2 className="size-3.5 text-brand" />
                <span><strong>Competitor Signals:</strong> Isolated</span>
              </div>
            </div>

            {/* Sample Benchmark Truth Labeling Strip */}
            <div className={`mt-8 pt-6 border-t font-mono text-xs ${
              isLight ? 'border-slate-200 text-slate-400' : 'border-white/[0.06] text-white/40'
            }`}>
              <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 mb-2">
                <span>SAMPLE BENCHMARK:</span>
                <span className={isLight ? 'text-slate-700 font-bold' : 'text-white/80 font-bold'}>68.4% Visibility</span>
                <span>•</span>
                <span className={isLight ? 'text-slate-700 font-bold' : 'text-white/80 font-bold'}>24.1% Share of Voice</span>
                <span>•</span>
                <span className={isLight ? 'text-slate-700 font-bold' : 'text-white/80 font-bold'}>#1.4 Avg Position</span>
                <span>•</span>
                <span className={isLight ? 'text-slate-700 font-bold' : 'text-white/80 font-bold'}>5,033 Citations</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Illustrative platform benchmark — live audits evaluate your unique brand domain across 6 monitored frontier AI engines.
              </p>
            </div>

          </div>
        </motion.div>

      </div>
    </section>
  );
};
