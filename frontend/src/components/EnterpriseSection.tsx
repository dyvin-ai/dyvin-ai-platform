import React from 'react';
import { motion } from 'motion/react';
import { Shield, Lock, Server, Cpu, Check, ArrowRight } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface EnterpriseSectionProps {
  onOpenAuth: () => void;
}

export const EnterpriseSection: React.FC<EnterpriseSectionProps> = ({ onOpenAuth }) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const features = [
    { title: 'Zero-Retention Auditing', desc: 'Prompts and model outputs are evaluated ephemerally. No enterprise IP or telemetry is stored.', icon: Shield },
    { title: 'SOC2 Type II & GDPR Compliant', desc: 'Enterprise data sovereignty protocols with dedicated VPC deployment options.', icon: Lock },
    { title: 'Deterministic Reproducibility', desc: 'Multi-seed sampling eliminates temperature variance, providing audited confidence intervals.', icon: Server },
    { title: 'High-Throughput API & Webhooks', desc: 'Stream visibility changes and citation alerts directly to Slack, Datadog, or Snowflake.', icon: Cpu },
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
            <span>ENTERPRISE INFRASTRUCTURE</span>
          </div>

          <h2 className="text-3xl sm:text-5xl md:text-6xl font-black font-display tracking-tight uppercase leading-[0.98]">
            BUILT FOR THE <br />
            <span className="text-blue-500">AI DISCOVERY LAYER.</span>
          </h2>
        </div>

        {/* 4 Infrastructure Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className={`p-7 sm:p-8 rounded-[28px] border transition-all flex flex-col justify-between shadow-peec-card ${
                isLight ? 'bg-white border-slate-200/90 hover:border-blue-300' : 'bg-[#0D1017] border-white/5 hover:border-blue-500/30'
              }`}
            >
              <div>
                <div className="size-10 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-6 shadow-xs">
                  <f.icon className="size-5" />
                </div>
                <h3 className="font-display font-black text-lg">{f.title}</h3>
                <p className="mt-2 text-xs sm:text-sm text-slate-500 dark:text-white/60 font-sans leading-relaxed">
                  {f.desc}
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-xs font-mono text-slate-400">
                <span>Enterprise Protocol</span>
                <span className="text-emerald-500 font-bold">Verified</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
