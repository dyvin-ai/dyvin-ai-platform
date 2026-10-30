import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import './landing.css';
import { useTheme } from './context/ThemeContext';

/* ─────────────────────── ICON SYSTEM ─────────────────────────────────── */
type IP = { size?: number; className?: string; style?: React.CSSProperties };
const I = (d: string) => ({ size = 16, className = '', style }: IP) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    className={className} style={style} dangerouslySetInnerHTML={{ __html: d }} />
);
const Ico = {
  Sun:      I('<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>'),
  Moon:     I('<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>'),
  Menu:     I('<line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/>'),
  X:        I('<path d="M18 6 6 18M6 6l12 12"/>'),
  Arrow:    I('<path d="M5 12h14M12 5l7 7-7 7"/>'),
  ArrowUR:  I('<path d="M7 17 17 7M7 7h10v10"/>'),
  Check:    I('<path d="M20 6 9 17l-5-5"/>'),
  Search:   I('<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>'),
  Eye:      I('<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>'),
  Trend:    I('<polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>'),
  Activity: I('<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>'),
  Target:   I('<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>'),
  Bar:      I('<line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>'),
  File:     I('<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/>'),
  Users:    I('<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>'),
  Db:       I('<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5"/><path d="M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3"/>'),
  Refresh:  I('<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>'),
  Bulb:     I('<path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/>'),
  Play:     I('<polygon points="6 3 20 12 6 21 6 3"/>'),
  Brief:    I('<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>'),
  Msg:      I('<path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/>'),
  Link:     I('<path d="M9 17H7A5 5 0 0 1 7 7h2"/><path d="M15 7h2a5 5 0 1 1 0 10h-2"/><line x1="8" y1="12" x2="16" y2="12"/>'),
  Lock:     I('<rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>'),
  Map:      I('<path d="M3 6l6-3 6 3 6-3v15l-6 3-6-3-6 3z"/><line x1="9" y1="3" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="21"/>'),
  Shield:   I('<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>'),
  Layers:   I('<path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>'),
  Compass:  I('<circle cx="12" cy="12" r="10"/><path d="M16.24 7.76l-2.12 6.36-6.36 2.12 2.12-6.36 6.36-2.12z"/>'),
  Star:     I('<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>'),
  Zap:      I('<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>'),
};

/* ─────────────────────── OFFICIAL DYVIN AI LOGO (REFERENCE IMAGE 4) ──── */
export const DyvinLogo = ({ size = 28, fill, className, style }: { size?: number; fill?: string; className?: string; style?: React.CSSProperties }) => (
  <svg
    width={size}
    height={size}
    viewBox="14 18 64 60"
    fill="none"
    className={className}
    style={{ flexShrink: 0, display: 'inline-block', verticalAlign: 'middle', ...style }}
  >
    {/* Stylized Speech-Bubble Frame D */}
    <path
      d="M36 24 H74 V72 H36 V56 H46 L51 64 H64 V32 H46 V24 H36 Z"
      fill={fill ?? "currentColor"}
    />
    {/* Inner AI 4-pointed Sparkle */}
    <path
      d="M55 40 C55 45 50.5 48 45.5 48 C50.5 48 55 51 55 56 C55 51 59.5 48 64.5 48 C59.5 48 55 45 55 40 Z"
      fill={fill ?? "currentColor"}
    />
    {/* 4 Floating Pixel/Data Squares on Left */}
    <rect x="25" y="34" width="6.5" height="6.5" fill={fill ?? "currentColor"} />
    <rect x="31.5" y="41" width="9.5" height="9.5" fill={fill ?? "currentColor"} />
    <rect x="16" y="48" width="4.5" height="4.5" fill={fill ?? "currentColor"} />
    <rect x="23" y="52" width="8" height="8" fill={fill ?? "currentColor"} />
  </svg>
);

/* ─────────────────────── AUTHENTIC BRAND GLYPHS & 1:1 APP TILES ────────── */
export const BrandGlyph = {
  ChatGPT: ({ size = 18, fill = 'currentColor', style }: { size?: number; fill?: string; style?: React.CSSProperties }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} style={style}>
      <path d="M22.28 9.82a5.98 5.98 0 0 0-.51-4.91 6.05 6.05 0 0 0-6.51-2.9A6.06 6.06 0 0 0 4.98 4.18a5.98 5.98 0 0 0-4 2.9 6.05 6.05 0 0 0 .74 7.1 5.98 5.98 0 0 0 .51 4.91 6.05 6.05 0 0 0 6.52 2.9A5.98 5.98 0 0 0 13.26 24a6.05 6.05 0 0 0 5.77-4.2 5.99 5.99 0 0 0 4-2.9 6.05 6.05 0 0 0-.75-7.08zm-9.02 12.61a4.48 4.48 0 0 1-2.88-1.04l.14-.08 4.78-2.76a.8.8 0 0 0 .4-.68v-6.74l2.02 1.17a.07.07 0 0 1 .04.05v5.58a4.5 4.5 0 0 1-4.5 4.5zm-9.66-4.13a4.47 4.47 0 0 1-.53-3.01l.14.08 4.78 2.76a.77.77 0 0 0 .78 0l5.85-3.37v2.33a.08.08 0 0 1-.03.06L9.74 19.95a4.5 4.5 0 0 1-6.14-1.65zM2.34 7.9a4.48 4.48 0 0 1 2.37-1.98v5.68a.77.77 0 0 0 .38.68l5.82 3.35-2.02 1.17a.08.08 0 0 1-.07 0l-4.83-2.79A4.5 4.5 0 0 1 2.34 7.87zm16.6 3.85L13.1 8.36 15.12 7.2a.08.08 0 0 1 .07 0l4.83 2.79a4.5 4.5 0 0 1-.67 8.1v-5.67a.79.79 0 0 0-.41-.67zm2.01-3.02l-.14-.08-4.77-2.78a.78.78 0 0 0-.79 0L9.4 9.23V6.9a.07.07 0 0 1 .03-.06l4.83-2.79a4.5 4.5 0 0 1 6.68 4.66zM8.3 12.86l-2.01-1.16a.08.08 0 0 1-.04-.06V6.07a4.5 4.5 0 0 1 7.37-3.45l-.14.08L8.7 5.46a.8.8 0 0 0-.4.68zm1.1-2.37l2.6-1.5 2.6 1.5v3l-2.6 1.5-2.6-1.5z"/>
    </svg>
  ),
  Claude: ({ size = 18, fill = 'currentColor', style }: { size?: number; fill?: string; style?: React.CSSProperties }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} style={style}>
      <path d="M12 2a1.5 1.5 0 0 1 1.5 1.5v3.38l2.4-2.4a1.5 1.5 0 0 1 2.12 2.12l-2.4 2.4H19.5a1.5 1.5 0 0 1 0 3h-3.38l2.4 2.4a1.5 1.5 0 1 1-2.12 2.12l-2.4-2.4V19.5a1.5 1.5 0 0 1-3 0v-3.38l-2.4 2.4a1.5 1.5 0 0 1-2.12-2.12l2.4-2.4H4.5a1.5 1.5 0 0 1 0-3h3.38l-2.4-2.4a1.5 1.5 0 1 1 2.12-2.12l2.4 2.4V3.5A1.5 1.5 0 0 1 12 2z"/>
    </svg>
  ),
  Gemini: ({ size = 18, fill, style }: { size?: number; fill?: string; style?: React.CSSProperties }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
      <path d="M12 1C12 7.075 7.075 12 1 12C7.075 12 12 16.925 12 23C12 16.925 16.925 12 23 12C16.925 12 12 7.075 12 1Z" fill={fill ?? "url(#gemini-sparkle-grad)"} />
      <defs>
        <linearGradient id="gemini-sparkle-grad" x1="1" y1="1" x2="23" y2="23" gradientUnits="userSpaceOnUse">
          <stop stopColor="#4E82EE" />
          <stop offset="0.5" stopColor="#7B61FF" />
          <stop offset="1" stopColor="#E26A96" />
        </linearGradient>
      </defs>
    </svg>
  ),
  Perplexity: ({ size = 18, fill = 'currentColor', style }: { size?: number; fill?: string; style?: React.CSSProperties }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
      <path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M4.93 19.07l14.14-14.14" stroke={fill} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
      <rect x="7" y="7" width="10" height="10" rx="1.5" stroke={fill} strokeWidth="1.8" fill="none"/>
    </svg>
  ),
  Copilot: ({ size = 18, fill, style }: { size?: number; fill?: string; style?: React.CSSProperties }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
      <path d="M15 3.5C12 3.5 10 5.5 9 7.5L5.5 13.5C4 16 5 19.5 8 21C11 22.5 14.5 21.5 16.5 19L19.5 14.5C21 12 20 8.5 17 7C16.5 6.7 15.8 6.5 15 6.5" stroke={fill ?? "url(#copilot-strip-grad)"} strokeWidth="2.8" strokeLinecap="round"/>
      <defs>
        <linearGradient id="copilot-strip-grad" x1="3" y1="3" x2="21" y2="21">
          <stop stopColor="#0078D4"/>
          <stop offset="0.5" stopColor="#6E40C9"/>
          <stop offset="1" stopColor="#00B294"/>
        </linearGradient>
      </defs>
    </svg>
  ),
  Meta: ({ size = 18, fill = 'currentColor', style }: { size?: number; fill?: string; style?: React.CSSProperties }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} style={style}>
      <path d="M16.8 6.5C14.8 6.5 13.2 7.7 12 9.2C10.8 7.7 9.2 6.5 7.2 6.5C3.8 6.5 1.5 9.4 1.5 13C1.5 16.6 4 19.5 7.2 19.5C9.4 19.5 11.1 18.1 12 16.5C12.9 18.1 14.6 19.5 16.8 19.5C20 19.5 22.5 16.6 22.5 13C22.5 9.4 20.2 6.5 16.8 6.5ZM7.2 17C5.2 17 3.8 15.2 3.8 13C3.8 10.8 5.2 9 7.2 9C9 9 10.5 10.5 11.5 12.3C10.5 14.2 9 17 7.2 17ZM16.8 17C15 17 13.5 14.2 12.5 12.3C13.5 10.5 15 9 16.8 9C18.8 9 20.2 10.8 20.2 13C20.2 15.2 18.8 17 16.8 17Z"/>
    </svg>
  ),
  Mistral: ({ size = 18, fill = 'currentColor', style }: { size?: number; fill?: string; style?: React.CSSProperties }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} style={style}>
      <path d="M3 4h3.6v16H3V4zm5.4 4.5H12V20H8.4V8.5zm5.4 3.5h3.6V20h-3.6v-8zm5.4-3.5h3.6V20h-3.6V8.5z"/>
      <path d="M17.4 4H21v16h-3.6V4z"/>
    </svg>
  ),
  Grok: ({ size = 18, fill = 'currentColor', style }: { size?: number; fill?: string; style?: React.CSSProperties }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
      <path d="M4 20L10.8 13.2M20 4L13.2 10.8M4 4l16 16" stroke={fill} strokeWidth="2.6" strokeLinecap="round"/>
    </svg>
  ),
  DeepSeek: ({ size = 18, fill = 'currentColor', style }: { size?: number; fill?: string; style?: React.CSSProperties }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} style={style}>
      <path d="M19.5 8.5C18.5 6.5 15.5 5 12 5C7.5 5 3.5 7.8 2.5 11.5C1.8 14 2.8 16.5 4.8 18C6.5 19.2 9 19.5 11.5 19C14.5 18.5 17.5 16.5 19 14C20.5 11.5 21.5 9.5 19.5 8.5ZM10.5 14C9.7 14 9 13.3 9 12.5C9 11.7 9.7 11 10.5 11C11.3 11 12 11.7 12 12.5C12 13.3 11.3 14 10.5 14ZM18.5 7C19 6 20.5 5.5 21.5 6C22.2 6.5 22.5 7.5 22 8.5C21.5 9.5 20 10 19 9.5C18.2 9 18 8 18.5 7Z"/>
    </svg>
  ),
};

/* ─────────────────────── AUTHENTIC APP ICON TILES (REFERENCE IMAGE 1 & 3) ─ */
export const BrandIcon = {
  ChatGPT: ({ size = 22, style }: { size?: number; style?: React.CSSProperties }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ borderRadius: '22%', flexShrink: 0, ...style }}>
      <rect width="24" height="24" rx="5.5" fill="#000000"/>
      <g transform="translate(4, 4) scale(0.67)">
        <path fill="#ffffff" d="M22.28 9.82a5.98 5.98 0 0 0-.51-4.91 6.05 6.05 0 0 0-6.51-2.9A6.06 6.06 0 0 0 4.98 4.18a5.98 5.98 0 0 0-4 2.9 6.05 6.05 0 0 0 .74 7.1 5.98 5.98 0 0 0 .51 4.91 6.05 6.05 0 0 0 6.52 2.9A5.98 5.98 0 0 0 13.26 24a6.05 6.05 0 0 0 5.77-4.2 5.99 5.99 0 0 0 4-2.9 6.05 6.05 0 0 0-.75-7.08zm-9.02 12.61a4.48 4.48 0 0 1-2.88-1.04l.14-.08 4.78-2.76a.8.8 0 0 0 .4-.68v-6.74l2.02 1.17a.07.07 0 0 1 .04.05v5.58a4.5 4.5 0 0 1-4.5 4.5zm-9.66-4.13a4.47 4.47 0 0 1-.53-3.01l.14.08 4.78 2.76a.77.77 0 0 0 .78 0l5.85-3.37v2.33a.08.08 0 0 1-.03.06L9.74 19.95a4.5 4.5 0 0 1-6.14-1.65zM2.34 7.9a4.48 4.48 0 0 1 2.37-1.98v5.68a.77.77 0 0 0 .38.68l5.82 3.35-2.02 1.17a.08.08 0 0 1-.07 0l-4.83-2.79A4.5 4.5 0 0 1 2.34 7.87zm16.6 3.85L13.1 8.36 15.12 7.2a.08.08 0 0 1 .07 0l4.83 2.79a4.5 4.5 0 0 1-.67 8.1v-5.67a.79.79 0 0 0-.41-.67zm2.01-3.02l-.14-.08-4.77-2.78a.78.78 0 0 0-.79 0L9.4 9.23V6.9a.07.07 0 0 1 .03-.06l4.83-2.79a4.5 4.5 0 0 1 6.68 4.66zM8.3 12.86l-2.01-1.16a.08.08 0 0 1-.04-.06V6.07a4.5 4.5 0 0 1 7.37-3.45l-.14.08L8.7 5.46a.8.8 0 0 0-.4.68zm1.1-2.37l2.6-1.5 2.6 1.5v3l-2.6 1.5-2.6-1.5z"/>
      </g>
    </svg>
  ),
  Claude: ({ size = 22, style }: { size?: number; style?: React.CSSProperties }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ borderRadius: '22%', flexShrink: 0, ...style }}>
      <rect width="24" height="24" rx="5.5" fill="#D97757"/>
      <g transform="translate(4, 4) scale(0.67)">
        <path fill="#ffffff" d="M12 2a1.5 1.5 0 0 1 1.5 1.5v3.38l2.4-2.4a1.5 1.5 0 0 1 2.12 2.12l-2.4 2.4H19.5a1.5 1.5 0 0 1 0 3h-3.38l2.4 2.4a1.5 1.5 0 1 1-2.12 2.12l-2.4-2.4V19.5a1.5 1.5 0 0 1-3 0v-3.38l-2.4 2.4a1.5 1.5 0 0 1-2.12-2.12l2.4-2.4H4.5a1.5 1.5 0 0 1 0-3h3.38l-2.4-2.4a1.5 1.5 0 1 1 2.12-2.12l2.4 2.4V3.5A1.5 1.5 0 0 1 12 2z"/>
      </g>
    </svg>
  ),
  Gemini: ({ size = 22, style }: { size?: number; style?: React.CSSProperties }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ borderRadius: '22%', flexShrink: 0, ...style }}>
      <rect width="24" height="24" rx="5.5" fill="#FFFFFF"/>
      <g transform="translate(4, 4) scale(0.67)">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
      </g>
    </svg>
  ),
  Perplexity: ({ size = 22, style }: { size?: number; style?: React.CSSProperties }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ borderRadius: '22%', flexShrink: 0, ...style }}>
      <rect width="24" height="24" rx="5.5" fill="#1FA9AC"/>
      <g transform="translate(4, 4) scale(0.67)">
        <path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M4.93 19.07l14.14-14.14" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
        <rect x="7" y="7" width="10" height="10" rx="1.5" stroke="#ffffff" strokeWidth="1.8" fill="none"/>
      </g>
    </svg>
  ),
  Copilot: ({ size = 22, style }: { size?: number; style?: React.CSSProperties }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ borderRadius: '22%', flexShrink: 0, ...style }}>
      <rect width="24" height="24" rx="5.5" fill="#1E2330"/>
      <g transform="translate(4, 4) scale(0.67)">
        <path d="M15 3.5C12 3.5 10 5.5 9 7.5L5.5 13.5C4 16 5 19.5 8 21C11 22.5 14.5 21.5 16.5 19L19.5 14.5C21 12 20 8.5 17 7C16.5 6.7 15.8 6.5 15 6.5" stroke="url(#copilot-icon-grad)" strokeWidth="2.8" strokeLinecap="round"/>
        <defs>
          <linearGradient id="copilot-icon-grad" x1="3" y1="3" x2="21" y2="21">
            <stop stopColor="#0078D4"/>
            <stop offset="0.5" stopColor="#6E40C9"/>
            <stop offset="1" stopColor="#00B294"/>
          </linearGradient>
        </defs>
      </g>
    </svg>
  ),
  Meta: ({ size = 22, style }: { size?: number; style?: React.CSSProperties }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ borderRadius: '22%', flexShrink: 0, ...style }}>
      <rect width="24" height="24" rx="5.5" fill="#0081FB"/>
      <g transform="translate(4, 4) scale(0.67)">
        <path d="M16.8 6.5C14.8 6.5 13.2 7.7 12 9.2C10.8 7.7 9.2 6.5 7.2 6.5C3.8 6.5 1.5 9.4 1.5 13C1.5 16.6 4 19.5 7.2 19.5C9.4 19.5 11.1 18.1 12 16.5C12.9 18.1 14.6 19.5 16.8 19.5C20 19.5 22.5 16.6 22.5 13C22.5 9.4 20.2 6.5 16.8 6.5ZM7.2 17C5.2 17 3.8 15.2 3.8 13C3.8 10.8 5.2 9 7.2 9C9 9 10.5 10.5 11.5 12.3C10.5 14.2 9 17 7.2 17ZM16.8 17C15 17 13.5 14.2 12.5 12.3C13.5 10.5 15 9 16.8 9C18.8 9 20.2 10.8 20.2 13C20.2 15.2 18.8 17 16.8 17Z" fill="#ffffff"/>
      </g>
    </svg>
  ),
  Mistral: ({ size = 22, style }: { size?: number; style?: React.CSSProperties }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ borderRadius: '22%', flexShrink: 0, ...style }}>
      <rect width="24" height="24" rx="5.5" fill="#FF7000"/>
      <g transform="translate(4, 4) scale(0.67)">
        <path fill="#ffffff" d="M3 4h3.6v16H3V4zm5.4 4.5H12V20H8.4V8.5zm5.4 3.5h3.6V20h-3.6v-8zm5.4-3.5h3.6V20h-3.6V8.5z"/>
        <path fill="#ffffff" d="M17.4 4H21v16h-3.6V4z"/>
      </g>
    </svg>
  ),
  Grok: ({ size = 22, style }: { size?: number; style?: React.CSSProperties }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ borderRadius: '22%', flexShrink: 0, ...style }}>
      <rect width="24" height="24" rx="5.5" fill="#141416"/>
      <g transform="translate(4, 4) scale(0.67)">
        <path d="M4 20L10.8 13.2M20 4L13.2 10.8M4 4l16 16" stroke="#ffffff" strokeWidth="2.6" strokeLinecap="round"/>
      </g>
    </svg>
  ),
  DeepSeek: ({ size = 22, style }: { size?: number; style?: React.CSSProperties }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ borderRadius: '22%', flexShrink: 0, ...style }}>
      <rect width="24" height="24" rx="5.5" fill="#4D6BFE"/>
      <g transform="translate(4, 4) scale(0.67)">
        <path fill="#ffffff" d="M19.5 8.5C18.5 6.5 15.5 5 12 5C7.5 5 3.5 7.8 2.5 11.5C1.8 14 2.8 16.5 4.8 18C6.5 19.2 9 19.5 11.5 19C14.5 18.5 17.5 16.5 19 14C20.5 11.5 21.5 9.5 19.5 8.5ZM10.5 14C9.7 14 9 13.3 9 12.5C9 11.7 9.7 11 10.5 11C11.3 11 12 11.7 12 12.5C12 13.3 11.3 14 10.5 14ZM18.5 7C19 6 20.5 5.5 21.5 6C22.2 6.5 22.5 7.5 22 8.5C21.5 9.5 20 10 19 9.5C18.2 9 18 8 18.5 7Z"/>
      </g>
    </svg>
  ),
  G2: ({ size = 22, style }: { size?: number; style?: React.CSSProperties }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ borderRadius: '22%', flexShrink: 0, ...style }}>
      <rect width="24" height="24" rx="5.5" fill="#FF492C"/>
      <g transform="translate(4, 4) scale(0.67)">
        <path fill="#ffffff" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18.5c-4.69 0-8.5-3.81-8.5-8.5S7.31 3.5 12 3.5c2.3 0 4.39.92 5.92 2.42l-2.07 2.07C14.81 7.02 13.48 6.5 12 6.5c-3.03 0-5.5 2.47-5.5 5.5s2.47 5.5 5.5 5.5c2.44 0 4.47-1.59 5.16-3.8H12V11h8.5c.08.33.12.67.12 1.02 0 4.67-3.92 8.48-8.62 8.48z"/>
      </g>
    </svg>
  ),
  TechCrunch: ({ size = 22, style }: { size?: number; style?: React.CSSProperties }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ borderRadius: '22%', flexShrink: 0, ...style }}>
      <rect width="24" height="24" rx="5.5" fill="#00A562"/>
      <g transform="translate(3.5, 4.5) scale(0.72)">
        <path fill="#ffffff" d="M3 6h6v3H7.5v7H5V9H3V6zm8 4h3.5v2.5c-.8.5-1.8.8-3 .8-2.5 0-4-1.5-4-4s1.5-4 4-4c1.2 0 2.2.3 3 .8l-1 2.2c-.6-.4-1.2-.6-2-.6-1.2 0-2 .8-2 1.6s.8 1.6 2 1.6c.6 0 1.1-.1 1.5-.3v-1H11v-2.6z"/>
      </g>
    </svg>
  ),
  ProductHunt: ({ size = 22, style }: { size?: number; style?: React.CSSProperties }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ borderRadius: '22%', flexShrink: 0, ...style }}>
      <rect width="24" height="24" rx="5.5" fill="#DA552F"/>
      <g transform="translate(4, 4) scale(0.67)">
        <path fill="#ffffff" d="M10 5.5h4.2c2.4 0 4.2 1.6 4.2 4s-1.8 4-4.2 4H12.5V19h-2.5V5.5zm2.5 5.5h1.7c1 0 1.7-.7 1.7-1.5s-.7-1.5-1.7-1.5H12.5v3z"/>
      </g>
    </svg>
  ),
  Reddit: ({ size = 22, style }: { size?: number; style?: React.CSSProperties }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ borderRadius: '22%', flexShrink: 0, ...style }}>
      <rect width="24" height="24" rx="5.5" fill="#FF4500"/>
      <g transform="translate(4, 4) scale(0.67)">
        <path fill="#ffffff" d="M18 12c0-.66-.54-1.2-1.2-1.2-.38 0-.71.18-.93.45-1.12-.76-2.65-1.25-4.37-1.3l.88-3.9 2.76.6c.03.56.5 1 1.06 1 .58 0 1.06-.48 1.06-1.06s-.48-1.06-1.06-1.06c-.47 0-.87.31-1 .75l-3.08-.66c-.14-.03-.27.06-.3.2l-1 4.45c-1.78.04-3.37.54-4.52 1.32-.22-.27-.55-.45-.93-.45-.66 0-1.2.54-1.2 1.2 0 .48.28.89.69 1.08-.03.17-.05.34-.05.52 0 2.54 2.87 4.6 6.4 4.6s6.4-2.06 6.4-4.6c0-.18-.02-.35-.05-.52.41-.19.69-.6.69-1.08zm-8.8.8c.44 0 .8.36.8.8s-.36.8-.8.8-.8-.36-.8-.8.36-.8.8-.8zm5.6 3.2c-.8.6-2.1.7-2.8.7-.7 0-2-.1-2.8-.7-.15-.12-.17-.35-.05-.5.12-.15.35-.17.5-.05.6.45 1.6.55 2.35.55.75 0 1.75-.1 2.35-.55.15-.12.38-.1.5.05.12.15.1.38-.05.5zm-.4-2.4c-.44 0-.8-.36-.8-.8s.36-.8.8-.8.8.36.8.8-.36.8-.8.8z"/>
      </g>
    </svg>
  ),
  Blog: ({ size = 22, style }: { size?: number; style?: React.CSSProperties }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ borderRadius: '22%', flexShrink: 0, ...style }}>
      <rect width="24" height="24" rx="5.5" fill="#2A2D38"/>
      <g transform="translate(4, 4) scale(0.67)">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        <polyline points="14 2 14 8 20 8" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        <line x1="16" y1="13" x2="8" y2="13" stroke="#ffffff" strokeWidth="2" strokeLinecap="round"/>
        <line x1="16" y1="17" x2="8" y2="17" stroke="#ffffff" strokeWidth="2" strokeLinecap="round"/>
      </g>
    </svg>
  ),
  Analyst: ({ size = 22, style }: { size?: number; style?: React.CSSProperties }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ borderRadius: '22%', flexShrink: 0, ...style }}>
      <rect width="24" height="24" rx="5.5" fill="#2A2D38"/>
      <g transform="translate(4, 4) scale(0.67)">
        <line x1="18" y1="20" x2="18" y2="10" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round"/>
        <line x1="12" y1="20" x2="12" y2="4" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round"/>
        <line x1="6" y1="20" x2="6" y2="14" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round"/>
      </g>
    </svg>
  ),
};

