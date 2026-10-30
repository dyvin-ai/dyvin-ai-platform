import React from 'react';

interface MarqueeStripProps {
  items: string[];
  direction?: 'left' | 'right';
  speed?: 'normal' | 'slow' | 'fast';
  theme?: 'light' | 'dark' | 'purple';
  subtle?: boolean;
}

export const MarqueeStrip: React.FC<MarqueeStripProps> = ({
  items,
  direction = 'left',
  theme = 'light',
  subtle = false
}) => {
  const content = items.join(' ✦ ');

  return (
    <div
      className={`w-full overflow-hidden whitespace-nowrap py-4 sm:py-6 border-y select-none ${
        theme === 'dark'
          ? 'bg-[#0B0F19] text-white border-slate-800'
          : theme === 'purple'
            ? 'bg-dyvin-purple text-white border-dyvin-indigo'
            : 'bg-slate-50/80 text-[#0B0F19] border-slate-200/80'
      }`}
    >
      <div className={direction === 'left' ? 'animate-marquee-left' : 'animate-marquee-right'}>
        <span
          className={`font-display font-black text-2xl sm:text-4xl md:text-5xl uppercase tracking-tighter mx-4 ${
            subtle ? 'opacity-40' : 'opacity-90'
          }`}
        >
          {content} ✦ {content} ✦ {content} ✦ {content} ✦
        </span>
        <span
          className={`font-display font-black text-2xl sm:text-4xl md:text-5xl uppercase tracking-tighter mx-4 ${
            subtle ? 'opacity-40' : 'opacity-90'
          }`}
        >
          {content} ✦ {content} ✦ {content} ✦ {content} ✦
        </span>
      </div>
    </div>
  );
};
