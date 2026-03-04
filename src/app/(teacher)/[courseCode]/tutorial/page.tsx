'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useParams } from 'next/navigation';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Spinner from '@/components/ui/Spinner';
import Toast from '@/components/ui/Toast';

interface Student {
  _id: string;
  name: string;
  roll: string;
}

interface Tutorial {
  _id: string;
  tutorialNumber: number;
  topic: string;
}

export default function TeacherTutorialPage() {
  const { user, loading: authLoading } = useAuth();
  const params = useParams();
  const courseCode = decodeURIComponent((params.courseCode as string) || '');
  const [students, setStudents] = useState<Student[]>([]);
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // New tutorial form
  const [showNewForm, setShowNewForm] = useState(false);
  const [newTutorial, setNewTutorial] = useState({ topic: '', date: '' });

  // Selected tutorial + marks
  const [selectedTutorial, setSelectedTutorial] = useState<number | null>(null);
  const [marks, setMarks] = useState<Record<string, { marks: number; attended: boolean }>>({});

  useEffect(() => {
    if (user?.session) {
      Promise.all([
        fetch(`/api/students?session=${user.session}`).then((r) => r.json()),
        fetch(`/api/tutorials?courseCode=${courseCode}&session=${user.session}`).then((r) => r.json()),
      ])
        .then(([studentData, tutorialData]) => {
          setStudents(studentData.students || []);
          setTutorials(tutorialData.tutorials || []);
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    } else if (!authLoading) {
      setLoading(false);
    }
  }, [user, authLoading, courseCode]);

  const initializeMarks = (studentList: Student[]) => {
    const defaultMarks: Record<string, { marks: number; attended: boolean }> = {};
    studentList.forEach((s) => {
      defaultMarks[s._id] = { marks: 0, attended: true };
    });
    setMarks(defaultMarks);
  };

  const handleSelectTutorial = (num: number) => {
    setSelectedTutorial(num);
    initializeMarks(students);
  };

  const handleCreateTutorial = async () => {
    if (!user?.session || !newTutorial.topic) return;
    setSubmitting(true);

    try {
      const nextNumber = tutorials.length > 0 ? Math.max(...tutorials.map((t) => t.tutorialNumber)) + 1 : 1;

      const res = await fetch('/api/tutorials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseCode,
          session: user.session,
          tutorialNumber: nextNumber,
          topic: newTutorial.topic,
          date: newTutorial.date || undefined,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setTutorials([...tutorials, data.tutorial]);
        setNewTutorial({ topic: '', date: '' });
        setShowNewForm(false);
        setToast({ message: 'Tutorial created', type: 'success' });
      } else {
        const data = await res.json();
        setToast({ message: data.error || 'Failed to create', type: 'error' });
      }
    } catch {
      setToast({ message: 'Something went wrong', type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitResults = async () => {
    if (!user?.session || selectedTutorial === null) return;
    setSubmitting(true);

    const records = Object.entries(marks).map(([studentId, data]) => ({
      studentId,
      marks: data.marks,
      attended: data.attended,
    }));

    try {
      const res = await fetch('/api/tutorials/results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseCode,
          session: user.session,
          tutorialNumber: selectedTutorial,
          records,
        }),
      });

      if (res.ok) {
        setToast({ message: 'Tutorial results submitted', type: 'success' });
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

      {/* Tutorial selector */}
      <Card className="mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Tutorial</label>
            <div className="flex flex-wrap gap-2">
              {tutorials.map((t) => (
                <button
                  key={t.tutorialNumber}
                  onClick={() => handleSelectTutorial(t.tutorialNumber)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    selectedTutorial === t.tutorialNumber
                      ? 'bg-oxford-blue text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  title={t.topic}
                >
                  #{t.tutorialNumber}
                </button>
              ))}
              <button
                onClick={() => setShowNewForm(!showNewForm)}
                className="px-3 py-1.5 rounded-lg text-sm font-medium bg-oxford-gold/20 text-oxford-blue hover:bg-oxford-gold/30 transition-colors"
              >
                + New
              </button>
            </div>
          </div>
        </div>

        {showNewForm && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex flex-wrap gap-4 items-end">
              <Input
                id="topic"
                label="Topic"
                placeholder="Tutorial topic"
                value={newTutorial.topic}
                onChange={(e) => setNewTutorial({ ...newTutorial, topic: e.target.value })}
              />
              <Input
                id="tutDate"
                label="Date (optional)"
                type="date"
                value={newTutorial.date}
                onChange={(e) => setNewTutorial({ ...newTutorial, date: e.target.value })}
              />
              <Button onClick={handleCreateTutorial} loading={submitting} size="sm">
                Create
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Marks entry */}
      {selectedTutorial !== null && (
        <Card>
          <h3 className="text-lg font-semibold text-oxford-blue mb-4">
            Tutorial #{selectedTutorial} — Enter Results
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-2 sm:px-4 font-medium text-gray-600">#</th>
                  <th className="text-left py-3 px-2 sm:px-4 font-medium text-gray-600">Name</th>
                  <th className="text-left py-3 px-2 sm:px-4 font-medium text-gray-600">Roll</th>
                  <th className="text-center py-3 px-2 sm:px-4 font-medium text-gray-600">Attended</th>
                  <th className="text-center py-3 px-2 sm:px-4 font-medium text-gray-600">Marks</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student, idx) => (
                  <tr key={student._id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-2 sm:px-4 text-gray-500">{idx + 1}</td>
                    <td className="py-3 px-2 sm:px-4 font-medium">{student.name}</td>
                    <td className="py-3 px-2 sm:px-4">{student.roll}</td>
                    <td className="py-3 px-2 sm:px-4 text-center">
                      <input
                        type="checkbox"
                        checked={marks[student._id]?.attended ?? true}
                        onChange={(e) =>
                          setMarks({
                            ...marks,
                            [student._id]: { ...marks[student._id], attended: e.target.checked },
                          })
                        }
                        className="w-5 h-5 accent-oxford-blue"
                      />
                    </td>
                    <td className="py-3 px-2 sm:px-4 text-center">
                      <input
                        type="number"
                        min={0}
                        max={10}
                        value={marks[student._id]?.marks ?? 0}
                        onChange={(e) =>
                          setMarks({
                            ...marks,
                            [student._id]: {
                              ...marks[student._id],
                              marks: parseInt(e.target.value) || 0,
                            },
                          })
                        }
                        className="w-16 sm:w-20 px-2 py-1.5 border border-gray-300 rounded text-center text-sm focus:outline-none focus:ring-2 focus:ring-oxford-blue"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex justify-end">
            <Button onClick={handleSubmitResults} loading={submitting}>
              Submit Results
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
