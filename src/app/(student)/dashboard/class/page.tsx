'use client';

import { useEffect, useState, useMemo } from 'react';
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
  teacherName: string;
  topic: string;
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

  // Group schedule entries by date
  const groupedByDate = useMemo(() => {
    const groups: Record<string, ScheduleEntry[]> = {};
    for (const entry of schedule) {
      if (!groups[entry.date]) {
        groups[entry.date] = [];
      }
      groups[entry.date].push(entry);
    }
    // Sort dates descending
    return Object.entries(groups).sort(([a], [b]) => b.localeCompare(a));
  }, [schedule]);

  if (loading) return <Spinner className="mt-20" />;

  return (
    <div>
      {schedule.length === 0 ? (
        <Card>
          <div className="text-center py-12 text-gray-500">
            <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-sm">No class schedule available yet.</p>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {groupedByDate.map(([date, entries]) => (
            <Card key={date}>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-oxford-blue/10">
                  <svg className="h-4 w-4 text-oxford-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-oxford-blue">{formatDate(date)}</h3>
                  <p className="text-xs text-gray-500">{entries.length} class{entries.length > 1 ? 'es' : ''}</p>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm min-w-[500px]">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2 px-3 font-medium text-gray-600">Course Code</th>
                      <th className="text-left py-2 px-3 font-medium text-gray-600">Time</th>
                      <th className="text-left py-2 px-3 font-medium text-gray-600">Room</th>
                      <th className="text-left py-2 px-3 font-medium text-gray-600">Teacher</th>
                      <th className="text-left py-2 px-3 font-medium text-gray-600">Topic</th>
                    </tr>
                  </thead>
                  <tbody>
                    {entries.map((entry) => (
                      <tr key={entry._id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                        <td className="py-2.5 px-3 font-medium text-oxford-blue whitespace-nowrap">{entry.courseCode}</td>
                        <td className="py-2.5 px-3 whitespace-nowrap">{entry.time}</td>
                        <td className="py-2.5 px-3">{entry.room || '—'}</td>
                        <td className="py-2.5 px-3">{entry.teacherName || '—'}</td>
                        <td className="py-2.5 px-3">{entry.topic || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
