import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { AuthUser, AuthTokens, SecurityContext } from '@app-types/auth.types';

interface AuthStore {
  // State
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  securityContext: SecurityContext | null;
  lastActivity: number | null;

  // Actions
  setUser: (user: AuthUser | null) => void;
  setTokens: (tokens: AuthTokens) => void;
  setAuth: (user: AuthUser, tokens: AuthTokens) => void;
  clearAuth: () => void;
  setLoading: (loading: boolean) => void;
  setInitialized: (initialized: boolean) => void;
  setSecurityContext: (ctx: SecurityContext | null) => void;
  updateLastActivity: () => void;
  updateUser: (partial: Partial<AuthUser>) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      isInitialized: false,
      securityContext: null,
      lastActivity: null,

      setUser: (user) =>
        set({ user, isAuthenticated: !!user }),

      setTokens: (tokens) =>
        set({
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          isAuthenticated: true,
        }),

      setAuth: (user, tokens) =>
        set({
          user,
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          isAuthenticated: true,
          lastActivity: Date.now(),
        }),

      clearAuth: () =>
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
          securityContext: null,
          lastActivity: null,
        }),

      setLoading: (isLoading) => set({ isLoading }),

      setInitialized: (isInitialized) => set({ isInitialized }),

      setSecurityContext: (securityContext) => set({ securityContext }),

      updateLastActivity: () => set({ lastActivity: Date.now() }),

      updateUser: (partial) =>
        set((s) => ({
          user: s.user ? { ...s.user, ...partial } : null,
        })),
    }),
    {
      name: 'dyvin-auth',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
        lastActivity: state.lastActivity,
      }),
    }
  )
);

// ── Selector helpers ──────────────────────────────────────────
export const selectUser = (s: AuthStore) => s.user;
export const selectIsAuthenticated = (s: AuthStore) => s.isAuthenticated;
export const selectAccessToken = (s: AuthStore) => s.accessToken;
export const selectRefreshToken = (s: AuthStore) => s.refreshToken;

