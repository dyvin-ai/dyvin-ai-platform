import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Globe, CheckCircle2 } from 'lucide-react';
import { SectionEyebrow } from './primitives';

interface PublicWebsiteAnalysisProps {
  onOpenAuth: (domain?: string) => void;
}

export const PublicWebsiteAnalysis: React.FC<PublicWebsiteAnalysisProps> = ({ onOpenAuth }) => {
  const [domainInput, setDomainInput] = useState('dyvin.ai');
  const [isScanning, setIsScanning] = useState(false);
  const [hasScanned, setHasScanned] = useState(true);
  const [scanStep, setScanStep] = useState(0);
  const [analyzedDomain, setAnalyzedDomain] = useState('dyvin.ai');

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    if (!domainInput.trim()) return;

    const formatted = domainInput.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/.*$/, '');
    setAnalyzedDomain(formatted);
    setIsScanning(true);
    setHasScanned(false);
    setScanStep(1);

    setTimeout(() => setScanStep(2), 700);
    setTimeout(() => setScanStep(3), 1400);
    setTimeout(() => {
      setIsScanning(false);
      setHasScanned(true);
    }, 2100);
  };

  return (
    <section id="public-audit" className="max-w-6xl mx-auto px-6 py-20 md:py-28 relative z-10">
      <div className="liquid-glass rounded-3xl p-8 md:p-12 border border-white/10 relative overflow-hidden">
        {/* Background glow circle */}
        <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-[#00d2ff]/10 blur-3xl pointer-events-none" />

        <div className="max-w-3xl mx-auto text-center">
          <SectionEyebrow label="PUBLIC AUDIT PREVIEW" tag="Live Model Scan" />
          
          <h2 className="mt-4 text-3xl md:text-5xl font-semibold tracking-tight leading-[1.05] font-display text-white">
            See how AI sees your brand.
          </h2>
          
          <p className="mt-4 text-white/60 text-base md:text-lg leading-[1.6]">
            Enter your website and get a public preview of how your brand appears across AI search.
          </p>

          {/* Interactive Form Input */}
          <form onSubmit={handleAnalyze} className="mt-8 flex flex-col sm:flex-row items-center gap-3 max-w-xl mx-auto">
            <div className="relative w-full">
              <Globe className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
              <input
                type="text"
                value={domainInput}
                onChange={(e) => setDomainInput(e.target.value)}
                placeholder="yourwebsite.com"
                className="w-full bg-white/5 border border-white/15 rounded-full pl-12 pr-4 py-3.5 text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#00d2ff] transition-colors"
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={isScanning}
              className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-white text-black font-semibold text-sm hover:bg-white/90 transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer shadow-lg active:scale-95 disabled:opacity-50 font-mono"
            >
              {isScanning ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin text-black" />
                  <span>Scanning AI Models...</span>
                </>
              ) : (
                <>
                  <span>Analyze website →</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Live Scan Animation Banner */}
        <AnimatePresence>
          {isScanning && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-8 p-6 rounded-2xl bg-black/60 border border-[#00d2ff]/30 text-center max-w-xl mx-auto"
            >
              <div className="flex items-center justify-center gap-3 text-xs font-mono text-[#00d2ff] mb-3">
                <Sparkles className="w-4 h-4 animate-spin" />
                <span>Scanning {analyzedDomain} across AI Search Engines...</span>
              </div>
              <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-[#00d2ff] to-[#A4F4FD]"
                  initial={{ width: '10%' }}
                  animate={{ width: scanStep === 1 ? '40%' : scanStep === 2 ? '75%' : '100%' }}
                  transition={{ duration: 0.6 }}
                />
              </div>
              <div className="mt-3 text-[11px] text-white/50 font-mono">
                {scanStep === 1 && 'Querying ChatGPT 4o & Claude 3.5 Sonnet...'}
                {scanStep === 2 && 'Parsing Perplexity Pro & Gemini 1.5 citations...'}
                {scanStep === 3 && 'Calculating Share of Voice & Competitor positioning...'}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Preview Information Result Card */}
        {hasScanned && !isScanning && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mt-10 pt-8 border-t border-white/10"
          >
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-[#00d2ff]">
                  PUBLIC INTELLIGENCE PREVIEW
                </span>
                <h3 className="text-xl font-semibold text-white font-display mt-0.5">
                  AI Search Audit for <span className="text-[#A4F4FD] underline decoration-[#00d2ff]/40">{analyzedDomain}</span>
                </h3>
              </div>
              <button
                onClick={() => onOpenAuth(analyzedDomain)}
                className="px-5 py-2.5 rounded-full border border-[#00d2ff]/40 bg-[#00d2ff]/10 text-[#A4F4FD] text-xs font-mono font-medium hover:bg-[#00d2ff]/20 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>Unlock Full Enterprise Workspace →</span>
              </button>
            </div>

            {/* Metrics Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10">
                <span className="text-[11px] text-white/50 block font-mono">AI Visibility</span>
                <span className="text-2xl font-bold text-white font-mono mt-1 block">72.8%</span>
                <span className="text-[10px] text-[#10b981] font-semibold">High Presence</span>
              </div>
              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10">
                <span className="text-[11px] text-white/50 block font-mono">Share of Voice</span>
                <span className="text-2xl font-bold text-[#00d2ff] font-mono mt-1 block">28.4%</span>
                <span className="text-[10px] text-white/40">Category Leader</span>
              </div>
              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10">
                <span className="text-[11px] text-white/50 block font-mono">Average Position</span>
                <span className="text-2xl font-bold text-white font-mono mt-1 block">#1.8</span>
                <span className="text-[10px] text-[#00d2ff] font-semibold">Top 2 Rank</span>
              </div>
              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10">
                <span className="text-[11px] text-white/50 block font-mono">Mentions Analyzed</span>
                <span className="text-2xl font-bold text-white font-mono mt-1 block">6,140</span>
                <span className="text-[10px] text-white/40">Across 5 Models</span>
              </div>
            </div>

            {/* Breakdown Grid */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Models Analyzed */}
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 text-xs">
                <span className="font-semibold text-white block mb-2 font-display">AI Models Analyzed</span>
                <ul className="space-y-1.5 text-white/70">
                  <li className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-[#10b981]" /> ChatGPT 4o</span>
                    <span className="font-mono text-white/40">100% Match</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-[#10b981]" /> Claude 3.5</span>
                    <span className="font-mono text-white/40">96% Match</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-[#10b981]" /> Perplexity Pro</span>
                    <span className="font-mono text-white/40">98% Match</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-[#10b981]" /> Gemini 1.5</span>
                    <span className="font-mono text-white/40">92% Match</span>
                  </li>
                </ul>
              </div>

              {/* Competitors Detected */}
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 text-xs">
                <span className="font-semibold text-white block mb-2 font-display">Competitors Detected</span>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-white/80">Atlas AI</span>
                    <span className="font-mono text-white/40">19.2% SoV</span>
                  </div>
                  <div className="w-full bg-white/10 h-1 rounded-full">
                    <div className="bg-[#f59e0b] h-full rounded-full" style={{ width: '60%' }} />
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-white/80">Vector Systems</span>
                    <span className="font-mono text-white/40">14.1% SoV</span>
                  </div>
                  <div className="w-full bg-white/10 h-1 rounded-full">
                    <div className="bg-white/40 h-full rounded-full" style={{ width: '45%' }} />
                  </div>
                </div>
              </div>

              {/* Sources and Citations */}
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 text-xs">
                <span className="font-semibold text-white block mb-2 font-display">Sources & Citations</span>
                <div className="space-y-1.5 text-white/70">
                  <div className="flex items-center justify-between">
                    <span className="truncate max-w-[160px] text-[#A4F4FD]">techcrunch.com</span>
                    <span className="px-1.5 py-0.5 rounded bg-white/10 text-[10px]">Auth 94/100</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="truncate max-w-[160px] text-[#A4F4FD]">{analyzedDomain}/docs</span>
                    <span className="px-1.5 py-0.5 rounded bg-white/10 text-[10px]">Auth 98/100</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="truncate max-w-[160px] text-[#A4F4FD]">venturebeat.com</span>
                    <span className="px-1.5 py-0.5 rounded bg-white/10 text-[10px]">Auth 91/100</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Enterprise Unlock Action */}
            <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs text-white/60 text-center sm:text-left">
                Your brand is visible across major AI models, but loses ground on high-intent comparison prompts.
              </p>
              <button
                onClick={() => onOpenAuth(analyzedDomain)}
                className="w-full sm:w-auto rounded-full bg-white text-black font-semibold text-xs px-6 py-3 hover:bg-white/90 transition-all cursor-pointer shadow-lg shadow-white/10 shrink-0"
              >
                Unlock full enterprise workspace →
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
};
