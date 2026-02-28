'use client';

import { Suspense, useState, useEffect, useRef, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Toast from '@/components/ui/Toast';
import Link from 'next/link';

type LoginTab = 'student' | 'teacher' | 'admin' | 'cr';

const validTabs: LoginTab[] = ['student', 'teacher', 'admin', 'cr'];

interface CurriculumCourse {
  courseCode: string;
  courseTitle: string;
  credit: number;
  year: number;
  semester: number;
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refreshUser } = useAuth();
  const [activeTab, setActiveTab] = useState<LoginTab>('student');

  useEffect(() => {
    const tab = searchParams.get('tab') as LoginTab;
    if (tab && validTabs.includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Student form
  const [studentForm, setStudentForm] = useState({ email: '', password: '' });
  // Teacher form
  const [teacherForm, setTeacherForm] = useState({ session: '', courseCode: '', password: '' });
  // Admin form
  const [adminForm, setAdminForm] = useState({ password: '' });
  // CR form
  const [crForm, setCrForm] = useState({ session: '', roll: '', password: '' });

  // Session & curriculum autocomplete state
  const [sessions, setSessions] = useState<string[]>([]);
  const [allCurriculum, setAllCurriculum] = useState<CurriculumCourse[]>([]);
  const [showSessionDropdown, setShowSessionDropdown] = useState(false);
  const [sessionSuggestions, setSessionSuggestions] = useState<string[]>([]);
  const [showCourseDropdown, setShowCourseDropdown] = useState(false);
  const [curriculumSuggestions, setCurriculumSuggestions] = useState<CurriculumCourse[]>([]);
  // CR session dropdown
  const [showCrSessionDropdown, setShowCrSessionDropdown] = useState(false);
  const [crSessionSuggestions, setCrSessionSuggestions] = useState<string[]>([]);

  const sessionDropdownRef = useRef<HTMLDivElement>(null);
  const courseDropdownRef = useRef<HTMLDivElement>(null);
  const crSessionDropdownRef = useRef<HTMLDivElement>(null);

  // Fetch sessions and curriculum on mount
  useEffect(() => {
    fetch('/api/sessions')
      .then((r) => r.json())
      .then((data) => setSessions(data.sessions || []))
      .catch(console.error);

    fetch('/api/curriculum')
      .then((r) => r.json())
      .then((data) => setAllCurriculum(data.courses || []))
      .catch(console.error);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (sessionDropdownRef.current && !sessionDropdownRef.current.contains(e.target as Node)) {
        setShowSessionDropdown(false);
      }
      if (courseDropdownRef.current && !courseDropdownRef.current.contains(e.target as Node)) {
        setShowCourseDropdown(false);
      }
      if (crSessionDropdownRef.current && !crSessionDropdownRef.current.contains(e.target as Node)) {
        setShowCrSessionDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Teacher session autocomplete
  const handleTeacherSessionChange = useCallback((value: string) => {
    setTeacherForm((prev) => ({ ...prev, session: value }));
    const filtered = value.trim()
      ? sessions.filter((s) => s.toLowerCase().includes(value.toLowerCase()))
      : sessions;
    setSessionSuggestions(filtered);
    setShowSessionDropdown(filtered.length > 0);
  }, [sessions]);

  // Teacher course code autocomplete
  const handleCourseCodeChange = useCallback((value: string) => {
    const upper = value.toUpperCase();
    setTeacherForm((prev) => ({ ...prev, courseCode: upper }));
    if (upper.trim()) {
      const filtered = allCurriculum.filter((c) => c.courseCode.includes(upper));
      setCurriculumSuggestions(filtered.slice(0, 15));
      setShowCourseDropdown(filtered.length > 0);
    } else {
      setShowCourseDropdown(false);
    }
  }, [allCurriculum]);

  // CR session autocomplete
  const handleCrSessionChange = useCallback((value: string) => {
    setCrForm((prev) => ({ ...prev, session: value }));
    const filtered = value.trim()
      ? sessions.filter((s) => s.toLowerCase().includes(value.toLowerCase()))
      : sessions;
    setCrSessionSuggestions(filtered);
    setShowCrSessionDropdown(filtered.length > 0);
  }, [sessions]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let url = '';
      let body = {};
      let redirectTo = '';

      switch (activeTab) {
        case 'student':
          url = '/api/auth/login/student';
          body = studentForm;
          redirectTo = '/dashboard';
          break;
        case 'teacher':
          url = '/api/auth/login/teacher';
          body = teacherForm;
          redirectTo = `/${teacherForm.courseCode.toUpperCase()}`;
          break;
        case 'admin':
          url = '/api/auth/login/admin';
          body = adminForm;
          redirectTo = '/admin/dashboard';
          break;
        case 'cr':
          url = '/api/auth/login/cr';
          body = crForm;
          redirectTo = '/cr/dashboard';
          break;
      }

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        setToast({ message: data.error || 'Login failed', type: 'error' });
        return;
      }

      setToast({ message: 'Login successful!', type: 'success' });
      await refreshUser();
      setTimeout(() => router.push(redirectTo), 500);
    } catch {
      setToast({ message: 'Something went wrong', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const tabs: { key: LoginTab; label: string }[] = [
    { key: 'student', label: 'Student' },
    { key: 'teacher', label: 'Teacher' },
    { key: 'admin', label: 'Admin' },
    { key: 'cr', label: 'CR' },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-oxford-cream py-12 px-4">
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-oxford-blue font-serif">Sign In</h1>
            <p className="text-gray-500 text-sm mt-2">
              Department of Computer Science & Engineering
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex rounded-lg bg-gray-100 p-1 mb-6">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                  activeTab === tab.key
                    ? 'bg-oxford-blue text-white shadow-sm'
                    : 'text-gray-600 hover:text-oxford-blue'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Student Login */}
            {activeTab === 'student' && (
              <>
                <Input
                  id="student-email"
                  label="Email Address"
                  type="email"
                  placeholder="your.email@example.com"
                  value={studentForm.email}
                  onChange={(e) => setStudentForm({ ...studentForm, email: e.target.value })}
                  required
                />
                <Input
                  id="student-password"
                  label="Password"
                  type="password"
                  placeholder="Enter your password"
                  value={studentForm.password}
                  onChange={(e) => setStudentForm({ ...studentForm, password: e.target.value })}
                  required
                />
              </>
            )}

            {/* Teacher Login */}
            {activeTab === 'teacher' && (
              <>
                {/* Session with autocomplete */}
                <div ref={sessionDropdownRef} className="relative">
                  <Input
                    id="teacher-session"
                    label="Session"
                    placeholder="e.g., 2023-2024"
                    value={teacherForm.session}
                    onChange={(e) => handleTeacherSessionChange(e.target.value)}
                    onFocus={() => {
                      const filtered = teacherForm.session.trim()
                        ? sessions.filter((s) => s.toLowerCase().includes(teacherForm.session.toLowerCase()))
                        : sessions;
                      setSessionSuggestions(filtered);
                      setShowSessionDropdown(filtered.length > 0);
                    }}
                    autoComplete="off"
                    required
                  />
                  {showSessionDropdown && sessionSuggestions.length > 0 && (
                    <div className="absolute z-50 left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-40 overflow-y-auto">
                      {sessionSuggestions.map((s) => (
                        <button
                          key={s}
                          type="button"
                          className="w-full text-left px-3 py-2 text-sm hover:bg-oxford-blue/5 transition-colors"
                          onClick={() => {
                            setTeacherForm((prev) => ({ ...prev, session: s }));
                            setShowSessionDropdown(false);
                          }}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Course Code with autocomplete */}
                <div ref={courseDropdownRef} className="relative">
                  <Input
                    id="teacher-course"
                    label="Course Code"
                    placeholder="e.g., CSE 1101"
                    value={teacherForm.courseCode}
                    onChange={(e) => handleCourseCodeChange(e.target.value)}
                    onFocus={() => {
                      if (teacherForm.courseCode.trim()) {
                        const filtered = allCurriculum.filter((c) =>
                          c.courseCode.includes(teacherForm.courseCode.toUpperCase())
                        );
                        setCurriculumSuggestions(filtered.slice(0, 15));
                        setShowCourseDropdown(filtered.length > 0);
                      }
                    }}
                    autoComplete="off"
                    className="uppercase"
                    required
                  />
                  {showCourseDropdown && curriculumSuggestions.length > 0 && (
                    <div className="absolute z-50 left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-52 overflow-y-auto">
                      {curriculumSuggestions.map((c) => (
                        <button
                          key={c.courseCode}
                          type="button"
                          className="w-full text-left px-3 py-2 text-sm hover:bg-oxford-blue/5 transition-colors border-b border-gray-50 last:border-0"
                          onClick={() => {
                            setTeacherForm((prev) => ({ ...prev, courseCode: c.courseCode }));
                            setShowCourseDropdown(false);
                          }}
                        >
                          <span className="font-medium text-oxford-blue">{c.courseCode}</span>
                          <span className="text-gray-500 ml-2">{c.courseTitle}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <Input
                  id="teacher-password"
                  label="Password"
                  type="password"
                  placeholder="Enter course password"
                  value={teacherForm.password}
                  onChange={(e) => setTeacherForm({ ...teacherForm, password: e.target.value })}
                  required
                />
              </>
            )}

            {/* Admin Login */}
            {activeTab === 'admin' && (
              <>
                <Input
                  id="admin-password"
                  label="Admin Password"
                  type="password"
                  placeholder="Enter admin password"
                  value={adminForm.password}
                  onChange={(e) => setAdminForm({ password: e.target.value })}
                  required
                />
              </>
            )}

            {/* CR Login */}
            {activeTab === 'cr' && (
              <>
                {/* CR Session with autocomplete */}
                <div ref={crSessionDropdownRef} className="relative">
                  <Input
                    id="cr-session"
                    label="Session"
                    placeholder="e.g., 2023-2024"
                    value={crForm.session}
                    onChange={(e) => handleCrSessionChange(e.target.value)}
                    onFocus={() => {
                      const filtered = crForm.session.trim()
                        ? sessions.filter((s) => s.toLowerCase().includes(crForm.session.toLowerCase()))
                        : sessions;
                      setCrSessionSuggestions(filtered);
                      setShowCrSessionDropdown(filtered.length > 0);
                    }}
                    autoComplete="off"
                    required
                  />
                  {showCrSessionDropdown && crSessionSuggestions.length > 0 && (
                    <div className="absolute z-50 left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-40 overflow-y-auto">
                      {crSessionSuggestions.map((s) => (
                        <button
                          key={s}
                          type="button"
                          className="w-full text-left px-3 py-2 text-sm hover:bg-oxford-blue/5 transition-colors"
                          onClick={() => {
                            setCrForm((prev) => ({ ...prev, session: s }));
                            setShowCrSessionDropdown(false);
                          }}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <Input
                  id="cr-roll"
                  label="Roll Number"
                  placeholder="e.g., 2314013"
                  value={crForm.roll}
                  onChange={(e) => setCrForm({ ...crForm, roll: e.target.value })}
                  required
                />
                <Input
                  id="cr-password"
                  label="Password"
                  type="password"
                  placeholder="Enter your password"
                  value={crForm.password}
                  onChange={(e) => setCrForm({ ...crForm, password: e.target.value })}
                  required
                />
              </>
            )}

            <Button type="submit" className="w-full" size="lg" loading={loading}>
              Sign In
            </Button>
          </form>

          {activeTab === 'student' && (
            <p className="text-center text-sm text-gray-500 mt-6">
              Don&apos;t have an account?{' '}
              <Link href="/register" className="text-oxford-blue font-medium hover:underline">
                Register here
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
