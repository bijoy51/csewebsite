'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Select from '@/components/ui/Select';
import Spinner from '@/components/ui/Spinner';
import Toast from '@/components/ui/Toast';

interface Student {
  _id: string;
  name: string;
  roll: string;
}

interface Course {
  _id: string;
  courseCode: string;
  courseTitle: string;
}

export default function CRDashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const [selectedCourse, setSelectedCourse] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [records, setRecords] = useState<Record<string, 'present' | 'absent'>>({});

  useEffect(() => {
    if (user?.session) {
      Promise.all([
        fetch(`/api/students?session=${user.session}`).then((r) => r.json()),
        fetch(`/api/courses?session=${user.session}`).then((r) => r.json()),
      ])
        .then(([studentData, courseData]) => {
          const studentList = studentData.students || [];
          setStudents(studentList);
          setCourses(courseData.courses || []);

          const defaultRecords: Record<string, 'present' | 'absent'> = {};
          studentList.forEach((s: Student) => {
            defaultRecords[s._id] = 'present';
          });
          setRecords(defaultRecords);

          if (courseData.courses?.length > 0) {
            setSelectedCourse(courseData.courses[0].courseCode);
          }
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    } else if (!authLoading) {
      setLoading(false);
    }
  }, [user, authLoading]);

  const toggleAttendance = (studentId: string) => {
    setRecords((prev) => ({
      ...prev,
      [studentId]: prev[studentId] === 'present' ? 'absent' : 'present',
    }));
  };

  const handleSubmit = async () => {
    if (!user?.session || !selectedCourse) return;
    setSubmitting(true);

    const attendanceRecords = Object.entries(records).map(([studentId, status]) => ({
      studentId,
      status,
    }));

    try {
      const res = await fetch('/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseCode: selectedCourse,
          session: user.session,
          date,
          records: attendanceRecords,
        }),
      });

      if (res.ok) {
        setToast({ message: 'Attendance marked successfully', type: 'success' });
      } else {
        const data = await res.json();
        setToast({ message: data.error || 'Failed to mark attendance', type: 'error' });
      }
    } catch {
      setToast({ message: 'Something went wrong', type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Spinner className="mt-20" />;

  const presentCount = Object.values(records).filter((s) => s === 'present').length;
  const absentCount = Object.values(records).filter((s) => s === 'absent').length;

  return (
    <div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Controls */}
      <Card className="mb-6">
        <div className="flex flex-wrap items-end gap-4">
          <Select
            id="course"
            label="Course"
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            options={courses.map((c) => ({
              value: c.courseCode,
              label: `${c.courseCode} — ${c.courseTitle}`,
            }))}
            placeholder="Select course"
          />
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-oxford-blue"
            />
          </div>
          <div className="flex gap-4 text-sm pb-2">
            <span className="text-green-600 font-medium">Present: {presentCount}</span>
            <span className="text-red-600 font-medium">Absent: {absentCount}</span>
          </div>
        </div>
      </Card>

      {/* Student List */}
      <Card>
        {students.length === 0 ? (
          <p className="text-center text-gray-500 py-8 text-sm">No students found for this session.</p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-600">#</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Name</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Roll</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-600">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student, idx) => (
                    <tr key={student._id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-gray-500">{idx + 1}</td>
                      <td className="py-3 px-4 font-medium">{student.name}</td>
                      <td className="py-3 px-4">{student.roll}</td>
                      <td className="py-3 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => toggleAttendance(student._id)}
                          className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                            records[student._id] === 'present'
                              ? 'bg-green-100 text-green-700 hover:bg-green-200'
                              : 'bg-red-100 text-red-700 hover:bg-red-200'
                          }`}
                        >
                          {records[student._id] === 'present' ? 'Present' : 'Absent'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 flex justify-end">
              <Button onClick={handleSubmit} loading={submitting}>
                Submit Attendance
              </Button>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
