'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Card from '@/components/ui/Card';
import Spinner from '@/components/ui/Spinner';
import { formatDate } from '@/lib/utils';

interface Tutorial {
  _id: string;
  courseCode: string;
  tutorialNumber: number;
  topic: string;
  date: string;
}

interface CourseInfo {
  courseCode: string;
  courseTitle: string;
}

export default function TutorialPage() {
  const { user } = useAuth();
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const [courses, setCourses] = useState<CourseInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.session) {
      Promise.all([
        fetch(`/api/courses?session=${user.session}`).then((r) => r.json()),
        fetch(`/api/tutorials?session=${user.session}`).then((r) => r.json()),
      ])
        .then(([coursesData, tutorialsData]) => {
          setCourses(coursesData.courses || []);
          setTutorials(tutorialsData.tutorials || []);
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [user]);

  if (loading) return <Spinner className="mt-20" />;

  // Group tutorials by course
  const grouped = courses.map((course) => ({
    ...course,
    tutorials: tutorials
      .filter((t) => t.courseCode === course.courseCode)
      .sort((a, b) => a.tutorialNumber - b.tutorialNumber),
  }));

  return (
    <div className="space-y-6">
      {grouped.length === 0 ? (
        <Card>
          <div className="text-center py-12 text-gray-500">
            <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <p className="text-sm">No tutorials available yet.</p>
          </div>
        </Card>
      ) : (
        grouped.map((course) => (
          <Card key={course.courseCode}>
            <h3 className="text-lg font-semibold text-oxford-blue mb-4">
              {course.courseCode} — {course.courseTitle}
            </h3>
            {course.tutorials.length === 0 ? (
              <p className="text-sm text-gray-500">No tutorials for this course yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2 px-4 font-medium text-gray-600">Tutorial #</th>
                      <th className="text-left py-2 px-4 font-medium text-gray-600">Topic</th>
                      <th className="text-left py-2 px-4 font-medium text-gray-600">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {course.tutorials.map((t) => (
                      <tr key={t._id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-2 px-4 font-medium">{t.tutorialNumber}</td>
                        <td className="py-2 px-4">{t.topic}</td>
                        <td className="py-2 px-4">{t.date ? formatDate(t.date) : '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <p className="text-xs text-gray-400 mt-3">
              Total tutorials: {course.tutorials.length}
            </p>
          </Card>
        ))
      )}
    </div>
  );
}
