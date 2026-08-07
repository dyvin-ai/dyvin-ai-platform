import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Search, Bot, Zap, Shield, BarChart3, Workflow,
  ArrowRight, Check, Star, Globe, Lock, Sparkles,
} from 'lucide-react';
import { Button } from '@components/ui/Button';

const FEATURES = [
  { icon: Search, title: 'AI Search Intelligence', description: 'Enterprise-grade semantic search across all your data sources with real-time indexing.', color: 'text-blue-500 bg-blue-500/10' },
  { icon: Bot, title: 'AI Workforce', description: 'Deploy autonomous AI agents that execute business processes independently.', color: 'text-violet-500 bg-violet-500/10' },
  { icon: Zap, title: 'Business Execution', description: 'Automate complex workflows across departments with AI-driven orchestration.', color: 'text-amber-500 bg-amber-500/10' },
  { icon: Shield, title: 'Runtime Security', description: 'Real-time threat detection, fraud prevention, and enterprise-grade protection.', color: 'text-green-500 bg-green-500/10' },
  { icon: BarChart3, title: 'Customer Intelligence', description: 'Deep customer insights, health scoring, and predictive retention analytics.', color: 'text-pink-500 bg-pink-500/10' },
  { icon: Workflow, title: 'Workflow Studio', description: 'Visual workflow builder for complex multi-step business automations.', color: 'text-indigo-500 bg-indigo-500/10' },
];

const STATS = [
  { value: '10M+', label: 'AI Tasks Executed' },
  { value: '99.99%', label: 'Platform Uptime' },
  { value: '500+', label: 'Enterprise Customers' },
  { value: '<50ms', label: 'Average Response Time' },
];

const TRUST_FEATURES = [
  'SOC 2 Type II Certified',
  'GDPR & CCPA Compliant',
  'End-to-end encryption',
  'SSO & SAML support',
  'Role-based access control',
  '24/7 Enterprise support',
];

