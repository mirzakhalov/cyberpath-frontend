'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, Plus, Pencil, Trash2, BookMarked } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DataTable } from '@/components/admin/data-table';
import { DeleteConfirmDialog } from '@/components/admin/delete-confirm-dialog';
import { PageHeader, EmptyState } from '@/components/shared';
import { useCourses, useDeleteCourse } from '@/hooks/use-courses';
import { useUniversities } from '@/hooks/use-universities';
import { Course } from '@/types';
import { toast } from 'sonner';

export default function CoursesListPage() {
  const router = useRouter();
  const [universityFilter, setUniversityFilter] = useState<string>('all');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const { data: universitiesData } = useUniversities({ page_size: 100 });
  const { data, isLoading } = useCourses({
    university_id: universityFilter === 'all' ? undefined : universityFilter,
  });
  const deleteMutation = useDeleteCourse();

  const handleDelete = async () => {
    if (!selectedCourse) return;

    try {
      await deleteMutation.mutateAsync(selectedCourse.id);
      toast.success('Course deleted successfully');
      setDeleteDialogOpen(false);
      setSelectedCourse(null);
    } catch (error) {
      toast.error('Failed to delete course');
    }
  };

  const columns: ColumnDef<Course>[] = [
    {
      accessorKey: 'course_code',
      header: 'Code',
      cell: ({ row }) => (
        <Link
          href={`/admin/courses/${row.original.id}`}
          className="font-mono text-sm font-medium hover:text-primary"
        >
          {row.original.course_code}
        </Link>
      ),
    },
    {
      accessorKey: 'course_name',
      header: 'Name',
      cell: ({ row }) => (
        <Link
          href={`/admin/courses/${row.original.id}`}
          className="hover:text-primary"
        >
          {row.original.course_name}
        </Link>
      ),
    },
    {
      accessorKey: 'university',
      header: 'University',
      cell: ({ row }) => (
        <Link
          href={`/admin/universities/${row.original.university_id}`}
          className="text-muted-foreground hover:text-primary"
        >
          {row.original.university?.name ?? '-'}
        </Link>
      ),
    },
    {
      accessorKey: 'week_count',
      header: 'Weeks',
      cell: ({ row }) => (
        <Badge variant="secondary">{row.original.week_count ?? 0}</Badge>
      ),
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => router.push(`/admin/courses/${row.original.id}/edit`)}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setSelectedCourse(row.original);
                setDeleteDialogOpen(true);
              }}
              className="text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const coursesData = data?.data ?? [];
  const universities = universitiesData?.data ?? [];

  return (
    <div>
      <PageHeader
        title="Courses"
        description="Manage university courses and their weekly content"
        breadcrumbs={[
          { label: 'Admin', href: '/admin/dashboard' },
          { label: 'Courses' },
        ]}
        actions={
          <Link href="/admin/courses/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Course
            </Button>
          </Link>
        }
      />

      {/* Filters */}
      <div className="flex items-center gap-4 mb-6">
        <Select
          value={universityFilter}
          onValueChange={setUniversityFilter}
        >
          <SelectTrigger className="w-[250px]">
            <SelectValue placeholder="Filter by university" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Universities</SelectItem>
            {universities.map((uni) => (
              <SelectItem key={uni.id} value={uni.id}>
                {uni.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {!isLoading && coursesData.length === 0 ? (
        <EmptyState
          icon={BookMarked}
          title="No courses found"
          description={
            universityFilter !== 'all'
              ? 'No courses found for this university. Try a different filter or add a new course.'
              : 'Get started by adding your first course.'
          }
          action={{
            label: 'Add Course',
            onClick: () => router.push('/admin/courses/new'),
          }}
        />
      ) : (
        <DataTable
          columns={columns}
          data={coursesData}
          searchKey="course_name"
          searchPlaceholder="Search courses..."
          isLoading={isLoading}
        />
      )}

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDelete}
        title="Delete Course"
        description="Are you sure you want to delete this course? This will also delete all associated weeks and challenges."
        itemName={selectedCourse?.course_name}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}

