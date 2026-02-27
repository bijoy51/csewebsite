'use client';

import { useEffect, useState } from 'react';
import Card from '@/components/ui/Card';
import Spinner from '@/components/ui/Spinner';

interface SessionSummary {
  session: string;
  studentCount: number;
  courseCount: number;
  crCount: number;
}

interface SummaryData {
  totalStudents: number;
  totalCourses: number;
  totalCRs: number;
  sessions: SessionSummary[];
}

export default function AdminDashboardPage() {
  const [data, setData] = useState<SummaryData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/summary')
      .then((res) => res.json())
      .then((d) => setData(d))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner className="mt-20" />;

  return (
    <div>
      {/* Overview cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <Card className="text-center">
          <p className="text-sm text-gray-500">Total Students</p>
          <p className="text-3xl font-bold text-oxford-blue mt-2">{data?.totalStudents || 0}</p>
        </Card>
        <Card className="text-center">
          <p className="text-sm text-gray-500">Total Courses</p>
          <p className="text-3xl font-bold text-oxford-blue mt-2">{data?.totalCourses || 0}</p>
        </Card>
        <Card className="text-center">
          <p className="text-sm text-gray-500">Total CRs</p>
          <p className="text-3xl font-bold text-oxford-blue mt-2">{data?.totalCRs || 0}</p>
        </Card>
      </div>

      {/* Per-session breakdown */}
      <h2 className="text-lg font-semibold text-oxford-blue mb-4">Session Summary</h2>
      {!data?.sessions || data.sessions.length === 0 ? (
        <Card>
          <p className="text-center text-gray-500 text-sm py-8">
            No sessions found. Add courses to get started.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.sessions.map((session) => (
            <Card key={session.session}>
              <h3 className="text-lg font-bold text-oxford-blue mb-3">{session.session}</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Students</span>
                  <span className="font-medium">{session.studentCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Courses</span>
                  <span className="font-medium">{session.courseCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">CRs</span>
                  <span className="font-medium">{session.crCount}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
