import React from 'react';
import { Outlet } from 'react-router-dom';

export function AdminLayout() {
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Admin sidebar or reuse main sidebar — future implementation */}
      <main className="flex-1 overflow-y-auto p-6">
        <Outlet />
      </main>
    </div>
  );
}

export function PublicLayout() {
  return (
    <div className="min-h-screen bg-background">
      <Outlet />
    </div>
  );
}

export function BlankLayout() {
  return <Outlet />;
}
