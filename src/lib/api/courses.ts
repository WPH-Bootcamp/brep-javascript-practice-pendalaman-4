import { z } from 'zod';
import { CourseFormValues, CourseSchema } from '../schemas/course';

interface Post {
  id: number;
  title: string;
  body: string;
}

export const CoursesSchema = z.array(CourseSchema);
export type Course = z.infer<typeof CourseSchema>;

export async function getCourses(): Promise<Course[]> {
  const response = await fetch('/api/courses');

  if (!response.ok) {
    throw new Error('Gagal mengambil course');
  }

  const rawData: unknown = await response.json();

  const result = CoursesSchema.safeParse(rawData);

  if (!result.success) {
    console.error(result.error);
    throw new Error('Response API tidak sesuai kontrak');
  }

  return result.data;
}

export async function createCourse(input: CourseFormValues): Promise<Course> {
  const response = await fetch('/api/courses', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error('Gagal menambah course');
  }

  const raw: unknown = await response.json();

  const result = CourseSchema.safeParse(raw);

  if (!result.success) {
    throw new Error('Response create course tidak valid');
  }

  return result.data;
}
