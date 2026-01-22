'use client';

import { useState } from 'react';
import { DollarSign, Target, TrendingUp, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { JobRecommendation } from '@/types';

interface JobRecommendationCardProps {
  recommendation: JobRecommendation;
  rank: number;
  isSelected?: boolean;
  onSelect: () => void;
  disabled?: boolean;
}

function formatSalary(amount: number): string {
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
  rank,
  isSelected = false,
  onSelect,
  disabled = false,
}: JobRecommendationCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { job, match_score, justification, key_matches, growth_areas } = recommendation;

  return (
    <Card
      className={cn(
        'relative overflow-hidden transition-all duration-300',
        isSelected
          ? 'ring-2 ring-cyan-500 border-cyan-500/50 shadow-lg shadow-cyan-500/10'
          : 'hover:shadow-md hover:border-slate-300 dark:hover:border-slate-600'
      )}
    >
      {/* Rank badge */}
      <div
        className={cn(
          'absolute top-4 left-4 flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold',
          rank === 1
            ? 'bg-gradient-to-br from-amber-400 to-amber-500 text-white'
            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
        )}
      >
        #{rank}
      </div>

      {/* Match score */}
      <div
        className={cn(
          'absolute top-4 right-4 flex items-center gap-1.5 rounded-full px-3 py-1.5',
          getMatchScoreBg(match_score)
        )}
      >
        <Sparkles className={cn('h-4 w-4', getMatchScoreColor(match_score))} />
        <span className={cn('text-sm font-bold', getMatchScoreColor(match_score))}>
          {match_score.toFixed(0)}% Match
        </span>
      </div>

      <CardHeader className="pt-14 pb-4">
        <CardTitle className="text-xl font-bold text-foreground pr-24">
          {job.title}
        </CardTitle>
        
        {/* Salary range */}
        <div className="flex items-center gap-2 mt-2">
          <DollarSign className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
            {formatSalary(job.salary_min)} - {formatSalary(job.salary_max)}
          </span>
          <span className="text-xs text-muted-foreground">/year</span>
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        {/* Justification */}
        <p className="text-sm text-muted-foreground leading-relaxed">
          {justification}
        </p>

        {/* Key matches and growth areas */}
        <div className="grid grid-cols-2 gap-4">
          {/* Key Matches */}
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <Target className="h-4 w-4 text-emerald-600" />
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Your Strengths
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {key_matches.slice(0, isExpanded ? undefined : 3).map((match, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
                >
                  {match}
                </Badge>
              ))}
              {!isExpanded && key_matches.length > 3 && (
                <Badge variant="secondary" className="text-muted-foreground">
                  +{key_matches.length - 3} more
                </Badge>
              )}
            </div>
          </div>

          {/* Growth Areas */}
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <TrendingUp className="h-4 w-4 text-blue-600" />
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Growth Areas
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {growth_areas.slice(0, isExpanded ? undefined : 3).map((area, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border-blue-200 dark:border-blue-800"
                >
                  {area}
                </Badge>
              ))}
              {!isExpanded && growth_areas.length > 3 && (
                <Badge variant="secondary" className="text-muted-foreground">
                  +{growth_areas.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Expand/collapse button */}
        {(key_matches.length > 3 || growth_areas.length > 3) && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full text-muted-foreground"
          >
            {isExpanded ? (
              <>
                Show less <ChevronUp className="ml-1 h-4 w-4" />
              </>
            ) : (
              <>
                Show more <ChevronDown className="ml-1 h-4 w-4" />
              </>
            )}
          </Button>
        )}

        {/* Select button */}
        <Button
          onClick={onSelect}
          disabled={disabled}
          className={cn(
            'w-full h-11 text-base font-semibold transition-all',
            isSelected
              ? 'bg-cyan-600 hover:bg-cyan-700 text-white'
              : 'bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-slate-200 dark:text-slate-900'
          )}
        >
          {isSelected ? 'Selected ✓' : 'Choose This Career Path'}
        </Button>
      </CardContent>
    </Card>
  );
}

