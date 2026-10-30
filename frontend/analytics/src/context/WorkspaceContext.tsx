import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { useQueryClient } from "@tanstack/react-query";
import { authService, type UserSession } from "@/lib/auth";
import type { AuthUser, Organization, Project } from "@/types";

interface WorkspaceContextValue {
  user: AuthUser | UserSession | null;
  organizations: Organization[];
  projects: Project[];
  activeOrganization: Organization | null;
  activeProject: Project | null;
  activeOrgId: string | null;
  activeProjectId: string | null;
  setActiveOrganization: (orgId: string) => void;
  setActiveProject: (projectId: string) => void;
  isLoading: boolean;
  isAuthenticated: boolean;
  isDemo: boolean;
  error: string | null;
  refreshWorkspace: () => Promise<void>;
  logout: () => Promise<void>;
}

const WorkspaceContext = createContext<WorkspaceContextValue | undefined>(undefined);

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [user, setUser] = useState<AuthUser | UserSession | null>(null);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeOrgId, setActiveOrgIdState] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    return authService.getActiveOrgId();
  });
  const [activeProjectId, setActiveProjectIdState] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    return authService.getActiveProjectId();
  });
  // SSR-safe: start false so server HTML never contains the loading spinner.
  // useEffect sets it true then hydrate() resolves it on the client.
  // This prevents TanStack Start SSR hydration mismatch from freezing isLoading=true.
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Failsafe: if hydrate() hangs for any reason, unblock loading after 5s
  const loadingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Guard all localStorage reads against SSR (server has no window/localStorage)
  const session = typeof window !== "undefined" ? authService.getSession() : null;
  const isDemo = !!session?.isDemo;
  const isAuthenticated = typeof window !== "undefined" ? authService.isAuthenticated() : false;

  const hydrate = useCallback(async () => {
    if (!authService.isAuthenticated()) {
      if (authService.isDemoModeEnabled()) {
        authService.loginAsDemo();
      } else {
        setUser(null);
        setOrganizations([]);
        setProjects([]);
        setIsLoading(false);
        return;
      }
    }

    const currentSession = authService.getSession();

    // If demo session, load mock workspace defaults immediately
    if (currentSession?.isDemo) {
      setUser({
        id: currentSession.id || "usr_demo_dev",
        email: currentSession.email,
        name: currentSession.name,
        role: "owner",
      } as any);

      const demoOrg: Organization = {
        id: "org_demo_northwind",
        name: "Northwind Labs",
        slug: "northwind-labs",
        role: "OWNER",
      };
      const demoProj: Project = {
        id: "proj_demo_core",
        name: "Dyvin Visibility Engine",
        slug: "dyvin-visibility-engine",
        primaryDomain: "northwind.ai",
        organizationId: "org_demo_northwind",
      };

      setOrganizations([demoOrg]);
      setProjects([demoProj]);
      setActiveOrgIdState("org_demo_northwind");
      setActiveProjectIdState("proj_demo_core");
      authService.setActiveOrgId("org_demo_northwind");
      authService.setActiveProjectId("proj_demo_core");
      setIsLoading(false);
      return;
    }

    // Real session: hydrate from backend
    setIsLoading(true);
    setError(null);
    try {
      const data = await authService.hydrateWorkspaceContext();
      setUser(data.user);
      setOrganizations(data.organizations);
      setProjects(data.projects);

      const currentOrgId = authService.getActiveOrgId();
      const currentProjId = authService.getActiveProjectId();

      setActiveOrgIdState(currentOrgId);
      setActiveProjectIdState(currentProjId);
    } catch (err) {
      console.warn("Workspace hydration error:", err);
      // Fallback to session cache if available
      if (currentSession) {
        setUser(currentSession as any);
      }
      setError(err instanceof Error ? err.message : "Failed to load workspace context");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Set loading true immediately on client mount (isLoading starts false for SSR)
    setIsLoading(true);

    // Failsafe: if hydrate() never resolves (e.g. network hang), unblock UI after 5s
    loadingTimeoutRef.current = setTimeout(() => {
      setIsLoading(false);
    }, 5000);

    hydrate().finally(() => {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
        loadingTimeoutRef.current = null;
      }
    });

    return () => {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
        loadingTimeoutRef.current = null;
      }
    };
  }, [hydrate]);

  const setActiveOrganization = useCallback(
    (orgId: string) => {
      authService.setActiveOrgId(orgId);
      setActiveOrgIdState(orgId);

      // Invalidate queries tied to previous tenant context
      queryClient.invalidateQueries();

      // Refresh projects under the newly selected organization
      hydrate();
    },
    [hydrate, queryClient]
  );

  const setActiveProject = useCallback(
    (projectId: string) => {
      authService.setActiveProjectId(projectId);
      setActiveProjectIdState(projectId);

      // Invalidate project-specific queries
      queryClient.invalidateQueries();
    },
    [queryClient]
  );

  const refreshWorkspace = useCallback(async () => {
    await hydrate();
  }, [hydrate]);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await authService.logout();
    } finally {
      setUser(null);
      setOrganizations([]);
      setProjects([]);
      setActiveOrgIdState(null);
      setActiveProjectIdState(null);
      queryClient.clear();
      setIsLoading(false);
      window.location.assign("/");
    }
  }, [queryClient]);

  const activeOrganization = organizations.find((o) => o.id === activeOrgId) || organizations[0] || null;
  const activeProject = projects.find((p) => p.id === activeProjectId) || projects[0] || null;

  return (
    <WorkspaceContext.Provider
      value={{
        user,
        organizations,
        projects,
        activeOrganization,
        activeProject,
        activeOrgId,
        activeProjectId,
        setActiveOrganization,
        setActiveProject,
        isLoading,
        isAuthenticated,
        isDemo,
        error,
        refreshWorkspace,
        logout,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace(): WorkspaceContextValue {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error("useWorkspace must be used within a WorkspaceProvider");
  }
  return context;
}
