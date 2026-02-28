'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Programs', href: '#programs' },
  { label: 'Faculty', href: '#faculty' },
  { label: 'News', href: '#news' },
  { label: 'Contact', href: '#contact' },
];

const loginOptions = [
  { label: 'Student Login', href: '/login?tab=student' },
  { label: 'Teacher Login', href: '/login?tab=teacher' },
  { label: 'Admin Login', href: '/login?tab=admin' },
  { label: 'CR Login', href: '/login?tab=cr' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loginDropdownOpen, setLoginDropdownOpen] = useState(false);
  const [mobileLoginOpen, setMobileLoginOpen] = useState(false);
  const loginRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (loginRef.current && !loginRef.current.contains(e.target as Node)) {
        setLoginDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const handleNavClick = () => {
    setMobileOpen(false);
    setMobileLoginOpen(false);
  };

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-oxford-blue/95 backdrop-blur-md shadow-lg'
          : 'bg-oxford-blue'
      )}
    >
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between lg:h-18">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 shrink-0"
            aria-label="IU CSE Home"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-oxford-gold font-serif text-lg font-bold text-oxford-blue-dark">
              IU
            </div>
            <div className="hidden sm:block">
              <p className="font-serif text-lg font-bold leading-tight text-white">
                IU CSE
              </p>
              <p className="text-xs leading-tight text-oxford-gold">
                Islamic University
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:items-center lg:gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="rounded-md px-3 py-2 text-sm font-medium text-white/85 transition-colors hover:bg-white/10 hover:text-white"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden lg:flex lg:items-center lg:gap-3">
            {/* Login Dropdown */}
            <div ref={loginRef} className="relative">
              <button
                onClick={() => setLoginDropdownOpen(!loginDropdownOpen)}
                className="inline-flex items-center gap-1.5 rounded-md border border-white/25 px-4 py-2 text-sm font-medium text-white transition-colors hover:border-white/50 hover:bg-white/10"
                aria-expanded={loginDropdownOpen}
                aria-haspopup="true"
              >
                {/* User icon */}
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                  />
                </svg>
                Login
                {/* Chevron */}
                <svg
                  className={cn(
                    'h-3.5 w-3.5 transition-transform duration-200',
                    loginDropdownOpen && 'rotate-180'
                  )}
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m19.5 8.25-7.5 7.5-7.5-7.5"
                  />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {loginDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-lg border border-gray-100 bg-white py-1 shadow-xl">
                  {loginOptions.map((option) => (
                    <Link
                      key={option.href}
                      href={option.href}
                      className="block px-4 py-2.5 text-sm text-gray-700 transition-colors hover:bg-oxford-cream hover:text-oxford-blue"
                      onClick={() => setLoginDropdownOpen(false)}
                    >
                      {option.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Sign Up */}
            <Link
              href="/register"
              className="rounded-md bg-oxford-gold px-4 py-2 text-sm font-semibold text-oxford-blue-dark transition-colors hover:bg-oxford-gold/90"
            >
              Sign Up
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <button
            className="inline-flex items-center justify-center rounded-md p-2 text-white lg:hidden hover:bg-white/10"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? (
              /* X icon */
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18 18 6M6 6l12 12"
                />
              </svg>
            ) : (
              /* Hamburger icon */
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 top-16 z-40 bg-black/40 lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Menu Panel */}
      <div
        className={cn(
          'fixed top-16 right-0 z-50 h-[calc(100dvh-4rem)] w-72 transform bg-oxford-blue shadow-2xl transition-transform duration-300 ease-in-out lg:hidden',
          mobileOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <div className="flex h-full flex-col overflow-y-auto px-4 py-6">
          {/* Mobile Nav Links */}
          <div className="space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="block rounded-md px-3 py-3 text-base font-medium text-white/85 transition-colors hover:bg-white/10 hover:text-white"
                onClick={handleNavClick}
              >
                {link.label}
              </a>
            ))}
          </div>

          <hr className="my-4 border-white/15" />

          {/* Mobile Login Options */}
          <div className="space-y-1">
            <button
              onClick={() => setMobileLoginOpen(!mobileLoginOpen)}
              className="flex w-full items-center justify-between rounded-md px-3 py-3 text-base font-medium text-white/85 transition-colors hover:bg-white/10 hover:text-white"
            >
              <span className="flex items-center gap-2">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                  />
                </svg>
                Login
              </span>
              <svg
                className={cn(
                  'h-4 w-4 transition-transform duration-200',
                  mobileLoginOpen && 'rotate-180'
                )}
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m19.5 8.25-7.5 7.5-7.5-7.5"
                />
              </svg>
            </button>

            {mobileLoginOpen && (
              <div className="ml-4 space-y-1 border-l-2 border-oxford-gold/30 pl-4">
                {loginOptions.map((option) => (
                  <Link
                    key={option.href}
                    href={option.href}
                    className="block rounded-md px-3 py-2.5 text-sm text-white/70 transition-colors hover:bg-white/10 hover:text-white"
                    onClick={handleNavClick}
                  >
                    {option.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Mobile Sign Up */}
          <div className="mt-auto pt-4">
            <Link
              href="/register"
              className="block w-full rounded-md bg-oxford-gold px-4 py-3 text-center text-sm font-semibold text-oxford-blue-dark transition-colors hover:bg-oxford-gold/90"
              onClick={handleNavClick}
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
