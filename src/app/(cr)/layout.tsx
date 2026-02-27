'use client';

import { usePathname } from 'next/navigation';
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
];

export default function CRLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user } = useAuth();

  // CR login page has no sidebar
  if (pathname === '/cr') {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar
        title="CR Panel"
        subtitle={user?.session ? `Session: ${user.session}` : 'CSE Department'}
        items={sidebarItems}
      />
      <div className="lg:ml-64">
        <Topbar title="Mark Attendance" />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
