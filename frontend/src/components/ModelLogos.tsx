import React from 'react';
import { useTheme } from '../context/ThemeContext';

export interface LogoProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
  size?: number;
}

/** Official OpenAI / ChatGPT SVG Mark: White in dark mode, Dark/Black in light mode */
export const OpenAiLogo: React.FC<LogoProps> = ({ className = "size-4", size = 16, ...props }) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      width={size}
      height={size}
      className={`${className} ${isLight ? 'text-slate-900' : 'text-white'} transition-colors inline-block shrink-0`}
      aria-label="OpenAI ChatGPT"
      {...props}
    >
      <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1683a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4947zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1683a.0757.0757 0 0 1-.071 0l-4.8303-2.7866A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1635a.0804.0804 0 0 1-.038-.0567V6.0748a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.4598a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z" />
    </svg>
  );
};

/** Official Anthropic / Claude SVG Mark in signature warm terracotta */
export const AnthropicLogo: React.FC<LogoProps> = ({ className = "size-4", size = 16, ...props }) => (
  <svg
    viewBox="0 0 24 24"
    fill="#D97757"
    width={size}
    height={size}
    className={`${className} inline-block shrink-0`}
    aria-label="Anthropic Claude"
    {...props}
  >
    <path d="m4.408 17.653 4.258-2.457v-4.92L4.408 7.82 2 9.208v5.576l2.408 2.869ZM12 3.25 7.742 5.708l4.258 2.458 4.258-2.458L12 3.25Zm7.592 4.57-4.258 2.457v4.92l4.258 2.457L22 14.784V9.208l-2.408-1.388Zm-3.333 7.373L12 12.735l-4.259 2.458v4.916L12 22.568l4.259-2.459v-4.916Z" />
  </svg>
);

/** Official Claude Sparkle Mark */
export const ClaudeSparkLogo: React.FC<LogoProps> = ({ className = "size-4", size = 16, ...props }) => (
  <svg
    viewBox="0 0 24 24"
    fill="#D97757"
    width={size}
    height={size}
    className={`${className} inline-block shrink-0`}
    aria-label="Claude"
    {...props}
  >
    <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" />
  </svg>
);

/** Official Google Gemini SVG Mark with signature 4-point gradient */
export const GoogleGeminiLogo: React.FC<LogoProps> = ({ className = "size-4", size = 16, ...props }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    className={`${className} inline-block shrink-0`}
    aria-label="Google Gemini"
    {...props}
  >
    <defs>
      <linearGradient id="geminiGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#4E82EE" />
        <stop offset="50%" stopColor="#9B72CF" />
        <stop offset="100%" stopColor="#D96570" />
      </linearGradient>
    </defs>
    <path
      fill="url(#geminiGrad)"
      d="M12 0C12 6.627 6.627 12 0 12c6.627 0 12 5.627 12 12 0-6.627 5.627-12 12-12-6.627 0-12-5.373-12-12Z"
    />
  </svg>
);

/** Official Perplexity AI SVG Mark in signature teal */
export const PerplexityLogo: React.FC<LogoProps> = ({ className = "size-4", size = 16, ...props }) => (
  <svg
    viewBox="0 0 24 24"
    fill="#22B8CD"
    width={size}
    height={size}
    className={`${className} inline-block shrink-0`}
    aria-label="Perplexity AI"
    {...props}
  >
    <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm1 14.93V18h-2v-1.07A6.002 6.002 0 0 1 6.07 13H5v-2h1.07A6.002 6.002 0 0 1 11 6.07V5h2v1.07A6.002 6.002 0 0 1 17.93 11H19v2h-1.07A6.002 6.002 0 0 1 13 16.93zM12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" />
  </svg>
);

/** Official Microsoft Copilot SVG Mark with signature gradient */
export const CopilotLogo: React.FC<LogoProps> = ({ className = "size-4", size = 16, ...props }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    className={`${className} inline-block shrink-0`}
    aria-label="Microsoft Copilot"
    {...props}
  >
    <defs>
      <linearGradient id="copilotGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#0078D4" />
        <stop offset="100%" stopColor="#68217A" />
      </linearGradient>
    </defs>
    <path
      fill="url(#copilotGrad)"
      d="M11.5 2C6.806 2 3 5.806 3 10.5c0 2.222.854 4.248 2.26 5.768L4 20.5l4.5-1.247A8.44 8.44 0 0 0 11.5 20c4.694 0 8.5-3.806 8.5-8.5S16.194 2 11.5 2zm0 15c-1.387 0-2.67-.42-3.743-1.143l-.337-.226-2.67.74.755-2.614-.234-.347A6.45 6.45 0 0 1 5 10.5C5 6.916 7.916 4 11.5 4S18 6.916 18 10.5 15.084 17 11.5 17z"
    />
  </svg>
);

/** Official xAI / Grok SVG Mark: White in dark mode, Dark in light mode */
export const GrokLogo: React.FC<LogoProps> = ({ className = "size-4", size = 16, ...props }) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      width={size}
      height={size}
      className={`${className} ${isLight ? 'text-slate-900' : 'text-white'} transition-colors inline-block shrink-0`}
      aria-label="xAI Grok"
      {...props}
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
};

/** Authentic Social Platform SVG Marks for Footer */
export const XSocialLogo: React.FC<LogoProps> = ({ className = "size-3.5", size = 14, ...props }) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      width={size}
      height={size}
      className={`${className} ${isLight ? 'text-slate-700 hover:text-slate-950' : 'text-white/70 hover:text-white'} transition-colors`}
      aria-label="X (Twitter)"
      {...props}
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
};

export const LinkedInLogo: React.FC<LogoProps> = ({ className = "size-3.5", size = 14, ...props }) => (
  <svg
    viewBox="0 0 24 24"
    fill="#0A66C2"
    width={size}
    height={size}
    className={className}
    aria-label="LinkedIn"
    {...props}
  >
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.25c-.9 0-1.63.73-1.63 1.63 0 .9.73 1.63 1.63 1.63.9 0 1.63-.73 1.63-1.63 0-.9-.73-1.63-1.63-1.63z" />
  </svg>
);

export const YouTubeLogo: React.FC<LogoProps> = ({ className = "size-3.5", size = 14, ...props }) => (
  <svg
    viewBox="0 0 24 24"
    fill="#FF0000"
    width={size}
    height={size}
    className={className}
    aria-label="YouTube"
    {...props}
  >
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);
