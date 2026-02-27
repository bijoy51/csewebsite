'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Card from '@/components/ui/Card';
import Spinner from '@/components/ui/Spinner';

interface Student {
  _id: string;
  name: string;
  roll: string;
  registrationNo: string;
  profilePhoto: string;
  email: string;
}

export default function StudentsPage() {
  const { user } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.session) {
      fetch(`/api/students?session=${user.session}`)
        .then((res) => res.json())
        .then((data) => setStudents(data.students || []))
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [user]);

  if (loading) return <Spinner className="mt-20" />;

  return (
    <div>
      <div className="mb-4 text-sm text-gray-500">
        Total Students: {students.length}
      </div>
      {students.length === 0 ? (
        <Card>
          <div className="text-center py-12 text-gray-500">
            <p className="text-sm">No students found for this session.</p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {students.map((student) => (
            <Card key={student._id} className="flex items-center gap-4 p-4">
              <div className="w-12 h-12 rounded-full bg-oxford-blue text-white flex items-center justify-center text-lg font-bold flex-shrink-0">
                {student.name.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-semibold text-gray-900 truncate">{student.name}</h3>
                <p className="text-xs text-gray-500">Roll: {student.roll}</p>
                <p className="text-xs text-gray-500">Reg: {student.registrationNo}</p>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