export const AI_ENGINES_CONFIG = [
  { id: 'chatgpt',    name: 'ChatGPT',    brand: 'OpenAI',     color: '#10A37F', Glyph: BrandGlyph.ChatGPT,    Icon: BrandIcon.ChatGPT },
  { id: 'claude',     name: 'Claude',     brand: 'Anthropic',  color: '#D97757', Glyph: BrandGlyph.Claude,     Icon: BrandIcon.Claude },
  { id: 'gemini',     name: 'Gemini',     brand: 'Google',     color: '#4E82EE', Glyph: BrandGlyph.Gemini,     Icon: BrandIcon.Gemini },
  { id: 'perplexity', name: 'Perplexity', brand: 'Perplexity', color: '#22B8CD', Glyph: BrandGlyph.Perplexity, Icon: BrandIcon.Perplexity },
  { id: 'copilot',    name: 'Copilot',    brand: 'Microsoft',  color: '#0078D4', Glyph: BrandGlyph.Copilot,    Icon: BrandIcon.Copilot },
  { id: 'meta',       name: 'Meta AI',    brand: 'Meta',       color: '#0081FB', Glyph: BrandGlyph.Meta,       Icon: BrandIcon.Meta },
  { id: 'mistral',    name: 'Mistral',    brand: 'Mistral AI', color: '#FF7000', Glyph: BrandGlyph.Mistral,    Icon: BrandIcon.Mistral },
  { id: 'grok',       name: 'Grok',       brand: 'xAI',        color: '#FFFFFF', Glyph: BrandGlyph.Grok,       Icon: BrandIcon.Grok },
  { id: 'deepseek',   name: 'DeepSeek',   brand: 'DeepSeek',   color: '#4D6BFE', Glyph: BrandGlyph.DeepSeek,   Icon: BrandIcon.DeepSeek },
];

/* ─────────────────────── BRAND STRIP LOGO (INTERACTIVE SILVER -> COLOR) ─ */
function BrandStripLogo({ engine }: { engine: typeof AI_ENGINES_CONFIG[0] }) {
  const [hovered, setHovered] = useState(false);
  const GlyphComp = engine.Glyph;
  const isGemini = engine.id === 'gemini';
  const isCopilot = engine.id === 'copilot';

  const defaultColor = 'rgba(240,239,237,0.52)';
  const glyphFill = hovered
    ? (isGemini ? 'url(#gemini-sparkle-grad)' : isCopilot ? 'url(#copilot-strip-grad)' : engine.color)
    : defaultColor;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 9,
        padding: '8px 18px',
        cursor: 'pointer',
        userSelect: 'none',
        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: hovered ? 'translateY(-2px)' : 'none',
      }}
    >
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: hovered ? engine.color : defaultColor,
        transition: 'color 0.25s ease, filter 0.25s ease',
        filter: hovered ? `drop-shadow(0 0 10px ${engine.color}66)` : 'none',
      }}>
        <GlyphComp size={20} fill={glyphFill} />
      </div>
      <span style={{
        fontFamily: 'var(--font-sans)',
        fontSize: 15,
        fontWeight: 600,
        letterSpacing: '-0.015em',
        color: hovered ? engine.color : defaultColor,
        transition: 'color 0.25s ease, text-shadow 0.25s ease',
        textShadow: hovered ? `0 0 16px ${engine.color}44` : 'none',
      }}>
        {engine.name}
      </span>
    </div>
  );
}

/* ─────────────────────── HOOKS ──────────────────────────────────────── */
function useInView(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

function useNavScroll() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 48);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);
  return scrolled;
}

function useScrollPct() {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const fn = () => {
      const d = document.documentElement;
      setPct(Math.min(100, (d.scrollTop / (d.scrollHeight - d.clientHeight)) * 100));
    };
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);
  return pct;
}

function useCounter(target: number, dur = 1800) {
  const [count, setCount] = useState(0);
  const { ref, inView } = useInView(0.4);
  useEffect(() => {
    if (!inView) return;
    const t0 = performance.now();
    const ease = (p: number) => 1 - Math.pow(1 - p, 4);
    const tick = (now: number) => {
      const p = Math.min((now - t0) / dur, 1);
      setCount(Math.round(ease(p) * target));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, target, dur]);
  return { ref, count };
}

function use3DTilt(intensity = 7) {
  const ref = useRef<HTMLDivElement>(null);
  const onMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width - 0.5);
    const y = ((e.clientY - r.top) / r.height - 0.5);
    el.style.transition = 'transform 0.1s ease';
    el.style.transform = `perspective(800px) rotateX(${-y * intensity}deg) rotateY(${x * intensity}deg) scale3d(1.015,1.015,1.015)`;
  }, [intensity]);
  const onMouseLeave = useCallback(() => {
    const el = ref.current; if (!el) return;
    el.style.transition = 'transform 0.55s cubic-bezier(0.34,1.56,0.64,1)';
    el.style.transform = 'perspective(800px) rotateX(0) rotateY(0) scale3d(1,1,1)';
  }, []);
  return { ref, onMouseMove, onMouseLeave };
}

function Reveal({ children, delay = 0, className = '' }: {
  children: React.ReactNode; delay?: number; className?: string;
}) {
  const { ref, inView } = useInView();
  return (
    <div ref={ref} className={`reveal${inView ? ' in' : ''}${className ? ' ' + className : ''}`}
      style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

/* ─────────────────────── SPARKLINE — MONOCHROME ────────────────────── */
function Sparkline({ data, animate, idx = 0 }: {
  data: number[]; animate?: boolean; idx?: number;
}) {
  const W = 68, H = 28;
  const mn = Math.min(...data), mx = Math.max(...data), rng = mx - mn || 1;
  const pts = data.map((v, i) => [
    (i / (data.length - 1)) * W,
    H - 4 - ((v - mn) / rng) * (H - 10)
  ]);
  // Smooth bezier path
  const smooth = pts.reduce((acc, [x, y], i) => {
    if (i === 0) return `M ${x.toFixed(1)} ${y.toFixed(1)}`;
    const [px, py] = pts[i - 1];
    const cx1 = (px + x) / 2, cy1 = py, cx2 = (px + x) / 2, cy2 = y;
    return `${acc} C ${cx1.toFixed(1)} ${cy1.toFixed(1)} ${cx2.toFixed(1)} ${cy2.toFixed(1)} ${x.toFixed(1)} ${y.toFixed(1)}`;
  }, '');
  const area = `${smooth} L${W},${H} L0,${H} Z`;
  const uid = `sp-${idx}`;
  // Luminance: brighter for top rows
  const alpha = Math.max(0.35, 0.82 - idx * 0.1);
  const strokeColor = `rgba(255,255,255,${alpha})`;
  const fillAlpha = alpha * 0.22;
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ overflow: 'visible', display: 'block', flexShrink: 0 }}>
      <defs>
        <linearGradient id={uid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="white" stopOpacity={fillAlpha} />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </linearGradient>
        {animate && (
          <clipPath id={`${uid}-clip`}>
            <rect x="0" y="0" width="0" height={H}>
              <animate attributeName="width" from="0" to={W} dur="1.4s"
                fill="freeze" calcMode="spline" keySplines="0.22 1 0.36 1" />
            </rect>
          </clipPath>
        )}
      </defs>
      <path d={area} fill={`url(#${uid})`} clipPath={animate ? `url(#${uid}-clip)` : undefined} />
      <path d={smooth} fill="none" stroke={strokeColor} strokeWidth="1.5" strokeLinecap="round"
        clipPath={animate ? `url(#${uid}-clip)` : undefined} />
      {/* Terminal glow dot */}
      <circle cx={pts[pts.length - 1][0]} cy={pts[pts.length - 1][1]} r="2.5"
        fill={strokeColor}
        clipPath={animate ? `url(#${uid}-clip)` : undefined} />
    </svg>
  );
}

/* ─────────────────────── DVS AREA CHART ────────────────────────────── */
const DVS_WEEKS = [
  { w: 'W1', you: 28, comp: 72 }, { w: 'W2', you: 33, comp: 71 },
  { w: 'W3', you: 38, comp: 70 }, { w: 'W4', you: 43, comp: 71 },
  { w: 'W5', you: 48, comp: 69 }, { w: 'W6', you: 54, comp: 68 },
  { w: 'W7', you: 59, comp: 67 }, { w: 'W8', you: 63, comp: 65 },
  { w: 'W9', you: 66, comp: 64 }, { w: 'W10', you: 69, comp: 63 },
  { w: 'W11', you: 72, comp: 61 }, { w: 'W12', you: 74, comp: 58 },
];

function DVSChart({ animate }: { animate: boolean }) {
  const W = 560, H = 200, PL = 36, PR = 20, PT = 16, PB = 28;
  const n = DVS_WEEKS.length;
  const tx = (i: number) => PL + (i / (n - 1)) * (W - PL - PR);
  const ty = (v: number) => PT + ((100 - v) / 100) * (H - PT - PB);
  const linePts = (fn: (d: typeof DVS_WEEKS[0]) => number) =>
    DVS_WEEKS.map((d, i) => `${i === 0 ? 'M' : 'L'}${tx(i).toFixed(1)},${ty(fn(d)).toFixed(1)}`).join(' ');
  const areaPts = (fn: (d: typeof DVS_WEEKS[0]) => number) =>
    `${linePts(fn)} L${tx(n - 1)},${ty(0)} L${tx(0)},${ty(0)} Z`;
  const crossX = tx(8), crossY = ty(65);
  const [hov, setHov] = React.useState<number | null>(null);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto', display: 'block', overflow: 'visible' }}
      onMouseLeave={() => setHov(null)}>
      <defs>
        <linearGradient id="dvs-you" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="dvs-comp" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.04" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
        {animate && (
          <clipPath id="dvs-clip">
            <rect x={PL} y="0" width="0" height={H}>
              <animate attributeName="width" from="0" to={W - PL - PR} dur="1.6s"
                fill="freeze" calcMode="spline" keySplines="0.22 1 0.36 1" />
            </rect>
          </clipPath>
        )}
      </defs>
      {/* Grid lines */}
      {[0, 25, 50, 75, 100].map(v => (
        <g key={v}>
          <line x1={PL} y1={ty(v)} x2={W - PR} y2={ty(v)}
            stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
          <text x={PL - 6} y={ty(v) + 3.5} fontSize="8.5" fill="rgba(255,255,255,0.18)"
            textAnchor="end" fontFamily="JetBrains Mono, monospace">{v}</text>
        </g>
      ))}
      {/* Competitor area + dashed line */}
      <path d={areaPts(d => d.comp)} fill="url(#dvs-comp)"
        clipPath={animate ? 'url(#dvs-clip)' : undefined} />
      <path d={linePts(d => d.comp)} fill="none" stroke="rgba(255,255,255,0.18)"
        strokeWidth="1.5" strokeDasharray="4 3"
        clipPath={animate ? 'url(#dvs-clip)' : undefined} />
      {/* Brand area + line */}
      <path d={areaPts(d => d.you)} fill="url(#dvs-you)"
        clipPath={animate ? 'url(#dvs-clip)' : undefined} />
      <path d={linePts(d => d.you)} fill="none" stroke="rgba(255,255,255,0.88)" strokeWidth="2"
        clipPath={animate ? 'url(#dvs-clip)' : undefined} />
      {/* Crossover marker */}
      <line x1={crossX} y1={PT} x2={crossX} y2={H - PB}
        stroke="rgba(255,255,255,0.10)" strokeWidth="1" strokeDasharray="3 3" />
      <circle cx={crossX} cy={crossY} r="4" fill="rgba(255,255,255,0.55)" />
      <circle cx={crossX} cy={crossY} r="9" fill="rgba(255,255,255,0.06)" />
      {/* Crossover annotation — positioned below graph area to avoid line overlap */}
      <text x={crossX} y={PT + 9} fontSize="7.5" fill="rgba(255,255,255,0.22)"
        fontFamily="JetBrains Mono, monospace" textAnchor="middle">▾ Crossover</text>
      {/* Terminal dot */}
      <circle cx={tx(n - 1)} cy={ty(74)} r="4.5" fill="rgba(255,255,255,0.90)" />
      <circle cx={tx(n - 1)} cy={ty(74)} r="11" fill="rgba(255,255,255,0.07)" />
      {/* Value labels */}
      <text x={tx(n - 1) + 8} y={ty(74) + 4} fontSize="11" fill="rgba(255,255,255,0.80)"
        fontWeight="700" fontFamily="JetBrains Mono, monospace">74</text>
      <text x={tx(n - 1) + 8} y={ty(58) + 4} fontSize="10" fill="rgba(255,255,255,0.20)"
        fontFamily="JetBrains Mono, monospace">58</text>
      {/* Legend */}
      <g>
        <line x1={PL} y1={H + 14} x2={PL + 18} y2={H + 14} stroke="rgba(255,255,255,0.80)" strokeWidth="2" />
        <text x={PL + 22} y={H + 17.5} fontSize="8.5" fill="rgba(255,255,255,0.50)" fontFamily="JetBrains Mono, monospace">Dyvin AI</text>
        <line x1={PL + 72} y1={H + 14} x2={PL + 90} y2={H + 14} stroke="rgba(255,255,255,0.20)" strokeWidth="1.5" strokeDasharray="4 3" />
        <text x={PL + 94} y={H + 17.5} fontSize="8.5" fill="rgba(255,255,255,0.30)" fontFamily="JetBrains Mono, monospace">Competitor</text>
      </g>
      {/* X-axis labels */}
      {DVS_WEEKS.filter((_, i) => i % 2 === 0 || i === n - 1).map((d) => {
        const idx = DVS_WEEKS.indexOf(d);
        return (
          <text key={d.w} x={tx(idx)} y={H - 2} fontSize="8" fill="rgba(255,255,255,0.18)"
            textAnchor="middle" fontFamily="JetBrains Mono, monospace">{d.w}</text>
        );
      })}
      {/* Hover hit areas + tooltip */}
      {DVS_WEEKS.map((d, i) => (
        <g key={d.w}>
          <rect x={tx(i) - 16} y={PT} width={32} height={H - PT - PB}
            fill="transparent" style={{ cursor: 'crosshair' }}
            onMouseEnter={() => setHov(i)} />
          {hov === i && (
            <g>
              {/* Vertical line */}
              <line x1={tx(i)} y1={PT} x2={tx(i)} y2={H - PB}
                stroke="rgba(255,255,255,0.25)" strokeWidth="1" strokeDasharray="2 2" />
              {/* Dot on brand line */}
              <circle cx={tx(i)} cy={ty(d.you)} r="3.5" fill="rgba(255,255,255,0.9)" />
              {/* Dot on comp line */}
              <circle cx={tx(i)} cy={ty(d.comp)} r="3" fill="rgba(255,255,255,0.35)" />
              {/* Tooltip box */}
              <rect x={Math.min(tx(i) + 8, W - PR - 80)} y={ty(d.you) - 38}
                width="76" height="36" rx="5"
                fill="rgba(10,10,10,0.92)" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
              <text x={Math.min(tx(i) + 16, W - PR - 72)} y={ty(d.you) - 23}
                fontSize="9" fill="rgba(255,255,255,0.90)" fontFamily="JetBrains Mono, monospace"
                fontWeight="700">{d.w}: DVS {d.you}</text>
              <text x={Math.min(tx(i) + 16, W - PR - 72)} y={ty(d.you) - 11}
                fontSize="8.5" fill="rgba(255,255,255,0.38)" fontFamily="JetBrains Mono, monospace">Comp: {d.comp}</text>
            </g>
          )}
        </g>
      ))}
    </svg>
  );
}

