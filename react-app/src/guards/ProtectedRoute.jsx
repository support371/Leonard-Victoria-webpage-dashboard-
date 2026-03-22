import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function ProtectedRoute({ children, requiredRoles = [] }) {
  const { session, role, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-navy-800" />
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRoles.length > 0) {
    const isAdmin = role === 'admin';
    const hasRequiredRole = isAdmin || requiredRoles.includes(role);
    if (!hasRequiredRole) {
      return <Navigate to="/portal" replace />;
    }
  }

  return children;
}
