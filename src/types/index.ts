export interface IStudent {
  _id: string;
  name: string;
  roll: string;
  registrationNo: string;
  session: string;
  email: string;
  password?: string;
  profilePhoto: string;
  phone: string;
  bloodGroup: string;
  address: string;
  createdAt: string;
  updatedAt: string;
}

export interface ICourse {
  _id: string;
  courseCode: string;
  courseTitle: string;
  teacherName: string;
  session: string;
  password?: string;
  year: number;
  semester: number;
  createdAt: string;
  updatedAt: string;
}

export interface IAdmin {
  _id: string;
  password?: string;
}

export interface ICR {
  _id: string;
  session: string;
  name: string;
  roll: string;
  password?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IAttendance {
  _id: string;
  studentId: string;
  courseCode: string;
  session: string;
  date: string;
  status: 'present' | 'absent';
  markedBy: 'teacher' | 'cr';
  createdAt: string;
  updatedAt: string;
}

export interface ITutorial {
  _id: string;
  courseCode: string;
  session: string;
  tutorialNumber: number;
  topic: string;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export interface ITutorialResult {
  _id: string;
  studentId: string;
  courseCode: string;
  session: string;
  tutorialNumber: number;
  marks: number;
  totalMarks: number;
  attended: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ISemesterResult {
  _id: string;
  studentId: string;
  courseCode: string;
  session: string;
  year: number;
  semester: number;
  grade: string;
  gpa: number;
  credits: number;
  createdAt: string;
  updatedAt: string;
}

export interface IClassSchedule {
  _id: string;
  courseCode: string;
  session: string;
  date: string;
  time: string;
  room: string;
  createdAt: string;
  updatedAt: string;
}

export type UserRole = 'student' | 'teacher' | 'admin' | 'cr';

export interface JWTPayload {
  id?: string;
  role: UserRole;
  session?: string;
  courseCode?: string;
  roll?: string;
}

export interface AttendanceSummary {
  courseCode: string;
  courseTitle: string;
  totalClasses: number;
  attended: number;
  missed: number;
  percentage: number;
}

export interface YearlyResult {
  year: number;
  semester1GPA: number | null;
  semester2GPA: number | null;
  averageGPA: number;
}
