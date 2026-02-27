'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Toast from '@/components/ui/Toast';

export default function TeacherLoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [form, setForm] = useState({ session: '', courseCode: '', password: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login/teacher', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setToast({ message: data.error || 'Login failed', type: 'error' });
        return;
      }

      setToast({ message: 'Login successful!', type: 'success' });
      setTimeout(() => router.push(`/${form.courseCode.toUpperCase()}`), 500);
    } catch {
      setToast({ message: 'Something went wrong', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-oxford-cream py-12 px-4">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-oxford-blue font-serif">Teacher Panel</h1>
            <p className="text-gray-500 text-sm mt-2">
              Login with your course credentials
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              id="session"
              label="Session"
              placeholder="e.g., 2022-23"
              value={form.session}
              onChange={(e) => setForm({ ...form, session: e.target.value })}
              required
            />
            <Input
              id="courseCode"
              label="Course Code"
              placeholder="e.g., CSE1101"
              value={form.courseCode}
              onChange={(e) => setForm({ ...form, courseCode: e.target.value })}
              required
            />
            <Input
              id="password"
              type="password"
              label="Password"
              placeholder="Enter course password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
            <Button type="submit" className="w-full" size="lg" loading={loading}>
              Sign In
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
