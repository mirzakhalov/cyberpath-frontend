'use client';

import {
  DollarSign,
  Target,
  AlertTriangle,
  BookOpen,
  Lightbulb,
  Wrench,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { JobPreview, TKSGapItem } from '@/types';

interface JobPreviewModalProps {
  preview: JobPreview | null;
  isOpen: boolean;
  onClose: () => void;
  onSelect: (jobId: string) => void;
  isLoading?: boolean;
}

function formatSalary(amount?: number): string {
  if (!amount) return 'N/A';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
}

function getCategoryIcon(category: TKSGapItem['category']) {
  switch (category) {
    case 'task':
      return <Target className="h-4 w-4" />;
    case 'knowledge':
      return <BookOpen className="h-4 w-4" />;
    case 'skill':
      return <Wrench className="h-4 w-4" />;
  }
}

function getCategoryLabel(category: TKSGapItem['category']) {
  switch (category) {
    case 'task':
      return 'Task';
    case 'knowledge':
      return 'Knowledge';
    case 'skill':
      return 'Skill';
  }
}

function getImportanceBadgeVariant(
  importance: TKSGapItem['importance']
): 'destructive' | 'secondary' | 'outline' {
  switch (importance) {
    case 'high':
      return 'destructive';
    case 'medium':
      return 'secondary';
    case 'low':
      return 'outline';
  }
}

function getCoverageColor(percentage: number): string {
  if (percentage >= 70) return 'bg-emerald-500';
  if (percentage >= 40) return 'bg-amber-500';
  return 'bg-red-500';
}

export function JobPreviewModal({
  preview,
  isOpen,
  onClose,
  onSelect,
  isLoading = false,
}: JobPreviewModalProps) {
  if (!preview && !isLoading) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        {isLoading ? (
          <div className="space-y-4 py-4">
            <div className="h-8 w-3/4 bg-muted animate-pulse rounded" />
            <div className="h-4 w-1/2 bg-muted animate-pulse rounded" />
            <div className="h-24 bg-muted animate-pulse rounded" />
            <div className="grid grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-20 bg-muted animate-pulse rounded" />
              ))}
            </div>
          </div>
        ) : preview ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl">{preview.job.title}</DialogTitle>
              {preview.career_domain && (
                <DialogDescription className="flex items-center gap-2">
                  <Badge variant="secondary">
                    {preview.career_domain.code} - {preview.career_domain.name}
                  </Badge>
                </DialogDescription>
              )}
            </DialogHeader>

            <div className="space-y-6 py-4">
              {/* Salary range */}
              <div className="flex items-center gap-2 text-sm">
                <DollarSign className="h-4 w-4 text-emerald-600" />
                <span className="font-medium">Salary Range:</span>
                <span className="text-muted-foreground">
                  {formatSalary(preview.job.salary_min)} -{' '}
                  {formatSalary(preview.job.salary_max)} /year
                </span>
              </div>

              {/* Description */}
              {preview.job.description && (
                <div>
                  <h4 className="text-sm font-semibold mb-2">About This Role</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {preview.job.description}
                  </p>
                </div>
              )}

              {/* Coverage Progress */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Skills Coverage</span>
                  <span
                    className={cn(
                      'font-semibold',
                      preview.coverage_percentage >= 70
                        ? 'text-emerald-600'
                        : preview.coverage_percentage >= 40
                          ? 'text-amber-600'
                          : 'text-red-600'
                    )}
                  >
                    {preview.coverage_percentage}%
                  </span>
                </div>
                <Progress
                  value={preview.coverage_percentage}
                  className="h-3"
                  indicatorClassName={getCoverageColor(preview.coverage_percentage)}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <CheckCircle className="h-3 w-3 text-emerald-600" />
                    {preview.skills_have} skills you have
                  </span>
                  <span className="flex items-center gap-1">
                    <XCircle className="h-3 w-3 text-red-500" />
                    {preview.skills_need} skills to develop
                  </span>
                </div>
              </div>

              {/* Gap Summary */}
              <div>
                <h4 className="text-sm font-semibold mb-3">Gap Summary</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                    <Target className="h-5 w-5 mx-auto mb-2 text-blue-600" />
                    <div className="text-2xl font-bold text-blue-700 dark:text-blue-400">
                      {preview.gap_summary.task}
                    </div>
                    <div className="text-xs text-muted-foreground">Tasks</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 dark:bg-purple-950/30 rounded-lg">
                    <BookOpen className="h-5 w-5 mx-auto mb-2 text-purple-600" />
                    <div className="text-2xl font-bold text-purple-700 dark:text-purple-400">
                      {preview.gap_summary.knowledge}
                    </div>
                    <div className="text-xs text-muted-foreground">Knowledge</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 dark:bg-orange-950/30 rounded-lg">
                    <Wrench className="h-5 w-5 mx-auto mb-2 text-orange-600" />
                    <div className="text-2xl font-bold text-orange-700 dark:text-orange-400">
                      {preview.gap_summary.skill}
                    </div>
                    <div className="text-xs text-muted-foreground">Skills</div>
                  </div>
                </div>
              </div>

              {/* Top Gaps */}
              {preview.top_gaps.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                    Top Skills to Develop
                  </h4>
                  <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2">
                    {preview.top_gaps.map((gap) => (
                      <div
                        key={gap.code}
                        className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg"
                      >
                        <div className="flex items-center justify-center h-8 w-8 rounded-full bg-background border shrink-0">
                          {getCategoryIcon(gap.category)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-mono text-muted-foreground">
                              {gap.code}
                            </span>
                            <Badge
                              variant={getImportanceBadgeVariant(gap.importance)}
                              className="text-xs capitalize"
                            >
                              {gap.importance}
                            </Badge>
                          </div>
                          <p className="text-sm mt-1">{gap.name}</p>
                          <span className="text-xs text-muted-foreground capitalize">
                            {getCategoryLabel(gap.category)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Info callout */}
              <div className="flex items-start gap-3 p-4 bg-orange-50 dark:bg-orange-950/30 rounded-lg border border-orange-200 dark:border-orange-800">
                <Lightbulb className="h-5 w-5 text-orange-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-orange-800 dark:text-orange-300">
                    Your Personalized Pathway
                  </p>
                  <p className="text-xs text-orange-700 dark:text-orange-400 mt-1">
                    Selecting this role will generate a customized learning pathway
                    focused on closing your specific skill gaps with relevant courses
                    and hands-on challenges.
                  </p>
                </div>
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button variant="outline" onClick={onClose}>
                Keep Exploring
              </Button>
              <Button
                onClick={() => onSelect(preview.job.id)}
                className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
              >
                Select This Role
              </Button>
            </DialogFooter>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
