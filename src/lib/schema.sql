-- D1 Schema for CSE Department Website
-- Mirrors the 9 Mongoose models

-- Students table
CREATE TABLE IF NOT EXISTS students (
  id TEXT PRIMARY KEY DEFAULT (hex(randomblob(12))),
  name TEXT NOT NULL,
  roll TEXT NOT NULL UNIQUE,
  registration_no TEXT NOT NULL UNIQUE,
  session TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  profile_photo TEXT DEFAULT '/images/default-avatar.png',
  phone TEXT DEFAULT '',
  blood_group TEXT DEFAULT '',
  address TEXT DEFAULT '',
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_students_session_roll ON students(session, roll);

-- Courses table
CREATE TABLE IF NOT EXISTS courses (
  id TEXT PRIMARY KEY DEFAULT (hex(randomblob(12))),
  course_code TEXT NOT NULL,
  course_title TEXT NOT NULL,
  teacher_name TEXT NOT NULL,
  session TEXT NOT NULL,
  password TEXT NOT NULL,
  year INTEGER,
  semester INTEGER,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  UNIQUE(course_code, session)
);

-- Sessions table
CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY DEFAULT (hex(randomblob(12))),
  session TEXT NOT NULL UNIQUE,
  created_at TEXT DEFAULT (datetime('now'))
);

-- Admins table
CREATE TABLE IF NOT EXISTS admins (
  id TEXT PRIMARY KEY DEFAULT (hex(randomblob(12))),
  password TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- CRs table
CREATE TABLE IF NOT EXISTS crs (
  id TEXT PRIMARY KEY DEFAULT (hex(randomblob(12))),
  session TEXT NOT NULL,
  name TEXT NOT NULL,
  roll TEXT NOT NULL,
  password TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  UNIQUE(session, roll)
);

-- Attendance table
CREATE TABLE IF NOT EXISTS attendance (
  id TEXT PRIMARY KEY DEFAULT (hex(randomblob(12))),
  student_id TEXT NOT NULL,
  course_code TEXT NOT NULL,
  session TEXT NOT NULL,
  date TEXT NOT NULL,
  status TEXT NOT NULL CHECK(status IN ('present', 'absent')),
  marked_by TEXT NOT NULL CHECK(marked_by IN ('teacher', 'cr')),
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  UNIQUE(student_id, course_code, date),
  FOREIGN KEY (student_id) REFERENCES students(id)
);
CREATE INDEX IF NOT EXISTS idx_attendance_course_session_date ON attendance(course_code, session, date);

-- Tutorials table
CREATE TABLE IF NOT EXISTS tutorials (
  id TEXT PRIMARY KEY DEFAULT (hex(randomblob(12))),
  course_code TEXT NOT NULL,
  session TEXT NOT NULL,
  tutorial_number INTEGER NOT NULL,
  topic TEXT NOT NULL,
  date TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  UNIQUE(course_code, session, tutorial_number)
);

-- Tutorial Results table
CREATE TABLE IF NOT EXISTS tutorial_results (
  id TEXT PRIMARY KEY DEFAULT (hex(randomblob(12))),
  student_id TEXT NOT NULL,
  course_code TEXT NOT NULL,
  session TEXT NOT NULL,
  tutorial_number INTEGER NOT NULL,
  marks REAL NOT NULL CHECK(marks >= 0),
  total_marks REAL DEFAULT 10,
  attended INTEGER DEFAULT 1,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  UNIQUE(student_id, course_code, tutorial_number),
  FOREIGN KEY (student_id) REFERENCES students(id)
);

-- Semester Results table
CREATE TABLE IF NOT EXISTS semester_results (
  id TEXT PRIMARY KEY DEFAULT (hex(randomblob(12))),
  student_id TEXT NOT NULL,
  course_code TEXT NOT NULL,
  session TEXT NOT NULL,
  year INTEGER NOT NULL,
  semester INTEGER NOT NULL,
  grade TEXT NOT NULL,
  gpa REAL NOT NULL CHECK(gpa >= 0 AND gpa <= 4.0),
  credits REAL DEFAULT 3,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  UNIQUE(student_id, course_code, year, semester),
  FOREIGN KEY (student_id) REFERENCES students(id)
);
CREATE INDEX IF NOT EXISTS idx_semester_results_student_year_sem ON semester_results(student_id, year, semester);

-- Class Schedules table
CREATE TABLE IF NOT EXISTS class_schedules (
  id TEXT PRIMARY KEY DEFAULT (hex(randomblob(12))),
  course_code TEXT NOT NULL,
  session TEXT NOT NULL,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  room TEXT DEFAULT '',
  teacher_name TEXT DEFAULT '',
  topic TEXT DEFAULT '',
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_schedules_session_date ON class_schedules(session, date);
CREATE INDEX IF NOT EXISTS idx_schedules_course_session ON class_schedules(course_code, session);

-- Teachers table
CREATE TABLE IF NOT EXISTS teachers (
  id TEXT PRIMARY KEY DEFAULT (hex(randomblob(12))),
  name TEXT NOT NULL,
  designation TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now'))
);

-- Notices table
CREATE TABLE IF NOT EXISTS notices (
  id TEXT PRIMARY KEY DEFAULT (hex(randomblob(12))),
  type TEXT NOT NULL CHECK(type IN ('image', 'text', 'card')),
  title TEXT NOT NULL,
  content TEXT DEFAULT '',
  image_url TEXT DEFAULT '',
  category TEXT DEFAULT '',
  date TEXT DEFAULT (date('now')),
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- Curriculum table (predefined course catalog)
CREATE TABLE IF NOT EXISTS curriculum (
  id TEXT PRIMARY KEY DEFAULT (hex(randomblob(12))),
  course_code TEXT NOT NULL UNIQUE,
  course_title TEXT NOT NULL,
  credit REAL NOT NULL,
  year INTEGER NOT NULL,
  semester INTEGER NOT NULL,
  is_optional INTEGER DEFAULT 0
);
