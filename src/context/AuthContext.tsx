'use client';

import { createContext, useContext, useState, useEffect, useCallback, useMemo, ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { UserRole } from '@/types';

interface AuthUser {
  id: string;
  name: string;
  role: UserRole;
  email?: string;
  session?: string;
  courseCode?: string;
  roll?: string;
  profilePhoto?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  refreshUser: (roleOverride?: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  refreshUser: async () => {},
  logout: async () => {},
});

/** Detect the expected auth role from the current URL path */
function getRoleFromPath(pathname: string): string | null {
  if (pathname.startsWith('/dashboard')) return 'student';
  if (pathname.startsWith('/admin')) return 'admin';
  if (pathname.startsWith('/cr')) return 'cr';
  // Teacher pages: /{courseCode}/... (e.g. /CSE2102/semester)
  if (/^\/[A-Za-z]+\d/.test(pathname)) return 'teacher';
  return null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const role = useMemo(() => getRoleFromPath(pathname), [pathname]);

  const refreshUser = useCallback(async (roleOverride?: string) => {
    try {
      const effectiveRole = roleOverride || role;
      const roleParam = effectiveRole ? `?role=${effectiveRole}` : '';
      const res = await fetch(`/api/auth/me${roleParam}`);
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [role]);

  const logout = useCallback(async () => {
    const effectiveRole = role || user?.role;
    const roleParam = effectiveRole ? `?role=${effectiveRole}` : '';
    await fetch(`/api/auth/logout${roleParam}`, { method: 'POST' });
    setUser(null);
    window.location.href = '/';
  }, [role, user?.role]);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  return (
    <AuthContext.Provider value={{ user, loading, refreshUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
