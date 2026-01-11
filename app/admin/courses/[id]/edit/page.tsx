'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PageHeader, PageLoader } from '@/components/shared';
import { CourseForm } from '@/components/forms/course-form';
import { useCourse, useUpdateCourse } from '@/hooks/use-courses';
import { CourseSchemaType } from '@/lib/validations/course';
import { toast } from 'sonner';

export default function EditCoursePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { data: course, isLoading } = useCourse(id);
  const updateMutation = useUpdateCourse();

  const handleSubmit = async (data: CourseSchemaType) => {
    try {
      await updateMutation.mutateAsync({ id, data });
      toast.success('Course updated successfully');
      router.push(`/admin/courses/${id}`);
    } catch (error) {
      toast.error('Failed to update course');
    }
  };

  if (isLoading) {
    return <PageLoader />;
  }

  if (!course) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold">Course not found</h2>
        <p className="text-muted-foreground mt-2">The requested course could not be found.</p>
        <Link href="/admin/courses">
          <Button className="mt-4">Back to Courses</Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title={`Edit ${course.course_code}`}
        description="Update the course details"
        breadcrumbs={[
          { label: 'Admin', href: '/admin/dashboard' },
          { label: 'Courses', href: '/admin/courses' },
          { label: course.course_code, href: `/admin/courses/${id}` },
          { label: 'Edit' },
        ]}
      />

      <Card>
        <CardHeader>
          <CardTitle>Course Details</CardTitle>
          <CardDescription>
            Update the details for this course
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CourseForm
            initialData={course}
            onSubmit={handleSubmit}
            isLoading={updateMutation.isPending}
          />
        </CardContent>
      </Card>
    </div>
  );
}

