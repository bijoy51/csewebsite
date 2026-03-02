'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Sidebar, { SidebarItem } from '@/components/layout/Sidebar';
import Topbar from '@/components/layout/Topbar';
import { useAuth } from '@/context/AuthContext';

interface TeacherCourse {
  _id: string;
  courseCode: string;
  courseTitle: string;
  session: string;
}

export default function TeacherLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();
  const [teacherCourses, setTeacherCourses] = useState<TeacherCourse[]>([]);

  // Teacher login page has no sidebar
  if (pathname === '/teachers') {
    return <>{children}</>;
  }

  // Extract courseCode from URL (e.g., /CSE1101/attendance → CSE1101)
  const segments = pathname.split('/').filter(Boolean);
  const courseCode = decodeURIComponent(segments[0] || '');

  // Get current sub-page (e.g., "attendance", "students", "schedule")
  const subPage = segments[1] || 'students';

  // Fetch all courses for this teacher
  useEffect(() => {
    fetch('/api/auth/me/teacher-courses')
      .then((r) => r.json())
      .then((data) => {
        if (data.courses) setTeacherCourses(data.courses);
      })
      .catch(console.error);
  }, []);

  const handleCourseSwitch = (value: string) => {
    const [newCourseCode] = value.split('|');
    if (newCourseCode && newCourseCode !== courseCode) {
      router.push(`/${encodeURIComponent(newCourseCode)}/${subPage}`);
    }
  };

  const currentValue = `${courseCode}|${user?.session || ''}`;

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
    {
      label: 'Class Schedule',
      href: `/${courseCode}/schedule`,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
  ];

  const getTitle = () => {
    if (pathname.includes('/students')) return 'Students';
    if (pathname.includes('/attendance')) return 'Mark Attendance';
    if (pathname.includes('/tutorial')) return 'Tutorial Management';
    if (pathname.includes('/semester')) return 'Semester Results';
    if (pathname.includes('/schedule')) return 'Class Schedule';
    return courseCode;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar
        title="Teacher Panel"
        subtitle={user?.name || ''}
        items={sidebarItems}
      >
        {teacherCourses.length > 1 ? (
          <div>
            <label className="block text-xs font-medium text-white/60 mb-1.5">Switch Course</label>
            <select
              value={currentValue}
              onChange={(e) => handleCourseSwitch(e.target.value)}
              className="w-full rounded-lg bg-white/10 border border-white/20 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-oxford-gold/50 cursor-pointer"
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='white'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.5rem center', backgroundSize: '1.25rem', appearance: 'none', WebkitAppearance: 'none' }}
            >
              {teacherCourses.map((c) => (
                <option
                  key={c._id}
                  value={`${c.courseCode}|${c.session}`}
                  className="text-gray-900 bg-white"
                >
                  {c.courseCode} ({c.session})
                </option>
              ))}
            </select>
          </div>
        ) : (
          <p className="text-xs text-oxford-gold">
            {courseCode} {user?.session ? `(${user.session})` : ''}
          </p>
        )}
      </Sidebar>
      <div className="lg:ml-64">
        <Topbar title={getTitle()} />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
