'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useParams } from 'next/navigation';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import Toast from '@/components/ui/Toast';
import { GRADES } from '@/lib/constants';
import { gradeToGPA } from '@/lib/utils';

interface Student {
  _id: string;
  name: string;
  roll: string;
}

// Extract year and semester from course code digits (e.g. CSE 2102 → year=2, semester=1)
function parseYearSemester(code: string): { year: number; semester: number } {
  const digits = code.replace(/[^0-9]/g, '');
  if (digits.length >= 2) {
    return { year: parseInt(digits[0]) || 1, semester: parseInt(digits[1]) || 1 };
  }
  return { year: 1, semester: 1 };
}

export default function TeacherSemesterPage() {
  const { user, loading: authLoading } = useAuth();
  const params = useParams();
  const courseCode = decodeURIComponent((params.courseCode as string) || '');
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [results, setResults] = useState<Record<string, { grade: string; gpa: number }>>({});

  const { year, semester } = parseYearSemester(courseCode);

  useEffect(() => {
    if (user?.session) {
      fetch(`/api/students?session=${user.session}`)
        .then((res) => res.json())
        .then((data) => {
          const studentList = data.students || [];
          setStudents(studentList);
          const defaultResults: Record<string, { grade: string; gpa: number }> = {};
          studentList.forEach((s: Student) => {
            defaultResults[s._id] = { grade: 'A+', gpa: 4.0 };
          });
          setResults(defaultResults);
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    } else if (!authLoading) {
      setLoading(false);
    }
  }, [user, authLoading]);

  const handleGradeChange = (studentId: string, grade: string) => {
    const gpa = gradeToGPA(grade);
    setResults({ ...results, [studentId]: { grade, gpa } });
  };

  const handleSubmit = async () => {
    if (!user?.session) return;
    setSubmitting(true);

    const records = Object.entries(results).map(([studentId, data]) => ({
      studentId,
      grade: data.grade,
      gpa: data.gpa,
    }));

    try {
      const res = await fetch('/api/results/semester', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseCode,
          session: user.session,
          year,
          semester,
          records,
        }),
      });

      if (res.ok) {
        setToast({ message: 'Semester results submitted', type: 'success' });
      } else {
        const data = await res.json();
        setToast({ message: data.error || 'Failed to submit', type: 'error' });
      }
    } catch {
      setToast({ message: 'Something went wrong', type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Spinner className="mt-20" />;

  return (
    <div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <Card className="mb-6">
        <div className="flex flex-wrap gap-4 text-sm">
          <span className="px-3 py-1.5 bg-oxford-blue/10 text-oxford-blue rounded-lg font-medium">
            Year {year}
          </span>
          <span className="px-3 py-1.5 bg-oxford-blue/10 text-oxford-blue rounded-lg font-medium">
            Semester {semester}
          </span>
        </div>
      </Card>

      <Card>
        {students.length === 0 ? (
          <p className="text-center text-gray-500 py-8 text-sm">No students found.</p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-2 sm:px-4 font-medium text-gray-600">#</th>
                    <th className="text-left py-3 px-2 sm:px-4 font-medium text-gray-600">Name</th>
                    <th className="text-left py-3 px-2 sm:px-4 font-medium text-gray-600">Roll</th>
                    <th className="text-center py-3 px-2 sm:px-4 font-medium text-gray-600">Grade</th>
                    <th className="text-center py-3 px-2 sm:px-4 font-medium text-gray-600">GPA</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student, idx) => (
                    <tr key={student._id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-2 sm:px-4 text-gray-500">{idx + 1}</td>
                      <td className="py-3 px-2 sm:px-4 font-medium">{student.name}</td>
                      <td className="py-3 px-2 sm:px-4">{student.roll}</td>
                      <td className="py-3 px-2 sm:px-4 text-center">
                        <select
                          value={results[student._id]?.grade || 'A+'}
                          onChange={(e) => handleGradeChange(student._id, e.target.value)}
                          className="px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-oxford-blue"
                        >
                          {GRADES.map((g) => (
                            <option key={g} value={g}>
                              {g}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="py-3 px-2 sm:px-4 text-center font-medium">
                        {results[student._id]?.gpa?.toFixed(2) || '4.00'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 flex justify-end">
              <Button onClick={handleSubmit} loading={submitting}>
                Submit Semester Results
              </Button>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
