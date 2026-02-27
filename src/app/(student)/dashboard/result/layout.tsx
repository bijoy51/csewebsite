'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const resultTabs = [
  { label: 'Tutorial', href: '/dashboard/result/tutorial' },
  { label: 'Semester', href: '/dashboard/result/semester' },
  { label: 'Yearly', href: '/dashboard/result/yearly' },
  { label: 'CGPA', href: '/dashboard/result/cgpa' },
];

export default function ResultLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div>
      <div className="flex gap-1 bg-white rounded-lg p-1 shadow-sm border border-gray-100 mb-6">
        {resultTabs.map((tab) => (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              'flex-1 text-center py-2 px-4 text-sm font-medium rounded-md transition-all duration-200',
              pathname === tab.href
                ? 'bg-oxford-blue text-white shadow-sm'
                : 'text-gray-600 hover:text-oxford-blue hover:bg-gray-50'
            )}
          >
            {tab.label}
          </Link>
        ))}
      </div>
      {children}
    </div>
  );
}
