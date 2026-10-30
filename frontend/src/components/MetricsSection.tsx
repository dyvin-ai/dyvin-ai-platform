import React from 'react';
import { motion } from 'motion/react';
import { useTheme } from '../context/ThemeContext';

export const MetricsSection: React.FC = () => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const metrics = [
    { value: '86.4', label: 'Average Visibility Score', sub: '+18.7% 30-day velocity' },
    { value: '1,284', label: 'Prompts Audited Daily', sub: 'Across 18 query categories' },
    { value: '342', label: 'Citations Indexed', sub: 'From 148 root domains' },
    { value: '27', label: 'Competitor Gaps Closed', sub: 'In enterprise evaluations' },
  ];

  return (
    <section className={`py-24 border-b select-none transition-colors ${
      isLight ? 'bg-white border-slate-200/80 text-slate-900' : 'bg-[#060709] border-white/5 text-white'
    }`}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 font-mono">
          {metrics.map((m) => (
            <div key={m.label} className="border-l-2 border-blue-500 pl-5">
              <span className={`text-4xl sm:text-5xl font-black font-display tracking-tight block tnum ${
                isLight ? 'text-slate-900' : 'text-white'
              }`}>
                {m.value}
              </span>
              <span className="text-xs uppercase font-bold text-slate-500 dark:text-white/60 block mt-2 font-sans">
                {m.label}
              </span>
              <span className="text-[11px] text-blue-600 dark:text-blue-400 block mt-0.5">
                {m.sub}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
