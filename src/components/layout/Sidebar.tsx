'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useState, useCallback } from 'react';

export interface SidebarItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

interface SidebarProps {
  title: string;
  subtitle?: string;
  items: SidebarItem[];
  children?: React.ReactNode;
  mobileOpen: boolean;
  onToggle: () => void;
}

export default function Sidebar({ title, subtitle, items, children, mobileOpen, onToggle }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 h-full w-64 bg-oxford-blue text-white z-40 transition-transform duration-300',
          'lg:translate-x-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="p-6 border-b border-oxford-blue-light flex items-start justify-between">
          <div>
            <h2 className="text-lg font-bold font-serif">{title}</h2>
            {subtitle && <p className="text-sm text-oxford-gold mt-1">{subtitle}</p>}
          </div>
          <button
            onClick={onToggle}
            className="lg:hidden p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 -mr-1.5 -mt-1.5"
            aria-label="Close menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {children && (
          <div className="px-3 pt-3 border-b border-oxford-blue-light pb-3">
            {children}
          </div>
        )}

        <nav className="mt-4 px-3">
          {items.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => mobileOpen && onToggle()}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 mb-1',
                  isActive
                    ? 'bg-white/15 text-oxford-gold'
                    : 'text-white/80 hover:bg-white/10 hover:text-white'
                )}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
