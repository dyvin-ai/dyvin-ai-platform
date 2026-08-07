# Enterprise Frontend Architecture — Phase F1

This document outlines the foundation of the Dyvin AI Enterprise React Application. The architecture is built for extreme scalability, enabling the platform to grow to hundreds of modules without requiring foundational changes.

## Technology Stack

- **Framework**: React 18 (Vite)
- **Language**: TypeScript (Strict Mode)
- **Routing**: React Router v6
- **State Management**: Zustand
- **Data Fetching**: TanStack Query (React Query) v5 + Axios
- **Styling**: TailwindCSS
- **UI Primitives**: Radix UI
- **Animations**: Framer Motion
- **Icons**: Lucide React

## Application Structure

The application is structured by responsibility and feature capability.

```text
src/
├── animations/        # Framer motion variants (fade, slide, page transitions)
├── app/               # Application Root, Providers, and Routing
│   ├── providers/     # QueryProvider, ThemeProvider, ToastProvider
│   ├── routes/        # AppRouter, Route Guards
│   └── App.tsx        # Composition Root
├── components/        # Reusable View Components
│   ├── cards/         # Metric cards, statistic cards
│   ├── feedback/      # Loaders, error boundaries, empty states
│   ├── navigation/    # Sidebar, TopNav, breadcrumbs
│   └── ui/            # Shared base components (Button, Input, Card, Dialog)
├── layouts/           # Page Shells (DashboardLayout, AuthLayout, AdminLayout)
├── lib/               # Utility libraries (clsx + tailwind-merge)
├── pages/             # Feature views (lazy-loaded)
│   ├── admin/         # Super admin screens
│   ├── auth/          # Authentication flows
│   ├── dashboard/     # Organization dashboard
│   ├── error/         # 404, 500, 403, 503, 401 views
│   └── ...            # Additional module stubs
├── services/          # API Client and network interceptors
│   └── api/           # Axios instance, token refresh logic
├── stores/            # Global state (Zustand)
├── styles/            # Global CSS, Design System, CSS Variables
├── vite-env.d.ts      # TypeScript environment definitions
└── main.tsx           # Entry point
```

## State Management

Zustand is used for client-side state. Each store handles a distinct domain and automatically persists to `localStorage`.

- **`authStore`**: Manages user authentication, access tokens, and RBAC roles.
- **`orgStore`**: Manages the active Organization and Workspace context.
- **`themeStore`**: Manages dark/light/system theme resolution.
- **`uiStore`**: Manages transient UI state (sidebar collapse, global loading).
- **`notificationStore`**: Manages real-time toast and feed notifications.

## Routing Architecture

We utilize React Router v6 with a data-driven routing table (`createBrowserRouter`).

1. **Lazy Loading**: Every feature page is lazy-loaded (`React.lazy`) via `Suspense` boundaries.
2. **Guards**: `ProtectedRoute` and `AdminRoute` wrap layouts to enforce session state and RBAC.
3. **Nested Layouts**: 
   - `AuthLayout`: Split-screen branding + auth forms
   - `DashboardLayout`: Persistent collapsible sidebar + top nav
   - `AdminLayout`: Specialized administrative shell
   - `BlankLayout`: Fallback for error screens

## API Layer & Authentication

The Axios client (`apiClient`) intercepts all requests and responses.

- **Request Injection**: Automatically attaches the current Bearer token.
- **Token Refresh**: On receiving a `401 Unauthorized`, the client pauses all pending requests, fetches a new access token via `/api/v1/auth/refresh`, updates the `authStore`, and automatically retries the failed requests.
- **Error Normalization**: Standardizes API errors into a consistent `ApiError` interface.

## Design System

The platform uses a CSS variable-driven design system injected via Tailwind.

- **Theming**: Instantly swap between dark and light modes via CSS classes on the `html` root.
- **Colors**: Semantic tokens (`--primary`, `--success`, `--danger`, `--muted`, `--surface`).
- **Typography**: A calculated typography scale from `display-2xl` to `body-xs` using Inter.
- **Spacing**: A strict 4px grid spacing system.

## Performance Optimization

- **Code Splitting**: Vite is configured to chunk dependencies aggressively (e.g., separating `react-core`, `query`, `ui-primitives`, and `motion`).
- **Tree Shaking**: Only used icons from `lucide-react` and primitive components are bundled.
