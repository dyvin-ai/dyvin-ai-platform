import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Search, Users, Zap, ShoppingBag, Shield, Settings,
  BarChart3, Workflow, Building2, Globe, Bot, ChevronLeft, ChevronRight,
  Code2, Palette, FileText, Bell, CreditCard,
} from 'lucide-react';
import { cn } from '@lib/utils';
import { useUiStore } from '@stores/uiStore';

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const navSections: NavSection[] = [
  {
    title: 'Platform',
    items: [
      { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
      { label: 'AI Search', href: '/ai-search', icon: Search },
      { label: 'AI Workforce', href: '/ai-workforce', icon: Bot },
      { label: 'Business Exec', href: '/business-execution', icon: Zap },
    ],
  },
  {
    title: 'Intelligence',
    items: [
      { label: 'Customer Intel', href: '/customer-intelligence', icon: Users },
      { label: 'Global Intel', href: '/ai-search', icon: Globe },
      { label: 'Reports', href: '/reports', icon: BarChart3 },
    ],
  },
  {
    title: 'Build',
    items: [
      { label: 'Workflow Studio', href: '/workflow-studio', icon: Workflow },
      { label: 'App Builder', href: '/app-builder', icon: Palette },
      { label: 'Marketplace', href: '/marketplace', icon: ShoppingBag },
      { label: 'Developer', href: '/developer', icon: Code2 },
    ],
  },
  {
    title: 'Management',
    items: [
      { label: 'Governance', href: '/governance', icon: Building2 },
      { label: 'Security', href: '/security', icon: Shield },
      { label: 'Billing', href: '/billing', icon: CreditCard },
      { label: 'Settings', href: '/settings', icon: Settings },
    ],
  },
];

export function Sidebar() {
  const { sidebarCollapsed, toggleSidebar } = useUiStore();
  const location = useLocation();

  return (
    <motion.aside
      animate={{ width: sidebarCollapsed ? 64 : 256 }}
      transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
      className="fixed left-0 top-0 bottom-0 z-sticky bg-sidebar border-r border-sidebar-border flex flex-col overflow-hidden"
    >
      {/* Logo */}
      <div className="h-14 flex items-center px-4 border-b border-sidebar-border flex-shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-7 h-7 rounded-lg bg-brand-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-md">
            D
          </div>
          <AnimatePresence>
            {!sidebarCollapsed && (
              <motion.span
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.15 }}
                className="text-sidebar-foreground font-bold text-base tracking-tight truncate"
              >
                Dyvin AI
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Nav sections */}
      <nav className="flex-1 overflow-y-auto py-3 space-y-1 px-2">
        {navSections.map((section) => (
          <div key={section.title} className="mb-4">
            {!sidebarCollapsed && (
              <p className="px-2 mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-sidebar-foreground/30">
                {section.title}
              </p>
            )}
            {section.items.map((item) => {
              const isActive = location.pathname.startsWith(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  title={sidebarCollapsed ? item.label : undefined}
                  className={cn(
                    'flex items-center gap-3 px-2.5 py-2 rounded-lg text-sm font-medium transition-all duration-150 group relative',
                    isActive
                      ? 'bg-sidebar-accent/15 text-sidebar-accent'
                      : 'text-sidebar-foreground/60 hover:bg-white/5 hover:text-sidebar-foreground'
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-active"
                      className="absolute left-0 top-1 bottom-1 w-0.5 bg-sidebar-accent rounded-full"
                    />
                  )}
                  <Icon className={cn('flex-shrink-0 w-4 h-4', isActive ? 'text-sidebar-accent' : '')} />
                  <AnimatePresence>
                    {!sidebarCollapsed && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.1 }}
                        className="truncate"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Collapse toggle */}
      <div className="px-2 pb-4 border-t border-sidebar-border pt-3">
        <button
          onClick={toggleSidebar}
          className="w-full flex items-center gap-3 px-2.5 py-2 rounded-lg text-sidebar-foreground/40 hover:text-sidebar-foreground hover:bg-white/5 transition-colors text-sm"
        >
          {sidebarCollapsed ? (
            <ChevronRight className="w-4 h-4 flex-shrink-0" />
          ) : (
            <>
              <ChevronLeft className="w-4 h-4 flex-shrink-0" />
              <span className="text-xs">Collapse</span>
            </>
          )}
        </button>
      </div>
    </motion.aside>
  );
}
