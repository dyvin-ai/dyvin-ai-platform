import React from 'react';
import { AppProviders } from './providers';
import { AppRouter } from './routes/AppRouter';

export function App() {
  return (
    <AppProviders>
      <AppRouter />
    </AppProviders>
  );
}
