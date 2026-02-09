'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, Plus, Pencil, Trash2, Briefcase, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DataTable } from '@/components/admin/data-table';
import { DeleteConfirmDialog } from '@/components/admin/delete-confirm-dialog';
import { PageHeader, EmptyState } from '@/components/shared';
import { useJobs, useDeleteJob } from '@/hooks/use-jobs';
import { useCareerDomains } from '@/hooks/use-career-domains';
import { Job } from '@/types';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

function formatSalary(min?: number, max?: number): string {
  if (!min && !max) return '-';
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  });
  if (min && max) {
    return `${formatter.format(min)} - ${formatter.format(max)}`;
  }
  if (min) return `From ${formatter.format(min)}`;
  if (max) return `Up to ${formatter.format(max)}`;
  return '-';
}

export default function JobsListPage() {
  const router = useRouter();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [careerDomainFilter, setCareerDomainFilter] = useState<string>('all');

  const { data, isLoading } = useJobs();
  const { data: careerDomainsData } = useCareerDomains();
  const deleteMutation = useDeleteJob();

  const handleDelete = async () => {
    if (!selectedJob) return;

    try {
      await deleteMutation.mutateAsync(selectedJob.id);
      toast.success('Job deleted successfully');
      setDeleteDialogOpen(false);
      setSelectedJob(null);
    } catch (error) {
      toast.error('Failed to delete job');
    }
  };

  const columns: ColumnDef<Job>[] = [
    {
      accessorKey: 'title',
      header: 'Title',
      cell: ({ row }) => (
        <Link
          href={`/admin/jobs/${row.original.id}`}
          className="font-medium hover:text-primary"
        >
          {row.original.title}
        </Link>
      ),
    },
    {
      accessorKey: 'career_domain',
      header: 'Career Domain',
      cell: ({ row }) => {
        const domain = row.original.career_domain;
        if (!domain) return <span className="text-muted-foreground">-</span>;
        return (
          <Badge variant="outline">
            {domain.code}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'cluster_count',
      header: 'Clusters',
      cell: ({ row }) => {
        const count = row.original.cluster_count ?? 0;
        const isValid = count === 4;
        return (
          <Badge variant={isValid ? 'secondary' : 'destructive'}>
            {count} / 4
          </Badge>
        );
      },
    },
    {
      id: 'salary',
      header: 'Salary Range',
      cell: ({ row }) => (
        <span className="text-muted-foreground">
          {formatSalary(row.original.salary_min, row.original.salary_max)}
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
            <DropdownMenuItem onClick={() => router.push(`/admin/jobs/${row.original.id}/edit`)}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setSelectedJob(row.original);
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

  const allJobsData = data?.data ?? [];

  // Filter by career domain
  const jobsData = careerDomainFilter === 'all'
    ? allJobsData
    : allJobsData.filter(job => job.career_domain_id === careerDomainFilter);

  return (
    <div>
      <PageHeader
        title="Jobs"
        description="Manage cybersecurity job roles and their cluster mappings"
        breadcrumbs={[
          { label: 'Admin', href: '/admin/dashboard' },
          { label: 'Jobs' },
        ]}
        actions={
          <div className="flex items-center gap-4">
            <Select value={careerDomainFilter} onValueChange={setCareerDomainFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by domain" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Domains</SelectItem>
                {(careerDomainsData ?? []).map((domain) => (
                  <SelectItem key={domain.id} value={domain.id}>
                    {domain.code} - {domain.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Link href="/admin/jobs/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Job
              </Button>
            </Link>
          </div>
        }
      />

      {!isLoading && jobsData.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="No jobs found"
          description="Get started by creating your first cybersecurity job role."
          action={{
            label: 'Add Job',
            onClick: () => router.push('/admin/jobs/new'),
          }}
        />
      ) : (
        <DataTable
          columns={columns}
          data={jobsData}
          searchKey="title"
          searchPlaceholder="Search jobs..."
          isLoading={isLoading}
        />
      )}

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDelete}
        title="Delete Job"
        description="Are you sure you want to delete this job? This action cannot be undone."
        itemName={selectedJob?.title}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}

