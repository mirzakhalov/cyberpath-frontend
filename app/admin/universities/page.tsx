'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, Plus, Pencil, Trash2, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DataTable } from '@/components/admin/data-table';
import { DeleteConfirmDialog } from '@/components/admin/delete-confirm-dialog';
import { PageHeader, EmptyState } from '@/components/shared';
import { useUniversities, useDeleteUniversity } from '@/hooks/use-universities';
import { University } from '@/types';
import { toast } from 'sonner';

export default function UniversitiesListPage() {
  const router = useRouter();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUniversity, setSelectedUniversity] = useState<University | null>(null);

  const { data, isLoading } = useUniversities();
  const deleteMutation = useDeleteUniversity();

  const handleDelete = async () => {
    if (!selectedUniversity) return;

    try {
      await deleteMutation.mutateAsync(selectedUniversity.id);
      toast.success('University deleted successfully');
      setDeleteDialogOpen(false);
      setSelectedUniversity(null);
    } catch (error) {
      toast.error('Failed to delete university');
    }
  };

  const columns: ColumnDef<University>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => (
        <Link
          href={`/admin/universities/${row.original.id}`}
          className="font-medium hover:text-primary"
        >
          {row.original.name}
        </Link>
      ),
    },
    {
      accessorKey: 'course_count',
      header: 'Courses',
      cell: ({ row }) => (
        <span className="text-muted-foreground">{row.original.course_count ?? 0}</span>
      ),
    },
    {
      accessorKey: 'contact_email',
      header: 'Contact',
      cell: ({ row }) => (
        <span className="text-muted-foreground">
          {row.original.contact_email || '-'}
        </span>
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
            <DropdownMenuItem onClick={() => router.push(`/admin/universities/${row.original.id}/edit`)}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setSelectedUniversity(row.original);
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

  const universitiesData = data?.data ?? [];

  return (
    <div>
      <PageHeader
        title="Universities"
        description="Manage partner institutions and their course catalogs"
        breadcrumbs={[
          { label: 'Admin', href: '/admin/dashboard' },
          { label: 'Universities' },
        ]}
        actions={
          <Link href="/admin/universities/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add University
            </Button>
          </Link>
        }
      />

      {!isLoading && universitiesData.length === 0 ? (
        <EmptyState
          icon={GraduationCap}
          title="No universities found"
          description="Get started by adding your first partner university."
          action={{
            label: 'Add University',
            onClick: () => router.push('/admin/universities/new'),
          }}
        />
      ) : (
        <DataTable
          columns={columns}
          data={universitiesData}
          searchKey="name"
          searchPlaceholder="Search universities..."
          isLoading={isLoading}
        />
      )}

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDelete}
        title="Delete University"
        description="Are you sure you want to delete this university? This will also delete all associated courses."
        itemName={selectedUniversity?.name}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}

