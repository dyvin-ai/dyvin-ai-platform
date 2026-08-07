import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@stores/authStore';

export function PublicOnlyRoute() {
  const { isAuthenticated } = useAuthStore();
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  return <Outlet />;
}
