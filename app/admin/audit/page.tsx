'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ColumnDef } from '@tanstack/react-table';
import { 
  Bot, 
  MoreHorizontal, 
  Eye, 
  User, 
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
  AlertCircle,
  Coins,
  MessageSquare,
  Timer
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Skeleton } from '@/components/ui/skeleton';
import { useAgentSessions, useAgentStats } from '@/hooks/use-dashboard';
import { AgentSessionListItem, WorkflowType, SessionStatus } from '@/types';
import { formatDistanceToNow } from 'date-fns';

const statusConfig: Record<SessionStatus, { icon: React.ElementType; color: string; label: string }> = {
  pending: { icon: Clock, color: 'bg-slate-100 text-slate-700 border-slate-200', label: 'Pending' },
  in_progress: { icon: Loader2, color: 'bg-blue-100 text-blue-700 border-blue-200', label: 'Running' },
  completed: { icon: CheckCircle2, color: 'bg-emerald-100 text-emerald-700 border-emerald-200', label: 'Completed' },
  failed: { icon: XCircle, color: 'bg-red-100 text-red-700 border-red-200', label: 'Failed' },
};

const workflowLabels: Record<WorkflowType, string> = {
  job_recommendation: 'Job Recommendation',
  pathway_generation: 'Pathway Generation',
  tks_analysis: 'TKS Analysis',
};

