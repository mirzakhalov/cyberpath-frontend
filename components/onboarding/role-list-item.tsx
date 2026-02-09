'use client';

import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import type { JobExploreItemWithSkills } from '@/types';

// ── Readiness tier helpers (shared) ──────────────────────────────────
export type ReadinessTier = 'ready' | 'short' | 'growth';

export function getReadinessTier(job: JobExploreItemWithSkills): ReadinessTier {
  if (job.skills_need_count <= 2) return 'ready';
  if (job.skills_need_count <= 10) return 'short';
  return 'growth';
}

const TIER_CONFIG: Record<
  ReadinessTier,
  { label: string; className: string }
> = {
  ready: {
    label: 'Ready Now',
    className:
      'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-300 dark:border-emerald-800',
  },
  short: {
    label: 'Short Path',
    className:
      'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/40 dark:text-amber-300 dark:border-amber-800',
  },
  growth: {
    label: 'Growth Goal',
    className:
      'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/40 dark:text-blue-300 dark:border-blue-800',
  },
};

export function ReadinessTierBadge({ tier }: { tier: ReadinessTier }) {
  const c = TIER_CONFIG[tier];
  return (
    <Badge
      variant="outline"
      className={cn('text-[10px] px-1.5 py-0 font-semibold shrink-0', c.className)}
    >
      {c.label}
    </Badge>
  );
}

// ── Salary formatter ──────────────────────────────────────────────────
export function formatCompactSalary(amount?: number): string {
  if (!amount) return '';
  if (amount >= 1000) return `$${Math.round(amount / 1000)}k`;
  return `$${amount}`;
}

export function normalizeScore(score: number): number {
  return score <= 1 ? score : score / 100;
}

// ── Component ─────────────────────────────────────────────────────────
interface RoleListItemProps {
  job: JobExploreItemWithSkills;
  isSelected: boolean;
  isCompared: boolean;
  onClick: () => void;
  onToggleCompare: () => void;
}

export function RoleListItem({
  job,
  isSelected,
  isCompared,
  onClick,
  onToggleCompare,
}: RoleListItemProps) {
  const tier = getReadinessTier(job);
  const matchPct = Math.round(normalizeScore(job.combined_score) * 100);
  const salaryMin = formatCompactSalary(job.salary_min);
  const salaryMax = formatCompactSalary(job.salary_max);
  const salaryRange = salaryMin && salaryMax ? `${salaryMin}–${salaryMax}` : '';

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      className={cn(
        'w-full text-left rounded-lg border p-3 transition-colors cursor-pointer',
        isSelected
          ? 'border-orange-500 bg-orange-50/50 dark:bg-orange-950/20 shadow-sm'
          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 hover:bg-slate-50/50 dark:hover:bg-slate-900/30'
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          {/* Row 1: readiness badge */}
          <div className="mb-1">
            <ReadinessTierBadge tier={tier} />
          </div>
          {/* Row 2: title */}
          <h4 className="text-sm font-semibold text-foreground leading-tight mb-1">
            {job.title}
          </h4>

          {/* Row 2: stats */}
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="font-medium text-foreground">{matchPct}% match</span>
            {salaryRange && <span>{salaryRange}</span>}
            <span>
              {job.skills_have_count}/{job.total_skills} skills
            </span>
          </div>
        </div>

        {/* Compare checkbox */}
        <div
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') e.stopPropagation();
          }}
          className="pt-1"
        >
          <Checkbox
            checked={isCompared}
            onCheckedChange={() => onToggleCompare()}
            aria-label={`Compare ${job.title}`}
          />
        </div>
      </div>
    </div>
  );
}

// ── Skeleton ──────────────────────────────────────────────────────────
export function RoleListItemSkeleton() {
  return (
    <div className="w-full rounded-lg border border-slate-200 dark:border-slate-800 p-3">
      <div className="flex items-center gap-2 mb-2">
        <div className="h-4 w-16 bg-muted animate-pulse rounded-full" />
        <div className="h-4 w-40 bg-muted animate-pulse rounded" />
      </div>
      <div className="flex items-center gap-3">
        <div className="h-3 w-16 bg-muted animate-pulse rounded" />
        <div className="h-3 w-20 bg-muted animate-pulse rounded" />
        <div className="h-3 w-14 bg-muted animate-pulse rounded" />
      </div>
    </div>
  );
}
