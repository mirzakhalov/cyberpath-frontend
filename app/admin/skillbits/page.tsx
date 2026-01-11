'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, Plus, Pencil, Trash2, Zap, ExternalLink } from 'lucide-react';
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
import { useSkillBits, useDeleteSkillBit } from '@/hooks/use-skillbits';
import { SkillBitChallenge } from '@/types';
import { toast } from 'sonner';

export default function SkillBitsListPage() {
  const router = useRouter();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedSkillBit, setSelectedSkillBit] = useState<SkillBitChallenge | null>(null);

  const { data, isLoading } = useSkillBits();
  const deleteMutation = useDeleteSkillBit();

  const handleDelete = async () => {
    if (!selectedSkillBit) return;

    try {
      await deleteMutation.mutateAsync(selectedSkillBit.id);
      toast.success('SkillBit challenge deleted successfully');
      setDeleteDialogOpen(false);
      setSelectedSkillBit(null);
    } catch (error) {
      toast.error('Failed to delete SkillBit challenge');
    }
  };

  const columns: ColumnDef<SkillBitChallenge>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => (
        <Link
          href={`/admin/skillbits/${row.original.id}`}
          className="font-medium hover:text-primary"
        >
          {row.original.name}
        </Link>
      ),
    },
    {
      accessorKey: 'external_id',
      header: 'External ID',
      cell: ({ row }) => (
        <span className="font-mono text-sm text-muted-foreground">
          {row.original.external_id}
        </span>
      ),
    },
    {
      accessorKey: 'url',
      header: 'URL',
      cell: ({ row }) => (
        <a
          href={row.original.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-primary hover:underline"
        >
          <ExternalLink className="h-3 w-3" />
          Open
        </a>
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
            <DropdownMenuItem onClick={() => router.push(`/admin/skillbits/${row.original.id}/edit`)}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setSelectedSkillBit(row.original);
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

  const skillbitsData = data?.data ?? [];

  return (
    <div>
      <PageHeader
        title="SkillBit Challenges"
        description="Manage hands-on challenges associated with course weeks"
        breadcrumbs={[
          { label: 'Admin', href: '/admin/dashboard' },
          { label: 'SkillBit Challenges' },
        ]}
        actions={
          <Link href="/admin/skillbits/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Challenge
            </Button>
          </Link>
        }
      />

      {!isLoading && skillbitsData.length === 0 ? (
        <EmptyState
          icon={Zap}
          title="No SkillBit challenges found"
          description="Get started by adding your first hands-on challenge."
          action={{
            label: 'Add Challenge',
            onClick: () => router.push('/admin/skillbits/new'),
          }}
        />
      ) : (
        <DataTable
          columns={columns}
          data={skillbitsData}
          searchKey="name"
          searchPlaceholder="Search challenges..."
          isLoading={isLoading}
        />
      )}

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDelete}
        title="Delete SkillBit Challenge"
        description="Are you sure you want to delete this challenge?"
        itemName={selectedSkillBit?.name}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}

