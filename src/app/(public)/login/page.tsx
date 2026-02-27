'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Toast from '@/components/ui/Toast';
import Link from 'next/link';

type LoginTab = 'student' | 'teacher' | 'admin' | 'cr';

export default function LoginPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<LoginTab>('student');
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
                <Input
                  id="teacher-session"
                  label="Session"
                  placeholder="e.g., 2022-23"
                  value={teacherForm.session}
                  onChange={(e) => setTeacherForm({ ...teacherForm, session: e.target.value })}
                  required
                />
                <Input
                  id="teacher-course"
                  label="Course Code"
                  placeholder="e.g., CSE1101"
                  value={teacherForm.courseCode}
                  onChange={(e) => setTeacherForm({ ...teacherForm, courseCode: e.target.value })}
                  required
                />
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
                <Input
                  id="cr-session"
                  label="Session"
                  placeholder="e.g., 2022-23"
                  value={crForm.session}
                  onChange={(e) => setCrForm({ ...crForm, session: e.target.value })}
                  required
                />
                <Input
                  id="cr-roll"
                  label="Roll Number"
                  placeholder="e.g., 2201"
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
