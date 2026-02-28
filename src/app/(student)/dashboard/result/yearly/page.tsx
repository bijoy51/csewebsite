'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Card from '@/components/ui/Card';
import Spinner from '@/components/ui/Spinner';

interface YearlyResult {
  year: number;
  semester1GPA: number | null;
  semester2GPA: number | null;
  averageGPA: number;
}

export default function YearlyResultPage() {
  const { user, loading: authLoading } = useAuth();
  const [results, setResults] = useState<YearlyResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      fetch(`/api/results/yearly/student/${user.id}`)
        .then((res) => res.json())
        .then((data) => setResults(data.results || []))
        .catch(console.error)
        .finally(() => setLoading(false));
    } else if (!authLoading) {
      setLoading(false);
    }
  }, [user, authLoading]);

  if (loading) return <Spinner className="mt-10" />;

  return (
    <div>
      {results.length === 0 ? (
        <Card>
          <div className="text-center py-12 text-gray-500">
            <p className="text-sm">No yearly results available yet.</p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {results.map((result) => (
            <Card key={result.year}>
              <div className="text-center">
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Year {result.year}
                </h3>
                <div className="mt-4 text-4xl font-bold text-oxford-blue">
                  {result.averageGPA.toFixed(2)}
                </div>
                <p className="text-sm text-gray-500 mt-1">Average GPA</p>
                <div className="mt-4 flex justify-center gap-6 text-sm">
                  <div>
                    <p className="text-gray-500">Semester 1</p>
                    <p className="font-semibold">
                      {result.semester1GPA !== null ? result.semester1GPA.toFixed(2) : '—'}
                    </p>
                  </div>
                  <div className="border-l border-gray-200" />
                  <div>
                    <p className="text-gray-500">Semester 2</p>
                    <p className="font-semibold">
                      {result.semester2GPA !== null ? result.semester2GPA.toFixed(2) : '—'}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
