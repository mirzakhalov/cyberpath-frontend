'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ColumnDef } from '@tanstack/react-table';
import { 
  Users, 
  CheckCircle2, 
  XCircle, 
  FileText, 
  Route,
  TrendingUp,
  MoreHorizontal,
  Eye
} from 'lucide-react';
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
import { PageHeader, EmptyState } from '@/components/shared';
import { useStudents } from '@/hooks/use-dashboard';
import { StudentListItem } from '@/types';
import { formatDistanceToNow } from 'date-fns';

function ProgressBadge({ progress }: { progress: number }) {
  const getVariant = () => {
    if (progress >= 75) return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    if (progress >= 50) return 'bg-blue-100 text-blue-800 border-blue-200';
    if (progress >= 25) return 'bg-amber-100 text-amber-800 border-amber-200';
    return 'bg-slate-100 text-slate-800 border-slate-200';
  };

  return (
    <Badge variant="outline" className={getVariant()}>
      {progress.toFixed(0)}%
    </Badge>
  );
}

export default function StudentsListPage() {
  const [pathwayFilter, setPathwayFilter] = useState<string>('all');
  const [documentsFilter, setDocumentsFilter] = useState<string>('all');

  const { data, isLoading } = useStudents({
    has_pathway: pathwayFilter === 'all' ? undefined : pathwayFilter === 'yes',
    has_documents: documentsFilter === 'all' ? undefined : documentsFilter === 'yes',
    page_size: 100,
  });

  const columns: ColumnDef<StudentListItem>[] = [
    {
      accessorKey: 'email',
      header: 'Student',
      cell: ({ row }) => (
        <Link
          href={`/admin/students/${row.original.id}`}
          className="hover:text-primary"
        >
          <div>
            <div className="font-medium">{row.original.name || 'No name'}</div>
            <div className="text-sm text-muted-foreground">{row.original.email}</div>
          </div>
        </Link>
      ),
    },
    {
      accessorKey: 'consent',
      header: 'Status',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          {row.original.age_verified && row.original.consent_given ? (
            <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
              <CheckCircle2 className="mr-1 h-3 w-3" />
              Verified
            </Badge>
          ) : (
            <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
              <XCircle className="mr-1 h-3 w-3" />
              Pending
            </Badge>
          )}
        </div>
      ),
    },
    {
      accessorKey: 'document_count',
      header: 'Documents',
      cell: ({ row }) => (
        <div className="flex items-center gap-1.5">
          <FileText className="h-4 w-4 text-muted-foreground" />
          <span>{row.original.document_count}</span>
        </div>
      ),
    },
    {
      accessorKey: 'pathway_count',
      header: 'Pathways',
      cell: ({ row }) => (
        <div className="flex items-center gap-1.5">
          <Route className="h-4 w-4 text-muted-foreground" />
          <span>{row.original.pathway_count}</span>
        </div>
      ),
    },
    {
      accessorKey: 'average_progress',
      header: 'Progress',
      cell: ({ row }) => (
        row.original.pathway_count > 0 ? (
          <ProgressBadge progress={row.original.average_progress} />
        ) : (
          <span className="text-muted-foreground">-</span>
        )
      ),
    },
    {
      accessorKey: 'last_activity',
      header: 'Last Activity',
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {row.original.last_activity 
            ? formatDistanceToNow(new Date(row.original.last_activity), { addSuffix: true })
            : 'Never'
          }
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
              <Link href={`/admin/students/${row.original.id}`}>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const studentsData = data?.data ?? [];

  return (
    <div>
      <PageHeader
        title="Students"
        description="View and manage student accounts and their learning progress"
        breadcrumbs={[
          { label: 'Admin', href: '/admin/dashboard' },
          { label: 'Students' },
        ]}
      />

      {/* Filters */}
      <div className="flex items-center gap-4 mb-6">
        <Select value={pathwayFilter} onValueChange={setPathwayFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Pathway status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Students</SelectItem>
            <SelectItem value="yes">Has Pathway</SelectItem>
            <SelectItem value="no">No Pathway</SelectItem>
          </SelectContent>
        </Select>

        <Select value={documentsFilter} onValueChange={setDocumentsFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Document status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Documents</SelectItem>
            <SelectItem value="yes">Has Documents</SelectItem>
            <SelectItem value="no">No Documents</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {!isLoading && studentsData.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No students found"
          description={
            pathwayFilter !== 'all' || documentsFilter !== 'all'
              ? 'No students match the current filters. Try adjusting your filters.'
              : 'No students have registered yet.'
          }
        />
      ) : (
        <DataTable
          columns={columns}
          data={studentsData}
          searchKey="email"
          searchPlaceholder="Search by email..."
          isLoading={isLoading}
        />
      )}
    </div>
  );
}



