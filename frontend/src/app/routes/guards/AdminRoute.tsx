import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@stores/authStore';
import { usePermissionStore } from '@stores/permissionStore';

export function AdminRoute() {
  const { isAuthenticated } = useAuthStore();
  const { canAccess } = usePermissionStore();

  if (!isAuthenticated) return <Navigate to="/auth/login" replace />;
  if (!canAccess('ADMIN')) return <Navigate to="/forbidden" replace />;
  return <Outlet />;
}
