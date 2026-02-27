import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  roll: z.string().min(1, 'Roll is required'),
  registrationNo: z.string().min(1, 'Registration number is required'),
  session: z.string().min(1, 'Session is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const studentLoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const teacherLoginSchema = z.object({
  session: z.string().min(1, 'Session is required'),
  courseCode: z.string().min(1, 'Course code is required'),
  password: z.string().min(1, 'Password is required'),
});

export const adminLoginSchema = z.object({
  password: z.string().min(1, 'Password is required'),
});

export const crLoginSchema = z.object({
  session: z.string().min(1, 'Session is required'),
  roll: z.string().min(1, 'Roll is required'),
  password: z.string().min(1, 'Password is required'),
});

export const addCourseSchema = z.object({
  session: z.string().min(1, 'Session is required'),
  courseCode: z.string().min(1, 'Course code is required'),
  courseTitle: z.string().min(1, 'Course title is required'),
  teacherName: z.string().min(1, 'Teacher name is required'),
  password: z.string().min(4, 'Password must be at least 4 characters'),
  year: z.number().min(1).max(4).optional(),
  semester: z.number().min(1).max(2).optional(),
});

export const addCRSchema = z.object({
  session: z.string().min(1, 'Session is required'),
  name: z.string().min(1, 'Name is required'),
  roll: z.string().min(1, 'Roll is required'),
  password: z.string().min(4, 'Password must be at least 4 characters'),
});

export const markAttendanceSchema = z.object({
  courseCode: z.string().min(1),
  session: z.string().min(1),
  date: z.string().min(1),
  records: z.array(
    z.object({
      studentId: z.string().min(1),
      status: z.enum(['present', 'absent']),
    })
  ),
});

export const createTutorialSchema = z.object({
  courseCode: z.string().min(1),
  session: z.string().min(1),
  tutorialNumber: z.number().min(1),
  topic: z.string().min(1),
  date: z.string().optional(),
});

export const markTutorialResultsSchema = z.object({
  courseCode: z.string().min(1),
  session: z.string().min(1),
  tutorialNumber: z.number().min(1),
  records: z.array(
    z.object({
      studentId: z.string().min(1),
      marks: z.number().min(0),
      totalMarks: z.number().min(0).optional(),
      attended: z.boolean().optional(),
    })
  ),
});

export const markSemesterResultsSchema = z.object({
  courseCode: z.string().min(1),
  session: z.string().min(1),
  year: z.number().min(1).max(4),
  semester: z.number().min(1).max(2),
  records: z.array(
    z.object({
      studentId: z.string().min(1),
      grade: z.string().min(1),
      gpa: z.number().min(0).max(4),
      credits: z.number().min(0).optional(),
    })
  ),
});

export const updateProfileSchema = z.object({
  phone: z.string().optional(),
  bloodGroup: z.string().optional(),
  address: z.string().optional(),
});

export const createScheduleSchema = z.object({
  courseCode: z.string().min(1),
  session: z.string().min(1),
  date: z.string().min(1),
  time: z.string().min(1),
  room: z.string().optional(),
});
