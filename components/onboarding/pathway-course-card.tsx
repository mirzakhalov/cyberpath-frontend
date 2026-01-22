'use client';

import { useState } from 'react';
import { BookOpen, Clock, GraduationCap, ChevronDown, ChevronUp, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { CyberpathCourse } from '@/types';

interface PathwayCourseCardProps {
  course: CyberpathCourse;
  className?: string;
}

function getCourseColor(courseNumber: number): { bg: string; text: string; border: string; progress: string } {
  const colors = [
    { bg: 'bg-violet-50 dark:bg-violet-950/30', text: 'text-violet-700 dark:text-violet-300', border: 'border-violet-200 dark:border-violet-800', progress: 'bg-violet-500' },
    { bg: 'bg-cyan-50 dark:bg-cyan-950/30', text: 'text-cyan-700 dark:text-cyan-300', border: 'border-cyan-200 dark:border-cyan-800', progress: 'bg-cyan-500' },
    { bg: 'bg-amber-50 dark:bg-amber-950/30', text: 'text-amber-700 dark:text-amber-300', border: 'border-amber-200 dark:border-amber-800', progress: 'bg-amber-500' },
    { bg: 'bg-emerald-50 dark:bg-emerald-950/30', text: 'text-emerald-700 dark:text-emerald-300', border: 'border-emerald-200 dark:border-emerald-800', progress: 'bg-emerald-500' },
  ];
  return colors[(courseNumber - 1) % colors.length];
}

export function PathwayCourseCard({ course, className }: PathwayCourseCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const colors = getCourseColor(course.course_number);
  
  const totalHours = course.weeks.reduce(
    (sum, week) => sum + (week.course_week?.estimated_hours || 0),
    0
  );
  
  const completedWeeks = course.weeks.filter(
    (week) => week.progress?.status === 'completed'
  ).length;

  return (
    <Card className={cn('relative overflow-hidden', className)}>
      {/* Course number indicator */}
      <div
        className={cn(
          'absolute top-0 left-0 w-1.5 h-full',
          colors.progress
        )}
      />

      <CardHeader className="pb-3 pl-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                'flex h-10 w-10 items-center justify-center rounded-xl',
                colors.bg,
                colors.border,
                'border'
              )}
            >
              <span className={cn('text-lg font-bold', colors.text)}>
                {course.course_number}
              </span>
            </div>
            <div>
              <CardTitle className="text-lg font-semibold text-foreground">
                {course.title}
              </CardTitle>
              <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <BookOpen className="h-3.5 w-3.5" />
                  {course.week_count} lessons
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  ~{totalHours}h total
                </span>
              </div>
            </div>
          </div>
          
          {/* Progress indicator */}
          <div className="flex flex-col items-end gap-1">
            <span className={cn('text-sm font-semibold', colors.text)}>
              {course.completion_percentage}%
            </span>
            <span className="text-xs text-muted-foreground">
              {completedWeeks}/{course.week_count}
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-3 h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
          <div
            className={cn('h-full rounded-full transition-all duration-500', colors.progress)}
            style={{ width: `${course.completion_percentage}%` }}
          />
        </div>
      </CardHeader>

      <CardContent className="pt-0 pl-6">
        {/* Week list (expandable) */}
        {course.weeks.length > 0 && (
          <>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-full justify-between text-muted-foreground hover:text-foreground -ml-2 mb-2"
            >
              <span className="text-sm font-medium">
                {isExpanded ? 'Hide lessons' : 'View lessons'}
              </span>
              {isExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>

            {isExpanded && (
              <div className="space-y-2 mt-2 max-h-[400px] overflow-y-auto pr-2">
                {course.weeks.map((week) => (
                  <div
                    key={week.id}
                    className={cn(
                      'flex items-start gap-3 p-3 rounded-lg transition-colors',
                      week.progress?.status === 'completed'
                        ? 'bg-emerald-50/50 dark:bg-emerald-950/20'
                        : week.progress?.status === 'in_progress'
                        ? 'bg-cyan-50/50 dark:bg-cyan-950/20'
                        : 'bg-slate-50 dark:bg-slate-900/50'
                    )}
                  >
                    {/* Status indicator */}
                    <div className="mt-0.5">
                      {week.progress?.status === 'completed' ? (
                        <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                      ) : week.progress?.status === 'in_progress' ? (
                        <div className="h-5 w-5 rounded-full border-2 border-cyan-500 flex items-center justify-center">
                          <div className="h-2 w-2 rounded-full bg-cyan-500" />
                        </div>
                      ) : (
                        <div className="h-5 w-5 rounded-full border-2 border-slate-300 dark:border-slate-600" />
                      )}
                    </div>

                    {/* Week content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium text-muted-foreground">
                          Week {week.sequence_order}
                        </span>
                        {week.course_week?.estimated_hours && (
                          <Badge variant="secondary" className="text-xs py-0 h-5">
                            {week.course_week.estimated_hours}h
                          </Badge>
                        )}
                      </div>
                      <h4 className="text-sm font-medium text-foreground truncate">
                        {week.course_week?.title || 'Untitled Week'}
                      </h4>
                      {week.course_week?.course && (
                        <div className="flex items-center gap-1.5 mt-1">
                          <GraduationCap className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground truncate">
                            {week.course_week.course.code} · {week.course_week.course.university?.name}
                          </span>
                        </div>
                      )}
                      
                      {/* Topics */}
                      {week.course_week?.topics && week.course_week.topics.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {week.course_week.topics.slice(0, 3).map((topic) => (
                            <Badge
                              key={topic.id}
                              variant="outline"
                              className="text-xs py-0 h-5"
                            >
                              {topic.name}
                            </Badge>
                          ))}
                          {week.course_week.topics.length > 3 && (
                            <Badge variant="outline" className="text-xs py-0 h-5 text-muted-foreground">
                              +{week.course_week.topics.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

