import React from 'react';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';

export function AuthLayout() {
  return (
    <div className="min-h-screen bg-background flex">
      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-sidebar relative overflow-hidden flex-col justify-between p-12">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
            backgroundSize: '32px 32px',
          }} />
        </div>
        {/* Glow orb */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-500 rounded-full blur-3xl opacity-10" />

        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-brand-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">
              D
            </div>
            <span className="text-xl font-bold text-white tracking-tight">Dyvin AI</span>
          </div>
        </div>

        <div className="relative z-10 space-y-4">
          <p className="text-sidebar-foreground/50 text-overline tracking-widest uppercase">Enterprise AI Platform</p>
          <h2 className="text-3xl font-bold text-white leading-tight">
            The most advanced<br />AI Search Intelligence<br />platform for enterprises.
          </h2>
          <p className="text-sidebar-foreground/60 text-body-md max-w-sm">
            Autonomous business execution, real-time threat protection, and enterprise-grade AI governance.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-6">
          {[{ label: '1M+', sub: 'Organizations' }, { label: '99.4', sub: 'Security Score' }, { label: 'A+', sub: 'Enterprise Grade' }].map((s) => (
            <div key={s.label}>
              <div className="text-2xl font-bold text-white">{s.label}</div>
              <div className="text-xs text-sidebar-foreground/50">{s.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-md"
        >
          <Outlet />
        </motion.div>
      </div>
    </div>
  );
}
