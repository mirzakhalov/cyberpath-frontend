'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/shared';
import { 
  Briefcase, 
  Layers, 
  Brain, 
  BookOpen, 
  GraduationCap, 
  BookMarked,
  Calendar,
  ArrowRight
} from 'lucide-react';
import { useJobs } from '@/hooks/use-jobs';
import { useClusters } from '@/hooks/use-clusters';
import { useTKSList } from '@/hooks/use-tks';
import { useTopics } from '@/hooks/use-topics';
import { useUniversities } from '@/hooks/use-universities';
import { useCourses } from '@/hooks/use-courses';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface StatCardProps {
  title: string;
  value: number | undefined;
  description: string;
  icon: React.ElementType;
  href: string;
  isLoading?: boolean;
}

function StatCard({ title, value, description, icon: Icon, href, isLoading }: StatCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon className="h-4 w-4 text-primary" />
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-8 w-16 mb-1" />
        ) : (
          <div className="text-3xl font-bold">{value ?? 0}</div>
        )}
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
        <Link href={href} className="inline-flex items-center text-xs text-primary mt-3 hover:underline">
          View all <ArrowRight className="h-3 w-3 ml-1" />
        </Link>
      </CardContent>
    </Card>
  );
}

interface QuickActionProps {
  title: string;
  description: string;
  href: string;
  icon: React.ElementType;
}

function QuickAction({ title, description, href, icon: Icon }: QuickActionProps) {
  return (
    <Link href={href}>
      <Card className="hover:shadow-md hover:border-primary/50 transition-all cursor-pointer h-full">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="h-10 w-10 rounded-lg bg-accent flex items-center justify-center shrink-0">
              <Icon className="h-5 w-5 text-accent-foreground" />
            </div>
            <div>
              <h3 className="font-semibold">{title}</h3>
              <p className="text-sm text-muted-foreground mt-1">{description}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export default function DashboardPage() {
  const { data: jobsData, isLoading: jobsLoading } = useJobs({ page_size: 1 });
  const { data: clustersData, isLoading: clustersLoading } = useClusters({ page_size: 1 });
  const { data: tksData, isLoading: tksLoading } = useTKSList({ page_size: 1 });
  const { data: topicsData, isLoading: topicsLoading } = useTopics({ page_size: 1 });
  const { data: universitiesData, isLoading: universitiesLoading } = useUniversities({ page_size: 1 });
  const { data: coursesData, isLoading: coursesLoading } = useCourses({ page_size: 1 });

  const stats = [
    {
      title: 'Total Jobs',
      value: jobsData?.meta?.total,
      description: 'Cybersecurity job roles',
      icon: Briefcase,
      href: '/admin/jobs',
      isLoading: jobsLoading,
    },
    {
      title: 'NICE Clusters',
      value: clustersData?.meta?.total,
      description: 'Competency groupings',
      icon: Layers,
      href: '/admin/clusters',
      isLoading: clustersLoading,
    },
    {
      title: 'TKSs',
      value: tksData?.meta?.total,
      description: 'Tasks, Knowledge & Skills',
      icon: Brain,
      href: '/admin/tks',
      isLoading: tksLoading,
    },
    {
      title: 'Topics',
      value: topicsData?.meta?.total,
      description: 'Educational topics',
      icon: BookOpen,
      href: '/admin/topics',
      isLoading: topicsLoading,
    },
    {
      title: 'Universities',
      value: universitiesData?.meta?.total,
      description: 'Partner institutions',
      icon: GraduationCap,
      href: '/admin/universities',
      isLoading: universitiesLoading,
    },
    {
      title: 'Courses',
      value: coursesData?.meta?.total,
      description: 'Available courses',
      icon: BookMarked,
      href: '/admin/courses',
      isLoading: coursesLoading,
    },
  ];

  const quickActions = [
    {
      title: 'Add New Job',
      description: 'Create a new cybersecurity job role with cluster mappings',
      href: '/admin/jobs/new',
      icon: Briefcase,
    },
    {
      title: 'Add New TKS',
      description: 'Add a Task, Knowledge, or Skill to the framework',
      href: '/admin/tks/new',
      icon: Brain,
    },
    {
      title: 'Add New Topic',
      description: 'Create an educational topic with TKS mappings',
      href: '/admin/topics/new',
      icon: BookOpen,
    },
    {
      title: 'Add New Course',
      description: 'Add a course from a partner university',
      href: '/admin/courses/new',
      icon: BookMarked,
    },
  ];

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Overview of your CyberPath platform data"
        breadcrumbs={[
          { label: 'Admin', href: '/admin/dashboard' },
          { label: 'Dashboard' },
        ]}
      />

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 mb-8">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action) => (
            <QuickAction key={action.title} {...action} />
          ))}
        </div>
      </div>

      {/* Getting Started Guide */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Getting Started
          </CardTitle>
          <CardDescription>
            Follow these steps to set up your CyberPath curriculum
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ol className="space-y-4">
            <li className="flex items-start gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                1
              </span>
              <div>
                <p className="font-medium">Import TKSs from NICE Framework</p>
                <p className="text-sm text-muted-foreground">
                  Start by adding Tasks, Knowledge, and Skills from the NICE Cybersecurity Workforce Framework.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                2
              </span>
              <div>
                <p className="font-medium">Create NICE Clusters</p>
                <p className="text-sm text-muted-foreground">
                  Group related TKSs into clusters that represent competency areas.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                3
              </span>
              <div>
                <p className="font-medium">Define Jobs</p>
                <p className="text-sm text-muted-foreground">
                  Create job roles and map them to exactly 4 NICE clusters each.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                4
              </span>
              <div>
                <p className="font-medium">Add Topics and Curriculum</p>
                <p className="text-sm text-muted-foreground">
                  Create educational topics, add universities and courses, then map course weeks to topics.
                </p>
              </div>
            </li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}

