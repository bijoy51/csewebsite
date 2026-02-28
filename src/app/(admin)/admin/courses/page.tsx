'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
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

interface CurriculumCourse {
  courseCode: string;
  courseTitle: string;
  credit: number;
  year: number;
  semester: number;
  isOptional: number;
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

  // Autocomplete state
  const [sessionSuggestions, setSessionSuggestions] = useState<string[]>([]);
  const [showSessionDropdown, setShowSessionDropdown] = useState(false);
  const [curriculumSuggestions, setCurriculumSuggestions] = useState<CurriculumCourse[]>([]);
  const [showCourseDropdown, setShowCourseDropdown] = useState(false);
  const [allCurriculum, setAllCurriculum] = useState<CurriculumCourse[]>([]);

  const sessionDropdownRef = useRef<HTMLDivElement>(null);
  const courseDropdownRef = useRef<HTMLDivElement>(null);

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

  const fetchCurriculum = async () => {
    try {
      const res = await fetch('/api/curriculum');
      const data = await res.json();
      setAllCurriculum(data.courses || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
    fetchCurriculum();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (sessionDropdownRef.current && !sessionDropdownRef.current.contains(e.target as Node)) {
        setShowSessionDropdown(false);
      }
      if (courseDropdownRef.current && !courseDropdownRef.current.contains(e.target as Node)) {
        setShowCourseDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const filteredCourses = courses.filter((c) => c.session === activeSession);

  // Session autocomplete logic
  const handleSessionChange = useCallback((value: string) => {
    setForm((prev) => ({ ...prev, session: value }));
    if (value.trim()) {
      const filtered = sessions.filter((s) =>
        s.toLowerCase().includes(value.toLowerCase())
      );
      setSessionSuggestions(filtered);
      setShowSessionDropdown(filtered.length > 0);
    } else {
      setSessionSuggestions(sessions);
      setShowSessionDropdown(sessions.length > 0);
    }
  }, [sessions]);

  const selectSession = (s: string) => {
    setForm((prev) => ({ ...prev, session: s }));
    setShowSessionDropdown(false);
  };

  // Course code autocomplete logic
  const handleCourseCodeChange = useCallback((value: string) => {
    const upper = value.toUpperCase();
    setForm((prev) => ({ ...prev, courseCode: upper }));
    if (upper.trim()) {
      const filtered = allCurriculum.filter((c) =>
        c.courseCode.includes(upper)
      );
      setCurriculumSuggestions(filtered.slice(0, 15));
      setShowCourseDropdown(filtered.length > 0);
    } else {
      setShowCourseDropdown(false);
    }
  }, [allCurriculum]);

  const selectCourse = (c: CurriculumCourse) => {
    setForm((prev) => ({
      ...prev,
      courseCode: c.courseCode,
      courseTitle: c.courseTitle,
      year: String(c.year),
      semester: String(c.semester),
    }));
    setShowCourseDropdown(false);
  };

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
          {/* Session with autocomplete */}
          <div ref={sessionDropdownRef} className="relative">
            <Input
              id="course-session"
              label="Session"
              placeholder="e.g., 2022-2023"
              value={form.session}
              onChange={(e) => handleSessionChange(e.target.value)}
              onFocus={() => {
                const filtered = form.session.trim()
                  ? sessions.filter((s) => s.toLowerCase().includes(form.session.toLowerCase()))
                  : sessions;
                setSessionSuggestions(filtered);
                setShowSessionDropdown(filtered.length > 0);
              }}
              autoComplete="off"
              required
            />
            {showSessionDropdown && sessionSuggestions.length > 0 && (
              <div className="absolute z-50 left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-40 overflow-y-auto">
                {sessionSuggestions.map((s) => (
                  <button
                    key={s}
                    type="button"
                    className="w-full text-left px-3 py-2 text-sm hover:bg-oxford-blue/5 transition-colors"
                    onClick={() => selectSession(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Course Code with autocomplete */}
          <div ref={courseDropdownRef} className="relative">
            <Input
              id="course-code"
              label="Course Code"
              placeholder="e.g., CSE 1101"
              value={form.courseCode}
              onChange={(e) => handleCourseCodeChange(e.target.value)}
              onFocus={() => {
                if (form.courseCode.trim()) {
                  const filtered = allCurriculum.filter((c) =>
                    c.courseCode.includes(form.courseCode.toUpperCase())
                  );
                  setCurriculumSuggestions(filtered.slice(0, 15));
                  setShowCourseDropdown(filtered.length > 0);
                }
              }}
              autoComplete="off"
              className="uppercase"
              required
            />
            {showCourseDropdown && curriculumSuggestions.length > 0 && (
              <div className="absolute z-50 left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-52 overflow-y-auto">
                {curriculumSuggestions.map((c) => (
                  <button
                    key={c.courseCode}
                    type="button"
                    className="w-full text-left px-3 py-2 text-sm hover:bg-oxford-blue/5 transition-colors border-b border-gray-50 last:border-0"
                    onClick={() => selectCourse(c)}
                  >
                    <span className="font-medium text-oxford-blue">{c.courseCode}</span>
                    <span className="text-gray-500 ml-2">{c.courseTitle}</span>
                    <span className="text-gray-400 ml-2 text-xs">Y{c.year}/S{c.semester} ({c.credit} cr)</span>
                  </button>
                ))}
              </div>
            )}
          </div>

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
              label="Year"
              type="number"
              placeholder="1-4"
              value={form.year}
              onChange={(e) => setForm({ ...form, year: e.target.value })}
            />
            <Input
              id="course-semester"
              label="Semester"
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
