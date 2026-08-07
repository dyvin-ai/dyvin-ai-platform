import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

export function PageLoader({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-64 gap-4">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      >
        <Loader2 className="w-6 h-6 text-muted-foreground" />
      </motion.div>
      <p className="text-body-sm text-muted-foreground">{message}</p>
    </div>
  );
}

export function GlobalLoadingOverlay({ message }: { message?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-overlay bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center gap-4"
    >
      <div className="w-12 h-12 rounded-2xl bg-brand-500 flex items-center justify-center shadow-xl">
        <span className="text-white font-bold text-lg">D</span>
      </div>
      <div className="flex items-center gap-2 text-muted-foreground text-sm">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span>{message || 'Loading...'}</span>
      </div>
    </motion.div>
  );
}
