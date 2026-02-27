'use client';

import { useAuth } from '@/context/AuthContext';
import Button from '@/components/ui/Button';

interface TopbarProps {
  title: string;
}

export default function Topbar({ title }: TopbarProps) {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      <div className="lg:ml-0 ml-10">
        <h1 className="text-xl font-semibold text-oxford-blue">{title}</h1>
      </div>
      <div className="flex items-center gap-4">
        {user && (
          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium text-gray-900">{user.name}</p>
              <p className="text-xs text-gray-500 capitalize">{user.role}</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-oxford-blue text-white flex items-center justify-center text-sm font-medium">
              {user.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
          </div>
        )}
        <Button variant="ghost" size="sm" onClick={logout}>
          Logout
        </Button>
      </div>
    </header>
  );
}
