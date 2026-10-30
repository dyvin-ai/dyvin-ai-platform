import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Search, Globe, Wifi, Battery } from 'lucide-react';
import { LogoMark } from './primitives';

export const MacMenuBar: React.FC = () => {
  const [timeStr, setTimeStr] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      };
      setTimeStr(now.toLocaleDateString('en-US', options).replace(',', ''));
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  const menuItems = ['File', 'Edit', 'View', 'Go', 'Window', 'Help'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.9 }}
      className="w-full h-10 bg-black/40 backdrop-blur-md border-t border-b border-white/10 select-none z-20"
    >
      <div className="max-w-6xl mx-auto px-6 h-full flex items-center justify-between text-xs text-white/70">
        {/* Left cluster */}
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-2">
            <LogoMark className="w-3.5 h-3.5 text-white" />
            <span className="font-bold text-white font-display tracking-tight">DYVIN AI</span>
          </div>

          <div className="flex items-center gap-4">
            {menuItems.map((item, idx) => (
              <span
                key={item}
                className={`hover:text-white cursor-pointer transition-colors ${
                  idx > 3 ? 'hidden md:inline' : idx > 2 ? 'hidden sm:inline' : 'inline'
                }`}
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* Right cluster */}
        <div className="flex items-center gap-4 text-white/60">
          <div className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[11px]">
            <Globe className="w-3 h-3 text-[#00d2ff]" />
            <span>AI Search Live</span>
          </div>
          <Search className="w-3.5 h-3.5 hover:text-white cursor-pointer" />
          <Wifi className="w-3.5 h-3.5 hidden sm:block" />
          <Battery className="w-3.5 h-3.5 hidden sm:block" />
          <span className="font-medium text-white/80 text-[11px]">{timeStr || 'Wed May 6 1:09 PM'}</span>
        </div>
      </div>
    </motion.div>
  );
};
