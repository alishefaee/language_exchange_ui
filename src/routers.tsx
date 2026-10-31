import React from "react";
import { Navigate, useRoutes, type RouteObject } from "react-router";
import { PageLayout } from "./components/layout/PageLayout";
import { AuthGuard, GuestGuard } from "./features/auth/AuthGuard";
import { LoginView } from "./features/auth/LoginView";
// import { RegisterView } from "./features/auth/RegisterView";
// import { OnboardingWizard } from "./features/onboarding/OnboardingWizard";
// import { DiscoverView } from "./features/search/DiscoverView";
// import { ConversationListView } from "./features/chat/ConversationListView";
// import { ChatThreadView } from "./features/chat/ChatThreadView";
// import { ProfileEditView } from "./features/profile/ProfileEditView";
import { NotFoundView } from "./components/common/NotFoundView";

export const routeConfig: RouteObject[] = [
  {
    element: <PageLayout />,
    children: [
      // Default root path redirects to /login (GuestGuard handles forwarding if already logged in)
      {
        index: true,
        element: <Navigate to="/login" replace />,
      },

      // Unauthenticated / Guest Routes
      {
        element: <GuestGuard />,
        children: [
          { path: "login", element: <LoginView /> },
        //   { path: "register", element: <RegisterView /> },
        ],
      },

      // Protected Application Routes (Requires Authentication)
      {
        element: <AuthGuard />,
        children: [
        //   { path: "onboarding", element: <OnboardingWizard /> },
        //   { path: "discover", element: <DiscoverView /> },
        //   { path: "chats", element: <ConversationListView /> },
        //   { path: "chats/:conversationId", element: <ChatThreadView /> },
        //   { path: "profile", element: <ProfileEditView /> },
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
  return useRoutes(routeConfig)
};