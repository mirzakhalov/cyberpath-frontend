'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ColumnDef } from '@tanstack/react-table';
import { 
  Route, 
  MoreHorizontal, 
  Eye, 
  User, 
  Briefcase,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
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
import { Input } from '@/components/ui/input';
import { DataTable } from '@/components/admin/data-table';
import { PageHeader, EmptyState } from '@/components/shared';
import { usePathways } from '@/hooks/use-dashboard';
import { useJobs } from '@/hooks/use-jobs';
import { PathwayListItem } from '@/types';
import { formatDistanceToNow } from 'date-fns';

function ProgressCell({ progress }: { progress: number }) {
  const getColor = () => {
    if (progress >= 75) return 'bg-emerald-500';
    if (progress >= 50) return 'bg-blue-500';
    if (progress >= 25) return 'bg-amber-500';
    return 'bg-slate-300';
  };

  return (
    <div className="w-24 space-y-1">
      <Progress value={progress} className="h-2" indicatorClassName={getColor()} />
      <span className="text-xs text-muted-foreground">{progress.toFixed(0)}%</span>
    </div>
  );
}

export default function PathwaysListPage() {
  const [jobFilter, setJobFilter] = useState<string>('all');
  const [partialFilter, setPartialFilter] = useState<string>('all');
  const [progressFilter, setProgressFilter] = useState<string>('all');

  const { data: jobsData } = useJobs({ page_size: 100 });
  
  const { data, isLoading } = usePathways({
    job_id: jobFilter === 'all' ? undefined : jobFilter,
    is_partial: partialFilter === 'all' ? undefined : partialFilter === 'yes',
    min_progress: progressFilter === 'all' ? undefined : 
      progressFilter === '0-25' ? 0 : 
      progressFilter === '25-50' ? 25 : 
      progressFilter === '50-75' ? 50 : 75,
    max_progress: progressFilter === 'all' ? undefined : 
      progressFilter === '0-25' ? 25 : 
      progressFilter === '25-50' ? 50 : 
      progressFilter === '50-75' ? 75 : 100,
    page_size: 100,
  });

  const columns: ColumnDef<PathwayListItem>[] = [
    {
      accessorKey: 'user',
      header: 'Student',
      cell: ({ row }) => (
        <Link
          href={`/admin/students/${row.original.user.id}`}
          className="hover:text-primary"
        >
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <div>
              <div className="font-medium">{row.original.user.name || 'No name'}</div>
              <div className="text-xs text-muted-foreground">{row.original.user.email}</div>
            </div>
          </div>
        </Link>
      ),
    },
    {
      accessorKey: 'selected_job',
      header: 'Target Job',
      cell: ({ row }) => (
        <Link
          href={`/admin/jobs/${row.original.selected_job.id}`}
          className="hover:text-primary"
        >
          <div className="flex items-center gap-2">
            <Briefcase className="h-4 w-4 text-muted-foreground" />
            <span>{row.original.selected_job.title}</span>
          </div>
        </Link>
      ),
    },
    {
      accessorKey: 'match_score',
      header: 'Match',
      cell: ({ row }) => (
        <Badge variant="secondary">
          {(row.original.match_score * 100).toFixed(0)}%
        </Badge>
      ),
    },
    {
      accessorKey: 'total_courses',
      header: 'Courses',
      cell: ({ row }) => (
        <span>{row.original.total_courses}</span>
      ),
    },
    {
      accessorKey: 'completion_percentage',
      header: 'Progress',
      cell: ({ row }) => (
        <ProgressCell progress={row.original.completion_percentage} />
      ),
    },
    {
      accessorKey: 'is_partial',
      header: 'Status',
      cell: ({ row }) => (
        row.original.is_partial ? (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
            <AlertTriangle className="mr-1 h-3 w-3" />
            Partial
          </Badge>
        ) : (
          <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
            <CheckCircle2 className="mr-1 h-3 w-3" />
            Complete
          </Badge>
        )
      ),
    },
    {
      accessorKey: 'created_at',
      header: 'Created',
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {formatDistanceToNow(new Date(row.original.created_at), { addSuffix: true })}
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
            <DropdownMenuItem asChild>
              <Link href={`/admin/pathways/${row.original.id}`}>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const pathwaysData = data?.data ?? [];
  const jobs = jobsData?.data ?? [];

  return (
    <div>
      <PageHeader
        title="Pathways"
        description="View all generated learning pathways and their progress"
        breadcrumbs={[
          { label: 'Admin', href: '/admin/dashboard' },
          { label: 'Pathways' },
        ]}
      />

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <Select value={jobFilter} onValueChange={setJobFilter}>
          <SelectTrigger className="w-[220px]">
            <SelectValue placeholder="Filter by job" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Jobs</SelectItem>
            {jobs.map((job) => (
              <SelectItem key={job.id} value={job.id}>
                {job.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={partialFilter} onValueChange={setPartialFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Pathway status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Pathways</SelectItem>
            <SelectItem value="no">Complete Only</SelectItem>
            <SelectItem value="yes">Partial Only</SelectItem>
          </SelectContent>
        </Select>

        <Select value={progressFilter} onValueChange={setProgressFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Progress range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Progress</SelectItem>
            <SelectItem value="0-25">0-25%</SelectItem>
            <SelectItem value="25-50">25-50%</SelectItem>
            <SelectItem value="50-75">50-75%</SelectItem>
            <SelectItem value="75-100">75-100%</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {!isLoading && pathwaysData.length === 0 ? (
        <EmptyState
          icon={Route}
          title="No pathways found"
          description={
            jobFilter !== 'all' || partialFilter !== 'all' || progressFilter !== 'all'
              ? 'No pathways match the current filters. Try adjusting your filters.'
              : 'No pathways have been generated yet.'
          }
        />
      ) : (
        <DataTable
          columns={columns}
          data={pathwaysData}
          searchKey="user"
          searchPlaceholder="Search by student..."
          isLoading={isLoading}
        />
      )}
    </div>
  );
}

