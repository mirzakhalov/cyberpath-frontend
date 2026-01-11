'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, Plus, Pencil, Trash2, Layers } from 'lucide-react';
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
import { useClusters, useDeleteCluster } from '@/hooks/use-clusters';
import { Cluster } from '@/types';
import { toast } from 'sonner';

export default function ClustersListPage() {
  const router = useRouter();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCluster, setSelectedCluster] = useState<Cluster | null>(null);

  const { data, isLoading } = useClusters();
  const deleteMutation = useDeleteCluster();

  const handleDelete = async () => {
    if (!selectedCluster) return;

    try {
      await deleteMutation.mutateAsync(selectedCluster.id);
      toast.success('Cluster deleted successfully');
      setDeleteDialogOpen(false);
      setSelectedCluster(null);
    } catch (error) {
      toast.error('Failed to delete cluster');
    }
  };

  const columns: ColumnDef<Cluster>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => (
        <Link
          href={`/admin/clusters/${row.original.id}`}
          className="font-medium hover:text-primary"
        >
          {row.original.name}
        </Link>
      ),
    },
    {
      accessorKey: 'code',
      header: 'Code',
      cell: ({ row }) => (
        <span className="font-mono text-sm text-muted-foreground">
          {row.original.code || '-'}
        </span>
      ),
    },
    {
      accessorKey: 'tks_count',
      header: 'TKS Count',
      cell: ({ row }) => (
        <span className="text-muted-foreground">{row.original.tks_count ?? 0}</span>
      ),
    },
    {
      accessorKey: 'job_count',
      header: 'Jobs',
      cell: ({ row }) => (
        <span className="text-muted-foreground">{row.original.job_count ?? 0}</span>
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
            <DropdownMenuItem onClick={() => router.push(`/admin/clusters/${row.original.id}/edit`)}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setSelectedCluster(row.original);
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

  const clustersData = data?.data ?? [];

  return (
    <div>
      <PageHeader
        title="NICE Clusters"
        description="Manage competency groupings for cybersecurity jobs"
        breadcrumbs={[
          { label: 'Admin', href: '/admin/dashboard' },
          { label: 'Clusters' },
        ]}
        actions={
          <Link href="/admin/clusters/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Cluster
            </Button>
          </Link>
        }
      />

      {!isLoading && clustersData.length === 0 ? (
        <EmptyState
          icon={Layers}
          title="No clusters found"
          description="Get started by creating your first NICE cluster to group related competencies."
          action={{
            label: 'Add Cluster',
            onClick: () => router.push('/admin/clusters/new'),
          }}
        />
      ) : (
        <DataTable
          columns={columns}
          data={clustersData}
          searchKey="name"
          searchPlaceholder="Search clusters..."
          isLoading={isLoading}
        />
      )}

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDelete}
        title="Delete Cluster"
        description="Are you sure you want to delete this cluster? This may affect jobs that reference it."
        itemName={selectedCluster?.name}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}

