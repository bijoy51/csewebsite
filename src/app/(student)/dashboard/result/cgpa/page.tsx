'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Card from '@/components/ui/Card';
import Spinner from '@/components/ui/Spinner';
import { gpaToGrade } from '@/lib/utils';

export default function CGPAPage() {
  const { user, loading: authLoading } = useAuth();
  const [cgpa, setCgpa] = useState<number | null>(null);
  const [totalCredits, setTotalCredits] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      fetch(`/api/results/cgpa/student/${user.id}`)
        .then((res) => res.json())
        .then((data) => {
          setCgpa(data.cgpa ?? null);
          setTotalCredits(data.totalCredits || 0);
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    } else if (!authLoading) {
      setLoading(false);
    }
  }, [user, authLoading]);

  if (loading) return <Spinner className="mt-10" />;

  return (
    <div className="max-w-md mx-auto">
      <Card className="text-center py-10">
        {cgpa === null ? (
          <div className="text-gray-500">
            <p className="text-sm">No results available to compute CGPA.</p>
          </div>
        ) : (
          <>
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">
              Cumulative GPA
            </p>
            <div className="mt-4 text-6xl font-bold text-oxford-blue">{cgpa.toFixed(2)}</div>
            <div className="mt-2 inline-block bg-oxford-gold/20 text-oxford-blue-dark px-4 py-1 rounded-full text-sm font-medium">
              Grade: {gpaToGrade(cgpa)}
            </div>
            <p className="text-sm text-gray-500 mt-4">
              Total Credits Completed: {totalCredits}
            </p>
          </>
        )}
      </Card>
    </div>
  );
}
