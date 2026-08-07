import React, { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';

// Layouts
import { DashboardLayout } from '@layouts/DashboardLayout';
import { AuthLayout } from '@layouts/AuthLayout';
import { AdminLayout, PublicLayout, BlankLayout } from '@layouts/AdminLayout';

// Route guards
import { ProtectedRoute } from './guards/ProtectedRoute';
import { AdminRoute } from './guards/AdminRoute';
import { PublicOnlyRoute } from './guards/PublicOnlyRoute';

// Loading fallback
import { PageLoader } from '@components/feedback/PageLoader';

// ── Error pages ───────────────────────────────────────────────
const NotFoundPage = lazy(() => import('@pages/error/NotFoundPage'));
const ForbiddenPage = lazy(() => import('@pages/error/ForbiddenPage'));
const ServerErrorPage = lazy(() => import('@pages/error/ServerErrorPage'));
const MaintenancePage = lazy(() => import('@pages/error/MaintenancePage'));
const UnauthorizedPage = lazy(() => import('@pages/error/UnauthorizedPage'));

// ── Welcome / Landing ─────────────────────────────────────────
const WelcomePage = lazy(() => import('@pages/welcome/WelcomePage'));

// ── Auth pages ────────────────────────────────────────────────
const LoginPage = lazy(() => import('@pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('@pages/auth/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('@pages/auth/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('@pages/auth/ResetPasswordPage'));
const VerifyEmailPage = lazy(() => import('@pages/auth/VerifyEmailPage'));
const MFAPage = lazy(() => import('@pages/auth/MFAPage'));
const AccountLockedPage = lazy(() => import('@pages/auth/AccountLockedPage'));

// ── Onboarding pages ──────────────────────────────────────────
const CreateOrgPage = lazy(() => import('@pages/onboarding/CreateOrgPage'));
const InviteTeamPage = lazy(() => import('@pages/onboarding/InviteTeamPage'));
const OnboardingSuccessPage = lazy(() => import('@pages/onboarding/OnboardingSuccessPage'));

// ── Dashboard pages ───────────────────────────────────────────
const OverviewPage = lazy(() => import('@pages/dashboard/OverviewPage'));
const SettingsPage = lazy(() => import('@pages/dashboard/SettingsPage'));

// ── Platform module pages (stubs) ─────────────────────────────
const AiSearchPage = lazy(() => import('@pages/ai-search/AiSearchPage'));
const AiWorkforcePage = lazy(() => import('@pages/ai-workforce/AiWorkforcePage'));
const BusinessExecutionPage = lazy(() => import('@pages/business-execution/BusinessExecutionPage'));
const MarketplacePage = lazy(() => import('@pages/marketplace/MarketplacePage'));
const GovernancePage = lazy(() => import('@pages/governance/GovernancePage'));
const WorkflowStudioPage = lazy(() => import('@pages/workflow-studio/WorkflowStudioPage'));
const AppBuilderPage = lazy(() => import('@pages/app-builder/AppBuilderPage'));
const DeveloperPage = lazy(() => import('@pages/developer/DeveloperPage'));
const CustomerIntelligencePage = lazy(() => import('@pages/customer-intelligence/CustomerIntelligencePage'));
const SecurityPage = lazy(() => import('@pages/security/SecurityPage'));
const BillingPage = lazy(() => import('@pages/billing/BillingPage'));
const ReportsPage = lazy(() => import('@pages/reports/ReportsPage'));

// ── Admin pages ───────────────────────────────────────────────
const AdminOverviewPage = lazy(() => import('@pages/admin/AdminOverviewPage'));
const AdminUsersPage = lazy(() => import('@pages/admin/AdminUsersPage'));
const AdminOrgsPage = lazy(() => import('@pages/admin/AdminOrgsPage'));

const S = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<PageLoader />}>{children}</Suspense>
);

const router = createBrowserRouter([
  // ── Landing page (public) ─────────────────────────────────
  {
    path: '/',
    element: <S><WelcomePage /></S>,
  },

  // ── Public auth routes (redirect if authenticated) ─────────
  {
    element: <PublicOnlyRoute />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          { path: '/auth/login', element: <S><LoginPage /></S> },
          { path: '/auth/register', element: <S><RegisterPage /></S> },
          { path: '/auth/forgot-password', element: <S><ForgotPasswordPage /></S> },
          { path: '/auth/reset-password', element: <S><ResetPasswordPage /></S> },
        ],
      },
    ],
  },

  // ── Semi-public auth routes (accessible logged in too) ─────
  {
    element: <AuthLayout />,
    children: [
      { path: '/auth/verify-email', element: <S><VerifyEmailPage /></S> },
      { path: '/auth/mfa', element: <S><MFAPage /></S> },
      { path: '/auth/account-locked', element: <S><AccountLockedPage /></S> },
    ],
  },

  // ── Protected onboarding ───────────────────────────────────
  {
    element: <ProtectedRoute />,
    children: [
      { path: '/onboarding', element: <Navigate to="/onboarding/organization" replace /> },
      { path: '/onboarding/organization', element: <S><CreateOrgPage /></S> },
      { path: '/onboarding/invite', element: <S><InviteTeamPage /></S> },
      { path: '/onboarding/success', element: <S><OnboardingSuccessPage /></S> },
    ],
  },

  // ── Protected dashboard routes ─────────────────────────────
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          { index: true, element: <Navigate to="/dashboard" replace /> },
          { path: '/dashboard', element: <S><OverviewPage /></S> },
          { path: '/settings', element: <S><SettingsPage /></S> },
          { path: '/ai-search/*', element: <S><AiSearchPage /></S> },
          { path: '/ai-workforce/*', element: <S><AiWorkforcePage /></S> },
          { path: '/business-execution/*', element: <S><BusinessExecutionPage /></S> },
          { path: '/marketplace/*', element: <S><MarketplacePage /></S> },
          { path: '/governance/*', element: <S><GovernancePage /></S> },
          { path: '/workflow-studio/*', element: <S><WorkflowStudioPage /></S> },
          { path: '/app-builder/*', element: <S><AppBuilderPage /></S> },
          { path: '/developer/*', element: <S><DeveloperPage /></S> },
          { path: '/customer-intelligence/*', element: <S><CustomerIntelligencePage /></S> },
          { path: '/security/*', element: <S><SecurityPage /></S> },
          { path: '/billing/*', element: <S><BillingPage /></S> },
          { path: '/reports/*', element: <S><ReportsPage /></S> },
        ],
      },
    ],
  },

  // ── Admin routes ───────────────────────────────────────────
  {
    element: <AdminRoute />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { path: '/admin', element: <S><AdminOverviewPage /></S> },
          { path: '/admin/users', element: <S><AdminUsersPage /></S> },
          { path: '/admin/organizations', element: <S><AdminOrgsPage /></S> },
        ],
      },
    ],
  },

  // ── Public utility pages ───────────────────────────────────
  {
    element: <PublicLayout />,
    children: [
      { path: '/maintenance', element: <S><MaintenancePage /></S> },
    ],
  },

  // ── Error / blank pages ────────────────────────────────────
  {
    element: <BlankLayout />,
    children: [
      { path: '/unauthorized', element: <S><UnauthorizedPage /></S> },
      { path: '/forbidden', element: <S><ForbiddenPage /></S> },
      { path: '/500', element: <S><ServerErrorPage /></S> },
      { path: '*', element: <S><NotFoundPage /></S> },
    ],
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
