'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { PageHeader, PageLoader } from '@/components/shared';
import { useCourse, useDeleteCourse } from '@/hooks/use-courses';
import { DeleteConfirmDialog } from '@/components/admin/delete-confirm-dialog';
import { Pencil, Trash2, Calendar, GraduationCap, BookOpen, Zap, Plus } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  
  const { data: course, isLoading } = useCourse(id);
  const deleteMutation = useDeleteCourse();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(id);
      toast.success('Course deleted successfully');
      router.push('/admin/courses');
    } catch (error) {
      toast.error('Failed to delete course');
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

  const weeks = course.weeks ?? [];

  return (
    <div>
      <PageHeader
        title={`${course.course_code}: ${course.course_name}`}
        breadcrumbs={[
          { label: 'Admin', href: '/admin/dashboard' },
          { label: 'Courses', href: '/admin/courses' },
          { label: course.course_code },
        ]}
        actions={
          <div className="flex gap-2">
            <Link href={`/admin/courses/${id}/edit`}>
              <Button variant="outline">
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </Button>
            </Link>
            <Button variant="destructive" onClick={() => setDeleteDialogOpen(true)}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>
        }
      />

      <div className="grid gap-6 md:grid-cols-3">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          {/* Description */}
          {course.description && (
            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap">{course.description}</p>
              </CardContent>
            </Card>
          )}

          {/* Course Weeks */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Course Weeks
                </CardTitle>
                <CardDescription>
                  {weeks.length} weeks in this course
                </CardDescription>
              </div>
              <Button size="sm" disabled>
                <Plus className="mr-2 h-4 w-4" />
                Add Week
              </Button>
            </CardHeader>
            <CardContent>
              {weeks.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-20">Week</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Topics</TableHead>
                      <TableHead>SkillBit</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {weeks
                      .sort((a, b) => a.week_number - b.week_number)
                      .map((week) => (
                        <TableRow key={week.id}>
                          <TableCell>
                            <Badge variant="outline">Week {week.week_number}</Badge>
                          </TableCell>
                          <TableCell className="font-medium">{week.title}</TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {week.topics?.slice(0, 3).map((topic) => (
                                <Badge key={topic.id} variant="secondary" className="text-xs">
                                  {topic.name}
                                </Badge>
                              ))}
                              {(week.topics?.length ?? 0) > 3 && (
                                <Badge variant="secondary" className="text-xs">
                                  +{(week.topics?.length ?? 0) - 3} more
                                </Badge>
                              )}
                              {(!week.topics || week.topics.length === 0) && (
                                <span className="text-muted-foreground text-sm">No topics</span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            {week.has_skillbit || (week.skillbit_challenges && week.skillbit_challenges.length > 0) ? (
                              <Badge className="bg-green-100 text-green-800">
                                <Zap className="h-3 w-3 mr-1" />
                                Yes
                              </Badge>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  No weeks added yet. Add weeks to define the course structure.
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">University</CardTitle>
            </CardHeader>
            <CardContent>
              {course.university ? (
                <Link
                  href={`/admin/universities/${course.university_id}`}
                  className="flex items-center gap-2 text-primary hover:underline"
                >
                  <GraduationCap className="h-4 w-4" />
                  {course.university.name}
                </Link>
              ) : (
                <span className="text-muted-foreground">Unknown</span>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Weeks</span>
                </div>
                <span className="font-medium">{course.week_count ?? weeks.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm">
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                  <span>Total Topics</span>
                </div>
                <span className="font-medium">
                  {weeks.reduce((sum, w) => sum + (w.topics?.length ?? 0), 0)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm">
                  <Zap className="h-4 w-4 text-muted-foreground" />
                  <span>SkillBit Challenges</span>
                </div>
                <span className="font-medium">
                  {weeks.filter((w) => w.has_skillbit || (w.skillbit_challenges && w.skillbit_challenges.length > 0)).length}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Metadata</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {course.created_at && (
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Created:</span>
                  <span>{new Date(course.created_at).toLocaleDateString()}</span>
                </div>
              )}
              {course.updated_at && (
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Updated:</span>
                  <span>{new Date(course.updated_at).toLocaleDateString()}</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDelete}
        title="Delete Course"
        description="Are you sure you want to delete this course? This will also delete all associated weeks and challenges."
        itemName={course.course_name}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}

