'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useParams } from 'next/navigation';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import Toast from '@/components/ui/Toast';
import { formatDate } from '@/lib/utils';

interface ScheduleEntry {
  _id: string;
  courseCode: string;
  session: string;
  date: string;
  time: string;
  room: string;
  teacherName: string;
  topic: string;
}

export default function TeacherSchedulePage() {
  const { user, loading: authLoading } = useAuth();
  const params = useParams();
  const courseCode = decodeURIComponent((params.courseCode as string) || '');

  const [schedules, setSchedules] = useState<ScheduleEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Form state
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('');
  const [room, setRoom] = useState('');
  const [teacherName, setTeacherName] = useState('');
  const [topic, setTopic] = useState('');

  // Edit state
  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchSchedules = () => {
    if (!user?.session) return;
    fetch(`/api/schedule?session=${user.session}&courseCode=${courseCode}`)
      .then((res) => res.json())
      .then((data) => setSchedules(data.schedules || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (user?.session) {
      fetchSchedules();
    } else if (!authLoading) {
      setLoading(false);
    }
  }, [user, authLoading]);

  const resetForm = () => {
    setDate(new Date().toISOString().split('T')[0]);
    setTime('');
    setRoom('');
    setTeacherName('');
    setTopic('');
    setEditingId(null);
  };

  const handleSubmit = async () => {
    if (!user?.session || !time) return;
    setSubmitting(true);

    try {
      if (editingId) {
        const res = await fetch(`/api/schedule/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ date, time, room, teacherName, topic }),
        });
        if (res.ok) {
          setToast({ message: 'Schedule updated successfully', type: 'success' });
          resetForm();
          fetchSchedules();
        } else {
          const data = await res.json();
          setToast({ message: data.error || 'Failed to update', type: 'error' });
        }
      } else {
        const res = await fetch('/api/schedule', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            courseCode,
            session: user.session,
            date,
            time,
            room,
            teacherName,
            topic,
          }),
        });
        if (res.ok) {
          setToast({ message: 'Schedule added successfully', type: 'success' });
          resetForm();
          fetchSchedules();
        } else {
          const data = await res.json();
          setToast({ message: data.error || 'Failed to add schedule', type: 'error' });
        }
      }
    } catch {
      setToast({ message: 'Something went wrong', type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (entry: ScheduleEntry) => {
    setEditingId(entry._id);
    setDate(entry.date);
    setTime(entry.time);
    setRoom(entry.room || '');
    setTeacherName(entry.teacherName || '');
    setTopic(entry.topic || '');
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this schedule?')) return;
    try {
      const res = await fetch(`/api/schedule/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setToast({ message: 'Schedule deleted', type: 'success' });
        fetchSchedules();
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

      {/* Add / Edit Form */}
      <Card className="mb-6">
        <h3 className="text-sm font-semibold text-oxford-blue mb-3">
          {editingId ? 'Edit Schedule' : 'Add New Schedule'}
        </h3>
        <div className="flex flex-wrap items-end gap-4">
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-oxford-blue"
            />
          </div>
          <div>
            <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">Time</label>
            <input
              type="text"
              id="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              placeholder="e.g. 10:00 AM"
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-oxford-blue"
            />
          </div>
          <div>
            <label htmlFor="room" className="block text-sm font-medium text-gray-700 mb-1">Room</label>
            <input
              type="text"
              id="room"
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              placeholder="e.g. Room 301"
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-oxford-blue"
            />
          </div>
          <div>
            <label htmlFor="teacherName" className="block text-sm font-medium text-gray-700 mb-1">Teacher Name</label>
            <input
              type="text"
              id="teacherName"
              value={teacherName}
              onChange={(e) => setTeacherName(e.target.value)}
              placeholder="Teacher name"
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-oxford-blue"
            />
          </div>
          <div>
            <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-1">Topic</label>
            <input
              type="text"
              id="topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Class topic"
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-oxford-blue"
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={handleSubmit} loading={submitting}>
              {editingId ? 'Update' : 'Add Schedule'}
            </Button>
            {editingId && (
              <Button variant="secondary" onClick={resetForm}>
                Cancel
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Schedule List */}
      <Card>
        {schedules.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-sm">No class schedules yet. Add one above.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Date</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Time</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Room</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Teacher</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Topic</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {schedules.map((entry) => (
                  <tr key={entry._id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">{formatDate(entry.date)}</td>
                    <td className="py-3 px-4">{entry.time}</td>
                    <td className="py-3 px-4">{entry.room || '—'}</td>
                    <td className="py-3 px-4">{entry.teacherName || '—'}</td>
                    <td className="py-3 px-4">{entry.topic || '—'}</td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleEdit(entry)}
                          className="text-oxford-blue hover:text-blue-700 text-xs font-medium"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(entry._id)}
                          className="text-red-500 hover:text-red-700 text-xs font-medium"
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
    </div>
  );
}
