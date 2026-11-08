// src/routers.tsx
import React from "react";
import { Navigate, useRoutes, type RouteObject } from "react-router";
import { PageLayout } from "./components/layout/PageLayout";
import { AuthGuard, GuestGuard } from "./features/auth/AuthGuard";
import { LoginView } from "./features/auth/LoginView";
import { RegisterView } from "./features/auth/RegisterView";
import { NotFoundView } from "./components/common/NotFoundView";
import { OnboardingWizard } from "./features/onboarding/OnboardingWizard";

export const routeConfig: RouteObject[] = [
  {
    element: <PageLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/login" replace />,
      },

      // Unauthenticated / Guest Routes
      {
        element: <GuestGuard />,
        children: [
          { path: "login", element: <LoginView /> },
          { path: "register", element: <RegisterView /> },
        ],
      },

      // Protected Application Routes
      {
        element: <AuthGuard />,
        children: [
          { path: "onboarding", element: <OnboardingWizard /> },
        ],
      },

      // 404 Fallback Route
      {
        path: "*",
        element: <NotFoundView />,
      },
    ],
  },
];

export const AppRouter: React.FC = () => {
  return useRoutes(routeConfig);
};