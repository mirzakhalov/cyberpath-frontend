'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/shared';
import { CourseForm } from '@/components/forms/course-form';
import { useCreateCourse } from '@/hooks/use-courses';
import { CourseSchemaType } from '@/lib/validations/course';
import { toast } from 'sonner';

export default function NewCoursePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultUniversityId = searchParams.get('university_id') ?? undefined;
  const createMutation = useCreateCourse();

  const handleSubmit = async (data: CourseSchemaType) => {
    try {
      await createMutation.mutateAsync(data);
      toast.success('Course created successfully');
      router.push('/admin/courses');
    } catch (error) {
      toast.error('Failed to create course');
    }
  };

  return (
    <div>
      <PageHeader
        title="Add New Course"
        description="Add a new course to the curriculum"
        breadcrumbs={[
          { label: 'Admin', href: '/admin/dashboard' },
          { label: 'Courses', href: '/admin/courses' },
          { label: 'New' },
        ]}
      />

      <Card>
        <CardHeader>
          <CardTitle>Course Details</CardTitle>
          <CardDescription>
            Enter the details for the new course
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CourseForm
            defaultUniversityId={defaultUniversityId}
            onSubmit={handleSubmit}
            isLoading={createMutation.isPending}
          />
        </CardContent>
      </Card>
    </div>
  );
}

