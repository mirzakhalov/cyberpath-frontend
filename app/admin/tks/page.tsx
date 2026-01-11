'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, Plus, Pencil, Trash2, Brain } from 'lucide-react';
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
import { useTKSList, useDeleteTKS } from '@/hooks/use-tks';
import { TKS, TKSCategory } from '@/types';
import { toast } from 'sonner';

const categoryColors: Record<TKSCategory, string> = {
  task: 'bg-blue-100 text-blue-800',
  knowledge: 'bg-green-100 text-green-800',
  skill: 'bg-purple-100 text-purple-800',
};

const categoryLabels: Record<TKSCategory, string> = {
  task: 'Task',
  knowledge: 'Knowledge',
  skill: 'Skill',
};

export default function TKSListPage() {
  const router = useRouter();
  const [categoryFilter, setCategoryFilter] = useState<TKSCategory | 'all'>('all');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedTKS, setSelectedTKS] = useState<TKS | null>(null);

  const { data, isLoading } = useTKSList({
    category: categoryFilter === 'all' ? undefined : categoryFilter,
  });
  const deleteMutation = useDeleteTKS();

  const handleDelete = async () => {
    if (!selectedTKS) return;

    try {
      await deleteMutation.mutateAsync(selectedTKS.id);
      toast.success('TKS deleted successfully');
      setDeleteDialogOpen(false);
      setSelectedTKS(null);
    } catch (error) {
      toast.error('Failed to delete TKS');
    }
  };

  const columns: ColumnDef<TKS>[] = [
    {
      accessorKey: 'code',
      header: 'Code',
      cell: ({ row }) => (
        <Link
          href={`/admin/tks/${row.original.id}`}
          className="font-mono text-sm font-medium hover:text-primary"
        >
          {row.original.code}
        </Link>
      ),
    },
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => (
        <Link
          href={`/admin/tks/${row.original.id}`}
          className="hover:text-primary line-clamp-2"
        >
          {row.original.name}
        </Link>
      ),
    },
    {
      accessorKey: 'category',
      header: 'Category',
      cell: ({ row }) => (
        <Badge variant="secondary" className={categoryColors[row.original.category]}>
          {categoryLabels[row.original.category]}
        </Badge>
      ),
    },
    {
      accessorKey: 'cluster_count',
      header: 'Clusters',
      cell: ({ row }) => (
        <span className="text-muted-foreground">{row.original.cluster_count ?? 0}</span>
      ),
    },
    {
      accessorKey: 'topic_count',
      header: 'Topics',
      cell: ({ row }) => (
        <span className="text-muted-foreground">{row.original.topic_count ?? 0}</span>
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
            <DropdownMenuItem onClick={() => router.push(`/admin/tks/${row.original.id}/edit`)}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setSelectedTKS(row.original);
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

  const tksData = data?.data ?? [];

  return (
    <div>
      <PageHeader
        title="TKSs (Tasks, Knowledge, Skills)"
        description="Manage the NICE Framework competencies"
        breadcrumbs={[
          { label: 'Admin', href: '/admin/dashboard' },
          { label: 'TKSs' },
        ]}
        actions={
          <Link href="/admin/tks/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add TKS
            </Button>
          </Link>
        }
      />

      {/* Filters */}
      <div className="flex items-center gap-4 mb-6">
        <Select
          value={categoryFilter}
          onValueChange={(value) => setCategoryFilter(value as TKSCategory | 'all')}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="task">Tasks</SelectItem>
            <SelectItem value="knowledge">Knowledge</SelectItem>
            <SelectItem value="skill">Skills</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {!isLoading && tksData.length === 0 ? (
        <EmptyState
          icon={Brain}
          title="No TKSs found"
          description="Get started by adding your first Task, Knowledge, or Skill from the NICE Framework."
          action={{
            label: 'Add TKS',
            onClick: () => router.push('/admin/tks/new'),
          }}
        />
      ) : (
        <DataTable
          columns={columns}
          data={tksData}
          searchKey="name"
          searchPlaceholder="Search by name..."
          isLoading={isLoading}
        />
      )}

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDelete}
        title="Delete TKS"
        description="Are you sure you want to delete this TKS? This action cannot be undone and may affect clusters and topics that reference it."
        itemName={selectedTKS?.name}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}

