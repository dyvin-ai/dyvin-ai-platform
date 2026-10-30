import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, ArrowRight, Sun, Moon, LayoutDashboard, Layers, Sparkles } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface NavbarProps {
  onOpenAuth: (domain?: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAuth }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Product', id: 'dashboard-mockup', icon: LayoutDashboard },
    { label: 'Platform', id: 'ai-visibility', icon: Layers },
    { label: 'Intelligence', id: 'features', icon: Sparkles },
  ];

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const isLight = theme === 'light';

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 w-full select-none transition-all duration-300 ${
        scrolled
          ? isLight
            ? 'bg-[#FBFBFC]/90 backdrop-blur-2xl border-b border-slate-200/80 shadow-[0_4px_24px_-4px_rgba(11,15,25,0.04)] py-2.5'
            : 'bg-black/90 backdrop-blur-2xl border-b border-white/[0.08] shadow-[0_12px_36px_-10px_rgba(0,0,0,0.9)] py-2.5'
          : isLight
            ? 'bg-[#FBFBFC]/70 backdrop-blur-xl border-b border-slate-200/40 py-3.5'
            : 'bg-black/70 backdrop-blur-xl border-b border-white/[0.04] py-3.5'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
        
        {/* Left: Enterprise Logo */}
        <div
          className="flex items-center gap-2.5 cursor-pointer transition-opacity hover:opacity-90 group"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <img
            src="/dyvin-logo-white.png"
            alt="Dyvin AI"
            className={`w-7 h-7 object-contain group-hover:scale-105 transition-transform ${isLight ? 'brightness-0' : ''}`}
          />
          <span className={`font-bold text-base tracking-tight font-display ${isLight ? 'text-slate-900' : 'text-white'}`}>
            Dyvin AI
          </span>
        </div>

        {/* Center: Apple iOS-Style Individual Boxed Nav Items with Lucide Icons */}
        <nav className="hidden lg:flex items-center gap-2">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => scrollToSection(item.id)}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border text-xs font-medium transition-all cursor-pointer backdrop-blur-2xl ${
                isLight
                  ? 'border-black/[0.06] bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900 hover:border-black/[0.12] hover:shadow-xs'
                  : 'border-white/[0.08] bg-[#0C0C10]/60 text-white/80 hover:bg-white/[0.08] hover:text-white hover:border-white/[0.18] hover:shadow-xs'
              }`}
            >
              <item.icon className="size-3.5 opacity-70 stroke-[1.75]" />
              <span>{item.label}</span>
            </button>
          ))}

          <a
            href="/overview"
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border text-xs font-medium transition-all cursor-pointer backdrop-blur-2xl ${
              isLight
                ? 'border-emerald-200/80 bg-emerald-50/40 text-emerald-950 hover:bg-emerald-50 hover:border-emerald-300'
                : 'border-emerald-500/20 bg-emerald-950/20 text-emerald-300 hover:bg-emerald-950/40 hover:border-emerald-500/40'
            }`}
          >
            <span className="size-2 rounded-full bg-emerald-500 ring-2 ring-emerald-500/30 animate-pulse live-indicator-glow" />
            <span>Live Workspace</span>
          </a>
        </nav>

        {/* Right: Actions Container with EXACTLY ONE Universal Theme Toggle Button */}
        <div className="flex items-center gap-2.5">
          
          {/* Single Universal Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className={`size-9 rounded-xl flex items-center justify-center border transition-all cursor-pointer backdrop-blur-2xl ${
              isLight
                ? 'border-black/[0.06] bg-white text-slate-700 hover:bg-slate-50 hover:border-black/[0.12]'
                : 'border-white/[0.08] bg-[#0C0C10]/60 text-white/80 hover:bg-white/[0.08] hover:text-white hover:border-white/[0.18]'
            }`}
            title={isLight ? 'Switch to dark theme' : 'Switch to light theme'}
          >
            {isLight ? <Moon className="size-4 text-slate-700 stroke-[1.75]" /> : <Sun className="size-4 text-amber-300 stroke-[1.75]" />}
          </button>

          {/* Desktop Log In Button */}
          <button
            onClick={() => onOpenAuth(undefined)}
            className={`hidden sm:inline-flex text-xs font-medium px-3 py-2 transition-colors cursor-pointer ${
              isLight ? 'text-slate-700 hover:text-slate-900' : 'text-white/80 hover:text-white'
            }`}
          >
            Log in
          </button>

          {/* Apple iOS-Style Primary Action CTA */}
          <button
            onClick={() => onOpenAuth(undefined)}
            className={`inline-flex items-center gap-1.5 rounded-xl text-xs font-semibold px-4 py-2 active:scale-[0.985] transition-all cursor-pointer shadow-sm ${
              isLight
                ? 'bg-slate-900 text-white hover:bg-slate-800'
                : 'bg-white text-black hover:bg-white/90 shadow-white/10'
            }`}
          >
            <span>Analyze your brand</span>
            <ArrowRight className="size-3.5 stroke-[2]" />
          </button>

          {/* Mobile Hamburger Toggle (No extra theme button) */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`lg:hidden size-9 rounded-xl border flex items-center justify-center cursor-pointer transition-colors ${
              isLight ? 'border-slate-200 bg-white text-slate-800' : 'border-white/10 bg-white/5 text-white/80 hover:bg-white/10'
            }`}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="size-4 stroke-[1.75]" /> : <Menu className="size-4 stroke-[1.75]" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer Menu with Apple iOS Glass Feel */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className={`lg:hidden border-b px-6 py-6 backdrop-blur-2xl ${
              isLight
                ? 'bg-[#FBFBFC]/95 border-slate-200 text-slate-900 shadow-xl'
                : 'bg-black/95 border-white/10 text-white shadow-2xl'
            }`}
          >
            <div className="flex flex-col gap-3">
              {navItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => scrollToSection(item.id)}
                  className={`flex items-center gap-3 text-left text-sm font-medium py-2.5 px-3 rounded-xl border transition-colors ${
                    isLight
                      ? 'border-slate-200 bg-white text-slate-800 hover:bg-slate-50'
                      : 'border-white/5 bg-[#0C0C10]/60 text-white/80 hover:bg-white/[0.08] hover:text-white'
                  }`}
                >
                  <item.icon className="size-4 opacity-70 stroke-[1.75]" />
                  <span>{item.label}</span>
                </button>
              ))}
              
              <a
                href="/overview"
                className={`flex items-center justify-between text-left text-sm font-medium py-2.5 px-3 rounded-xl border transition-colors ${
                  isLight
                    ? 'border-emerald-200 bg-emerald-50/50 text-emerald-950'
                    : 'border-emerald-500/20 bg-emerald-950/30 text-emerald-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-emerald-500 animate-pulse live-indicator-glow" />
                  <span>Live Workspace</span>
                </div>
                <ArrowRight className="size-3.5 opacity-60 stroke-[1.75]" />
              </a>

              <div className="flex flex-col gap-2.5 pt-4 border-t border-slate-200/60 dark:border-white/5">
                <button
                  onClick={() => { setMobileMenuOpen(false); onOpenAuth(undefined); }}
                  className={`w-full py-2.5 rounded-xl border font-medium text-xs text-center ${
                    isLight ? 'border-slate-300 text-slate-800 bg-white' : 'border-white/15 text-white bg-white/5'
                  }`}
                >
                  Log in
                </button>
                <button
                  onClick={() => { setMobileMenuOpen(false); onOpenAuth(undefined); }}
                  className={`w-full py-2.5 rounded-xl font-bold text-xs text-center flex items-center justify-center gap-1.5 ${
                    isLight ? 'bg-slate-900 text-white' : 'bg-white text-black'
                  }`}
                >
                  <span>Analyze your brand</span>
                  <ArrowRight className="size-3.5 stroke-[2]" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
