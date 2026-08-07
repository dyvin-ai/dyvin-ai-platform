import React from 'react';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TopNav } from '@components/navigation/TopNav';
import { Sidebar } from '@components/navigation/Sidebar';
import { useUiStore } from '@stores/uiStore';
import { cn } from '@lib/utils';

export function DashboardLayout() {
  const { sidebarCollapsed } = useUiStore();

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar />
      <div
        className={cn(
          'flex flex-col flex-1 min-w-0 overflow-hidden transition-all duration-250',
          sidebarCollapsed ? 'ml-16' : 'ml-64'
        )}
      >
        <TopNav />
        <main className="flex-1 overflow-y-auto">
          <motion.div
            key="dashboard-content"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className="p-6 min-h-full"
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
}
