'use client';

import { DollarSign, Target, TrendingUp, Sparkles, Briefcase } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import type { JobRecommendation } from '@/types';

interface JobRecommendationCardProps {
  recommendation: JobRecommendation;
  isSelected?: boolean;
  onSelect: () => void;
  disabled?: boolean;
  category?: 'goal_based' | 'skill_based';
}

function formatSalary(amount: number): string {
  if (!amount) return 'N/A';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
}

function getMatchScoreColor(score: number): string {
  if (score >= 80) return 'text-emerald-600 dark:text-emerald-400';
  if (score >= 60) return 'text-amber-600 dark:text-amber-400';
  return 'text-orange-600 dark:text-orange-400';
}

function getMatchScoreBg(score: number): string {
  if (score >= 80) return 'bg-emerald-100 dark:bg-emerald-900/30';
  if (score >= 60) return 'bg-amber-100 dark:bg-amber-900/30';
  return 'bg-orange-100 dark:bg-orange-900/30';
}

export function JobRecommendationCard({
  recommendation,
  isSelected = false,
  onSelect,
  disabled = false,
  category,
}: JobRecommendationCardProps) {
  const { job, match_score, justification, key_matches, growth_areas } = recommendation;
  const effectiveCategory = category || recommendation.category;
  const extraMatches = [
    ...key_matches.slice(2).map((match) => ({ type: 'match' as const, label: match })),
    ...growth_areas.slice(1).map((area) => ({ type: 'growth' as const, label: area })),
  ];

  return (
    <Card
      className={cn(
        'relative overflow-hidden transition-all duration-200 cursor-pointer',
        isSelected
          ? 'ring-2 ring-orange-500 border-orange-500/50 bg-orange-50/50 dark:bg-orange-950/20'
          : 'hover:shadow-md hover:border-slate-300 dark:hover:border-slate-600'
      )}
      onClick={onSelect}
    >
      <CardContent className="p-4">
        {/* Top row: Category badge + Match score + Select button */}
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            {/* Category badge */}
            {effectiveCategory && (
              <Badge
                variant="secondary"
                className={cn(
                  'text-xs font-medium',
                  effectiveCategory === 'goal_based'
                    ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300 border-purple-200 dark:border-purple-800'
                    : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                )}
              >
                {effectiveCategory === 'goal_based' ? (
                  <>
                    <Target className="h-3 w-3 mr-1" />
                    Goal Match
                  </>
                ) : (
                  <>
                    <Briefcase className="h-3 w-3 mr-1" />
                    Skill Match
                  </>
                )}
              </Badge>
            )}
            {/* Match score */}
            <div
              className={cn(
                'flex items-center gap-1 rounded-full px-2 py-0.5',
                getMatchScoreBg(match_score)
              )}
            >
              <Sparkles className={cn('h-3 w-3', getMatchScoreColor(match_score))} />
              <span className={cn('text-xs font-bold', getMatchScoreColor(match_score))}>
                {match_score.toFixed(0)}%
              </span>
            </div>
          </div>
          {/* Select button */}
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onSelect();
            }}
            disabled={disabled}
            size="sm"
            className={cn(
              'transition-all',
              isSelected
                ? 'bg-orange-600 hover:bg-orange-700 text-white'
                : 'bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-slate-200 dark:text-slate-900'
            )}
          >
            {isSelected ? 'Selected ✓' : 'Select'}
          </Button>
        </div>

        {/* Job title */}
        <h3 className="text-base font-bold text-foreground leading-tight mb-2">
          {job.title}
        </h3>

        {/* Salary */}
        {(job.salary_min || job.salary_max) && (
          <div className="flex items-center gap-1.5 mb-2 text-xs text-muted-foreground">
            <DollarSign className="h-3 w-3 text-emerald-600" />
            <span>{formatSalary(job.salary_min)} - {formatSalary(job.salary_max)}</span>
          </div>
        )}

        {/* Justification */}
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {justification}
        </p>

        {/* Strengths & Growth in one row */}
        <div className="flex flex-wrap gap-1.5">
          {key_matches.slice(0, 2).map((match, index) => (
            <Badge
              key={`match-${index}`}
              variant="secondary"
              className="text-xs bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
            >
              <Target className="h-3 w-3 mr-1" />
              {match}
            </Badge>
          ))}
          {growth_areas.slice(0, 1).map((area, index) => (
            <Badge
              key={`growth-${index}`}
              variant="secondary"
              className="text-xs bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border-blue-200 dark:border-blue-800"
            >
              <TrendingUp className="h-3 w-3 mr-1" />
              {area}
            </Badge>
          ))}
          {extraMatches.length > 0 && (
            <Popover>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  onClick={(event) => event.stopPropagation()}
                  className="inline-flex"
                  aria-label={`Show ${extraMatches.length} more matches`}
                >
                  <Badge
                    variant="secondary"
                    className="text-xs text-slate-700 bg-slate-100/80 border-slate-200 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700"
                  >
                    +{extraMatches.length} more
                  </Badge>
                </button>
              </PopoverTrigger>
              <PopoverContent align="start" className="w-64">
                <p className="text-xs font-semibold text-muted-foreground mb-2">
                  More matches
                </p>
                <ul className="space-y-1 text-xs">
                  {extraMatches.map((item, index) => (
                    <li key={`${item.type}-${index}`} className="flex items-start gap-2">
                      {item.type === 'match' ? (
                        <Target className="h-3 w-3 text-emerald-600 mt-0.5" />
                      ) : (
                        <TrendingUp className="h-3 w-3 text-blue-600 mt-0.5" />
                      )}
                      <span className="text-muted-foreground">{item.label}</span>
                    </li>
                  ))}
                </ul>
              </PopoverContent>
            </Popover>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
