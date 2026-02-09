'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PageHeader } from '@/components/shared';
import { Skeleton } from '@/components/ui/skeleton';
import { useProgress } from '@/hooks/use-dashboard';
import { 
  Route,
  Users,
  TrendingUp,
  CheckCircle2,
  Clock,
  PlayCircle,
  XCircle,
  Briefcase,
  Calendar,
  ArrowRight
} from 'lucide-react';
import { format, subDays } from 'date-fns';

function StatCard({
  title,
  value,
  description,
  icon: Icon,
  isLoading,
}: {
  title: string;
  value: string | number;
  description: string;
  icon: React.ElementType;
  isLoading?: boolean;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon className="h-4 w-4 text-primary" />
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-8 w-20" />
        ) : (
          <div className="text-3xl font-bold">{value}</div>
        )}
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      </CardContent>
    </Card>
  );
}

function StatusBreakdownCard({
  breakdown,
  isLoading,
}: {
  breakdown?: {
    not_started: number;
    in_progress: number;
    completed: number;
    skipped: number;
  };
  isLoading?: boolean;
}) {
  const items = [
    { key: 'not_started', label: 'Not Started', icon: Clock, color: 'bg-slate-100 text-slate-700' },
    { key: 'in_progress', label: 'In Progress', icon: PlayCircle, color: 'bg-blue-100 text-blue-700' },
    { key: 'completed', label: 'Completed', icon: CheckCircle2, color: 'bg-emerald-100 text-emerald-700' },
    { key: 'skipped', label: 'Skipped', icon: XCircle, color: 'bg-amber-100 text-amber-700' },
  ];

  const total = breakdown 
    ? breakdown.not_started + breakdown.in_progress + breakdown.completed + breakdown.skipped 
    : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Week Status Breakdown</CardTitle>
        <CardDescription>Distribution of learning progress across all weeks</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {items.map(({ key, label, icon: Icon, color }) => {
              const value = breakdown?.[key as keyof typeof breakdown] || 0;
              const percentage = total > 0 ? (value / total) * 100 : 0;
              
              return (
                <div key={key} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className={color}>
                        <Icon className="mr-1 h-3 w-3" />
                        {label}
                      </Badge>
                    </div>
                    <span className="text-sm font-medium">
                      {value.toLocaleString()} ({percentage.toFixed(1)}%)
                    </span>
                  </div>
                  <Progress value={percentage} className="h-2" />
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function CompletionBucketsCard({
  buckets,
  isLoading,
}: {
  buckets?: {
    '0-25%': number;
    '25-50%': number;
    '50-75%': number;
    '75-100%': number;
  };
  isLoading?: boolean;
}) {
  const items = [
    { key: '0-25%', label: '0-25%', color: 'bg-red-500' },
    { key: '25-50%', label: '25-50%', color: 'bg-amber-500' },
    { key: '50-75%', label: '50-75%', color: 'bg-blue-500' },
    { key: '75-100%', label: '75-100%', color: 'bg-emerald-500' },
  ];

  const total = buckets 
    ? buckets['0-25%'] + buckets['25-50%'] + buckets['50-75%'] + buckets['75-100%']
    : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pathway Completion Distribution</CardTitle>
        <CardDescription>How far students have progressed in their pathways</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-8 w-full" />
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
          </div>
        ) : (
          <>
            {/* Progress bar visualization */}
            <div className="flex h-8 rounded-lg overflow-hidden mb-6">
              {items.map(({ key, color }) => {
                const value = buckets?.[key as keyof typeof buckets] || 0;
                const percentage = total > 0 ? (value / total) * 100 : 0;
                
                return percentage > 0 ? (
                  <div 
                    key={key} 
                    className={`${color} flex items-center justify-center text-white text-xs font-medium`}
                    style={{ width: `${percentage}%` }}
                  >
                    {percentage > 10 && `${percentage.toFixed(0)}%`}
                  </div>
                ) : null;
              })}
            </div>

            {/* Legend */}
            <div className="grid grid-cols-4 gap-4">
              {items.map(({ key, label, color }) => {
                const value = buckets?.[key as keyof typeof buckets] || 0;
                
                return (
                  <div key={key} className="text-center">
                    <div className={`h-3 w-full rounded ${color} mb-2`} />
                    <div className="text-2xl font-bold">{value}</div>
                    <div className="text-xs text-muted-foreground">{label}</div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

function PopularJobsCard({
  jobs,
  isLoading,
}: {
  jobs?: Array<{ id: string; title: string; pathway_count: number }>;
  isLoading?: boolean;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Briefcase className="h-5 w-5" />
          Popular Jobs
        </CardTitle>
        <CardDescription>Most selected career paths</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : jobs && jobs.length > 0 ? (
          <div className="space-y-3">
            {jobs.slice(0, 5).map((job, index) => (
              <Link 
                key={job.id} 
                href={`/admin/jobs/${job.id}`}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-accent transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                    {index + 1}
                  </span>
                  <span className="font-medium">{job.title}</span>
                </div>
                <Badge variant="secondary">{job.pathway_count} pathways</Badge>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No data available
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function ActivityTimelineCard({
  timeline,
  days,
  isLoading,
}: {
  timeline?: Array<{ date: string; completions: number }>;
  days: number;
  isLoading?: boolean;
}) {
  const maxCompletions = timeline ? Math.max(...timeline.map(t => t.completions), 1) : 1;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Activity Timeline
        </CardTitle>
        <CardDescription>Week completions over the past {days} days</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-40 w-full" />
        ) : timeline && timeline.length > 0 ? (
          <div className="flex items-end gap-1 h-40">
            {timeline.map((item) => {
              const height = (item.completions / maxCompletions) * 100;
              return (
                <div
                  key={item.date}
                  className="flex-1 group relative"
                >
                  <div
                    className="bg-primary/80 hover:bg-primary rounded-t transition-colors w-full"
                    style={{ height: `${Math.max(height, 4)}%` }}
                  />
                  <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover:block bg-popover border rounded-lg px-2 py-1 text-xs shadow-lg whitespace-nowrap z-10">
                    <div className="font-medium">{item.completions} completions</div>
                    <div className="text-muted-foreground">{format(new Date(item.date), 'MMM d')}</div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="h-40 flex items-center justify-center text-muted-foreground">
            No activity data available
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function ProgressPage() {
  const [days, setDays] = useState<number>(30);
  
  const { data, isLoading } = useProgress(days);

  return (
    <div>
      <PageHeader
        title="Progress Overview"
        description="Analytics and insights on student learning progress"
        breadcrumbs={[
          { label: 'Admin', href: '/admin/dashboard' },
          { label: 'Progress' },
        ]}
        actions={
          <Select value={days.toString()} onValueChange={(v) => setDays(parseInt(v))}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Time period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
              <SelectItem value="365">Last year</SelectItem>
            </SelectContent>
          </Select>
        }
      />

      {/* Key Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <StatCard
          title="Total Pathways"
          value={data?.overview.total_pathways ?? 0}
          description="Generated learning paths"
          icon={Route}
          isLoading={isLoading}
        />
        <StatCard
          title="Students with Pathways"
          value={data?.overview.total_students_with_pathways ?? 0}
          description="Active learners"
          icon={Users}
          isLoading={isLoading}
        />
        <StatCard
          title="Average Progress"
          value={`${(data?.overview.average_completion_percentage ?? 0).toFixed(1)}%`}
          description="Across all pathways"
          icon={TrendingUp}
          isLoading={isLoading}
        />
        <StatCard
          title="Recent Completions"
          value={data?.overview.recent_completions ?? 0}
          description={`Weeks completed in ${days} days`}
          icon={CheckCircle2}
          isLoading={isLoading}
        />
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 md:grid-cols-2 mb-6">
        <StatusBreakdownCard 
          breakdown={data?.status_breakdown} 
          isLoading={isLoading} 
        />
        <CompletionBucketsCard 
          buckets={data?.completion_buckets} 
          isLoading={isLoading} 
        />
      </div>

      {/* Bottom Row */}
      <div className="grid gap-6 md:grid-cols-2">
        <PopularJobsCard 
          jobs={data?.popular_jobs} 
          isLoading={isLoading} 
        />
        <ActivityTimelineCard 
          timeline={data?.activity_timeline} 
          days={days}
          isLoading={isLoading} 
        />
      </div>
    </div>
  );
}



