import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { IUser } from "../types/api";
import { authApi, type AuthCredentials } from "../api/auth.api";
import { tokenStorage, registerUnauthorizedListener } from "../api/client";

const USER_STORAGE_KEY = "lc_user_profile";

interface AuthContextValue {
  user: IUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: AuthCredentials) => Promise<IUser>;
  register: (credentials: AuthCredentials) => Promise<IUser>;
  logout: () => Promise<void>;
  logoutAll: () => Promise<void>;
  updateUser: (partial: Partial<IUser>) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<IUser | null>(() => {
    const cached = localStorage.getItem(USER_STORAGE_KEY);
    const token = tokenStorage.getAccessToken();
    if (cached && token) {
      try {
        return JSON.parse(cached) as IUser;
      } catch {
        return null;
      }
    }
    return null;
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const clearSession = useCallback(() => {
    tokenStorage.clearTokens();
    localStorage.removeItem(USER_STORAGE_KEY);
    setUser(null);
  }, []);

  useEffect(() => {
    registerUnauthorizedListener(() => {
      clearSession();
    });
  }, [clearSession]);

  const handleAuthSuccess = (res: {
    access_token: string;
    refresh_token: string;
    user: IUser;
  }) => {
    tokenStorage.setTokens({
      accessToken: res.access_token,
      refreshToken: res.refresh_token,
    });
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(res.user));
    setUser(res.user);
    return res.user;
  };

  const login = async (credentials: AuthCredentials): Promise<IUser> => {
    setIsLoading(true);
    try {
      const res = await authApi.login(credentials);
      return handleAuthSuccess(res);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (credentials: AuthCredentials): Promise<IUser> => {
    setIsLoading(true);
    try {
      const res = await authApi.register(credentials);
      return handleAuthSuccess(res);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    const refreshToken = tokenStorage.getRefreshToken();
    try {
      if (refreshToken) {
        await authApi.logout(refreshToken);
      }
    } catch {
      // Proceed with client cleanup even if network call fails
    } finally {
      clearSession();
    }
  };

  const logoutAll = async () => {
    try {
      // await authApi.logoutAllDevices();
    } finally {
      clearSession();
    }
  };

  const updateUser = (partial: Partial<IUser>) => {
    setUser((prev) => {
      if (!prev) return null;
      const updated = { ...prev, ...partial };
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user && tokenStorage.getAccessToken()),
        isLoading,
        login,
        register,
        logout,
        logoutAll,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};