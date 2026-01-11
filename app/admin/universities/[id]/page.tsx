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
import { useUniversity, useDeleteUniversity } from '@/hooks/use-universities';
import { useCourses } from '@/hooks/use-courses';
import { DeleteConfirmDialog } from '@/components/admin/delete-confirm-dialog';
import { Pencil, Trash2, Calendar, BookMarked, Mail, User, Plus } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function UniversityDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  
  const { data: university, isLoading } = useUniversity(id);
  const { data: coursesData, isLoading: coursesLoading } = useCourses({ university_id: id });
  const deleteMutation = useDeleteUniversity();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(id);
      toast.success('University deleted successfully');
      router.push('/admin/universities');
    } catch (error) {
      toast.error('Failed to delete university');
    }
  };

  if (isLoading) {
    return <PageLoader />;
  }

  if (!university) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold">University not found</h2>
        <p className="text-muted-foreground mt-2">The requested university could not be found.</p>
        <Link href="/admin/universities">
          <Button className="mt-4">Back to Universities</Button>
        </Link>
      </div>
    );
  }

  const courses = coursesData?.data ?? [];

  return (
    <div>
      <PageHeader
        title={university.name}
        breadcrumbs={[
          { label: 'Admin', href: '/admin/dashboard' },
          { label: 'Universities', href: '/admin/universities' },
          { label: university.name },
        ]}
        actions={
          <div className="flex gap-2">
            <Link href={`/admin/universities/${id}/edit`}>
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
          {/* Courses */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <BookMarked className="h-5 w-5" />
                  Courses
                </CardTitle>
                <CardDescription>
                  {courses.length} courses from this university
                </CardDescription>
              </div>
              <Link href={`/admin/courses/new?university_id=${id}`}>
                <Button size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Course
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {coursesLoading ? (
                <p className="text-muted-foreground text-center py-8">Loading courses...</p>
              ) : courses.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Code</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Weeks</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {courses.map((course) => (
                      <TableRow key={course.id}>
                        <TableCell>
                          <Link
                            href={`/admin/courses/${course.id}`}
                            className="font-mono text-sm hover:text-primary"
                          >
                            {course.course_code}
                          </Link>
                        </TableCell>
                        <TableCell>
                          <Link
                            href={`/admin/courses/${course.id}`}
                            className="hover:text-primary"
                          >
                            {course.course_name}
                          </Link>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{course.week_count ?? 0} weeks</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  No courses added yet.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Notes */}
          {university.notes && (
            <Card>
              <CardHeader>
                <CardTitle>Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap">{university.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {university.contact_name && (
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>{university.contact_name}</span>
                </div>
              )}
              {university.contact_email && (
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <a href={`mailto:${university.contact_email}`} className="text-primary hover:underline">
                    {university.contact_email}
                  </a>
                </div>
              )}
              {!university.contact_name && !university.contact_email && (
                <p className="text-muted-foreground text-sm">No contact information provided.</p>
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
                  <BookMarked className="h-4 w-4 text-muted-foreground" />
                  <span>Courses</span>
                </div>
                <span className="font-medium">{university.course_count ?? courses.length}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Metadata</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {university.created_at && (
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Created:</span>
                  <span>{new Date(university.created_at).toLocaleDateString()}</span>
                </div>
              )}
              {university.updated_at && (
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Updated:</span>
                  <span>{new Date(university.updated_at).toLocaleDateString()}</span>
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
        title="Delete University"
        description="Are you sure you want to delete this university? This will also delete all associated courses and weeks."
        itemName={university.name}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}

