'use client';

import { useState } from 'react';
import { DollarSign, CheckCircle2, Target, ChevronDown, ChevronUp, Scale } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { SkillProgressRing } from './skill-progress-ring';
import { SkillBadgeList } from './skill-badge-list';
import { MatchScoreOrbit } from './match-score-orbit';
import { RoleMicroStory } from './role-micro-story';
import type { JobExploreItemWithSkills } from '@/types';

interface JobExploreCardProps {
  job: JobExploreItemWithSkills;
  rank: number;
  onSelect: (jobId: string) => void;
  onToggleCompare?: (jobId: string) => void;
  isSelecting?: boolean;
  isCompared?: boolean;
  showMatchOrbit?: boolean;
  showMicroStory?: boolean;
}

function formatSalary(amount?: number): string {
  if (!amount) return 'N/A';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function JobExploreCard({
  job,
  rank,
  onSelect,
  onToggleCompare,
  isSelecting = false,
  isCompared = false,
  showMatchOrbit = true,
  showMicroStory = true,
}: JobExploreCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const skillsHave = job.skills.filter((s) => s.has);
  const skillsNeed = job.skills.filter((s) => !s.has);

  const hasMoreSkills = skillsHave.length > 3 || skillsNeed.length > 3;

  return (
    <Card className="relative overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Rank badge */}
      <div
        className={cn(
          'absolute top-4 left-4 flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold z-10',
          rank === 1
            ? 'bg-gradient-to-br from-amber-400 to-amber-500 text-white'
            : rank === 2
            ? 'bg-gradient-to-br from-slate-300 to-slate-400 text-white'
            : rank === 3
            ? 'bg-gradient-to-br from-orange-300 to-orange-400 text-white'
            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
        )}
      >
        #{rank}
      </div>

      {onToggleCompare && (
        <Button
          type="button"
          variant={isCompared ? 'default' : 'outline'}
          size="sm"
          onClick={() => onToggleCompare(job.id)}
          className={cn(
            'absolute top-4 right-4 h-8 px-3 text-xs font-semibold',
            isCompared
              ? 'bg-slate-900 text-white hover:bg-slate-800'
              : 'bg-white/80 hover:bg-white text-slate-700'
          )}
        >
          <Scale className="mr-1 h-3.5 w-3.5" />
          Compare
        </Button>
      )}

      <CardContent className="pt-14 pb-6 px-5">
        {/* Job title - fixed height for 2 lines */}
        <h3 className="text-lg font-bold text-foreground mb-2 pr-4 line-clamp-2 h-[3.5rem]">
          {job.title}
        </h3>

        {showMicroStory && <RoleMicroStory job={job} />}

        {/* Career domain badge - fixed height */}
        <div className="mb-3 h-[1.5rem]">
          {job.career_domain && (
            <Badge variant="secondary" className="font-normal text-xs">
              {job.career_domain.name}
            </Badge>
          )}
        </div>

        {/* Salary range - only show if available, fixed height slot */}
        <div className="h-[1.5rem] mb-4">
          {(job.salary_min || job.salary_max) && (
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <DollarSign className="h-3.5 w-3.5 text-emerald-600" />
              <span>
                {formatSalary(job.salary_min)} - {formatSalary(job.salary_max)}
              </span>
            </div>
          )}
        </div>

        {/* Skill progress ring */}
        <div className="flex justify-center mb-4">
          {showMatchOrbit ? (
            <MatchScoreOrbit
              score={job.combined_score}
              skills={job.skills}
              skillsHave={job.skills_have_count}
              totalSkills={job.total_skills}
              size={90}
            />
          ) : (
            <SkillProgressRing
              skillsHave={job.skills_have_count}
              totalSkills={job.total_skills}
              size={90}
              strokeWidth={7}
            />
          )}
        </div>

        {/* Skills count */}
        <p className="text-center text-sm text-muted-foreground mb-4">
          <span className="font-semibold text-foreground">{job.skills_have_count}</span> of{' '}
          <span className="font-semibold text-foreground">{job.total_skills}</span> skills
        </p>

        {/* Skills you have - fixed height when collapsed */}
        <div className={isExpanded ? 'mb-3' : 'mb-3 h-[5.5rem] overflow-hidden'}>
          <div className="flex items-center gap-1.5 mb-2">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              You Have ({skillsHave.length})
            </span>
          </div>
          <SkillBadgeList
            skills={skillsHave}
            variant="have"
            maxVisible={isExpanded ? 50 : 3}
          />
        </div>

        {/* Skills to acquire - fixed height when collapsed */}
        <div className={isExpanded ? 'mb-4' : 'mb-4 h-[5.5rem] overflow-hidden'}>
          <div className="flex items-center gap-1.5 mb-2">
            <Target className="h-3.5 w-3.5 text-amber-600" />
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              To Acquire ({skillsNeed.length})
            </span>
          </div>
          <SkillBadgeList
            skills={skillsNeed}
            variant="need"
            maxVisible={isExpanded ? 50 : 3}
          />
        </div>

        {/* Expand/collapse button */}
        {hasMoreSkills && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full text-muted-foreground h-8 mt-2"
          >
            {isExpanded ? (
              <>
                Show less <ChevronUp className="ml-1 h-4 w-4" />
              </>
            ) : (
              <>
                Show all skills <ChevronDown className="ml-1 h-4 w-4" />
              </>
            )}
          </Button>
        )}

        {/* Select button */}
        <Button
          onClick={() => onSelect(job.id)}
          disabled={isSelecting}
          className="w-full h-10 mt-4 font-semibold bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-slate-200 dark:text-slate-900"
        >
          {isSelecting ? 'Selecting...' : 'Select Role'}
        </Button>
      </CardContent>
    </Card>
  );
}
