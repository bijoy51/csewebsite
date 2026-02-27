'use client';

import { useEffect, useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import Spinner from '@/components/ui/Spinner';
import Toast from '@/components/ui/Toast';

interface Course {
  _id: string;
  courseCode: string;
  courseTitle: string;
  teacherName: string;
  session: string;
  year?: number;
  semester?: number;
}

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [sessions, setSessions] = useState<string[]>([]);
  const [activeSession, setActiveSession] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [form, setForm] = useState({
    session: '',
    courseCode: '',
    courseTitle: '',
    teacherName: '',
    password: '',
    year: '',
    semester: '',
  });

  const fetchData = async () => {
    try {
      const [sessionsRes, coursesRes] = await Promise.all([
        fetch('/api/admin/sessions'),
        fetch('/api/courses'),
      ]);
      const sessionsData = await sessionsRes.json();
      const coursesData = await coursesRes.json();

      const sessionList = sessionsData.sessions || [];
      setSessions(sessionList);
      setCourses(coursesData.courses || []);
      if (sessionList.length > 0 && !activeSession) {
        setActiveSession(sessionList[0]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredCourses = courses.filter((c) => c.session === activeSession);

  const handleAddCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch('/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          year: form.year ? parseInt(form.year) : undefined,
          semester: form.semester ? parseInt(form.semester) : undefined,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setToast({ message: 'Course created successfully', type: 'success' });
        setShowModal(false);
        setForm({ session: '', courseCode: '', courseTitle: '', teacherName: '', password: '', year: '', semester: '' });
        fetchData();
      } else {
        setToast({ message: data.error || 'Failed to create course', type: 'error' });
      }
    } catch {
      setToast({ message: 'Something went wrong', type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (courseCode: string, session: string) => {
    if (!confirm(`Delete course ${courseCode} for session ${session}?`)) return;

    try {
      const res = await fetch(`/api/courses/${courseCode}?session=${session}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setToast({ message: 'Course deleted', type: 'success' });
        fetchData();
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
            <span className="text-sm text-gray-500">No sessions yet. Add a course to create one.</span>
          )}
        </div>
        <Button onClick={() => setShowModal(true)}>Add Course</Button>
      </div>

      <Card>
        {filteredCourses.length === 0 ? (
          <p className="text-center text-gray-500 text-sm py-8">
            No courses for {activeSession || 'this session'}.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Course Code</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Title</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Teacher</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-600">Year/Sem</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCourses.map((course) => (
                  <tr key={course._id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-oxford-blue">{course.courseCode}</td>
                    <td className="py-3 px-4">{course.courseTitle}</td>
                    <td className="py-3 px-4">{course.teacherName}</td>
                    <td className="py-3 px-4 text-center text-gray-500">
                      {course.year ? `Y${course.year}/S${course.semester}` : '—'}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(course.courseCode, course.session)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Add Course Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add New Course">
        <form onSubmit={handleAddCourse} className="space-y-4">
          <Input
            id="course-session"
            label="Session"
            placeholder="e.g., 2022-23"
            value={form.session}
            onChange={(e) => setForm({ ...form, session: e.target.value })}
            required
          />
          <Input
            id="course-code"
            label="Course Code"
            placeholder="e.g., CSE1101"
            value={form.courseCode}
            onChange={(e) => setForm({ ...form, courseCode: e.target.value })}
            required
          />
          <Input
            id="course-title"
            label="Course Title"
            placeholder="e.g., Introduction to Computer Science"
            value={form.courseTitle}
            onChange={(e) => setForm({ ...form, courseTitle: e.target.value })}
            required
          />
          <Input
            id="teacher-name"
            label="Teacher Name"
            placeholder="e.g., Dr. Ahmed"
            value={form.teacherName}
            onChange={(e) => setForm({ ...form, teacherName: e.target.value })}
            required
          />
          <Input
            id="course-password"
            label="Teacher Password"
            type="password"
            placeholder="Password for teacher login"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              id="course-year"
              label="Year (optional)"
              type="number"
              placeholder="1-4"
              value={form.year}
              onChange={(e) => setForm({ ...form, year: e.target.value })}
            />
            <Input
              id="course-semester"
              label="Semester (optional)"
              type="number"
              placeholder="1-2"
              value={form.semester}
              onChange={(e) => setForm({ ...form, semester: e.target.value })}
            />
          </div>
          <Button type="submit" className="w-full" loading={submitting}>
            Create Course
          </Button>
        </form>
      </Modal>
    </div>
  );
}
