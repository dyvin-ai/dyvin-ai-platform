import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SectionEyebrow } from './primitives';
import {
  Activity,
  FileText,
  Target,
  RefreshCw,
  TrendingUp,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface ProofSectionProps {
  onOpenAuth: () => void;
}

export const ProofSection: React.FC<ProofSectionProps> = ({ onOpenAuth }) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const [activeStep, setActiveStep] = useState(0);

  const workflowSteps = [
    {
      num: '01',
      id: 'baseline',
      title: 'BASELINE',
      question: 'Where are we starting?',
      icon: Activity,
      metric: '59.7%',
      metricLabel: 'AI Visibility',
      submetric: '74 / 100 Authority',
      observation: 'Initial benchmark reveals brand is underrepresented across 261 enterprise evaluation queries with a −4.1 pts competitive gap against Atlas AI.',
      status: 'Initial Diagnostic'
    },
    {
      num: '02',
      id: 'evidence',
      title: 'EVIDENCE',
      question: 'Why is AI underrepresenting the brand?',
      icon: FileText,
      metric: '4 Gaps',
      metricLabel: 'Missing Source Hubs',
      submetric: '14 Prompts Displaced',
      observation: 'Dyvin traces that competitor recommendations stem from 4 high-authority analyst grids (Gartner & G2) that currently lack your verified benchmarks.',
      status: 'Root Cause Isolated'
    },
    {
      num: '03',
      id: 'intervention',
      title: 'INTERVENTION',
      question: 'Dyvin recommends the highest-impact move.',
      icon: Target,
      metric: 'Action 01',
      metricLabel: 'High-Impact Plan',
      submetric: '+4–8 pts Modeled Gain',
      observation: 'Prescribes closing 4 high-value source gaps: deploy structured schema to partner directories and publish side-by-side technical evaluation assets.',
      status: 'Prescribed Action'
    },
    {
      num: '04',
      id: 'rescan',
      title: 'RE-SCAN',
      question: 'Measure the next cycle.',
      icon: RefreshCw,
      metric: '92 / 100',
      metricLabel: 'Re-Scan Authority',
      submetric: '+18 pts Authority Rise',
      observation: 'Closed-loop multi-engine re-scan evaluates identical buyer queries, verifying new citations indexed across OpenAI, Claude, and Google engines.',
      status: 'Closed-Loop Verification'
    },
    {
      num: '05',
      id: 'outcome',
      title: 'MODELED OUTCOME',
      question: 'Translate change into opportunity.',
      icon: TrendingUp,
      metric: '+34.2%',
      metricLabel: 'Modeled Visibility Gain',
      submetric: '59.7% → 68.4% Score',
      observation: 'Brand captured primary recommendation spot across 18 previously uncaptured buyer comparison queries. Modeled scenario, not verified customer ROI.',
      status: 'Modeled Scenario'
    }
  ];

  const current = workflowSteps[activeStep];

  return (
    <section id="workflow" className={`py-14 md:py-20 border-b select-none transition-colors relative z-10 ${
      isLight ? 'bg-slate-50/70 border-slate-200/80 text-slate-900' : 'bg-[#000000] border-white/[0.08] text-white'
    }`}>
      <div className="max-w-6xl mx-auto px-6 space-y-12">
        
        {/* Section Header */}
        <div className="max-w-3xl">
          <SectionEyebrow label="MEASURED WORKFLOW" tag="From diagnosis to measurable change" />

          <h2 className={`mt-4 text-3xl sm:text-4xl md:text-5xl font-semibold font-display tracking-tight leading-[1.08] ${
            isLight ? 'text-slate-900' : 'text-white'
          }`}>
            Turn AI visibility gaps into <br className="hidden sm:inline" />
            <span className={isLight ? 'text-slate-500' : 'text-white/60'}>
              measurable action.
            </span>
          </h2>

          <p className={`mt-3 text-base md:text-lg leading-[1.65] font-normal ${
            isLight ? 'text-slate-600' : 'text-white/70'
          }`}>
            Dyvin identifies where AI visibility is weak, traces the sources and prompts behind the gap, recommends the highest-impact intervention, and gives teams a clear framework for measuring what changes next.
          </p>
        </div>

        {/* Primary Showpiece: Single Unified Proof Instrument */}
        <div className={`rounded-3xl border shadow-2xl transition-all relative overflow-hidden ${
          isLight
            ? 'bg-white border-slate-200 shadow-slate-200/50 text-slate-900'
            : 'bg-[#080a0d] border-white/[0.09] shadow-black/80 text-white'
        }`}>
          
          {/* Top Context & Truth-Lock Strip */}
          <div className={`px-6 py-4 border-b flex flex-wrap items-center justify-between gap-3 text-xs font-mono ${
            isLight ? 'bg-slate-100/70 border-slate-200 text-slate-600' : 'bg-[#0c0f14] border-white/[0.06] text-white/60'
          }`}>
            <div className="flex items-center gap-2">
              <Sparkles className="size-3.5 text-brand" />
              <span className="font-semibold uppercase tracking-wider text-brand">Closed-Loop Measurement Simulation</span>
              <span className="text-slate-300 dark:text-white/20">•</span>
              <span className="text-[11px] hidden sm:inline">5-Stage Diagnostic Progression</span>
            </div>

            <span className={`px-2.5 py-1 rounded border text-[10px] uppercase font-bold tracking-wider ${
              isLight ? 'bg-slate-200/70 border-slate-300 text-slate-600' : 'bg-white/5 border-white/10 text-white/40'
            }`}>
              ILLUSTRATIVE WORKFLOW — NOT CUSTOMER PERFORMANCE DATA
            </span>
          </div>

          <div className="p-6 sm:p-8 space-y-8">
            
            {/* Horizontal 5-Step Progression Selector */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 font-mono" role="tablist" aria-label="Workflow Stages">
              {workflowSteps.map((step, idx) => {
                const isSelected = activeStep === idx;
                const IconComp = step.icon;

                return (
                  <button
                    key={step.id}
                    role="tab"
                    id={`step-tab-${step.id}`}
                    aria-selected={isSelected}
                    aria-controls={`step-panel-${step.id}`}
                    onClick={() => setActiveStep(idx)}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? isLight
                          ? 'bg-slate-50 border-slate-300 shadow-sm'
                          : 'bg-[#0a0d13] border-white/20 shadow-lg'
                        : isLight
                          ? 'bg-white border-slate-200 hover:bg-slate-50/50'
                          : 'bg-black/20 border-white/[0.05] hover:bg-white/[0.02]'
                    }`}
                  >
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 dark:border-white/[0.05]">
                      <span className="text-[10px] font-bold text-slate-400">{step.num}</span>
                      <IconComp className={`size-3.5 ${isSelected ? 'text-brand' : 'text-slate-400'}`} />
                    </div>

                    <div>
                      <span className={`text-xs font-bold font-display block leading-tight ${
                        isSelected
                          ? isLight ? 'text-slate-900' : 'text-white'
                          : isLight ? 'text-slate-600' : 'text-white/60'
                      }`}>
                        {step.title}
                      </span>
                      <span className="text-[10px] text-brand font-bold mt-1 block tnum">
                        {step.metric}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Active Stage Detailed Diagnostic Panel */}
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                role="tabpanel"
                id={`step-panel-${current.id}`}
                aria-labelledby={`step-tab-${current.id}`}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
                className={`p-6 sm:p-7 rounded-2xl border ${
                  isLight ? 'bg-slate-50/70 border-slate-200' : 'bg-[#0a0d13] border-white/[0.06]'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-5 border-b border-slate-100 dark:border-white/[0.05] gap-2 font-mono text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-brand uppercase">{current.num} — {current.title}</span>
                    <span className="text-slate-300 dark:text-white/20">•</span>
                    <span className="text-slate-400">{current.status}</span>
                  </div>
                  <span className="text-slate-400 text-[11px]">{current.submetric}</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                  
                  {/* Left 8 Cols: Question & Diagnostic Explanation */}
                  <div className="lg:col-span-8 space-y-3">
                    <h3 className="text-xl sm:text-2xl font-bold font-display tracking-tight text-slate-900 dark:text-white">
                      {current.question}
                    </h3>
                    <p className={`text-xs sm:text-sm font-sans leading-relaxed ${isLight ? 'text-slate-600' : 'text-white/70'}`}>
                      {current.observation}
                    </p>
                  </div>

                  {/* Right 4 Cols: Highlight Metric Box */}
                  <div className="lg:col-span-4">
                    <div className={`p-4 rounded-xl border text-center font-mono ${
                      isLight ? 'bg-white border-slate-200/90' : 'bg-black/40 border-white/[0.05]'
                    }`}>
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">
                        {current.metricLabel}
                      </span>
                      <div className="text-3xl font-bold text-brand mt-1 tnum">
                        {current.metric}
                      </div>
                      <span className="text-[10px] text-slate-400 block mt-1">
                        {current.submetric}
                      </span>
                    </div>
                  </div>

                </div>
              </motion.div>
            </AnimatePresence>

            {/* Before/After Precision SVG Trajectory Graph */}
            <div className={`p-5 sm:p-6 rounded-2xl border space-y-4 font-mono text-xs ${
              isLight ? 'bg-slate-50/50 border-slate-200' : 'bg-[#0a0d13] border-white/[0.06]'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                    MODELED AUTHORITY TRAJECTORY (BEFORE VS AFTER)
                  </span>
                  <p className={`text-xs font-sans mt-0.5 ${isLight ? 'text-slate-600' : 'text-white/60'}`}>
                    Simulating the impact of resolving 4 tier-1 citation deficits across multi-engine answer synthesis.
                  </p>
                </div>

                <div className="hidden sm:flex items-center gap-4 text-[11px]">
                  <div className="flex items-center gap-1.5">
                    <span className="size-2 rounded-full bg-slate-400" />
                    <span>Baseline (74)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="size-2 rounded-full bg-brand" />
                    <span className="font-bold text-brand">Post-Intervention (92)</span>
                  </div>
                </div>
              </div>

              {/* Responsive SVG Graph */}
              <div className="w-full h-32 relative">
                <svg
                  className="w-full h-full overflow-visible"
                  viewBox="0 0 600 100"
                  preserveAspectRatio="none"
                  aria-label="Illustrative source authority workflow showing a modeled change from 74 to 92 after source coverage intervention."
                >
                  <defs>
                    <linearGradient id="proofGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#94a3b8" />
                      <stop offset="50%" stopColor="#38bdf8" />
                      <stop offset="100%" stopColor="#2563eb" />
                    </linearGradient>
                    <linearGradient id="proofAreaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#2563eb" stopOpacity="0.15" />
                      <stop offset="100%" stopColor="#2563eb" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Grid Lines */}
                  <line x1="0" y1="20" x2="600" y2="20" stroke={isLight ? '#e2e8f0' : '#ffffff0d'} strokeDasharray="3 3" />
                  <line x1="0" y1="50" x2="600" y2="50" stroke={isLight ? '#e2e8f0' : '#ffffff0d'} strokeDasharray="3 3" />
                  <line x1="0" y1="80" x2="600" y2="80" stroke={isLight ? '#e2e8f0' : '#ffffff0d'} strokeDasharray="3 3" />

                  {/* Area Fill */}
                  <path
                    d="M 40 70 Q 200 68, 300 45 T 560 20 L 560 90 L 40 90 Z"
                    fill="url(#proofAreaGradient)"
                  />

                  {/* Trajectory Curve */}
                  <path
                    d="M 40 70 Q 200 68, 300 45 T 560 20"
                    fill="none"
                    stroke="url(#proofGradient)"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />

                  {/* Baseline Point */}
                  <circle cx="40" cy="70" r="5" fill="#94a3b8" />
                  <text x="40" y="90" fontSize="10" fill="#94a3b8" textAnchor="middle" fontFamily="monospace">
                    74 Authority
                  </text>

                  {/* Intervention Midpoint */}
                  <circle cx="300" cy="45" r="4" fill="#38bdf8" />
                  <text x="300" y="30" fontSize="9" fill="#38bdf8" textAnchor="middle" fontFamily="monospace">
                    Citation Coverage Deployed
                  </text>

                  {/* Post-Intervention Point */}
                  <circle cx="560" cy="20" r="6" fill="#2563eb" />
                  <text x="560" y="10" fontSize="10" fill="#2563eb" textAnchor="middle" fontWeight="bold" fontFamily="monospace">
                    92 Authority (+34.2% Modeled)
                  </text>
                </svg>
              </div>

              <div className="sr-only">
                Illustrative source authority workflow showing a modeled change from 74 to 92 after source coverage intervention.
              </div>
            </div>

            {/* Bottom Closed-Loop Action Summary */}
            <div className={`p-4 sm:p-5 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-4 ${
              isLight
                ? 'bg-blue-50/70 border-blue-200 text-blue-950 shadow-xs'
                : 'bg-blue-950/20 border-blue-500/25 text-blue-200 shadow-xs'
            }`}>
              <div className="space-y-1 text-xs">
                <div className="flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-wider text-blue-500">
                  <ShieldCheck className="size-3.5" />
                  <span>THE CLOSED-LOOP INTELLIGENCE SYSTEM</span>
                </div>
                <p className="font-sans font-medium leading-relaxed">
                  <strong>Measure. Diagnose. Act. Re-scan.</strong> Every recommendation is verified against continuous multi-model evaluations.
                </p>
              </div>

              <button
                onClick={onOpenAuth}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl font-mono text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 shadow-xs shrink-0 cursor-pointer transition-all flex items-center justify-center gap-1.5"
              >
                <span>See what this looks like for your brand</span>
                <ArrowRight className="size-3.5" />
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
