'use client';

import {
  Target,
  AlertTriangle,
  BookOpen,
  Wrench,
  Lightbulb,
  CheckCircle,
  XCircle,
  Compass,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { SkillBadgeList } from './skill-badge-list';
import { RoleMicroStory } from './role-micro-story';
import {
  ReadinessTierBadge,
  getReadinessTier,
  normalizeScore,
} from './role-list-item';
import type { JobExploreItemWithSkills, JobPreview, TKSGapItem } from '@/types';

// ── Props ─────────────────────────────────────────────────────────────
interface RoleDetailPanelProps {
  jobSummary: JobExploreItemWithSkills | null;
  preview: JobPreview | null;
  isLoading: boolean;
  onSelectRole: (jobId: string) => void;
  isSelecting: boolean;
}

// ── Helpers (reused from job-preview-modal.tsx) ───────────────────────
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

// ── Main Component ────────────────────────────────────────────────────
export function RoleDetailPanel({
  jobSummary,
  preview,
  isLoading,
  onSelectRole,
  isSelecting,
}: RoleDetailPanelProps) {
  if (!jobSummary) {
    return (
      <div className="flex items-center justify-center h-[500px] rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
        <div className="text-center">
          <Compass className="h-12 w-12 mx-auto mb-4 text-muted-foreground/30" />
          <p className="text-sm text-muted-foreground">
            Select a role from the list to see details
          </p>
        </div>
      </div>
    );
  }

  const tier = getReadinessTier(jobSummary);
  const matchPct = Math.round(normalizeScore(jobSummary.combined_score) * 100);
  const skillsHave = jobSummary.skills.filter((s) => s.has);
  const skillsNeed = jobSummary.skills.filter((s) => !s.has);
  // Use skills-only coverage (not all TKS) for accurate percentage
  const skillsCoveragePct = jobSummary.total_skills > 0
    ? Math.round((jobSummary.skills_have_count / jobSummary.total_skills) * 100)
    : 0;

  return (
    <div className="sticky top-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-sm overflow-hidden">
      {/* ─── Header ──────────────────────────────────────────── */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <ReadinessTierBadge tier={tier} />
            </div>
            <h2 className="text-xl font-bold text-foreground leading-tight">
              {jobSummary.title}
            </h2>
            {jobSummary.career_domain && (
              <Badge variant="secondary" className="mt-2 text-xs">
                {jobSummary.career_domain.name}
              </Badge>
            )}
          </div>
          <Button
            onClick={() => onSelectRole(jobSummary.id)}
            disabled={isSelecting}
            className="shrink-0 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
          >
            {isSelecting ? 'Selecting...' : 'Select Role'}
          </Button>
        </div>

        {/* Stats row */}
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">{matchPct}% match</span>
          <Separator orientation="vertical" className="h-4" />
          <span>
            {formatSalary(jobSummary.salary_min)} –{' '}
            {formatSalary(jobSummary.salary_max)}
          </span>
          <Separator orientation="vertical" className="h-4" />
          <span>
            {jobSummary.skills_have_count} of {jobSummary.total_skills} skills
          </span>
        </div>
      </div>

      {/* ─── Tabs ────────────────────────────────────────────── */}
      <Tabs defaultValue="overview" className="px-6 pb-6">
        <TabsList className="w-full mb-4">
          <TabsTrigger value="overview" className="flex-1">
            Overview
          </TabsTrigger>
          <TabsTrigger value="skills" className="flex-1">
            Skills
          </TabsTrigger>
          <TabsTrigger value="gaps" className="flex-1">
            Gaps
          </TabsTrigger>
        </TabsList>

        {/* ── Overview tab ──────────────────────────────────── */}
        <TabsContent value="overview" className="space-y-5">
          {/* Micro story */}
          <RoleMicroStory job={jobSummary} />

          {/* Description */}
          {isLoading && !preview ? (
            <div className="space-y-2">
              <div className="h-4 w-1/3 bg-muted animate-pulse rounded" />
              <div className="h-3 w-full bg-muted animate-pulse rounded" />
              <div className="h-3 w-5/6 bg-muted animate-pulse rounded" />
              <div className="h-3 w-4/6 bg-muted animate-pulse rounded" />
            </div>
          ) : preview?.job.description ? (
            <div>
              <h4 className="text-sm font-semibold mb-2">About This Role</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {preview.job.description}
              </p>
            </div>
          ) : null}

          {/* Coverage progress (skills-only) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">Skills Coverage</span>
              <span
                className={cn(
                  'font-semibold',
                  skillsCoveragePct >= 70
                    ? 'text-emerald-600'
                    : skillsCoveragePct >= 40
                      ? 'text-amber-600'
                      : 'text-red-600'
                )}
              >
                {skillsCoveragePct}%
              </span>
            </div>
            <Progress
              value={skillsCoveragePct}
              className="h-3"
              indicatorClassName={getCoverageColor(skillsCoveragePct)}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3 text-emerald-600" />
                {jobSummary.skills_have_count} skills you have
              </span>
              <span className="flex items-center gap-1">
                <XCircle className="h-3 w-3 text-red-500" />
                {jobSummary.skills_need_count} skills to develop
              </span>
            </div>
          </div>

          {/* Pathway callout */}
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
        </TabsContent>

        {/* ── Skills tab ────────────────────────────────────── */}
        <TabsContent value="skills" className="space-y-5">
          <div>
            <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-emerald-600" />
              Skills You Have ({skillsHave.length})
            </h4>
            <SkillBadgeList
              skills={skillsHave}
              variant="have"
              maxVisible={50}
            />
          </div>

          <Separator />

          <div>
            <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <XCircle className="h-4 w-4 text-amber-500" />
              Skills to Acquire ({skillsNeed.length})
            </h4>
            <SkillBadgeList
              skills={skillsNeed}
              variant="need"
              maxVisible={50}
            />
          </div>
        </TabsContent>

        {/* ── Gaps tab ──────────────────────────────────────── */}
        <TabsContent value="gaps" className="space-y-5">
          {isLoading && !preview ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {[...Array(2)].map((_, i) => (
                  <div
                    key={i}
                    className="h-20 bg-muted animate-pulse rounded-lg"
                  />
                ))}
              </div>
              <div className="space-y-2">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="h-14 bg-muted animate-pulse rounded-lg"
                  />
                ))}
              </div>
            </div>
          ) : preview ? (
            <>
              {/* Gap summary grid (Skills + Knowledge only) */}
              <div>
                <h4 className="text-sm font-semibold mb-3">Gap Summary</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-3 bg-orange-50 dark:bg-orange-950/30 rounded-lg">
                    <Wrench className="h-5 w-5 mx-auto mb-1 text-orange-600" />
                    <div className="text-2xl font-bold text-orange-700 dark:text-orange-400">
                      {preview.gap_summary.skill}
                    </div>
                    <div className="text-xs text-muted-foreground">Skills</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 dark:bg-purple-950/30 rounded-lg">
                    <BookOpen className="h-5 w-5 mx-auto mb-1 text-purple-600" />
                    <div className="text-2xl font-bold text-purple-700 dark:text-purple-400">
                      {preview.gap_summary.knowledge}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Knowledge
                    </div>
                  </div>
                </div>
              </div>

              {/* Top gaps list (exclude tasks) */}
              {preview.top_gaps.filter((g) => g.category !== 'task').length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                    Top Skills to Develop
                  </h4>
                  <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                    {preview.top_gaps
                      .filter((gap) => gap.category !== 'task')
                      .map((gap) => (
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
                              variant={getImportanceBadgeVariant(
                                gap.importance
                              )}
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
            </>
          ) : (
            <div className="text-center py-8">
              <p className="text-sm text-muted-foreground">
                Gap analysis will load when you select a role.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
