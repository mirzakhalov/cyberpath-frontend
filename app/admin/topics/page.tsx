'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, Plus, Pencil, Trash2, BookOpen } from 'lucide-react';
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
import { useTopics, useDeleteTopic } from '@/hooks/use-topics';
import { Topic } from '@/types';
import { toast } from 'sonner';

export default function TopicsListPage() {
  const router = useRouter();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);

  const { data, isLoading } = useTopics();
  const deleteMutation = useDeleteTopic();

  const handleDelete = async () => {
    if (!selectedTopic) return;

    try {
      await deleteMutation.mutateAsync(selectedTopic.id);
      toast.success('Topic deleted successfully');
      setDeleteDialogOpen(false);
      setSelectedTopic(null);
    } catch (error) {
      toast.error('Failed to delete topic');
    }
  };

  const columns: ColumnDef<Topic>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => (
        <Link
          href={`/admin/topics/${row.original.id}`}
          className="font-medium hover:text-primary"
        >
          {row.original.name}
        </Link>
      ),
    },
    {
      accessorKey: 'tks_count',
      header: 'TKSs',
      cell: ({ row }) => (
        <span className="text-muted-foreground">{row.original.tks_count ?? 0}</span>
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
            <DropdownMenuItem onClick={() => router.push(`/admin/topics/${row.original.id}/edit`)}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setSelectedTopic(row.original);
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

  const topicsData = data?.data ?? [];

  return (
    <div>
      <PageHeader
        title="Topics"
        description="Manage educational topics that satisfy TKS requirements"
        breadcrumbs={[
          { label: 'Admin', href: '/admin/dashboard' },
          { label: 'Topics' },
        ]}
        actions={
          <Link href="/admin/topics/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Topic
            </Button>
          </Link>
        }
      />

      {!isLoading && topicsData.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No topics found"
          description="Get started by creating your first educational topic."
          action={{
            label: 'Add Topic',
            onClick: () => router.push('/admin/topics/new'),
          }}
        />
      ) : (
        <DataTable
          columns={columns}
          data={topicsData}
          searchKey="name"
          searchPlaceholder="Search topics..."
          isLoading={isLoading}
        />
      )}

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDelete}
        title="Delete Topic"
        description="Are you sure you want to delete this topic? This may affect course weeks that reference it."
        itemName={selectedTopic?.name}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}