/* ─────────────────────── HERO DASHBOARD ────────────────────────────── */
function HeroDashboard() {
  const [activeNav, setActiveNav] = useState('overview');
  const navItems = [
    { id: 'overview', label: 'Overview', Icon: Ico.Bar },
    { id: 'monitor', label: 'AI Monitor', Icon: Ico.Eye },
    { id: 'citations', label: 'Citations', Icon: Ico.Link },
    { id: 'compete', label: 'Competitors', Icon: Ico.Target },
  ];
  const engines = [
    { n: 'ChatGPT',    c: '#10A37F', bg: 'rgba(16,163,127,0.16)',  border: 'rgba(16,163,127,0.35)', p: 74, Icon: BrandIcon.ChatGPT },
    { n: 'Claude',     c: '#D97757', bg: 'rgba(217,119,87,0.16)',  border: 'rgba(217,119,87,0.35)', p: 68, Icon: BrandIcon.Claude },
    { n: 'Gemini',     c: '#4E82EE', bg: 'rgba(78,130,238,0.16)',  border: 'rgba(78,130,238,0.35)', p: 61, Icon: BrandIcon.Gemini },
    { n: 'Perplexity', c: '#22B8CD', bg: 'rgba(34,184,205,0.16)',  border: 'rgba(34,184,205,0.35)', p: 55, Icon: BrandIcon.Perplexity },
  ];

  return (
    <div className="db-shell" aria-label="Sample Dyvin AI dashboard — illustrative data">
      {/* Topbar */}
      <div className="db-topbar">
        <div className="db-traffic-lights" aria-hidden>
          <div className="db-traffic-light db-traffic-light--red" />
          <div className="db-traffic-light db-traffic-light--yellow" />
          <div className="db-traffic-light db-traffic-light--green" />
        </div>
        <div className="db-topbar-title">Dyvin AI — AI Visibility Intelligence</div>
        <div className="db-topbar-spacer" />
        {['7d', '30d', '90d'].map(t => (
          <div key={t} className={`db-topbar-tab${t === '90d' ? ' active' : ''}`}>{t}</div>
        ))}
        <div style={{
          marginLeft: 10, fontFamily: 'var(--font-mono)', fontSize: 9,
          padding: '3px 8px', borderRadius: 5, background: 'rgba(240,239,237,0.06)',
          color: 'rgba(240,239,237,0.55)', border: '1px solid rgba(240,239,237,0.10)',
          letterSpacing: '0.06em', textTransform: 'uppercase'
        }}>● Live</div>
        <div style={{
          marginLeft: 6, fontFamily: 'var(--font-mono)', fontSize: 8.5,
          color: 'rgba(255,255,255,0.16)', letterSpacing: '0.06em', textTransform: 'uppercase'
        }}>Sample</div>
      </div>

      {/* Body */}
      <div className="db-body">
        {/* Sidebar */}
        <div className="db-sidebar">
          <div className="db-sidebar-brand" style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <DyvinLogo size={20} fill="#e8e6e1" />
            <div className="db-sidebar-name">Dyvin AI</div>
          </div>
          <div className="db-nav-section">Intelligence</div>
          {navItems.map(item => (
            <button key={item.id}
              className={`db-nav-item${activeNav === item.id ? ' active' : ''}`}
              onClick={() => setActiveNav(item.id)}
              style={{ border: 'none', width: '100%', textAlign: 'left' }}>
              <div className="db-nav-icon"><item.Icon size={13} /></div>
              {item.label}
            </button>
          ))}
          <div className="db-nav-section">Tools</div>
          {[{ l: 'Query Builder', I: Ico.Search }, { l: 'Reports', I: Ico.File }].map(item => (
            <div key={item.l} className="db-nav-item">
              <div className="db-nav-icon"><item.I size={13} /></div>{item.l}
            </div>
          ))}
          <div style={{ marginTop: 'auto', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 10 }}>
            <div className="db-nav-section">AI Engines</div>
            {engines.map(m => {
              const IconC = m.Icon;
              return (
                <div key={m.n} style={{
                  display: 'flex', alignItems: 'center', gap: 7, padding: '4px 8px',
                  borderLeft: `2px solid ${m.c}`,
                  marginBottom: 3
                }}>
                  <IconC size={15} />
                  <span style={{ fontFamily: 'var(--font-sans)', fontSize: 11, fontWeight: 500, color: 'rgba(255,255,255,0.85)', minWidth: 58 }}>{m.n}</span>
                  <div style={{ flex: 1, height: 2, background: 'rgba(255,255,255,0.06)', borderRadius: 1, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${m.p}%`, background: m.c, borderRadius: 1 }} />
                  </div>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 8.5, color: m.c, opacity: 0.9 }}>{m.p}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Main */}
        <div className="db-main">
          <div className="db-main-header">
            <div className="db-main-title">AI Visibility Overview</div>
            <div className="db-main-controls">
              {['Brand', 'Queries', 'Models'].map(b => (
                <div key={b} className="db-control-btn">{b}</div>
              ))}
              <div className="db-control-btn" style={{
                background: 'rgba(240,239,237,0.06)', color: 'rgba(240,239,237,0.60)',
                borderColor: 'rgba(240,239,237,0.12)'
              }}>Export ↗</div>
            </div>
          </div>

          <div className="db-metrics-row">
            {[
              { label: 'DVS Score', value: '74', delta: '▲ +8.7', note: '90-day change' },
              { label: 'Recommendation Rate', value: '68%', delta: '▲ +12%', note: '4 engines' },
              { label: 'Citation Sources', value: '23', delta: '▲ +5', note: 'identified' },
            ].map(m => (
              <div key={m.label} className="db-metric-card">
                <div className="db-metric-label">{m.label}</div>
                <div className="db-metric-value">{m.value}</div>
                <div className="db-metric-delta">{m.delta}</div>
                <div style={{
                  fontFamily: 'var(--font-mono)', fontSize: 9,
                  color: 'rgba(255,255,255,0.16)', marginTop: 2
                }}>{m.note}</div>
              </div>
            ))}
          </div>

          <div className="db-chart-section">
            <div className="db-chart-area">
              <div className="db-chart-title">90-Day DVS Trajectory · Illustrative data</div>
              <div className="db-chart-svg"><DVSChart animate={true} /></div>
              <div style={{ display: 'flex', gap: 14, marginTop: 2 }}>
                {[
                  { c: 'rgba(240,239,237,0.80)', dash: false, l: 'Your brand' },
                  { c: 'rgba(240,239,237,0.22)', dash: true,  l: 'Top competitor' },
                  { c: 'rgba(240,239,237,0.50)', dot: true,   l: 'Crossover W9' },
                ].map(item => (
                  <div key={item.l} style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    fontFamily: 'var(--font-mono)', fontSize: 8.5, color: 'rgba(255,255,255,0.28)'
                  }}>
                    {'dot' in item
                      ? <div style={{ width: 7, height: 7, borderRadius: '50%', background: item.c }} />
                      : <div style={{ width: 14, height: 2, background: item.c, borderRadius: 1, ...(item.dash ? {} : {}) }} />
                    }
                    {item.l}
                  </div>
                ))}
              </div>
            </div>

            <div className="db-rankings">
              <div className="db-rank-header">Query Positions · Sample</div>
              {[
                { q: '"best AI analytics SaaS"', pos: '#2', up: true },
                { q: '"ai visibility tool"', pos: '#1', up: true },
                { q: '"brand monitoring AI"', pos: '#3', up: false },
                { q: '"answer engine optimization"', pos: '#2', up: true },
                { q: '"ai mention tracking"', pos: '#4', up: false },
              ].map(item => (
                <div key={item.q} className="db-rank-row">
                  <div className="db-rank-name">
                    <div style={{
                      fontFamily: 'var(--font-mono)', fontSize: 9, fontWeight: 700, minWidth: 20,
                      color: item.pos === '#1' ? 'rgba(240,239,237,0.90)' : item.pos === '#2' ? 'rgba(240,239,237,0.58)' : 'rgba(240,239,237,0.28)'
                    }}>{item.pos}</div>
                    <span style={{
                      fontSize: 10, color: 'rgba(255,255,255,0.38)',
                      fontFamily: 'var(--font-mono)', lineHeight: 1.35
                    }}>{item.q}</span>
                  </div>
                  <span style={{ fontSize: 10, color: item.up ? 'rgba(240,239,237,0.65)' : 'rgba(240,239,237,0.18)' }}>
                    {item.up ? '↑' : '—'}
                  </span>
                </div>
              ))}
              <div style={{
                marginTop: 'auto', paddingTop: 8, borderTop: '1px solid rgba(255,255,255,0.05)',
                fontFamily: 'var(--font-mono)', fontSize: 7.5, color: 'rgba(255,255,255,0.14)',
                letterSpacing: '0.06em', textTransform: 'uppercase'
              }}>Illustrative · Not real results</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────── BENCHMARK TABLE ───────────────────────────── */
/* ─────────────────────── BENCHMARK TABLE ───────────────────────────── */
const BENCH_DATA = [
  { name: 'ChatGPT',    brand: 'OpenAI',    color: '#10A37F', iconBg: 'rgba(16,163,127,0.16)',  iconBorder: 'rgba(16,163,127,0.35)',  Icon: BrandIcon.ChatGPT,    rate: 74, delta: '+13', signal: 'Rising',   data: [48,54,58,63,66,69,71,72,74] },
  { name: 'Claude',     brand: 'Anthropic', color: '#D97757', iconBg: 'rgba(217,119,87,0.16)',  iconBorder: 'rgba(217,119,87,0.35)',  Icon: BrandIcon.Claude,     rate: 68, delta: '+11', signal: 'Rising',   data: [44,48,52,56,59,63,64,67,68] },
  { name: 'Gemini',     brand: 'Google',    color: '#4E82EE', iconBg: 'rgba(78,130,238,0.16)',  iconBorder: 'rgba(78,130,238,0.35)',  Icon: BrandIcon.Gemini,     rate: 61, delta: '+9',  signal: 'Stable',   data: [42,45,48,51,54,57,58,60,61] },
  { name: 'Perplexity', brand: 'Perplexity',color: '#22B8CD', iconBg: 'rgba(34,184,205,0.16)', iconBorder: 'rgba(34,184,205,0.35)', Icon: BrandIcon.Perplexity, rate: 55, delta: '+6',  signal: 'Building', data: [38,40,43,45,47,49,51,53,55] },
  { name: 'Copilot',    brand: 'Microsoft', color: '#0078D4', iconBg: 'rgba(0,120,212,0.16)',  iconBorder: 'rgba(0,120,212,0.35)',  Icon: BrandIcon.Copilot,    rate: 42, delta: '+4',  signal: 'Building', data: [28,31,34,36,38,39,40,41,42] },
  { name: 'Meta AI',    brand: 'Meta',      color: '#0081FB', iconBg: 'rgba(0,129,251,0.16)',  iconBorder: 'rgba(0,129,251,0.35)',  Icon: BrandIcon.Meta,       rate: 36, delta: '+5',  signal: 'Building', data: [22,25,27,29,31,33,34,35,36] },
  { name: 'Mistral',    brand: 'Mistral AI',color: '#FF7000', iconBg: 'rgba(255,112,0,0.16)',   iconBorder: 'rgba(255,112,0,0.35)',   Icon: BrandIcon.Mistral,    rate: 28, delta: '+8',  signal: 'Building', data: [14,16,18,20,22,24,25,27,28] },
  { name: 'DeepSeek',   brand: 'DeepSeek',  color: '#4D6BFE', iconBg: 'rgba(77,107,254,0.16)',  iconBorder: 'rgba(77,107,254,0.35)',  Icon: BrandIcon.DeepSeek,   rate: 24, delta: '+7',  signal: 'Building', data: [10,13,15,18,19,21,22,23,24] },
  { name: 'Grok',       brand: 'xAI',       color: '#FFFFFF', iconBg: 'rgba(255,255,255,0.10)', iconBorder: 'rgba(255,255,255,0.25)',Icon: BrandIcon.Grok,       rate: null, delta: '—', signal: 'Planned',  data: [] },
];

/* Signal display — luminance only, no color coding */
const SIGNAL_META: Record<string, { alpha: number; label: string }> = {
  Rising:   { alpha: 0.88, label: '↑ Rising' },
  Stable:   { alpha: 0.52, label: '→ Stable' },
  Building: { alpha: 0.34, label: '◎ Building' },
  Planned:  { alpha: 0.16, label: '○ Planned' },
};

function BenchTable({ animate }: { animate: boolean }) {
  return (
    <div className="bench-table" style={{ background: '#080808', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 'var(--r-xl)', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{
        display: 'grid', gridTemplateColumns: '220px 1fr 72px 54px 78px 120px',
        padding: '13px 28px', borderBottom: '1px solid rgba(255,255,255,0.06)',
        background: 'rgba(255,255,255,0.02)', gap: 16,
      }}>
        {['AI Engine', 'Visibility Index', 'DVS', 'Δ 90d', 'Trend', 'Status'].map(h => (
          <div key={h} style={{
            fontFamily: 'var(--font-mono)', fontSize: 8.5, fontWeight: 700,
            letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.22)'
          }}>{h}</div>
        ))}
      </div>

      {BENCH_DATA.map((row, i) => {
        const lum = row.rate ? (row.rate / 100) : 0;
        const barAlpha = 0.12 + lum * 0.56;
        const textAlpha = row.rate ? 0.95 : 0.2;
        const sm = SIGNAL_META[row.signal] ?? SIGNAL_META.Planned;
        const IconComponent = row.Icon;
        return (
          <div key={row.name} style={{
            display: 'grid', gridTemplateColumns: '220px 1fr 72px 54px 78px 120px',
            alignItems: 'center', gap: 16, padding: '16px 28px',
            borderBottom: i < BENCH_DATA.length - 1 ? '1px solid rgba(255,255,255,0.045)' : 'none',
            opacity: animate ? 1 : 0,
            transform: animate ? 'none' : 'translateY(8px)',
            transition: `opacity 0.55s ease ${i * 65}ms, transform 0.55s cubic-bezier(0.4,0,0.2,1) ${i * 65}ms`,
          }}>
            {/* Engine */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <IconComponent size={32} />
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: '-0.015em', color: `rgba(255,255,255,${textAlpha})` }}>
                  {row.name}
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.04em' }}>
                  {row.brand}
                </div>
              </div>
            </div>

            {/* Visibility bar — monochrome luminance */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                flex: 1, height: 3, background: 'rgba(255,255,255,0.05)',
                borderRadius: 2, overflow: 'hidden', position: 'relative'
              }}>
                {/* Shimmer glow at the fill edge */}
                <div style={{
                  position: 'absolute', inset: 0, borderRadius: 2,
                  background: `linear-gradient(90deg, rgba(255,255,255,0.0) 0%, rgba(255,255,255,${barAlpha * 0.7}) 80%, rgba(255,255,255,${barAlpha}) 100%)`,
                  width: animate && row.rate ? `${row.rate}%` : '0%',
                  transition: `width 1.4s cubic-bezier(0.22,1,0.36,1) ${i * 80}ms`,
                  boxShadow: row.rate ? `4px 0 12px rgba(255,255,255,${barAlpha * 0.5})` : 'none',
                }} />
              </div>
              {/* Monochrome sparkline */}
              {row.data.length > 0 && <Sparkline data={row.data} animate={animate} idx={i} />}
            </div>

            {/* DVS score */}
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: 22, fontWeight: 800,
              letterSpacing: '-0.025em',
              color: `rgba(255,255,255,${textAlpha})`,
              textShadow: row.rate ? `0 0 20px rgba(255,255,255,${lum * 0.3})` : 'none',
            }}>{row.rate ?? '—'}</div>

            {/* Delta */}
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700,
              color: row.delta !== '—' ? `rgba(255,255,255,${textAlpha * 0.8})` : 'rgba(255,255,255,0.15)'
            }}>{row.delta}</div>

            {/* Trend sparkline placeholder */}
            <div />

            {/* Status — no color, just luminance */}
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: 9.5, fontWeight: 700,
              letterSpacing: '0.10em', textTransform: 'uppercase',
              color: `rgba(255,255,255,${sm.alpha})`,
            }}>{sm.label}</div>
          </div>
        );
      })}

      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '10px 28px', borderTop: '1px solid rgba(255,255,255,0.045)',
        background: 'rgba(255,255,255,0.01)',
        fontFamily: 'var(--font-mono)', fontSize: 8.5, color: 'rgba(255,255,255,0.14)',
        letterSpacing: '0.06em', textTransform: 'uppercase',
      }}>
        <span>Sample workspace · All scores illustrative · Not real measurement data</span>
        <span>Tracking 8+ AI engines</span>
      </div>
    </div>
  );
}

/* ─────────────────────── RECOMMENDATION DEMO ───────────────────────── */
const REC_QUERIES = [
  { type: 'Category',      q: '"What are the best AI analytics tools for SaaS?"',        mentioned: true,  recommended: true,  pos: 2 },
  { type: 'Comparison',    q: '"Dyvin AI vs [competitor]?"',                              mentioned: true,  recommended: true,  pos: 1 },
  { type: 'Selection',     q: '"Best tool for a 50-person SaaS company for AI search?"', mentioned: true,  recommended: false, pos: null },
  { type: 'Problem',       q: '"How do I improve brand visibility in AI answers?"',       mentioned: false, recommended: false, pos: null },
  { type: 'Alternative',   q: '"Alternatives to traditional SEO analytics for AI?"',     mentioned: true,  recommended: false, pos: null },
  { type: 'Purchase intent', q: '"Which AI visibility platform should I buy in 2026?"', mentioned: true,  recommended: true,  pos: 2 },
];

function RecommendationDemo() {
  const [active, setActive] = useState(0);
  const q = REC_QUERIES[active];

  /* Always dark — hardcode white-opacity values so light mode can never bleed in */
  const mentionedColor   = q.mentioned   ? '#f0efed'                   : 'rgba(240,239,237,0.18)';
  const recommendedColor = q.recommended ? '#f0efed' : q.mentioned     ? 'rgba(240,239,237,0.32)' : 'rgba(240,239,237,0.12)';
  const recGlow          = q.recommended ? '0 0 32px rgba(255,255,255,0.14)' : 'none';

  return (
    /* FORCE DARK — this component is permanently black */
    <div style={{
      border: '1px solid rgba(240,239,237,0.10)', borderRadius: 'var(--r-xl)',
      overflow: 'hidden', background: '#080808', color: '#f0efed'
    }}>
      {/* Header */}
      <div style={{
        padding: '20px 28px', borderBottom: '1px solid rgba(240,239,237,0.07)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12,
        background: '#050505'
      }}>
        <div>
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: 9.5, fontWeight: 700,
            letterSpacing: '0.12em', textTransform: 'uppercase',
            color: 'rgba(240,239,237,0.28)', marginBottom: 5
          }}>Recommendation Intelligence · Sample</div>
          <div style={{ fontSize: 14, fontWeight: 600, color: 'rgba(240,239,237,0.78)' }}>
            Mentioned ≠ Recommended — the distinction that matters.
          </div>
        </div>
        <span className="sample-badge">Illustrative data only</span>
      </div>

      {/* Query type selector */}
      <div style={{
        display: 'flex', gap: 6, padding: '14px 28px',
        borderBottom: '1px solid rgba(240,239,237,0.06)', flexWrap: 'wrap',
        background: '#060606'
      }}>
        {REC_QUERIES.map((item, i) => (
          <button key={i} id={`rec-q-${i}`} onClick={() => setActive(i)} style={{
            padding: '5px 13px',
            background: active === i ? 'rgba(240,239,237,0.92)' : 'rgba(240,239,237,0.05)',
            border: `1px solid ${active === i ? 'rgba(240,239,237,0.50)' : 'rgba(240,239,237,0.10)'}`,
            borderRadius: 999, fontFamily: 'var(--font-mono)', fontSize: 10,
            fontWeight: 600, color: active === i ? '#0a0a0a' : 'rgba(240,239,237,0.40)',
            cursor: 'pointer', transition: 'all 0.15s'
          }}>
            {item.type}
          </button>
        ))}
      </div>

      {/* Results grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr' }}>
        {/* Query */}
        <div style={{
          padding: '32px 28px',
          borderRight: '1px solid rgba(240,239,237,0.06)',
          background: '#080808'
        }}>
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: 8.5, fontWeight: 700,
            letterSpacing: '0.12em', textTransform: 'uppercase',
            color: 'rgba(240,239,237,0.28)', marginBottom: 16
          }}>Buyer query · {q.type}</div>
          <p style={{
            fontSize: 15, fontWeight: 600, color: 'rgba(240,239,237,0.82)',
            lineHeight: 1.55, fontStyle: 'italic', margin: 0
          }}>{q.q}</p>
        </div>

        {/* Mentioned */}
        <div style={{
          padding: '32px 28px', textAlign: 'center',
          borderRight: '1px solid rgba(240,239,237,0.06)',
          background: '#080808'
        }}>
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: 8.5, fontWeight: 700,
            letterSpacing: '0.12em', textTransform: 'uppercase',
            color: 'rgba(240,239,237,0.28)', marginBottom: 20
          }}>Mentioned?</div>
          <div style={{
            fontFamily: 'var(--font-serif)', fontSize: 64, fontWeight: 900,
            letterSpacing: '-0.04em', lineHeight: 1,
            color: mentionedColor, marginBottom: 10,
            textShadow: q.mentioned ? '0 0 28px rgba(255,255,255,0.18)' : 'none',
            transition: 'color 0.25s, text-shadow 0.25s',
          }}>{q.mentioned ? 'Yes' : 'No'}</div>
          <div style={{ fontSize: 12, color: 'rgba(240,239,237,0.35)', lineHeight: 1.55 }}>
            {q.mentioned ? 'Brand appears in the AI response' : 'Brand absent from this response'}
          </div>
        </div>

        {/* Recommended */}
        <div style={{
          padding: '32px 28px', textAlign: 'center',
          background: q.recommended ? 'rgba(240,239,237,0.03)' : '#080808',
          transition: 'background 0.25s'
        }}>
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: 8.5, fontWeight: 700,
            letterSpacing: '0.12em', textTransform: 'uppercase',
            color: 'rgba(240,239,237,0.28)', marginBottom: 20
          }}>Recommended?</div>
          <div style={{
            fontFamily: 'var(--font-serif)', fontSize: 64, fontWeight: 900,
            letterSpacing: '-0.04em', lineHeight: 1,
            color: recommendedColor, marginBottom: 10,
            textShadow: recGlow,
            transition: 'color 0.25s, text-shadow 0.25s',
          }}>{q.recommended ? 'Yes' : 'No'}</div>
          {q.pos && (
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700,
              color: 'rgba(240,239,237,0.50)', marginBottom: 8, letterSpacing: '0.04em'
            }}>Position #{q.pos}</div>
          )}
          <div style={{ fontSize: 12, color: 'rgba(240,239,237,0.35)', lineHeight: 1.55 }}>
            {q.recommended
              ? 'AI specifically recommends this brand'
              : q.mentioned
              ? 'Brand appears but is not recommended'
              : 'No visibility for this query type'}
          </div>
        </div>
      </div>

      {/* Insight bar */}
      <div style={{
        padding: '14px 28px', borderTop: '1px solid rgba(240,239,237,0.06)',
        background: 'rgba(240,239,237,0.02)',
        display: 'flex', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap'
      }}>
        <div style={{
          width: 5, height: 5, borderRadius: '50%', marginTop: 7, flexShrink: 0,
          background: q.recommended ? 'rgba(240,239,237,0.90)' : q.mentioned ? 'rgba(240,239,237,0.45)' : 'rgba(240,239,237,0.20)'
        }} />
        <p style={{ fontSize: 13, color: 'rgba(240,239,237,0.52)', margin: 0, lineHeight: 1.6, flex: 1 }}>
          {q.recommended
            ? 'Recommendation signal: AI actively names this brand as a suggested choice. These queries are closest to buyer decisions.'
            : q.mentioned
            ? 'Partial visibility: AI mentions the brand but does not recommend it. The gap between mention and recommendation is what Dyvin is built to surface and explain.'
            : 'Visibility gap: AI does not include this brand for this query type. Understanding which query types produce no visibility is the first step.'}
        </p>
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: 8.5, color: 'rgba(240,239,237,0.16)',
          letterSpacing: '0.06em', textTransform: 'uppercase', flexShrink: 0, marginTop: 4
        }}>SAMPLE · ILLUSTRATIVE</span>
      </div>
    </div>
  );
}

/* ─────────────────────── CITATION DEMO — WITH AUTHENTIC BRAND LOGOS ─── */
function CitationDemo() {
  const sources = [
    { name: 'G2 Reviews',       type: 'Review',      dir: 'yours',    count: 7, Icon: BrandIcon.G2,          color: '#FF492C' },
    { name: 'TechCrunch',       type: 'Media',        dir: 'yours',    count: 4, Icon: BrandIcon.TechCrunch,  color: '#00A562' },
    { name: 'ProductHunt',      type: 'Community',    dir: 'yours',    count: 3, Icon: BrandIcon.ProductHunt, color: '#DA552F' },
    { name: 'Reddit threads',   type: 'Community',    dir: 'neutral',  count: 6, Icon: BrandIcon.Reddit,      color: '#FF4500' },
    { name: 'Competitor blog',  type: 'Owned media',  dir: 'theirs',   count: 9, Icon: BrandIcon.Blog,        color: 'rgba(240,239,237,0.45)' },
    { name: 'Industry analyst', type: 'Analysis',     dir: 'theirs',   count: 5, Icon: BrandIcon.Analyst,     color: 'rgba(240,239,237,0.45)' },
  ];
  const maxCount = Math.max(...sources.map(s => s.count));

  // Monochrome: luminance encodes direction — yours = bright, theirs = dim, neutral = mid
  const dirAlpha = (dir: string) => dir === 'yours' ? 0.85 : dir === 'neutral' ? 0.40 : 0.22;
  const dirLabel = (dir: string) => dir === 'yours' ? '↗ Your brand' : dir === 'neutral' ? '— Neutral' : '↘ Competitor A';
  const dirBarColor = (dir: string, count: number, max: number) => {
    const pct = count / max;
    const base = dir === 'yours' ? 0.80 : dir === 'neutral' ? 0.38 : 0.22;
    return `rgba(255,255,255,${base * pct + base * 0.15})`;
  };

  return (
    <div style={{
      border: '1px solid rgba(255,255,255,0.08)', borderRadius: 'var(--r-xl)',
      overflow: 'hidden', background: '#080808'
    }}>
      {/* Header */}
      <div style={{ padding: '22px 32px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: 9.5, fontWeight: 700,
          letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', marginBottom: 6
        }}>Citation Intelligence · Sample data</div>
        <div style={{ fontSize: 15, fontWeight: 600, color: 'rgba(255,255,255,0.75)', letterSpacing: '-0.01em' }}>
          Visibility tells you what happened. Citations explain why.
        </div>
      </div>

      {/* Summary cards — no color borders */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', padding: '20px 32px', gap: 14, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        {[
          { label: 'Supporting your brand', count: 14, pct: 37, alpha: 0.85, dir: '↗' },
          { label: 'Supporting competitors', count: 14, pct: 47, alpha: 0.22, dir: '↘' },
        ].map(item => (
          <div key={item.label} style={{
            padding: '18px 22px',
            background: `rgba(255,255,255,${item.alpha * 0.04})`,
            border: `1px solid rgba(255,255,255,${item.alpha * 0.12})`,
            borderRadius: 'var(--r-lg)',
          }}>
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: 9, fontWeight: 600,
              letterSpacing: '0.10em', textTransform: 'uppercase',
              color: `rgba(255,255,255,${item.alpha * 0.5})`, marginBottom: 10
            }}>{item.dir} {item.label}</div>
            <div style={{
              fontFamily: 'var(--font-serif)', fontSize: 40, fontWeight: 900,
              letterSpacing: '-0.04em', color: `rgba(255,255,255,${item.alpha})`, lineHeight: 1,
              textShadow: `0 0 28px rgba(255,255,255,${item.alpha * 0.18})`
            }}>{item.count}</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: `rgba(255,255,255,${item.alpha * 0.4})`, marginTop: 5 }}>
              {item.pct}% of identified citations
            </div>
          </div>
        ))}
      </div>

      {/* Source table */}
      <div style={{ padding: '0 32px' }}>
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 100px 140px 160px',
          gap: 12, padding: '13px 0 11px', borderBottom: '1px solid rgba(255,255,255,0.06)'
        }}>
          {['Source', 'Type', 'Citation weight', 'Direction'].map(h => (
            <div key={h} style={{
              fontFamily: 'var(--font-mono)', fontSize: 8.5, fontWeight: 700,
              letterSpacing: '0.10em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.20)'
            }}>{h}</div>
          ))}
        </div>
        {sources.map((s, i) => {
          const alpha = dirAlpha(s.dir);
          const barC = dirBarColor(s.dir, s.count, maxCount);
          return (
            <div key={s.name} style={{
              display: 'grid', gridTemplateColumns: '1fr 100px 140px 160px',
              gap: 12, alignItems: 'center', padding: '11px 0',
              borderBottom: i < sources.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
              transition: 'background 0.15s',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <s.Icon size={24} />
                <span style={{ fontSize: 13.5, fontWeight: 600, color: `rgba(255,255,255,${alpha})`, letterSpacing: '-0.005em' }}>{s.name}</span>
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'rgba(255,255,255,0.22)' }}>{s.type}</div>
              {/* Monochrome bar — brightness = citation weight */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ flex: 1, height: 3, background: 'rgba(255,255,255,0.05)', borderRadius: 2, overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', width: `${(s.count / maxCount) * 100}%`,
                    background: `linear-gradient(90deg, rgba(255,255,255,${alpha * 0.4}), ${barC})`,
                    borderRadius: 2,
                    boxShadow: `2px 0 8px rgba(255,255,255,${alpha * 0.15})`
                  }} />
                </div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700, color: `rgba(255,255,255,${alpha * 0.7})`, minWidth: 14 }}>{s.count}</span>
              </div>
              {/* Direction — text only, no colored dot */}
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 600, color: `rgba(255,255,255,${alpha * 0.75})`, letterSpacing: '0.04em' }}>
                {dirLabel(s.dir)}
              </div>
            </div>
          );
        })}
      </div>
      <div style={{
        padding: '10px 32px', borderTop: '1px solid rgba(255,255,255,0.04)',
        fontFamily: 'var(--font-mono)', fontSize: 8, color: 'rgba(255,255,255,0.12)',
        letterSpacing: '0.06em', textTransform: 'uppercase'
      }}>
        Sample workspace · Illustrative data · Not real sources or citation counts
      </div>
    </div>
  );
}

/* ─────────────────────── COMPETITOR MAP — PREMIUM LUMINANCE RANKS ──── */
function CompetitorMap() {
  const [hovRow, setHovRow] = React.useState<number | null>(null);
  const rows = [
    { q: '"best AI analytics SaaS"',      you: 2, ca: 1, cb: 3, cc: 4, gap: -1 },
    { q: '"AI brand monitoring tools"',    you: 1, ca: 3, cb: 0, cc: 2, gap: +3 },
    { q: '"track brand in AI answers"',    you: 1, ca: 0, cb: 2, cc: 0, gap: +7 },
    { q: '"AEO platform 2026"',            you: 3, ca: 1, cb: 2, cc: 4, gap: -2 },
    { q: '"AI search visibility"',         you: 2, ca: 1, cb: 4, cc: 3, gap:  0 },
    { q: '"ai mention tracking software"', you: 2, ca: 3, cb: 0, cc: 1, gap: +4 },
  ];

  const rankMeta = (r: number, isYou = false) => {
    if (r === 0) return { alpha: 0.10, label: '—', size: 11, weight: 400 };
    const alphas = [0, 0.95, 0.60, 0.35, 0.18];
    const sizes  = [0,  16,   13,   11,   10];
    const label = isYou && r === 1 ? `1st ↑` : `${r}${r === 1 ? 'st' : r === 2 ? 'nd' : r === 3 ? 'rd' : 'th'}`;
    return { alpha: alphas[r] ?? 0.12, label, size: sizes[r] ?? 10, weight: r === 1 ? 800 : r === 2 ? 700 : 600 };
  };

  return (
    <div style={{
      border: '1px solid rgba(255,255,255,0.08)', borderRadius: 'var(--r-xl)',
      overflow: 'hidden', background: '#080808'
    }}>
      <div style={{
        padding: '22px 32px', borderBottom: '1px solid rgba(255,255,255,0.06)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10
      }}>
        <div>
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: 9.5, fontWeight: 700,
            letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', marginBottom: 6
          }}>Competitor Intelligence · Sample data</div>
          <div style={{ fontSize: 15, fontWeight: 600, color: 'rgba(255,255,255,0.72)', letterSpacing: '-0.01em' }}>
            Where you win. Where competitors win. Where the gap moves.
          </div>
        </div>
        <span className="sample-badge">Illustrative data</span>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <div style={{ minWidth: 680 }}>
          {/* Column headers */}
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 100px 100px 100px 100px 80px',
            padding: '11px 32px', borderBottom: '1px solid rgba(255,255,255,0.06)',
            background: 'rgba(255,255,255,0.02)', gap: 12, alignItems: 'center'
          }}>
            {['Query', 'Your brand', 'Comp. A', 'Comp. B', 'Comp. C', 'Gap trend'].map(h => (
              <div key={h} style={{
                fontFamily: 'var(--font-mono)', fontSize: 8.5, fontWeight: 700,
                letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.22)'
              }}>{h}</div>
            ))}
          </div>

          {rows.map((row, i) => (
            <div key={i}
              onMouseEnter={() => setHovRow(i)}
              onMouseLeave={() => setHovRow(null)}
              style={{
                display: 'grid', gridTemplateColumns: '1fr 100px 100px 100px 100px 80px',
                padding: '14px 32px',
                borderBottom: i < rows.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                gap: 12, alignItems: 'center',
                background: hovRow === i ? 'rgba(255,255,255,0.03)' : 'transparent',
                transition: 'background 0.15s',
                cursor: 'default',
              }}>
              <div style={{
                fontFamily: 'var(--font-mono)', fontSize: 11, color: 'rgba(255,255,255,0.45)', lineHeight: 1.4
              }}>{row.q}</div>
              {[
                { v: row.you, isYou: true },
                { v: row.ca,  isYou: false },
                { v: row.cb,  isYou: false },
                { v: row.cc,  isYou: false },
              ].map(({ v, isYou }, j) => {
                const m = rankMeta(v, isYou);
                return (
                  <div key={j} style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{
                      fontFamily: 'var(--font-mono)', fontSize: m.size, fontWeight: m.weight,
                      color: `rgba(255,255,255,${m.alpha})`,
                      letterSpacing: '-0.01em',
                      textShadow: v === 1 ? `0 0 16px rgba(255,255,255,${m.alpha * 0.5})` : 'none',
                      minWidth: 52,
                      borderBottom: isYou && v > 0 ? `1px solid rgba(255,255,255,${m.alpha * 0.25})` : 'none',
                      paddingBottom: isYou && v > 0 ? 2 : 0,
                    }}>{m.label}</div>
                  </div>
                );
              })}
              {/* Gap trend */}
              <div style={{
                fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700,
                color: row.gap > 0 ? 'rgba(255,255,255,0.65)' : row.gap < 0 ? 'rgba(255,255,255,0.22)' : 'rgba(255,255,255,0.35)',
                letterSpacing: '-0.01em',
              }}>
                {row.gap > 0 ? `+${row.gap}` : row.gap === 0 ? '±0' : `${row.gap}`}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary stats — no color */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        {[
          { label: 'Queries where you rank 1st', value: '2', alpha: 0.90 },
          { label: 'Queries where a competitor leads', value: '3', alpha: 0.35 },
          { label: 'Queries where gap is closing', value: '2', alpha: 0.65 },
        ].map((item, i) => (
          <div key={item.label} style={{
            padding: '18px 24px', textAlign: 'center',
            borderRight: i < 2 ? '1px solid rgba(255,255,255,0.06)' : 'none',
            background: 'rgba(255,255,255,0.01)',
          }}>
            <div style={{
              fontFamily: 'var(--font-serif)', fontSize: 32, fontWeight: 900,
              letterSpacing: '-0.035em', lineHeight: 1, marginBottom: 6,
              color: `rgba(255,255,255,${item.alpha})`,
              textShadow: `0 0 20px rgba(255,255,255,${item.alpha * 0.22})`,
            }}>{item.value}</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.08em', textTransform: 'uppercase', lineHeight: 1.5 }}>{item.label}</div>
          </div>
        ))}
      </div>

      <div style={{
        padding: '9px 28px', borderTop: '1px solid rgba(255,255,255,0.04)',
        fontFamily: 'var(--font-mono)', fontSize: 8, color: 'rgba(255,255,255,0.12)',
        letterSpacing: '0.06em', textTransform: 'uppercase'
      }}>
        Sample workspace · Illustrative data · Not real competitors or positions
      </div>
    </div>
  );
}

/* ─────────────────────── EARLY STAGE ───────────────────────────────── */
function EarlyStage({ live }: { live: boolean }) {
  return (
    <div className="early-stage-section">
      {/* Left: narrative */}
      <div>
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: 9.5, fontWeight: 700,
          letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--fg-4)', marginBottom: 20
        }}>14 — Where we are today</div>
        <h3 style={{
          fontFamily: 'var(--font-serif)', fontSize: 'clamp(28px, 3.2vw, 46px)',
          fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.1, color: 'var(--fg)', marginBottom: 16
        }}>Early product.<br />Large problem.<br />Clear direction.</h3>
        <p style={{ fontSize: 15, lineHeight: 1.7, color: 'var(--fg-3)', marginBottom: 0, maxWidth: 460 }}>
          We are not pretending this is done. The backend infrastructure exists. The frontend is being built. The problem is real and the category is forming now.
        </p>
        <div className="early-signal-section">
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16,
            fontFamily: 'var(--font-mono)', fontSize: 9.5, fontWeight: 700,
            letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--fg-4)'
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'rgba(240,239,237,0.55)', display: 'inline-block' }} />
            Founder note
          </div>
          <p className="early-signal-quote">
            "Early conversations through LinkedIn and B2B outreach are informing the product and ICP. This is market signal, not traction. We are using it to build something more useful than the alternatives, not to inflate a deck."
          </p>
          <div style={{ marginTop: 14, fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-4)' }}>
            — Naresh Singam, Founder · Dyvin AI · Bengaluru
          </div>
        </div>
      </div>

      {/* Right: build status visualization */}
      <div>
        <div style={{
          background: '#060606', border: '1px solid rgba(240,239,237,0.08)',
          borderRadius: 'var(--r-xl)', overflow: 'hidden',
        }}>
          {/* Graph header */}
          <div style={{
            padding: '18px 24px', borderBottom: '1px solid rgba(240,239,237,0.06)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            background: '#040404',
          }}>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(240,239,237,0.28)', marginBottom: 3 }}>BUILD STATUS</div>
              <div style={{ fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 600, color: 'rgba(240,239,237,0.72)' }}>Product development progress</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              {(['LIVE', 'IN PROGRESS', 'ROADMAP'] as const).map(t => (
                <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <div style={{
                    width: 6, height: 6, borderRadius: '50%',
                    background: t === 'LIVE' ? 'rgba(240,239,237,0.80)' : t === 'IN PROGRESS' ? 'rgba(240,239,237,0.38)' : 'rgba(240,239,237,0.14)',
                    boxShadow: t === 'LIVE' ? '0 0 6px rgba(240,239,237,0.50)' : 'none',
                  }} />
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 8.5, fontWeight: 600, letterSpacing: '0.08em', color: 'rgba(240,239,237,0.28)', textTransform: 'uppercase' }}>{t}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bars */}
          <div style={{ padding: '8px 0' }}>
            {[
              { label: 'AI response collection', sub: 'Backend infrastructure', pct: 80, tag: 'LIVE' as const },
              { label: 'Entity extraction & scoring', sub: 'NLP pipeline', pct: 75, tag: 'LIVE' as const },
              { label: 'DVS scoring algorithm', sub: 'Core metric engine', pct: 70, tag: 'LIVE' as const },
              { label: 'Citation identification', sub: 'Source attribution', pct: 65, tag: 'IN PROGRESS' as const },
              { label: 'Competitor mapping', sub: 'Relative visibility', pct: 55, tag: 'IN PROGRESS' as const },
              { label: 'Frontend product workspace', sub: 'Dashboard & UI', pct: 30, tag: 'IN PROGRESS' as const },
              { label: 'Recommendation layer', sub: 'Action intelligence', pct: 20, tag: 'ROADMAP' as const },
              { label: 'Closed-loop optimisation', sub: 'Verification engine', pct: 10, tag: 'ROADMAP' as const },
            ].map((item, i, arr) => {
              const isLive = item.tag === 'LIVE';
              const isProgress = item.tag === 'IN PROGRESS';
              const trackOpacity = isLive ? 0.80 : isProgress ? 0.38 : 0.14;
              const barGlow = isLive ? `0 0 8px rgba(240,239,237,0.22)` : 'none';
              const showSep = i > 0 && arr[i - 1].tag !== item.tag;
              return (
                <div key={item.label}>
                  {showSep && <div style={{ height: 1, background: 'rgba(240,239,237,0.04)', margin: '6px 0' }} />}
                  <div style={{
                    display: 'grid', gridTemplateColumns: '1fr 280px 42px',
                    alignItems: 'center', gap: 16, padding: '11px 24px',
                    borderBottom: i < arr.length - 1 ? '1px solid rgba(240,239,237,0.03)' : 'none',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(240,239,237,0.02)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    {/* Label + status indicator */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                      <div style={{
                        width: 5, height: 5, borderRadius: '50%', flexShrink: 0,
                        background: `rgba(240,239,237,${trackOpacity})`,
                        boxShadow: isLive ? `0 0 5px rgba(240,239,237,0.50)` : 'none',
                      }} />
                      <div>
                        <div style={{ fontFamily: 'var(--font-sans)', fontSize: 12.5, fontWeight: 600, color: `rgba(240,239,237,${isLive ? 0.82 : isProgress ? 0.55 : 0.30})`, lineHeight: 1.2 }}>{item.label}</div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'rgba(240,239,237,0.22)', marginTop: 2, letterSpacing: '0.04em' }}>{item.sub}</div>
                      </div>
                    </div>

                    {/* Progress track */}
                    <div style={{ position: 'relative' }}>
                      {/* Track marks */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5, paddingRight: 2 }}>
                        {[0, 25, 50, 75, 100].map(mark => (
                          <div key={mark} style={{ fontFamily: 'var(--font-mono)', fontSize: 7, color: 'rgba(240,239,237,0.14)', letterSpacing: '0.04em' }}>{mark > 0 ? `${mark}` : ''}</div>
                        ))}
                      </div>
                      {/* Track */}
                      <div style={{ height: 5, background: 'rgba(240,239,237,0.06)', borderRadius: 3, overflow: 'hidden', position: 'relative' }}>
                        {/* Tick marks inside track */}
                        {[25, 50, 75].map(tick => (
                          <div key={tick} style={{
                            position: 'absolute', top: 0, bottom: 0, width: 1,
                            left: `${tick}%`, background: 'rgba(0,0,0,0.45)', zIndex: 1,
                          }} />
                        ))}
                        {/* Fill */}
                        <div style={{
                          position: 'absolute', inset: 0,
                          width: live ? `${item.pct}%` : '0%',
                          background: isLive
                            ? `linear-gradient(90deg, rgba(240,239,237,0.30) 0%, rgba(240,239,237,${trackOpacity}) 100%)`
                            : isProgress
                            ? `linear-gradient(90deg, rgba(240,239,237,0.10) 0%, rgba(240,239,237,0.38) 100%)`
                            : `linear-gradient(90deg, rgba(240,239,237,0.04) 0%, rgba(240,239,237,0.14) 100%)`,
                          borderRadius: 3,
                          boxShadow: barGlow,
                          transition: 'width 1.6s cubic-bezier(0.4,0,0.2,1)',
                        }} />
                      </div>
                      {/* Status badge below bar */}
                      <div style={{
                        marginTop: 5, display: 'flex', alignItems: 'center', gap: 6,
                        fontFamily: 'var(--font-mono)', fontSize: 7.5, fontWeight: 700, letterSpacing: '0.10em', textTransform: 'uppercase',
                        color: `rgba(240,239,237,${isLive ? 0.45 : isProgress ? 0.22 : 0.12})`,
                      }}>
                        {item.tag}
                      </div>
                    </div>

                    {/* Percentage */}
                    <div style={{
                      fontFamily: 'var(--font-mono)', fontSize: 15, fontWeight: 800,
                      color: `rgba(240,239,237,${isLive ? 0.75 : isProgress ? 0.42 : 0.20})`,
                      letterSpacing: '-0.02em', textAlign: 'right',
                      textShadow: isLive ? '0 0 12px rgba(240,239,237,0.20)' : 'none',
                    }}>{item.pct}%</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Graph footer */}
          <div style={{
            padding: '11px 24px', borderTop: '1px solid rgba(240,239,237,0.05)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            background: '#040404',
          }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 8.5, color: 'rgba(240,239,237,0.18)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              Updated August 2026 · Not a commitment · Subject to change
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 5, height: 5, borderRadius: '50%', background: 'rgba(240,239,237,0.55)', animation: 'pulse-dot 2s infinite' }} />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 8.5, color: 'rgba(240,239,237,0.28)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Active build</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────── MAIN LANDING PAGE ─────────────────────────── */
export function LandingPage({
  onLogin, onSignup, onAnalyze
}: {
  onLogin?: () => void; onSignup?: () => void; onAnalyze?: (d?: string) => void;
}) {
  if (!onSignup && onAnalyze) onSignup = () => onAnalyze?.();

  const { theme, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const scrolled = useNavScroll();
  const scrollPct = useScrollPct();

  const { ref: visRef, inView: visInView } = useInView(0.2);
  const { ref: benchRef, inView: benchInView } = useInView(0.2);
  const { ref: earlyRef, inView: earlyInView } = useInView(0.2);
  const score = useCounter(74);

  function go(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMobileOpen(false);
  }

  const WORKFLOW = useMemo(() => [
    { n: '01', title: 'Audit',     tag: 'CURRENT',  Icon: Ico.Search,   copy: 'Establish the current baseline — where the brand appears, where it is absent, which models and queries matter.' },
    { n: '02', title: 'Benchmark', tag: 'CURRENT',  Icon: Ico.Bar,      copy: 'Compare against relevant competitors across models, topics, and query types. Understand who wins and where.' },
    { n: '03', title: 'Diagnose',  tag: 'CURRENT',  Icon: Ico.Activity, copy: 'Investigate the drivers behind visibility outcomes — citation gaps, source differences, entity gaps, competitor strengths.' },
    { n: '04', title: 'Act',       tag: 'ROADMAP',  Icon: Ico.Bulb,     copy: 'Turn intelligence into specific opportunities — content, citations, narrative, competitive responses — with measurable intent.' },
    { n: '05', title: 'Verify',    tag: 'ROADMAP',  Icon: Ico.Trend,    copy: 'Measure whether the intervention changed AI visibility. Without verification, optimization is only advice.' },
  ], []);

  const ROLES = useMemo(() => [
    { n: '01', Icon: Ico.Brief,  title: 'Founders & Executives',  copy: 'Get a direct answer: "When buyers ask AI about our category, does our brand appear and get recommended?" Then understand why.' },
    { n: '02', Icon: Ico.Trend,  title: 'Marketing & Growth',     copy: 'Measure AI visibility across the queries your buyers actually ask. Understand which AI-generated answers surface your brand vs. competitors.' },
    { n: '03', Icon: Ico.Search, title: 'SEO & Content Teams',    copy: 'Identify the gap between your traditional search strategy and AI-mediated discovery. Understand which sources influence AI answers in your category.' },
    { n: '04', Icon: Ico.Users,  title: 'Agencies',               copy: 'Monitor and compare AI visibility across multiple brand clients. Build AI intelligence into your strategy and reporting offering.' },
  ], []);

  const FAQS = useMemo(() => [
    {
      q: 'What is AI visibility?',
      a: 'AI visibility describes how often, where, and how well a brand appears in AI-generated answers across systems like ChatGPT, Claude, Gemini, and Perplexity. It is distinct from traditional search rankings — a brand can rank well in Google and still be invisible inside AI-generated responses that buyers increasingly rely on for decisions.'
    },
    {
      q: 'How is Dyvin AI different from SEO tools like Ahrefs or Semrush?',
      a: 'SEO tools are built around traditional search engines — rankings, backlinks, keyword positions, and search traffic. Dyvin is designed to measure a different layer: what AI systems say when a buyer asks about your category. These are different signals with fundamentally different mechanics. Dyvin is not a replacement for SEO tools — it is a complement for the discovery layer SEO tools do not cover.'
    },
    {
      q: 'What is the difference between being mentioned and being recommended?',
      a: 'An AI response can mention a brand in passing — in a market description or a list of companies — without specifically recommending it to the buyer. Recommendation means the AI is directly advising the buyer to consider or use a specific brand. Recommendation-class visibility is closer to a buyer decision. Dyvin is designed to measure both and clearly distinguish between them — because the gap between the two is often significant.'
    },
    {
      q: 'What is citation intelligence?',
      a: 'AI systems form their responses partly based on the sources they can access and cite. Citation intelligence means understanding which sources are being referenced when AI responds about your category — which sources support your brand, which support competitors, and which appear to shape the AI\'s overall view of the market. Visibility tells you what the AI said. Citation intelligence is designed to help explain why it said it.'
    },
    {
      q: 'Which AI engines does Dyvin track?',
      a: 'The initial version is being built to track ChatGPT, Claude, Gemini, and Perplexity — the engines where B2B buyers are most actively asking discovery and recommendation questions. Copilot, Meta AI, and others are on the roadmap. Different engines can produce meaningfully different answers, cite different sources, and recommend different brands — which is why multi-model coverage matters.'
    },
    {
      q: 'Why does AI visibility change over time?',
      a: 'AI visibility can vary with model version, prompt wording, context, geography, time, retrieval sources, system updates, and the non-deterministic nature of language models. A single isolated AI answer is not a useful business metric. Meaningful intelligence requires repeated, structured observation across queries and models — which is the fundamental design principle behind Dyvin.'
    },
    {
      q: 'Can Dyvin explain why competitors appear more often?',
      a: 'This is a core goal of the diagnostic layer. Understanding visibility gaps requires identifying citation differences, source differences, entity differences, and narrative differences between your brand and a competitor. The ambition is not just "competitor A ranks higher" but to surface specifically what appears to be driving the difference — so something can actually be done about it.'
    },
    {
      q: 'How does Dyvin differ from Peec or Profound?',
      a: 'Peec and Profound validate that AI visibility is a real and growing market problem — both products have made meaningful contributions to the category. Dyvin\'s focus is on a specific intelligence thesis: connecting AI visibility signals to their underlying sources and causes, and eventually to verifiable action outcomes. Rather than competing on feature counts, Dyvin is attempting to own a sharper problem — recommendation intelligence, citation reasoning, and closed-loop verification.'
    },
    {
      q: 'What is live today vs. roadmap?',
      a: 'The backend infrastructure — AI response collection, normalisation, entity extraction, and initial scoring — is substantially developed. The frontend product workspace is approximately 30% complete and under active development. Steps 01 (Audit), 02 (Benchmark), and 03 (Diagnose) are current priorities. Steps 04 (Act) and 05 (Verify) are on the roadmap. Early access users will be onboarded personally by the founder.'
    },
    {
      q: 'How can I request access?',
      a: 'Request early access using the button on this page. Founding users will be onboarded personally by the founder — no automated self-serve trial is available at this stage. Early access pricing reflects the pre-launch stage and will change before general availability. No credit card is required to request access.'
    },
  ], []);

  return (
    <div className={`dyvin-landing${theme === 'light' ? ' light' : ''}`}>

      {/* Skip to main content — accessibility */}
      <a href="#hero" className="skip-link">Skip to main content</a>

      {/* Progress bar */}
      <div aria-hidden style={{
        position: 'fixed', top: 0, left: 0, height: 2, zIndex: 400, pointerEvents: 'none',
        background: 'linear-gradient(90deg, #e8e6e1, #c8c6c1)',
        width: `${scrollPct}%`, transition: 'width 0.08s linear'
      }} />

      {/* ══════ NAV ══════ */}
      <nav className={`l-nav${scrolled ? ' l-nav--scrolled' : ''}`}
        role="navigation" aria-label="Main navigation">
        <div className="l-nav__inner">
          <a href="/" className="l-nav__brand" aria-label="Dyvin AI home" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <DyvinLogo size={28} className="dyvin-logo-icon" fill={theme === 'light' ? '#000000' : '#f0efed'} />
            Dyvin AI
          </a>

          <div className="l-nav__links">
            {[
              ['Platform', 'platform'],
              ['Intelligence', 'intelligence'],
              ['How it works', 'workflow'],
              ['Pricing', 'pricing'],
            ].map(([label, id]) => (
              <button key={id} className="l-nav__link" onClick={() => go(id)}>{label}</button>
            ))}
          </div>

          <div className="l-nav__actions">
            <button className="l-nav__icon-btn" onClick={toggleTheme} aria-label="Toggle theme">
              {theme === 'dark' ? <Ico.Sun size={15} /> : <Ico.Moon size={15} />}
            </button>
            <button className="btn btn-outline btn-sm" onClick={onLogin} id="nav-login-btn">Log in</button>
            <button className="btn btn-primary btn-sm" onClick={onSignup} id="nav-signup-btn">
              Request access <Ico.Arrow size={13} />
            </button>
            <button className="l-nav__icon-btn"
              style={{ display: 'none' }} id="nav-mobile-btn"
              onClick={() => setMobileOpen(v => !v)} aria-label="Open menu"
              aria-expanded={mobileOpen}>
              {mobileOpen ? <Ico.X size={16} /> : <Ico.Menu size={16} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <div className={`l-mobile-menu${mobileOpen ? ' open' : ''}`} aria-hidden={!mobileOpen}>
        {[['Platform', 'platform'], ['Intelligence', 'intelligence'], ['Workflow', 'workflow'], ['Pricing', 'pricing']].map(([l, id]) => (
          <button key={id} className="l-mobile-menu__link" onClick={() => go(id)}>{l}</button>
        ))}
        <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button className="btn btn-ghost btn-lg" onClick={onLogin} style={{ justifyContent: 'center' }}>Log in</button>
          <button className="btn btn-primary btn-lg" onClick={onSignup} style={{ justifyContent: 'center' }}>
            Request access <Ico.Arrow size={15} />
          </button>
        </div>
      </div>

      {/* ══════ HERO ══════ */}
      <section className="hero" id="hero" aria-labelledby="hero-h1">
        <div className="hero__content">
          <Reveal>
            <div className="hero__eyebrow">
              <div className="pill pill--blue">
                <span className="pill__dot" aria-hidden />
                AI Visibility Operating System
              </div>
            </div>
            <h1 className="hero__h1" id="hero-h1">
              Make AI<br />Recommend<br />Your Brand.
            </h1>
            <p className="hero__sub">
              Measure how AI discovers, describes, and recommends your brand — across every engine your buyers use.
            </p>
            <div className="hero__actions">
              <button className="btn btn-primary btn-lg" onClick={onSignup} id="hero-primary-btn">
                Get your AI visibility baseline <Ico.Arrow size={15} />
              </button>
              <button className="btn btn-ghost btn-lg" onClick={() => go('platform')} id="hero-secondary-btn">
                <Ico.Play size={13} /> Explore the platform
              </button>
            </div>
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: 10.5,
              color: 'rgba(255,255,255,0.24)', letterSpacing: '0.04em', marginBottom: 72
            }}>
              AI visibility intelligence · Founded 2026, Bengaluru · Pre-seed · Early access open
            </div>
          </Reveal>
        </div>

        <Reveal delay={100}>
          <div className="ticker" style={{ marginBottom: 40, padding: '24px 0', borderTop: '1px solid rgba(240,239,237,0.06)', borderBottom: '1px solid rgba(240,239,237,0.06)' }}>
            <div className="ticker__track">
              {Array(3).fill(null).map((_, i) => (
                <React.Fragment key={i}>
                  <div className="ticker__item"><span className="ticker__item-dot" /> Multi-model tracking</div>
                  <div className="ticker__item"><span className="ticker__item-dot" /> Query-level intelligence</div>
                  <div className="ticker__item"><span className="ticker__item-dot" /> Longitudinal measurement</div>
                  <div className="ticker__item"><span className="ticker__item-dot" /> Closed-loop design</div>
                  <div className="ticker__item"><span className="ticker__item-dot" /> Citation reasoning</div>
                  <div className="ticker__item"><span className="ticker__item-dot" /> Recommendation intelligence</div>
                </React.Fragment>
              ))}
            </div>
          </div>
        </Reveal>

        <div className="hero__visual" id="platform">
          <Reveal delay={120}>
            <div className="hero__dashboard-wrapper"
              role="img"
              aria-label="Sample Dyvin AI product dashboard showing illustrative visibility scores, 90-day DVS trajectory, and query position rankings — not real data">
              <div className="hero__dashboard-glow" aria-hidden />
              <HeroDashboard />
              <div className="hero__dashboard-fade" aria-hidden />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══════ BRAND LOGOS (REFERENCE IMAGE 2 STYLE) ══════ */}
      <section style={{ padding: '40px 0 46px', borderTop: '1px solid rgba(240,239,237,0.06)', borderBottom: '1px solid rgba(240,239,237,0.06)', background: '#000000' }}>
        <div className="l-wrap">
          <div style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 9.5, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(240,239,237,0.35)', marginBottom: 26 }}>
            Tracked across the AI engines your buyers use
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px 24px', flexWrap: 'wrap' }}>
            {AI_ENGINES_CONFIG.map(engine => (
              <BrandStripLogo key={engine.id} engine={engine} />
            ))}
          </div>
        </div>
      </section>

      {/* ══════ 01 DISCOVERY LAYER ══════ */}
      <section className="l-section" id="intelligence" aria-label="The new discovery layer">
        <div className="l-wrap">
          <Reveal>
            <div className="section-label">01 — The New Discovery Layer</div>
            <h2 className="t-h2" style={{ marginBottom: 18 }}>
              Discovery moved.<br />Most brands didn't.
            </h2>
            <p className="t-body-xl" style={{ maxWidth: 540, marginBottom: 60 }}>
              Buyers increasingly ask AI for answers, comparisons, and recommendations. The answer itself has become a discovery surface. Traditional search analytics do not fully see it.
            </p>
          </Reveal>

          <Reveal delay={60}>
            <div className="discovery-grid">
              {/* Traditional */}
              <div className="discovery-col">
                <div className="discovery-label" style={{ color: 'var(--fg-4)' }}>Traditional search</div>
                {[
                  ['Query', 'User searches a keyword or phrase'],
                  ['Ranked list', 'Web pages ordered by algorithm'],
                  ['Click', 'User chooses a link to visit'],
                  ['Website', 'Brand controls the experience from here'],
                ].map(([s, d], i) => (
                  <div key={i} className="discovery-step">
                    <div className="discovery-step-icon" style={{
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.07)'
                    }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.2)' }}>
                        {String(i + 1).padStart(2, '0')}
                      </span>
                    </div>
                    <div>
                      <div className="discovery-step-label" style={{ color: 'var(--fg-2)' }}>{s}</div>
                      <div className="discovery-step-value">{d}</div>
                    </div>
                  </div>
                ))}
                <div style={{
                  marginTop: 16, padding: '10px 14px', background: 'rgba(255,255,255,0.02)',
                  border: '1px solid var(--border)', borderRadius: 8,
                  fontFamily: 'var(--font-mono)', fontSize: 10, color: 'rgba(255,255,255,0.25)'
                }}>
                  SEO tools measure this layer well. ✓
                </div>
              </div>

              {/* Divider */}
              <div className="discovery-divider" aria-hidden>
                <span style={{
                  fontFamily: 'var(--font-mono)', fontSize: 9, fontWeight: 700,
                  color: 'rgba(255,255,255,0.15)', writingMode: 'vertical-rl',
                  textTransform: 'uppercase', letterSpacing: '0.1em'
                }}>SHIFT</span>
              </div>

              {/* AI */}
              <div className="discovery-col">
                <div className="discovery-label" style={{ color: 'var(--fg-2)' }}>AI-mediated discovery</div>
                {[
                  ['Question', 'Buyer asks AI for a recommendation or comparison'],
                  ['Generated answer', 'AI constructs a response from knowledge and sources'],
                  ['Citations & entities', 'Brands, products, and sources surface in the answer'],
                  ['Recommendation', 'AI names specific companies or products to consider'],
                  ['Decision', 'Buyer acts — often before visiting any website'],
                ].map(([s, d], i) => (
                  <div key={i} className="discovery-step">
                    <div className="discovery-step-icon" style={{
                      background: 'rgba(240,239,237,0.06)',
                      border: '1px solid rgba(240,239,237,0.14)'
                    }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, fontWeight: 700, color: 'rgba(240,239,237,0.70)' }}>
                        {String(i + 1).padStart(2, '0')}
                      </span>
                    </div>
                    <div>
                      <div className="discovery-step-label" style={{ color: 'var(--fg)' }}>{s}</div>
                      <div className="discovery-step-value">{d}</div>
                    </div>
                  </div>
                ))}
                <div style={{
                  marginTop: 16, padding: '10px 14px',
                  background: 'rgba(240,239,237,0.04)', border: '1px solid rgba(240,239,237,0.10)',
                  borderRadius: 8, fontFamily: 'var(--font-mono)', fontSize: 10, color: 'rgba(240,239,237,0.50)'
                }}>
                  Traditional SEO tools do not fully measure this. Dyvin is being built to.
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══════ 02 BLIND SPOT ══════ */}
      <section className="l-section l-section--light" aria-label="The visibility blind spot">
        <div className="l-wrap">
          <Reveal>
            <div className="section-label" style={{ color: 'var(--ls-fg-3)' }}>02 — The Blind Spot</div>
            <h2 className="t-h2" style={{ color: 'var(--ls-fg)', marginBottom: 18 }}>
              Brands cannot manage<br />a channel they cannot see.
            </h2>
            <p className="t-body-xl" style={{ color: 'var(--ls-fg-2)', maxWidth: 520, marginBottom: 52 }}>
              AI systems are already responding to buyer queries about your category. Every answer contains intelligence. Four questions define the full picture.
            </p>
          </Reveal>

          <Reveal delay={60}>
            <div className="problem-4-grid">
              {[
                {
                  n: '01', word: 'DISCOVER',
                  q: 'Does AI know your brand exists?',
                  d: 'Does AI correctly associate your company with your category and use case? Or is it invisible inside the models your buyers use?'
                },
                {
                  n: '02', word: 'UNDERSTAND',
                  q: 'Does AI describe you correctly?',
                  d: 'When AI mentions your brand, is the description accurate? Does it reflect your current positioning — or an outdated, incomplete, or incorrect version?'
                },
                {
                  n: '03', word: 'TRUST',
                  q: 'Which sources shape AI\'s view?',
                  d: 'What citations and information sources is AI using when it responds about your category? Are those sources helping your brand — or a competitor?'
                },
                {
                  n: '04', word: 'RECOMMEND',
                  q: 'Would AI recommend you?',
                  d: 'When a buyer asks for a recommendation in your category, does your brand appear — at what position — or does a competitor get the recommendation instead?'
                },
              ].map(item => (
                <div key={item.n} className="problem-card-item">
                  <span className="problem-num">{item.n}</span>
                  <span className="problem-question-word">{item.word}</span>
                  <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--ls-fg)', marginBottom: 10, lineHeight: 1.3 }}>{item.q}</div>
                  <div style={{ fontSize: 13, lineHeight: 1.65, color: 'var(--ls-fg-3)' }}>{item.d}</div>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={100}>
            <div style={{
              marginTop: 24, padding: '18px 28px', background: 'var(--ls-surface)',
              border: '1px solid var(--ls-border-2)', borderRadius: 'var(--r-xl)',
              display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap'
            }}>
              <p style={{ flex: 1, minWidth: 260, fontSize: 15, lineHeight: 1.65, color: 'var(--ls-fg-2)', margin: 0 }}>
                SEO tells you where you rank. <strong style={{ color: 'var(--ls-fg)' }}>Dyvin is designed to show you how AI sees, describes, and recommends your brand</strong> — the layer SEO tools do not reach.
              </p>
              <button className="btn btn-primary" onClick={onSignup} id="problem-cta-btn">
                Get your baseline <Ico.Arrow size={13} />
              </button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══════ 03 VISIBILITY INTELLIGENCE ══════ */}
      <section className="l-section section-force-dark" id="visibility" aria-label="DVS visibility score">
        <div className="l-wrap">
          <div style={{ display: 'grid', gridTemplateColumns: 'min(380px, 38%) 1fr', gap: 64, alignItems: 'start' }}>
            <Reveal>
              <div>
                <div className="section-label">03 — Visibility Intelligence</div>
                <h2 className="t-h2" style={{ marginBottom: 20 }}>
                  Measure your AI<br />share of voice.
                </h2>
                <p className="t-body-lg" style={{ marginBottom: 24 }}>
                  The DVS (Dyvin Visibility Score) tracks how your brand's position in AI-generated responses changes across models and time — a longitudinal intelligence signal, not a one-time snapshot.
                </p>
                <p className="t-body" style={{ marginBottom: 36 }}>
                  A single isolated AI answer is not a useful business metric. Repeated, structured observation is.
                </p>
                <div style={{ display: 'flex', gap: 14, marginBottom: 32 }} ref={score.ref}>
                  {[
                    { v: String(score.count), l: 'Current DVS', s: 'Sample workspace' },
                    { v: '−15', l: 'vs. top competitor', s: 'Gap closing in sample', c: 'rgba(240,239,237,0.65)' },
                  ].map((stat, i) => (
                    <div key={i} style={{
                      padding: '18px 22px', background: 'var(--bg-card)',
                      border: '1px solid var(--border-2)', borderRadius: 'var(--r-xl)', flex: 1
                    }}>
                      <div style={{
                        fontFamily: 'var(--font-serif)', fontSize: 48, fontWeight: 900,
                        letterSpacing: '-0.04em', lineHeight: 1, color: stat.c ?? 'var(--fg)', marginBottom: 5
                      }}>{stat.v}</div>
                      <div style={{
                        fontFamily: 'var(--font-mono)', fontSize: 9.5, fontWeight: 700,
                        letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--fg-4)', marginBottom: 3
                      }}>{stat.l}</div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, color: 'var(--fg-5)' }}>{stat.s}</div>
                    </div>
                  ))}
                </div>
                <button className="btn btn-primary" onClick={onSignup} id="vis-cta-btn">
                  Get your baseline DVS <Ico.Arrow size={13} />
                </button>
                <div style={{
                  fontFamily: 'var(--font-mono)', fontSize: 9.5,
                  color: 'var(--fg-4)', marginTop: 12, letterSpacing: '0.04em'
                }}>SAMPLE WORKSPACE · ILLUSTRATIVE DATA</div>
              </div>
            </Reveal>

            <Reveal delay={80}>
              <div ref={visRef}>
                <div style={{
                  fontFamily: 'var(--font-mono)', fontSize: 9.5, fontWeight: 700,
                  letterSpacing: '0.12em', textTransform: 'uppercase',
                  color: 'var(--fg-4)', marginBottom: 12
                }}>90-Day DVS Trajectory · Sample · Illustrative data</div>
                <DVSChart animate={visInView} />
                {/* Stat boxes — BELOW chart, permanently dark */}
                <div style={{ marginTop: 24, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  {[
                    { l: 'Crossover point', v: 'Week 9', s: 'Brand exceeds competitor in sample', c: 'rgba(240,239,237,0.50)' },
                    { l: 'Final gap', v: '+16 pts', s: 'Brand vs. competitor at W12', c: 'rgba(240,239,237,0.75)' },
                  ].map(stat => (
                    <div key={stat.l} style={{
                      padding: '18px 22px',
                      /* PERMANENTLY DARK — hardcoded, immune to theme */
                      background: '#0d0d0d',
                      border: '1px solid rgba(240,239,237,0.09)',
                      borderLeft: `3px solid ${stat.c}`,
                      borderRadius: 'var(--r-xl)',
                    }}>
                      <div style={{
                        fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.10em',
                        textTransform: 'uppercase', color: 'rgba(240,239,237,0.30)', marginBottom: 7
                      }}>{stat.l}</div>
                      <div style={{
                        fontFamily: 'var(--font-serif)', fontSize: 28, fontWeight: 800,
                        letterSpacing: '-0.025em', color: '#f0efed', lineHeight: 1, marginBottom: 5
                      }}>{stat.v}</div>
                      <div style={{ fontSize: 12, color: 'rgba(240,239,237,0.42)' }}>{stat.s}</div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ══════ 04 MULTI-MODEL ══════ */}
      <section className="l-section l-section--surface" aria-label="Multi-model intelligence">
        <div className="l-wrap">
          <Reveal>
            <div className="section-label">04 — Multi-Model Intelligence</div>
            <h2 className="t-h2" style={{ marginBottom: 18 }}>Every model. Every query.</h2>
            <p className="t-body-xl" style={{ maxWidth: 560, marginBottom: 16 }}>
              Different AI systems produce different answers, cite different sources, and recommend different brands.
            </p>
            <p className="t-body" style={{ maxWidth: 560, marginBottom: 52 }}>
              Treating "AI" as a single engine misses the variation that matters for business decisions. Dyvin is designed to compare visibility across the models your buyers actually use.
            </p>
          </Reveal>
          <Reveal delay={60}>
            <div ref={benchRef}><BenchTable animate={benchInView} /></div>
          </Reveal>
        </div>
      </section>

      {/* ══════ 05 RECOMMENDATION INTELLIGENCE ══════ */}
      <section className="l-section" aria-label="Recommendation intelligence">
        <div className="l-wrap">
          <Reveal>
            <div className="section-label">05 — Recommendation Intelligence</div>
            <h2 className="t-h2" style={{ marginBottom: 18 }}>
              Mentioned is not<br />the same as recommended.
            </h2>
            <p className="t-body-xl" style={{ maxWidth: 600, marginBottom: 20 }}>
              An AI response can mention a brand without recommending it. Recommendation-class queries — "What are the best tools for X?", "Which platform should I buy?" — are closer to buyer decisions than generic mentions.
            </p>
            <p className="t-body" style={{ maxWidth: 600, marginBottom: 52 }}>
              Dyvin is designed to measure both and clearly distinguish between them. The gap between mention and recommendation is often where the competitive picture actually lives.
            </p>
          </Reveal>
          <Reveal delay={60}><RecommendationDemo /></Reveal>

          <Reveal delay={80}>
            <div style={{ marginTop: 24 }}>
              <div style={{
                fontFamily: 'var(--font-mono)', fontSize: 9.5, fontWeight: 700,
                letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--fg-4)', marginBottom: 16
              }}>Query classes Dyvin tracks</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                {[
                  { type: 'Category',      ex: '"What are the best tools for X?"',               desc: 'High-value. Buyer is actively evaluating options.' },
                  { type: 'Comparison',    ex: '"Brand A vs Brand B?"',                           desc: 'High-value. Buyer is comparing specific options.' },
                  { type: 'Selection',     ex: '"What should a 50-person company use for X?"',    desc: 'High-value. Buyer is seeking a specific recommendation.' },
                  { type: 'Problem',       ex: '"How do I solve X?"',                             desc: 'Mid-value. Buyer may receive a product recommendation.' },
                  { type: 'Alternative',   ex: '"What are alternatives to X?"',                   desc: 'High-value. Buyer is considering switching.' },
                  { type: 'Purchase intent', ex: '"Which software should I buy for X?"',          desc: 'Highest-value. Buyer is close to a decision.' },
                ].map(item => (
                  <div key={item.type} style={{
                    padding: '20px 22px',
                    /* PERMANENTLY DARK — immune to theme */
                    background: '#0c0c0c',
                    border: '1px solid rgba(240,239,237,0.09)',
                    borderRadius: 'var(--r-xl)',
                    transition: 'border-color 0.2s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(240,239,237,0.18)')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(240,239,237,0.09)')}
                  >
                    <div style={{
                      fontFamily: 'var(--font-mono)', fontSize: 9, fontWeight: 700,
                      letterSpacing: '0.10em', textTransform: 'uppercase',
                      color: 'rgba(240,239,237,0.35)', marginBottom: 10
                    }}>{item.type}</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'rgba(240,239,237,0.82)', marginBottom: 7, fontStyle: 'italic', lineHeight: 1.45 }}>{item.ex}</div>
                    <div style={{ fontSize: 12, color: 'rgba(240,239,237,0.42)', lineHeight: 1.55 }}>{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══════ 05b CROSS-ENGINE VARIATION ══════ */}
      <section className="l-section section-force-dark" aria-label="Cross-engine variation">
        <div className="l-wrap">
          <Reveal>
            <div className="section-label">05b — Cross-Engine Variation</div>
            <h2 className="t-h2" style={{ marginBottom: 18 }}>
              The same query.<br />Four engines.<br />Four different answers.
            </h2>
            <p className="t-body-xl" style={{ maxWidth: 560, marginBottom: 52 }}>
              Different AI systems respond to the same buyer query in fundamentally different ways — mentioning different brands, recommending different options, and citing different sources. Your visibility is not a single number. It varies by engine, by query type, and over time.
            </p>
          </Reveal>
          <Reveal delay={40}>
            <div className="mr-table-outer">
              <div style={{
                border: '1px solid rgba(240,239,237,0.08)', borderRadius: 'var(--r-xl)',
                overflow: 'hidden', background: '#050505', minWidth: 640
              }}>
              {/* Header row */}
              <div style={{
                display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr',
                borderBottom: '1px solid rgba(240,239,237,0.07)',
                background: 'rgba(240,239,237,0.03)'
              }}>
                <div style={{ padding: '14px 24px', fontFamily: 'var(--font-mono)', fontSize: 9.5, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(240,239,237,0.30)' }}>Query</div>
                {[
                  { name: 'ChatGPT',    Icon: BrandIcon.ChatGPT },
                  { name: 'Claude',     Icon: BrandIcon.Claude },
                  { name: 'Gemini',     Icon: BrandIcon.Gemini },
                  { name: 'Perplexity', Icon: BrandIcon.Perplexity },
                ].map(m => {
                  const IconComp = m.Icon;
                  return (
                    <div key={m.name} style={{ padding: '12px 16px', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: 8,
                        fontFamily: 'var(--font-mono)', fontSize: 10.5, fontWeight: 700,
                        letterSpacing: '0.06em', textTransform: 'uppercase',
                        background: 'transparent',
                        border: 'none',
                        padding: 0,
                      }}>
                        <IconComp size={18} />
                        <span style={{ color: 'rgba(240,239,237,0.85)' }}>{m.name}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
              {/* Data rows */}
              {[
                {
                  query: '"Best AI analytics tools for SaaS?"',
                  results: [
                    { mentioned: true,  recommended: true,  pos: 2 },
                    { mentioned: true,  recommended: false, pos: null },
                    { mentioned: false, recommended: false, pos: null },
                    { mentioned: true,  recommended: true,  pos: 1 },
                  ]
                },
                {
                  query: '"Which platform for AI brand monitoring?"',
                  results: [
                    { mentioned: true,  recommended: true,  pos: 1 },
                    { mentioned: true,  recommended: true,  pos: 2 },
                    { mentioned: true,  recommended: false, pos: null },
                    { mentioned: false, recommended: false, pos: null },
                  ]
                },
                {
                  query: '"Alternatives to traditional SEO for AI?"',
                  results: [
                    { mentioned: false, recommended: false, pos: null },
                    { mentioned: true,  recommended: false, pos: null },
                    { mentioned: true,  recommended: true,  pos: 3 },
                    { mentioned: true,  recommended: false, pos: null },
                  ]
                },
              ].map((row, ri) => (
                <div key={ri} style={{
                  display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr',
                  borderBottom: ri < 2 ? '1px solid rgba(240,239,237,0.06)' : 'none',
                }}>
                  <div style={{ padding: '22px 24px', fontFamily: 'var(--font-sans)', fontSize: 14, fontStyle: 'italic', color: 'rgba(240,239,237,0.75)', lineHeight: 1.45, fontWeight: 500 }}>{row.query}</div>
                  {row.results.map((r, ci) => (
                    <div key={ci} style={{
                      padding: '22px 12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
                      borderLeft: '1px solid rgba(240,239,237,0.05)'
                    }}>
                      {/* Mentioned badge */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                        <span style={{
                          fontFamily: 'var(--font-mono)', fontSize: 8.5, fontWeight: 700, letterSpacing: '0.06em',
                          textTransform: 'uppercase' as const, padding: '3px 8px', borderRadius: 4,
                          background: r.mentioned ? 'rgba(240,239,237,0.09)' : 'transparent',
                          border: `1px solid ${r.mentioned ? 'rgba(240,239,237,0.20)' : 'rgba(240,239,237,0.07)'}`,
                          color: r.mentioned ? 'rgba(240,239,237,0.70)' : 'rgba(240,239,237,0.20)',
                        }}>M {r.mentioned ? '✓' : '–'}</span>
                      </div>
                      {/* Recommended badge */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                        <span style={{
                          fontFamily: 'var(--font-mono)', fontSize: 8.5, fontWeight: 800, letterSpacing: '0.06em',
                          textTransform: 'uppercase' as const, padding: '3px 8px', borderRadius: 4,
                          background: r.recommended ? 'rgba(240,239,237,0.16)' : 'transparent',
                          border: `1px solid ${r.recommended ? 'rgba(240,239,237,0.35)' : 'rgba(240,239,237,0.07)'}`,
                          color: r.recommended ? '#f0efed' : 'rgba(240,239,237,0.20)',
                        }}>R {r.recommended ? '✓' : '–'}</span>
                      </div>
                      {/* Position */}
                      {r.pos != null && (
                        <span style={{
                          fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700,
                          color: 'rgba(240,239,237,0.50)', letterSpacing: '-0.01em',
                        }}>#{r.pos}</span>
                      )}
                    </div>
                  ))}
                </div>
              ))}
              {/* Footer */}
              <div style={{
                padding: '10px 24px', borderTop: '1px solid rgba(240,239,237,0.05)',
                background: 'rgba(240,239,237,0.02)', display: 'flex', gap: 24, flexWrap: 'wrap'
              }}>
                {[
                  { label: 'M ✓', desc: 'Mentioned in response' },
                  { label: 'R ✓', desc: 'Recommended to buyer' },
                  { label: '#N', desc: 'Recommendation position' },
                ].map(l => (
                  <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font-mono)', fontSize: 9, color: 'rgba(240,239,237,0.28)' }}>
                    <span style={{ fontWeight: 700 }}>{l.label}</span>
                    <span>{l.desc}</span>
                  </div>
                ))}
                <div style={{ marginLeft: 'auto', fontFamily: 'var(--font-mono)', fontSize: 9, color: 'rgba(240,239,237,0.16)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  SAMPLE DATA · DYVIN AI · ILLUSTRATIVE
                </div>
              </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══════ 06 CITATION INTELLIGENCE ══════ */}
      <section className="l-section l-section--light" aria-label="Citation intelligence">
        <div className="l-wrap">
          <Reveal>
            <div className="section-label" style={{ color: 'var(--ls-fg-3)' }}>06 — Citation Intelligence</div>
            <h2 className="t-h2" style={{ color: 'var(--ls-fg)', marginBottom: 18 }}>
              Visibility tells you what happened.<br />Citations explain why.
            </h2>
            <p className="t-body-xl" style={{ color: 'var(--ls-fg-2)', maxWidth: 580, marginBottom: 52 }}>
              Understanding which sources are cited when AI responds about your category — and which sources support competitors — is how you move from monitoring to diagnosis.
            </p>
          </Reveal>
          <Reveal delay={60}><CitationDemo /></Reveal>
          <Reveal delay={90}>
            <div style={{ marginTop: 24, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
              {[
                { label: 'Brand-supporting sources', Icon: Ico.Shield, copy: 'Which publications, review sites, communities, and owned content cite or discuss your brand positively.' },
                { label: 'Competitor-supporting sources', Icon: Ico.Target, copy: 'Which sources appear to strengthen competitor visibility. Competitors win where their sources outperform yours.' },
                { label: 'High-influence sources', Icon: Ico.Star, copy: 'Which sources appear repeatedly in AI responses about your category, regardless of which brand they reference.' },
                { label: 'Citation gaps', Icon: Ico.Map, copy: 'Important platforms where your brand has no presence, creating potential blind spots in AI knowledge of your category.' },
              ].map((item, idx) => (
                <div key={item.label} style={{
                  padding: '26px 22px',
                  /* PERMANENTLY DARK — immune to light mode */
                  background: '#0c0c0c',
                  border: '1px solid rgba(240,239,237,0.09)',
                  borderRadius: 'var(--r-xl)',
                  transition: 'border-color 0.2s, background 0.2s',
                }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(240,239,237,0.18)')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(240,239,237,0.09)')}
                >
                  <div style={{
                    width: 38, height: 38, borderRadius: 10,
                    background: 'rgba(240,239,237,0.07)',
                    border: '1px solid rgba(240,239,237,0.12)',
                    display: 'flex', alignItems: 'center',
                    justifyContent: 'center',
                    color: 'rgba(240,239,237,0.75)',
                    marginBottom: 16,
                    boxShadow: '0 0 14px rgba(240,239,237,0.04)',
                  }}><item.Icon size={17} /></div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#f0efed', marginBottom: 9, lineHeight: 1.3 }}>{item.label}</div>
                  <div style={{ fontSize: 12.5, lineHeight: 1.65, color: 'rgba(240,239,237,0.45)' }}>{item.copy}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══════ 07 COMPETITOR INTELLIGENCE ══════ */}
      <section className="l-section" aria-label="Competitor intelligence">
        <div className="l-wrap">
          <Reveal>
            <div className="section-label">07 — Competitor Intelligence</div>
            <h2 className="t-h2" style={{ marginBottom: 18 }}>
              It is not enough to know<br />whether you are visible.
            </h2>
            <p className="t-body-xl" style={{ maxWidth: 580, marginBottom: 20 }}>
              The meaningful question is: <strong>Are you more visible than the alternatives buyers are considering?</strong>
            </p>
            <p className="t-body" style={{ maxWidth: 580, marginBottom: 52 }}>
              Competitor intelligence means understanding who appears in the same responses, who wins position, which queries competitors dominate, and where the gap is widening or closing.
            </p>
          </Reveal>
          <Reveal delay={60}><CompetitorMap /></Reveal>
        </div>
      </section>

      {/* ══════ 08 INTELLIGENCE PIPELINE ══════ */}
      <section className="l-section l-section--light" aria-label="Intelligence pipeline">
        <div className="l-wrap">
          <Reveal>
            <div className="section-label" style={{ color: 'var(--ls-fg-3)' }}>08 — The Intelligence Layer</div>
            <h2 className="t-h2" style={{ color: 'var(--ls-fg)', marginBottom: 18 }}>
              From observation<br />to intelligence.
            </h2>
            <p className="t-body-xl" style={{ color: 'var(--ls-fg-2)', maxWidth: 540, marginBottom: 52 }}>
              Dyvin is not designed to be a collection of disconnected metrics. The goal is a structured intelligence pipeline that connects observation to diagnosis to action.
            </p>
          </Reveal>
          <Reveal delay={50}>
            <div className="intel-pipeline">
              {[
                { n: '01', label: 'Inputs',       name: 'Observe',      copy: 'Queries · Brands · Competitors · Models · Markets · Topics',                    Icon: Ico.Compass,  c: 'rgba(240,239,237,0.65)' },
                { n: '02', label: 'Collection',   name: 'Collect',      copy: 'Responses · Mentions · Recommendations · Citations · Sources',                  Icon: Ico.Db,       c: 'rgba(240,239,237,0.55)' },
                { n: '03', label: 'Structuring',  name: 'Structure',    copy: 'Entities · Sentiment · Position · Visibility · Competitive signals',            Icon: Ico.Layers,   c: 'rgba(240,239,237,0.48)' },
                { n: '04', label: 'Intelligence', name: 'Diagnose',     copy: 'Patterns · Gaps · Drivers · Opportunities · Changes over time',                 Icon: Ico.Activity, c: 'rgba(240,239,237,0.65)' },
                { n: '05', label: 'Action',       name: 'Act + Verify', copy: 'Opportunities → Interventions → Measurement → Loop',                            Icon: Ico.Refresh,  c: 'rgba(240,239,237,0.75)' },
              ].map(item => (
                <div key={item.n} className="pipeline-node" style={{
                  background: '#0a0a0a',
                  borderRight: '1px solid rgba(240,239,237,0.07)'
                }}>
                  <div className="pipeline-node-icon" style={{
                    background: 'rgba(240,239,237,0.06)',
                    color: item.c,
                    border: '1px solid rgba(240,239,237,0.10)'
                  }}>
                    <item.Icon size={18} />
                  </div>
                  <div className="pipeline-node-label" style={{ color: 'rgba(240,239,237,0.28)' }}>{item.label}</div>
                  <div className="pipeline-node-name" style={{ color: '#f0efed' }}>{item.name}</div>
                  <div className="pipeline-node-copy" style={{ color: 'rgba(240,239,237,0.48)' }}>{item.copy}</div>
                </div>
              ))}
            </div>
            <div style={{
              marginTop: 0, padding: '13px 28px',
              border: '1px solid rgba(240,239,237,0.07)', borderTop: 'none',
              background: '#0a0a0a', borderRadius: '0 0 var(--r-xl) var(--r-xl)',
              fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'rgba(240,239,237,0.25)',
              textAlign: 'center', letterSpacing: '0.06em', textTransform: 'uppercase'
            }}>
              OBSERVE → STRUCTURE → UNDERSTAND → DIAGNOSE → ACT → VERIFY
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══════ 09 HOW IT WORKS ══════ */}
      <section className="l-section" id="workflow" aria-label="How it works">
        <div className="l-wrap">
          <Reveal>
            <div className="section-label">09 — How It Works</div>
            <h2 className="t-h2" style={{ marginBottom: 18 }}>
              A deliberate methodology.<br />Not a pile of metrics.
            </h2>
            <p className="t-body-xl" style={{ maxWidth: 500, marginBottom: 52 }}>
              Five steps from baseline to verified improvement. Each step produces intelligence the next step can use.
            </p>
          </Reveal>
          <Reveal delay={40}>
            <div className="steps__grid">
              {WORKFLOW.map((s, i) => (
                <div key={s.n} className="step-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
                    <div className="step-card__num">{s.n}</div>
                    <span style={{
                      fontFamily: 'var(--font-mono)', fontSize: 8.5, fontWeight: 700,
                      letterSpacing: '0.10em', textTransform: 'uppercase', padding: '3px 9px',
                      borderRadius: 999,
                      background: s.tag === 'CURRENT' ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.03)',
                      color: s.tag === 'CURRENT' ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.3)',
                      border: `1px solid ${s.tag === 'CURRENT' ? 'rgba(255,255,255,0.14)' : 'rgba(255,255,255,0.1)'}`
                    }}>{s.tag}</span>
                  </div>
                  <div className="step-card__icon"><s.Icon size={18} /></div>
                  <div className="step-card__title">{s.title}</div>
                  <div className="step-card__copy">{s.copy}</div>
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal delay={80}>
            <div style={{
              marginTop: 0, padding: '14px 28px',
              border: '1px solid rgba(255,255,255,0.1)', borderTop: 'none',
              borderRadius: '0 0 var(--r-xl) var(--r-xl)',
              background: 'rgba(255,255,255,0.03)',
              fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'rgba(255,255,255,0.3)',
              letterSpacing: '0.06em', textTransform: 'uppercase', textAlign: 'center'
            }}>
              AUDIT → BENCHMARK → DIAGNOSE → ACT → VERIFY
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══════ 10 CLOSED LOOP ══════ */}
      <section className="l-section l-section--light" aria-label="Closed-loop system">
        <div className="l-wrap">
          <Reveal>
            <div className="section-label">10 — Closed-Loop System</div>
            <h2 className="t-h2" style={{ marginBottom: 18 }}>
              Optimization without<br />verification is only advice.
            </h2>
            <p className="t-body-xl" style={{ maxWidth: 520, marginBottom: 52 }}>
              A monitoring tool that only reports is incomplete. The goal is a system that connects visibility signals to diagnosis, action, and verified outcomes.
            </p>
          </Reveal>
          <Reveal delay={50}>
            <div className="closed-loop-grid">
              {[
                { n: '01', Icon: Ico.Eye,      title: 'Measure',  tag: 'CURRENT',  copy: 'What is AI currently saying about your brand, competitors, and category across relevant queries and models?' },
                { n: '02', Icon: Ico.Activity, title: 'Diagnose', tag: 'CURRENT',  copy: 'Why is AI saying that? What citations, sources, and narratives are shaping the response? Where are the gaps?' },
                { n: '03', Icon: Ico.Bulb,     title: 'Act',      tag: 'ROADMAP',  copy: 'What content, citation, and structural changes give the best opportunity to improve AI visibility?' },
                { n: '04', Icon: Ico.Refresh,  title: 'Verify',   tag: 'ROADMAP',  copy: 'Did the change improve AI visibility across models and time? Verification is what turns action into learning.' },
              ].map((s, i) => (
                <div key={s.n} className="loop-step" style={{ position: 'relative' }}>
                  {/* Status badge — TOP of card */}
                  <div style={{
                    position: 'absolute', top: 20, right: 20,
                    display: 'inline-flex', alignItems: 'center', gap: 5,
                    fontFamily: 'var(--font-mono)', fontSize: 8, fontWeight: 700,
                    letterSpacing: '0.10em', textTransform: 'uppercase' as const,
                    padding: '3px 8px', borderRadius: 4,
                    background: s.tag === 'CURRENT'
                      ? 'rgba(240,239,237,0.12)'
                      : 'rgba(240,239,237,0.04)',
                    color: s.tag === 'CURRENT'
                      ? 'rgba(240,239,237,0.80)'
                      : 'rgba(240,239,237,0.28)',
                    border: `1px solid ${s.tag === 'CURRENT' ? 'rgba(240,239,237,0.22)' : 'rgba(240,239,237,0.08)'}`,
                  }}>
                    {s.tag === 'CURRENT' && (
                      <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'rgba(240,239,237,0.75)', display: 'inline-block', flexShrink: 0 }} />
                    )}
                    {s.tag}
                  </div>
                  <div className="loop-step-num">{s.n}</div>
                  <div className="loop-step-icon">
                    <s.Icon size={18} />
                  </div>
                  <div className="loop-step-title">{s.title}</div>
                  <div className="loop-step-copy">{s.copy}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══════ 11 WHY DYVIN ══════ */}
      <section className="l-section" aria-label="Why Dyvin">
        <div className="l-wrap">
          <Reveal>
            <div className="section-label">11 — Why Dyvin</div>
            <h2 className="t-h2" style={{ marginBottom: 18 }}>
              A sharper problem,<br />not a longer feature list.
            </h2>
            <p className="t-body-xl" style={{ maxWidth: 580, marginBottom: 52 }}>
              Peec and Profound have validated that AI visibility is a real market problem. Dyvin's thesis is that basic tracking is not the finish line — connecting signals to verifiable action is the harder, more valuable problem.
            </p>
          </Reveal>
          <Reveal delay={50}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              {/* Basic tracking */}
              <div style={{
                padding: '32px 36px',
                background: '#070707',
                border: '1px solid rgba(255,255,255,0.09)',
                borderRadius: 'var(--r-xl)'
              }}>
                <div style={{
                  fontFamily: 'var(--font-mono)', fontSize: 9.5, fontWeight: 700,
                  letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(240,239,237,0.45)', marginBottom: 20
                }}>Standard visibility tracking</div>
                {[
                  '"You appeared 12 times."',
                  '"You ranked #3 on average."',
                  '"Your visibility score is 61."',
                  '"Competitor A appeared more often."',
                ].map(s => (
                  <div key={s} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 12 }}>
                    <div style={{
                      width: 18, height: 18, borderRadius: '50%',
                      background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2,
                      color: 'rgba(240,239,237,0.40)'
                    }}>
                      <svg width="8" height="2" viewBox="0 0 8 2" fill="none" aria-hidden>
                        <line x1="0" y1="1" x2="8" y2="1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                    </div>
                    <span style={{ fontSize: 14, color: 'rgba(240,239,237,0.65)', fontStyle: 'italic' }}>{s}</span>
                  </div>
                ))}
                <p style={{
                  fontSize: 13, lineHeight: 1.65, color: 'rgba(240,239,237,0.45)', marginTop: 20,
                  padding: '12px 16px', background: 'rgba(255,255,255,0.03)',
                  borderRadius: 10, border: '1px solid rgba(255,255,255,0.07)'
                }}>
                  Useful for awareness. Does not fully explain what is driving the outcome or what to do about it.
                </p>
              </div>

              {/* Dyvin intelligence */}
              <div style={{
                padding: '32px 36px',
                background: '#070707',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: 'var(--r-xl)'
              }}>
                <div style={{
                  fontFamily: 'var(--font-mono)', fontSize: 9.5, fontWeight: 700,
                  letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(240,239,237,0.55)', marginBottom: 20
                }}>Dyvin intelligence — in progress</div>
                {[
                  '"You appeared 12 times — but were only recommended in 4."',
                  '"Competitor A\'s citations may explain 2 positions above you on comparison queries."',
                  '"You have no coverage on review platforms in 6 of your competitor\'s top citations."',
                  '"Visibility improved 8 points after the intervention — across 3 models."',
                ].map(s => (
                  <div key={s} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 12 }}>
                    <div style={{
                      width: 18, height: 18, borderRadius: '50%',
                      background: 'rgba(240,239,237,0.10)', border: '1px solid rgba(240,239,237,0.22)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2,
                      color: 'rgba(240,239,237,0.90)'
                    }}><Ico.Check size={9} /></div>
                    <span style={{ fontSize: 14, color: 'rgba(240,239,237,0.92)', lineHeight: 1.5 }}>{s}</span>
                  </div>
                ))}
                <p style={{
                  fontSize: 13, lineHeight: 1.65, color: 'rgba(240,239,237,0.55)', marginTop: 20,
                  padding: '12px 16px', background: 'rgba(255,255,255,0.03)',
                  borderRadius: 10, border: '1px solid rgba(255,255,255,0.07)'
                }}>
                  This is the intelligence standard Dyvin is building toward. Some is live. Some is roadmap. All is verifiable.
                </p>
              </div>
            </div>
          </Reveal>

          {/* Phase roadmap */}
          <Reveal delay={80}>
            <div style={{
              marginTop: 24, border: '1px solid rgba(255,255,255,0.09)',
              borderRadius: 'var(--r-xl)', overflow: 'hidden', background: '#050505'
            }}>
              <div style={{
                padding: '18px 32px', borderBottom: '1px solid rgba(255,255,255,0.07)',
                background: '#0a0a0a',
                fontFamily: 'var(--font-mono)', fontSize: 9.5, fontWeight: 700,
                letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(240,239,237,0.45)'
              }}>Development phases</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)' }}>
                {[
                  { phase: 'Phase 1', label: 'Visibility intelligence', desc: 'Measure presence, position, recommendation, and competitor visibility across AI engines.', status: 'In progress', c: 'rgba(240,239,237,0.85)' },
                  { phase: 'Phase 2', label: 'Explanation layer', desc: 'Connect visibility outcomes to citations, sources, entities, topics, and narratives.', status: 'Roadmap', c: 'rgba(240,239,237,0.50)' },
                  { phase: 'Phase 3', label: 'Opportunity intelligence', desc: 'Prioritize the highest-value gaps. Surface specific, actionable content and citation opportunities.', status: 'Roadmap', c: 'rgba(240,239,237,0.30)' },
                ].map((p, i) => (
                  <div key={p.phase} style={{
                    padding: '24px 28px',
                    borderRight: i < 2 ? '1px solid rgba(255,255,255,0.07)' : 'none',
                    background: '#070707'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                      <span style={{
                        fontFamily: 'var(--font-mono)', fontSize: 9, fontWeight: 700,
                        letterSpacing: '0.10em', textTransform: 'uppercase', color: p.c
                      }}>{p.phase}</span>
                      <span style={{
                        fontFamily: 'var(--font-mono)', fontSize: 8.5, padding: '2px 8px',
                        borderRadius: 999, background: 'rgba(240,239,237,0.06)', color: p.c,
                        border: '1px solid rgba(240,239,237,0.12)', letterSpacing: '0.06em', textTransform: 'uppercase'
                      }}>{p.status}</span>
                    </div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: '#f0efed', marginBottom: 8 }}>{p.label}</div>
                    <div style={{ fontSize: 13, lineHeight: 1.65, color: 'rgba(240,239,237,0.55)' }}>{p.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══════ 12 WHO IT'S FOR ══════ */}
      <section className="l-section l-section--light" aria-label="Who it is for">
        <div className="l-wrap">
          <Reveal>
            <div className="section-label">12 — Who It's For</div>
            <h2 className="t-h2" style={{ marginBottom: 52 }}>
              For teams navigating<br />the AI discovery layer.
            </h2>
          </Reveal>
          <div className="role-grid">
            {ROLES.map((card, i) => {
              const tilt = use3DTilt();
              return (
                <Reveal key={card.n} delay={i * 60}>
                  <div className="role-card" ref={tilt.ref} onMouseMove={tilt.onMouseMove} onMouseLeave={tilt.onMouseLeave}>
                    <div className="role-num">{card.n}</div>
                    <div className="role-icon"><card.Icon size={18} /></div>
                    <div className="role-title">{card.title}</div>
                    <div className="role-copy">{card.copy}</div>
                    <button onClick={onSignup} id={`role-cta-${i}`}
                      aria-label={`Get your AI visibility baseline — ${card.title}`}
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 16,
                        fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700,
                        color: 'rgba(240,239,237,0.60)', background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                        transition: 'color 0.15s'
                      }}
                    onMouseEnter={e => (e.currentTarget.style.color = 'rgba(240,239,237,0.88)')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'rgba(240,239,237,0.60)')}
                    >
                      Get your baseline <Ico.ArrowUR size={11} />
                    </button>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════ 13 PRICING ══════ */}
      <section className="l-section" id="pricing" aria-label="Pricing">
        <div className="l-wrap">
          <Reveal>
            <div className="section-label">13 — Pricing</div>
            <h2 className="t-h2" style={{ marginBottom: 12 }}>Simple, transparent<br />early access pricing.</h2>
            <p style={{ fontSize: 15, color: 'var(--fg-3)', marginBottom: 16 }}>Founding member rates. Subject to change before general availability.</p>
            <div style={{
              display: 'inline-flex', alignItems: 'center',
              background: 'var(--border)', border: '1px solid var(--border-2)',
              borderRadius: 999, padding: 4, marginBottom: 52
            }}>
              {(['monthly', 'yearly'] as const).map(b => (
                <button key={b} id={`billing-${b}`} onClick={() => setBilling(b)} style={{
                  padding: '8px 22px', borderRadius: 999,
                  background: billing === b ? 'var(--bg-elevated)' : 'transparent',
                  border: 'none', fontSize: 13, fontWeight: 600, cursor: 'pointer',
                  color: billing === b ? 'var(--fg)' : 'var(--fg-3)',
                  boxShadow: billing === b ? 'var(--shadow-sm)' : 'none',
                  transition: 'all 0.2s', display: 'inline-flex', alignItems: 'center', gap: 8
                }}>
                  {b === 'yearly' ? 'Yearly' : 'Monthly'}
                  {b === 'yearly' && (
                    <span style={{
                      background: 'var(--border-2)', color: 'var(--fg-2)', fontSize: 9.5,
                      fontWeight: 700, padding: '2px 7px', borderRadius: 999,
                      border: '1px solid var(--border-3)'
                    }}>−20%</span>
                  )}
                </button>
              ))}
            </div>
          </Reveal>

          <Reveal delay={40}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, alignItems: 'start' }}>
              {[
                {
                  name: 'Starter', tag: '', featured: false,
                  desc: 'For founders establishing their AI visibility baseline before competitors do.',
                  monthly: 79, yearly: 63,
                  feats: ['1 brand tracked', '4 AI engines (initial)', 'Baseline audit', 'Weekly summary digest', 'Email support']
                },
                {
                  name: 'Pro', tag: 'Most popular', featured: true,
                  desc: 'For marketing and SEO teams measuring AI visibility and competitive intelligence.',
                  monthly: 249, yearly: 199,
                  feats: ['5 brands tracked', '8 AI engines', 'Full DVS scoring', 'Citation intelligence', 'Competitor tracking', 'Recommendation analysis', 'Priority support']
                },
                {
                  name: 'Agency', tag: '', featured: false,
                  desc: 'For agencies building AI visibility intelligence across multiple brand clients.',
                  monthly: null, yearly: null,
                  feats: ['Unlimited brands', 'All AI engines', 'Client workspaces', 'API access (roadmap)', 'Dedicated onboarding', 'Custom SLA']
                },
              ].map(plan => (
                <div key={plan.name} id={`pricing-${plan.name.toLowerCase()}`} style={{
                  background: plan.featured ? '#0d0d0d' : 'var(--bg-card)',
                  border: plan.featured ? '1px solid rgba(240,239,237,0.22)' : '1px solid var(--border-2)',
                  borderRadius: 'var(--r-xl)', padding: '36px 32px', position: 'relative',
                  boxShadow: plan.featured
                    ? '0 0 60px rgba(240,239,237,0.04), 0 24px 60px rgba(0,0,0,0.7)'
                    : 'var(--shadow-md)',
                  transform: plan.featured ? 'scale(1.03)' : 'none'
                }}>
                  {plan.tag && (
                    <div style={{
                      position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)',
                      /* Pro card is always dark so we can hardcode white-opacity for the badge */
                      background: 'rgba(240,239,237,0.12)', color: 'rgba(240,239,237,0.85)',
                      fontSize: 9.5, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
                      padding: '4px 14px', borderRadius: 999, whiteSpace: 'nowrap',
                      border: '1px solid rgba(240,239,237,0.22)'
                    }}>{plan.tag}</div>
                  )}
                  <div style={{
                    fontFamily: 'var(--font-mono)', fontSize: 10.5, fontWeight: 700,
                    letterSpacing: '0.12em', textTransform: 'uppercase',
                    /* Featured always dark, non-featured uses semantic fg-3 which adapts */
                    color: plan.featured ? 'rgba(240,239,237,0.50)' : 'var(--fg-3)', marginBottom: 12
                  }}>{plan.name}</div>
                  <div style={{ marginBottom: 14 }}>
                    {plan.monthly != null ? (
                      <>
                        <span style={{
                          fontFamily: 'var(--font-serif)', fontSize: 52, fontWeight: 900,
                          letterSpacing: '-0.04em', lineHeight: 1,
                          color: plan.featured ? '#f5f5f7' : 'var(--fg)'
                        }}>${billing === 'monthly' ? plan.monthly : plan.yearly}</span>
                        <span style={{ fontSize: 13, color: plan.featured ? 'rgba(255,255,255,0.32)' : 'var(--fg-3)', marginLeft: 5 }}>/mo</span>
                      </>
                    ) : (
                      <span style={{
                        fontFamily: 'var(--font-serif)', fontSize: 42, fontWeight: 900,
                        letterSpacing: '-0.04em', color: plan.featured ? '#f5f5f7' : 'var(--fg)'
                      }}>Custom</span>
                    )}
                  </div>
                  <p style={{ fontSize: 13.5, lineHeight: 1.65, marginBottom: 28, color: plan.featured ? 'rgba(255,255,255,0.42)' : 'var(--fg-3)' }}>{plan.desc}</p>
                  <button className={`btn ${plan.featured ? 'btn-primary' : 'btn-outline'}`}
                    style={{ width: '100%', justifyContent: 'center', marginBottom: 28, borderColor: !plan.featured ? 'var(--border-2)' : undefined }}
                    onClick={onSignup} id={`pricing-cta-${plan.name.toLowerCase()}`}>
                    Request early access <Ico.Arrow size={13} />
                  </button>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                    {plan.feats.map(f => (
                      <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{
                          width: 17, height: 17, borderRadius: '50%', flexShrink: 0,
                          background: plan.featured ? 'rgba(240,239,237,0.12)' : 'var(--border-2)',
                          border: plan.featured ? '1px solid rgba(240,239,237,0.25)' : '1px solid var(--border-3)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: plan.featured ? 'rgba(240,239,237,0.85)' : 'var(--fg-2)'
                        }}><Ico.Check size={9} /></div>
                        <span style={{ fontSize: 13, color: plan.featured ? 'rgba(240,239,237,0.65)' : 'var(--fg-2)' }}>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div style={{
              marginTop: 18, textAlign: 'center', fontFamily: 'var(--font-mono)',
              fontSize: 10, color: 'var(--fg-3)', letterSpacing: '0.04em'
            }}>
              Early access · Founding member rates · No credit card required to request access
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══════ 14 EARLY STAGE ══════ */}
      <section className="l-section l-section--surface section-force-dark" aria-label="Company status">
        <div className="l-wrap">
          <Reveal delay={50}>
            <div ref={earlyRef}><EarlyStage live={earlyInView} /></div>
          </Reveal>
        </div>
      </section>

      {/* ══════ 15 FAQ ══════ */}
      <section className="l-section" aria-label="FAQ">
        <div className="l-wrap--md">
          <Reveal>
            <div className="section-label">15 — Questions</div>
            <h2 className="t-h2" style={{ marginBottom: 52 }}>Frequently asked<br />questions.</h2>
          </Reveal>
          <Reveal delay={40}>
            <div style={{ border: '1px solid var(--border-2)', borderRadius: 'var(--r-xl)', overflow: 'hidden' }}>
              {FAQS.map((item, i) => (
                <div key={i} style={{ borderBottom: i < FAQS.length - 1 ? '1px solid var(--border)' : 'none' }}>
                  <button id={`faq-${i}`}
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    aria-expanded={openFaq === i}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center',
                      justifyContent: 'space-between', gap: 20,
                      padding: '22px 32px', background: 'none', border: 'none',
                      cursor: 'pointer', textAlign: 'left'
                    }}>
                    <span style={{ fontSize: 15.5, fontWeight: 600, color: 'var(--fg)', lineHeight: 1.4 }}>
                      {item.q}
                    </span>
                    <span style={{
                      width: 22, height: 22, borderRadius: '50%', border: '1px solid var(--border-2)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'var(--fg-3)', flexShrink: 0,
                      transform: openFaq === i ? 'rotate(45deg)' : 'none',
                      transition: 'transform 0.25s ease'
                    }}>
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none"
                        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden>
                        <line x1="5" y1="0" x2="5" y2="10" />
                        <line x1="0" y1="5" x2="10" y2="5" />
                      </svg>
                    </span>
                  </button>
                  <div style={{
                    overflow: 'hidden',
                    maxHeight: openFaq === i ? 500 : 0,
                    transition: 'max-height 0.38s cubic-bezier(0.4,0,0.2,1)',
                    padding: openFaq === i ? '0 32px 28px' : '0 32px 0'
                  }}>
                    <p style={{ fontSize: 14.5, lineHeight: 1.8, color: 'var(--fg-2)', margin: 0 }}>
                      {item.a}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══════ CTA ══════ */}
      <section className="dark-cta" id="cta" aria-label="Request early access">
        <div className="l-wrap">
          <Reveal>
            <div style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
              <div style={{
                fontFamily: 'var(--font-mono)', fontSize: 10.5, fontWeight: 700,
                letterSpacing: '0.12em', textTransform: 'uppercase',
                color: 'var(--fg-4)', marginBottom: 24
              }}>Get started</div>
              <h2 className="t-h2" style={{ maxWidth: 520, margin: '0 auto 20px' }}>
                See your AI<br />visibility baseline.
              </h2>
              <p className="t-body-xl" style={{ maxWidth: 420, margin: '0 auto 40px', color: 'rgba(255,255,255,0.44)' }}>
                Understand how AI discovers, describes, cites, and recommends your brand. No sales call required. Early access only.
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 28 }}>
                <button className="btn btn-primary btn-lg" onClick={onSignup} id="cta-primary-btn">
                  Get your AI visibility baseline <Ico.Arrow size={15} />
                </button>
                <button className="btn btn-ghost btn-lg" onClick={onLogin} id="cta-secondary-btn"
                  style={{
                    background: 'rgba(240,239,237,0.07)',
                    color: '#f0efed',
                    borderColor: 'rgba(240,239,237,0.18)',
                  }}>
                  <Ico.Msg size={14} /> Talk to the founder
                </button>
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 24, flexWrap: 'wrap' }}>
                {['No credit card required', 'Personal early access onboarding', 'Founded 2026 · Bengaluru, India'].map(t => (
                  <div key={t} style={{
                    display: 'flex', alignItems: 'center', gap: 7,
                    fontFamily: 'var(--font-mono)', fontSize: 10.5,
                    color: 'rgba(255,255,255,0.26)', letterSpacing: '0.02em'
                  }}>
                    <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'inline-block' }} />
                    {t}
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══════ FOOTER ══════ */}
      <footer className="l-footer" aria-label="Footer">
        <div className="l-wrap">
          <div className="l-footer__main">
            <div>
              {/* Brand — footer always dark, so force white */}
              <div className="l-nav__brand" style={{ marginBottom: 14, display: 'inline-flex', alignItems: 'center', gap: 10, color: '#f0efed' }}>
                <DyvinLogo size={24} fill="#f0efed" />
                <span style={{ fontSize: 16, fontWeight: 700, color: '#f0efed' }}>Dyvin AI</span>
              </div>
              <p className="l-footer__brand-copy">
                Measure how AI discovers, describes, cites, compares, and recommends your brand. Build the intelligence layer between AI visibility signals and business action.
              </p>
              {/* Location — hardcoded visible white */}
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'rgba(240,239,237,0.38)', marginTop: 10 }}>
                Bengaluru, India · Founded 2026 · Pre-seed
              </p>
              <div className="l-footer__status">
                <div className="l-footer__status-dot" aria-hidden />
                <span style={{ color: 'rgba(240,239,237,0.38)' }}>Product under active development</span>
              </div>
            </div>

            {[
              {
                title: 'Intelligence',
                items: [
                  { label: 'AI Visibility Monitor', legal: false },
                  { label: 'Recommendation Intelligence', legal: false },
                  { label: 'Citation Intelligence', legal: false },
                  { label: 'Competitor Intelligence', legal: false },
                  { label: 'DVS Score', legal: false },
                ],
              },
              {
                title: 'Company',
                items: [
                  { label: 'About', legal: false },
                  { label: 'Contact', legal: false },
                  { label: 'Blog', legal: false },
                  { label: 'Careers', legal: false },
                ],
              },
              {
                title: 'Legal',
                items: [
                  { label: 'Privacy Policy', legal: true },
                  { label: 'Terms of Service', legal: true },
                  { label: 'Security', legal: true },
                ],
              },
            ].map(col => (
              <div key={col.title}>
                {/* Column title — hardcoded white mono */}
                <div style={{
                  fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700,
                  letterSpacing: '0.12em', textTransform: 'uppercase' as const,
                  color: 'rgba(240,239,237,0.32)', marginBottom: 16
                }}>{col.title}</div>
                <ul className="l-footer__col">
                  {col.items.map(item => (
                    <li key={item.label}>
                      {item.legal ? (
                        <a href="#" onClick={(e) => e.preventDefault()} style={{
                          background: 'none', border: 'none',
                          color: 'rgba(240,239,237,0.45)',
                          fontSize: 13, cursor: 'default', padding: 0, textAlign: 'left',
                          fontFamily: 'var(--font-sans)', textDecoration: 'none', display: 'block',
                        }}>
                          {item.label}
                        </a>
                      ) : (
                        <button onClick={onSignup} style={{
                          background: 'none', border: 'none',
                          color: 'rgba(240,239,237,0.55)',
                          fontSize: 13, cursor: 'pointer', padding: 0, textAlign: 'left',
                          transition: 'color 0.15s', fontFamily: 'var(--font-sans)'
                        }}
                          onMouseEnter={e => (e.currentTarget.style.color = 'rgba(240,239,237,0.88)')}
                          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(240,239,237,0.55)')}>
                          {item.label}
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="l-footer__bottom">
            <span>© {new Date().getFullYear()} Dyvin AI · All rights reserved · Bengaluru, India</span>
            <span>AI Visibility Operating System</span>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default LandingPage;
