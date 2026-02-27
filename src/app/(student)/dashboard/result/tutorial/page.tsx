'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Card from '@/components/ui/Card';
import Spinner from '@/components/ui/Spinner';

interface TutorialResult {
  _id: string;
  courseCode: string;
  tutorialNumber: number;
  marks: number;
  totalMarks: number;
  attended: boolean;
}

export default function TutorialResultPage() {
  const { user } = useAuth();
  const [results, setResults] = useState<TutorialResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      fetch(`/api/tutorials/results/student/${user.id}`)
        .then((res) => res.json())
        .then((data) => setResults(data.results || []))
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [user]);

  if (loading) return <Spinner className="mt-10" />;

  // Group by courseCode
  const grouped: Record<string, TutorialResult[]> = {};
  results.forEach((r) => {
    if (!grouped[r.courseCode]) grouped[r.courseCode] = [];
    grouped[r.courseCode].push(r);
  });

  return (
    <div className="space-y-6">
      {Object.keys(grouped).length === 0 ? (
        <Card>
          <div className="text-center py-12 text-gray-500">
            <p className="text-sm">No tutorial results available yet.</p>
          </div>
        </Card>
      ) : (
        Object.entries(grouped).map(([courseCode, items]) => (
          <Card key={courseCode}>
            <h3 className="text-lg font-semibold text-oxford-blue mb-4">{courseCode}</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 px-4 font-medium text-gray-600">Tutorial #</th>
                    <th className="text-center py-2 px-4 font-medium text-gray-600">Marks</th>
                    <th className="text-center py-2 px-4 font-medium text-gray-600">Total</th>
                    <th className="text-center py-2 px-4 font-medium text-gray-600">Attended</th>
                  </tr>
                </thead>
                <tbody>
                  {items
                    .sort((a, b) => a.tutorialNumber - b.tutorialNumber)
                    .map((item) => (
                      <tr key={item._id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-2 px-4 font-medium">{item.tutorialNumber}</td>
                        <td className="py-2 px-4 text-center">{item.marks}</td>
                        <td className="py-2 px-4 text-center">{item.totalMarks}</td>
                        <td className="py-2 px-4 text-center">
                          <span className={item.attended ? 'text-green-600' : 'text-red-600'}>
                            {item.attended ? 'Yes' : 'No'}
                          </span>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </Card>
        ))
      )}
    </div>
  );
}
