'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Card from '@/components/ui/Card';
import Spinner from '@/components/ui/Spinner';
import { formatDate } from '@/lib/utils';

interface ScheduleEntry {
  _id: string;
  courseCode: string;
  courseTitle?: string;
  date: string;
  time: string;
  room: string;
}

export default function ClassSchedulePage() {
  const { user, loading: authLoading } = useAuth();
  const [schedule, setSchedule] = useState<ScheduleEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.session) {
      fetch(`/api/schedule?session=${user.session}`)
        .then((res) => res.json())
        .then((data) => setSchedule(data.schedules || []))
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
        {schedule.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-sm">No class schedule available yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Date</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Course Code</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Time</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Room</th>
                </tr>
              </thead>
              <tbody>
                {schedule.map((entry) => (
                  <tr key={entry._id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">{formatDate(entry.date)}</td>
                    <td className="py-3 px-4 font-medium text-oxford-blue">{entry.courseCode}</td>
                    <td className="py-3 px-4">{entry.time}</td>
                    <td className="py-3 px-4">{entry.room || '—'}</td>
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
