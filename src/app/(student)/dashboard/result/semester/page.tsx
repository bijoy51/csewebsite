'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Card from '@/components/ui/Card';
import Spinner from '@/components/ui/Spinner';

interface SemesterResult {
  _id: string;
  courseCode: string;
  year: number;
  semester: number;
  grade: string;
  gpa: number;
  credits: number;
}

export default function SemesterResultPage() {
  const { user } = useAuth();
  const [results, setResults] = useState<SemesterResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      fetch(`/api/results/semester/student/${user.id}`)
        .then((res) => res.json())
        .then((data) => setResults(data.results || []))
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [user]);

  if (loading) return <Spinner className="mt-10" />;

  // Group by year then semester
  const grouped: Record<string, SemesterResult[]> = {};
  results.forEach((r) => {
    const key = `Year ${r.year} - Semester ${r.semester}`;
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(r);
  });

  const sortedKeys = Object.keys(grouped).sort();

  return (
    <div className="space-y-6">
      {sortedKeys.length === 0 ? (
        <Card>
          <div className="text-center py-12 text-gray-500">
            <p className="text-sm">No semester results available yet.</p>
          </div>
        </Card>
      ) : (
        sortedKeys.map((key) => {
          const items = grouped[key];
          const totalCredits = items.reduce((s, i) => s + i.credits, 0);
          const weightedGPA = totalCredits > 0
            ? items.reduce((s, i) => s + i.gpa * i.credits, 0) / totalCredits
            : 0;

          return (
            <Card key={key}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-oxford-blue">{key}</h3>
                <span className="text-sm font-medium bg-oxford-blue/10 text-oxford-blue px-3 py-1 rounded-full">
                  GPA: {weightedGPA.toFixed(2)}
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2 px-4 font-medium text-gray-600">Course</th>
                      <th className="text-center py-2 px-4 font-medium text-gray-600">Credits</th>
                      <th className="text-center py-2 px-4 font-medium text-gray-600">Grade</th>
                      <th className="text-center py-2 px-4 font-medium text-gray-600">GPA</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => (
                      <tr key={item._id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-2 px-4 font-medium text-oxford-blue">{item.courseCode}</td>
                        <td className="py-2 px-4 text-center">{item.credits}</td>
                        <td className="py-2 px-4 text-center font-medium">{item.grade}</td>
                        <td className="py-2 px-4 text-center">{item.gpa.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          );
        })
      )}
    </div>
  );
}
