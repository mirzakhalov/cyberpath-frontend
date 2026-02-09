'use client';

import { cn } from '@/lib/utils';
import type { JobExploreItemWithSkills } from '@/types';

export type QuickFilterId = 'best-match' | 'low-gap' | 'high-coverage';

const quickFilters: Array<{ id: QuickFilterId; label: string; helper: string }> = [
  { id: 'best-match', label: 'Best Match', helper: '80%+ overall' },
  { id: 'low-gap', label: 'Ready Now', helper: '2 or fewer gaps' },
  { id: 'high-coverage', label: 'High Coverage', helper: '80% skills covered' },
];

interface ExploreFilterChipsProps {
  jobs: JobExploreItemWithSkills[];
  activeDomain: string | null;
  activeQuickFilter: QuickFilterId | null;
  onDomainChange: (domain: string | null) => void;
  onQuickFilterChange: (filter: QuickFilterId | null) => void;
}

export function ExploreFilterChips({
  jobs,
  activeDomain,
  activeQuickFilter,
  onDomainChange,
  onQuickFilterChange,
}: ExploreFilterChipsProps) {
  const domains = Array.from(
    new Set(jobs.map((job) => job.career_domain?.name).filter(Boolean))
  ) as string[];

  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
          Explore by focus
        </p>
        <div className="flex flex-wrap gap-2">
          {quickFilters.map((filter) => {
            const isActive = activeQuickFilter === filter.id;
            return (
              <button
                key={filter.id}
                type="button"
                onClick={() => onQuickFilterChange(isActive ? null : filter.id)}
                className={cn(
                  'inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold transition-all',
                  isActive
                    ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:text-slate-900 dark:bg-slate-950 dark:text-slate-200 dark:border-slate-800'
                )}
              >
                {filter.label}
                <span className={cn('text-[10px] font-normal', isActive ? 'text-white/70' : 'text-muted-foreground')}>
                  {filter.helper}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {domains.length > 0 && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
            Career domains
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => onDomainChange(null)}
              className={cn(
                'inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold transition-all',
                !activeDomain
                  ? 'bg-orange-600 text-white border-orange-600 shadow-sm'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:text-slate-900 dark:bg-slate-950 dark:text-slate-200 dark:border-slate-800'
              )}
            >
              All Domains
            </button>
            {domains.map((domain) => {
              const isActive = activeDomain === domain;
              return (
                <button
                  key={domain}
                  type="button"
                  onClick={() => onDomainChange(isActive ? null : domain)}
                  className={cn(
                    'inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold transition-all',
                    isActive
                      ? 'bg-orange-600 text-white border-orange-600 shadow-sm'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:text-slate-900 dark:bg-slate-950 dark:text-slate-200 dark:border-slate-800'
                  )}
                >
                  {domain}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
