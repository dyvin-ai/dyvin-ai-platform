import React, { useState } from 'react';

interface PricingSectionProps {
  onOpenAuth: () => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({ onOpenAuth }) => {
  const [yearly, setYearly] = useState(false);

  const plans = [
    {
      name: 'Free',
      price: '$0',
      desc: 'For creators and startups taking their first steps with DYVIN AI.',
      features: [
        'Up to 3 brand projects in the cloud',
        'Basic AI search model indexing',
        'Monthly AI visibility summary',
        '5 core AI search model tracking',
        'Access via web dashboard'
      ],
      isPro: false
    },
    {
      name: 'Standard',
      price: yearly ? '$99,99/y' : '$9,99/m',
      desc: 'For growth teams and freelancers who need deeper AI search intelligence.',
      features: [
        'Up to 50 brand projects in the cloud',
        'Real-time citation & source tracking',
        'Daily automated AI model updates',
        'Team collaboration (up to 5 members)',
        'Access to competitor gap analytics'
      ],
      isPro: false
    },
    {
      name: 'Pro',
      price: yearly ? '$199,99/y' : '$19,99/m',
      desc: 'For enterprise brands, agencies, and market leaders requiring full AI dominance.',
      features: [
        'Unlimited brand projects',
        'Instant 24/7 AI model re-indexing',
        'Automated citation optimization tools',
        'Unlimited team members',
        'White-label AI search reports'
      ],
      isPro: true
    }
  ];

  return (
    <section id="pricing" className="c3-pricing-section z-10">
      {/* SVG noise filter specifically for pricing watermark overlay */}
      <svg style={{ position: 'absolute', width: 0, height: 0, pointerEvents: 'none' }}>
        <filter id="c3-noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.5" numOctaves="2" stitchTiles="stitch" />
          <feComponentTransfer><feFuncA type="linear" slope="0.075" /></feComponentTransfer>
          <feComposite in2="SourceGraphic" operator="in" result="noise" />
          <feBlend in="SourceGraphic" in2="noise" mode="overlay" />
        </filter>
      </svg>

      {/* Watermark */}
      <div className="c3-watermark-container select-none">
        <div className="c3-watermark-main">
          <span className="c3-watermark-line-1">Your brand.</span>
          <span className="c3-watermark-line-2">Revitalized</span>
        </div>
      </div>

      {/* Yearly Toggle */}
      <div className="c3-toggle-wrap">
        <span className="text-sm font-medium text-white/70">Bill Yearly (Save 20%)</span>
        <button
          onClick={() => setYearly(!yearly)}
          className={`c3-toggle ${yearly ? 'active' : ''}`}
          aria-label="Toggle billing plan"
        >
          <div className="c3-toggle-knob" />
        </button>
      </div>

      {/* Pricing Cards Grid */}
      <div className="c3-grid">
        {plans.map((plan) => (
          <div key={plan.name} className={`c3-card ${plan.isPro ? 'c3-card-pro' : ''}`}>
            <div className="c3-tier-small">{plan.name}</div>
            <div className="c3-tier-large font-display">{plan.price}</div>
            <div className="c3-desc">{plan.desc}</div>

            <ul className="c3-list">
              {plan.features.map((feat) => (
                <li key={feat}>
                  <div className="c3-check">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <span>{feat}</span>
                </li>
              ))}
            </ul>

            <button onClick={onOpenAuth} className="c3-btn">
              Choose Plan
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};
