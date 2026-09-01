import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

export const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { user, loading, isAuthenticated, isAdmin, isSuperAdmin } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-950">
        <LoadingSpinner text="Verifying session..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const userHasAdminAccess =
    isAdmin || isSuperAdmin || user?.role === 'admin' || user?.role === 'super_admin';

  if (requireAdmin && !userHasAdminAccess) {
    return <Navigate to="/dashboard" replace />;
  }

  if (!requireAdmin && userHasAdminAccess && location.pathname === '/dashboard') {
    return <Navigate to="/admin" replace />;
  }

  return children;
};

export default ProtectedRoute;
