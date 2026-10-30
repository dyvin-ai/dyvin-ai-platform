import type { AuthResponse, AuthUser, Organization, Project } from '@/types';

export interface UserSession {
  id?: string;
  email: string;
  name: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string | null;
  authenticated: boolean;
  isDemo?: boolean;
  loginTime: number;
}

export interface WorkspaceSession {
  brandDomain: string;
  brandName: string;
  industry: string;
  competitors: string[];
  trackedModels: string[];
  activeOrgId?: string;
  activeOrgName?: string;
  activeProjectId?: string;
  activeProjectName?: string;
}

const TOKEN_KEY = 'dyvin_auth_token';
const REFRESH_KEY = 'dyvin_refresh_token';
const AUTH_KEY = 'dyvin_auth_session';
const WORKSPACE_KEY = 'dyvin_workspace_session';
const ACTIVE_ORG_KEY = 'dyvin_active_org_id';
const ACTIVE_PROJECT_KEY = 'dyvin_active_project_id';

export const DEMO_CREDENTIALS = {
  email: 'demo@dyvin.ai',
  password: 'demo123',
};

const DEFAULT_WORKSPACE: WorkspaceSession = {
  brandDomain: 'dyvin.ai',
  brandName: 'DYVIN AI',
  industry: 'AI Search Intelligence',
  competitors: ['Atlas AI', 'Vector Systems', 'Cognitive Corp'],
  trackedModels: ['ChatGPT 4o', 'Claude 3.5 Sonnet', 'Gemini 1.5 Pro', 'Perplexity Pro'],
  activeOrgId: 'org_demo_northwind',
  activeOrgName: 'Northwind Labs',
  activeProjectId: 'proj_demo_core',
  activeProjectName: 'Dyvin Visibility Engine',
};

function getApiBaseUrl(): string {
  const envUrl = import.meta.env.VITE_API_BASE_URL as string | undefined;
  if (envUrl) return envUrl.replace(/\/$/, '');
  // Default to relative /api/v1 (proxied via Vite in dev)
  return '/api/v1';
}

function unpackData<T>(json: any): T {
  if (json && typeof json === 'object' && 'data' in json && 'success' in json) {
    return json.data as T;
  }
  return json as T;
}

