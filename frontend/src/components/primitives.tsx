import React from 'react';
import { ChevronRight } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export interface ButtonProps {
  label?: string;
  full?: boolean;
  onClick?: () => void;
  className?: string;
}

export const LogoMark: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => {
  const { theme } = useTheme();
  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <img
        src="/dyvin-logo-white.png"
        alt="Dyvin AI"
        className={`w-full h-full object-contain ${theme === 'light' ? 'brightness-0' : ''}`}
      />
    </div>
  );
};

export const PrimaryButton: React.FC<ButtonProps> = ({
  label = "Analyze your brand",
  full = false,
  onClick,
  className = ""
}) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  return (
    <button
      onClick={onClick}
      className={`group inline-flex items-center justify-center gap-2 rounded-2xl font-semibold text-sm px-6 py-3 shadow-md active:scale-[0.985] transition-all cursor-pointer ${
        isLight
          ? 'bg-slate-900 text-white hover:bg-slate-800'
          : 'bg-white text-black hover:bg-white/90 shadow-white/10'
      } ${full ? 'w-full' : ''} ${className}`}
    >
      <span>{label}</span>
      <ChevronRight className="w-4 h-4 transition-transform duration-150 group-hover:translate-x-[1px]" />
    </button>
  );
};

export const SectionEyebrow: React.FC<{ label: string; tag?: string }> = ({ label, tag }) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  return (
    <div className={`inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] ${
      isLight ? 'text-slate-500' : 'text-white/50'
    }`}>
      <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
      <span className={`font-semibold ${isLight ? 'text-slate-800' : 'text-white/70'}`}>{label}</span>
      {tag && (
        <>
          <span className={isLight ? 'text-slate-300' : 'text-white/20'}>·</span>
          <span className={`normal-case tracking-normal font-sans font-medium text-xs ${
            isLight ? 'text-slate-500' : 'text-white/40'
          }`}>
            {tag}
          </span>
        </>
      )}
    </div>
  );
};

export const headlineGradientStyle: React.CSSProperties = {
  backgroundImage: 'linear-gradient(180deg, #FFFFFF 0%, rgba(255, 255, 255, 0.45) 100%)',
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  color: 'transparent',
  WebkitTextFillColor: 'transparent',
};

export const headlineGradientStyleLight: React.CSSProperties = {
  backgroundImage: 'linear-gradient(180deg, #0F172A 0%, #64748B 100%)',
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  color: 'transparent',
  WebkitTextFillColor: 'transparent',
};
