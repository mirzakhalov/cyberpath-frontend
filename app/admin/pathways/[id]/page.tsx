'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { PageHeader, PageLoader } from '@/components/shared';
import { usePathway } from '@/hooks/use-dashboard';
import { 
  User, 
  Briefcase, 
  Calendar,
  Brain,
  BookOpen,
  ChevronDown,
  CheckCircle2,
  Clock,
  PlayCircle,
  XCircle,
  ExternalLink,
  Bot,
  Sparkles,
  GraduationCap
} from 'lucide-react';
import { format } from 'date-fns';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const weekStatusConfig = {
  not_started: {
    icon: Clock,
    label: 'Not Started',
    color: 'bg-slate-100 text-slate-700 border-slate-200',
    dotColor: 'bg-slate-400',
  },
  in_progress: {
    icon: PlayCircle,
    label: 'In Progress',
    color: 'bg-blue-100 text-blue-700 border-blue-200',
    dotColor: 'bg-blue-500',
  },
  completed: {
    icon: CheckCircle2,
    label: 'Completed',
    color: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    dotColor: 'bg-emerald-500',
  },
  skipped: {
    icon: XCircle,
    label: 'Skipped',
    color: 'bg-amber-100 text-amber-700 border-amber-200',
    dotColor: 'bg-amber-500',
  },
};

export default function PathwayDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [expandedCourses, setExpandedCourses] = useState<Set<string>>(new Set());
  
  const { data, isLoading } = usePathway(id);

  const toggleCourse = (courseId: string) => {
    setExpandedCourses(prev => {
      const next = new Set(prev);
      if (next.has(courseId)) {
        next.delete(courseId);
      } else {
        next.add(courseId);
      }
      return next;
    });
  };

  if (isLoading) {
    return <PageLoader />;
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold">Pathway not found</h2>
        <p className="text-muted-foreground mt-2">The requested pathway could not be found.</p>
        <Link href="/admin/pathways">
          <Button className="mt-4">Back to Pathways</Button>
        </Link>
      </div>
    );
  }

  const { pathway, courses, agent_session } = data;

  return (
    <div>
      <PageHeader
        title={`Pathway for ${pathway.user.name || pathway.user.email}`}
        description={`Target: ${pathway.selected_job.title}`}
        breadcrumbs={[
          { label: 'Admin', href: '/admin/dashboard' },
          { label: 'Pathways', href: '/admin/pathways' },
          { label: pathway.user.name || pathway.user.email },
        ]}
        actions={
          agent_session && (
            <Link href={`/admin/audit/${agent_session.id}`}>
              <Button variant="outline">
                <Bot className="mr-2 h-4 w-4" />
                View AI Decisions
              </Button>
            </Link>
          )
        }
      />

      <div className="grid gap-6 md:grid-cols-4">
        {/* Student Info */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <User className="h-4 w-4" />
              Student
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Link href={`/admin/students/${pathway.user.id}`} className="hover:text-primary">
              <div className="font-medium">{pathway.user.name || 'No name'}</div>
              <div className="text-sm text-muted-foreground">{pathway.user.email}</div>
            </Link>
          </CardContent>
        </Card>

        {/* Target Job */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              Target Job
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Link href={`/admin/jobs/${pathway.selected_job.id}`} className="hover:text-primary">
              <div className="font-medium">{pathway.selected_job.title}</div>
              <div className="text-sm text-muted-foreground">
                {(pathway.match_score * 100).toFixed(0)}% match score
              </div>
            </Link>
          </CardContent>
        </Card>

        {/* TKS Stats */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Brain className="h-4 w-4" />
              Competencies
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pathway.existing_competencies_count}</div>
            <div className="text-sm text-muted-foreground">
              existing / {pathway.tks_gap_count} gaps to fill
            </div>
          </CardContent>
        </Card>

        {/* Overall Progress */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pathway.completion_percentage.toFixed(0)}%</div>
            <Progress value={pathway.completion_percentage} className="h-2 mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Match Reasoning */}
      {pathway.match_reasoning && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              AI Match Reasoning
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{pathway.match_reasoning}</p>
          </CardContent>
        </Card>
      )}

      {/* Courses Section */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Course Curriculum
          </CardTitle>
          <CardDescription>
            {courses.length} course{courses.length !== 1 ? 's' : ''} with{' '}
            {courses.reduce((sum, c) => sum + c.week_count, 0)} total weeks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {courses.map((course, courseIndex) => (
              <Collapsible
                key={course.id}
                open={expandedCourses.has(course.id)}
                onOpenChange={() => toggleCourse(course.id)}
              >
                <div className="border rounded-lg">
                  <CollapsibleTrigger className="w-full">
                    <div className="flex items-center justify-between p-4 hover:bg-accent/50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
                          {course.course_number}
                        </div>
                        <div className="text-left">
                          <div className="font-medium">{course.title}</div>
                          <div className="text-sm text-muted-foreground">
                            {course.week_count} weeks
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-sm font-medium">
                            {course.completion_percentage.toFixed(0)}%
                          </div>
                          <Progress 
                            value={course.completion_percentage} 
                            className="h-1.5 w-20" 
                          />
                        </div>
                        <ChevronDown 
                          className={cn(
                            "h-5 w-5 text-muted-foreground transition-transform",
                            expandedCourses.has(course.id) && "rotate-180"
                          )} 
                        />
                      </div>
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <Separator />
                    <div className="p-4 space-y-2">
                      {course.weeks.map((week) => {
                        const status = week.progress?.status || 'not_started';
                        const config = weekStatusConfig[status];
                        const StatusIcon = config.icon;
                        
                        return (
                          <div
                            key={week.id}
                            className="flex items-center justify-between p-3 rounded-lg bg-muted/30"
                          >
                            <div className="flex items-center gap-3">
                              <div className={cn("h-2 w-2 rounded-full", config.dotColor)} />
                              <div>
                                <div className="font-medium text-sm">
                                  Week {week.sequence_order}: {week.course_week.title}
                                </div>
                                <div className="text-xs text-muted-foreground flex items-center gap-2">
                                  <GraduationCap className="h-3 w-3" />
                                  {week.course_week.course.title} • {week.course_week.course.university}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className={config.color}>
                                <StatusIcon className="mr-1 h-3 w-3" />
                                {config.label}
                              </Badge>
                              {week.progress?.completed_at && (
                                <span className="text-xs text-muted-foreground">
                                  {format(new Date(week.progress.completed_at), 'MMM d')}
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CollapsibleContent>
                </div>
              </Collapsible>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Metadata */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-base">Pathway Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Created:</span>
            <span>{format(new Date(pathway.created_at), 'MMMM d, yyyy')}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground ml-6">Course Mode:</span>
            <Badge variant="secondary" className="capitalize">
              {pathway.course_mode}
            </Badge>
          </div>
          {pathway.is_partial && (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground ml-6">Status:</span>
              <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                Partial Pathway
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

