import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface FinalCinematicCtaProps {
  onOpenAuth: () => void;
}

export const FinalCinematicCta: React.FC<FinalCinematicCtaProps> = ({ onOpenAuth }) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  return (
    <section className={`py-28 sm:py-36 text-center select-none relative overflow-hidden transition-colors ${
      isLight ? 'bg-white text-slate-900' : 'bg-[#060709] text-white'
    }`}>
      
      {/* Ambient Glow */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] blur-[140px] rounded-full pointer-events-none ${
        isLight ? 'bg-blue-500/10' : 'bg-blue-600/20'
      }`} />

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        
        <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-[11px] font-mono font-bold uppercase tracking-wider mb-8 ${
          isLight ? 'bg-slate-100 border-slate-200 text-slate-800' : 'bg-white/5 border-white/10 text-white/90'
        }`}>
          <Sparkles className="size-3 text-blue-500" />
          <span>JOIN THE AI DISCOVERY LAYER</span>
        </div>

        <h2 className="text-4xl sm:text-7xl md:text-8xl font-black font-display tracking-tight uppercase leading-[0.94]">
          IS AI FINDING <br />
          <span className="text-blue-500">YOUR BRAND?</span>
        </h2>

        <p className={`mt-8 max-w-xl mx-auto text-base sm:text-lg font-normal leading-relaxed ${
          isLight ? 'text-slate-600' : 'text-white/70'
        }`}>
          See what generative search engines say about your company in zero-click conversational queries — and make sure AI gets you right.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onOpenAuth}
            className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl text-xs font-bold uppercase tracking-wider px-8 py-4 shadow-sm active:scale-95 transition-all cursor-pointer font-mono ${
              isLight ? 'bg-slate-900 text-white hover:bg-slate-800' : 'bg-white text-black hover:bg-white/90'
            }`}
          >
            <span>Audit Your Brand Now</span>
            <ArrowRight className="size-3.5" />
          </button>

          <a
            href="/overview"
            className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl text-xs font-bold uppercase tracking-wider px-8 py-4 border active:scale-95 transition-all cursor-pointer font-mono ${
              isLight ? 'border-slate-300 text-slate-700 hover:bg-slate-50' : 'border-white/20 text-white/80 hover:bg-white/5 hover:text-white'
            }`}
          >
            <span>Live Workspace Demo</span>
          </a>
        </div>

      </div>
    </section>
  );
};
