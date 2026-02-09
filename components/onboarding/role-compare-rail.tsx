'use client';

import { useMemo } from 'react';
import { X, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import {
  ReadinessTierBadge,
  getReadinessTier,
  normalizeScore,
  formatCompactSalary,
} from './role-list-item';
import type { JobExploreItemWithSkills, SkillItem } from '@/types';

interface RoleCompareRailProps {
  jobs: JobExploreItemWithSkills[];
  selectedIds: string[];
  onRemove: (id: string) => void;
  onClear: () => void;
}

function formatSkillName(name: string): string {
  return name.replace(/^Skill in /i, '').replace(/^Ability to /i, '').trim();
}

export function RoleCompareRail({
  jobs,
  selectedIds,
  onRemove,
  onClear,
}: RoleCompareRailProps) {
  const selectedJobs = jobs.filter((job) => selectedIds.includes(job.id));

  // Build unique skill list across all compared jobs
  const allUniqueSkills = useMemo(() => {
    if (selectedJobs.length === 0) return [];

    const skillMap = new Map<string, { skill: SkillItem; sharedCount: number }>();

    for (const job of selectedJobs) {
      for (const skill of job.skills) {
        const existing = skillMap.get(skill.code);
        if (existing) {
          existing.sharedCount++;
          if (skill.importance > existing.skill.importance) {
            existing.skill = skill;
          }
        } else {
          skillMap.set(skill.code, { skill, sharedCount: 1 });
        }
      }
    }

    return Array.from(skillMap.values())
      .sort((a, b) => {
        if (b.sharedCount !== a.sharedCount) return b.sharedCount - a.sharedCount;
        return b.skill.importance - a.skill.importance;
      })
      .map((s) => s.skill);
  }, [selectedJobs]);

  if (selectedJobs.length === 0) {
    return null;
  }

  const gridCols =
    selectedJobs.length === 1
      ? 'grid-cols-[180px_1fr]'
      : selectedJobs.length === 2
        ? 'grid-cols-[180px_1fr_1fr]'
        : 'grid-cols-[180px_1fr_1fr_1fr]';

  return (
    <div className="mt-8 rounded-2xl border border-slate-200/70 bg-white/90 p-4 shadow-sm dark:border-slate-800/70 dark:bg-slate-950/60">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-foreground">Compare roles</p>
          <p className="text-xs text-muted-foreground">
            Pick 2-3 roles to see their strengths side by side.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={onClear}>
            Clear
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-slate-900 text-white hover:bg-slate-800">
                Compare ({selectedJobs.length})
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-5xl max-h-[85vh] overflow-hidden flex flex-col">
              <DialogHeader>
                <DialogTitle>Role Comparison</DialogTitle>
              </DialogHeader>

              <div className="overflow-x-auto flex-1 min-h-0">
                {/* Header row */}
                <div className={cn('grid gap-3 mb-3', gridCols)}>
                  <div />
                  {selectedJobs.map((job) => (
                    <div
                      key={job.id}
                      className="text-center p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50"
                    >
                      <h4 className="text-sm font-semibold mb-1 line-clamp-2">
                        {job.title}
                      </h4>
                      <ReadinessTierBadge tier={getReadinessTier(job)} />
                      <p className="text-xs text-muted-foreground mt-1">
                        {Math.round(normalizeScore(job.combined_score) * 100)}%
                        match
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatCompactSalary(job.salary_min)}-
                        {formatCompactSalary(job.salary_max)}
                      </p>
                    </div>
                  ))}
                </div>

                <Separator className="mb-3" />

                {/* Summary rows */}
                <div className={cn('grid gap-3 items-center py-2', gridCols)}>
                  <span className="text-xs font-medium text-muted-foreground">
                    Skills Coverage
                  </span>
                  {selectedJobs.map((job) => (
                    <span
                      key={job.id}
                      className="text-sm font-semibold text-center"
                    >
                      {job.skills_have_count}/{job.total_skills}
                    </span>
                  ))}
                </div>
                <div className={cn('grid gap-3 items-center py-2', gridCols)}>
                  <span className="text-xs font-medium text-muted-foreground">
                    Skills to Acquire
                  </span>
                  {selectedJobs.map((job) => (
                    <span key={job.id} className="text-sm text-center">
                      <Badge variant="outline" className="text-xs">
                        {job.skills_need_count}
                      </Badge>
                    </span>
                  ))}
                </div>

                <Separator className="my-3" />

                {/* Skill matrix */}
                <h4 className="text-sm font-semibold mb-2">
                  Skill-by-Skill Comparison
                </h4>
                <ScrollArea className="max-h-[400px]">
                  <div className="space-y-0">
                    {allUniqueSkills.map((skill, i) => (
                      <div
                        key={skill.code}
                        className={cn(
                          'grid gap-3 items-center py-2 px-1 rounded',
                          gridCols,
                          i % 2 === 0
                            ? 'bg-slate-50/50 dark:bg-slate-900/20'
                            : ''
                        )}
                      >
                        <span
                          className="text-xs text-foreground truncate"
                          title={formatSkillName(skill.name)}
                        >
                          {formatSkillName(skill.name)}
                        </span>
                        {selectedJobs.map((job) => {
                          const jobSkill = job.skills.find(
                            (s) => s.code === skill.code
                          );
                          if (!jobSkill) {
                            return (
                              <span
                                key={job.id}
                                className="flex justify-center"
                              >
                                <span className="text-xs text-muted-foreground">
                                  --
                                </span>
                              </span>
                            );
                          }
                          return (
                            <span
                              key={job.id}
                              className="flex justify-center"
                            >
                              {jobSkill.has ? (
                                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                              ) : (
                                <XCircle className="h-4 w-4 text-amber-400" />
                              )}
                            </span>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Selected chips */}
      <div className="mt-4 flex flex-wrap gap-2">
        {selectedJobs.map((job) => (
          <span
            key={job.id}
            className={cn(
              'inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold',
              'border-slate-200 bg-slate-50 text-slate-700'
            )}
          >
            {job.title}
            <button
              type="button"
              onClick={() => onRemove(job.id)}
              className="text-slate-500 hover:text-slate-700"
              aria-label={`Remove ${job.title} from compare`}
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}
