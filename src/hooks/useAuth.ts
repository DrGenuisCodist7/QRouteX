'use client';

import { useState, useEffect, useCallback } from 'react';
import { AuthSession, UserProfile } from '@/types';
import { authService } from '@/services/authService';

export function useAuth() {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const active = authService.getSession();
    setSession(active);
    setIsLoading(false);
  }, []);

  const login = useCallback(
    async (usernameOrEmail: string, password: string) => {
      setIsLoading(true);
      const res = await authService.login(usernameOrEmail, password);
      if (res.success && res.session) {
        setSession(res.session);
      }
      setIsLoading(false);
      return res;
    },
    []
  );

  const logout = useCallback(() => {
    authService.logout();
    setSession(null);
  }, []);

  const updateProfile = useCallback((updated: Partial<UserProfile>) => {
    const user = authService.updateProfile(updated);
    setSession((prev) => (prev ? { ...prev, user } : null));
  }, []);

  return {
    session,
    isAuthenticated: !!session,
    user: session?.user || null,
    isLoading,
    login,
    logout,
    updateProfile,
  };
}
