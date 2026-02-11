'use client';

import {
  BookOpen,
  Lightbulb,
  CheckCircle,
  XCircle,
  Compass,
  ClipboardList,
  Wrench,
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
} from './role-list-item';
import type {
  JobExploreItemWithSkills,
  JobPreview,
  JobRecommendation,
} from '@/types';

// ── Props ─────────────────────────────────────────────────────────────
interface RoleDetailPanelProps {
  /** Full skill-level data from explore-jobs endpoint */
  jobSummary?: JobExploreItemWithSkills | null;
  /** Recommendation data (alternative to jobSummary for recommendations page) */
  recommendation?: JobRecommendation | null;
  /** Preview data from job-preview endpoint (tasks, knowledge, description) */
  preview: JobPreview | null;
  isLoading: boolean;
  onSelectRole: (jobId: string) => void;
  isSelecting: boolean;
}

// ── Helpers ───────────────────────────────────────────────────────────
function formatSalary(amount?: number): string {
  if (!amount) return 'N/A';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
}

function getCoverageColor(percentage: number): string {
  if (percentage >= 70) return 'bg-emerald-500';
  if (percentage >= 40) return 'bg-amber-500';
  return 'bg-red-500';
}

// ── Main Component ────────────────────────────────────────────────────
export function RoleDetailPanel({
  jobSummary,
  recommendation,
  preview,
  isLoading,
  onSelectRole,
  isSelecting,
}: RoleDetailPanelProps) {
  // Determine which data source we're using
  const hasExploreData = !!jobSummary;
  const hasRecData = !!recommendation;

  if (!hasExploreData && !hasRecData) {
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

  // Unified header data
  const jobId = jobSummary?.id ?? recommendation!.job.id;
  const title = jobSummary?.title ?? recommendation!.job.title;
  const salaryMin = jobSummary?.salary_min ?? recommendation!.job.salary_min;
  const salaryMax = jobSummary?.salary_max ?? recommendation!.job.salary_max;
  const careerDomain = jobSummary?.career_domain ?? preview?.career_domain ?? null;

  // Explore-only derived data
  const tier = jobSummary ? getReadinessTier(jobSummary) : null;
  const skillsHave = jobSummary?.skills.filter((s) => s.has) ?? [];
  const skillsNeed = jobSummary?.skills.filter((s) => !s.has) ?? [];
  const skillsCoveragePct = jobSummary && jobSummary.total_skills > 0
    ? Math.round((jobSummary.skills_have_count / jobSummary.total_skills) * 100)
    : 0;

  // Knowledge items split
  const knowledgeHave = preview?.knowledge_items?.filter((k) => k.has) ?? [];
  const knowledgeNeed = preview?.knowledge_items?.filter((k) => !k.has) ?? [];

  // Preview skill items (from job-preview endpoint, used when explore data not available)
  const previewSkillsHave = (preview?.skill_items?.filter((s) => s.has) ?? []).map((s) => ({
    code: s.code,
    name: s.name,
    has: s.has,
    importance: s.importance === 'high' ? 2 : s.importance === 'medium' ? 1 : 0.5,
  }));
  const previewSkillsNeed = (preview?.skill_items?.filter((s) => !s.has) ?? []).map((s) => ({
    code: s.code,
    name: s.name,
    has: s.has,
    importance: s.importance === 'high' ? 2 : s.importance === 'medium' ? 1 : 0.5,
  }));
  const hasPreviewSkills = (previewSkillsHave.length + previewSkillsNeed.length) > 0;

  return (
    <div className="sticky top-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-sm overflow-hidden">
      {/* ─── Header ──────────────────────────────────────────── */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="min-w-0">
            {tier && (
              <div className="flex items-center gap-2 mb-1">
                <ReadinessTierBadge tier={tier} />
              </div>
            )}
            <h2 className="text-xl font-bold text-foreground leading-tight">
              {title}
            </h2>
            {careerDomain && (
              <Badge variant="secondary" className="mt-2 text-xs">
                {careerDomain.name}
              </Badge>
            )}
          </div>
          <Button
            onClick={() => onSelectRole(jobId)}
            disabled={isSelecting}
            className="shrink-0 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
          >
            {isSelecting ? 'Selecting...' : 'Select Role'}
          </Button>
        </div>

        {/* Stats row */}
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          {(salaryMin || salaryMax) && (
            <span>
              {formatSalary(salaryMin)} – {formatSalary(salaryMax)}
            </span>
          )}
          {hasExploreData && (
            <>
              {(salaryMin || salaryMax) && (
                <Separator orientation="vertical" className="h-4" />
              )}
              <span>
                {jobSummary!.skills_have_count} of {jobSummary!.total_skills} skills
              </span>
            </>
          )}
        </div>
      </div>

      {/* ─── Tabs ────────────────────────────────────────────── */}
      <Tabs defaultValue="overview" className="px-6 pb-6">
        <TabsList className="w-full mb-4">
          <TabsTrigger value="overview" className="flex-1">
            Overview
          </TabsTrigger>
          <TabsTrigger value="tasks" className="flex-1">
            Tasks
          </TabsTrigger>
          <TabsTrigger value="knowledge" className="flex-1">
            Knowledge
          </TabsTrigger>
          <TabsTrigger value="skills" className="flex-1">
            Skills
          </TabsTrigger>
        </TabsList>

        {/* Scrollable tab content area — capped so the panel never pushes sibling elements offscreen */}
        <div className="max-h-[35vh] overflow-y-auto">
          {/* ── Overview tab ──────────────────────────────────── */}
          <TabsContent value="overview" className="space-y-5 mt-0">
            {/* Micro story (explore mode) or Justification (recommendation mode) */}
            {hasExploreData ? (
              <RoleMicroStory job={jobSummary!} />
            ) : recommendation?.justification ? (
              <p className="text-sm text-muted-foreground leading-relaxed">
                {recommendation.justification}
              </p>
            ) : null}

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

            {/* Coverage progress (explore mode only) */}
            {hasExploreData && (
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
                    {jobSummary!.skills_have_count} skills you have
                  </span>
                  <span className="flex items-center gap-1">
                    <XCircle className="h-3 w-3 text-red-500" />
                    {jobSummary!.skills_need_count} skills to develop
                  </span>
                </div>
              </div>
            )}

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
          <TabsContent value="skills" className="space-y-5 mt-0">
            {hasExploreData ? (
              <>
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
              </>
            ) : isLoading && !preview ? (
              <div className="space-y-2">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="h-8 bg-muted animate-pulse rounded-lg"
                  />
                ))}
              </div>
            ) : hasPreviewSkills ? (
              <>
                <div>
                  <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-600" />
                    Skills You Have ({previewSkillsHave.length})
                  </h4>
                  <SkillBadgeList
                    skills={previewSkillsHave}
                    variant="have"
                    maxVisible={50}
                  />
                </div>

                <Separator />

                <div>
                  <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <XCircle className="h-4 w-4 text-amber-500" />
                    Skills to Acquire ({previewSkillsNeed.length})
                  </h4>
                  <SkillBadgeList
                    skills={previewSkillsNeed}
                    variant="need"
                    maxVisible={50}
                  />
                </div>
              </>
            ) : preview ? (
              <div className="text-center py-8">
                <Wrench className="h-10 w-10 mx-auto mb-3 text-muted-foreground/30" />
                <p className="text-sm text-muted-foreground">
                  No skill data available for this role.
                </p>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-sm text-muted-foreground">
                  Skill details will load when you select a role.
                </p>
              </div>
            )}
          </TabsContent>

          {/* ── Tasks tab ───────────────────────────────────────── */}
          <TabsContent value="tasks" className="space-y-5 mt-0">
            {isLoading && !preview ? (
              <div className="space-y-3">
                <div className="h-4 w-2/5 bg-muted animate-pulse rounded" />
                <div className="h-3 w-full bg-muted animate-pulse rounded" />
                <div className="h-3 w-5/6 bg-muted animate-pulse rounded" />
                <div className="h-3 w-4/6 bg-muted animate-pulse rounded" />
                <div className="h-3 w-full bg-muted animate-pulse rounded" />
                <div className="h-3 w-3/4 bg-muted animate-pulse rounded" />
              </div>
            ) : preview?.task_summary ? (
              <>
                {/* Teaser */}
                <p className="text-sm italic text-muted-foreground">
                  {preview.task_summary.teaser}
                </p>

                {/* Full summary bullets */}
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold flex items-center gap-2">
                    <ClipboardList className="h-4 w-4 text-blue-600" />
                    Day-to-Day Responsibilities
                  </h4>
                  <ul className="space-y-2">
                    {preview.task_summary.full_summary.map((item, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-100 dark:border-blue-900"
                      >
                        <span className="flex items-center justify-center h-6 w-6 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs font-bold shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <span className="text-sm text-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Task count note */}
                <p className="text-xs text-muted-foreground">
                  Based on {preview.task_summary.task_count} NICE Framework task
                  statements assigned to this work role.
                </p>
              </>
            ) : preview ? (
              <div className="text-center py-8">
                <ClipboardList className="h-10 w-10 mx-auto mb-3 text-muted-foreground/30" />
                <p className="text-sm text-muted-foreground">
                  No task summary available for this role.
                </p>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-sm text-muted-foreground">
                  Task details will load when you select a role.
                </p>
              </div>
            )}
          </TabsContent>

          {/* ── Knowledge tab ───────────────────────────────────── */}
          <TabsContent value="knowledge" className="space-y-5 mt-0">
            {isLoading && !preview ? (
              <div className="space-y-2">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="h-12 bg-muted animate-pulse rounded-lg"
                  />
                ))}
              </div>
            ) : preview?.knowledge_items && preview.knowledge_items.length > 0 ? (
              <>
                {/* Knowledge you have */}
                {knowledgeHave.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-600" />
                      Knowledge You Have ({knowledgeHave.length})
                    </h4>
                    <div className="space-y-2">
                      {knowledgeHave.map((item) => (
                        <div
                          key={item.code}
                          className="flex items-start gap-3 p-3 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg border border-emerald-200 dark:border-emerald-800"
                        >
                          <BookOpen className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-foreground">{item.name}</p>
                            <span className="text-xs font-mono text-muted-foreground">
                              {item.code}
                            </span>
                          </div>
                          <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {knowledgeHave.length > 0 && knowledgeNeed.length > 0 && (
                  <Separator />
                )}

                {/* Knowledge to acquire */}
                {knowledgeNeed.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-purple-600" />
                      Knowledge to Acquire ({knowledgeNeed.length})
                    </h4>
                    <div className="space-y-2">
                      {knowledgeNeed.map((item) => (
                        <div
                          key={item.code}
                          className="flex items-start gap-3 p-3 bg-purple-50 dark:bg-purple-950/30 rounded-lg border border-purple-200 dark:border-purple-800"
                        >
                          <BookOpen className="h-4 w-4 text-purple-600 shrink-0 mt-0.5" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-foreground">{item.name}</p>
                            <span className="text-xs font-mono text-muted-foreground">
                              {item.code}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : preview ? (
              <div className="text-center py-8">
                <BookOpen className="h-10 w-10 mx-auto mb-3 text-muted-foreground/30" />
                <p className="text-sm text-muted-foreground">
                  No knowledge requirements found for this role.
                </p>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-sm text-muted-foreground">
                  Knowledge details will load when you select a role.
                </p>
              </div>
            )}
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
