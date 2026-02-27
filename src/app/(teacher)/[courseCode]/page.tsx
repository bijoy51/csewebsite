import { redirect } from 'next/navigation';

export default async function CourseDefaultPage({ params }: { params: Promise<{ courseCode: string }> }) {
  const { courseCode } = await params;
  redirect(`/${courseCode}/students`);
}
