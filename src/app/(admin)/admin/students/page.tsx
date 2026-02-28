'use client';

import { useEffect, useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Select from '@/components/ui/Select';
import Modal from '@/components/ui/Modal';
import Spinner from '@/components/ui/Spinner';
import Toast from '@/components/ui/Toast';

interface Student {
  _id: string;
  name: string;
  roll: string;
  registrationNo: string;
  email: string;
  phone: string;
  bloodGroup: string;
}

export default function AdminStudentsPage() {
  const [sessions, setSessions] = useState<string[]>([]);
  const [activeSession, setActiveSession] = useState<string>('');
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [newSession, setNewSession] = useState('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const fetchSessions = async () => {
    try {
      const res = await fetch('/api/admin/sessions');
      const data = await res.json();
      const sessionList = data.sessions || [];
      setSessions(sessionList);
      if (sessionList.length > 0 && !activeSession) {
        setActiveSession(sessionList[0]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async (session: string) => {
    if (!session) return;
    setLoadingStudents(true);
    try {
      const res = await fetch(`/api/students?session=${session}`);
      const data = await res.json();
      setStudents(data.students || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingStudents(false);
    }
  };

  useEffect(() => {
    fetchSessions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (activeSession) {
      fetchStudents(activeSession);
    } else {
      setStudents([]);
    }
  }, [activeSession]);

  const handleAddSession = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch('/api/admin/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session: newSession }),
      });

      const data = await res.json();

      if (res.ok) {
        setToast({ message: 'Session created successfully', type: 'success' });
        setShowModal(false);
        setNewSession('');
        const prev = activeSession;
        await fetchSessions();
        if (!prev) setActiveSession(newSession.trim());
      } else {
        setToast({ message: data.error || 'Failed to create session', type: 'error' });
      }
    } catch {
      setToast({ message: 'Something went wrong', type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteSession = async (session: string) => {
    if (!confirm(`Delete session "${session}"? This only works if no students are registered in this session.`)) return;

    try {
      const res = await fetch(`/api/admin/sessions?session=${encodeURIComponent(session)}`, {
        method: 'DELETE',
      });

      const data = await res.json();

      if (res.ok) {
        setToast({ message: 'Session deleted', type: 'success' });
        if (activeSession === session) {
          setActiveSession('');
        }
        fetchSessions();
      } else {
        setToast({ message: data.error || 'Failed to delete session', type: 'error' });
      }
    } catch {
      setToast({ message: 'Something went wrong', type: 'error' });
    }
  };

  if (loading) return <Spinner className="mt-20" />;

  return (
    <div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-2 flex-wrap">
          {sessions.map((s) => (
            <button
              key={s}
              onClick={() => setActiveSession(s)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeSession === s
                  ? 'bg-oxford-blue text-white'
                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {s}
            </button>
          ))}
          {sessions.length === 0 && (
            <span className="text-sm text-gray-500">No sessions yet. Add a session to get started.</span>
          )}
        </div>
        <Button onClick={() => setShowModal(true)}>Add Session</Button>
      </div>

      {activeSession && (
        <div className="flex justify-between items-center mb-4">
          <p className="text-sm text-gray-500">
            {loadingStudents ? 'Loading...' : `${students.length} student${students.length !== 1 ? 's' : ''} in ${activeSession}`}
          </p>
          <Button
            variant="danger"
            size="sm"
            onClick={() => handleDeleteSession(activeSession)}
          >
            Delete Session
          </Button>
        </div>
      )}

      <Card>
        {!activeSession ? (
          <p className="text-center text-gray-500 text-sm py-8">
            Select a session or add a new one.
          </p>
        ) : loadingStudents ? (
          <Spinner className="py-8" />
        ) : students.length === 0 ? (
          <p className="text-center text-gray-500 text-sm py-8">
            No students registered in {activeSession} yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Name</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Roll</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Registration No</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Email</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Phone</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Blood Group</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student._id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-oxford-blue">{student.name}</td>
                    <td className="py-3 px-4">{student.roll}</td>
                    <td className="py-3 px-4">{student.registrationNo}</td>
                    <td className="py-3 px-4">{student.email}</td>
                    <td className="py-3 px-4">{student.phone || '—'}</td>
                    <td className="py-3 px-4">{student.bloodGroup || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Add Session Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add New Session">
        <form onSubmit={handleAddSession} className="space-y-4">
          <Select
            id="session-name"
            label="Session"
            placeholder="Select a session"
            options={Array.from({ length: 11 }, (_, i) => {
              const startYear = 2019 + i;
              const value = `${startYear}-${startYear + 1}`;
              return { value, label: value };
            }).filter((opt) => !sessions.includes(opt.value))}
            value={newSession}
            onChange={(e) => setNewSession(e.target.value)}
            required
          />
          <Button type="submit" className="w-full" loading={submitting}>
            Create Session
          </Button>
        </form>
      </Modal>
    </div>
  );
}
