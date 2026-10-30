import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check, ArrowRight, Building2, Globe, Shield, Sparkles } from 'lucide-react';
import { authService } from '../lib/auth';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialDomain?: string;
  onComplete: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  initialDomain = '',
  onComplete,
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [domain, setDomain] = useState(initialDomain || 'northwind.ai');
  const [brandName, setBrandName] = useState(
    initialDomain ? initialDomain.split('.')[0].toUpperCase() : 'Northwind Labs'
  );
  const [industry, setIndustry] = useState('Enterprise AI & Software');
  const [selectedCompetitors, setSelectedCompetitors] = useState<string[]>([
    'Atlas AI',
    'Vector Systems',
    'Cognitive Corp',
  ]);
  const [newCompetitor, setNewCompetitor] = useState('');
  const [provisionProgress, setProvisionProgress] = useState(0);

  useEffect(() => {
    if (isOpen) {
      const prevTitle = document.title;
      document.title = 'DYVIN AI | Set Up Your Workspace';
      return () => {
        document.title = prevTitle || 'DYVIN AI | AI Presence Intelligence';
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleAddCompetitor = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCompetitor.trim() && !selectedCompetitors.includes(newCompetitor.trim())) {
      setSelectedCompetitors([...selectedCompetitors, newCompetitor.trim()]);
      setNewCompetitor('');
    }
  };

  const toggleCompetitor = (name: string) => {
    if (selectedCompetitors.includes(name)) {
      setSelectedCompetitors(selectedCompetitors.filter(c => c !== name));
    } else {
      setSelectedCompetitors([...selectedCompetitors, name]);
    }
  };

  const startProvisioning = () => {
    setStep(3);
    authService.updateWorkspace({
      brandDomain: domain,
      brandName: brandName,
      industry: industry,
      competitors: selectedCompetitors,
    });

    let current = 0;
    const interval = setInterval(() => {
      current += Math.floor(Math.random() * 15) + 10;
      if (current >= 100) {
        current = 100;
        setProvisionProgress(100);
        clearInterval(interval);
        setTimeout(() => {
          onComplete();
        }, 800);
      } else {
        setProvisionProgress(current);
      }
    }, 300);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-[#060608]/90 backdrop-blur-xl flex items-center justify-center p-4 font-sans text-white"
      >
        <div className="relative w-full max-w-2xl bg-[#0c0c0e] border border-white/10 rounded-2xl shadow-2xl p-6 md:p-8 overflow-hidden">
          {/* Top Close */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full text-white/50 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header Step Indicator */}
          <div className="flex items-center gap-2 mb-8">
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#3D81E3] bg-[#3D81E3]/10 px-3 py-1 rounded-full border border-[#3D81E3]/20">
              Workspace Setup
            </span>
            <span className="text-white/40 text-xs font-mono">• Step {step} of 3</span>
          </div>

          {/* STEP 1: Brand Info */}
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-2xl font-display font-light text-white tracking-tight">
                  Configure Your Brand Profile
                </h2>
                <p className="text-sm text-white/60 mt-1">
                  Dyvin will continuously monitor AI answer visibility for this brand across ChatGPT, Claude, Gemini & Perplexity.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-white/70 mb-2">
                    Brand Domain / Website
                  </label>
                  <div className="relative">
                    <Globe className="absolute left-3.5 top-3.5 w-4 h-4 text-white/40" />
                    <input
                      type="text"
                      value={domain}
                      onChange={(e) => setDomain(e.target.value)}
                      placeholder="acme.com"
                      className="w-full bg-white/[0.04] border border-white/15 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-[#3D81E3] transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-white/70 mb-2">
                    Brand Name
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3.5 top-3.5 w-4 h-4 text-white/40" />
                    <input
                      type="text"
                      value={brandName}
                      onChange={(e) => setBrandName(e.target.value)}
                      placeholder="Acme Corp"
                      className="w-full bg-white/[0.04] border border-white/15 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-[#3D81E3] transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-white/70 mb-2">
                    Industry Category
                  </label>
                  <input
                    type="text"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    placeholder="e.g. B2B SaaS, E-Commerce, Fintech"
                    className="w-full bg-white/[0.04] border border-white/15 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#3D81E3] transition-colors"
                  />
                </div>
              </div>

              <button
                onClick={() => setStep(2)}
                disabled={!brandName.trim()}
                className="w-full mt-4 flex items-center justify-center gap-2 bg-[#3D81E3] hover:bg-[#3D81E3]/90 text-white font-mono text-xs uppercase tracking-wider py-3.5 rounded-xl transition-all disabled:opacity-50"
              >
                Next: Select Competitors <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}

          {/* STEP 2: Competitor Tracking */}
          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-2xl font-display font-light text-white tracking-tight">
                  Track Key Competitors
                </h2>
                <p className="text-sm text-white/60 mt-1">
                  Measure share of voice and citation dominance against brands competing for the same AI queries.
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {selectedCompetitors.map((comp) => (
                    <button
                      key={comp}
                      onClick={() => toggleCompetitor(comp)}
                      className="flex items-center gap-2 px-3 py-2 bg-white/10 hover:bg-red-500/20 border border-white/20 hover:border-red-500/40 rounded-lg text-xs font-mono text-white transition-colors group"
                    >
                      <Check className="w-3.5 h-3.5 text-[#3D81E3] group-hover:hidden" />
                      <X className="w-3.5 h-3.5 text-red-400 hidden group-hover:block" />
                      <span>{comp}</span>
                    </button>
                  ))}
                </div>

                <form onSubmit={handleAddCompetitor} className="flex gap-2 mt-4">
                  <input
                    type="text"
                    value={newCompetitor}
                    onChange={(e) => setNewCompetitor(e.target.value)}
                    placeholder="Add competitor (e.g. Competitor.ai)"
                    className="flex-1 bg-white/[0.04] border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#3D81E3] transition-colors"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-mono text-xs uppercase rounded-xl transition-colors"
                  >
                    Add
                  </button>
                </form>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setStep(1)}
                  className="px-5 py-3.5 border border-white/20 hover:bg-white/5 text-white font-mono text-xs uppercase rounded-xl transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={startProvisioning}
                  className="flex-1 flex items-center justify-center gap-2 bg-[#3D81E3] hover:bg-[#3D81E3]/90 text-white font-mono text-xs uppercase tracking-wider py-3.5 rounded-xl transition-all"
                >
                  Launch Workspace <Sparkles className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: Provisioning Workspace */}
          {step === 3 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-10 text-center space-y-6"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#3D81E3]/15 border border-[#3D81E3]/30 text-[#3D81E3] mb-2 animate-pulse">
                <Shield className="w-8 h-8" />
              </div>

              <div>
                <h2 className="text-2xl font-display font-light text-white tracking-tight">
                  Provisioning Analytics Workspace
                </h2>
                <p className="text-sm text-white/60 mt-1">
                  Indexing answers across ChatGPT, Claude, Gemini & Perplexity for <span className="text-white font-semibold">{brandName}</span>...
                </p>
              </div>

              <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                <motion.div
                  className="bg-gradient-to-r from-[#3D81E3] to-blue-400 h-full rounded-full"
                  style={{ width: `${provisionProgress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>

              <div className="flex justify-between items-center text-xs font-mono text-white/40">
                <span>{provisionProgress < 50 ? 'Querying AI models...' : provisionProgress < 90 ? 'Calculating baseline visibility...' : 'Launching Overview...'}</span>
                <span>{provisionProgress}%</span>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
