export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function getDateOnly(date: Date | string): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function gradeToGPA(grade: string): number {
  const gradeMap: Record<string, number> = {
    'A+': 4.0,
    'A': 3.75,
    'A-': 3.5,
    'B+': 3.25,
    'B': 3.0,
    'B-': 2.75,
    'C+': 2.5,
    'C': 2.25,
    'D': 2.0,
    'F': 0.0,
  };
  return gradeMap[grade] ?? 0;
}

export function gpaToGrade(gpa: number): string {
  if (gpa >= 4.0) return 'A+';
  if (gpa >= 3.75) return 'A';
  if (gpa >= 3.5) return 'A-';
  if (gpa >= 3.25) return 'B+';
  if (gpa >= 3.0) return 'B';
  if (gpa >= 2.75) return 'B-';
  if (gpa >= 2.5) return 'C+';
  if (gpa >= 2.25) return 'C';
  if (gpa >= 2.0) return 'D';
  return 'F';
}

export function computeWeightedGPA(
  results: { gpa: number; credits: number }[]
): number {
  if (results.length === 0) return 0;
  const totalCredits = results.reduce((sum, r) => sum + r.credits, 0);
  if (totalCredits === 0) return 0;
  const weightedSum = results.reduce((sum, r) => sum + r.gpa * r.credits, 0);
  return parseFloat((weightedSum / totalCredits).toFixed(2));
}

export function getAttendanceColor(percentage: number): string {
  if (percentage >= 75) return 'text-green-600';
  if (percentage >= 60) return 'text-yellow-600';
  return 'text-red-600';
}

export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}
