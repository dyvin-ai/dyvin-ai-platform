import React from 'react';
import { Toaster } from 'react-hot-toast';
import { useThemeStore } from '@stores/themeStore';

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const { resolvedTheme } = useThemeStore();

  return (
    <>
      {children}
      <Toaster
        position="top-right"
        gutter={8}
        containerStyle={{ top: 64 }}
        toastOptions={{
          duration: 4000,
          style: {
            background: resolvedTheme === 'dark' ? 'hsl(222 47% 11%)' : 'hsl(0 0% 100%)',
            color: resolvedTheme === 'dark' ? 'hsl(220 14% 94%)' : 'hsl(222 47% 11%)',
            border: `1px solid ${resolvedTheme === 'dark' ? 'hsl(222 47% 16%)' : 'hsl(220 13% 91%)'}`,
            borderRadius: '8px',
            fontSize: '0.875rem',
            fontFamily: 'Inter, system-ui, sans-serif',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.07), 0 2px 4px -2px rgb(0 0 0 / 0.04)',
            padding: '12px 16px',
          },
          success: {
            iconTheme: { primary: 'hsl(142 71% 45%)', secondary: 'white' },
          },
          error: {
            iconTheme: { primary: 'hsl(0 72% 51%)', secondary: 'white' },
          },
        }}
      />
    </>
  );
}
