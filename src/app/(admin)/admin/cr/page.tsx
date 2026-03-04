'use client';

import { useEffect, useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import Spinner from '@/components/ui/Spinner';
import Toast from '@/components/ui/Toast';

interface CR {
  _id: string;
  session: string;
  name: string;
  roll: string;
}

export default function AdminCRPage() {
  const [crs, setCrs] = useState<CR[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [form, setForm] = useState({ session: '', name: '', roll: '', password: '' });

  const fetchCRs = async () => {
    try {
      const res = await fetch('/api/cr');
      const data = await res.json();
      setCrs(data.crs || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCRs();
  }, []);

  const handleAddCR = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch('/api/cr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        setToast({ message: 'CR added successfully', type: 'success' });
        setShowModal(false);
        setForm({ session: '', name: '', roll: '', password: '' });
        fetchCRs();
      } else {
        setToast({ message: data.error || 'Failed to add CR', type: 'error' });
      }
    } catch {
      setToast({ message: 'Something went wrong', type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (crId: string) => {
    if (!confirm('Delete this CR?')) return;

    try {
      const res = await fetch(`/api/cr/${crId}`, { method: 'DELETE' });

      if (res.ok) {
        setToast({ message: 'CR deleted', type: 'success' });
        fetchCRs();
      } else {
        const data = await res.json();
        setToast({ message: data.error || 'Failed to delete', type: 'error' });
      }
    } catch {
      setToast({ message: 'Something went wrong', type: 'error' });
    }
  };

  if (loading) return <Spinner className="mt-20" />;

  // Group by session
  const grouped: Record<string, CR[]> = {};
  crs.forEach((cr) => {
    if (!grouped[cr.session]) grouped[cr.session] = [];
    grouped[cr.session].push(cr);
  });

  return (
    <div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
        <p className="text-sm text-gray-500">Total CRs: {crs.length}</p>
        <Button onClick={() => setShowModal(true)}>Add CR</Button>
      </div>

      {crs.length === 0 ? (
        <Card>
          <p className="text-center text-gray-500 text-sm py-8">No CRs added yet.</p>
        </Card>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-2 sm:px-4 font-medium text-gray-600">Session</th>
                  <th className="text-left py-3 px-2 sm:px-4 font-medium text-gray-600">Name</th>
                  <th className="text-left py-3 px-2 sm:px-4 font-medium text-gray-600">Roll</th>
                  <th className="text-center py-3 px-2 sm:px-4 font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(grouped).map(([session, sessionCrs]) =>
                  sessionCrs.map((cr, idx) => (
                    <tr key={cr._id} className="border-b border-gray-100 hover:bg-gray-50">
                      {idx === 0 && (
                        <td
                          className="py-3 px-2 sm:px-4 font-medium text-oxford-blue"
                          rowSpan={sessionCrs.length}
                        >
                          {session}
                        </td>
                      )}
                      <td className="py-3 px-2 sm:px-4">{cr.name}</td>
                      <td className="py-3 px-2 sm:px-4">{cr.roll}</td>
                      <td className="py-3 px-2 sm:px-4 text-center">
                        <Button variant="danger" size="sm" onClick={() => handleDelete(cr._id)}>
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Add CR Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add New CR">
        <form onSubmit={handleAddCR} className="space-y-4">
          <Input
            id="cr-session"
            label="Session"
            placeholder="e.g., 2022-23"
            value={form.session}
            onChange={(e) => setForm({ ...form, session: e.target.value })}
            required
          />
          <Input
            id="cr-name"
            label="Name"
            placeholder="CR's full name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <Input
            id="cr-roll"
            label="Roll Number"
            placeholder="e.g., 2201"
            value={form.roll}
            onChange={(e) => setForm({ ...form, roll: e.target.value })}
            required
          />
          <Input
            id="cr-password"
            type="password"
            label="Password"
            placeholder="Password for CR login"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
          <Button type="submit" className="w-full" loading={submitting}>
            Add CR
          </Button>
        </form>
      </Modal>
    </div>
  );
}
