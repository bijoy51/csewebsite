'use client';

import { useEffect, useState, useRef } from 'react';
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

// Compress and resize image to max 200x200, return base64 data URL
function compressImage(file: File, maxSize: number = 200): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let w = img.width;
        let h = img.height;
        if (w > h) {
          if (w > maxSize) { h = (h * maxSize) / w; w = maxSize; }
        } else {
          if (h > maxSize) { w = (w * maxSize) / h; h = maxSize; }
        }
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (!ctx) { reject(new Error('Canvas not supported')); return; }
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL('image/jpeg', 0.8));
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function ProfilePage() {
  const { user, loading: authLoading, refreshUser } = useAuth();
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [editForm, setEditForm] = useState({ phone: '', bloodGroup: '', address: '' });
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user?.id) return;

    if (!file.type.startsWith('image/')) {
      setToast({ message: 'Please select an image file', type: 'error' });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setToast({ message: 'Image must be less than 5MB', type: 'error' });
      return;
    }

    setUploadingPhoto(true);
    try {
      const base64 = await compressImage(file);
      const res = await fetch(`/api/students/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profilePhoto: base64 }),
      });

      if (res.ok) {
        const data = await res.json();
        setProfile(data.student);
        await refreshUser();
        setToast({ message: 'Photo updated successfully', type: 'success' });
      } else {
        const data = await res.json();
        setToast({ message: data.error || 'Failed to upload photo', type: 'error' });
      }
    } catch {
      setToast({ message: 'Failed to upload photo', type: 'error' });
    } finally {
      setUploadingPhoto(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
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
          <div className="relative group">
            {profile.profilePhoto && profile.profilePhoto.startsWith('data:') ? (
              <img
                src={profile.profilePhoto}
                alt={profile.name}
                className="w-16 h-16 rounded-full object-cover"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-oxford-blue text-white flex items-center justify-center text-2xl font-bold">
                {profile.name.charAt(0).toUpperCase()}
              </div>
            )}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingPhoto}
              className="absolute inset-0 rounded-full bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
            />
            {uploadingPhoto && (
              <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              </div>
            )}
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
