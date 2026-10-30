import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Eye, Link2, Target, Sparkles, ArrowRight, RotateCw, CheckCircle2 } from 'lucide-react';
import { SectionEyebrow } from './primitives';
import { useTheme } from '../context/ThemeContext';

export const CoreMessage: React.FC = () => {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const [hoveredPillar, setHoveredPillar] = useState<number | null>(null);

  const pillars = [
    {
      step: '01',
      stage: 'MEASURE',
      question: 'What is happening?',
      subQuestion: 'Where does your brand appear?',
      title: 'AI Visibility',
      desc: 'Track how often AI systems recommend your brand across high-intent buyer queries, models, and categories.',
      metric: '68.4% Visibility',
      signal: '540 evaluation queries',
      causalStep: 'Observation',
      liveExample: 'AI Visibility: 68.4%',
      icon: Eye,
      accentColor: 'text-cyan-400',
      badgeStyle: 'border-cyan-500/20 bg-cyan-500/10 text-cyan-500'
    },
    {
      step: '02',
      stage: 'DIAGNOSE',
      question: 'Why is it happening?',
      subQuestion: 'Why does AI recommend it?',
      title: 'Citation Intelligence',
      desc: 'Trace the sources, citations, publications, and evidence influencing AI-generated recommendations.',
      metric: '5,033 Citations',
      signal: '261 tracked source gaps',
      causalStep: 'Explanation',
      liveExample: 'Competitor cited in 4 analyst briefs',
      icon: Link2,
      accentColor: 'text-blue-500',
      badgeStyle: 'border-blue-500/20 bg-blue-500/10 text-blue-500'
    },
    {
      step: '03',
      stage: 'ACT',
      question: 'What should we do?',
      subQuestion: 'What should you change?',
      title: 'Competitive Intelligence',
      desc: 'Identify where competitors win recommendation share and convert the underlying gaps into prioritized opportunities.',
      metric: '24.1% Share of Voice',
      signal: '−2.7 pts competitive gap',
      causalStep: 'Intervention',
      liveExample: 'Close enterprise review citation gap',
      icon: Target,
      accentColor: 'text-amber-400',
      badgeStyle: 'border-amber-500/20 bg-amber-500/10 text-amber-500'
    },
    {
      step: '04',
      stage: 'PROVE',
      question: 'Did it work?',
      subQuestion: 'Did the intervention work?',
      title: 'Actionable Opportunities',
      desc: 'Measure whether strategic changes improve recommendation visibility, citation coverage, and competitive position.',
      metric: '+4–8 pts Modeled Gain',
      signal: 'Automated re-scan cycle',
      causalStep: 'Verification',
      liveExample: 'Re-scan recommendation share',
      icon: Sparkles,
      accentColor: 'text-purple-400',
      badgeStyle: 'border-purple-500/20 bg-purple-500/10 text-purple-500'
    }
  ];

  return (
    <section id="framework" className={`py-14 md:py-20 border-b relative z-10 select-none transition-colors ${
      isLight
        ? 'bg-white border-slate-200/80 text-slate-900'
        : 'bg-[#000000] border-white/[0.08] text-white'
    }`}>
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Editorial Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-10">
          <SectionEyebrow label="CORE PRODUCT FRAMEWORK" tag="The Closed-Loop System" />
          
          <h2 className={`mt-4 text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight leading-[1.08] font-display ${
            isLight ? 'text-slate-900' : 'text-white'
          }`}>
            MEASURE → DIAGNOSE → ACT → PROVE
          </h2>
          
          <p className={`mt-3 text-base md:text-lg leading-[1.65] max-w-2xl mx-auto font-normal ${
            isLight ? 'text-slate-600' : 'text-white/60'
          }`}>
            Four connected intelligence layers turn AI discovery from an unpredictable black box into a measurable, actionable growth channel.
          </p>
        </div>

        {/* Unified Operating System Architecture Container */}
        <div className={`rounded-3xl border p-6 sm:p-7 shadow-2xl transition-all relative overflow-hidden ${
          isLight
            ? 'bg-[#FBFBFC] border-slate-200 shadow-slate-200/50'
            : 'bg-[#080a0d] border-white/[0.09] shadow-black/80'
        }`}>
          
          {/* Top Closed-Loop Status Header Bar */}
          <div className={`flex flex-wrap items-center justify-between gap-3 pb-4 border-b mb-6 text-xs font-mono ${
            isLight ? 'border-slate-100 text-slate-500' : 'border-white/[0.06] text-white/50'
          }`}>
            <div className="flex items-center gap-2">
              <RotateCw className="size-3.5 text-brand animate-spin-slow" />
              <span className="font-semibold uppercase tracking-wider text-brand">Dyvin Closed-Loop Operating Model</span>
              <span className="text-slate-300 dark:text-white/20">•</span>
              <span className="text-[11px] hidden sm:inline">Continuous Telemetry Cycle</span>
            </div>

            <span className={`px-2 py-0.5 rounded border text-[10px] uppercase font-bold tracking-wider ${
              isLight ? 'bg-slate-100 border-slate-200 text-slate-600' : 'bg-white/5 border-white/10 text-white/40'
            }`}>
              SAMPLE BENCHMARK
            </span>
          </div>

          {/* 4 Connected Architectural Stage Modules */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative">
            {pillars.map((p, idx) => (
              <motion.div
                key={p.stage}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                onMouseEnter={() => setHoveredPillar(idx)}
                onMouseLeave={() => setHoveredPillar(null)}
                className={`p-5 rounded-2xl border flex flex-col justify-between transition-all relative ${
                  hoveredPillar === idx
                    ? isLight
                      ? 'bg-white border-slate-300 shadow-md'
                      : 'bg-[#0c1017] border-white/20 shadow-md'
                    : isLight
                      ? 'bg-white border-slate-200/80 shadow-xs'
                      : 'bg-[#0a0d13] border-white/[0.06] shadow-xs'
                }`}
              >
                <div>
                  {/* Stage Number & Icon Bar */}
                  <div className={`flex items-center justify-between pb-3 border-b mb-3.5 ${
                    isLight ? 'border-slate-100' : 'border-white/[0.05]'
                  }`}>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-xs font-bold text-slate-400">{p.step}</span>
                      <span className="font-mono text-xs font-bold uppercase tracking-wider text-brand">
                        {p.stage}
                      </span>
                    </div>
                    <p.icon className={`size-4 ${p.accentColor}`} />
                  </div>

                  {/* Core Core Causal Question */}
                  <div className="mb-2">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400 block font-semibold">
                      {p.causalStep}:
                    </span>
                    <span className={`text-xs font-semibold font-sans block ${
                      isLight ? 'text-slate-800' : 'text-white/90'
                    }`}>
                      "{p.question}"
                    </span>
                  </div>

                  {/* Pillar Title */}
                  <h3 className={`font-display font-bold text-sm mt-2 ${
                    isLight ? 'text-slate-900' : 'text-white'
                  }`}>
                    {p.title}
                  </h3>

                  {/* Description */}
                  <p className={`text-xs mt-1.5 leading-relaxed font-sans ${
                    isLight ? 'text-slate-600' : 'text-white/60'
                  }`}>
                    {p.desc}
                  </p>
                </div>

                {/* Bottom Telemetry & Supporting Signal */}
                <div className={`mt-5 pt-3 border-t flex flex-col gap-1.5 ${
                  isLight ? 'border-slate-100' : 'border-white/[0.05]'
                }`}>
                  <div className="flex items-center justify-between font-mono text-xs">
                    <span className={`px-2 py-0.5 rounded border text-[10px] font-semibold ${p.badgeStyle}`}>
                      {p.metric}
                    </span>
                    <span className="text-[10px] text-slate-400">{p.signal}</span>
                  </div>
                </div>

                {/* Subtle Directional Arrow Connector for Desktop */}
                {idx < 3 && (
                  <div className="hidden lg:flex absolute -right-2.5 top-1/2 -translate-y-1/2 z-10 size-5 rounded-full bg-slate-200 dark:bg-white/10 items-center justify-center text-slate-500 dark:text-white/60 pointer-events-none text-[10px] font-mono shadow-xs">
                    →
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Integrated Live Example Thread Bar */}
          <div className={`mt-6 p-4 rounded-2xl border flex flex-col lg:flex-row lg:items-center justify-between gap-3 text-xs font-mono ${
            isLight
              ? 'bg-slate-100/70 border-slate-200 text-slate-700'
              : 'bg-[#0a0d13] border-white/[0.06] text-white/80'
          }`}>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
              <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                ILLUSTRATIVE THREAD:
              </span>
              <span className="text-brand">1. 68.4% Vis</span>
              <span className="text-slate-400">→</span>
              <span className="text-blue-500">2. Missing Analyst Briefs</span>
              <span className="text-slate-400">→</span>
              <span className="text-amber-500">3. Close Review Gap</span>
              <span className="text-slate-400">→</span>
              <span className="text-purple-400">4. +4–8 pts Modeled Gain</span>
            </div>

            <div className="flex items-center gap-1.5 text-emerald-500 text-[11px] font-semibold shrink-0">
              <CheckCircle2 className="size-3.5" />
              <span>Every intervention feeds the next measurement cycle</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
