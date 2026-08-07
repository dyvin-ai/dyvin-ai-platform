import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, LayoutDashboard, UserPlus, Zap } from 'lucide-react';
import { Button } from '@components/ui/Button';
import { useAuthStore } from '@stores/authStore';
import { useOrgStore } from '@stores/orgStore';

const confettiVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const confettiItem = {
  hidden: { opacity: 0, y: -20, rotate: -30 },
  show: { opacity: 1, y: 0, rotate: 0, transition: { type: 'spring' as const, stiffness: 300 } },
};

const CONFETTI_COLORS = [
  'bg-brand-500', 'bg-success', 'bg-warning', 'bg-info', 'bg-danger',
  'bg-primary', 'bg-brand-300',
];

export default function OnboardingSuccessPage() {
  const { user } = useAuthStore();
  const { activeOrg } = useOrgStore();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6 py-12 relative overflow-hidden">
      {/* Animated confetti */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        variants={confettiVariants}
        initial="hidden"
        animate="show"
      >
        {Array.from({ length: 24 }).map((_, i) => (
          <motion.div
            key={i}
            variants={confettiItem}
            className={`absolute w-2 h-2 rounded-sm ${CONFETTI_COLORS[i % CONFETTI_COLORS.length]} opacity-70`}
            style={{
              left: `${(i * 4.2) % 100}%`,
              top: `${(i * 7) % 40}%`,
            }}
          />
        ))}
      </motion.div>

      <div className="w-full max-w-lg text-center space-y-8 relative z-10">
        {/* Success icon */}
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          className="w-20 h-20 rounded-3xl bg-gradient-to-br from-brand-500 to-primary flex items-center justify-center mx-auto shadow-xl"
        >
          <Sparkles className="w-10 h-10 text-white" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h1 className="text-heading-2xl text-foreground mb-3">
            You're all set, {user?.firstName}! 🎉
          </h1>
          <p className="text-body-lg text-muted-foreground">
            {activeOrg?.name
              ? `${activeOrg.name} is ready on the Dyvin AI Platform.`
              : 'Your account is ready on the Dyvin AI Platform.'}
            {' '}Start exploring the most advanced enterprise AI system available.
          </p>
        </motion.div>

        {/* Quick action cards */}
        <motion.div
          className="grid grid-cols-3 gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          {[
            {
              icon: LayoutDashboard,
              title: 'Dashboard',
              description: 'View your overview',
              href: '/dashboard',
              color: 'text-primary bg-primary/10',
            },
            {
              icon: Zap,
              title: 'AI Search',
              description: 'Explore intelligence',
              href: '/ai-search',
              color: 'text-warning bg-warning/10',
            },
            {
              icon: UserPlus,
              title: 'Invite',
              description: 'Grow your team',
              href: '/settings',
              color: 'text-success bg-success/10',
            },
          ].map((action) => (
            <Link
              key={action.title}
              to={action.href}
              className="p-4 rounded-xl border border-border bg-card hover:bg-muted/50 transition-colors text-left group"
            >
              <div className={`w-9 h-9 rounded-lg ${action.color} flex items-center justify-center mb-3`}>
                <action.icon className="w-4.5 h-4.5" />
              </div>
              <div className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                {action.title}
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">{action.description}</div>
            </Link>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <Link to="/dashboard">
            <Button size="xl" className="shadow-lg px-10">
              Go to Dashboard
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
