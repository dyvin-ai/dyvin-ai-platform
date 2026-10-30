import React from 'react';
import { motion } from 'motion/react';
import { SectionEyebrow } from './primitives';

export const Testimonials: React.FC = () => {
  const testimonials = [
    {
      quote: "DYVIN AI gave our leadership team complete visibility into how ChatGPT & Perplexity cite us. It feels like brand intelligence from the future.",
      author: "Parker Wilf",
      role: "Group Product Manager",
      company: "MERCURY"
    },
    {
      quote: "The citation tracking alone has changed how we optimize our press & documentation. I can't imagine operating without DYVIN AI.",
      author: "Andrew von Rosenbach",
      role: "Senior Engineering Program Manager",
      company: "COHERE"
    },
    {
      quote: "Triage that actually understands AI model context. Our marketing and product teams stopped dreading AI search disruption.",
      author: "Mathies Christensen",
      role: "Engineering Manager",
      company: "LUNAR"
    }
  ];

  return (
    <section className="max-w-6xl mx-auto px-6 py-20 md:py-28 border-t border-white/10 relative z-10">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <SectionEyebrow label="BUILT FOR TEAMS NAVIGATING THE AI ERA" />
        
        <h2 className="mt-4 text-3xl sm:text-5xl font-semibold tracking-tight font-display text-white">
          Trusted by modern leaders
        </h2>
        
        <p className="mt-4 text-white/60 text-base md:text-lg leading-[1.6]">
          DYVIN helps modern teams understand and improve their presence wherever AI influences discovery and decisions.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map((t, i) => (
          <motion.figure
            key={t.author}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            className="liquid-glass rounded-2xl p-6 border border-white/10 flex flex-col justify-between hover:border-[#00d2ff]/40 transition-all"
          >
            <blockquote className="text-sm text-white/80 leading-[1.7] italic">
              "{t.quote}"
            </blockquote>
            
            <figcaption className="mt-6 pt-5 border-t border-white/10">
              <div className="text-sm font-semibold text-white font-display">{t.author}</div>
              <div className="text-xs text-white/50">{t.role}</div>
              <div className="text-xs font-semibold tracking-wide text-[#00d2ff] uppercase mt-1">
                {t.company}
              </div>
            </figcaption>
          </motion.figure>
        ))}
      </div>
    </section>
  );
};
