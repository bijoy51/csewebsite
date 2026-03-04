'use client';

import { useAuth } from '@/context/AuthContext';
import Button from '@/components/ui/Button';

interface TopbarProps {
  title: string;
  onToggleSidebar?: () => void;
  sidebarOpen?: boolean;
}

export default function Topbar({ title, onToggleSidebar, sidebarOpen }: TopbarProps) {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-200 px-4 py-3 sm:px-6 sm:py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 -ml-2 text-oxford-blue rounded-lg hover:bg-gray-100 min-w-[40px] min-h-[40px] flex items-center justify-center"
            aria-label={sidebarOpen ? 'Close menu' : 'Open menu'}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {sidebarOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        )}
        <h1 className="text-lg sm:text-xl font-semibold text-oxford-blue">{title}</h1>
      </div>
      <div className="flex items-center gap-4">
        {user && (
          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium text-gray-900">{user.name}</p>
              <p className="text-xs text-gray-500 capitalize">{user.role}</p>
            </div>
            {user.profilePhoto && user.profilePhoto.startsWith('data:') ? (
              <img
                src={user.profilePhoto}
                alt={user.name}
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-oxford-blue text-white flex items-center justify-center text-sm font-medium">
                {user.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
            )}
          </div>
        )}
        <Button variant="ghost" size="sm" onClick={logout}>
          Logout
        </Button>
      </div>
    </header>
  );
}
