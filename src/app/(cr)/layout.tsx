'use client';

import { useState, useCallback, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Sidebar, { SidebarItem } from '@/components/layout/Sidebar';
import Topbar from '@/components/layout/Topbar';
import { useAuth } from '@/context/AuthContext';

const sidebarItems: SidebarItem[] = [
  {
    label: 'Mark Attendance',
    href: '/cr/dashboard',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
  },
  {
    label: 'Class Schedule',
    href: '/cr/schedule',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
];

export default function CRLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = useCallback(() => setSidebarOpen((v) => !v), []);

  // CR login page has no sidebar
  if (pathname === '/cr') {
    return <>{children}</>;
  }

  useEffect(() => {
    if (!loading && (!user || user.role !== 'cr')) {
      router.replace('/cr');
    }
  }, [user, loading, router]);

  if (loading || !user || user.role !== 'cr') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar
        title="CR Panel"
        subtitle={user?.session ? `Session: ${user.session}` : 'CSE Department'}
        items={sidebarItems}
        mobileOpen={sidebarOpen}
        onToggle={toggleSidebar}
      />
      <div className="lg:ml-64">
        <Topbar title={pathname.includes('/schedule') ? 'Class Schedule' : 'Mark Attendance'} onToggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />
        <main className="p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
