import React from 'react';
import { ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { XSocialLogo, LinkedInLogo, YouTubeLogo } from './ModelLogos';
import { useTheme } from '../context/ThemeContext';

interface FooterProps {
  onOpenAuth?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAuth }) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className={`w-full border-t py-14 md:py-20 relative z-10 text-xs select-none transition-colors ${
      isLight
        ? 'bg-white border-slate-200/80 text-slate-600'
        : 'bg-[#000000] border-white/[0.08] text-white/60'
    }`}>
      <div className="max-w-6xl mx-auto px-6 space-y-12">
        
        {/* Top Section: Brand Identity Block & Persistent Navigation Action */}
        <div className={`flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-10 border-b ${
          isLight ? 'border-slate-100' : 'border-white/[0.06]'
        }`}>
          <div className="space-y-2 max-w-md">
            <div className="flex items-center gap-3">
              <img
                src="/dyvin-logo-white.png"
                alt="Dyvin AI"
                className={`size-7 object-contain ${isLight ? 'brightness-0' : ''}`}
              />
              <span className={`font-semibold text-lg tracking-tight font-display ${isLight ? 'text-slate-900' : 'text-white'}`}>
                Dyvin AI
              </span>
            </div>
            <p className={`text-xs leading-relaxed font-sans ${isLight ? 'text-slate-500' : 'text-white/50'}`}>
              AI presence intelligence for brands navigating generative discovery.
            </p>
          </div>

          {/* Subordinate Persistent CTA */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => (onOpenAuth ? onOpenAuth() : (window.location.href = '/overview'))}
              className={`inline-flex items-center gap-1.5 rounded-xl font-semibold text-xs px-5 py-3 active:scale-[0.985] transition-all cursor-pointer shadow-sm ${
                isLight
                  ? 'bg-slate-900 text-white hover:bg-slate-800'
                  : 'bg-white text-black hover:bg-white/90 shadow-white/10'
              }`}
            >
              <span>Analyze your brand</span>
              <ArrowRight className="size-3.5" />
            </button>
          </div>
        </div>

        {/* Middle Section: Disciplined 4-Column Enterprise Architecture */}
        <nav aria-label="Footer Navigation" className="grid grid-cols-2 md:grid-cols-4 gap-8">
          
          {/* Column 1: Product Navigation */}
          <div>
            <h4 className={`font-mono text-[10px] uppercase tracking-[0.14em] mb-4 font-bold ${
              isLight ? 'text-slate-400' : 'text-white/40'
            }`}>
              Product
            </h4>
            <ul className="space-y-2.5 font-sans">
              <li>
                <button
                  onClick={() => scrollTo('ai-visibility')}
                  className="hover:text-brand transition-colors cursor-pointer text-left focus:outline-hidden focus:underline"
                >
                  AI Visibility
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('answer-monitoring')}
                  className="hover:text-brand transition-colors cursor-pointer text-left focus:outline-hidden focus:underline"
                >
                  Prompt Intelligence
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('features')}
                  className="hover:text-brand transition-colors cursor-pointer text-left focus:outline-hidden focus:underline"
                >
                  Citation Intelligence
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('features')}
                  className="hover:text-brand transition-colors cursor-pointer text-left focus:outline-hidden focus:underline"
                >
                  Competitor Intelligence
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('model-coverage')}
                  className="hover:text-brand transition-colors cursor-pointer text-left focus:outline-hidden focus:underline"
                >
                  Model Ecosystem
                </button>
              </li>
            </ul>
          </div>

          {/* Column 2: Workspace Navigation */}
          <div>
            <h4 className={`font-mono text-[10px] uppercase tracking-[0.14em] mb-4 font-bold ${
              isLight ? 'text-slate-400' : 'text-white/40'
            }`}>
              Workspace
            </h4>
            <ul className="space-y-2.5 font-sans">
              <li>
                <a href="/overview" className="hover:text-brand transition-colors focus:outline-hidden focus:underline">
                  Overview Dashboard
                </a>
              </li>
              <li>
                <a href="/prompts" className="hover:text-brand transition-colors focus:outline-hidden focus:underline">
                  Prompt Analysis
                </a>
              </li>
              <li>
                <a href="/competitors" className="hover:text-brand transition-colors focus:outline-hidden focus:underline">
                  Competitor Radar
                </a>
              </li>
              <li>
                <a href="/sources" className="hover:text-brand transition-colors focus:outline-hidden focus:underline">
                  Source Intelligence
                </a>
              </li>
              <li>
                <a href="/visibility" className="hover:text-brand transition-colors focus:outline-hidden focus:underline">
                  Model Analytics
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Resources & Intelligence */}
          <div>
            <h4 className={`font-mono text-[10px] uppercase tracking-[0.14em] mb-4 font-bold ${
              isLight ? 'text-slate-400' : 'text-white/40'
            }`}>
              Resources
            </h4>
            <ul className="space-y-2.5 font-sans">
              <li>
                <a href="/reports" className="hover:text-brand transition-colors focus:outline-hidden focus:underline">
                  Executive Reports
                </a>
              </li>
              <li>
                <a href="/insights" className="hover:text-brand transition-colors focus:outline-hidden focus:underline">
                  Intelligence Feed
                </a>
              </li>
              <li>
                <a href="/agents" className="hover:text-brand transition-colors focus:outline-hidden focus:underline">
                  Autonomous Agents
                </a>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('dashboard-mockup')}
                  className="hover:text-brand transition-colors cursor-pointer text-left focus:outline-hidden focus:underline"
                >
                  Enterprise Audit
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Company & Security */}
          <div>
            <h4 className={`font-mono text-[10px] uppercase tracking-[0.14em] mb-4 font-bold ${
              isLight ? 'text-slate-400' : 'text-white/40'
            }`}>
              Company
            </h4>
            <ul className="space-y-2.5 font-sans">
              <li>
                <a href="/settings" className="hover:text-brand transition-colors focus:outline-hidden focus:underline">
                  System Settings
                </a>
              </li>
              <li>
                <a href="/settings" className="hover:text-brand transition-colors focus:outline-hidden focus:underline">
                  Security & Compliance
                </a>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('framework')}
                  className="hover:text-brand transition-colors cursor-pointer text-left focus:outline-hidden focus:underline"
                >
                  Operating Model
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('audiences')}
                  className="hover:text-brand transition-colors cursor-pointer text-left focus:outline-hidden focus:underline"
                >
                  Target Audiences
                </button>
              </li>
            </ul>
          </div>

        </nav>

        {/* Bottom Section: Copyright, Legal & Authentic Social Marks */}
        <div className={`pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono ${
          isLight ? 'border-slate-100 text-slate-400' : 'border-white/[0.06] text-white/40'
        }`}>
          <div>
            © 2026 Dyvin AI Inc. All rights reserved.
          </div>

          <div className="flex items-center gap-6">
            <span className="hover:text-brand transition-colors cursor-pointer">Privacy</span>
            <span className="hover:text-brand transition-colors cursor-pointer">Terms</span>
            <span className="hover:text-brand transition-colors cursor-pointer">Security</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-emerald-500 font-semibold">
              <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Operational</span>
            </div>
            <div className="flex items-center gap-3 pl-2 border-l border-slate-200 dark:border-white/10">
              <XSocialLogo className={`size-3.5 ${isLight ? 'text-slate-700' : 'text-white'}`} />
              <LinkedInLogo className="size-3.5" />
              <YouTubeLogo className="size-3.5" />
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
};
