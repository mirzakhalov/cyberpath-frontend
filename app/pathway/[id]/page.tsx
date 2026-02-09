'use client';

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import Link from 'next/link';
import {
  ArrowLeft,
  Target,
  Clock,
  BookOpen,
  GraduationCap,
  Play,
  CheckCircle2,
  TrendingUp,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PathwayCourseCard, PathwayCourseCardSkeleton } from '@/components/onboarding';
import { useOnboarding } from '@/hooks';
import { toast } from 'sonner';

function formatSalary(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function PathwayPage() {
  const router = useRouter();
  const params = useParams();
  const { isSignedIn, isLoaded } = useAuth();
  const { pathway, fetchPathway, isLoading, isInitialized, error } = useOnboarding();

  const pathwayId = params.id as string;

  // Redirect if not signed in
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/sign-in');
    }
  }, [isLoaded, isSignedIn, router]);

  // Fetch pathway if not already loaded
  useEffect(() => {
    if (isInitialized && isSignedIn && pathwayId && (!pathway || pathway.id !== pathwayId)) {
      fetchPathway(pathwayId).catch(() => {
        toast.error('Failed to load pathway');
      });
    }
  }, [isInitialized, isSignedIn, pathwayId, pathway, fetchPathway]);

  if (!isLoaded || !isSignedIn) {
    return null;
  }

  if (isLoading && !pathway) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-orange-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <div className="container mx-auto px-6 py-12">
          <div className="max-w-4xl mx-auto space-y-6">
            <PathwayCourseCardSkeleton />
            <PathwayCourseCardSkeleton />
            <PathwayCourseCardSkeleton />
            <PathwayCourseCardSkeleton />
          </div>
        </div>
      </div>
    );
  }

  if (error || !pathway) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-orange-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <div className="container mx-auto px-6 py-12">
          <div className="max-w-md mx-auto text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Pathway Not Found</h1>
            <p className="text-muted-foreground mb-6">
              {error?.message || 'The pathway you are looking for does not exist or you do not have access to it.'}
            </p>
            <Button asChild>
              <Link href="/admin/dashboard">Go to Dashboard</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const isTopicMode = pathway.generation_mode === 'topic';

  const totalItems = isTopicMode
    ? pathway.cyberpath_courses.reduce((sum, course) => sum + (course.topics?.length ?? 0), 0)
    : pathway.cyberpath_courses.reduce((sum, course) => sum + course.week_count, 0);

  const completedItems = isTopicMode
    ? pathway.cyberpath_courses.reduce(
        (sum, course) =>
          sum + (course.topics?.filter((t) => t.progress?.status === 'completed').length ?? 0),
        0
      )
    : pathway.cyberpath_courses.reduce(
        (sum, course) =>
          sum + course.weeks.filter((w) => w.progress?.status === 'completed').length,
        0
      );

  const hasIncompleteItem = isTopicMode
    ? pathway.cyberpath_courses
        .flatMap((course) => course.topics ?? [])
        .some((topic) => topic.progress?.status !== 'completed')
    : pathway.cyberpath_courses
        .flatMap((course) => course.weeks)
        .some((week) => week.progress?.status !== 'completed');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-orange-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Background grid */}
      <div className="fixed inset-0 bg-[url('/grid.svg')] bg-center opacity-[0.02] dark:opacity-[0.05] pointer-events-none" />

      <div className="relative container mx-auto px-6 py-12">
        {/* Header */}
        <div className="max-w-4xl mx-auto mb-8">
          <Link
            href="/admin/dashboard"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>

          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Badge className="bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300 border-0">
                  {pathway.course_mode === 'parallel' ? 'Parallel Learning' : 'Sequential Learning'}
                </Badge>
                <Badge className="bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300 border-0">
                  {isTopicMode ? 'Topic-Based' : 'Lesson-Based'}
                </Badge>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                Your Learning Pathway
              </h1>
              <p className="text-lg text-muted-foreground">
                Becoming a{' '}
                <span className="font-semibold text-foreground">
                  {pathway.selected_job.title}
                </span>
              </p>
            </div>

            {/* Quick start button */}
            {hasIncompleteItem && (
              <Button
                size="lg"
                className="shrink-0 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white"
              >
                <Play className="mr-2 h-5 w-5" />
                Continue Learning
              </Button>
            )}
          </div>
        </div>

        {/* Stats cards */}
        <div className="max-w-4xl mx-auto mb-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-900/40">
                  <Target className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {pathway.completion_percentage}%
                  </p>
                  <p className="text-xs text-muted-foreground">Complete</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-100 dark:bg-violet-900/40">
                  <BookOpen className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {pathway.cyberpath_courses.length}
                  </p>
                  <p className="text-xs text-muted-foreground">Courses</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/40">
                  <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {completedItems}/{totalItems}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {isTopicMode ? 'Topics' : 'Weeks'}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/40">
                  <TrendingUp className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  {isTopicMode && pathway.ks_coverage_percentage != null ? (
                    <>
                      <p className="text-2xl font-bold text-foreground">
                        {Math.round(pathway.ks_coverage_percentage * 100)}%
                      </p>
                      <p className="text-xs text-muted-foreground">KS Coverage</p>
                    </>
                  ) : (
                    <>
                      <p className="text-2xl font-bold text-foreground">
                        {pathway.tks_gap_count}
                      </p>
                      <p className="text-xs text-muted-foreground">Skills Gap</p>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Overall progress bar */}
        <div className="max-w-4xl mx-auto mb-10">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-foreground">Overall Progress</h3>
                <span className="text-sm font-medium text-orange-600 dark:text-orange-400">
                  {pathway.completion_percentage}%
                </span>
              </div>
              <div className="h-3 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-orange-500 to-red-600 transition-all duration-500"
                  style={{ width: `${pathway.completion_percentage}%` }}
                />
              </div>
              {pathway.completion_percentage === 100 && (
                <div className="flex items-center gap-2 mt-3 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="h-4 w-4" />
                  <span className="text-sm font-medium">Pathway completed!</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Target job info */}
        <div className="max-w-4xl mx-auto mb-10">
          <Card className="bg-gradient-to-br from-slate-50 to-slate-100/50 dark:from-slate-900 dark:to-slate-800/50 border-slate-200 dark:border-slate-700">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-200 dark:bg-slate-700">
                  <GraduationCap className="h-6 w-6 text-slate-600 dark:text-slate-300" />
                </div>
                <div>
                  <CardTitle className="text-lg">Target Career</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {formatSalary(pathway.selected_job.salary_min)} -{' '}
                    {formatSalary(pathway.selected_job.salary_max)} /year
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {pathway.selected_job.description}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Course cards */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl font-bold text-foreground mb-6">Your Courses</h2>
          <div className="grid gap-6">
            {pathway.cyberpath_courses.map((course) => (
              <PathwayCourseCard key={course.id} course={course} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

