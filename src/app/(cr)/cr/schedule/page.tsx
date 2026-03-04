'use client';

import { useEffect, useState, useMemo, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Select from '@/components/ui/Select';
import Spinner from '@/components/ui/Spinner';
import Toast from '@/components/ui/Toast';
import { formatDate } from '@/lib/utils';

interface Course {
  _id: string;
  courseCode: string;
  courseTitle: string;
}

interface Teacher {
  _id: string;
  name: string;
  designation: string;
}

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

export default function CRSchedulePage() {
  const { user, loading: authLoading } = useAuth();

  const [courses, setCourses] = useState<Course[]>([]);
  const [schedules, setSchedules] = useState<ScheduleEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Form state
  const [selectedCourse, setSelectedCourse] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('');
  const [room, setRoom] = useState('');
  const [teacherName, setTeacherName] = useState('');
  const [topic, setTopic] = useState('');

  // Teacher autocomplete
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const teacherInputRef = useRef<HTMLDivElement>(null);

  // Edit state
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    if (user?.session) {
      fetch(`/api/courses?session=${user.session}`)
        .then((r) => r.json())
        .then((data) => {
          const courseList = data.courses || [];
          setCourses(courseList);
          if (courseList.length > 0) {
            setSelectedCourse(courseList[0].courseCode);
          }
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    } else if (!authLoading) {
      setLoading(false);
    }
  }, [user, authLoading]);

  // Fetch teachers for autocomplete
  useEffect(() => {
    fetch('/api/teachers')
      .then((r) => r.json())
      .then((data) => setTeachers(data.teachers || []))
      .catch(console.error);
  }, []);

  // Close suggestions on click outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (teacherInputRef.current && !teacherInputRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const sortedTeachers = useMemo(() => {
    const rank = (d: string) => {
      const l = d.toLowerCase();
      if (l === 'professor') return 0;
      if (l === 'associate professor') return 1;
      if (l === 'assistant professor') return 2;
      if (l === 'lecturer') return 3;
      return 4;
    };
    return [...teachers].sort((a, b) => rank(a.designation) - rank(b.designation));
  }, [teachers]);

  const filteredTeachers = useMemo(() => {
    if (!teacherName.trim()) return sortedTeachers;
    const q = teacherName.toLowerCase();
    return sortedTeachers.filter((t) => t.name.toLowerCase().includes(q));
  }, [teacherName, sortedTeachers]);

  // Fetch all schedules for the session (all courses)
  const fetchSchedules = () => {
    if (!user?.session) return;
    fetch(`/api/schedule?session=${user.session}`)
      .then((res) => res.json())
      .then((data) => setSchedules(data.schedules || []))
      .catch(console.error);
  };

  useEffect(() => {
    if (user?.session) {
      fetchSchedules();
    }
  }, [user?.session]);

  // Group schedule entries by date
  const groupedByDate = useMemo(() => {
    const groups: Record<string, ScheduleEntry[]> = {};
    for (const entry of schedules) {
      if (!groups[entry.date]) {
        groups[entry.date] = [];
      }
      groups[entry.date].push(entry);
    }
    // Sort dates descending
    return Object.entries(groups).sort(([a], [b]) => b.localeCompare(a));
  }, [schedules]);

  const resetForm = () => {
    setDate(new Date().toISOString().split('T')[0]);
    setTime('');
    setRoom('');
    setTeacherName('');
    setTopic('');
    setEditingId(null);
  };

  const handleSubmit = async () => {
    if (!user?.session || !selectedCourse || !time) return;
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
            courseCode: selectedCourse,
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
    setSelectedCourse(entry.courseCode);
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

      {/* Controls + Add Form */}
      <Card className="mb-6">
        <h3 className="text-sm font-semibold text-oxford-blue mb-3">
          {editingId ? 'Edit Schedule' : 'Add New Schedule'}
        </h3>
        <div className="space-y-4">
          <Select
            id="course"
            label="Course"
            value={selectedCourse}
            onChange={(e) => {
              setSelectedCourse(e.target.value);
            }}
            options={courses.map((c) => ({
              value: c.courseCode,
              label: `${c.courseCode} — ${c.courseTitle}`,
            }))}
            placeholder="Select course"
          />
          <div className="flex flex-wrap items-end gap-3">
            <div className="w-full sm:w-auto">
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input
                type="date"
                id="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-oxford-blue"
              />
            </div>
            <div className="w-full sm:w-auto">
              <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">Time</label>
              <input
                type="time"
                id="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-oxford-blue"
              />
            </div>
            <div className="w-full sm:w-auto sm:flex-1 sm:min-w-[120px]">
              <label htmlFor="room" className="block text-sm font-medium text-gray-700 mb-1">Room</label>
              <input
                type="text"
                id="room"
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                placeholder="e.g. Room 301"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-oxford-blue"
              />
            </div>
            <div className="w-full sm:w-auto sm:flex-1 sm:min-w-[140px] relative" ref={teacherInputRef}>
              <label htmlFor="teacherName" className="block text-sm font-medium text-gray-700 mb-1">Teacher Name</label>
              <input
                type="text"
                id="teacherName"
                value={teacherName}
                onChange={(e) => {
                  setTeacherName(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                placeholder="Teacher name"
                autoComplete="off"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-oxford-blue"
              />
              {showSuggestions && filteredTeachers.length > 0 && (
                <ul className="absolute z-20 left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                  {filteredTeachers.map((t) => (
                    <li
                      key={t._id}
                      onClick={() => {
                        setTeacherName(t.name);
                        setShowSuggestions(false);
                      }}
                      className="px-3 py-2 text-sm cursor-pointer hover:bg-oxford-cream transition-colors"
                    >
                      <span className="font-medium">{t.name}</span>
                      <span className="text-gray-400 ml-2 text-xs">{t.designation}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="w-full sm:w-auto sm:flex-1 sm:min-w-[140px]">
              <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-1">Topic</label>
              <input
                type="text"
                id="topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Class topic"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-oxford-blue"
              />
            </div>
            <div className="w-full sm:w-auto flex gap-2">
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
        </div>
      </Card>

      {/* Schedule List — Grouped by Date */}
      {schedules.length === 0 ? (
        <Card>
          <div className="text-center py-12 text-gray-500">
            <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-sm">No class schedules yet. Add one above.</p>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {groupedByDate.map(([date, entries]) => (
            <Card key={date}>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-oxford-blue/10">
                  <svg className="h-4 w-4 text-oxford-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-oxford-blue">{formatDate(date)}</h3>
                  <p className="text-xs text-gray-500">{entries.length} class{entries.length > 1 ? 'es' : ''}</p>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm min-w-[600px]">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2 px-3 font-medium text-gray-600">Course Code</th>
                      <th className="text-left py-2 px-3 font-medium text-gray-600">Time</th>
                      <th className="text-left py-2 px-3 font-medium text-gray-600">Room</th>
                      <th className="text-left py-2 px-3 font-medium text-gray-600">Teacher</th>
                      <th className="text-left py-2 px-3 font-medium text-gray-600">Topic</th>
                      <th className="text-center py-2 px-3 font-medium text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {entries.map((entry) => (
                      <tr key={entry._id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                        <td className="py-2.5 px-3 font-medium text-oxford-blue whitespace-nowrap">{entry.courseCode}</td>
                        <td className="py-2.5 px-3 whitespace-nowrap">{entry.time}</td>
                        <td className="py-2.5 px-3">{entry.room || '—'}</td>
                        <td className="py-2.5 px-3">{entry.teacherName || '—'}</td>
                        <td className="py-2.5 px-3">{entry.topic || '—'}</td>
                        <td className="py-2.5 px-3 text-center">
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => handleEdit(entry)}
                              className="text-oxford-blue hover:text-blue-700 text-xs font-medium px-2 py-1"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(entry._id)}
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
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