const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function WelcomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* ── Nav ─────────────────────────────────────── */}
      <nav className="sticky top-0 z-sticky border-b border-border bg-background/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-500 to-primary flex items-center justify-center text-white font-bold text-sm shadow-md">
              D
            </div>
            <span className="font-bold text-foreground tracking-tight">Dyvin AI</span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#security" className="hover:text-foreground transition-colors">Security</a>
            <a href="#" className="hover:text-foreground transition-colors">Pricing</a>
            <a href="#" className="hover:text-foreground transition-colors">Docs</a>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/auth/login">
              <Button variant="ghost" size="sm">Sign in</Button>
            </Link>
            <Link to="/auth/register">
              <Button size="sm">Get started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-primary text-xs font-medium mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            Enterprise AI Platform — Now Generally Available
          </div>
          <h1 className="text-display-xl font-bold text-foreground mb-5 leading-[1.1] tracking-tight">
            The AI Operating System<br />
            <span className="bg-gradient-to-r from-brand-500 to-primary bg-clip-text text-transparent">
              for the Enterprise
            </span>
          </h1>
          <p className="text-body-xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
            Dyvin AI unifies Search Intelligence, AI Workforce, Business Execution, Security, and Governance into a single enterprise platform that works the moment you deploy it.
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Link to="/auth/register">
              <Button size="xl" rightIcon={<ArrowRight className="w-4 h-4" />} className="shadow-lg">
                Start for free
              </Button>
            </Link>
            <Button size="xl" variant="outline">
              Request a demo
            </Button>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            No credit card required · SOC 2 Certified · GDPR Compliant
          </p>
        </motion.div>

        {/* Hero glow */}
        <div className="relative mt-16">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-96 h-48 bg-primary/20 rounded-full blur-3xl" />
          </div>
          <div className="relative rounded-2xl border border-border bg-gradient-to-b from-card to-background shadow-2xl overflow-hidden">
            <div className="h-8 border-b border-border bg-muted/50 flex items-center gap-1.5 px-3">
              {['bg-danger', 'bg-warning', 'bg-success'].map((c, i) => (
                <div key={i} className={`w-2.5 h-2.5 rounded-full ${c}/70`} />
              ))}
            </div>
            <div className="p-6 grid grid-cols-3 gap-4">
              {[
                { label: 'AI Tasks Today', value: '24,891', change: '+18%', color: 'text-success' },
                { label: 'Active Agents', value: '142', change: '+6', color: 'text-primary' },
                { label: 'Security Score', value: '98.4', change: 'A+', color: 'text-warning' },
              ].map((m) => (
                <div key={m.label} className="p-4 rounded-xl border border-border bg-card">
                  <p className="text-xs text-muted-foreground mb-1">{m.label}</p>
                  <p className="text-2xl font-bold text-foreground">{m.value}</p>
                  <p className={`text-xs font-medium mt-0.5 ${m.color}`}>{m.change}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ───────────────────────────────────── */}
      <section className="border-y border-border bg-muted/30">
        <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-6">
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-3xl font-bold text-foreground mb-1">{s.value}</div>
              <div className="text-sm text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ────────────────────────────────── */}
      <section id="features" className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-heading-2xl text-foreground mb-3">Everything your enterprise needs</h2>
          <p className="text-body-lg text-muted-foreground max-w-xl mx-auto">
            One platform. Unlimited capability. Built for teams that can't afford to compromise.
          </p>
        </div>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {FEATURES.map((f) => (
            <motion.div
              key={f.title}
              variants={fadeInUp}
              className="p-6 rounded-xl border border-border bg-card hover:shadow-md transition-shadow group cursor-default"
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${f.color}`}>
                <f.icon className="w-5 h-5" />
              </div>
              <h3 className="text-heading-sm text-foreground mb-2 group-hover:text-primary transition-colors">
                {f.title}
              </h3>
              <p className="text-body-sm text-muted-foreground leading-relaxed">{f.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── Security / Trust ────────────────────────── */}
      <section id="security" className="bg-muted/30 border-y border-border">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-success/30 bg-success/5 text-success text-xs font-medium mb-4">
                <Shield className="w-3 h-3" />
                Enterprise Security
              </div>
              <h2 className="text-heading-2xl text-foreground mb-4">
                Security that never sleeps
              </h2>
              <p className="text-body-md text-muted-foreground mb-6">
                Dyvin AI Runtime Security monitors every request in real-time, detecting fraud, bots, anomalous behavior, and threats before they impact your business.
              </p>
              <div className="grid grid-cols-2 gap-2">
                {TRUST_FEATURES.map((f) => (
                  <div key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="w-3.5 h-3.5 text-success flex-shrink-0" />
                    {f}
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-3">
              {[
                { icon: Shield, label: 'Threat blocked', time: 'Just now', color: 'text-success bg-success/10' },
                { icon: Globe, label: 'Suspicious login detected (TOR)', time: '2m ago', color: 'text-warning bg-warning/10' },
                { icon: Lock, label: 'Credential stuffing prevented', time: '5m ago', color: 'text-danger bg-danger/10' },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-3 p-4 rounded-xl border border-border bg-card"
                >
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${item.color}`}>
                    <item.icon className="w-4.5 h-4.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.time}</p>
                  </div>
                  <span className="w-2 h-2 rounded-full bg-success animate-pulse flex-shrink-0" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 py-20 text-center">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="flex items-center justify-center gap-1 mb-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="w-4 h-4 text-warning fill-warning" />
            ))}
          </div>
          <h2 className="text-heading-2xl text-foreground">
            Ready to transform your enterprise?
          </h2>
          <p className="text-body-lg text-muted-foreground">
            Join hundreds of organizations using Dyvin AI to automate, secure, and scale their operations.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link to="/auth/register">
              <Button size="xl" rightIcon={<ArrowRight className="w-4 h-4" />} className="shadow-lg">
                Get started free
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────── */}
      <footer className="border-t border-border bg-muted/20">
        <div className="max-w-6xl mx-auto px-6 py-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-brand-500 to-primary flex items-center justify-center text-white font-bold text-xs">
              D
            </div>
            <span className="text-sm font-semibold text-foreground">Dyvin AI</span>
          </div>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Dyvin AI. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <a href="#" className="hover:text-foreground">Privacy</a>
            <a href="#" className="hover:text-foreground">Terms</a>
            <a href="#" className="hover:text-foreground">Security</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
