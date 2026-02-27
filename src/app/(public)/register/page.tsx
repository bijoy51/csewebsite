'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Toast from '@/components/ui/Toast';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [form, setForm] = useState({
    name: '',
    roll: '',
    registrationNo: '',
    session: '',
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.details?.fieldErrors) {
          const fieldErrors: Record<string, string> = {};
          for (const [key, msgs] of Object.entries(data.details.fieldErrors)) {
            fieldErrors[key] = (msgs as string[])[0];
          }
          setErrors(fieldErrors);
        } else {
          setToast({ message: data.error || 'Registration failed', type: 'error' });
        }
        return;
      }

      setToast({ message: 'Registration successful!', type: 'success' });
      setTimeout(() => router.push('/dashboard'), 1000);
    } catch {
      setToast({ message: 'Something went wrong', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-oxford-cream py-12 px-4">
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-oxford-blue font-serif">Student Registration</h1>
            <p className="text-gray-500 text-sm mt-2">
              Department of Computer Science & Engineering
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              id="name"
              name="name"
              label="Full Name"
              placeholder="Enter your full name"
              value={form.name}
              onChange={handleChange}
              error={errors.name}
              required
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                id="roll"
                name="roll"
                label="Roll Number"
                placeholder="e.g., 2201"
                value={form.roll}
                onChange={handleChange}
                error={errors.roll}
                required
              />
              <Input
                id="registrationNo"
                name="registrationNo"
                label="Registration No"
                placeholder="e.g., 2022331001"
                value={form.registrationNo}
                onChange={handleChange}
                error={errors.registrationNo}
                required
              />
            </div>
            <Input
              id="session"
              name="session"
              label="Session"
              placeholder="e.g., 2022-23"
              value={form.session}
              onChange={handleChange}
              error={errors.session}
              required
            />
            <Input
              id="email"
              name="email"
              type="email"
              label="Email Address"
              placeholder="your.email@example.com"
              value={form.email}
              onChange={handleChange}
              error={errors.email}
              required
            />
            <Input
              id="password"
              name="password"
              type="password"
              label="Password"
              placeholder="Minimum 6 characters"
              value={form.password}
              onChange={handleChange}
              error={errors.password}
              required
            />

            <Button type="submit" className="w-full" size="lg" loading={loading}>
              Create Account
            </Button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-oxford-blue font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
