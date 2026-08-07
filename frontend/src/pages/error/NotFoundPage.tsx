import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@components/ui/Button';
import { Home, ArrowLeft, AlertTriangle, ShieldOff, ServerCrash, Wrench, Lock } from 'lucide-react';

interface ErrorPageProps {
  code: string;
  title: string;
  description: string;
  icon: React.ElementType;
  showHome?: boolean;
  showBack?: boolean;
}

function ErrorPage({ code, title, description, icon: Icon, showHome = true, showBack = true }: ErrorPageProps) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="text-center max-w-md"
      >
        <div className="mx-auto mb-8 w-20 h-20 rounded-3xl bg-muted flex items-center justify-center">
          <Icon className="w-10 h-10 text-muted-foreground" />
        </div>
        <p className="text-overline text-muted-foreground mb-3">Error {code}</p>
        <h1 className="text-heading-xl text-foreground mb-3">{title}</h1>
        <p className="text-body-md text-muted-foreground mb-8 leading-relaxed">{description}</p>
        <div className="flex items-center justify-center gap-3">
          {showBack && (
            <Button variant="outline" onClick={() => window.history.back()} leftIcon={<ArrowLeft className="w-4 h-4" />}>
              Go Back
            </Button>
          )}
          {showHome && (
            <Button variant="primary" leftIcon={<Home className="w-4 h-4" />} onClick={() => window.location.href = '/dashboard'}>
              Dashboard
            </Button>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export function NotFoundPage() {
  return (
    <ErrorPage
      code="404"
      title="Page not found"
      description="The page you're looking for doesn't exist or has been moved."
      icon={AlertTriangle}
    />
  );
}

export function ForbiddenPage() {
  return (
    <ErrorPage
      code="403"
      title="Access forbidden"
      description="You don't have permission to access this resource. Contact your administrator."
      icon={ShieldOff}
    />
  );
}

export function ServerErrorPage() {
  return (
    <ErrorPage
      code="500"
      title="Internal server error"
      description="Something went wrong on our end. We're already looking into it."
      icon={ServerCrash}
    />
  );
}

export function MaintenancePage() {
  return (
    <ErrorPage
      code="503"
      title="Under maintenance"
      description="The Dyvin AI Platform is temporarily unavailable while we perform scheduled maintenance."
      icon={Wrench}
      showBack={false}
      showHome={false}
    />
  );
}

export function UnauthorizedPage() {
  return (
    <ErrorPage
      code="401"
      title="Session expired"
      description="Your session has expired. Please sign in again to continue."
      icon={Lock}
      showBack={false}
      showHome={false}
    />
  );
}

// Default export for lazy loading compat
export default NotFoundPage;
