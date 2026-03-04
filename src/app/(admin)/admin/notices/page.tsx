'use client';

import { useEffect, useState, useRef } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Toast from '@/components/ui/Toast';
import Spinner from '@/components/ui/Spinner';

interface Notice {
  _id: string;
  type: 'image' | 'text' | 'card';
  title: string;
  content: string;
  imageUrl: string;
  category: string;
  date: string;
  createdAt: string;
}

const initialForm = {
  type: 'card' as 'image' | 'text' | 'card',
  title: '',
  content: '',
  image_url: '',
  category: '',
  date: new Date().toISOString().split('T')[0],
};

const typeBadge: Record<string, string> = {
  image: 'bg-blue-50 text-blue-700',
  text: 'bg-yellow-50 text-yellow-800',
  card: 'bg-green-50 text-green-700',
};

export default function NoticesPage() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);
  const [form, setForm] = useState(initialForm);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      setForm((prev) => ({ ...prev, image_url: e.target?.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const fetchNotices = async () => {
    try {
      const res = await fetch('/api/notices');
      const data = await res.json();
      setNotices(data.notices || []);
    } catch {
      console.error('Failed to fetch notices');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const openAdd = () => {
    setEditingNotice(null);
    setForm(initialForm);
    if (fileInputRef.current) fileInputRef.current.value = '';
    setShowModal(true);
  };

  const openEdit = (notice: Notice) => {
    setEditingNotice(notice);
    setForm({
      type: notice.type,
      title: notice.title,
      content: notice.content || '',
      image_url: notice.imageUrl || '',
      category: notice.category || '',
      date: notice.date,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const url = editingNotice ? `/api/notices/${editingNotice._id}` : '/api/notices';
      const method = editingNotice ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setToast({ message: editingNotice ? 'Notice updated' : 'Notice created', type: 'success' });
        setShowModal(false);
        fetchNotices();
      } else {
        setToast({ message: data.error || 'Failed to save notice', type: 'error' });
      }
    } catch {
      setToast({ message: 'Something went wrong', type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this notice?')) return;
    try {
      const res = await fetch(`/api/notices/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setToast({ message: 'Notice deleted', type: 'success' });
        fetchNotices();
      } else {
        const data = await res.json();
        setToast({ message: data.error || 'Failed to delete', type: 'error' });
      }
    } catch {
      setToast({ message: 'Something went wrong', type: 'error' });
    }
  };

  if (loading) return <Spinner className="mt-20" />;

  return (
    <div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <p className="text-sm text-gray-500">{notices.length} notice{notices.length !== 1 ? 's' : ''} published</p>
        </div>
        <Button onClick={openAdd}>+ Add Notice</Button>
      </div>

      <Card>
        {notices.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <p className="text-sm">No notices yet. Add one to display on the homepage.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[560px]">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-3 font-medium text-gray-600">Type</th>
                  <th className="text-left py-3 px-3 font-medium text-gray-600">Title</th>
                  <th className="text-left py-3 px-3 font-medium text-gray-600">Category</th>
                  <th className="text-left py-3 px-3 font-medium text-gray-600">Date</th>
                  <th className="text-center py-3 px-3 font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {notices.map((notice) => (
                  <tr key={notice._id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                    <td className="py-3 px-3">
                      <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium capitalize ${typeBadge[notice.type]}`}>
                        {notice.type}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-medium text-oxford-blue max-w-[240px] truncate">{notice.title}</td>
                    <td className="py-3 px-3 text-gray-500">{notice.category || '—'}</td>
                    <td className="py-3 px-3 whitespace-nowrap text-gray-500">{notice.date}</td>
                    <td className="py-3 px-3 text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => openEdit(notice)}
                          className="text-oxford-blue hover:text-blue-700 text-xs font-medium px-2 py-1"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(notice._id)}
                          className="text-red-500 hover:text-red-700 text-xs font-medium px-2 py-1"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Add / Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingNotice ? 'Edit Notice' : 'Add New Notice'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notice Type</label>
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value as 'image' | 'text' | 'card' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-oxford-blue"
              required
            >
              <option value="card">Card — category + title + excerpt</option>
              <option value="text">Text — plain notice/announcement</option>
              <option value="image">Image — image with caption</option>
            </select>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Notice title"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-oxford-blue"
              required
            />
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-oxford-blue"
              required
            />
          </div>

          {/* Image upload — only for image type */}
          {form.type === 'image' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Image</label>
              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleImageFile(file);
                }}
              />
              {/* Preview or upload area */}
              {form.image_url ? (
                <div className="relative group">
                  <img
                    src={form.image_url}
                    alt="Preview"
                    className="w-full max-h-48 object-cover rounded-lg border border-gray-200"
                  />
                  <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 rounded-lg">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-1.5 bg-white text-oxford-blue text-xs font-medium rounded-lg hover:bg-gray-100"
                    >
                      Change
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setForm((prev) => ({ ...prev, image_url: '' }));
                        if (fileInputRef.current) fileInputRef.current.value = '';
                      }}
                      className="px-3 py-1.5 bg-white text-red-600 text-xs font-medium rounded-lg hover:bg-gray-100"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-300 rounded-lg py-8 text-gray-400 hover:border-oxford-blue hover:text-oxford-blue transition-colors cursor-pointer"
                >
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm font-medium">Click to upload image</span>
                  <span className="text-xs">PNG, JPG, GIF, WebP</span>
                </button>
              )}
            </div>
          )}

          {/* Category — only for card type */}
          {form.type === 'card' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <input
                type="text"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                placeholder="e.g. Admission, Seminar, Achievement"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-oxford-blue"
              />
            </div>
          )}

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {form.type === 'image' ? 'Caption (optional)' : form.type === 'text' ? 'Notice Text' : 'Excerpt / Description'}
            </label>
            <textarea
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              placeholder={form.type === 'text' ? 'Write the full notice text here...' : 'Short description...'}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-oxford-blue resize-none"
              required={form.type === 'text'}
            />
          </div>

          <div className="flex gap-3 pt-1">
            <Button type="submit" className="flex-1" loading={submitting}>
              {editingNotice ? 'Update Notice' : 'Publish Notice'}
            </Button>
            <Button type="button" variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
