import { useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuthStore } from '@stores/authStore';
import { useOrgStore } from '@stores/orgStore';
import { usePermissionStore } from '@stores/permissionStore';
import * as authApi from '@services/api/auth.api';
import * as orgApi from '@services/api/org.api';
import type { LoginRequest, RegisterRequest, UserRole } from '@app-types/auth.types';

// Idle timeout — 30 minutes
const IDLE_TIMEOUT_MS = 30 * 60 * 1000;

// ──────────────────────────────────────────────────────────────
// useAuth — primary auth orchestration hook
// ──────────────────────────────────────────────────────────────
export function useAuth() {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading, accessToken, refreshToken, setAuth, clearAuth, setLoading, setInitialized, updateUser } = useAuthStore();
  const { setOrganizations, clearOrgs } = useOrgStore();
  const { setActiveRole, setOrgPermissions } = usePermissionStore();

  // ── Login ────────────────────────────────────────────────────
  const login = useCallback(async (data: LoginRequest, rememberMe = false) => {
    setLoading(true);
    try {
      const response = await authApi.login(data);
      setAuth(response.user, response.tokens);

      // Fetch full profile with memberships
      const me = await authApi.getMe();
      updateUser(me);

      // Sync organizations
      if (me.memberships?.length) {
        const orgs = me.memberships.map((m) => m.organization);
        setOrganizations(orgs);

        const permMap: Record<string, UserRole> = {};
        for (const membership of me.memberships) {
          permMap[membership.organization.id] = membership.role;
        }
        setOrgPermissions(permMap);
        setActiveRole(me.memberships[0]?.role ?? null);
      }

      // Check if email needs verification
      if (!response.user.isEmailVerified) {
        navigate('/auth/verify-email', { replace: true });
        return;
      }

      toast.success(`Welcome back, ${response.user.firstName}!`);
      navigate('/dashboard', { replace: true });
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Register ─────────────────────────────────────────────────
  const register = useCallback(async (data: RegisterRequest) => {
    setLoading(true);
    try {
      const response = await authApi.register(data);
      setAuth(response.user, response.tokens);

      // Fetch orgs for the newly created personal workspace
      try {
        const orgs = await orgApi.getUserOrganizations();
        setOrganizations(orgs);
      } catch {
        // non-critical
      }

      toast.success('Account created! Please verify your email.');
      navigate('/auth/verify-email', { replace: true });
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Logout ───────────────────────────────────────────────────
  const logout = useCallback(async (everywhere = false) => {
    setLoading(true);
    try {
      if (refreshToken) {
        await authApi.logout(refreshToken).catch(() => {
          // Ignore API errors on logout — always clear local state
        });
      }
    } finally {
      clearAuth();
      clearOrgs();
      setActiveRole(null);
      setOrgPermissions({});
      setLoading(false);
      navigate('/auth/login', { replace: true });
      toast.success('You have been signed out.');
    }
  }, [refreshToken]);

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    register,
  };
}

// ──────────────────────────────────────────────────────────────
// useSessionGuard — idle timeout detection
// ──────────────────────────────────────────────────────────────
export function useSessionGuard() {
  const { isAuthenticated, lastActivity, updateLastActivity, clearAuth } = useAuthStore();
  const { clearOrgs } = useOrgStore();
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const resetTimer = useCallback(() => {
    updateLastActivity();
    if (idleTimer.current) clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(() => {
      clearAuth();
      clearOrgs();
      window.location.href = '/auth/login?reason=idle';
    }, IDLE_TIMEOUT_MS);
  }, [clearAuth, clearOrgs, updateLastActivity]);

  useEffect(() => {
    if (!isAuthenticated) return;

    const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
    events.forEach((e) => window.addEventListener(e, resetTimer, { passive: true }));
    resetTimer();

    return () => {
      events.forEach((e) => window.removeEventListener(e, resetTimer));
      if (idleTimer.current) clearTimeout(idleTimer.current);
    };
  }, [isAuthenticated, resetTimer]);
}

