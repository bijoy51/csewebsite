'use client';

import { usePathname } from 'next/navigation';
import Sidebar, { SidebarItem } from '@/components/layout/Sidebar';
import Topbar from '@/components/layout/Topbar';
import { useAuth } from '@/context/AuthContext';

export default function TeacherLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user } = useAuth();

  // Teacher login page has no sidebar
  if (pathname === '/teachers') {
    return <>{children}</>;
  }

  // Extract courseCode from URL (e.g., /CSE1101/attendance → CSE1101)
  const segments = pathname.split('/').filter(Boolean);
  const courseCode = decodeURIComponent(segments[0] || '');

  const sidebarItems: SidebarItem[] = [
    {
      label: 'Students',
      href: `/${courseCode}/students`,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
    {
      label: 'Attendance',
      href: `/${courseCode}/attendance`,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      ),
    },
    {
      label: 'Tutorial',
      href: `/${courseCode}/tutorial`,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
    },
    {
      label: 'Semester Results',
      href: `/${courseCode}/semester`,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
  ];

  const getTitle = () => {
    if (pathname.includes('/students')) return 'Students';
    if (pathname.includes('/attendance')) return 'Mark Attendance';
    if (pathname.includes('/tutorial')) return 'Tutorial Management';
    if (pathname.includes('/semester')) return 'Semester Results';
    return courseCode;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar
        title="Teacher Panel"
        subtitle={`${courseCode} ${user?.session ? `(${user.session})` : ''}`}
        items={sidebarItems}
      />
      <div className="lg:ml-64">
        <Topbar title={getTitle()} />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