export const authService = {
  isDemoModeEnabled(): boolean {
    return import.meta.env.VITE_DEMO_MODE !== 'false';
  },

  getAccessToken(): string | null {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  },

  getRefreshToken(): string | null {
    try {
      return localStorage.getItem(REFRESH_KEY);
    } catch {
      return null;
    }
  },

  setTokens(accessToken: string, refreshToken?: string): void {
    try {
      localStorage.setItem(TOKEN_KEY, accessToken);
      if (refreshToken) {
        localStorage.setItem(REFRESH_KEY, refreshToken);
      }
    } catch (e) {
      console.error('Failed to store auth tokens:', e);
    }
  },

  getActiveOrgId(): string | null {
    try {
      return localStorage.getItem(ACTIVE_ORG_KEY);
    } catch {
      return null;
    }
  },

  setActiveOrgId(orgId: string): void {
    try {
      localStorage.setItem(ACTIVE_ORG_KEY, orgId);
    } catch (e) {
      console.error('Failed to set active org ID:', e);
    }
  },

  getActiveProjectId(): string | null {
    try {
      return localStorage.getItem(ACTIVE_PROJECT_KEY);
    } catch {
      return null;
    }
  },

  setActiveProjectId(projectId: string): void {
    try {
      localStorage.setItem(ACTIVE_PROJECT_KEY, projectId);
    } catch (e) {
      console.error('Failed to set active project ID:', e);
    }
  },

  getSession(): UserSession | null {
    try {
      const data = localStorage.getItem(AUTH_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  getWorkspace(): WorkspaceSession {
    try {
      const data = localStorage.getItem(WORKSPACE_KEY);
      return data ? JSON.parse(data) : DEFAULT_WORKSPACE;
    } catch {
      return DEFAULT_WORKSPACE;
    }
  },

  loginAsDemo(): UserSession {
    const session: UserSession = {
      id: 'usr_demo_dev',
      email: DEMO_CREDENTIALS.email,
      name: 'Demo User (Dev)',
      firstName: 'Demo',
      lastName: 'User',
      authenticated: true,
      isDemo: true,
      loginTime: Date.now(),
    };
    try {
      localStorage.setItem(AUTH_KEY, JSON.stringify(session));
      localStorage.setItem(TOKEN_KEY, 'demo_access_token_dev_session');
      localStorage.setItem(REFRESH_KEY, 'demo_refresh_token_dev_session');
      localStorage.setItem(ACTIVE_ORG_KEY, 'org_demo_northwind');
      localStorage.setItem(ACTIVE_PROJECT_KEY, 'proj_demo_core');
      localStorage.setItem(WORKSPACE_KEY, JSON.stringify(DEFAULT_WORKSPACE));
    } catch (e) {
      console.error('Failed to store demo session:', e);
    }
    return session;
  },

  async loginWithCredentials(email: string, password: string): Promise<UserSession> {
    // Check if user is using demo credentials directly
    if (email.trim().toLowerCase() === DEMO_CREDENTIALS.email.toLowerCase()) {
      return this.loginAsDemo();
    }

    const baseUrl = getApiBaseUrl();
    const res = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ email: email.trim(), password }),
    });

    if (!res.ok) {
      let errorData: { message?: string | string[] } = {};
      try {
        errorData = await res.json();
      } catch {
        errorData = { message: res.statusText };
      }
      const msg = Array.isArray(errorData.message)
        ? errorData.message.join(', ')
        : errorData.message || 'Login failed. Please check your credentials.';
      throw new Error(msg);
    }

    const rawLoginJson = await res.json();
    const authRes = unpackData<AuthResponse>(rawLoginJson);
    this.setTokens(authRes.tokens.accessToken, authRes.tokens.refreshToken);

    const userName = `${authRes.user.firstName || ''} ${authRes.user.lastName || ''}`.trim() || authRes.user.email.split('@')[0];
    const session: UserSession = {
      id: authRes.user.id,
      email: authRes.user.email,
      name: userName,
      firstName: authRes.user.firstName,
      lastName: authRes.user.lastName,
      avatarUrl: authRes.user.avatarUrl,
      authenticated: true,
      isDemo: false,
      loginTime: Date.now(),
    };

    localStorage.setItem(AUTH_KEY, JSON.stringify(session));

    // Hydrate organization & project context
    try {
      await this.hydrateWorkspaceContext(authRes.tokens.accessToken);
    } catch (hydrateErr) {
      console.warn('Workspace context hydration warning:', hydrateErr);
    }

    return session;
  },

  async registerWithCredentials(
    email: string,
    password: string,
    brandDomain?: string,
    firstName?: string,
    lastName?: string,
  ): Promise<UserSession> {
    const baseUrl = getApiBaseUrl();
    const rawEmail = email.trim();
    const inferredFirst = firstName || rawEmail.split('@')[0].split(/[._-]/)[0] || 'User';
    const inferredLast = lastName || 'Member';

    const res = await fetch(`${baseUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        email: rawEmail,
        password,
        firstName: inferredFirst.charAt(0).toUpperCase() + inferredFirst.slice(1),
        lastName: inferredLast.charAt(0).toUpperCase() + inferredLast.slice(1),
      }),
    });

    if (!res.ok) {
      let errorData: { message?: string | string[] } = {};
      try {
        errorData = await res.json();
      } catch {
        errorData = { message: res.statusText };
      }
      const msg = Array.isArray(errorData.message)
        ? errorData.message.join(', ')
        : errorData.message || 'Registration failed. Please try again.';
      throw new Error(msg);
    }

    const rawRegisterJson = await res.json();
    const authRes = unpackData<AuthResponse>(rawRegisterJson);
    this.setTokens(authRes.tokens.accessToken, authRes.tokens.refreshToken);

    const userName = `${authRes.user.firstName || ''} ${authRes.user.lastName || ''}`.trim() || rawEmail.split('@')[0];
    const session: UserSession = {
      id: authRes.user.id,
      email: authRes.user.email,
      name: userName,
      firstName: authRes.user.firstName,
      lastName: authRes.user.lastName,
      avatarUrl: authRes.user.avatarUrl,
      authenticated: true,
      isDemo: false,
      loginTime: Date.now(),
    };

    localStorage.setItem(AUTH_KEY, JSON.stringify(session));

    if (brandDomain) {
      const cleanedDomain = brandDomain.toLowerCase().replace(/^https?:\/\//, '').replace(/\/.*$/, '');
      const rawBrand = cleanedDomain.split('.')[0] || 'brand';
      const brandName = rawBrand.replace(/\b\w/g, l => l.toUpperCase());
      const ws: WorkspaceSession = {
        ...DEFAULT_WORKSPACE,
        brandDomain: cleanedDomain,
        brandName: brandName || 'My Brand',
      };
      localStorage.setItem(WORKSPACE_KEY, JSON.stringify(ws));
    }

    // Hydrate organization & project context
    try {
      await this.hydrateWorkspaceContext(authRes.tokens.accessToken);
    } catch (hydrateErr) {
      console.warn('Workspace context hydration warning:', hydrateErr);
    }

    return session;
  },

  async forgotPassword(email: string): Promise<void> {
    const baseUrl = getApiBaseUrl();
    await fetch(`${baseUrl}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ email: email.trim() }),
    });
  },

  async refreshTokens(): Promise<string | null> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) return null;

    const baseUrl = getApiBaseUrl();
    try {
      const res = await fetch(`${baseUrl}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });

      if (!res.ok) {
        this.clearSession();
        return null;
      }

      const rawRefreshJson = await res.json();
      const data = unpackData<{ accessToken: string; refreshToken?: string }>(rawRefreshJson);
      this.setTokens(data.accessToken, data.refreshToken);
      return data.accessToken;
    } catch {
      return null;
    }
  },

  async hydrateWorkspaceContext(token?: string): Promise<{
    user: AuthUser;
    organizations: Organization[];
    projects: Project[];
  }> {
    const accessToken = token || this.getAccessToken();
    if (!accessToken) throw new Error('No access token available');

    const baseUrl = getApiBaseUrl();
    const meRes = await fetch(`${baseUrl}/auth/me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json',
      },
    });

    if (!meRes.ok) {
      throw new Error('Failed to fetch user profile');
    }

    const rawMeJson = await meRes.json();
    const userProfile = unpackData<AuthUser & {
      memberships?: { role: string; organization: Organization }[];
    }>(rawMeJson);

    const organizations: Organization[] = (userProfile.memberships || []).map((m) => ({
      ...m.organization,
      role: m.role,
    }));

    let activeOrgId = this.getActiveOrgId();
    const validOrg = organizations.find((o) => o.id === activeOrgId);
    if (!validOrg && organizations.length > 0) {
      activeOrgId = organizations[0].id;
      this.setActiveOrgId(activeOrgId);
    }

    let projects: Project[] = [];
    if (activeOrgId) {
      try {
        const projRes = await fetch(`${baseUrl}/projects`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'X-Organization-Id': activeOrgId,
            Accept: 'application/json',
          },
        });
        if (projRes.ok) {
          const rawProjJson = await projRes.json();
          projects = unpackData<Project[]>(rawProjJson) || [];
        }
      } catch (projErr) {
        console.warn('Failed to fetch projects:', projErr);
      }
    }

    let activeProjId = this.getActiveProjectId();
    const validProj = projects.find((p) => p.id === activeProjId);
    if (!validProj && projects.length > 0) {
      activeProjId = projects[0].id;
      this.setActiveProjectId(activeProjId);
    }

    // Update cached workspace session
    const currentWs = this.getWorkspace();
    const activeOrg = organizations.find((o) => o.id === activeOrgId);
    const activeProj = projects.find((p) => p.id === activeProjId);

    const updatedWs: WorkspaceSession = {
      ...currentWs,
      activeOrgId: activeOrgId || currentWs.activeOrgId,
      activeOrgName: activeOrg?.name || currentWs.activeOrgName,
      activeProjectId: activeProjId || currentWs.activeProjectId,
      activeProjectName: activeProj?.name || currentWs.activeProjectName,
      brandDomain: activeProj?.primaryDomain || activeProj?.websites?.[0]?.domain || currentWs.brandDomain,
    };
    localStorage.setItem(WORKSPACE_KEY, JSON.stringify(updatedWs));

    return { user: userProfile, organizations, projects };
  },

  async logout(): Promise<void> {
    const accessToken = this.getAccessToken();
    const refreshToken = this.getRefreshToken();
    const baseUrl = getApiBaseUrl();

    if (accessToken && refreshToken) {
      try {
        await fetch(`${baseUrl}/auth/logout`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ refreshToken }),
        });
      } catch {
        // Silently continue clearing client session
      }
    }

    this.clearSession();
  },

  clearSession(): void {
    try {
      localStorage.removeItem(AUTH_KEY);
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(REFRESH_KEY);
      localStorage.removeItem(ACTIVE_ORG_KEY);
      localStorage.removeItem(ACTIVE_PROJECT_KEY);
      localStorage.removeItem(WORKSPACE_KEY);
    } catch (e) {
      console.error('Failed to clear session:', e);
    }
  },

  updateWorkspace(updates: Partial<WorkspaceSession>): WorkspaceSession {
    const current = this.getWorkspace();
    const updated = { ...current, ...updates };
    localStorage.setItem(WORKSPACE_KEY, JSON.stringify(updated));
    return updated;
  },

  isAuthenticated(): boolean {
    const session = this.getSession();
    const token = this.getAccessToken();
    return !!session?.authenticated && (session.isDemo || !!token);
  },
};
