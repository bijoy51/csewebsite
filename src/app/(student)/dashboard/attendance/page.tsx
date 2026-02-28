'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Card from '@/components/ui/Card';
import Spinner from '@/components/ui/Spinner';
import { getAttendanceColor } from '@/lib/utils';

interface AttendanceSummary {
  courseCode: string;
  courseTitle: string;
  totalClasses: number;
  attended: number;
  missed: number;
  percentage: number;
}

export default function AttendancePage() {
  const { user, loading: authLoading } = useAuth();
  const [attendance, setAttendance] = useState<AttendanceSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      fetch(`/api/attendance/student/${user.id}`)
        .then((res) => res.json())
        .then((data) => setAttendance(data.summary || []))
        .catch(console.error)
        .finally(() => setLoading(false));
    } else if (!authLoading) {
      setLoading(false);
    }
  }, [user, authLoading]);

  if (loading) return <Spinner className="mt-20" />;

  return (
    <div>
      <Card>
        {attendance.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
            <p className="text-sm">No attendance records yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Course</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-600">Total Classes</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-600">Attended</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-600">Missed</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-600">Percentage</th>
                </tr>
              </thead>
              <tbody>
                {attendance.map((item) => (
                  <tr key={item.courseCode} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium text-oxford-blue">{item.courseCode}</p>
                        {item.courseTitle && (
                          <p className="text-xs text-gray-500">{item.courseTitle}</p>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">{item.totalClasses}</td>
                    <td className="py-3 px-4 text-center text-green-600">{item.attended}</td>
                    <td className="py-3 px-4 text-center text-red-600">{item.missed}</td>
                    <td className="py-3 px-4 text-center">
                      <span className={`font-semibold ${getAttendanceColor(item.percentage)}`}>
                        {item.percentage.toFixed(1)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
