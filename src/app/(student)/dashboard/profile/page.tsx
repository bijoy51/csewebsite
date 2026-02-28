'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Select from '@/components/ui/Select';
import Toast from '@/components/ui/Toast';
import Spinner from '@/components/ui/Spinner';
import { BLOOD_GROUPS } from '@/lib/constants';

interface StudentProfile {
  _id: string;
  name: string;
  roll: string;
  registrationNo: string;
  session: string;
  email: string;
  profilePhoto: string;
  phone: string;
  bloodGroup: string;
  address: string;
}

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [editForm, setEditForm] = useState({ phone: '', bloodGroup: '', address: '' });

  useEffect(() => {
    if (user?.id) {
      fetch(`/api/students/${user.id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.student) {
            setProfile(data.student);
            setEditForm({
              phone: data.student.phone || '',
              bloodGroup: data.student.bloodGroup || '',
              address: data.student.address || '',
            });
          }
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    } else if (!authLoading) {
      setLoading(false);
    }
  }, [user, authLoading]);

  const handleSave = async () => {
    if (!user?.id) return;
    setSaving(true);

    try {
      const res = await fetch(`/api/students/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      });

      if (res.ok) {
        const data = await res.json();
        setProfile(data.student);
        setToast({ message: 'Profile updated successfully', type: 'success' });
      } else {
        const data = await res.json();
        setToast({ message: data.error || 'Failed to update', type: 'error' });
      }
    } catch {
      setToast({ message: 'Something went wrong', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Spinner className="mt-20" />;
  if (!profile) return <p className="text-center text-gray-500 mt-10">Profile not found.</p>;

  return (
    <div className="max-w-2xl mx-auto">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Profile Header */}
      <Card className="mb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-oxford-blue text-white flex items-center justify-center text-2xl font-bold">
            {profile.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-bold text-oxford-blue">{profile.name}</h2>
            <p className="text-sm text-gray-500">{profile.email}</p>
            <p className="text-xs text-oxford-gold font-medium mt-1">Session: {profile.session}</p>
          </div>
        </div>
      </Card>

      {/* Read-only Info */}
      <Card className="mb-6">
        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">
          Academic Information
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gray-500">Full Name</label>
            <p className="text-sm font-medium mt-1">{profile.name}</p>
          </div>
          <div>
            <label className="block text-xs text-gray-500">Roll Number</label>
            <p className="text-sm font-medium mt-1">{profile.roll}</p>
          </div>
          <div>
            <label className="block text-xs text-gray-500">Registration Number</label>
            <p className="text-sm font-medium mt-1">{profile.registrationNo}</p>
          </div>
          <div>
            <label className="block text-xs text-gray-500">Session</label>
            <p className="text-sm font-medium mt-1">{profile.session}</p>
          </div>
          <div>
            <label className="block text-xs text-gray-500">Email</label>
            <p className="text-sm font-medium mt-1">{profile.email}</p>
          </div>
        </div>
      </Card>

      {/* Editable Info */}
      <Card>
        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">
          Personal Information (Editable)
        </h3>
        <div className="space-y-4">
          <Input
            id="phone"
            label="Phone Number"
            placeholder="Enter your phone number"
            value={editForm.phone}
            onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
          />
          <Select
            id="bloodGroup"
            label="Blood Group"
            value={editForm.bloodGroup}
            onChange={(e) => setEditForm({ ...editForm, bloodGroup: e.target.value })}
            placeholder="Select blood group"
            options={BLOOD_GROUPS.map((bg) => ({ value: bg, label: bg }))}
          />
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
              Address
            </label>
            <textarea
              id="address"
              rows={3}
              placeholder="Enter your address"
              value={editForm.address}
              onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-oxford-blue focus:border-transparent"
            />
          </div>
          <Button onClick={handleSave} loading={saving}>
            Save Changes
          </Button>
        </div>
      </Card>
    </div>
  );
}
