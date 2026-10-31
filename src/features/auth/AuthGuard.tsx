import React from "react";
import { Navigate, Outlet, useLocation } from "react-router";
import { useAuth } from "../../hooks/useAuth";

export const AuthGuard: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated || !user) {
    // Redirect unauthenticated users strictly to /login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Lifecycle Routing: Redirect to onboarding if not yet completed
  if (
    user.onboardingStep !== "completed" &&
    location.pathname !== "/onboarding"
  ) {
    return <Navigate to="/onboarding" replace />;
  }

  return <Outlet />;
};

export const GuestGuard: React.FC = () => {
  const { isAuthenticated, user } = useAuth();

  if (isAuthenticated && user) {
    return (
      <Navigate
        to={user.onboardingStep !== "completed" ? "/onboarding" : "/discover"}
        replace
      />
    );
  }

  return <Outlet />;
};