import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Search,
  ArrowUpRight,
  TrendingUp,
  SlidersHorizontal,
  BarChart2,
  ExternalLink,
  Layers,
  ChevronRight,
  Sparkles,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const PeecDashboardMockup: React.FC<{ onOpenAuth?: () => void }> = ({ onOpenAuth }) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const [activeMetricTab, setActiveMetricTab] = useState<'visibility' | 'sentiment' | 'position'>('visibility');
  const [activeDomainTab, setActiveDomainTab] = useState<'domains' | 'urls'>('domains');
  const [hoveredMonth, setHoveredMonth] = useState('March 2025');

  const competitors = [
    { rank: 1, name: 'Monday.com', logoColor: 'bg-red-500', vis: '65%', sent: 86, pos: '#2.7', delta: '+0.1' },
    { rank: 2, name: 'Salesforce', logoColor: 'bg-blue-500', vis: '62%', sent: 62, pos: '#2.9', delta: '+0.2' },
    { rank: 3, name: 'Dyvin AI (You)', logoColor: 'bg-indigo-600', vis: '54%', sent: 89, pos: '#3.8', delta: '+0.3', active: true },
    { rank: 4, name: 'Pipedrive', logoColor: 'bg-emerald-500', vis: '41%', sent: 76, pos: '#3.9', delta: '-0.3' },
    { rank: 5, name: 'Zero CRM', logoColor: 'bg-amber-500', vis: '28%', sent: 88, pos: '#2.3', delta: '+0.4' },
  ];

  const domains = [
    { rank: 1, domain: 'reddit.com', type: 'UGC', typeColor: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300', used: '32%', cit: '41%' },
    { rank: 2, domain: 'techradar.com', type: 'Editorial', typeColor: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300', used: '43%', cit: '46%' },
    { rank: 3, domain: 'gartner.com', type: 'Analyst', typeColor: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300', used: '58%', cit: '62%' },
    { rank: 4, domain: 'g2.com', type: 'Reviews', typeColor: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300', used: '39%', cit: '44%' },
  ];

  return (
    <section id="dashboard-mockup" className="max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-24 select-none relative">
      
      {/* Main Hardware Container with Soft Curves (Exact Peec AI Screenshot 2) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className={`rounded-[28px] sm:rounded-[36px] border p-4 sm:p-6 shadow-peec-shell backdrop-blur-2xl transition-all ${
          isLight
            ? 'bg-[#F9FAFC] border-slate-200/90 text-slate-900'
            : 'bg-[#090C10] border-white/[0.08] text-white'
        }`}
      >
        
        {/* Top Breadcrumb & Status Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-200/70 dark:border-white/5 gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
              <Sparkles className="size-3.5" />
            </span>
            <span className="font-semibold text-slate-800 dark:text-white/90">
              Overview · Dyvin's Visibility trending up by <strong className="text-emerald-600 font-bold">+5.2% this month</strong>
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px] font-mono text-slate-500 dark:text-white/60">
            <span className="flex items-center gap-1">
              Visibility: <strong className="text-slate-800 dark:text-white">3/14</strong>
              <span className="text-emerald-500 font-bold">↗</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              Sentiment: <strong className="text-slate-800 dark:text-white">2/14</strong>
              <span className="text-emerald-500 font-bold">↗</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              Position: <strong className="text-slate-800 dark:text-white">5/14</strong>
              <span className="text-emerald-500 font-bold">↗</span>
            </span>
          </div>
        </div>

        {/* Interior Two-Column Grid (Left: Charts & Tables, Right: Sidebar) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 pt-5">
          
          {/* Main Content Area (12 cols) */}
          <div className="lg:col-span-12 space-y-5">
            
            {/* Top Row: Multi-Line Spline Chart & Competitors Table */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              
              {/* Left 7 Cols: The Multi-Line Chart with Floating Tooltip */}
              <div className={`lg:col-span-7 p-5 rounded-2xl sm:rounded-3xl border shadow-peec-card flex flex-col justify-between relative overflow-hidden ${
                isLight ? 'bg-white border-slate-200/80' : 'bg-[#0D1017] border-white/5'
              }`}>
                
                {/* Metric Selector Tabs */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-white/5">
                  <div className="flex items-center gap-1 bg-slate-100 dark:bg-white/5 p-1 rounded-xl">
                    <button
                      onClick={() => setActiveMetricTab('visibility')}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        activeMetricTab === 'visibility'
                          ? isLight ? 'bg-white text-slate-900 shadow-xs' : 'bg-white/10 text-white shadow-xs'
                          : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
                      }`}
                    >
                      Visibility
                    </button>
                    <button
                      onClick={() => setActiveMetricTab('sentiment')}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        activeMetricTab === 'sentiment'
                          ? isLight ? 'bg-white text-slate-900 shadow-xs' : 'bg-white/10 text-white shadow-xs'
                          : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
                      }`}
                    >
                      Sentiment
                    </button>
                    <button
                      onClick={() => setActiveMetricTab('position')}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        activeMetricTab === 'position'
                          ? isLight ? 'bg-white text-slate-900 shadow-xs' : 'bg-white/10 text-white shadow-xs'
                          : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
                      }`}
                    >
                      Position
                    </button>
                  </div>

                  <div className="flex items-center gap-2 text-slate-400">
                    <SlidersHorizontal className="size-4 hover:text-slate-700 dark:hover:text-white cursor-pointer" />
                    <BarChart2 className="size-4 hover:text-slate-700 dark:hover:text-white cursor-pointer" />
                  </div>
                </div>

                {/* SVG Curved Spline Multi-Line Chart with Floating Overlay */}
                <div className="py-6 relative min-h-[220px] flex flex-col justify-end">
                  
                  {/* Floating Dark Tooltip Card (Exact match to March 2025 in Peec AI) */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute top-4 left-1/2 -translate-x-1/2 z-20 p-3 rounded-2xl bg-[#090C12] border border-white/15 text-white shadow-2xl text-xs font-mono min-w-[170px]"
                  >
                    <span className="font-bold text-[10px] text-white/50 block mb-2 font-sans">{hoveredMonth}</span>
                    <div className="space-y-1.5 text-[11px]">
                      <div className="flex items-center justify-between gap-3">
                        <span className="flex items-center gap-1.5">
                          <span className="size-2 rounded-full bg-red-400" />
                          <span className="font-sans">Monday</span>
                        </span>
                        <span className="font-bold">72%</span>
                      </div>
                      <div className="flex items-center justify-between gap-3">
                        <span className="flex items-center gap-1.5">
                          <span className="size-2 rounded-full bg-blue-400" />
                          <span className="font-sans">Salesforce</span>
                        </span>
                        <span className="font-bold">65%</span>
                      </div>
                      <div className="flex items-center justify-between gap-3 text-blue-300 font-bold">
                        <span className="flex items-center gap-1.5">
                          <span className="size-2 rounded-full bg-blue-500" />
                          <span className="font-sans">Dyvin AI</span>
                        </span>
                        <span>54%</span>
                      </div>
                      <div className="flex items-center justify-between gap-3">
                        <span className="flex items-center gap-1.5">
                          <span className="size-2 rounded-full bg-amber-400" />
                          <span className="font-sans">Zero</span>
                        </span>
                        <span className="font-bold">33%</span>
                      </div>
                      <div className="flex items-center justify-between gap-3">
                        <span className="flex items-center gap-1.5">
                          <span className="size-2 rounded-full bg-emerald-400" />
                          <span className="font-sans">Pipedrive</span>
                        </span>
                        <span className="font-bold">28%</span>
                      </div>
                    </div>
                  </motion.div>

                  {/* SVG Splines */}
                  <svg className="w-full h-36 overflow-visible" viewBox="0 0 500 120">
                    <defs>
                      <linearGradient id="dyvinGlow" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#2563EB" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#2563EB" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    
                    {/* Line 1: Monday (Red) */}
                    <path
                      d="M 0,30 Q 100,20 200,35 T 350,25 T 500,35"
                      fill="none"
                      stroke="#EF4444"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />

                    {/* Line 2: Salesforce (Blue) */}
                    <path
                      d="M 0,50 Q 120,40 250,55 T 380,45 T 500,50"
                      fill="none"
                      stroke="#3B82F6"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />

                    {/* Line 3: Dyvin AI (Deep Blue/Indigo with glow) */}
                    <path
                      d="M 0,75 Q 120,60 250,65 T 380,50 T 500,42"
                      fill="none"
                      stroke="#2563EB"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                    />

                    {/* Line 4: Zero (Amber) */}
                    <path
                      d="M 0,90 Q 100,85 220,95 T 370,85 T 500,90"
                      fill="none"
                      stroke="#EAB308"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />

                    {/* Line 5: Pipedrive (Green) */}
                    <path
                      d="M 0,105 Q 110,100 240,110 T 360,100 T 500,105"
                      fill="none"
                      stroke="#22C55E"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>

                {/* X-Axis Months */}
                <div className="flex justify-between text-[11px] font-mono text-slate-400 pt-2 border-t border-slate-100 dark:border-white/5">
                  <span>Jan</span>
                  <span>Feb</span>
                  <span className="font-bold text-blue-600 dark:text-blue-400">Mar</span>
                  <span>Apr</span>
                  <span>May</span>
                  <span>Jun</span>
                </div>

              </div>

              {/* Right 5 Cols: Attio's / Dyvin's Competitors Table */}
              <div className={`lg:col-span-5 p-5 rounded-2xl sm:rounded-3xl border shadow-peec-card flex flex-col justify-between ${
                isLight ? 'bg-white border-slate-200/80' : 'bg-[#0D1017] border-white/5'
              }`}>
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/5">
                    <div>
                      <h4 className="font-display font-bold text-sm">Dyvin's competitors</h4>
                      <p className="text-[11px] text-slate-400">Compare Dyvin with its category competitors</p>
                    </div>
                    <ExternalLink className="size-3.5 text-slate-400 cursor-pointer" />
                  </div>

                  {/* Competitor Table Rows */}
                  <div className="mt-3 space-y-2 text-xs">
                    <div className="grid grid-cols-12 text-[10px] font-mono uppercase text-slate-400 pb-1 px-2">
                      <span className="col-span-1">#</span>
                      <span className="col-span-4">Brand</span>
                      <span className="col-span-3 text-right">Visibility</span>
                      <span className="col-span-2 text-right">Sentiment</span>
                      <span className="col-span-2 text-right">Position</span>
                    </div>

                    {competitors.map((c) => (
                      <div
                        key={c.name}
                        className={`grid grid-cols-12 items-center p-2 rounded-xl border transition-all ${
                          c.active
                            ? isLight
                              ? 'bg-blue-50/70 border-blue-200 font-semibold'
                              : 'bg-blue-900/20 border-blue-500/30 text-white font-semibold'
                            : isLight
                              ? 'bg-slate-50/50 border-transparent hover:bg-slate-100/70'
                              : 'bg-white/[0.02] border-transparent hover:bg-white/5'
                        }`}
                      >
                        <span className="col-span-1 font-mono text-slate-400 text-[11px]">{c.rank}</span>
                        <div className="col-span-4 flex items-center gap-2 truncate">
                          <span className={`size-2.5 rounded-full ${c.logoColor}`} />
                          <span className="truncate text-xs">{c.name}</span>
                        </div>
                        <span className="col-span-3 text-right font-mono text-xs">
                          {c.vis} <span className="text-[10px] text-emerald-500">{c.delta}</span>
                        </span>
                        <span className="col-span-2 text-right font-mono text-xs text-slate-500 dark:text-white/60">
                          | {c.sent}
                        </span>
                        <span className="col-span-2 text-right font-mono text-xs font-bold">
                          {c.pos}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span>Continuous 24/7 telemetry</span>
                  <button onClick={onOpenAuth} className="text-blue-600 dark:text-blue-400 font-bold hover:underline cursor-pointer">
                    Full Matrix →
                  </button>
                </div>
              </div>

            </div>

            {/* Bottom Row: Domains Table (Left) & Domains by Type Donut (Right) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              
              {/* Left 7 Cols: Domains | URLs Table */}
              <div className={`lg:col-span-7 p-5 rounded-2xl sm:rounded-3xl border shadow-peec-card ${
                isLight ? 'bg-white border-slate-200/80' : 'bg-[#0D1017] border-white/5'
              }`}>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/5">
                  <div className="flex items-center gap-1 bg-slate-100 dark:bg-white/5 p-1 rounded-xl">
                    <button
                      onClick={() => setActiveDomainTab('domains')}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        activeDomainTab === 'domains'
                          ? isLight ? 'bg-white text-slate-900 shadow-xs' : 'bg-white/10 text-white shadow-xs'
                          : 'text-slate-500'
                      }`}
                    >
                      Domains
                    </button>
                    <button
                      onClick={() => setActiveDomainTab('urls')}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        activeDomainTab === 'urls'
                          ? isLight ? 'bg-white text-slate-900 shadow-xs' : 'bg-white/10 text-white shadow-xs'
                          : 'text-slate-500'
                      }`}
                    >
                      URLs
                    </button>
                  </div>

                  <span className="text-xs font-mono text-slate-400">148 Total Sources</span>
                </div>

                <div className="mt-3 space-y-2 text-xs">
                  <div className="grid grid-cols-12 text-[10px] font-mono uppercase text-slate-400 pb-1 px-2">
                    <span className="col-span-1">#</span>
                    <span className="col-span-5">Domain</span>
                    <span className="col-span-3">Type</span>
                    <span className="col-span-3 text-right">Avg. Citations</span>
                  </div>

                  {domains.map((d) => (
                    <div
                      key={d.domain}
                      className="grid grid-cols-12 items-center p-2.5 rounded-xl bg-slate-50/50 dark:bg-white/[0.02] hover:bg-slate-100/70 dark:hover:bg-white/5 transition-all text-xs"
                    >
                      <span className="col-span-1 font-mono text-slate-400 text-[11px]">{d.rank}</span>
                      <span className="col-span-5 font-semibold text-slate-800 dark:text-white truncate">{d.domain}</span>
                      <div className="col-span-3">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${d.typeColor}`}>
                          {d.type}
                        </span>
                      </div>
                      <span className="col-span-3 text-right font-mono font-bold text-slate-800 dark:text-white/90">
                        {d.cit}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right 5 Cols: Domains by Type Donut Gauge */}
              <div className={`lg:col-span-5 p-5 rounded-2xl sm:rounded-3xl border shadow-peec-card flex flex-col justify-between ${
                isLight ? 'bg-white border-slate-200/80' : 'bg-[#0D1017] border-white/5'
              }`}>
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/5">
                    <div>
                      <h4 className="font-display font-bold text-sm">Domains by Type</h4>
                      <p className="text-[11px] text-slate-400">Most used domains categorized by authority</p>
                    </div>
                    <ExternalLink className="size-3.5 text-slate-400 cursor-pointer" />
                  </div>

                  {/* Circular Donut Mockup */}
                  <div className="py-5 flex items-center justify-center gap-6">
                    <div className="relative size-24 rounded-full border-8 border-blue-500 border-t-indigo-400 border-r-amber-400 flex items-center justify-center">
                      <span className="font-display font-black text-lg">12%</span>
                    </div>

                    <div className="space-y-1.5 text-xs font-sans">
                      <div className="flex items-center gap-2">
                        <span className="size-2 rounded-full bg-blue-500" />
                        <span className="text-slate-600 dark:text-white/70">UGC & Communities</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="size-2 rounded-full bg-indigo-500" />
                        <span className="text-slate-600 dark:text-white/70">Editorial Publications</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="size-2 rounded-full bg-amber-500" />
                        <span className="text-slate-600 dark:text-white/70">Corporate & Case Studies</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="size-2 rounded-full bg-emerald-500" />
                        <span className="text-slate-600 dark:text-white/70">Competitor Reviews</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span>Source taxonomy active</span>
                  <span className="text-emerald-500 font-bold">100% Synced</span>
                </div>
              </div>

            </div>

          </div>

        </div>

      </motion.div>
    </section>
  );
};