function formatDuration(ms: number | null): string {
  if (ms === null) return '-';
  const seconds = Math.floor(ms / 1000);
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}m ${remainingSeconds}s`;
}

function formatCost(cost: number | null | undefined): string {
  if (cost === null || cost === undefined) return '$0.0000';
  return `$${cost.toFixed(4)}`;
}

function formatTokens(tokens: number | null | undefined): string {
  if (tokens === null || tokens === undefined) return '0';
  if (tokens >= 1000) {
    return `${(tokens / 1000).toFixed(1)}k`;
  }
  return tokens.toString();
}

function StatCard({
  title,
  value,
  description,
  icon: Icon,
  isLoading,
}: {
  title: string;
  value: string | number;
  description?: string;
  icon: React.ElementType;
  isLoading?: boolean;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-8 w-20" />
        ) : (
          <div className="text-2xl font-bold">{value}</div>
        )}
        {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
      </CardContent>
    </Card>
  );
}

export default function AuditListPage() {
  const [workflowFilter, setWorkflowFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [days, setDays] = useState<number>(30);

  const { data, isLoading } = useAgentSessions({
    workflow_type: workflowFilter === 'all' ? undefined : workflowFilter as WorkflowType,
    status: statusFilter === 'all' ? undefined : statusFilter as SessionStatus,
    page_size: 100,
  });

  const { data: stats, isLoading: statsLoading } = useAgentStats(days);

  const columns: ColumnDef<AgentSessionListItem>[] = [
    {
      accessorKey: 'user',
      header: 'User',
      cell: ({ row }) => {
        const user = row.original.user;
        if (!user) {
          return (
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Unknown user</span>
            </div>
          );
        }
        return (
          <Link
            href={`/admin/students/${user.id}`}
            className="hover:text-primary"
          >
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <div>
                <div className="font-medium text-sm">{user.name || 'No name'}</div>
                <div className="text-xs text-muted-foreground">{user.email}</div>
              </div>
            </div>
          </Link>
        );
      },
    },
    {
      accessorKey: 'workflow_type',
      header: 'Workflow',
      cell: ({ row }) => (
        <Badge variant="outline">
          {workflowLabels[row.original.workflow_type]}
        </Badge>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const config = statusConfig[row.original.status];
        const Icon = config.icon;
        return (
          <Badge variant="outline" className={config.color}>
            <Icon className={`mr-1 h-3 w-3 ${row.original.status === 'in_progress' ? 'animate-spin' : ''}`} />
            {config.label}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'decision_count',
      header: 'Decisions',
      cell: ({ row }) => (
        <div className="flex items-center gap-1.5">
          <MessageSquare className="h-4 w-4 text-muted-foreground" />
          <span>{row.original.decision_count}</span>
        </div>
      ),
    },
    {
      accessorKey: 'total_duration_ms',
      header: 'Duration',
      cell: ({ row }) => (
        <span className="text-sm">
          {formatDuration(row.original.total_duration_ms)}
        </span>
      ),
    },
    {
      accessorKey: 'tokens',
      header: 'Tokens',
      cell: ({ row }) => (
        <div className="text-sm">
          <span className="text-muted-foreground">In:</span> {formatTokens(row.original.total_input_tokens)}{' '}
          <span className="text-muted-foreground">Out:</span> {formatTokens(row.original.total_output_tokens)}
        </div>
      ),
    },
    {
      accessorKey: 'estimated_cost_usd',
      header: 'Cost',
      cell: ({ row }) => (
        <Badge variant="secondary">
          {formatCost(row.original.estimated_cost_usd)}
        </Badge>
      ),
    },
    {
      accessorKey: 'started_at',
      header: 'Started',
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {formatDistanceToNow(new Date(row.original.started_at), { addSuffix: true })}
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
              <Link href={`/admin/audit/${row.original.id}`}>
                <Eye className="mr-2 h-4 w-4" />
                Inspect Decisions
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const sessionsData = data?.data ?? [];

  return (
    <div>
      <PageHeader
        title="AI Audit Log"
        description="Inspect and analyze LLM decisions made during student onboarding"
        breadcrumbs={[
          { label: 'Admin', href: '/admin/dashboard' },
          { label: 'Audit' },
        ]}
      />

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5 mb-6">
        <StatCard
          title="Total Sessions"
          value={stats?.total_sessions ?? 0}
          description={`Last ${days} days`}
          icon={Bot}
          isLoading={statsLoading}
        />
        <StatCard
          title="Completed"
          value={stats?.status_breakdown?.completed ?? 0}
          icon={CheckCircle2}
          isLoading={statsLoading}
        />
        <StatCard
          title="Failed"
          value={stats?.status_breakdown?.failed ?? 0}
          icon={AlertCircle}
          isLoading={statsLoading}
        />
        <StatCard
          title="Avg Duration"
          value={formatDuration(stats?.averages?.duration_ms ?? null)}
          icon={Timer}
          isLoading={statsLoading}
        />
        <StatCard
          title="Total Cost"
          value={formatCost(stats?.totals?.estimated_cost_usd ?? 0)}
          description={`${days} days`}
          icon={Coins}
          isLoading={statsLoading}
        />
      </div>

      {/* Error Rate Banner */}
      {stats && stats.error_rate_percent > 5 && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-red-600" />
          <div>
            <div className="font-medium text-red-800">High Error Rate Detected</div>
            <div className="text-sm text-red-600">
              {stats.error_rate_percent.toFixed(1)}% of sessions are failing. Review the failed sessions below.
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <Select value={workflowFilter} onValueChange={setWorkflowFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Workflow type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Workflows</SelectItem>
            <SelectItem value="job_recommendation">Job Recommendation</SelectItem>
            <SelectItem value="pathway_generation">Pathway Generation</SelectItem>
            <SelectItem value="tks_analysis">TKS Analysis</SelectItem>
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="in_progress">Running</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
          </SelectContent>
        </Select>

        <Select value={days.toString()} onValueChange={(v) => setDays(parseInt(v))}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Time period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">Last 7 days</SelectItem>
            <SelectItem value="30">Last 30 days</SelectItem>
            <SelectItem value="90">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {!isLoading && sessionsData.length === 0 ? (
        <EmptyState
          icon={Bot}
          title="No AI sessions found"
          description={
            workflowFilter !== 'all' || statusFilter !== 'all'
              ? 'No sessions match the current filters. Try adjusting your filters.'
              : 'No AI sessions have been recorded yet.'
          }
        />
      ) : (
        <DataTable
          columns={columns}
          data={sessionsData}
          searchKey="user"
          searchPlaceholder="Search by user..."
          isLoading={isLoading}
        />
      )}
    </div>
  );
}

