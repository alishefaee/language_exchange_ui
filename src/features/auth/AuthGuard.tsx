// src/features/auth/AuthGuard.tsx
import React from "react";
import { Navigate, Outlet, useLocation } from "react-router";
import { useAuth } from "../../hooks/useAuth";

/**
 * Protects authenticated routes. Redirects unauthenticated visitors to /login.
 */
export const AuthGuard: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

/**
 * Prevents logged-in users from seeing /login or /register.
 * Redirects authenticated users directly to /onboarding.
 */
export const GuestGuard: React.FC = () => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/onboarding" replace />;
  }

  return <Outlet />;
};