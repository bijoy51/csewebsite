export const COOKIE_NAME = 'cse-auth-token'; // legacy, kept for reference

export const COOKIE_NAMES: Record<string, string> = {
  student: 'cse-auth-student',
  admin: 'cse-auth-admin',
  teacher: 'cse-auth-teacher',
  cr: 'cse-auth-cr',
};

export const ROLES = {
  STUDENT: 'student' as const,
  TEACHER: 'teacher' as const,
  ADMIN: 'admin' as const,
  CR: 'cr' as const,
};

export const GRADES = ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'D', 'F'];

export const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
